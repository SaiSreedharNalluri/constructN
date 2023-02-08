export class ForgeDataVisualization {
    static EXTENSION_ID = "Autodesk.DataVisualization";
    constructor(viewer, dataVisualizationExtension) {
        // console.log("Inside Data visualization class constructor: ")
        this.viewer = viewer;
        this.dataVizExtn = dataVisualizationExtension; 
        this.dataVizCore = Autodesk.DataVisualization.Core;
        this.viewableDataMap = {};
        this.dbIdMap = [];
        this.createTagTool = false;
        this.tagType = "Issue";
        this.viewableLength = 0;

        // window.dbIdMap = this.dbIdMap;

        this.viewableHoveringHandler = this.onSpriteHovering.bind(this);
        this.viewableClickHandler = this.onSpriteClicked.bind(this);
    }

    // static getInstance(viewer, extension) {
    //     if (!this.instance) {
    //     this.instance = new ForgeDataVisualization(viewer, extension);
    //     delete this.instance.constructor;
    //     } else {
    //         this.dataVizExtn = extension;
    //     }
    //     return this.instance;
    // }
    setHandler(handlerFunction) {
        this.handlerFunction = handlerFunction;
    }

    activateCreateTagTool(type) {
        this.createTagTool = true;
        this.tagType = type;
    }

    deactivateCreateTagTool() {
        this.createTagTool = false;
    }   

    addListeners() {
        // console.log("Inside forge data visualization addListener: ", this);
        this.viewer.addEventListener(this.dataVizCore.MOUSE_HOVERING, this.viewableHoveringHandler);
        this.viewer.addEventListener(this.dataVizCore.MOUSE_CLICK, this.viewableClickHandler);
    }

    removeListeners() {
        // console.log("Inside forge data visualization removeListeners: ", this.viewer);
        this.viewer.removeEventListener(this.dataVizCore.MOUSE_HOVERING, this.viewableHoveringHandler);
        this.viewer.removeEventListener(this.dataVizCore.MOUSE_CLICK, this.viewableClickHandler);
    }

    addVisualizationData(visualizationData) {
        let dbId = this.viewableLength + 1;
        for (const viewableType in visualizationData) {
            let viewableData = this.getViewableData(viewableType);
            let viewableStyle = this.getViewableStyle(viewableType);
            switch (viewableType) {
                case "360 Image":
                case "Phone Image":
                case "360 Video":
                    for (const positionData in visualizationData[viewableType]) {
                        let positionArray = visualizationData[viewableType][positionData].position;
                        let rotationArray = visualizationData[viewableType][positionData].rotation;
                        let dbIdObject = {
                            dbId: dbId++,
                            type: viewableType,
                            name: positionData,
                            position: {x: positionArray[0], y: positionArray[1], z: positionArray[2]},
                            rotation: {yaw: rotationArray[0], pitch: rotationArray[1], roll:rotationArray[2]}
                        }
                        this.dbIdMap[dbIdObject.dbId] = dbIdObject;
                        const viewable = new this.dataVizCore.SpriteViewable(dbIdObject.position, viewableStyle, dbIdObject.dbId);
                        viewableData.addViewable(viewable);
                    }
                    break;
                case "Drone Image":
                    
                    break;


            }   
            this.viewableLength = dbId - 1;
            this.viewableDataMap[viewableType] = viewableData;
        }
        console.log("Viewable data map: ", this.viewableLength);
        console.log("Viewable data map: ", this.viewableDataMap);
        
        this.addListeners();
        this.loadViewableData();
    }

    addTrackersData( ) {

    }

    getViewableStyle(iconType) {
        const viewableType = this.dataVizCore.ViewableType.SPRITE;
        const spriteColor = new THREE.Color(0xffffff);

        let iconUrl = "";
        switch (iconType) {
            case 'Drone Image':
                // iconUrl = "https://img.icons8.com/external-kosonicon-solid-kosonicon/96/null/external-drone-drone-aircraft-and-aerial-kosonicon-solid-kosonicon-8.png";
                iconUrl ="https://img.icons8.com/material-outlined/24/null/new-moon.png";
            break;
            case '360 Video':
                // iconUrl = "https://img.icons8.com/ios-glyphs/90/null/360-view.png";
                // iconUrl ="https://img.icons8.com/material-outlined/24/null/new-moon.png";
                iconUrl = "/icons/360VideoWalkInViewer.svg";
            break;
            case '360 Image':
                iconUrl = "/icons/360ImageInViewer.svg";
                break;
            case 'Phone Image':
                iconUrl = "/icons/phoneImageInViewer.svg";
                break;
            case 'Issue':
                iconUrl = "/icons/issuesInViewer.svg";
            break;
            case 'Task':
                iconUrl = "/icons/tasksInViewer.svg";
            break

        }

        return new this.dataVizCore.ViewableStyle(
            viewableType,
            spriteColor,
            iconUrl
          );
    }

    getViewableData(type) {
        const viewableData = new this.dataVizCore.ViewableData();
        switch (type) {
            case '360 Image':
                viewableData.spriteSize = 100;
                break;
            case '360 Video':
                viewableData.spriteSize = 6;
                break;
            case 'Phone Image':
                viewableData.spriteSize = 100;
                break;
        }
         // Sprites as points of size 24 x 24 pixels
        
        return viewableData;
    }

    async loadViewableData() {
        for (let viewableData in this.viewableDataMap) {
            console.log("Awaiting viewable data finish: ", viewableData);
            await this.viewableDataMap[viewableData].finish(); 
            this.dataVizExtn.addViewables(this.viewableDataMap[viewableData]);
        }
    }

    async loadTempViewableData() {

    }

    async createTempViewable(type, event) {

        let viewport = this.viewer.container.getBoundingClientRect();
        let canvasX = event.originalEvent.clientX - viewport.left;
        let canvasY = event.originalEvent.clientY - viewport.top;
        let result = this.viewer.clientToWorld(canvasX, canvasY);

        if (result) {
            let viewableData = this.getViewableData();
            let viewableStyle = this.getViewableStyle(type);
            let dbIdObject = {
                dbId: ++this.viewableLength,
                name: `Temp ${type}`,
                type: type,
                position: {x:result.point.x, y:result.point.y, z:result.point.z},
                pitch: null,
                yaw: null
            }
            this.dbIdMap[dbIdObject.dbId] = dbIdObject;


            const viewable = new this.dataVizCore.SpriteViewable(dbIdObject.position, viewableStyle, dbIdObject.dbId);
            viewableData.addViewable(viewable);

            await viewableData.finish();
            this.dataVizExtn.addViewables(viewableData);

            this.handlerFunction(event, dbIdObject);
        }
    }

    clearTempViewables() {
        this.removeViewableData();
        this.loadViewableData();
    }

    onSpriteHovering(event) {
        const targetDbId = event.dbId;

        // console.log("Hovering dbId: ", targetDbId);

        // if (event.hovering) {
        //     console.log(`The mouse hovers over ${this.dbIdMap[targetDbId].name}`);
        // } else {
        //     console.log(`The mouse hovers off ${this.dbIdMap[targetDbId].name}`);
        // }
        if (targetDbId > 0) {
            this.passToViewerHandler(event);
        }
    }
    
    onSpriteClicked(event) {
        const targetDbId = event.dbId;
        // console.log("Inside data viz utils: selected dbId: ", targetDbId);
        // console.log(`Sprite clicked: ${this.dbIdMap[targetDbId].name}`);
        if (targetDbId > 0) {
            this.passToViewerHandler(event);
        } else if (this.createTagTool) {
            this.createTempViewable(this.tagType, event);
        }

    }

    passToViewerHandler(event) {
        
        let dbObject = this.dbIdMap[event.dbId];
        // console.log("Inside selected dbId object: ", this.dbIdMap, dbObject);

        this.handlerFunction(event, dbObject);
    }

    removeExistingVisualizationData() {
        if(this.viewableDataMap && Object.keys(this.viewableDataMap).length > 0) {
            this.removeViewableData();
            this.viewableDataMap = {};
            this.dbIdMap = [];
        }
        this.removeListeners();
        
    }

    removeViewableData() {
        this.dataVizExtn.removeAllViewables();
    }
}