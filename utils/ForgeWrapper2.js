import { autodeskAuth } from "../services/forgeService";
import { ForgeDataVisualization } from "./ForgeDataVisualizationUtils";
import { applyTM, isMobile } from "./ViewerDataUtils";

const publish = (eventName, data) => {
  const event = new CustomEvent(eventName, { detail: data })
  document.dispatchEvent(event)

}

export class ForgeInstance {

  constructor(viewerId) {
    // console.log("Inside Potree Initializer: ")
    let viewerConfig = {
      extensions: ["Autodesk.BimWalk"],
    };
    let htmlDiv = document.getElementById(viewerId);
    if (isMobile()) {
      this.viewer = new Autodesk.Viewing.Viewer3D(htmlDiv, viewerConfig);
    } else {
      this.viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, viewerConfig);
    }
    
    this.newInstance = true;
  }

  static getInstance(viewerId) {
      if (!this.instance) {
          this.instance = new ForgeInstance(viewerId);
          delete this.instance.constructor;
      } else {
        let child = document.getElementById(viewerId);
        console.log("ForgeInstanceTest inside getInstance: ", child);
        
        let parent = child.parentElement;
        parent.removeChild(document.getElementById(viewerId));
        // parent.appendChild(this.instance.viewer.clientContainer);
        parent.insertBefore(this.instance.viewer.clientContainer, parent.firstChild);
        this.instance.newInstance = false;
      }
      console.log("ForgeInstanceTest inside getInstance: ", this.instance);
      return this.instance;
  }

  static getCompareInstance(viewerId) {
      if (!this.compareInstance) {
          this.compareInstance = new ForgeInstance(viewerId);
          delete this.compareInstance.constructor;
      } else {
          let child = document.getElementById(viewerId);
          console.log("ForgeInstanceTest inside getCompareInstance: ", child);
          let parent = child.parentElement;
          parent.removeChild(document.getElementById(viewerId));
          // parent.appendChild(this.instance.viewer.clientContainer);
          parent.insertBefore(this.compareInstance.viewer.clientContainer, parent.firstChild);
          this.compareInstance.newInstance = false;
      }
      return this.compareInstance;
  }
}

export const ForgeViewerUtils = function () {
  let _instance;
  let _viewerId;
  let _eventHandler;
  let _viewer;
  let _isViewerInitialized = false;

  let _structure;
  let _snapshot;

  let _isPendingDataToLoad = false;
  let _isPendingLayersToLoad = false;
  let _isRefreshing = false;

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
  let _showLayersList = undefined;
  let _showTag = {};

  let _context;

  let _dataVizExtn;
  let _isDataVizExtnLoaded = false;
  let _bimWalkExtn;
  let _dataVizUtils;
  let _isAddTagActive = false;

  const isCompareView = () => {
    if (_viewerId.split("_")[1] === "1") {
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
    extensions: ["Autodesk.BimWalk", "Autodesk.DataVisualization"],
  };

  const setupViewer = (viewerId, eventHandler) => {
    _viewerId = viewerId;
    _eventHandler = eventHandler;
  }

  const initializeViewer = () => {
    console.log("ForgeInstanceTest Inside Initializer callback: ", );

    if (isCompareView()) {
      _instance = ForgeInstance.getCompareInstance(_viewerId);
      _viewer = _instance.viewer;
    } else {
      _instance = ForgeInstance.getInstance(_viewerId);
      _viewer = _instance.viewer;
    }

    setUpEventListeners();

    let startedCode = _viewer.start();
    _viewer.canvasId = _viewerId;

    if (startedCode > 0) {
      console.error("ForgeInstanceTest Failed to create a Viewer: WebGL not supported.");
      return;
    } else {
      console.log("ForgeInstanceTest inside startCode check: ", _instance.newInstance);
      if (!_instance.newInstance) {
        onViewerInitialized();
      }
    }

    _viewer.navigation.setWorldUpVector(
      new THREE.Vector3().fromArray([0, 0, 1]),
      false
    );
    _viewer.navigation.setReverseZoomDirection(true);
  }

  const initializeViewer2 = () => {
    // if(_viewer) return
    console.log("Inside Initializer callback", _eventHandler);
    let htmlDiv = document.getElementById(_viewerId);
    _viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, viewerConfig);
    setUpEventListeners();
    let startedCode = _viewer.start();
    _viewer.canvasId = _viewerId;
    if (startedCode > 0) {
      console.error("Failed to create a Viewer: WebGL not supported.");
      return;
    }

    _viewer.navigation.setWorldUpVector(
      new THREE.Vector3().fromArray([0, 0, 1]),
      false
    );
    _viewer.navigation.setReverseZoomDirection(true);
  };

  const setStructure = (structure) => {
    _structure = structure;
  };

  const setSnapshot = (snapshot) => {
    _snapshot = snapshot;
  };

  const updateData = (documentURNs) => {
    console.log("Inside update data: ", documentURNs);
    _documentURNs = documentURNs;
    _isPendingDataToLoad = true;
    console.log("LoadingMyData",_isViewerInitialized);
    if (_isViewerInitialized) {
      
      loadData();
    } else {
      // initializeViewer();
    }
  };

  const updateLayersData = (realityPositionMap, context) => {
    console.log("Inside update layers data: ", realityPositionMap, context);
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

  const refreshData = (context) => {
    if (context) {
      _context = context;
    } else {
      _context = null;
    }

    _isPendingDataToLoad = true;
    _isPendingLayersToLoad = true;
    if (_isViewerInitialized) {
      _viewer.waitForLoadDone();
      _isRefreshing = true;
      loadData();
    }
  };

  const loadLayersOnDataLoadCompletion = () => {
    console.log(
      "ForgeInstanceTest Inside loadlayers On data load complete: ",
      _isPendingLayersToLoad,
      _isModelLoaded,
      _dataVizUtils,
      !_isRefreshing
    );

    if (!_isRefreshing && _isPendingLayersToLoad) {
      if (_isModelLoaded && _dataVizUtils) {
        return true;
      }
      return false;
    }
    return false;
  };

  const loadData = async () => {
    // console.log("Inside loadModel: ",documentURNs);
    // console.log("Loading new Model: ", documentURNs);
    _viewer.waitForLoadDone();
    if (_isModelLoaded) {
      removeData();
    }

    _documentURNs[getAvailableType()]?.map((document) => {
     console.log("Inside loadData:", document);

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
          if(_manifestNode.is2D()) {
            _viewer.setActiveNavigationTool("pan");
          }
          loadExtension();
        },
        function () {
          console.error("Failed fetching Forge manifest");
        }
      );
    });
  };

  const generateModelOptions = (tm, manifestNode) => {
     console.log("Inside modeloptions:", tm);
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

  const loadLayers = () => {
    // console.log("Passing data to dataViz extension: ", dataVizUtils);
    _dataVizUtils.removeExistingVisualizationData();
    _dataVizUtils.setIs2D(_manifestNode.is2D());
    _dataVizUtils.setTM(_tm);
    _dataVizUtils.setOffset(_globalOffset);
    _dataVizUtils.addMediaData(_realityPositionMap);
    _dataVizUtils.addIssuesData(_issuesList);
    _dataVizUtils.addTasksData(_tasksList);
    _dataVizUtils.setTagState(_showTag);
    _dataVizUtils.setViewableState(_showLayersList);
    _dataVizUtils.updateData();
    _isPendingLayersToLoad = false;
  };

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
    deactivateTool()
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
        console.log(`Inside Rag Click click: ${targetObject.position.x}`);
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
    // console.log("TestOrbitLock Updating context for forge: ", context);
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
      case "2d":
        setForgeControls(context.type);
        break;
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
      case "Drone Image":
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
        id: new Date().getTime().toString(),
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
    return { cameraPosition, cameraTarget, yaw: state.up[0] };
  };

  const getViewerState = () => {
    let offset = _globalOffset;
    if (_isModelLoaded) {
      _viewer.navigation.setCameraUpVector(
        new THREE.Vector3().fromArray([0, 0, 1])
      );
      const state = _viewer.getState({ viewport: true }).viewport;
      let viewerState = {
        position: [state.eye[0] + offset[0], state.eye[1]+ offset[1], state.eye[2]+ offset[2]],
        target: new THREE.Vector3(state.target[0] + offset[0],state.target[1] + offset[1],state.target[2] + offset[2]),
        fov: state.fieldOfView,
      };
      // console.log("Inside Forge get ViewerState: ", viewerState, state)
      return viewerState;
    }
  };

  const updateViewerState = (viewerState) => {
    // if (_isModelLoaded && viewerState) {
      let offset = _globalOffset;
      if (viewerState) {
      // console.log("Inside update viewer state: ", viewerId, viewerState);
      let position = new THREE.Vector3(viewerState.position[0]-offset[0],viewerState.position[1]-offset[1],viewerState.position[2]-offset[2]);
      _viewer.navigation.setPosition(position);
      _viewer.navigation.setTarget(new THREE.Vector3(viewerState.target.x-offset[0],viewerState.target.y-offset[1],viewerState.target.z-offset[2]));
      if (viewerState.fov) {
        _viewer.navigation.setVerticalFov(viewerState.fov, false);
      }
    }
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
    // console.log("TestOrbitLock inside setForgeControls: ", _viewer.getActiveNavigationTool(), type, _manifestNode.is2D(),)
    if (_manifestNode.is2D()) {
      _viewer.navigation.setLockSettings({
        orbit: false,
        pan: true,
        zoom: true,
        roll: true,
        fov: true,
      });
      _viewer.navigation.setIsLocked(true);
      return;


      // let value = _viewer.setActiveNavigationTool("pan");
      // let value2 = _viewer.toolController.activateTool("pan");
      // let value3 = _viewer.activateDefaultNavigationTools(_manifestNode.is2D());
      // console.log("2DTest inside setForgeControls, is 2D, set to pan tool state: ", value, value2, value3, _viewer.getActiveNavigationTool());
    }
    
    if (_bimWalkExtn && !_manifestNode.is2D()) {
      // console.log("TestOrbitLock inside setForgeControls: inside not 2d", type, _manifestNode.is2D(),)
      if (type !== "3d" && type !== "2d") {
        _viewer.navigation.setIsLocked(false);
        if (isCompareView() && (type === "360 Video" || type === "360 Image" || type === "Drone Image")) {
          _viewer.navigation.setLockSettings({
            orbit: false,
            pan: false,
            zoom: false,
            roll: false,
            fov: true,
          });
          _viewer.navigation.setIsLocked(true);
          publish("movement-locked",true);
        }

        if (_viewer.getExtension("Autodesk.BimWalk")) {
          _viewer.getExtension("Autodesk.BimWalk").activate();
          if(isMobile()) {
            _viewer.getExtension("Autodesk.BimWalk").tool.deactivateJoystick();
          }
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
    _bimWalkExtn = await _viewer.loadExtension("Autodesk.BimWalk");

    _dataVizExtn = await _viewer.loadExtension("Autodesk.DataVisualization");
  };

  const onViewerInitialized = () => {
    console.log("ForgeInstanceTest Viewer Initialized: Loading Model now");
    _isViewerInitialized = true;
    if (_isPendingDataToLoad) {
      loadData();
    }
  };

  const onViewerUnInitialized = () => {
    console.log("Forge Viewer UnInitialized: ");
    _isViewerInitialized = false;
  };

  const modelLoadProgress = (progress, state, model) => {
    if (!_isModelLoaded && progress.percent == 100) {
      console.log("Inside model load progress: ", progress, state, model);
      _isModelLoaded = true;
      _isRefreshing = false;
      if (loadLayersOnDataLoadCompletion()) {
        // loadLayers();
      }
    }

    if (progress.percent > 5 && _context) {
      updateContext(_context, false);
    }
  };

  const onModelLayersLoadedEvent = (parameter) => {
    // console.log("Inside Model Layers loaded Event: model: ",parameter);
    // if (_context) {
    //   updateContext(_context, false);
    // }

    // loadExtension();
    _isPendingDataToLoad = false;
    _isModelLoaded = true;
    _isRefreshing = false;
    if (loadLayersOnDataLoadCompletion()) {
      loadLayers();
    }
  };

  const onGeometryLoadedEvent = (parameter) => {
    // console.log("Inside Geometry Loaded Event: model: ", parameter.model);
    _isModelLoaded = true;
    _isRefreshing = false;
    if (loadLayersOnDataLoadCompletion()) {
      loadLayers();
    }
  };

  const onModelUnLoadedEvent = (model) => {
    // console.log("Inside Model Unload event", model);
    _isModelLoaded = false;
  };

  const onExtensionLoadedEvent = (parameter) => {
    // console.log("Inside Extension Loaded Event:", parameter);
    if (parameter.extensionId === ForgeDataVisualization.EXTENSION_ID) {
      console.log(
        "ForgeInstanceTest Inside Extension Loaded Event: Data Visualization",
        parameter
      );
      _isDataVizExtnLoaded = true;
      if(_dataVizUtils === undefined) {
        _dataVizExtn = _viewer.getExtension(parameter.extensionId);

        _dataVizUtils = new ForgeDataVisualization(_viewer, _dataVizExtn);
        _dataVizUtils.setHandler(onDataVizHandler.bind(this));

        _dataVizUtils.setIs2D(_manifestNode.is2D());
        _dataVizUtils.setTM(_tm);
        _dataVizUtils.setOffset(_globalOffset);
      }

      if (loadLayersOnDataLoadCompletion()) {

        loadLayers();
      }
    } else if (parameter.extensionId === "Autodesk.BimWalk") {
      console.log("ForgeInstanceTest Inside Forge Viewer, Bim Walk loaded:");
      _bimWalkExtn = _viewer.getExtension(parameter.extensionId);
      // disable the same post load
      _bimWalkExtn.tool.navigator.enableGravity(false)
    } else if(parameter.extensionId === "Autodesk.Measure"){
      _viewer.prefs.set(Autodesk.Viewing.Private.Prefs.DISPLAY_UNITS, 'ft-and-fractional-in');
    }
  };

  const onMouseEnter = () => {
     //console.log("Inside mouse eneter event forge: ", _viewerId);
    _eventHandler(_viewerId, { type: "mouse" });
  };

  const onCameraChangeEvent = (event) => {
    // console.log("On Camera change event: ", event, typeof(_eventHandler), _viewer);
    _eventHandler(_viewerId, { type: "sync", context: getContext() });
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
      try{
        // _viewer.tearDown();
        // _dataVizExtn = undefined;
        // _dataVizUtils = undefined;
        _viewer.unloadModel(_model);
      } catch(e) {
        console.log("tearDown error: ", e);
      }
    }
  };

  const removeLayers = () => {
    console.log("Inside remove layers in forgeWrapper: ", _dataVizUtils);
    if (_dataVizUtils) {
      _dataVizUtils.removeExistingVisualizationData();
      _dataVizUtils.removeListeners();
    }
  };

  const shutdown = () => {
    if (_isViewerInitialized) {
      removeData();
      removeEventListeners();
      _viewer.unloadExtension(ForgeDataVisualization.EXTENSION_ID);
      _viewer.unloadExtension("Autodesk.BimWalk");
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
