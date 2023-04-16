import {
    applyOffset,
    removeOffset,
    applyTMInverse,
    applyTM

  } from './ViewerDataUtils';
import { MathUtils } from "../public/potree/libs/three.js/build/three.module";

export class ForgeDataVizUtils {

    static NAVIGATOR = "NAVIGATOR"

    static ISSUE = "Issue"

    static TASK = "Task"
    
    constructor(viewer, dataVisualizationExtension) {

        this._viewer = viewer
        
        this._dataVizExtn = dataVisualizationExtension

        this._viewableDataMap = {}

        this._dbMap = {}

        this._tm = new THREE.Matrix4().identity()

        this._offset = [0, 0, 0]

        this._loadNavigator()
    }

    getDbMap() {

        return this._dbMap
    }

    setTransform(tm, offset) {

        this._tm = tm

        this._offset = offset
    }

    getContextByID(dbId) {

        return this._dbMap[dbId]
    }

    loadTasks = async (tasks) => {

        const _viewableData = await this._createViewableData(tasks, ForgeDataVizUtils.TASK)

        this._viewableDataMap[ForgeDataVizUtils.TASK] = _viewableData

        this._dataVizExtn.addViewables(_viewableData)
    }

    loadIssues = async (issues) => {

        const _viewableData = await this._createViewableData(issues, ForgeDataVizUtils.ISSUE)

        this._viewableDataMap[ForgeDataVizUtils.ISSUE] = _viewableData

        this._dataVizExtn.addViewables(_viewableData)
    }

    loadMediaData = async (mediaData) => {

        for(let type of Object.keys(mediaData)) {

            const data = []

            const images = Object.keys(mediaData[type])
    
            for(let i = 0; i < images.length; i++) {

                const item = mediaData[type][images[i]]
    
                data.push({
    
                    id: images[i],
        
                    position: item.position,
        
                    rotation: item.rotation,
        
                    type: type
                })
            }           
            
            const _viewableData = await this._createViewableData(data, type)
    
            this._viewableDataMap[type] = _viewableData
    
            this._dataVizExtn.addViewables(_viewableData)
        }
    }

    showTag = (type, show) => {

        const viewableData = this._viewableDataMap[type]

        const dbIds = viewableData.viewables.map(v => { return v.dbId})

        this._invalidateViewables(dbIds, this._dataVizExtn.pointMeshes, viewableData, (viewable) => {

            return {

                scale: show ? 1 : 0
            }
        })
    }

    highlight = (tagId) => {

        this._dataVizExtn.clearHighlightedViewables()

        this._dataVizExtn.highlightViewables(tagId)
    }

    removeLoadedData = () => {

        this._dataVizExtn.removeAllViewables()

        this._viewableDataMap = {}

        this._dbMap = {}
    }

    updateNavigator = (position, yaw) => {

        const localPos = this._toLocalPosition(position)

        localPos.z = 100

        if(this._viewableDataMap[ForgeDataVizUtils.NAVIGATOR]) {

            this._invalidateViewables(1, this._dataVizExtn.pointMeshes, this._viewableDataMap[ForgeDataVizUtils.NAVIGATOR], (viewable) => {
        
                let deg = MathUtils.radToDeg(yaw)
            
                if (deg > 0) deg = 360 - deg
            
                else deg = deg * -1
            
                deg = (Math.floor(deg / 10) * 10) % 360
            
                const mUrl = `/icons/navigator/nav-${deg}.png`
            
                return {
            
                    position: localPos,
            
                    url: mUrl
                }
            })
        }
    }

    _loadNavigator = async () => {

        if(!this._dbMap[1]) {

            const _viewableData = await this._createViewableData([{position: [1, 1, 100], type: ForgeDataVizUtils.NAVIGATOR}], ForgeDataVizUtils.NAVIGATOR)

            this._viewableDataMap[ForgeDataVizUtils.NAVIGATOR] = _viewableData
    
            this._dataVizExtn.addViewables(_viewableData)
        }
    }

    _createViewableData = async (data, type) => {

        console.log(data, 'ppp')

        const _spriteConfig = this._spriteConfigForType(type)
    
        const _viewableData = new Autodesk.DataVisualization.Core.ViewableData()
    
        _viewableData.spriteSize = _spriteConfig.size
    
        for(let i = 0; i < data.length; i++) {
    
            let localPosition = type === ForgeDataVizUtils.NAVIGATOR ? { x: data[i].position[0], y: data[i].position[1], z: data[i].position[2] } :
                this._toLocalPosition({ x: data[i].position[0], y: data[i].position[1], z: data[i].position[2] })

            const dbId = _spriteConfig.offset + i
    
            const _viewable = this._createSpriteViewable(_spriteConfig.icon, localPosition, dbId)
    
            this._dbMap[dbId] = data[i]
    
            _viewableData.addViewable(_viewable)
        }
        
        await _viewableData.finish()
    
        return _viewableData
    }
    
    _createSpriteViewable = (spriteIcon, position, dbId) => {
    
        let animatedUrls = []

        if(dbId == 1) {

            for(let i = 0; i < 360; i = i + 10) {
             
                animatedUrls.push(`/icons/navigator/nav-${i}.png`)
            }
        }
    
        const _spriteType = Autodesk.DataVisualization.Core.ViewableType.SPRITE
        
        const _style = new Autodesk.DataVisualization.Core.ViewableStyle(
            _spriteType, undefined, spriteIcon, undefined, spriteIcon, animatedUrls
        )
        
        const _viewable = new Autodesk.DataVisualization.Core.SpriteViewable(position, _style, dbId)
    
        return _viewable
    }
    
    _spriteConfigForType = (type) => {
    
        switch (type) {
    
            case ForgeDataVizUtils.NAVIGATOR: return {
    
                    icon: '/icons/navigator/nav-0.png',
    
                    size: 24,
    
                    offset: 1
                }

            case 'Drone Image': return {

                icon: 'https://img.icons8.com/material-outlined/24/null/new-moon.png',

                size: 24,

                offset: 1000
            }
    
            case '360 Image': return {
    
                    icon: '/icons/forge360Image.png',
    
                    size: 24,
    
                    offset: 1100
                }
    
            case 'Phone Image': return {
    
                    icon: '/icons/phoneImageInViewer.svg',
    
                    size: 24,
    
                    offset: 1200
                }
    
            case '360 Video': return {
    
                    icon: '/icons/360VideoWalkInViewer.svg',
    
                    size: 12,
    
                    offset: 1500
                }
    
            case ForgeDataVizUtils.ISSUE: return {
    
                    icon: '/icons/forgeissue.png',
    
                    size: 48,
    
                    offset: 500
                }
    
            case ForgeDataVizUtils.TASK: return {
    
                    icon: '/icons/forgeTask.png',
    
                    size: 48,
    
                    offset: 10
                }
    
            default: return '/icons/forge360Image.png'
        }
    }
    
    _toLocalPosition = (position) => {
    
        let _position = applyTMInverse(position, this._tm)
        
        _position = applyOffset(_position, this._offset)
        
        return _position
    }
    
    _invalidateViewables = (dbIds, meshes, viewableData, callback) => {
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
            this._viewer.impl.invalidate(false, false, true);
        }
    }
}