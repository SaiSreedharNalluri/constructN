import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf"

export const MapboxViewerUtils = (function () {
  let _viewerId;
  let _eventHandler;
  let _viewer;
  let _isViewerInitialized = false;

  let _map;
  let _popup;

  let _project;
  let _structure;
  let _snapshot;

  let _isPendingDataToLoad = false;
  let _isPendingLayersToLoad = false;

  let _documentURNs;
  let _selectedType;
  let _tm;
  let _globalOffset;
  let _manifestNode;
  let _model;
  let _isModelLoaded = false;

  let _realityPositionMap = {};
  let _issuesList = [];
  let _tasksList = [];
  let _showLayersList = [];
  let _showTag = {};

  let _context;

  let _dataVizExtn;
  let _bimWalkExtn;
  let _dataVizUtils;
  let _isAddTagActive = false;

  const isCompareView = () => {
    if (_viewerId.split('_')[1] === '1') {
      return false;
    } else {
      return true;
    }
  };

  const isViewerInitialized = () => {
    return _isViewerInitialized;
  };

  const isModelLoaded = () => {
    return _isModelLoaded;
  };

  const setType = (type) => {
    _selectedType = type;
  };

  const getAvailableType = () => {
    if (isCompareView()) {
      _selectedType = 'BIM';
    }

    if (_selectedType in _documentURNs) {
      return _selectedType;
    }

    if ('Plan Drawings' in _documentURNs) {
      return 'Plan Drawings';
    } else if ('BIM' in _documentURNs) {
      return 'BIM';
    }
  };

  const initializeOptions = {
    env: 'AutodeskProduction2', //Local, AutodeskProduction, AutodeskProduction2
    api: 'streamingV2', // for models uploaded to EMEA change this option to 'derivativeV2_EU'
    getAccessToken: async function (onSuccess) {
      const response = await autodeskAuth();
      console.log('Autodesk auth token:', response.data.result);
      const res = response.data.result;

      onSuccess(res.access_token, res.expires_in);
    },
  };

  const viewerConfig = {
    extensions: ['Autodesk.BimWalk', 'Autodesk.DataVisualization'],
  };

  const initializeViewer = (viewerId, options, eventHandler) => {
    _viewerId = viewerId;
    _eventHandler = eventHandler;
    console.log('Inside Initializer callback', _eventHandler);
    mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_Map_Token}`;
    _map = new mapboxgl.Map({
      container: viewerId, // container ID
      style: 'mapbox://styles/mapbox/satellite-v9', // style URL
      center: options ? options.center : [73.913334, 18.533937], // starting position [lng, lat]
      zoom: 16 // starting zoom
    });
    _map.on("load", () => {
      _isViewerInitialized = true;
    })
  };

  const setProject = (project) => {
    _project = project;
  }

  const setStructure = (structure) => {
    _structure = structure;
  }

  const setSnapshot = (snapshot) => {
    _snapshot = snapshot;
  }


  const updateData = (models) => {
    console.log('Inside update data: ', models);

    if (_isViewerInitialized) {
      loadData(models);
    } else {
      // initializeViewer();
    }
  };

  const updateLayersData = (layers, context) => {
    console.log('Inside update layers data: ', layers, context);
    if (context) {
      _context = context;
    } else {
      _context = null;
    }
    _realityPositionMap = layers;
    _isPendingLayersToLoad = true;
    if (loadLayersOnDataLoadCompletion()) {
      // loadLayers(layers);
      // loadIssues();
      // loadTasks();
    }
  };

  const updateIssuesData = (list) => {
    console.log('Inside update issues data: ', list);
    _issuesList = list;
    _isPendingLayersToLoad = true;
    if (loadLayersOnDataLoadCompletion()) {
      // loadIssues();
    }
  };

  const updateTasksData = (list) => {
    console.log('Inside update tasks data: ', list);
    _tasksList = list;
    _isPendingLayersToLoad = true;
    if (loadLayersOnDataLoadCompletion()) {
      // loadTasks();
    }
  };

  const updateProgressData = (progress) => {
    _progressData = progress;
  };

  const refreshData = () => {
    _isPendingDataToLoad = true;
    _isPendingLayersToLoad = true;
    loadData();
  };

  const loadLayersOnDataLoadCompletion = () => {
    return _isViewerInitialized;
  };

  const generateModelOptions = (tm, manifestNode) => {
    // console.log("Inside modeloptions:", tm);
    // console.log("Inside modeloptions, isModel 2D: ", manifestNode.is2D());

    const modelOptions = {
      applyScaling: 'm',
      // preserveView: true,
      // modelSpace: true,
      // keepCurrentModels: true,
    };

    if (manifestNode.is2D()) {
      let leafletOptions = {
        fitPaperSize: true,
        isPdf: true,
      };

      modelOptions.page = 1;
      modelOptions.leafletOptions = leafletOptions;
    }

    modelOptions.globalOffset = { x: 0, y: 0, z: 0 };
    let globalOff = [0, 0, 0];

    _tm = [];
    _globalOffset = globalOff;
    if (tm && tm.tm) {
      _tm = tm.tm;
      modelOptions.placementTransform = new THREE.Matrix4()
        .fromArray(tm.tm)
        .transpose();
      // console.log('BIM TM Loaded', tm);
    }

    if (tm && tm.offset) {
      globalOff = tm.offset;
      modelOptions.globalOffset = {
        x: globalOff[0],
        y: globalOff[1],
        z: globalOff[2],
      };
      _globalOffset = tm.offset;
      if (_manifestNode.is2D()) {
        _globalOffset[0] = 0;
        _globalOffset[1] = 0;
      }
      // console.log("Offset Loaded", offset);
    }
    return modelOptions;
  };

  const loadData = (data) => {
    let realities = _snapshot.reality.map(r => r._id);
    let layersString = JSON.stringify(data);
    layersString = layersString.split('{{PROJECT_ID}}').join(_project._id);
    layersString = layersString.split('{{STRUCTURE_ID}}').join(_structure._id);
    layersString = layersString.split('{{SNAPSHOT_ID}}').join(_snapshot._id);
    layersString = layersString.split('{{REALITY_ID}}').join(realities[0]);
    let layers = JSON.parse(layersString);
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].layer) {
        _map.addLayer(layers[i].layer, layers[i].layer.before);
        if (layers[i].layer.id == "progress") {
          _map.on('click', layers[i].layer.id, (e) => {
            onLayerClick(e.features[0]);
          });
        }
      }
    }
  };

  const onLayerClick = (e) => {
    let coordinates = e.geometry.type === 'Polygon' ? getCentreOfFeatureCollection(e) : e.geometry.coordinates;
    _map.flyTo({
      center: coordinates,
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
    if (!_popup) {
      _popup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat(coordinates)
        .setHTML(e.properties.htmlInfo ? e.properties.htmlInfo : getHtmlInfo(e))
        .addTo(_map);
    } else {
      _popup.setLngLat(coordinates)
        .setHTML(e.properties.htmlInfo ? e.properties.htmlInfo : getHtmlInfo(e))
        .addTo(_map);
    }
  }

  const getCentreOfFeatureCollection = (collection) => {
    let center;
    center = turf.center(collection);
    return center.geometry.coordinates;
  }

  const getHtmlInfo = (e) => {
    let html = '<div style="display:flex;flex-direction: column;">';
    let total = e.properties.length;
    let row_clearing = e.properties.row_clearing;
    let excavation = e.properties.excavation;
    let stringing = e.properties.stringing;
    let pipe_laying = e.properties.pipe_laying;
    let back_filling = e.properties.back_filling;
    let ofc_cabling = e.properties.ofc_cabling;
    let mat_laying = e.properties.mat_laying;
    let progress = (row_clearing + stringing + excavation + pipe_laying + ofc_cabling + mat_laying + back_filling) * 100 / (7 * total);
    let current_stage = e.properties.stage;
    // current_stage = current_stage.charAt(0).toUpperCase() + current_stage.slice(1);
    html += '<div style="font-weight:600;border-bottom: 1px solid #aaa;margin-bottom: 0.5em;">' + e.properties.name + '</div>';
    html += '<div style="display:flex; padding:0 0.5em; background:rgba(0,255,200,0.5)"><div style="flex: 1";>' + 'Progress' + ': </div><strong style="margin-left: 1em;">' + progress.toFixed(0) + '%</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Total length' + ': </div><strong style="margin-left: 1em;">' + e.properties.length.toFixed(2) + ' mts.</strong></div>';
    // html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Current Stage' + ': </div><strong style="margin-left: 1em; text-transform: capitalize;">' + current_stage + '</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Row Clearing' + ': </div><strong style="margin-left: 1em;">' + e.properties.row_clearing.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Stringing' + ': </div><strong style="margin-left: 1em;">' + stringing.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Excavation' + ': </div><strong style="margin-left: 1em;">' + e.properties.excavation.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Pipe Laying' + ': </div><strong style="margin-left: 1em;">' + e.properties.pipe_laying.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'OFC Cabling' + ': </div><strong style="margin-left: 1em;">' + ofc_cabling.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Mat Laying' + ': </div><strong style="margin-left: 1em;">' + mat_laying.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Back Filling' + ': </div><strong style="margin-left: 1em;">' + e.properties.back_filling.toFixed(2) + ' mts.</strong></div>';
    // for (const [key, value] of Object.entries(e.properties)) {
    //   html += '<div style="display:flex;"><div style="flex: 1";>' + key + ': </div><strong style="margin-left: 1em;">' + value + '</strong></div>';
    // }
    html += '</div>';
    return html;
  }

  const loadIssues = () => {
    _dataVizUtils.addIssuesData(_issuesList);
    _dataVizUtils.refreshViewableData();
    _isPendingLayersToLoad = false;
  };

  const loadTasks = () => {
    _dataVizUtils.addTasksData(_tasksList);
    _dataVizUtils.refreshViewableData();
    _isPendingLayersToLoad = false;
  };

  const showLayers = (layersList) => {
    _isPendingLayersToLoad = true;
    _showLayersList = layersList;
    if (loadLayersOnDataLoadCompletion()) {
      _dataVizUtils.setViewableState(_showLayersList);
      _dataVizUtils.refreshViewableData();
      _isPendingLayersToLoad = false;
    }
  };

  const showTag = (tag, show) => {
    _isPendingLayersToLoad = true;
    _showTag[tag] = show;
    if (_dataVizUtils) {
      if (loadLayersOnDataLoadCompletion()) {
        _dataVizUtils.setTagState(_showTag);
        _dataVizUtils.refreshViewableData();
        _isPendingLayersToLoad = false;
      }
    }
  };

  const activateTool = (type) => {
    if (_dataVizUtils) {
      _dataVizUtils.activateCreateTagTool(type);
      return true;
    }
    return false;
  };

  const deactivateTool = () => {
    if (_dataVizUtils) {
      _dataVizUtils.deactivateCreateTagTool();
      return true;
    }
    return false;
  };

  const initiateAddTag = (type) => {
    _isAddTagActive = activateTool(type);
  };

  const cancelAddTag = () => {
    if (_dataVizUtils) {
      _dataVizUtils.refreshViewableData();
    }
  };

  const selectTag = (tag) => {
    if (_dataVizUtils) {
      _dataVizUtils.selectTag(tag);
    }
  };

  const onDataVizHandler = (event, targetObject) => {
    const result = _viewer.clientToWorld(
      event.originalEvent.clientX,
      event.originalEvent.clientY
    );
    switch (event.type) {
      case 'DATAVIZ_OBJECT_HOVERING':
        break;
      case 'DATAVIZ_OBJECT_CLICK':
        console.log(
          'Selected Image at ',
          result ? result.point : 'Outside canvas',
          targetObject
        );
        let contextObject;
        if (_isAddTagActive) {
          _isAddTagActive = deactivateTool();
          let tagObject = {
            tagPosition: targetObject.position,
          };
          contextObject = {
            id: targetObject.id,
            type: targetObject.type,
            cameraObject: getCamera(),
            tag: tagObject,
          };
        } else {
          console.log(`Inside Rag Click click: ${targetObject.position.x}`);
          if (targetObject.type === "Issue") {
            let clickedIssue = _issuesList.find(issue => issue._id === targetObject.id)
            contextObject = structuredClone(clickedIssue.context);
            contextObject.id = clickedIssue._id;
          } else if (targetObject.type === "Task") {
            let clickedTask = _tasksList.find(task => task._id === targetObject.id)
            contextObject = clickedTask.context;
            contextObject = clickedTask._id;
          }
          else {
            let imageObject = {
              imagePosition: targetObject.position,
              imageRotation: targetObject.rotation,
              imageName: targetObject.id,
            };
            contextObject = {
              id: targetObject.id,
              type: targetObject.type,
              cameraObject: getCamera(),
              image: imageObject,
            };
          }

        }
        _eventHandler(_viewerId, Object.freeze(contextObject));

        break;
    }
  };

  const updateContext = (context, sendContext) => {
    // console.log("Updating context for forge: ", context);
    if (context) {
      _context = getContextLocalFromGlobal(context, _globalOffset);
    } else {
      _context = null;
      return;
    }
    handleContext(_context);
    _context = null;
  };

  const handleContext = (context) => {
    switch (context.type) {
      case '3d':
        setNavigation(context);
        setForgeControls(context.type);
        break;
      case 'image':
      case 'panorama':
        setNavigation(context);
        setForgeControls(context.type);
        break;
      case '360 Video':
        // goToImageContext(context);
        break;
      case 'tag':
        // goToTagContext(context.tag);
        break;
    }
  };

  const getContext = () => {
    // console.log("Inside forge get context: ", globalOffset);
    let contextObject;
    if (_isViewerInitialized && _isModelLoaded) {
      contextObject = {
        id: new Date().getTime(),
        type: _manifestNode.is2D() ? '2d' : '3d',
        cameraObject: getCamera(),
      };
      // console.log("Inside final get context forge", contextObject);
    }
    return contextObject;
  };

  const getCamera = () => {
    // console.log("Inside forge get camera: ", globalOffset);
    const state = _viewer.getState({ viewport: true }).viewport;
    let offset = _globalOffset;
    const cameraPosition = {
      x: state.eye[0] + offset[0],
      y: state.eye[1] + offset[1],
      z: state.eye[2] + offset[2],
    };

    const cameraTarget = {
      x: state.target[0] + offset[0],
      y: state.target[1] + offset[1],
      z: state.target[2] + offset[2],
    };
    return { cameraPosition, cameraTarget };
  };

  const getViewerState = () => {
    if (_isModelLoaded) {
      _viewer.navigation.setCameraUpVector(
        new THREE.Vector3().fromArray([0, 0, 1])
      );
      const state = _viewer.getState({ viewport: true }).viewport;
      let viewerState = {
        position: [state.eye[0], state.eye[1], state.eye[2]],
        target: new THREE.Vector3().fromArray(state.target),
        fov: state.fieldOfView,
      };
      // console.log("Inside Forge get ViewerState: ", viewerState, state)
      return viewerState;
    }
  };

  const updateViewerState = (viewerState) => {
    if (_isModelLoaded && viewerState) {
      // console.log("Inside update viewer state: ", viewerId, viewerState);
      let position = new THREE.Vector3().fromArray(viewerState.position);
      _viewer.navigation.setPosition(position);
      _viewer.navigation.setTarget(viewerState.target);
      if (viewerState.fov) {
        _viewer.navigation.setVerticalFov(viewerState.fov, false);
      }
    }
  };

  const setNavigation = (context) => {
    let camera = context.cameraObject;
    if (camera && !_manifestNode.is2D()) {
      console.log('Inside navigation: ', camera);
      _viewer.navigation.setPosition(camera.cameraPosition);
      _viewer.navigation.setTarget(camera.cameraTarget);
      _viewer.navigation.setVerticalFov(camera.fov, false);
    }
  };

  const setPivotPoint = () => {
    if (!_manifestNode.is2D() && _isModelLoaded) {
      let fuzzy_box = _viewer.model.getFuzzyBox();
      let fuzzy_min = fuzzy_box['min'];
      let fuzzy_max = fuzzy_box['max'];
      let fuzzy_center = new THREE.Vector3(
        (fuzzy_min['x'] + fuzzy_max['x']) / 2,
        (fuzzy_min['y'] + fuzzy_max['y']) / 2,
        (fuzzy_min['z'] + fuzzy_max['z']) / 2
      );
      _viewer.navigation.setPivotPoint(fuzzy_center);
    }
  };

  const setForgeControls = (type) => {
    if (_bimWalkExtn) {
      if ((type === 'panorama' || type === 'image')) {
        _viewer.navigation.setIsLocked(false);
        if (isCompareView() && type === 'panorama') {
          _viewer.navigation.setLockSettings({
            orbit: false,
            pan: false,
            zoom: false,
            roll: false,
            fov: true,
          });
          _viewer.navigation.setIsLocked(true);
        }

        if (_viewer.getExtension('Autodesk.BimWalk')) {
          _viewer.getExtension('Autodesk.BimWalk').activate();
        }
      } else {
        _viewer.navigation.setIsLocked(false);
        if (_viewer.getExtension('Autodesk.BimWalk')) {
          _viewer.getExtension('Autodesk.BimWalk').deactivate();
        }
      }
    }
  };

  const loadExtension = async () => {
    _bimWalkExtn = await _viewer.loadExtension('Autodesk.BimWalk');

    _dataVizExtn = await _viewer.loadExtension('Autodesk.DataVisualization');
  };

  const onViewerInitialized = () => {
    console.log('Viewer Initialized: Loading Model now');
    _isViewerInitialized = true;
    loadExtension();
    if (_isPendingDataToLoad) {
      loadData();
    }
  };

  const onViewerUnInitialized = () => { };

  const modelLoadProgress = (percent, state, model) => {
    if (!_isModelLoaded && percent == 100) {
      console.log('Inside model load progress: ', percent, state, model);
      _isModelLoaded = true;
    }
  };

  const onModelLayersLoadedEvent = (parameter) => {
    // console.log("Inside Model Layers loaded Event: model: ",parameter);
    if (_context) {
      updateContext(_context, false);
    }

    // loadExtension();
    _isPendingDataToLoad = false;
    _isModelLoaded = true;
    if (loadLayersOnDataLoadCompletion()) {
      loadLayers();
    }
  };

  const onGeometryLoadedEvent = (parameter) => {
    // console.log("Inside Geometry Loaded Event: model: ", parameter.model);
    _isModelLoaded = true;
  };

  const onModelUnLoadedEvent = (model) => {
    // console.log("Inside Model Unload event", model);
    _isModelLoaded = false;
  };

  const onExtensionLoadedEvent = (parameter) => {
    // console.log("Inside Extension Loaded Event:", parameter);
    if (parameter.extensionId === ForgeDataVisualization.EXTENSION_ID) {
      console.log(
        'Inside Extension Loaded Event: Data Visualization',
        parameter
      );
      _dataVizExtn = _viewer.getExtension(parameter.extensionId);

      _dataVizUtils = new ForgeDataVisualization(_viewer, _dataVizExtn);
      _dataVizUtils.setHandler(onDataVizHandler.bind(this));
      if (loadLayersOnDataLoadCompletion()) {
        loadLayers();
      }
    } else if (parameter.extensionId === 'Autodesk.BimWalk') {
      console.log('Inside Forge Viewer, Bim Walk loaded:');
      _bimWalkExtn = _viewer.getExtension(parameter.extensionId);
    }
  };

  const onMouseEnter = () => {
    // console.log("Inside mouse eneter event forge: ", _viewerId);
    _eventHandler(_viewerId, { type: 'mouse' });
  };

  const onCameraChangeEvent = (event) => {
    // console.log("On Camera change event: ", event, typeof(_eventHandler), _viewer);
    _eventHandler(_viewerId, { type: 'sync' });
  };

  const setUpEventListeners = () => {
    _viewer.addEventListener(
      Autodesk.Viewing.VIEWER_INITIALIZED,
      onViewerInitialized
    );
    _viewer.addEventListener(
      Autodesk.Viewing.VIEWER_UNINITIALIZED,
      onViewerUnInitialized
    );
    _viewer.addEventListener(
      Autodesk.Viewing.PROGRESS_UPDATE_EVENT,
      modelLoadProgress
    );
    _viewer.addEventListener(
      Autodesk.Viewing.MODEL_LAYERS_LOADED_EVENT,
      onModelLayersLoadedEvent
    );
    _viewer.addEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      onGeometryLoadedEvent
    );
    _viewer.addEventListener(
      Autodesk.Viewing.MODEL_UNLOADED_EVENT,
      onModelUnLoadedEvent
    );
    _viewer.addEventListener(
      Autodesk.Viewing.EXTENSION_LOADED_EVENT,
      onExtensionLoadedEvent
    );
    _viewer.addEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      onCameraChangeEvent
    );

    let viewerElement = document.getElementById(_viewerId);
    if (viewerElement) {
      viewerElement.addEventListener('mouseenter', onMouseEnter);
    }
  };

  const removeEventListeners = () => {
    _viewer.removeEventListener(
      Autodesk.Viewing.VIEWER_INITIALIZED,
      onViewerInitialized
    );
    _viewer.removeEventListener(
      Autodesk.Viewing.VIEWER_UNINITIALIZED,
      onViewerUnInitialized
    );
    _viewer.removeEventListener(
      Autodesk.Viewing.PROGRESS_UPDATE_EVENT,
      modelLoadProgress
    );
    _viewer.removeEventListener(
      Autodesk.Viewing.MODEL_LAYERS_LOADED_EVENT,
      onModelLayersLoadedEvent
    );
    _viewer.removeEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      onGeometryLoadedEvent
    );
    _viewer.removeEventListener(
      Autodesk.Viewing.MODEL_UNLOADED_EVENT,
      onModelUnLoadedEvent
    );
    _viewer.removeEventListener(
      Autodesk.Viewing.EXTENSION_LOADED_EVENT,
      onExtensionLoadedEvent
    );
    _viewer.removeEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      onCameraChangeEvent
    );

    let viewerElement = document.getElementById(_viewerId);
    if (viewerElement) {
      viewerElement.removeEventListener('mouseenter', onMouseEnter);
    }
  };

  const removeData = () => {
    // console.log("Model Before Removed: ", this.model);
    if (_isViewerInitialized) {
      removeLayers();
      _viewer.unloadModel(_model);
    }
  };

  const removeLayers = () => {
    console.log('Inside remove layers in forgeWrapper: ', _dataVizUtils);
    if (_dataVizUtils) {
      _dataVizUtils.removeExistingVisualizationData();
    }
  };

  const shutdown = () => {
    if (_isViewerInitialized) {
      removeData();
      removeEventListeners();
      _viewer.tearDown();
      _viewer.uninitialize();
      _dataVizExtn = undefined;
      _dataVizUtils = undefined;
      Autodesk.Viewing.shutdown();
    }
    _isViewerInitialized = false;
  };

  return {
    initializeViewer: initializeViewer,
    setType: setType,
    setProject: setProject,
    setStructure: setStructure,
    setSnapshot: setSnapshot,
    isViewerInitialized, isViewerInitialized,
    updateData: updateData,
    updateLayersData: updateLayersData,
    updateIssuesData: updateIssuesData,
    updateTasksData: updateTasksData,
    refreshData: refreshData,
    showLayers: showLayers,
    initiateAddTag: initiateAddTag,
    cancelAddTag: cancelAddTag,
    selectTag: selectTag,
    showTag: showTag,
    getContext: getContext,
    getViewerState: getViewerState,
    updateViewerState: updateViewerState,
    updateContext: updateContext,
    removeData: removeData,
    removeLayers: removeLayers,
    shutdown: shutdown,
  };
})();

const getContextLocalFromGlobal = (context, globalOffset) => {
  // console.log("Global offset: ", context);
  let offset = globalOffset;
  if (context.image && context.image.imagePosition) {
    // console.log("Context has image: ", context.image);
    let pos = context.image.imagePosition;
    context.image.imagePosition = {
      x: pos.x - offset[0],
      y: pos.y - offset[1],
      z: pos.z - offset[2],
    };
  }

  if (context.cameraObject && context.cameraObject.cameraPosition) {
    // console.log("Context has camera: ", context.cameraObject);
    let pos = context.cameraObject.cameraPosition;
    let tar = context.cameraObject.cameraTarget
      ? context.cameraObject.cameraTarget
      : context.cameraObject.cameraPosition;
    context.cameraObject.cameraPosition = {
      x: pos.x - offset[0],
      y: pos.y - offset[1],
      z: pos.z - offset[2],
    };
    context.cameraObject.cameraTarget = {
      x: tar.x - offset[0],
      y: tar.y - offset[1],
      z: tar.z - offset[2],
    };
  }

  if (context.tag && context.tag.tagPosition) {
    // console.log("Context has tag: ", context.tag);
    let pos = context.tag.tagPosition;
    context.tag.tagPosition = {
      x: pos.x - offset[0],
      y: pos.y - offset[1],
      z: pos.z - offset[2],
    };
  }

  return context;
};