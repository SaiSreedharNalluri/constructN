export class ForgeViewerUtils {
	constructor(viewerId, modelURN) {
    this.viewerId = viewerId
    this.modelURN = modelURN
    console.log(`ViewerID: ${this.viewerId}`)
	}



	initialize() {

    console.log(`Inside Initializer ViewerID: ${this.viewerId}`)
		var options = {
			env: 'AutodeskProduction2', //Local, AutodeskProduction, AutodeskProduction2
			api: 'streamingV2',  // for models uploaded to EMEA change this option to 'derivativeV2_EU'
			getAccessToken: async function (onSuccess) {
				// const res = autodeskAuth()
				const accesToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJjb2RlOmFsbCIsImRhdGE6d3JpdGUiLCJkYXRhOnJlYWQiLCJidWNrZXQ6Y3JlYXRlIiwiYnVja2V0OmRlbGV0ZSIsImJ1Y2tldDpyZWFkIl0sImNsaWVudF9pZCI6ImFHNENYQTRHWjVFTUJtZkVPRGtubEhGTW40WG9Bd1I1IiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2Fqd3RleHA2MCIsImp0aSI6IjVzRTJhNGt0bHJyeWZCZ0ZXOExrcmdFa05HeHRLSmU3enRld1FYU1BQR1VPVmE3bmhlNUZpUVVIbE1aanpOaVMiLCJleHAiOjE2NzMyOTAzNzV9.KetU3y7o5uJTz5w_17XiO2Rzyk76Eqo9oE2pJRmFNbestYn_Ohe_SYqXXERfHsZ2JsqTZhf7y7Vl7kT7QcmlIZS_K47c0E6bT2nmm6PzAEzzz2UzBRUytXXx6NcXqctUHWWZDb26G_PIqC3HgyhX5KF7XYV0BfGzo6ypTbTsXI9mYenhKp5eGaaQ0jW1N0O87GJwdARCi4XGeSpAuc_lISwfkgm8K852_k9DJQIzq3lJwMx3UTpov0HjtoLiy-RpZSCXOmSvguJgsQlU18TEoYnms5xsgTPJGKWk6CbMo54zvpLXG8z2YsSMKAdvAFLZGeik86elZMegKj-YdsIHyg"
        const expires = "3599"
				onSuccess(accesToken, expires);
			}
		};

		Autodesk.Viewing.Initializer(options, this.initializerCallBack.bind(this));
	}

  initializerCallBack() {
    console.log("Inside Initializer call back")
    
    console.log(`ViewerID: ${this.viewerId}`)
    var htmlDiv = document.getElementById(this.viewerId);
    const config3d = {
    // extensions: ['Autodesk.Edit2D', 
    // 'Autodesk.Viewing.MarkupsCore', 
    // 'Autodesk.Measure']
    }
    this.forgeViewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, config3d);
    this.setUpEventListeners();
    var startedCode = this.forgeViewer.start();
    this.forgeViewer.canvasId = self.viewerId;
    if (startedCode > 0) {
    console.error('Failed to create a Viewer: WebGL not supported.');
    return;
    }
    console.log('Initialization complete, loading a model next...');
    // await loadModel(forgeViewer);
  }

  onViewerInitialized() {
    console.log(`Viewer Initialized: Loading Model now`)
    this.loadModel()
  }

  loadModel() {
    console.log(`Inside loadModel: ${this.modelURN}`)
    Autodesk.Viewing.Document.load(this.modelURN, 
      async function(viewerDocument) {
      var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
      this.forgeViewer.loadDocumentNode(viewerDocument, defaultModel)
      
    }.bind(this), function () {
      console.error('Failed fetching Forge manifest');
    });
    // await loadExtension(viewer);
  }

  onLoadFileEvent(parameter) {
    console.log(`Inside Load File Event: ${parameter.loader}`)
  }

  onLoadErrorEvent(parameter) {
    console.log(`Inside Load Error Event: ${parameter.loader} error: ${parameter.error} `)
  }

  onModelRootLoadedEvent(parameter) {
    console.log(`Inside Model Root Loaded Event: SVF: ${parameter.svf} model: ${parameter.model}`);
  }

  onModelAddedEvent(parameter) {
    console.log(`Inside Model added Event: model: ${parameter.model}`);
  }

  onModelLayersLoadedEvent(parameter) {
    console.log(`Inside Model Layers loaded Event: model: ${parameter.model} root: ${parameter.root} `);
    this.loadExtension()
  }

  onGeometryLoadedEvent(parameter) {
    console.log(`Inside Geometry Loaded Event: model: ${parameter.model}`);
  }

  onExtensionPreLoadedEvent(parameter) {
    console.log(`Inside Extension Pre Loaded Event: ${parameter.extensionId}`)
  }

  onExtensionLoadedEvent(parameter) {
    console.log(`Inside Extension Loaded Event: ${parameter.extensionId}`)
  }
  
  onExtensionPreUnLoadedEvent(parameter) {
    console.log(`Inside Extension Pre UnLoaded Event: ${parameter.extensionId}`)
  }

  onExtensionUnLoadedEvent(parameter) {
    console.log(`Inside Extension UnLoaded Event: ${parameter.extensionId}`)
  }

  onExtensionPreActivatedEvent(parameter) {
    console.log(`Inside Extension Pre Activated Event: ${parameter.extensionId} mode: ${parameter.mode}`)
  }

  onExtensionActivatedEvent(parameter) {
    console.log(`Inside Extension Activated Event: ${parameter.extensionId} mode: ${parameter.mode}`)
  }
  
  onExtensionPreDeActivatedEvent(parameter) {
    console.log(`Inside Extension Pre DeActivated Event: ${parameter.extensionId}`)
  }
  
  onExtensionDeActivatedEvent(parameter) {
    console.log(`Inside Extension DeActivated Event: ${parameter.extensionId}`)
  }

  setUpEventListeners() {
		this.forgeViewer.addEventListener(Autodesk.Viewing.VIEWER_INITIALIZED, this.onViewerInitialized.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.LOADER_LOAD_FILE_EVENT, this.onLoadFileEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.LOADER_LOAD_ERROR_EVENT, this.onLoadErrorEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, this.onModelRootLoadedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.MODEL_ADDED_EVENT, this.onModelAddedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.MODEL_LAYERS_LOADED_EVENT, this.onModelLayersLoadedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onGeometryLoadedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.EXTENSION_PRE_LOADED_EVENT, this.onExtensionPreLoadedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.EXTENSION_LOADED_EVENT, this.onExtensionLoadedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.EXTENSION_PRE_UNLOADED_EVENT, this.onExtensionPreUnLoadedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.EXTENSION_UNLOADED_EVENT, this.onExtensionUnLoadedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.EXTENSION_PRE_ACTIVATED_EVENT, this.onExtensionPreActivatedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.EXTENSION_ACTIVATED_EVENT, this.onExtensionActivatedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.EXTENSION_PRE_DEACTIVATED_EVENT, this.onExtensionPreDeActivatedEvent.bind(this));
    this.forgeViewer.addEventListener(Autodesk.Viewing.EXTENSION_DEACTIVATED_EVENT, this.onExtensionDeActivatedEvent.bind(this));
	}

  async loadExtension() {
    const edit2d = await this.forgeViewer.loadExtension('Autodesk.Edit2D');
    // const markupCore = await this.forgeViewer.loadExtension('Autodesk.Viewing.MarkupsCore');
    // const measure = await this.forgeViewer.loadExtension('Autodesk.Measure');
    await this.forgeViewer.getExtension('Autodesk.Measure', function(extension) {
      extension.activate();
    })
  
    // Register all standard tools in default configuration
    edit2d.registerDefaultTools();
    // measure.activate();
  
    const ctx = edit2d.defaultContext;
  
    let layer = ctx.layer;
    let tools  = edit2d.defaultTools;
    console.log(`Checking tools object: ${tools}` + tools);
    let selection = ctx.selection

    selection.addEventListener(Autodesk.Edit2D.Selection.Events.SELECTION_CHANGED, this.onEdit2dSelectionChanged);
    selection.addEventListener(Autodesk.Edit2D.Selection.Events.SELECTION_HOVER_CHANGED, this.onEdit2dHoverChanged)
  
    var box = this.forgeViewer.model.getBoundingBox();
    console.log(`min:${box.min.x},${box.min.x} ,max:${box.max.x},${box.max.y}`)
    // startTool(tools.polygonTool)
    let poly = this.getPolyLineShape();
    layer.addShape(poly)
    selection.setSelection(poly);
    
  }
  
  getPolyLineShape() {
    var poly = new Autodesk.Edit2D.Polygon([
      {x: .2, y: .5},
      {x: .4, y: .5},
      {x: .2, y: .8}
    ]);

    return poly
  }

  onEdit2dSelectionChanged() {
    console.log(`Inside on Edit2d Selection Changed: `);
  }

  onEdit2dHoverChanged() {
    console.log(`Inside on Edit2d Hover Changed: `);
    
  }
}

