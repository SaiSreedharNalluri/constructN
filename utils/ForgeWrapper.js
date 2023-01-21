// import { Path2D } from '@adsk/solid-definition';

export class ForgeViewerUtils {

  constructor(viewerId) {
    this.viewerId = viewerId;
    this.documentURNs = [];
    this.forgeViewer = undefined;
    this.isViewerInitialized = false;
    this.tm_json = {
      "tm": [
    -0.136552, 0.992896 ,0.000000 ,385382.750000,
    -0.992896, -0.136552, 0.000000, 2049802.000000,
    0.000000, 0.000000, 1.002242, 95.249374,
    0.000000, 0.000000 ,0.000000, 1.000000
      ],
      "offset": [
        385383.538,
        2049820.99,
        100
      ]
    }
    
  }

  static getInstance(viewerId) {
    if(!this.instance) {
      this.instance = new ForgeViewerUtils(viewerId)
      delete this.instance.constructor;
    }
    return this.instance;
  }


  updateModels(documentURNs) {
    this.documentURNs = documentURNs;
    if(this.isViewerInitialized) {
      this.loadModel()
    }
  }

  registerCustomExtension() {
    Autodesk.Viewing.theExtensionManager.registerExtension(
      "ConstructNTools",
      ConstructNTools
    );
  }

  initialize(callback) {
    console.log(`Inside Initializer ViewerID: ${this.viewerId}`);
    var options = {
      env: "AutodeskProduction2", //Local, AutodeskProduction, AutodeskProduction2
      api: "streamingV2", // for models uploaded to EMEA change this option to 'derivativeV2_EU'
      getAccessToken: async function (onSuccess) {
        // const res = autodeskAuth()
        const accesToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJjb2RlOmFsbCIsImRhdGE6d3JpdGUiLCJkYXRhOnJlYWQiLCJidWNrZXQ6Y3JlYXRlIiwiYnVja2V0OmRlbGV0ZSIsImJ1Y2tldDpyZWFkIl0sImNsaWVudF9pZCI6ImFHNENYQTRHWjVFTUJtZkVPRGtubEhGTW40WG9Bd1I1IiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2Fqd3RleHA2MCIsImp0aSI6IktGZ1BoUE9mSWZxSFZQQ2xzQ0QwaUNUQjUyWm9vUkNUTzV5emdmejJ3QzFCcnFuWmlVZ3BhSWZZSENsckpQWUEiLCJleHAiOjE2NzQzMDE4Nzd9.Jzbv4AgmsEPNbEdYChfPIAy9Ds4dv4CeN5ej-WW0Ksd9R0uo1HxDp55x02uCiuR53_3ZVOinq-lTgtsHogt4Hd_KjVfpXFwigW8FNDgQevElZ8jv430r_iSSWoAd4kfdbUYWtiFKZb300sPwX3ZUMRb7Bc9JXzoNRM3nkRuhEh1Hw2n1t_5ukjL-LUpJUDeTENHzFVJAe-So0LLE07YdPqT0nnVaqsixdgtJf94_-YZbjvAzSdKn66uCydJb9fbmrJI70cpe0-wd32TSY55eliMwpMWOqEc_qVq7EZ7x-cSDTUXinRgOMQNPQ1oJyE5VyCRbb0vmkYJrI4nhiWmklQ"
        const expires = "3599";
        onSuccess(accesToken, expires);
      },
    };

    Autodesk.Viewing.Initializer(options, this.initializerCallBack.bind(this));
    // this.registerCustomExtension()
  }

  initializerCallBack() {
    console.log("Inside Initializer call back");

    console.log(`ViewerID: ${this.viewerId}`);
    var htmlDiv = document.getElementById(this.viewerId);
    const config3d = {
      extensions: [
        // 'Autodesk.Edit2D',
        // 'Autodesk.Viewing.MarkupsCore',
        // 'Autodesk.Measure'
        'Autodesk.PDF',
        'Autodesk.Geolocation',
        "Autodesk.DataVisualization",
        // "ConstructNTools",
      ],
    };
    this.forgeViewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, config3d);
    this.setUpEventListeners();
    var startedCode = this.forgeViewer.start();
    this.forgeViewer.canvasId = self.viewerId;
    if (startedCode > 0) {
      console.error("Failed to create a Viewer: WebGL not supported.");
      return;
    }
    console.log("Initialization complete, loading a model next...");
    // await loadModel(forgeViewer);
  }

  onViewerInitialized() {
    console.log(`Viewer Initialized: Loading Model now`);
    this.isViewerInitialized = true;
    this.loadModel();
    // this.forgeViewer.loadModel("PDFs/A3_from_bim.pdf", this.generateModelOptions());
  }

  isViewerLoaded() {
    return this.isViewerInitialized;
  }

  loadModel() {
    console.log(`Inside loadModel: ${this.documentURNs}`);
    const modelOptions = {applyScaling: 'm'}; //Akshith test options
		modelOptions.globalOffset = { x: 0, y: 0, z: 0 };
    this.documentURNs.map((urn) => {
      console.log("Test URN", urn.urn)
      Autodesk.Viewing.Document.load(
        urn.urn,
        function (viewerDocument) {
          console.log("Test TM:", urn.tm)
          var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
          console.log("is3D: ", defaultModel.is3D())
          this.forgeViewer.loadDocumentNode(
            viewerDocument, 
            defaultModel,
            this.generateModelOptions(urn.tm)
          );
        }.bind(this),
        function () {
          console.error("Failed fetching Forge manifest");
        }
      );
    })
  }

  generateModelOptions(tm) {

    console.log("Inside modeloptions:", tm)
    var mx = new THREE.Matrix4();
    // mx.fromArray([10,0,0,10,0,10,0,10,0,0,10,10,0,0,0,1]).transpose()
    mx.fromArray([10.709603309631, 1.489653229713, 0.000000000000, 385315.343750000000,
      -1.489653229713, 10.709603309631, 0.000000000000, 2049716.750000000000,
      0.000000000000, 0.000000000000, 10.812708854675, 0.000000000000,
      0.000000000000, 0.000000000000, 0.000000000000, 1.000000000000]).transpose()
    
  // mx.makeRotationZ(90 * Math.PI / 180);
  // mx.setPosition({x:10,y:10,z:10}) 
  // mx.makeTranslation({x:10,y:10})
  // mx.makeScale(
  //   10, // 201.84
  //   10, // 285.6
  //   10)
    console.log("matrix: ", mx)
    const modelOptions = {
      applyScaling: 'm',
      page: 1,
      // preserveView: true,
      // modelSpace: true,
      keepCurrentModels: true,
      leafletOptions: {
        fitPaperSize: true,
        // paperWidth: 841,
        // paperHeight: 1190
      },
      placementTransform: new THREE.Matrix4().fromArray(tm).transpose()
    };

    modelOptions.globalOffset = { x: 0, y: 0, z: 0 };
    let globalOff = [0, 0, 0];

    // if (this.tm_json.tm) {
    //   modelOptions.placementTransform = new THREE.Matrix4().fromArray(this.tm_json.tm).transpose();
    //   // modelOptions.placementTransform = (new THREE.Matrix4()).setPosition({x:50,y:0,z:-50})
    //   // modelOptions.placementTransform = new THREE.Matrix4().fromArray([0.216,1.022,-0.007,367033.477,-1.022,0.216,-0.001,2053135.281,-0.000,0.007,1.045,-57.5,0.000,0.000,0.000,1.000]).transpose()
    //   console.log('BIM TM Loaded');
    // }

    // if (this.tm_json.offset) {
    //   globalOff = this.tm_json.offset;
    //   // modelOptions.globalOffset = { x: globalOff[0], y: globalOff[1], z: globalOff[2] };
    //   // modelOptions.globalOffset = { x: 0, y: 0, z: 0 };
    //   console.log('Offset Loaded');
    // }

    return modelOptions;
  }

  onLoadFileEvent(parameter) {
    console.log(`Inside Load File Event: ${parameter.loader}`);
    console.log("Inside Load File Event: ", parameter.loader)
  }

  onLoadErrorEvent(parameter) {
    console.log(
      `Inside Load Error Event: ${parameter.loader} error: ${parameter.error} `
    );
  }

  onModelRootLoadedEvent(parameter) {
    console.log(
      `Inside Model Root Loaded Event: SVF: ${parameter.svf} model: ${parameter.model}`
    );
  }

  onModelAddedEvent(parameter) {
    console.log(`Inside Model added Event: model: ${parameter.model}`);
  }

  onModelLayersLoadedEvent(parameter) {
    console.log(
      `Inside Model Layers loaded Event: model: ${parameter.model} root: ${parameter.root} `
    );
    this.loadExtension();
  }

  onGeometryLoadedEvent(parameter) {
    console.log(`Inside Geometry Loaded Event: model: ${parameter.model}`);
  }

  onExtensionPreLoadedEvent(parameter) {
    console.log(`Inside Extension Pre Loaded Event: ${parameter.extensionId}`);
  }

  onExtensionLoadedEvent(parameter) {
    console.log(`Inside Extension Loaded Event: ${parameter.extensionId}`);
  }

  onExtensionPreUnLoadedEvent(parameter) {
    console.log(
      `Inside Extension Pre UnLoaded Event: ${parameter.extensionId}`
    );
  }

  onExtensionUnLoadedEvent(parameter) {
    console.log(`Inside Extension UnLoaded Event: ${parameter.extensionId}`);
  }

  onExtensionPreActivatedEvent(parameter) {
    console.log(
      `Inside Extension Pre Activated Event: ${parameter.extensionId} mode: ${parameter.mode}`
    );
  }

  onExtensionActivatedEvent(parameter) {
    console.log(
      `Inside Extension Activated Event: ${parameter.extensionId} mode: ${parameter.mode}`
    );
  }

  onExtensionPreDeActivatedEvent(parameter) {
    console.log(
      `Inside Extension Pre DeActivated Event: ${parameter.extensionId}`
    );
  }

  onExtensionDeActivatedEvent(parameter) {
    console.log(`Inside Extension DeActivated Event: ${parameter.extensionId}`);
  }

  onToolChangeEvent(parameter) {
    console.log(
      `Inside Tool change event: name: ${parameter.toolName} isActive: ${parameter.active} tool: `, parameter.tool
    );
  }

  onClickEventOnContainer(ev) {
    const result = this.forgeViewer.clientToWorld(ev.clientX, ev.clientY);
    if (result) {
      console.log('Click Point', result.point);
    }
  }

  setUpEventListeners() {
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.VIEWER_INITIALIZED,
      this.onViewerInitialized.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.LOADER_LOAD_FILE_EVENT,
      this.onLoadFileEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.LOADER_LOAD_ERROR_EVENT,
      this.onLoadErrorEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT,
      this.onModelRootLoadedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.MODEL_ADDED_EVENT,
      this.onModelAddedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.MODEL_LAYERS_LOADED_EVENT,
      this.onModelLayersLoadedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      this.onGeometryLoadedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.EXTENSION_PRE_LOADED_EVENT,
      this.onExtensionPreLoadedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.EXTENSION_LOADED_EVENT,
      this.onExtensionLoadedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.EXTENSION_PRE_UNLOADED_EVENT,
      this.onExtensionPreUnLoadedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.EXTENSION_UNLOADED_EVENT,
      this.onExtensionUnLoadedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.EXTENSION_PRE_ACTIVATED_EVENT,
      this.onExtensionPreActivatedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.EXTENSION_ACTIVATED_EVENT,
      this.onExtensionActivatedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.EXTENSION_PRE_DEACTIVATED_EVENT,
      this.onExtensionPreDeActivatedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.EXTENSION_DEACTIVATED_EVENT,
      this.onExtensionDeActivatedEvent.bind(this)
    );
    this.forgeViewer.addEventListener(
      Autodesk.Viewing.TOOL_CHANGE_EVENT,
      this.onToolChangeEvent.bind(this)
    );

    this.forgeViewer.container.addEventListener('click', this.onClickEventOnContainer.bind(this));
  }

  async loadExtension() {
    const edit2d = await this.forgeViewer.loadExtension("Autodesk.Edit2D");
    const geoExtension = await this.forgeViewer.getExtensionAsync(
      "Autodesk.Geolocation"
    );
    const dataVizExtn = await this.forgeViewer.getExtensionAsync(
      "Autodesk.DataVisualization"
    );
    // const constructnExt = await this.forgeViewer.getExtensionAsync(
    //   "ConstructNTools"
    // );
    // console.log(`Load Async constructnExtension: ${constructnExt}`);
    // console.log(`Load Async dataVizExtension: ${dataVizExtn}`);


    // Register all standard tools in default configuration
    edit2d.registerDefaultTools();

    const ctx = edit2d.defaultContext;

    let layer = ctx.layer;
    let tools = edit2d.defaultTools;
    // console.log(`Checking tools object: ${tools}` + tools);
    let selection = ctx.selection;

    selection.addEventListener(
      Autodesk.Edit2D.Selection.Events.SELECTION_CHANGED,
      this.onEdit2dSelectionChanged
    );
    selection.addEventListener(
      Autodesk.Edit2D.Selection.Events.SELECTION_HOVER_CHANGED,
      this.onEdit2dHoverChanged
    );

    var box = this.forgeViewer.model.getBoundingBox();
    console.log(`min:${box.min.x},${box.min.x} ,max:${box.max.x},${box.max.y}`);
    this.startTool(tools.polygonEditTool);

    console.log(`Display Unit: ${this.forgeViewer.model.getDisplayUnit()}`)
    console.log(`Unit String: ${this.forgeViewer.model.getUnitString()}`)
    console.log(`Unit Scale: ${this.forgeViewer.model.getUnitScale()}`)
    console.log("", this.forgeViewer.model.isLeaflet());
    console.log("Model transform: ", this.forgeViewer.model.getModelTransform());
    console.log(`isPageCoordinates: ${this.forgeViewer.model.isPageCoordinates()}`)

    // let poly = this.getPolyLineShape();
    // let circleShapes = this.getCircleShapes();
    // let path = this.getPathShapes();
    // let path = this.getSVGShape();
    // let path2d = this.getPath2DShapes();
    // layer.addShape(poly);
    // layer.addShapes(circleShapes);
    // layer.addShape(path);
    // var style = path.style;
    // style.fillColor = "rgb(255,0,0)";
    // style.fillAlpha = 0.3;
    // style.lineWidth = 1.0;
    // style.lineStyle = 18;

    // // show changes
    // layer.update();
    // layer.update();
    // selection.setSelection([poly]);
    // selection.modified();
    this.getActiveTool();
    this.loadSprite(dataVizExtn);
    // edit2d.unregisterDefaultTools();
    // constructnExt.activate();
    // geoExtension.activate();
    // console.log(`Has geolocation: ${geoExtension.hasGeolocationData()}`);
    // this.getActiveTool();
  }

  // getPath2DShapes() {
  //   var path = new Path2D();

  // }

  loadSprite(dataVizExtn) {
    const DataVizCore = Autodesk.DataVisualization.Core;
    const viewableType = DataVizCore.ViewableType.SPRITE;
    const spriteColor = new THREE.Color(0xffffff);
    // const baseURL = "http://localhost:9081/images/";
    const spriteIconUrl =
      "https://img.icons8.com/color/48/000000/electrical-sensor.png";

    const style = new DataVizCore.ViewableStyle(
      viewableType,
      spriteColor,
      spriteIconUrl
    );

    this.loadViewableData(DataVizCore, dataVizExtn, style);
  }

  async loadViewableData(DataVizCore, dataVizExtn, style) {
    const viewableData = new DataVizCore.ViewableData();
    viewableData.spriteSize = 24; // Sprites as points of size 24 x 24 pixels

    const myDataList = [
      { position: {x: 385387.48781699024, y:2049811.5040732909, z:95.79301855560584}}, // "DT_VID_20221222_125011_00_160IMG_636.JPG"
      { position: { x:385388.0634398281, y:2049810.764701934, z:95.80095614319397} }, // "DT_VID_20221222_125011_00_160IMG_634.JPG"
      { position: { x:385383.07042181026, y:2049778.5836000163, z:95.86333169023112}} //"DT_VID_20221222_125011_00_160IMG_930.JPG"
  
    ];

    myDataList.forEach((myData, index) => {
      const dbId = 10 + index;
      const position = myData.position;
      const viewable = new DataVizCore.SpriteViewable(position, style, dbId);

      viewableData.addViewable(viewable);
    });

    // viewableData.finish().then(() => {
    //   dataVizExtn.addViewables(viewableData);
    // });
    await this.addViewableData(viewableData, dataVizExtn)

  }

  async addViewableData(viewableData, dataVizExtn) {
    await viewableData.finish();
    dataVizExtn.addViewables(viewableData);
  }

  removeViewableData() {
    dataVizExtn.removeAllViewables();
  }

  getSVGShape() {
    const svgString =
      '<path d="M100.94,110.75a.74.74,0,0,1-.53-.22l-2-2.06a.74.74,0,0,1,0-1.06.75.75,0,0,1,1.06,0l101.52,100.53L115.58,208.3a.75.75,0,0,1,1.06,0,.74.74,0,0,1,0,1.06l-6.17,6.17A.73.73,0,0,1,9.94,15.75ZM21.75,12A9.75,9.75,0,1,0,12,21.75,9.76,9.76,0,0,0,21.75,12Zm-1.5,0A8.25,8.25,0,1,1,12,3.75,8.26,8.26,0,0,1,20.25,12Z" fill="currentColor"></path>';
    const shape = Autodesk.Edit2D.Shape.fromSVG(svgString);
    return shape;
  }

  getPathShapes() {
    var poly = new Autodesk.Edit2D.PolylinePath([
      { x: 100, y: 200 },
      { x: 150, y: 200 },
      { x: 125, y: 100 },
    ]);

    return poly;
  }

  getCircleShapes() {
    let circle1 = new Autodesk.Edit2D.Circle(200, 200);
    let circle2 = new Autodesk.Edit2D.Circle(210, 210);
    let circle3 = new Autodesk.Edit2D.Circle(220, 220);

    return [circle1, circle2, circle3];
  }

  getPolyLineShape() {
    var poly = new Autodesk.Edit2D.Polygon([
      { x: 100, y: 200 },
      { x: 150, y: 200 },
      { x: 125, y: 100 },
    ]);

    console.log(`Inside Poly shape: ${poly.selectable}`);
    return poly;
  }

  getActiveTool() {
    var controller = this.forgeViewer.toolController;
    var activeTool = controller.getActiveTool();

    if (activeTool) {
      console.log(`Inside getActiveTool: ${activeTool.getName()}`);
    }
  }

  onEdit2dSelectionChanged() {
    console.log(`Inside on Edit2d Selection Changed: `);
  }

  onEdit2dHoverChanged() {
    console.log(`Inside on Edit2d Hover Changed: `);
  }

  startTool(tool) {
    var controller = this.forgeViewer.toolController;

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

  shutdown() {
    this.isViewerInitialized = false;
    Autodesk.Viewing.shutdown();
  }
}

