import { MinimapDataVisualization } from "./MinimapDataVisualizationUtils";
import { ForgeLayerUtils } from "./ForgeLayerUtils";
import { ForgeDataVizUtils } from "./ForgeDataVizUtils";
import {
  applyOffset,
  removeOffset,
  applyTMInverse,
  applyTM

} from './ViewerDataUtils';
import { ForgeDataVisualization } from "./ForgeDataVisualizationUtils";

export class ForgeMinimapInstance {

  constructor(viewerId) {
    // console.log("Inside Potree Initializer: ")
    let viewerConfig = {
      extensions: ["Autodesk.BimWalk", "Autodesk.DataVisualization", "Autodesk.Edit2D"],
    };
    let htmlDiv = document.getElementById(viewerId);
    this.viewer = new Autodesk.Viewing.Viewer3D(htmlDiv, viewerConfig);
    this.newInstance = true;
  }

  static getInstance(viewerId) {
      if (!this.instance) {
          this.instance = new ForgeMinimapInstance(viewerId);
          delete this.instance.constructor;
      } else {
        let child = document.getElementById(viewerId);
        console.log("ForgeMinimapInstanceTest inside getInstance: ", child);
        
        let parent = child.parentElement;
        parent.removeChild(document.getElementById(viewerId));
        parent.appendChild(this.instance.viewer.clientContainer);
        // parent.insertBefore(this.instance.viewer.clientContainer, parent.firstChild);
        this.instance.newInstance = false;
      }
      console.log("ForgeMinimapInstanceTest inside getInstance: ", this.instance);
      return this.instance;
  }

  static getCompareInstance(viewerId) {
      if (!this.compareInstance) {
          this.compareInstance = new ForgeMinimapInstance(viewerId);
          delete this.compareInstance.constructor;
      } else {
          let child = document.getElementById(viewerId);
          console.log("ForgeMinimapInstanceTest inside getCompareInstance: ", child);
          let parent = child.parentElement;
          parent.removeChild(document.getElementById(viewerId));
          parent.appendChild(this.compareInstance.viewer.clientContainer);
          // parent.insertBefore(this.compareInstance.viewer.clientContainer, parent.firstChild);
          this.compareInstance.newInstance = false;
      }
      return this.compareInstance;
  }
}

export const MinimapUtils = () => {
  let _instance;
  let _viewerId;
  let _eventHandler;
  let _viewer;
  let _isViewerInitialized = false;

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
  let _showLayersList
  let _showTag = {};

  let _context;
  let _navPosition = [0, 0, 0];
  let _navRotation;

  let _dataVizExtn;
  let _dataVizUtils;

  const isCompareView = () => {
    if (_viewerId.split("-")[1] === "1") {
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
      _selectedType = "BIM";
    }

    if (_selectedType in _documentURNs) {
      return _selectedType;
    }

    if ("Plan Drawings" in _documentURNs) {
      return "Plan Drawings";
    } else if ("BIM" in _documentURNs) {
      return "BIM";
    }
  };

  const viewerConfig = {
    extensions: ["Autodesk.BimWalk", "Autodesk.DataVisualization", "Autodesk.Edit2D"],
  };

  const setupViewer = (viewerId, eventHandler) => {
    _viewerId = viewerId;
    _eventHandler = eventHandler;
  }

  const initializeViewer = () => {
    console.log("ForgeMinimapInstanceTest Inside Initializer callback: ", );

    if (isCompareView()) {
      _instance = ForgeMinimapInstance.getCompareInstance(_viewerId);
      _viewer = _instance.viewer;
    } else {
      _instance = ForgeMinimapInstance.getInstance(_viewerId);
      _viewer = _instance.viewer;
    }

    setUpEventListeners();

    let startedCode = _viewer.start();
    _viewer.canvasId = _viewerId;

    if (startedCode > 0) {
      console.error("ForgeMinimapInstanceTest Failed to create a Viewer: WebGL not supported.");
      return;
    } else {
      console.log("ForgeMinimapInstanceTest inside startCode check: ", _instance.newInstance);
      if (!_instance.newInstance) {
        onViewerInitialized();
      }
    }

    _viewer.navigation.setWorldUpVector(
      new THREE.Vector3().fromArray([0, 0, 1]),
      false
    );
    _viewer.navigation.setReverseZoomDirection(true);

    _viewer.disableHighlight(true)
    _viewer.disableHighlight(true)
    if (_isViewerInitialized) {
      loadData();
    }
  }

  const initializeViewer2 = () => {
    // if(_viewer) return
    console.log("Inside minimap Initializer callback", _eventHandler);
    let htmlDiv = document.getElementById(_viewerId);
    _viewer = new Autodesk.Viewing.Viewer3D(htmlDiv, viewerConfig);
    setUpEventListeners();
    let startedCode = _viewer.start();
    _viewer.canvasId = _viewerId;
    if (startedCode > 0) {
      console.error("Failed to create a Viewer: WebGL not supported.", 'test');
      return;
    }

    _viewer.navigation.setWorldUpVector(
      new THREE.Vector3().fromArray([0, 0, 1]),
      false
    );
    _viewer.navigation.setReverseZoomDirection(true);

    _viewer.disableHighlight(true)
    if (_isViewerInitialized) {
      loadData();
    }
  };

  const setStructure = (structure) => {
    _structure = structure;
  };

  const setSnapshot = (snapshot) => {
    _snapshot = snapshot;
  };

  const updateData = (documentURNs) => {
    console.log("Inside minimap update data: ", documentURNs, _isViewerInitialized);
    _documentURNs = documentURNs;
    _isPendingDataToLoad = true;
    if (_isViewerInitialized) {
      loadData();
    } else {
      // initializeViewer();
    }
  };

  const updateLayersData = (realityPositionMap, context) => {
    console.log("Inside minimap update layers data: ", realityPositionMap, context);
    if (context) {
      _context = context;
    } else {
      _context = null;
    }
    _realityPositionMap = realityPositionMap;
    _isPendingLayersToLoad = true;
    if (loadLayersOnDataLoadCompletion()) {
      loadLayers();
      // loadIssues();
      // loadTasks();
    }
  };

  const updateIssuesData = (list) => {
    console.log("Inside update issues data: ", list);
    _issuesList = list;
    _isPendingLayersToLoad = true;
    if (loadLayersOnDataLoadCompletion()) {
      loadIssues();
    }
  };

  const updateTasksData = (list) => {
    console.log("Inside update tasks data: ", list);
    _tasksList = list;
    _isPendingLayersToLoad = true;
    if (loadLayersOnDataLoadCompletion()) {
      loadTasks();
    }
  };

  const updateProgressData = (progress) => {
    _progressData = progress;
  };

  const refreshData = () => {
    _isPendingDataToLoad = true;
    _isPendingLayersToLoad = true;
    if (_isViewerInitialized) {
      loadData();
    }
  };

  const loadLayersOnDataLoadCompletion = () => {
    if (_isPendingLayersToLoad) {
      if (_isModelLoaded && _dataVizUtils && _globalOffset) {
        return true;
      }
      return false;
    }
    return false;
  };

  const loadData = async () => {
    console.log("Inside minimap loadModel: ", _documentURNs, _isModelLoaded, _viewerId);
    // console.log("Loading new Model: ", documentURNs);
    if (_isModelLoaded) {
      removeData();
    }

    _documentURNs && _documentURNs['Plan Drawings']?.map((document) => {
      Autodesk.Viewing.Document.load(
        document.urn,
        async function (viewerDocument) {
          _manifestNode = viewerDocument.getRoot().getDefaultGeometry();
          // console.log("Is model svf2: ", manifestNode.isSVF2())
          _model = await _viewer.loadDocumentNode(
            viewerDocument,
            _manifestNode,
            generateModelOptions(document.tm, _manifestNode)
          );
        },
        function () {
          console.error("Failed fetching Forge manifest");
        }
      );
    });
  };

  const generateModelOptions = (tm, manifestNode) => {
    // console.log("Inside modeloptions:", tm);
    // console.log("Inside modeloptions, isModel 2D: ", manifestNode.is2D());

    const modelOptions = {
      applyScaling: "m",
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
      _tm = new THREE.Matrix4().fromArray(tm.tm).transpose();
      if (!_manifestNode.is2D()) {
        modelOptions.placementTransform = _tm;
      }
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

  const resize = () => {
    _viewer && _viewer.resize()
  }

  const loadLayers = () => {
    console.log("Passing data to dataViz extension minimap: ", _dataVizUtils);
    // _dataVizUtils.removeExistingVisualizationData();
    // _dataVizUtils.setIs2D(_manifestNode.is2D());
    // _dataVizUtils.setTM(_tm);
    // _dataVizUtils.setOffset(_globalOffset);
    // _dataVizUtils.addMediaData(_realityPositionMap);
    // _dataVizUtils.addIssuesData(_issuesList);
    // _dataVizUtils.addTasksData(_tasksList);
    // _dataVizUtils.setTagState(_showTag);
    // _dataVizUtils.setViewableState(_showLayersList);
    // _dataVizUtils.updateData();
    // _edit2DUtils.addMediaData(_realityPositionMap);

    _dataVizUtils.setTransform(_tm, _globalOffset)
    _dataVizUtils.loadMediaData(_realityPositionMap)
    _dataVizUtils.loadIssues(_issuesList)
    _dataVizUtils.loadTasks(_tasksList)

    _isPendingLayersToLoad = false;
  };

  const loadIssues = () => {
    // _dataVizUtils.addIssuesData(_issuesList);
    // _dataVizUtils.refreshViewableData();
    _dataVizUtils.loadIssues(_issuesList)
    _isPendingLayersToLoad = false;
  };

  const loadTasks = () => {
    // _dataVizUtils.addTasksData(_tasksList);
    // _dataVizUtils.refreshViewableData();
    _dataVizUtils.loadTasks(_tasksList)
    _isPendingLayersToLoad = false;
  };

  const showLayers = (layersList) => {
    _isPendingLayersToLoad = true;
    _showLayersList = layersList;
    if (loadLayersOnDataLoadCompletion()) {
      // _dataVizUtils.setViewableState(_showLayersList);
      // _dataVizUtils.refreshViewableData();
      _isPendingLayersToLoad = false;
    }
  };

  const createMarker = (position, yaw) => {
    if(!position) return
    if(!_isModelLoaded) return
    if(_navPosition && _navPosition[0] == position[0] && _navPosition[1] == position[1] && _navPosition[2] == position[2] && _navRotation == yaw) return;
    setTimeout(() => {
      // _dataVizUtils.createMarker(position, yaw);
      _dataVizUtils.updateNavigator(position, yaw);
      _navPosition = position
      _navRotation = yaw
    }, 10)
  }

  const showTag = (tag, show) => {
    _isPendingLayersToLoad = true;
    _showTag[tag] = show;
    if (_dataVizUtils) {
      if (loadLayersOnDataLoadCompletion()) {
        // _dataVizUtils.setTagState(_showTag);
        _dataVizUtils.showTag(tag, show)
        // _dataVizUtils.refreshViewableData();
        _isPendingLayersToLoad = false;
      }
    }
  };

  const activateTool = (type) => {
    if (_dataVizUtils) {
      // _dataVizUtils.activateCreateTagTool(type);
      return true;
    }
    return false;
  };

  const deactivateTool = () => {
    if (_dataVizUtils) {
      // _dataVizUtils.deactivateCreateTagTool();
      return true;
    }
    return false;
  };

  const initiateAddTag = (type) => {
    _isAddTagActive = activateTool(type);
  };

  const cancelAddTag = () => {
    if (_dataVizUtils) {
      // _dataVizUtils.refreshViewableData();
    }
  };

  const selectTag = (tag) => {
    if (_dataVizUtils) {
      // _dataVizUtils.selectTag(tag);
    }
  };

  const onDataVizHandler = (event, targetObject) => {
    const result = _viewer.clientToWorld(
      event.originalEvent.clientX,
      event.originalEvent.clientY
    );
    switch (event.type) {
      case "DATAVIZ_OBJECT_HOVERING":
        break;
      case "DATAVIZ_OBJECT_CLICK":
        console.log(
          "Selected Image at ",
          result ? result.point : "Outside canvas",
          targetObject
        );
        let contextObject;
        // if (_isAddTagActive) {
        //   _isAddTagActive = deactivateTool();
        //   let tagObject = {
        //     tagPosition: targetObject.position,
        //   };
        //   contextObject = {
        //     id: targetObject.id,
        //     type: targetObject.type,
        //     cameraObject: getCamera(),
        //     tag: tagObject,
        //   };
        // } else {
        console.log(`Inside Rag Click click: ${targetObject.position.x}`, _viewerId);
        if(!targetObject.id) return
        if (targetObject.id.includes("Temp")) {
          _isAddTagActive = deactivateTool();
          let tagObject = {
            tagPosition: targetObject.position,
          };
          contextObject = {
            id: targetObject.id,
            type: targetObject.type,
            // cameraObject: getCamera(),
            tag: tagObject,
          };
        } else if (targetObject.type === "Issue") {
          let clickedIssue = _issuesList.find(
            (issue) => issue._id === targetObject.id
          );
          contextObject = structuredClone(clickedIssue.context);
          contextObject.id = clickedIssue._id;
        } else if (targetObject.type === "Task") {
          let clickedTask = _tasksList.find(
            (task) => task._id === targetObject.id
          );
          contextObject = structuredClone(clickedTask.context);
          contextObject.id = clickedTask._id;
        } else {
          let imageObject = {
            imagePosition: targetObject.position,
            imageRotation: targetObject.rotation,
            imageName: targetObject.imageName,
          };
          contextObject = {
            id: targetObject.id,
            type: targetObject.type,
            cameraObject: getCamera(),
            image: imageObject,
          };
        }

        // }
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
      case "3d":
        setNavigation(context);
        setForgeControls(context.type);
        break;
      case "image":
      case "panorama":
        setNavigation(context);
        setForgeControls(context.type);
        break;
      case "360 Video":
        setNavigation(context);
        setForgeControls(context.type);
        // goToImageContext(context);
        break;
      case "tag":
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
        type: _manifestNode.is2D() ? "2d" : "3d",
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
    let eye = {
      x: state.eye[0],
      y: state.eye[1],
      z: state.eye[2],
    };
    let target = {
      x: state.target[0],
      y: state.target[1],
      z: state.target[2],
    };
    if (_manifestNode.is2D()) {
      eye = applyTM(eye, _tm);
      target = applyTM(target, _tm);
    }
    const cameraPosition = {
      x: eye.x + offset[0],
      y: eye.y + offset[1],
      z: eye.z + offset[2],
    };

    const cameraTarget = {
      x: target.x + offset[0],
      y: target.y + offset[1],
      z: target.z + offset[2],
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
    if (_isModelLoaded && !(_manifestNode && _manifestNode.is2D()) && viewerState && viewerState.position) {
      // console.log("Inside update viewer state: ", _viewerId, viewerState);
      let position = new THREE.Vector3().fromArray(viewerState.position);
      _viewer.navigation.setPosition(position);
      _viewer.navigation.setTarget(viewerState.target);
      if (viewerState.fov) {
        _viewer.navigation.setVerticalFov(viewerState.fov, false);
      }
    }
    _isModelLoaded && viewerState && viewerState.cameraObject && createMarker(viewerState.cameraObject.cameraTarget, viewerState.cameraObject.yaw)
  };

  const setNavigation = (context) => {
    let camera = context.cameraObject;
    if (camera && !_manifestNode.is2D()) {
      console.log("Inside navigation: ", camera);
      _viewer.navigation.setPosition(camera.cameraPosition);
      _viewer.navigation.setTarget(camera.cameraTarget);
      _viewer.navigation.setVerticalFov(camera.fov, false);
    }
  };

  const setPivotPoint = () => {
    if (!_manifestNode.is2D() && _isModelLoaded) {
      let fuzzy_box = _viewer.model.getFuzzyBox();
      let fuzzy_min = fuzzy_box["min"];
      let fuzzy_max = fuzzy_box["max"];
      let fuzzy_center = new THREE.Vector3(
        (fuzzy_min["x"] + fuzzy_max["x"]) / 2,
        (fuzzy_min["y"] + fuzzy_max["y"]) / 2,
        (fuzzy_min["z"] + fuzzy_max["z"]) / 2
      );
      _viewer.navigation.setPivotPoint(fuzzy_center);
    }
  };

  const setForgeControls = (type) => {
    if (_bimWalkExtn) {
      if (type !== "3d") {
        _viewer.navigation.setIsLocked(false);
        if (isCompareView() && (type === "360 Video" || type === "360 Image")) {
          _viewer.navigation.setLockSettings({
            orbit: false,
            pan: false,
            zoom: false,
            roll: false,
            fov: true,
          });
          _viewer.navigation.setIsLocked(true);
        }

        if (_viewer.getExtension("Autodesk.BimWalk")) {
          _viewer.getExtension("Autodesk.BimWalk").activate();
        }
      } else {
        _viewer.navigation.setIsLocked(false);
        if (_viewer.getExtension("Autodesk.BimWalk")) {
          _viewer.getExtension("Autodesk.BimWalk").deactivate();
        }
      }
    }
  };

  const loadExtension = async () => {
    _dataVizExtn = await _viewer.loadExtension("Autodesk.DataVisualization");
  };

  const onViewerInitialized = () => {
    console.log("Viewer Initialized minimap: Loading Model now", _isPendingDataToLoad);
    _isViewerInitialized = true;
    loadExtension();
    if (_isPendingDataToLoad) {
      loadData();
    }
  };

  const onViewerUnInitialized = () => {
    console.log("Forge Viewer UnInitialized: ");
    _isViewerInitialized = false;
  };

  const modelLoadProgress = (percent, state, model) => {
    if (!_isModelLoaded && percent == 100) {
      console.log("Inside model load progress: ", percent, state, model);
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
        "Inside Extension Loaded Event: Data Visualization",
        parameter
      );
      _dataVizExtn = _viewer.getExtension(parameter.extensionId);

      _dataVizUtils = new ForgeDataVizUtils(_viewer, _dataVizExtn, onDataVizHandler);
      // _dataVizUtils.setHandler(onDataVizHandler.bind(this));
      if (loadLayersOnDataLoadCompletion()) {
        loadLayers();
      }
    }
  };

  const onMouseEnter = () => {
    // console.log("Inside mouse eneter event forge: ", _viewerId);
    _eventHandler(_viewerId, { type: "mouse" });
  };

  const onCameraChangeEvent = (event) => {
    // console.log("On Camera change event: ", event, typeof(_eventHandler), _viewer);
    _eventHandler(_viewerId, { type: "sync" });
  };

  // const onClickEventOnContainer = (ev) => {
  //   const result = _viewer.clientToWorld(ev.clientX, ev.clientY);
  //   if (result) {
  //     console.log("Click Point", result.point);
  //     // this.eventHandler('issue',result);
  //   }
  //   return false;
  // }

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
    _viewer.addEventListener(
      Autodesk.Viewing.VIEWER_UNINITIALIZED,
      onViewerUnInitialized
    );

    let viewerElement = document.getElementById(_viewerId);
    if (viewerElement) {
      viewerElement.addEventListener("mouseenter", onMouseEnter);
    }

    // _viewer.container.addEventListener(
    //   "click",
    //   onClickEventOnContainer
    // );
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
    _viewer.removeEventListener(
      Autodesk.Viewing.VIEWER_UNINITIALIZED,
      onViewerUnInitialized
    );

    let viewerElement = document.getElementById(_viewerId);
    if (viewerElement) {
      viewerElement.removeEventListener("mouseenter", onMouseEnter);
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
    console.log("Inside remove layers in forgeWrapper: ", _dataVizUtils);
    if (_dataVizUtils) {
      // _dataVizUtils.removeExistingVisualizationData();
      _dataVizUtils.removeLoadedData();
    }
  };

  const shutdown = () => {
    if (_isViewerInitialized) {
      removeData();
      removeEventListeners();
      _viewer.unloadExtension(ForgeDataVisualization.EXTENSION_ID);
      // _viewer.finish();
      // _viewer = null;
      _dataVizExtn = undefined;
      _dataVizUtils = undefined;
      // Autodesk.Viewing.shutdown();
    }
    _isViewerInitialized = false;
  };

  return {
    setupViewer: setupViewer,
    initializeViewer: initializeViewer,
    setType: setType,
    createMarker: createMarker,
    setStructure: setStructure,
    setSnapshot: setSnapshot,
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
    resize: resize,
    shutdown: shutdown,
  };
};

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
