import { faBreadSlice } from "@fortawesome/free-solid-svg-icons";
import {
    applyOffset,
    removeOffset,
    applyTMInverse,
    applyTM

  } from './ViewerDataUtils';
import { MathUtils } from "../public/potree/libs/three.js/build/three.module";

export class MinimapDataVisualization {
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
        this.formatDataMap(this.mediaMap);
    }

    setViewableState(viewableList) {
        // console.log("Inside set Viewable state: ", viewableList)
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
        this.formatDataMap(this.tagMap);
    }

    addTasksData(tasksList) {
        this.tagMap["Task"] = tasksList;
        this.formatDataMap(this.tagMap);
    }

    setTagState(state) {
        // if (type in this.tagState) {
        //     this.tagState[type] = show;
        // }
        for (const tagType in state) {
            this.tagState[tagType] = state[tagType];
        }
    }

    formatDataMap(visualizationData) {
        if(!this.offset) this.offset = [0, 0, 0]
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
                // case "Drone Image":
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
                        // console.log("Inside minimap data visualization: ", trackerData);
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
                    break;
            }   
            this.viewableLength = dbId - 1;
        }
        // console.log("Viewable minimap data map: ", this.viewableLength);
    }

    removeDataMap(type) {

    }

    
    updateData() {
        this.removeViewableData();
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
                iconUrl ="https://img.icons8.com/material-outlined/24/null/new-moon.png";
                highlightUrl ="https://img.icons8.com/material-outlined/24/null/new-moon.png";
            break;
            case '360 Video':
                iconUrl = "/icons/360VideoWalkInViewer.svg";
                highlightUrl = "/icons/360VideoWalkInViewer.svg";
            break;
            case '360 Image':
                iconUrl = "/icons/forge360Image.png";
                highlightUrl = "/icons/forge360Image.png";
                break;
            case 'Phone Image':
                iconUrl = "/icons/phoneImageInViewer.svg";
                highlightUrl = "/icons/phoneImageInViewer.svg";
                break;
            case 'Issue':
                iconUrl = "/icons/forgeissue.png";
                highlightUrl = "/icons/forgeissue.png";
            break;
            case 'Task':
                iconUrl = "/icons/forgeTask.png";
                highlightUrl = "/icons/forgeTask.png";
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
        // console.log("Viewable data map minimap: ", this.viewableDataMap);
    }

    async loadViewableData() {

         // Viewable for current position ICON
         let animatedUrls = [];
         for(let i = 0; i < 360; i = i + 10) {
             animatedUrls.push(`/icons/navigator/nav-${i}.png`)
         }
         const viewableType = this.dataVizCore.ViewableType.SPRITE;
         const spriteIconUrl = `/icons/navigator/nav-0.png`;
         this._navStyle = new this.dataVizCore.ViewableStyle(viewableType, undefined, spriteIconUrl, undefined, spriteIconUrl, animatedUrls);
         this._navViewableData = new this.dataVizCore.ViewableData();
         this._navViewableData.spriteSize = 24; // Sprites as points of size 24 x 24 pixels
         this._navViewable = new this.dataVizCore.SpriteViewable({x: 0, y: 0, z: 100}, this._navStyle, 999);
         this._navViewableData.addViewable(this._navViewable);
         await this._navViewableData.finish();
         this.dataVizExtn.addViewables(this._navViewableData);

        let combinedState = {...this.viewableState, ...this.tagState}
        for (let viewableType in this.viewableDataMap) {
            if(combinedState[viewableType]) {
                console.log("Awaiting minimap viewable data finish: ", viewableType);
                await this.viewableDataMap[viewableType].viewableData.finish(); 
                this.dataVizExtn.addViewables(this.viewableDataMap[viewableType].viewableData);
            }
        }
    }

    createMarker(position, yaw) {
       if(!position) return;
       if(!this._navViewableData) return;
       const localPos = this.getViewerPosition(position, this.tm, this.offset)
       localPos.z = 100
        this.invalidateViewablesDirect(999, this.dataVizExtn.pointMeshes, this._navViewableData, (viewable) => {
            let deg = MathUtils.radToDeg(yaw);
            if(deg > 0) deg = 360 - deg;
            else deg = deg * -1;
            deg = (Math.floor(deg / 10) * 10) % 360;
            const mUrl = `/icons/navigator/nav-${deg}.png`
            return {
                position: localPos,
                url: mUrl
            };
        });
    }

    invalidateViewablesDirect = (dbIds, meshes, viewableData, callback) => {
        if (!dbIds || !meshes || !callback) {
            throw new Error("Parameters of 'invalidateViewables' are mandatory");
        }

        if (!(dbIds instanceof Array)) {
            dbIds = [dbIds];
        }

        const dbIdSet = new Set(dbIds);

        /** @type {Map<number, CustomViewable>} */
        const viewables = new Map();
        viewableData.viewables.forEach((v) => viewables.set(v.dbId, v));

        let sceneUpdated = false;

        for(let k = 0; k < meshes.length; k++) {
            const mesh = meshes[k];
            const geometry = mesh.geometry;
            const ids = geometry.attributes["id"].array;

            for (let i = 0; i < ids.length; i += 3) {
                const dbId = ids[i] + (ids[i + 1] << 8) + (ids[i + 2] << 16);
                if (!dbIdSet.has(dbId)) {
                    continue;
                }

                const updates = callback(viewables.get(dbId));
                // console.log(updates, viewables, 'ppp')
                if (!updates) {
                    continue;
                }

                const pointIndex = i / 3;
                if (updates.position) {
                    const positions = geometry.attributes["position"].array;
                    geometry.attributes["position"].needsUpdate = true;
                    positions[pointIndex * 3 + 0] = updates.position.x;
                    positions[pointIndex * 3 + 1] = updates.position.y;
                    positions[pointIndex * 3 + 2] = updates.position.z;
                    
                    sceneUpdated = true;
                }

                if (updates.url) {
                    const uv = viewableData.getSpriteUV(updates.url);
                    // console.log(updates.url, 'ppppp', uv, this.dataVizExtn.viewableData._spriteAtlas)
                    if (uv) {
                        const uvp = geometry.attributes["uvp"].array;
                        geometry.attributes["uvp"].needsUpdate = true;
                        uvp[pointIndex * 4 + 0] = uv.x;
                        uvp[pointIndex * 4 + 1] = uv.y;
                        uvp[pointIndex * 4 + 2] = uv.w;
                        uvp[pointIndex * 4 + 3] = uv.h;

                        sceneUpdated = true;
                    }
                }

                if (updates.color) {
                    const colors = geometry.attributes["color"].array;
                    geometry.attributes["color"].needsUpdate = true;
                    colors[pointIndex * 3 + 0] = updates.color.r * 255;
                    colors[pointIndex * 3 + 1] = updates.color.g * 255;
                    colors[pointIndex * 3 + 2] = updates.color.b * 255;

                    sceneUpdated = true;
                }

                if (updates.scale !== undefined) {
                    if (updates.scale > 2.0 || updates.scale < 0) {
                        const msg = `invalidateViewables: 'scale' of '${updates.scale}' out of range [0, 2]`;
                        console.warn(msg);
                    }
                    const scale = geometry.attributes["pointScale"].array;
                    geometry.attributes["pointScale"].needsUpdate = true;
                    scale[pointIndex] = updates.scale;

                    sceneUpdated = true;
                }
            }
        }

        if (sceneUpdated) {
            this.viewer.impl.invalidate(false, false, true);
        }
    };


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

        // this.invalidateViewablesDirect(targetDbId, this.dataVizExtn.pointMeshes, this.viewableDataMap['360 Video'].viewableData, (viewable) => {
        //     return {
        //         scale: event.hovering ? 2 : 1
        //     };
        // });

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
            // event.hasStopped = true;
            // this.handleSelection(event.dbId);
            this.passToViewerHandler(event);
        } else if (this.createTagTool) {
            this.createTempViewable(this.tagType, event);
        }

    }

    onSpriteClickedOut(event) {
        console.log("Inside sprite clicked out selection : ", event.dbId);
        // event.hasStopped = true;
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
        // console.log("Inside minimap get viewer posistion: ", position, tm, offset);
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
        this.removeListeners();
        
    }

    removeViewableData() {
        this.dataVizExtn.removeAllViewables();
        this._navStyle = undefined;
        this._navViewable = undefined;
        this._navViewableData = undefined;
    }
}