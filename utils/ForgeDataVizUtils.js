import { applyOffset, applyTM, applyTMInverse, removeOffset } from './ViewerDataUtils';
import { MathUtils } from "../public/potree/libs/three.js/build/three.module";

export class ForgeDataVizUtils {

    static NAVIGATOR = "NAVIGATOR"

    static ISSUE = "Issue"

    static TASK = "Task"

    constructor(viewer, dataVisualizationExtension, dataVizHandler) {

        this._viewer = viewer

        this._dataVizExtn = dataVisualizationExtension

        this._eventHandler = dataVizHandler

        this._addListeners()

        this._viewableDataMap = {}

        this._dbMap = {}

        this._existingTags = []

        this._existingImages = []

        this._tm = new THREE.Matrix4().identity()

        this._offset = [0, 0, 0]

        // this._createNavigator()

        // this._createModelBuilder()
    }

    setTransform(tm, offset) {

        this._tm = tm

        this._offset = offset
    }

    loadTasks = async (tasks) => {

        const data = []

        tasks.forEach(task => {

            let tag = task.context.tag;

            if (this._existingTags.indexOf(task._id) == -1) {

                data.push({

                    id: task._id,

                    type: ForgeDataVizUtils.TASK,

                    position: this._toLocalPosition(tag.tagPosition)
                })
            }
        })

        if (data.length > 0) {

            const _viewableData = await this._createViewableData(data, ForgeDataVizUtils.TASK)

            this._viewableDataMap[ForgeDataVizUtils.TASK] = _viewableData

            this._dataVizExtn.addViewables(_viewableData)
        }
    }

    loadIssues = async (issues) => {

        const data = []

        issues.forEach(issue => {

            let tag = issue.context.tag;

            if (this._existingTags.indexOf(issue._id) == -1) {

                data.push({

                    id: issue._id,

                    type: ForgeDataVizUtils.ISSUE,

                    position: this._toLocalPosition(tag.tagPosition)
                })
            }
        })

        if (data.length > 0) {

            const _viewableData = await this._createViewableData(data, ForgeDataVizUtils.ISSUE)

            this._viewableDataMap[ForgeDataVizUtils.ISSUE] = _viewableData

            this._dataVizExtn.addViewables(_viewableData)
        }
    }

    loadMediaData = async (mediaData) => {

        for (const [type, realities] of Object.entries(mediaData)) {

            const data = []

            realities.forEach(reality => {

                let images

                switch (type) {

                    case '360 Image':

                    case '360 Video': 

                        images = Object.keys(reality['position'])

                        break

                    case 'Phone Image':
                        
                        images = reality['position']['camname']

                        break
                }

                for (let i = 0; i < images.length; i++) {

                    if (this._existingImages.indexOf(images[i] == -1)) {

                        let mPosition = [];

                        let mRotation = reality['position'][images[i]] ? reality['position'][images[i]].rotation : 0

                        switch (type) {

                            case '360 Image':
        
                            case '360 Video': 
        
                                mPosition = reality['position'][images[i]].position
        
                                break
        
                            case 'Phone Image':
                                
                                mPosition[0] = reality.position['camX'][i]
                                
                                mPosition[1] = reality.position['camY'][i]
                                    
                                mPosition[2] = reality.position['camZ'][i]
        
                                break
                        }

                        data.push({

                            id: reality.id,

                            imageName: images[i],

                            position: this._toLocalPosition({ x: mPosition[0], y: mPosition[1], z: mPosition[2] }),

                            rotation: mRotation,

                            type: type
                        })
                    }
                }
            })

            const _viewableData = await this._createViewableData(data, type)

            this._viewableDataMap[type] = _viewableData

            this._dataVizExtn.addViewables(_viewableData)
        }
    }

    showTag = (type, show) => {

        const viewableData = this._viewableDataMap[type]

        if (viewableData) {

            const dbIds = viewableData.viewables.map(v => { return v.dbId })

            this._invalidateViewables(dbIds, this._dataVizExtn.pointMeshes, viewableData, () => {

                return {

                    scale: show ? 1 : 0
                }
            })
        }
    }

    removeLoadedData = () => {

        this._dataVizExtn.removeAllViewables()

        this._viewableDataMap = {}

        this._dbMap = {}

        this._existingImages = []

        this._existingTags = []
    }

    updateNavigator = (position, yaw) => {

        this._lastUpdated = Date.now()

        const localPos = this._toLocalPosition(position)

        localPos.z += 10

        if(!this._dbMap[1]) {

            this._createNavigator(localPos, yaw)
        }

        setTimeout(() => {

            if(Date.now() - this._lastUpdated > 100) {

                if(this._dbMap[1]) {

                    for (let k = 0; k < this._dataVizExtn.pointMeshes.length; k++) {

                        const mesh = this._dataVizExtn.pointMeshes[k]
            
                        if (mesh.geometry.dbIds.indexOf(1) > -1) {

                            this._dbMap[1] = undefined
            
                            this._viewer.overlays.removeMesh(mesh, 'DataVizDots')

                            break
                        }
                    }

                    this._createNavigator(localPos, yaw)

                    this._lastUpdated = undefined

                    this._locations = []

                } else {

                    // this._createNavigator(localPos, yaw)
                }
            } else {

                this._invalidateViewables(1, this._dataVizExtn.pointMeshes, this._viewableDataMap[ForgeDataVizUtils.NAVIGATOR], (viewable) => {

                    let deg = MathUtils.radToDeg(yaw) % 360
                    
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
        }, 200)
    }

    updateNavigator1 = (position, yaw) => {

        if (this._sphereMesh) {

            const localPos = this._toLocalPosition(position)

            this._sphereMesh.matrix = new THREE.Matrix4().compose(
                new THREE.Vector3(localPos.x, localPos.y, 100),
                new THREE.Quaternion(0, 0, 0, 1),
                new THREE.Vector3(1, 1, 1)
            );

            this._sphereMesh.matrix.makeRotationFromEuler(new THREE.Euler(0, 0, yaw ? yaw : 0, 1))

            this._modelBuilder.updateMesh(this._sphereMesh)
        }
    }

    _createNavigator = async (pos, yaw) => {

        if (!this._dbMap[1]) {

            const _viewableData = await this._createViewableData(
                [{ position: pos, type: ForgeDataVizUtils.NAVIGATOR }],
                ForgeDataVizUtils.NAVIGATOR, yaw)

            this._viewableDataMap[ForgeDataVizUtils.NAVIGATOR] = _viewableData

            this._dataVizExtn.addViewables(_viewableData)
        }
    }

    _createViewableData = async (data, type, yaw) => {

        const _spriteConfig = this._spriteConfigForType(type, yaw)

        const _viewableData = new Autodesk.DataVisualization.Core.ViewableData()

        _viewableData.spriteSize = _spriteConfig.size

        for (let i = 0; i < data.length; i++) {

            const dbId = _spriteConfig.offset + i

            const _viewable = this._createSpriteViewable(_spriteConfig.icon, data[i].position, dbId)

            this._dbMap[dbId] = data[i]

            _viewableData.addViewable(_viewable)

            this._existingTags.push(data[i].id)
        }

        await _viewableData.finish()

        return _viewableData
    }

    _createSpriteViewable = (spriteIcon, position, dbId) => {

        let animatedUrls = []

        if (dbId == 1) {

            for (let i = 0; i < 360; i = i + 10) {

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

    _spriteConfigForType = (type, yaw) => {

        switch (type) {

            case ForgeDataVizUtils.NAVIGATOR: {

                let deg = 0

                if (yaw) {

                    deg = MathUtils.radToDeg(yaw) % 360

                    if (deg > 0) deg = 360 - deg

                    else deg = deg * -1

                    deg = (Math.floor(deg / 10) * 10) % 360
                }

                const sprite = `/icons/navigator/nav-${deg}.png`

                return {

                    icon: sprite,

                    size: 24,

                    offset: 1
                }
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

    _createModelBuilder = async () => {

        this._sceneBuilder = await this._viewer.loadExtension('Autodesk.Viewing.SceneBuilder')

        this._modelBuilder = await this._sceneBuilder.addNewModel({
            modelNameOverride: 'Navigator',
            conserveMemory: false
        })

        const square = new THREE.Shape()

        square.moveTo(0, 1)

        square.lineTo(-0.5, 0.5)

        square.lineTo(-0.25, 0.5)

        square.lineTo(-0.25, -1)

        square.lineTo(0.25, -1)

        square.lineTo(0.25, 0.5)

        square.lineTo(0.5, 0.5)

        square.lineTo(0, 1)

        const geometry = new THREE.ShapeGeometry(square)

        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(1, 0, 0),
            side: THREE.DoubleSide,
            depthWrite: false
        })

        this._sphereMesh = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(geometry), material);

        this._sphereMesh.dbId = 12345

        this._sphereMesh.matrix = new THREE.Matrix4().compose(
            new THREE.Vector3(0, 0, 10),
            new THREE.Quaternion(0, 0, 0, 1),
            new THREE.Vector3(1, 1, 1)
        )

        console.log(geometry, "===========", this._sphereMesh)

        this._modelBuilder.addMesh(this._sphereMesh)
    }

    _toLocalPosition = (position) => {

        let _position = applyTMInverse(position, this._tm)

        _position = applyOffset(_position, this._offset)

        return _position
    }

    _toGlobalPosition = (position) => {

        let _position = applyTM(position, this._tm)

        _position = removeOffset(_position, this._offset)

        return _position
    }

    _addListeners = () => {

        this._viewer.addEventListener(Autodesk.DataVisualization.Core.MOUSE_CLICK, this._onSpriteClick)
    }

    _onSpriteClick = (event) => {

        console.log(event, 'ppp')

        this._dataVizExtn.clearHighlightedViewables()

        let dbObject = structuredClone(this._dbMap[event.dbId])

        if (dbObject) {

            this.currentClicked = dbObject.position

            dbObject.position = this._toGlobalPosition(dbObject.position)

            this._eventHandler(event, dbObject)
        }
    }

    _removeListeners = () => {

        this._viewer.addEventListener(Autodesk.DataVisualization.Core.MOUSE_CLICK, this._onSpriteClick)
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

        for (let k = 0; k < meshes.length; k++) {
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