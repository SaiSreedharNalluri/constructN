// import { Path2D } from '@adsk/solid-definition';
import { autodeskAuth } from "../services/forgeService";
import { ForgeDataVisualization } from './ForgeDataVisualizationUtils';

export class ForgeViewerUtils {
  constructor(viewerId, eventHandler) {
    this.viewerId = viewerId;
    this.documentURNs = {};
    this.realityPositionMap = {};
    this.viewer = undefined;
    this.isViewerInitialized = false;
    this.model = undefined;
    this.manifestNode = undefined;
    this.progressData = undefined;
    this.inProgress = false;
    this.isPendingDataToLoad = false;
    this.isPendingLayersToLoad = false;
    this.dataVizExtn = undefined;
    this.eventHandler = eventHandler;
    this.selectedType = "Plan Drawings";
  }

  // static getInstance(viewerId) {
  //   if (!this.instance) {
  //     this.instance = new ForgeViewerUtils(viewerId);
  //     delete this.instance.constructor;
  //   }
  //   return this.instance;
  // }

  setType(type) {
    this.selectedType = type;
    this.loadData();
  }

  getAvailableType() {

    if (this.selectedType in this.documentURNs) {
      return this.selectedType;
    }

    if ("Plan Drawings" in this.documentURNs) {
      return "Plan Drawings";
    } else if ("BIM" in this.documentURNs) {
      return "BIM";
    }
  }

  updateData(documentURNs) {
    this.documentURNs = documentURNs;
    this.isPendingDataToLoad = true;
    if (this.isViewerInitialized) {
      this.loadData();
    } else {
      this.initialize();
    }
  }

  updateLayersData(realityPositionMap, camera, imageContext) {
    console.log("Inside update layers data: ", realityPositionMap, this.dataVizExtn);
    this.camera = camera;
    this.imageContext = imageContext;
    this.realityPositionMap = realityPositionMap;
    this.isPendingLayersToLoad = true;
    if (this.dataVizExtn) {
      this.loadLayers();
    }
  }

  updateProgressData(progress) {
    this.progressData = progress
  }

  initialize() {
    console.log(`Inside Initializer ViewerID: ${this.viewerId}`);
    var options = {
      env: "AutodeskProduction2", //Local, AutodeskProduction, AutodeskProduction2
      api: "streamingV2", // for models uploaded to EMEA change this option to 'derivativeV2_EU'
      getAccessToken: async function (onSuccess) {
        const response = await autodeskAuth();
        console.log("Autodesk auth token:", response.data.result);
        const res = response.data.result;
        
        onSuccess(res.access_token, res.expires_in);
      },
    };

    this.inProgress = true;
    Autodesk.Viewing.Initializer(options, this.initializerCallBack.bind(this));
  }

  initializerCallBack() {
    this.inProgress = false;
    console.log("Inside Initializer call back");

    console.log(`ViewerID: ${this.viewerId}`);
    var htmlDiv = document.getElementById(this.viewerId);
    const config3d = {
      extensions: [
        // 'Autodesk.Edit2D',
        // 'Autodesk.Viewing.MarkupsCore',
        // 'Autodesk.Measure'
        "Autodesk.PDF",
        "Autodesk.Geolocation",
        "Autodesk.DataVisualization",
        // "ConstructNTools",
      ],
    };
    this.viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, config3d);
    this.setUpEventListeners();
    var startedCode = this.viewer.start();
    this.viewer.canvasId = self.viewerId;
    if (startedCode > 0) {
      console.error("Failed to create a Viewer: WebGL not supported.");
      return;
    }
    console.log("Initialization complete, loading a model next...");
    // await loadModel(forgeViewer);
  }

  onViewerInitialized() {
    console.log("Viewer Initialized: Loading Model now");
    this.isViewerInitialized = true;
    // if(this.isPendingDataToLoad) {
          this.loadData();
    // }
  }

  onViewerUnInitialized() {
    console.log("Viewer Uninitialized:")
  }

  isViewerLoaded() {
    return this.isViewerInitialized;
  }

  async loadData() {
    console.log("Inside loadModel: ",this.documentURNs);
    console.log("Loading new Model: ", this.documentURNs);
    if(this.isModelLoaded) {
     this.removeData();
    //  await this.viewer.unloadDocumentNode(this.manifestNode);
    }
    this.documentURNs[this.getAvailableType()].map((document) => {
      Autodesk.Viewing.Document.load(
        document.urn,
        async function (viewerDocument) {
          this.manifestNode = viewerDocument.getRoot().getDefaultGeometry();
          console.log("Is model svf2: ", this.manifestNode.isSVF2())
          this.model = await this.viewer.loadDocumentNode(
            viewerDocument,
            this.manifestNode,
            this.generateModelOptions(document.tm, this.manifestNode)
          );
        }.bind(this),
        function () {
          console.error("Failed fetching Forge manifest");
        }
      );
    });
  }

  generateModelOptions(tm, manifestNode) {
    console.log("Inside modeloptions:", tm);
    console.log("Inside modeloptions, isModel 2D: ", manifestNode.is2D());
    // var mx = new THREE.Matrix4();
    // mx.fromArray([
    //   10.709603309631, 1.489653229713, 0.0, 385315.34375, -1.489653229713,
    //   10.709603309631, 0.0, 2049716.75, 0.0, 0.0, 10.812708854675, 0.0, 0.0,
    //   0.0, 0.0, 1.0,
    // ]).transpose();

    const modelOptions = {
      applyScaling: "m",
      // preserveView: true,
      // modelSpace: true,
      // keepCurrentModels: true,
    };

    if (manifestNode.is2D()) {
      let leafletOptions = {
        fitPaperSize: true,
        isPdf: true
      }

      modelOptions.page = 1;
      modelOptions.leafletOptions = leafletOptions
    }

    modelOptions.globalOffset = { x: 0, y: 0, z: 0 };
    let globalOff = [0, 0, 0];

    this.tm = [];
    this.globalOffset = globalOff;
    if (tm && tm.tm) {
      this.tm = tm.tm;
      modelOptions.placementTransform = new THREE.Matrix4().fromArray(tm.tm).transpose();
      // modelOptions.placementTransform = (new THREE.Matrix4()).setPosition({x:50,y:0,z:-50})
      // modelOptions.placementTransform = new THREE.Matrix4().fromArray([0.216,1.022,-0.007,367033.477,-1.022,0.216,-0.001,2053135.281,-0.000,0.007,1.045,-57.5,0.000,0.000,0.000,1.000]).transpose()
      console.log('BIM TM Loaded');
    }

    // if (tm && tm.offset) {
    //   globalOff = this.tm_json.offset;
    //   modelOptions.globalOffset = {
    //     x: globalOff[0],
    //     y: globalOff[1],
    //     z: globalOff[2],
    //   };
    //   this.globalOffset = tm.offset;
    //   console.log("Offset Loaded");
    // }

    return modelOptions;

  }

  loadLayers() {
    console.log("Passing data to dataViz extension: ", this.dataVizUtils);
    this.dataVizUtils.removeExistingVisualizationData();
    this.dataVizUtils.addVisualizationData(this.realityPositionMap);
    this.isPendingLayersToLoad = false;
  }

  getCamera(){
    console.log("Inside forge get Camera: ", this.viewer);
    let camObject = undefined;
    if(this.isViewerInitialized) {
      const state = this.viewer.getState({ viewport: true }).viewport;
      let offset = this.globalOffset
      camObject = {
        position: [state.eye[0]+offset[0], state.eye[1]+offset[1], state.eye[2]+offset[2]],
        target: [state.target[0]+offset[0], state.target[1]+offset[1], state.target[2]+offset[2]]
      }
    }
    return camObject;
  }

  // ((extension) => {
  //   console.log("Load Async dataVizExtension: ",extension);
  //   this.dataVizUtils = new ForgeDataVisualization(this.viewer, extension);
  //   this.dataVizUtils.setHandler(this.onDataVizHandler.bind(this));
  // }).bind(this)

  async loadExtension() {
    this.dataVizExtn = await this.viewer.loadExtension(
      "Autodesk.DataVisualization",
    );

    // var box = this.viewer.model.getBoundingBox();
    // console.log(`min:${box.min.x},${box.min.x} ,max:${box.max.x},${box.max.y}`);

    // console.log(`Display Unit: ${this.viewer.model.getDisplayUnit()}`);
    // console.log(`Unit String: ${this.viewer.model.getUnitString()}`);
    // console.log(`Unit Scale: ${this.viewer.model.getUnitScale()}`);
    // console.log("", this.viewer.model.isLeaflet());
    // console.log(
    //   "Model transform: ",
    //   this.viewer.model.getModelTransform()
    // );
    // console.log(
    //   `isPageCoordinates: ${this.viewer.model.isPageCoordinates()}`
    // );
    this.getActiveTool();

    if (this.isPendingLayersToLoad) {
      
    }
  }

  getActiveTool() {
    var controller = this.viewer.toolController;
    var activeTool = controller.getActiveTool();

    if (activeTool) {
      console.log(`Inside getActiveTool: ${activeTool.getName()}`);
    }
  }

  startTool(tool) {
    var controller = this.viewer.toolController;

    // Check if currently active tool is from Edit2D
    var activeTool = controller.getActiveTool();
    var isEdit2D = activeTool && activeTool.getName().startsWith("Edit2");

    // deactivate any previous edit2d tool
    if (isEdit2D) {
      controller.deactivateTool(activeTool.getName());
      activeTool = null;
    }

    // stop editing tools
    if (!tool) {
      return;
    }

    controller.activateTool(tool.getName());
  }

  removeData() {
    console.log("Model Before Removed: ", this.model);
    if (this.isViewerInitialized) {
      this.removeLayers();
      this.viewer.tearDown();
      this.dataVizExtn = undefined;
      delete this.dataVizUtils;
      this.dataVizUtils = undefined;
    }
  }

  removeLayers() {
    if(this.dataVizUtils) {
      this.dataVizUtils.removeExistingVisualizationData();
    }
  }

  shutdown() {
    this.isViewerInitialized = false;
    // this.viewer.finish();
    // this.viewer.uninitialize();
    // Autodesk.Viewing.shutdown();
  }

  onLoadFileEvent(parameter) {
    // console.log("Inside Load File Event: ", parameter.loader);
  }

  onLoadErrorEvent(parameter) {
    console.log(
      `Inside Load Error Event: ${parameter.loader} error: ${parameter.error} `
    );
  }

  onModelRootLoadedEvent(parameter) {
    console.log(
      // `Inside Model Root Loaded Event: SVF: ${parameter.svf} model: ${parameter.model}`
    );
  }

  onModelAddedEvent(parameter) {
    // console.log(`Inside Model added Event: model: ${parameter.model}`);
  }

  onModelLayersLoadedEvent(parameter) {
    console.log("Inside Model Layers loaded Event: model: ",parameter);
    this.loadExtension();
    this.isPendingDataToLoad = false;
    this.isModelLoaded = true;
  }

  onGeometryLoadedEvent(parameter) {
    // console.log("Inside Geometry Loaded Event: model: ", parameter.model);
  }

  onBeforeModelUnLoadedEvent(model) {
    // console.log("Inside Before Model Unload event", model);
  }

  onModelUnLoadedEvent(model) {
    // console.log("Inside Model Unload event", model);
    this.isModelLoaded = false;
  }

  onExtensionPreLoadedEvent(parameter) {
    // console.log(`Inside Extension Pre Loaded Event: ${parameter.extensionId}`);
  }

  onExtensionLoadedEvent(parameter) {
    // console.log("Inside Extension Loaded Event:", parameter);
    if(parameter.extensionId === ForgeDataVisualization.EXTENSION_ID) {
      console.log("Inside Extension Loaded Event: Data Visualization", parameter);
      this.dataVizExtn = this.viewer.getExtension(parameter.extensionId);

      this.dataVizUtils = new ForgeDataVisualization(this.viewer, this.dataVizExtn);
      this.dataVizUtils.setHandler(this.onDataVizHandler.bind(this));
      if (this.isPendingLayersToLoad) {
        this.loadLayers();
      }
    }
  }

  onExtensionPreUnLoadedEvent(parameter) {
    console.log(
      // `Inside Extension Pre UnLoaded Event: ${parameter.extensionId}`
    );
  }

  onExtensionUnLoadedEvent(parameter) {
    // console.log(`Inside Extension UnLoaded Event: ${parameter.extensionId}`);
  }

  onExtensionPreActivatedEvent(parameter) {
    console.log(
      // `Inside Extension Pre Activated Event: ${parameter.extensionId} mode: ${parameter.mode}`
    );
  }

  onExtensionActivatedEvent(parameter) {
    if(parameter.extensionId === ForgeDataVisualization.EXTENSION_ID) {
      console.log("Inside Extension Activated Event: Data Visualization", parameter);
    }
  }

  onExtensionPreDeActivatedEvent(parameter) {
    console.log(
      // `Inside Extension Pre DeActivated Event: ${parameter.extensionId}`
    );
  }

  onExtensionDeActivatedEvent(parameter) {
    // console.log(`Inside Extension DeActivated Event: ${parameter.extensionId}`);
  }

  onToolChangeEvent(parameter) {
    // console.log(
    //   `Inside Tool change event: name: ${parameter.toolName} isActive: ${parameter.active} tool: `,
    //   parameter.tool
    // );
  }

  onClickEventOnContainer(ev) {
    const result = this.viewer.clientToWorld(ev.clientX, ev.clientY);
    if (result) {
      console.log("Click Point", result.point);
      this.eventHandler('issue',result);
    }
    return false;
  }

  onDataVizHandler(event, targetObject) {
    // console.log("Inside viewer Daya viz handler: ", event);
    const result = this.viewer.clientToWorld(event.originalEvent.clientX, event.originalEvent.clientY);
    switch(event.type) {
      case "DATAVIZ_OBJECT_HOVERING":
        // console.log("Hover Image at ", result.point, targetObject.getName);
        break;
      case "DATAVIZ_OBJECT_CLICK":
        console.log("Selected Image at ", result ? result.point : "Outside canvas", targetObject.name);
        this.eventHandler("Design", targetObject);
        break;
    }
  }

  setUpEventListeners() {
    this.viewer.addEventListener(
      Autodesk.Viewing.VIEWER_INITIALIZED,
      this.onViewerInitialized.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.VIEWER_UNINITIALIZED,
      this.onViewerUnInitialized.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.LOADER_LOAD_FILE_EVENT,
      this.onLoadFileEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.LOADER_LOAD_ERROR_EVENT,
      this.onLoadErrorEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT,
      this.onModelRootLoadedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.MODEL_ADDED_EVENT,
      this.onModelAddedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.MODEL_LAYERS_LOADED_EVENT,
      this.onModelLayersLoadedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      this.onGeometryLoadedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.BEFORE_MODEL_UNLOADED_EVENT,
      this.onBeforeModelUnLoadedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.MODEL_UNLOADED_EVENT,
      this.onModelUnLoadedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.EXTENSION_PRE_LOADED_EVENT,
      this.onExtensionPreLoadedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.EXTENSION_LOADED_EVENT,
      this.onExtensionLoadedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.EXTENSION_PRE_UNLOADED_EVENT,
      this.onExtensionPreUnLoadedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.EXTENSION_UNLOADED_EVENT,
      this.onExtensionUnLoadedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.EXTENSION_PRE_ACTIVATED_EVENT,
      this.onExtensionPreActivatedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.EXTENSION_ACTIVATED_EVENT,
      this.onExtensionActivatedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.EXTENSION_PRE_DEACTIVATED_EVENT,
      this.onExtensionPreDeActivatedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.EXTENSION_DEACTIVATED_EVENT,
      this.onExtensionDeActivatedEvent.bind(this)
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.TOOL_CHANGE_EVENT,
      this.onToolChangeEvent.bind(this)
    );
    // this.viewer.addEventListener(
    //   Autodesk.Viewing.CAMERA_CHANGE_EVENT,
    //   this.onCameraChangeEvent.bind(this)
    // );
    // this.viewer.addEventListener(
    //   Autodesk.Viewing.SELECTION_CHANGE_EVENT,
    //   this.onSelectionChangeEvent.bind(this)
    // );
  }
}
/// For future work
// onCameraChangeEvent(ev) {
//   syncForgeEvent = true;
// }

// onSelectionChangeEvent(ev) {
//   var currSelection = viewer.getSelection();
//   console.log("Selection: ");
//   if (currSelection.length && bimProgressData[viewer.canvasId]) {
//     let guid = bimProgressData[viewer.canvasId]["dbtoguid"][currSelection[0]];
//     let progress = bimProgressData[viewer.canvasId]["progress"][guid];
//     console.log(
//       "dbid: ",
//       currSelection[0],
//       "guid: ",
//       guid,
//       "progress: ",
//       progress
//     );
//     // let card_container_id = divId == 'viewer_1' ? 'bim_details_card_container_1' : 'bim_details_card_container_2'
//     // let card_id = divId == 'viewer_1' ? 'bim_details_card_1' : 'bim_details_card_2'
//     // let card_container = document.getElementById(card_container_id);
//     // let card = document.getElementById(card_id);
//     // let card_details = '<table>'
//     // card_details += `<tr> <td>    </td> <td>    </td> </tr>`
//     // card_details += `<tr> <td> GUID </td> <td> ${guid} </td> </tr>`
//     // card_details += `<tr> <td> Progress </td> <td> ${progress} </td> </tr>`
//     // card_details += '</table>'
//     // card.innerHTML = card_details;
//     // card_container.style.display = 'block';
//     let bim_element_details = { guid: guid, progress: progress };
//     window.top.postMessage(
//       { type: "bim-click", data: JSON.stringify(bim_element_details) },
//       "*"
//     );
//     console.log("Sending ", bim_element_details);
//     // const pointer = event.pointers ? event.pointers[0] : event;
//     // const rayCaster = pointerToRaycasterForge(viewer.canvas, viewer.navigation.getCamera(), pointer);
//     // const forgeClickObject = viewer.model.rayIntersect(rayCaster, true, this.getAllDbIds(viewer));
//     // console.log('Click point')
//     // console.log(forgeClickObject)
//     // const result = viewer.clientToWorld(event.clientX, event.clientY);
//     // if (result) {
//     // 	console.log(result.point);
//     // }
//   } else {
//     window.top.postMessage(
//       { type: "bim-click", data: JSON.stringify({}) },
//       "*"
//     );
//     // closeBimDetailsCard(divId);
//   }
// }

// async loadProgressView() {
//   if (this.progressData != undefined) {
//     let guidDetails = await getguidTodbidMapping(viewer, projectID, tilesetID);
//     let guidMapping = guidDetails.guidMapping;
//     let guids = Object.keys(guidDetails.guidMapping)

//     bimProgressData[viewer.canvasId] = {
//       'mapping': guidDetails.guidMapping,
//       'dbtoguid': guidDetails.dbIdToGuid,
//       'guids': guids
//     }

//     console.log('GUID - DBID mapping done')
//     const progress_data = JSON.parse(await progress_data_raw.text());
//     console.log('BIM progress json loaded');

//     bimProgressData[viewer.canvasId]['progress'] = progress_data;

//     // let guids = bimProgressData[viewer.canvasId]['guids']
//     // let guidMapping = bimProgressData[viewer.canvasId]['mapping']

//     let redArr = guids.filter(key => progress_data[key] == 0);
//     let greenArr = guids.filter(key => progress_data[key] == 100);
//     let blueArr =  guids.filter( key => (!redArr.includes(key) && !greenArr.includes(key)));
//     let redDbArr = []
//     let greenDbArr = []
//     let blueDbArr = []
//     if (inProjectID != '161' && inProjectID != '165' && inProjectID != '166') {
//       redArr.map(id => redDbArr = redDbArr.concat(guidMapping[id]))
//     }
//     blueArr.map(id => blueDbArr = blueDbArr.concat(guidMapping[id]))
//     greenArr.map(id => greenDbArr = greenDbArr.concat(guidMapping[id]))
    
//     bimProgressData[viewer.canvasId]['red'] = redDbArr
//     bimProgressData[viewer.canvasId]['green'] = greenDbArr
//     bimProgressData[viewer.canvasId]['blue'] = blueDbArr

//     this.addProgressButton(viewer);

//     loadProgressWalk(viewer, projectID, tilesetID);
//   }
// }

// addProgressButton(viewer) {
//   let group = new Autodesk.Viewing.UI.ControlGroup('BimProgress');
//   this.viewer.toolbar.addControl(group);

//   // Add a new button to the toolbar group
//   let button = new Autodesk.Viewing.UI.Button('progress');
//   // instead of using bootstrap classes e.g.
//   // button.icon.classList.add("fas", "fa-arrows-alt");
//   // you can do this
//   // let iconPath = 'https://dtwin-viewers.s3.ap-south-1.amazonaws.com/icons/progress.png'
//   let iconPath = '../../public/icons/show-password.svg' // for testing only
//   button.icon.style = `background-image: url(${iconPath}); background-size: 24px 24px;`

//   button.setToolTip('Progress View');


//   button.onClick = function(e) {
//     toggleBimProgressView(viewer)

//     // button.icon.classList.add('adsk-viewing-viewer', 'dark-theme', 'adsk-button.active', 'adsk-button')
//     // button.icon.classList.add("fas", "fa-arrows-alt");
//   };

//   group.addControl(button);

//   toggleBimProgressView(viewer);
  
//   // let elems = document.querySelectorAll('[id=bim_not_started]');

//   // if (viewer.canvasId == 'viewer_1') {

//   // 	elems[0].click()
//   // } else {
//   // 	elems[1].click()
//   // }
// }

// toggleBimProgressView(viewer) {
//   console.log('Go to Progress View')
//     bimProgressMode ? bimDefaultView(viewer) : bimProgressView(viewer)
//     if (viewer.canvasId == 'viewer_1') {
//       bimProgressMode ? document.getElementById('bim_legend_1').style.display = 'none' : document.getElementById('bim_legend_1').style.display = 'block'
//     } else {
//       bimProgressMode ? document.getElementById('bim_legend_2').style.display = 'none' : document.getElementById('bim_legend_2').style.display = 'block'
//     }
//     bimProgressMode = !bimProgressMode
// }

