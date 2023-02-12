import { faBreadSlice } from "@fortawesome/free-solid-svg-icons";

export class ForgeDataVisualization {
    static EXTENSION_ID = "Autodesk.DataVisualization";
    constructor(viewer, dataVisualizationExtension) {
        // console.log("Inside Data visualization class constructor: ")
        this.viewer = viewer;
        this.dataVizExtn = dataVisualizationExtension; 
        this.dataVizCore = Autodesk.DataVisualization.Core;
        this.viewableDataMap = {};
        this.dbIdArray = [];
        this.tempDbIdArray = [];
        this.createTagTool = false;
        this.tagType = "Issue";
        this.viewableLength = 0;
        this.tempViewableLength = 0;
        this.viewableState = {};
        this.trackerState = {};

        // window.dbIdMap = this.dbIdMap;

    
        this.setOcclusion(true);
        this.viewableHoveringHandler = this.onSpriteHovering.bind(this);
        this.viewableClickHandler = this.onSpriteClicked.bind(this);
        this.viewableClickOutHandler = this.onSpriteClickedOut.bind(this);
    }

    setOcclusion(enable) {
        this.dataVizExtn.changeOcclusion(enable);
    }

    setOffset(offset) {
        this.offset = offset;
    }
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

    selectTag(tag) {
        let selectedViewable;
        for(const viewable of this.dbIdArray) {
            if(!viewable) {
                continue;
            }
            if(viewable.id === tag.id) {
                selectedViewable = viewable;
                break;
            }
        }
        this.handleSelection(selectedViewable.dbId);
    }

    addListeners() {
        // console.log("Inside forge data visualization addListener: ", this);
        this.viewer.addEventListener(this.dataVizCore.MOUSE_HOVERING, this.viewableHoveringHandler);
        this.viewer.addEventListener(this.dataVizCore.MOUSE_CLICK, this.viewableClickHandler);
        this.viewer.addEventListener(this.dataVizCore.MOUSE_CLICK_OUT, this.viewableClickOutHandler);
    }

    removeListeners() {
        // console.log("Inside forge data visualization removeListeners: ", this.viewer);
        this.viewer.removeEventListener(this.dataVizCore.MOUSE_HOVERING, this.viewableHoveringHandler);
        this.viewer.removeEventListener(this.dataVizCore.MOUSE_CLICK, this.viewableClickHandler);
    }

    addMediaData(visualizationData) {
        this.mediaMap = visualizationData;
        this.formatDataMap(this.mediaMap);
    }

    addTrackersData(issueData, taskData) {
        let trackerMap = {};
        if (issueData && issueData.length > 0) {
            trackerMap["Issue"] = issueData;
        }

        if (taskData && taskData.length > 0) {
            trackerMap["Task"] = taskData;
        }

        this.trackerMap = trackerMap;
        this.formatDataMap(this.trackerMap);
    }

    setViewableState(viewableList) {
        console.log("Inside set Viewable state: ", viewableList)
        if (!viewableList) {
            return;
        }
        for(const viewableType in this.viewableState) {
            let show = viewableList.find((e) => e === viewableType);
            if (show) {
                this.viewableState[viewableType] = true;
            } else {
                this.viewableState[viewableType] = false;
            }
        }
    }

    showTracker(type, show) {
        if (type in this.trackerState) {
            this.trackerState[type] = show;
        }
    }

    formatDataMap(visualizationData) {
        let dbId = this.viewableLength + 1;
        for (const viewableType in visualizationData) {
            delete this.viewableDataMap[viewableType];
            this.viewableDataMap[viewableType] = {};
            switch (viewableType) {
                case "360 Image":
                case "Phone Image":
                case "360 Video":
                    for (const positionData in visualizationData[viewableType]) {
                        let positionArray = visualizationData[viewableType][positionData].position;
                        let dbIdObject = {
                            dbId: dbId++,
                            type: viewableType,
                            id: positionData,
                            position: this.applyOffset({x: positionArray[0], y: positionArray[1], z: positionArray[2]}, this.offset),
                        }
                        this.dbIdArray[dbIdObject.dbId] = dbIdObject;
                        this.viewableState[viewableType] = true;
                    }
                    break;
                case "Drone Image":
                    break;
                case "Issue":
                case "Task":
                    for (const trackerData of visualizationData[viewableType]) {
                        console.log("Inside data visualization: ", trackerData);
                        let tag = trackerData.context.tag;
                        let dbIdObject = {
                            dbId: dbId++,
                            type: viewableType,
                            id: trackerData._id,
                            position: this.applyOffset(tag.tagPosition, this.offset),
                        }
                        this.dbIdArray[dbIdObject.dbId] = dbIdObject;;
                        this.trackerState[viewableType] = true;
                    }
                    break;
            }   
            this.viewableLength = dbId - 1;
        }
        console.log("Viewable data map: ", this.viewableLength);
    }

    
    updateData() {
        this.getNewViewableData();
        this.loadViewableData();
        this.addListeners();
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
            iconUrl,
            spriteColor,
            iconUrl,
            []
          );
    }

    getViewableData(type) {
        const viewableData = new this.dataVizCore.ViewableData();
        switch (type) {
            case '360 Image':
                viewableData.spriteSize = 48;
                break;
            case '360 Video':
                viewableData.spriteSize = 12;
                break;
            case 'Phone Image':
                viewableData.spriteSize = 48;
                break;
            case 'Issue':
                viewableData.spriteSize = 48;
                break;
            case 'Task':
                viewableData.spriteSize = 48;
                break;
        }
        return viewableData;
    }

    getNewViewableData() {
        delete this.viewableDataMap;
        this.viewableDataMap = {}
        for(let dbIdObject of this.dbIdArray) {
            if (!dbIdObject) {
                continue;
            }
            if (!(dbIdObject.type in this.viewableDataMap)) {
                let viewableData = this.getViewableData(dbIdObject.type);
                let viewableStyle = this.getViewableStyle(dbIdObject.type);
                this.viewableDataMap[dbIdObject.type] = {
                    viewableData: viewableData,
                    viewableStyle: viewableStyle
                }
            }
            const viewable = new this.dataVizCore.SpriteViewable(
                dbIdObject.position, 
                this.viewableDataMap[dbIdObject.type].viewableStyle, 
                dbIdObject.dbId);

            this.viewableDataMap[dbIdObject.type].viewableData.addViewable(viewable);
        }
        console.log("Viewable data map: ", this.viewableDataMap);
    }

    async loadViewableData() {
        let combinedState = {...this.viewableState, ...this.trackerState}
        for (let viewableType in this.viewableDataMap) {
            if(combinedState[viewableType]) {
                console.log("Awaiting viewable data finish: ", viewableType);
                await this.viewableDataMap[viewableType].viewableData.finish(); 
                this.dataVizExtn.addViewables(this.viewableDataMap[viewableType].viewableData);
            }
        }
    }


    refreshViewableData() {
        this.removeViewableData();
        this.getNewViewableData();
        this.loadViewableData();
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
                dbId: ++this.tempViewableLength,
                id: `Temp ${type}`,
                type: type,
                position: {x:result.point.x, y:result.point.y, z:result.point.z},
            }
            this.tempDbIdArray[dbIdObject.dbId] = dbIdObject;


            const viewable = new this.dataVizCore.SpriteViewable(dbIdObject.position, viewableStyle, dbIdObject.dbId);
            viewableData.addViewable(viewable);

            await viewableData.finish();
            this.dataVizExtn.addViewables(viewableData);


            dbIdObject.position = this.removeOffset(dbIdObject.position, this.offset);
            this.handlerFunction(event, dbIdObject);
        }
    }

    clearTempViewables() {
        this.removeViewableData();
        this.getNewViewableData();
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

        // console.log("Inside data viz utils: selected dbId: ", event);
        // console.log(`Sprite clicked: ${this.dbIdMap[targetDbId].name}`);
        if (targetDbId > 0) {
            event.hasStopped = true;
            this.handleSelection(event.dbId);
            this.passToViewerHandler(event);
        } else if (this.createTagTool) {
            this.createTempViewable(this.tagType, event);
        }

    }

    onSpriteClickedOut(event) {
        console.log("Inside sprite clicked out selection : ", event.dbId);
        event.hasStopped = true;
        this.handleSelectionOut(event.dbId);
    
    }

    handleSelectionOut(tagId) {
        const viewablesToUpdate = [tagId];
        this.dataVizExtn.invalidateViewables(viewablesToUpdate, (viewable) => {
            console.log("Inside invalidate for selection out : ", viewable);
            return {
                scale: 1.0, // Restore the viewable size
                url: "/icons/issuesInViewer.svg",
            };
        });
    }

    handleSelection(tagId) {
        console.log("Inside handle selection : ", tagId);
        const viewablesToUpdate = [tagId];
        this.dataVizExtn.invalidateViewables(viewablesToUpdate, (viewable) => {
            console.log("Inside invalidate for selection : ", viewable);
            return {
                scale: 2.0, // Double the viewable size
                url: "/icons/issuesInViewer.svg"
            };
        });
    }

    passToViewerHandler(event) {
        
        let dbObject = this.dbIdArray[event.dbId];
        // console.log("Inside selected dbId object: ", this.dbIdMap, dbObject);

        dbObject.position = this.removeOffset(dbObject.position, this.offset);
        this.handlerFunction(event, dbObject);
    }

    applyOffset(position, offset) {
        return {
            x: position.x - offset[0],
            y: position.y - offset[1],
            z: position.z - offset[2],
        }
    }

    removeOffset(position, offset) {
        return {
            x: position.x + offset[0],
            y: position.y + offset[1],
            z: position.z + offset[2],
        }
    }

    removeExistingVisualizationData() {
        if(this.viewableDataMap && Object.keys(this.viewableDataMap).length > 0) {
            this.removeViewableData();
            this.viewableDataMap = {};
            this.dbIdArray = [];
        }
        this.removeListeners();
        
    }

    removeViewableData() {
        this.dataVizExtn.removeAllViewables();
    }
}