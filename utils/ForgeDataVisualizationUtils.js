import {
    applyOffset,
    removeOffset,
    applyTMInverse,
    applyTM,
    isMobile

  } from './ViewerDataUtils';

const publish = (eventName, data) => {

    const event = new CustomEvent(eventName, { detail: data })

    document.dispatchEvent(event)
}

export class ForgeDataVisualization {
    static EXTENSION_ID = "Autodesk.DataVisualization";
    constructor(viewer, dataVisualizationExtension) {
        // console.log("Inside Data visualization class constructor: ")
        this.viewer = viewer;
        this.dataVizExtn = dataVisualizationExtension; 
        this.dataVizCore = Autodesk.DataVisualization.Core;
        this.dbIdArray = [];
        this.tempDbIdArray = [];
        this.createTagTool = false;
        this.tagType = "Issue";
        this.viewableLength = 0;
        this.tempViewableLength = 0;
        this.viewableDataMap = {};
        this.viewableState = {
            "360 Video": true,
            "360 Image": true,
            "Phone Image": true,
            "Drone Image": true,

        };
        this.tagMap = {};
        this.tagState = {
            "Issue": true,
            "Task": true
        };


        // window.dbIdMap = this.dbIdMap;

    
        this.setOcclusion(true);
        this.viewableHoveringHandler = this.onSpriteHovering.bind(this);
        this.viewableClickHandler = this.onSpriteClicked.bind(this);
        this.viewableClickOutHandler = this.onSpriteClickedOut.bind(this);
    }

    setOcclusion(enable) {
        this.dataVizExtn.changeOcclusion(enable);
    }

    setIs2D(is2D) {
        this.is2D = is2D;
    }

    setTM(tm) {
        this.tm = tm;
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
        if (selectedViewable) {
            this.handleSelection(selectedViewable.dbId);
        }
        
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
        this.viewer.removeEventListener(this.dataVizCore.MOUSE_CLICK_OUT, this.viewableClickOutHandler);
    }

    addMediaData(visualizationData) {
        this.mediaMap = visualizationData;
        // this.formatDataMap(this.mediaMap);
    }

    setViewableState(viewableList) {
        console.log("ForgeDataVisualization Inside set Viewable state: ", viewableList)
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

    addIssuesData(issuesList) {
        this.tagMap["Issue"] = issuesList;
        // this.formatDataMap(this.tagMap);
    }

    addTasksData(tasksList) {
        this.tagMap["Task"] = tasksList;
        // this.formatDataMap(this.tagMap);
    }

    setTagState(state) {
        // if (type in this.tagState) {
        //     this.tagState[type] = show;
        // }
        for (const tagType in state) {
            this.tagState[tagType] = state[tagType];
        }
    }

    updateDataMap() {
        this.formatDataMap(this.mediaMap);
        this.formatDataMap(this.tagMap);
    }

    formatDataMap(visualizationData) {
        let dbId = this.viewableLength + 1;
        for (const viewableType in visualizationData) {
            delete this.viewableDataMap[viewableType];
            this.viewableDataMap[viewableType] = {};
            switch (viewableType) {
                case "360 Image":
                case "360 Video":
                    for(const reality of visualizationData[viewableType]) {
                        for (const positionData in reality.position) {
                            let positionArray = reality.position[positionData].position;
                            let dbIdObject = {
                                dbId: dbId++,
                                type: viewableType,
                                id: reality.id,
                                imageName: positionData,
                                // position: this.applyOffset({x: positionArray[0], y: positionArray[1], z: positionArray[2]}, this.offset),
                                position: this.getViewerPosition({x: positionArray[0], y: positionArray[1], z: positionArray[2]}, this.tm, this.offset),
                                
                            }
                            this.dbIdArray[dbIdObject.dbId] = dbIdObject;
                            // this.viewableState[viewableType] = true;
                        }
                    }
                    break;
                case "Drone Image":
                case "Phone Image":
                    for(const reality of visualizationData[viewableType]) {
                        reality.position["camname"].forEach((imageName, index) => {
                            let positionArray = [];
                            positionArray[0] = reality.position["camX"][index];
                            positionArray[1] = reality.position["camY"][index];
                            positionArray[2] = reality.position["camZ"][index];

                            let dbIdObject = {
                                dbId: dbId++,
                                type: viewableType,
                                id: reality.id,
                                imageName: imageName,
                                // position: this.applyOffset({x: positionArray[0], y: positionArray[1], z: positionArray[2]}, this.offset),
                                position: this.getViewerPosition({x: positionArray[0], y: positionArray[1], z: positionArray[2]}, this.tm, this.offset),
                                
                            }
                            this.dbIdArray[dbIdObject.dbId] = dbIdObject;
                        })
                    }
                    break;
                case "Issue":
                case "Task":
                    for (const trackerData of visualizationData[viewableType]) {
                        // console.log("Inside data visualization: ", trackerData);
                        if(trackerData.context) {
                            let tag = trackerData.context.tag;
                            let dbIdObject = {
                                dbId: dbId++,
                                type: viewableType,
                                id: trackerData._id,
                                // position: this.applyOffset(tag.tagPosition, this.offset),
                                position: this.getViewerPosition(tag.tagPosition, this.tm, this.offset),
                            }
                            this.dbIdArray[dbIdObject.dbId] = dbIdObject;;
                            // this.tagState[viewableType] = true;
                        }
                    }
                    break;
            }   
            this.viewableLength = dbId - 1;
        }
        console.log("ForgeDataVisualization Viewable data map: ", this.viewableLength);
    }

    removeDataMap(type) {

    }

    
    updateData() {
        this.removeViewableData();
        this.updateDataMap();
        this.getNewViewableData();
        this.loadViewableData();
        this.addListeners();
    }


    getViewableStyle(iconType) {
        const viewableType = this.dataVizCore.ViewableType.SPRITE;
        const spriteColor = new THREE.Color(0xffffff);

        let iconUrl = "";
        let highlightUrl = ""
        switch (iconType) {
            case 'Drone Image':
            case '360 Video':
                iconUrl = "/icons/360VideoWalkInViewer.svg";
                highlightUrl = "/icons/360VideoWalkInViewer.svg";
            break;
            case '360 Image':
                iconUrl = '/customicons/360ImageWithoutBorderAndShadow.svg';
                highlightUrl = '/customicons/360ImageWithoutBorderAndShadow.svg';
                break;
            case 'Phone Image':
                iconUrl = "/customicons/PhoneImageIconWoBorder.svg";
                highlightUrl = "/customicons/PhoneImageIconWoBorder.svg";
                break;
            case 'Issue':
                iconUrl = "/icons/issuesInViewer.svg";
                highlightUrl = "/icons/issuesInViewer.svg";
            break;
            case 'Task':
                iconUrl = "/icons/tasksInViewer.svg";
                highlightUrl = "/icons/tasksInViewer.svg";
            break

        }

        return new this.dataVizCore.ViewableStyle(
            viewableType,
            spriteColor,
            iconUrl,
            spriteColor,
            highlightUrl,
            []
          );
    }

    getViewableData(type) {
        const viewableData = new this.dataVizCore.ViewableData();
        switch (type) {
            case '360 Image':
                viewableData.spriteSize = 48;
                break;
            case 'Drone Image':
            case '360 Video':
                if (isMobile()) {
                    viewableData.spriteSize = 25;
                  } else {
                    viewableData.spriteSize = 12;
                  }
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
        console.log(" ForgeDataVisualization Viewable data map: ", this.viewableDataMap);
    }

    async loadViewableData() {
        let combinedState = {...this.viewableState, ...this.tagState}
        for (let viewableType in this.viewableDataMap) {
            if(combinedState[viewableType]) {
                try{
                    console.log(" ForgeDataVisualization Awaiting viewable data finish: ", viewableType);
                    await this.viewableDataMap[viewableType].viewableData.finish(); 
                    this.dataVizExtn.addViewables(this.viewableDataMap[viewableType].viewableData);
                } catch(e) {
                    console.log(e)
                }
            }
        }
    }


    refreshViewableData() {
        this.removeViewableData();
        this.removeExistingVisualizationData();
        this.updateDataMap();
        this.getNewViewableData();
        this.loadViewableData();
    }


    async createTempViewable(type, event) {

        let viewport = this.viewer.container.getBoundingClientRect();
        let canvasX = isMobile() ? event.originalEvent.pointers[0].pageX - viewport.left : event.originalEvent.clientX - viewport.left;
        let canvasY = isMobile() ? event.originalEvent.pointers[0].pageY - viewport.top: event.originalEvent.clientY - viewport.top;
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


            dbIdObject.position = this.getGlobalPosition(dbIdObject.position, this.tm, this.offset);
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
        publish('viewer-clicked', event.dbId);

        // console.log("Inside data viz utils: selected dbId: ", event);
        // console.log(`Sprite clicked: ${this.dbIdMap[targetDbId].name}`);
        if (targetDbId > 0) {
            // event.hasStopped = true;
            // this.handleSelection(event.dbId);
            this.passToViewerHandler(event);
        } else if (this.createTagTool) {
            this.createTempViewable(this.tagType, event);
        }

    }

    onSpriteClickedOut(event) {
        // console.log("Inside sprite clicked out selection : ", event.dbId);
        // event.hasStopped = true;
        this.handleSelectionOut(event.dbId);
    
    }

    handleSelectionOut(tagId) {
        const viewablesToUpdate = [tagId];
        this.dataVizExtn.invalidateViewables(viewablesToUpdate, (viewable) => {
            // console.log("Inside invalidate for selection out : ", viewable);
            return {
                scale: 1.0, // Restore the viewable size
                url: "/icons/issuesInViewer.svg",
            };
        });
    }

    handleSelection(tagId) {
        // console.log("Inside handle selection : ", tagId);
        this.dataVizExtn.clearHighlightedViewables();
        this.dataVizExtn.highlightViewables(tagId);
        // const viewablesToUpdate = [tagId];
        // this.dataVizExtn.invalidateViewables(viewablesToUpdate, (viewable) => {
        //     console.log("Inside invalidate for selection : ", viewable);
        //     return {
        //         scale: 2.0, // Double the viewable size
        //         url: "/icons/issuesInViewer.svg"
        //     };
        // });
    }

    passToViewerHandler(event) {
        
        let dbObject = structuredClone(this.dbIdArray[event.dbId]);
        // console.log("Inside selected dbId object: ", this.dbIdMap, dbObject);

        if (dbObject) {
            dbObject.position = this.getGlobalPosition(dbObject.position, this.tm, this.offset);
            this.handlerFunction(event, dbObject);
        }
    }

    getViewerPosition(position, tm, offset) {
        // console.log("Inside get viewer posistion: ", position, tm, offset);


        let _position;
        if(this.is2D) {
            _position = applyTMInverse(position, tm);
            _position = applyOffset(_position, offset);
        } else {
            _position = applyOffset(position, offset);
        }
        return _position;
    }

    getGlobalPosition(position, tm, offset) {
        let _position;
        if(this.is2D) {
            _position = applyTM(position, tm);
            _position = removeOffset(_position, offset);
        } else {
            _position = removeOffset(position, offset);
        }
        return _position;
    }

    // applyOffset(position, offset) {
    //     return {
    //         x: position.x - offset[0],
    //         y: position.y - offset[1],
    //         z: position.z - offset[2],
    //     }
    // }

    // removeOffset(position, offset) {
    //     return {
    //         x: position.x + offset[0],
    //         y: position.y + offset[1],
    //         z: position.z + offset[2],
    //     }
    // }

    // worldToimage(position, tm) {
    //     const a = new THREE.Vector4(position.x, position.y, position.z, 1);
    //     const matrixInv = new THREE.Matrix4();
    //     matrixInv.copy(tm).invert();
    //     a.applyMatrix4(matrixInv);
    //     // console.log("matrix values: ", tm, matrixInv, a);
    //     // return [Math.ceil(a.x), Math.ceil(a.y)]
    //     return a;
    // }

    // imageToWorld(position, tm) {
    //     const a = new THREE.Vector4(position.x, position.y, position.z, 1);
    //     a.applyMatrix4(tm);
    //     // console.log("matrix values: ", tm, a);
    //     // return [Math.ceil(a.x), Math.ceil(a.y)]
    //     return a;
    // }

    removeExistingVisualizationData() {
        if(this.viewableDataMap && Object.keys(this.viewableDataMap).length > 0) {
            console.log("Inside remove layers in dataviz layer: ");
            this.removeViewableData();
            this.viewableDataMap = {};
            this.dbIdArray.length = 0;
            this.viewableLength = 0;
            console.log("Inside remove layers in dataviz layer: ", this.viewableDataMap, this.dbIdArray, this.viewableLength);
        }
        this.removeViewableData();
        // this.removeListeners(); 
    }

    removeViewableData() {
        this.dataVizExtn.removeAllViewables();
    }
}