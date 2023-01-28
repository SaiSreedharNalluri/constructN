export class ForgeDataVisualization {
    static EXTENSION_ID = "Autodesk.DataVisualization";
    constructor(dataVisualizationExtension) {
        this.dataVizExtn = dataVisualizationExtension; 
        this.dataVizCore = Autodesk.DataVisualization.Core;
        this.viewableDataMap = {};
        this.dbIdMap = {};
    }

    static getInstance(extension) {
        if (!this.instance) {
        this.instance = new ForgeDataVisualization(extension);
        delete this.instance.constructor;
        } else {
            this.dataVizExtn = extension;
        }
        return this.instance;
    }

    addVisualizationData(visualizationData) {
        let dbId = 0;
        for (const viewableType in visualizationData) {
            let viewableData = this.getViewableData();
            let viewableStyle = this.getViewableStyle(viewableType);
            switch (viewableType) {
                case "360 Video":
                    for (const positionData in visualizationData[viewableType]) {
                        let positionArray = visualizationData[viewableType][positionData].position;
                        let rotationArray = visualizationData[viewableType][positionData].rotation;
                        let dbIdObject = {
                            dbId: dbId++,
                            name: positionData,
                            position: {x: positionArray[0], y: positionArray[1], z: positionArray[2]},
                            rotation: {x: rotationArray[0], y: rotationArray[1], z: rotationArray[2]}
                        }
                        this.dbIdMap[dbIdObject.dbId] = dbIdObject;
                        const viewable = new this.dataVizCore.SpriteViewable(dbIdObject.position, viewableStyle, dbIdObject.dbId);
                        viewableData.addViewable(viewable);
                    }
                    break;
                case "Drone Image":
                    
                    break;


            }   

            this.viewableDataMap[viewableType] = viewableData;
        }
        console.log("Viewable data map: ", this.viewableDataMap);
        
        this.loadViewableData();
    }

    getViewableStyle(iconType) {
        const viewableType = this.dataVizCore.ViewableType.SPRITE;
        const spriteColor = new THREE.Color(0xffffff);

        let iconUrl = "";
        switch (iconType) {
            case 'Drone Image':
                iconUrl = "https://img.icons8.com/external-kosonicon-solid-kosonicon/96/null/external-drone-drone-aircraft-and-aerial-kosonicon-solid-kosonicon-8.png";
            break;
            case '360 Video':
                iconUrl = "https://img.icons8.com/ios-glyphs/90/null/360-view.png";
            break;

        }

        return new this.dataVizCore.ViewableStyle(
            viewableType,
            spriteColor,
            iconUrl
          );
    }

    getViewableData() {
        const viewableData = new this.dataVizCore.ViewableData();
        viewableData.spriteSize = 50; // Sprites as points of size 24 x 24 pixels
        
        return viewableData;
    }

    async loadViewableData() {
        for (let viewableData in this.viewableDataMap) {
            console.log("Awaiting viewable data finish: ", viewableData);
            await this.viewableDataMap[viewableData].finish(); 
            this.dataVizExtn.addViewables(this.viewableDataMap[viewableData]);
        }
    }

    removeExistingVisualizationData() {
        this.removeViewableData();
        this.viewableDataMap = {};
        this.dbIdMap = {};
    }

    removeViewableData() {
        this.dataVizExtn.removeAllViewables();
    }
}