import { applyOffset, applyTM, applyTMInverse, isMobile, removeOffset } from './ViewerDataUtils'

import { MathUtils } from "../public/potree/libs/three.js/build/three.module"

const colors = ['#FF1744', '#AA00FF', '#00E5FF', '#DD2C00', '#64DD17', '#651FFF']

export class ForgeDataVizUtils {

    static NAVIGATOR = "NAVIGATOR"

    static ISSUE = "Issue"

    static TASK = "Task"

    constructor(viewer, dataVisualizationExtension, dataVizHandler, edit2dExtn) {

        this._viewer = viewer

        this._dataVizExtn = dataVisualizationExtension

        this._edit2DExtn = edit2dExtn

        this._eventHandler = dataVizHandler

        this._addListeners()

        this._viewableDataMap = {}

        this._dbMap = {}

        this._existingTags = []

        this._existingImages = []

        this._tm = new THREE.Matrix4().identity()

        this._offset = [0, 0, 0]

        this._lastUpdated = Date.now()

        this._windowScale = 1

        this._viewer.impl.overlayScenes.pivot.scene.children = []

        this._viewer.impl.overlayScenes.pivot.needSeparateDepth = true

        this._viewer.impl.overlayScenes.DataVizDots.needSeparateDepth = true

        this._viewer.impl.invalidate(false, false, true)

        if(this._edit2DExtn) this._edit2DExtn.registerDefaultTools()

        this._polylineStyles = []

        this._createNavigator()

        this._viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, (e) => {

            const zoom = e.camera.position.z

            if(Math.abs(zoom - this._scaleFactor) > 0.1) {

                this._scaleFactor = zoom

                this._viewer.impl.invalidate(false, false, true)

                const scale = this._scaleFactor / 17

                if(this._navigatorMesh) {
                    
                    this._navigatorMesh.scale.x = scale * this._windowScale

                    this._navigatorMesh.scale.y = scale * this._windowScale

                }

            }

        })
    }

    setWindowScale(mScale) {

        const scale = this._scaleFactor / 17

        this._windowScale = mScale

        if (this._navigatorMesh) {

            this._navigatorMesh.scale.x = scale * this._windowScale

            this._navigatorMesh.scale.y = scale * this._windowScale

        }
    }

    setTransform(tm, offset) {

        this._tm = tm

        this._offset = offset
    }

    setEdit2DExtn(extn) {

        this._edit2DExtn = extn

        this._edit2DExtn.registerDefaultTools()

    }

    loadTasks = async (tasks) => {

        const data = []

        tasks.forEach(task => {

            if (task.context) {

                let tag = task.context.tag;

                if (this._existingTags.indexOf(task._id) == -1) {

                    data.push({

                        id: task._id,

                        type: ForgeDataVizUtils.TASK,

                        position: this._toLocalPosition(tag.tagPosition)
                    })
                }
            }
        })

        if (data.length > 0) {

            const _viewableData = await this._createViewableData(data, ForgeDataVizUtils.TASK)

            if (this._viewableDataMap[ForgeDataVizUtils.TASK]) {

                this._viewableDataMap[ForgeDataVizUtils.TASK].push(_viewableData)

            } else {

                this._viewableDataMap[ForgeDataVizUtils.TASK] = [_viewableData]
            }

            this._dataVizExtn.addViewables(_viewableData)
        }
    }

    loadIssues = async (issues) => {

        const data = []

        issues.forEach(issue => {

            if (issue.context) {

                let tag = issue.context.tag;

                if (this._existingTags.indexOf(issue._id) == -1) {

                    data.push({

                        id: issue._id,

                        type: ForgeDataVizUtils.ISSUE,

                        position: this._toLocalPosition(tag.tagPosition)
                    })
                }
            }
        })

        if (data.length > 0) {

            const _viewableData = await this._createViewableData(data, ForgeDataVizUtils.ISSUE)

            if (this._viewableDataMap[ForgeDataVizUtils.ISSUE]) {

                this._viewableDataMap[ForgeDataVizUtils.ISSUE].push(_viewableData)

            } else {

                this._viewableDataMap[ForgeDataVizUtils.ISSUE] = [_viewableData]
            }

            this._dataVizExtn.addViewables(_viewableData)
        }
    }

    loadMediaData = async (mediaData) => {

        for (const [type, realities] of Object.entries(mediaData)) {

            const data = []

            realities.forEach(reality => {

                const pathData = []

                if (reality['position']) {

                    let images

                    switch (type) {

                        case '360 Image':

                        case '360 Video':

                            images = Object.keys(reality['position'])

                            break

                        case 'Drone Image':

                        case 'Phone Image':

                            images = reality['position']['camname']

                            break
                    }

                    if (images) {

                        for (let i = 0; i < images.length; i++) {

                            if (this._existingImages.indexOf(images[i]) == -1) {

                                let mPosition = [];

                                let mRotation = reality['position'][images[i]] ? reality['position'][images[i]].rotation : 0

                                switch (type) {

                                    case '360 Image':

                                    case '360 Video':

                                        mPosition = reality['position'][images[i]].position

                                        break

                                    case 'Drone Image':

                                        mPosition[0] = reality.position['camX'][i]

                                        mPosition[1] = reality.position['camY'][i]

                                        mPosition[2] = 0

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

                                pathData.push({

                                    id: reality.id,

                                    imageName: images[i],

                                    position: this._toLocalPosition({ x: mPosition[0], y: mPosition[1], z: mPosition[2] }),

                                    rotation: mRotation,

                                    type: type
                                })
                            }
                        }

                        if(type == '360 Video') this._drawVideoPath(pathData)

                    }
                }
            })

            const _viewableData = await this._createViewableData(data, type)

            if (this._viewableDataMap[type]) {

                this._viewableDataMap[type].push(_viewableData)

            } else {

                this._viewableDataMap[type] = [_viewableData]
            }

            this._dataVizExtn.addViewables(_viewableData)
        }
    }

    showTag = (type, show) => {

        const viewableDatas = this._viewableDataMap[type]

        if (viewableDatas) {

            for (let i = 0; i < viewableDatas.length; i++) {

                const viewableData = viewableDatas[i]

                if (viewableData) {

                    const dbIds = viewableData.viewables.map(v => { return v.dbId })

                    this._invalidateViewables(dbIds, this._dataVizExtn.pointMeshes, viewableData, () => {

                        return {

                            scale: show ? 1 : 0
                        }
                    })

                }
            }

            if(type == '360 Video') this._showPath(show)
        }
    }

    updateTags = (type, list) => {

        const viewableDatas = this._viewableDataMap[type]

        if (viewableDatas) {

            for (let i = 0; i < viewableDatas.length; i++) {

                const viewableData = viewableDatas[i]

                if (viewableData) {

                    const tagIds = list.map(t => { return t._id })

                    const filteredIds = []

                    const dbIds = viewableData.viewables.map(v => { return v.dbId })

                    for (const [Key, Value] of Object.entries(this._dbMap)) {

                        if (Value && Value.id && tagIds.indexOf(Value.id) > -1) {

                            filteredIds.push(parseInt(Key))
                        }
                    }

                    this._invalidateViewables(dbIds, this._dataVizExtn.pointMeshes, viewableData, (dbId) => {

                        return {

                            scale: filteredIds.indexOf(dbId) > -1 ? 1 : 0
                        }
                    })
                }
            }
        }
    }

    _removeViewableData = (type) => {

        for (let k = 0; k < this._dataVizExtn.pointMeshes.length; k++) {

            const mesh = this._dataVizExtn.pointMeshes[k]

            const dbIds = mesh.geometry.dbIds

            if (dbIds.length > 0 && dbIds[0] == 1500) {

                this._viewer.overlays.removeMesh(mesh, 'DataVizDots')

                this._dataVizExtn.pointMeshes.splice(k, 1)

                dbIds.forEach(id => this._dbMap[id] = undefined)

                this._viewer.impl.invalidate(false, false, true)
            }
        }

        this._viewableDataMap[type] = []

    }

    removeLoadedData = () => {

        this._dataVizExtn.removeAllViewables()

        this._viewableDataMap = {}

        this._dbMap = {}

        this._existingImages = []

        this._existingTags = []

        this._polylineStyles = []

        this._edit2DExtn.defaultContext.layer.clear()
    }

    _drawVideoPath = (data) => {

        data.sort((a, b) => {

            let nameA = a.imageName.toUpperCase()

            nameA = nameA.replace('.JPG', '')

            nameA = nameA.split('_')

            let seqA = nameA[nameA.length - 1]

            let nameB = b.imageName.toUpperCase()

            nameB = nameB.replace('.JPG', '')

            nameB = nameB.split('_')

            let seqB = nameB[nameB.length - 1]

            return parseInt(seqA) - parseInt(seqB)

        })

        const points = []

        data.forEach(point => {

            points.push({x: point.position.x, y: point.position.y})

        })

        const layer = this._edit2DExtn.defaultContext.layer

        //Create polyline
        var polyline = new Autodesk.Edit2D.Polyline(points)

        const style = polyline.style

        style.lineWidth = 2.5

        style.lineColor = 'rgb(241, 116, 46)'

        style.lineStyle = 1

        this._polylineStyles.push(style)

        // Show it
        layer.addShape(polyline)

    }

    _showPath = (show) => {

        this._polylineStyles.forEach(style => {

            style.lineAlpha = show ? 1 : 0

        })

        this._edit2DExtn.defaultContext.layer.update()

    }

    updateNavigator = async (position, yaw) => {

        const localPos = this._toLocalPosition(position)

        // localPos.z += 10

        if(this._navigatorMesh) {

            this._navigatorMesh.rotation.z = yaw

            this._navigatorMesh.position.set(localPos.x, localPos.y, localPos.z)

        }

        this._viewer.impl.invalidate(false, false, true)

    }

    _createNavigator = () => {

        if(!this._navigatorMesh) {

            this._scaleFactor = 1

            const group = new THREE.Group()

            group.add(this._createBaseCircle())

            group.add(this._createArrow())

            group.add(this._createBorder())

            group.position.set(0, 0, 0)

            group.rotation.z = 0

            this._navigatorMesh = group

            this._viewer.overlays.addMesh(this._navigatorMesh, 'pivot')

            this._viewer.impl.overlayScenes['pivot'].scene.position.z = 1

        }

    }

    _createArrow = () => {

        const shape = new THREE.Shape()

        shape.moveTo(0, 0.6)

        shape.moveTo(-0.5, -0.5)

        shape.moveTo(0, -0.15)

        shape.moveTo(0.5, -0.4)

        shape.moveTo(0, 0.6)

        const geom = new THREE.ShapeGeometry(shape)

        const material = new THREE.MeshBasicMaterial({ color: 0xffffff })

        const mesh = new THREE.Mesh(geom, material)

        return mesh

    }

    _createBaseCircle = () => {

        const geom = new THREE.RingGeometry(0, 0.75, 360)

        const material = new THREE.MeshBasicMaterial({ color: 0x797ef6 })

        const mesh = new THREE.Mesh(geom, material)

        return mesh

    }

    _createBorder = () => {

        const geom = new THREE.RingGeometry(0.8, 0.9, 360)

        const material = new THREE.MeshBasicMaterial({ color: 0x797ef6 })

        const mesh = new THREE.Mesh(geom, material)

        return mesh

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

            for (let i = 0; i < 360; i = i + 5) {

                animatedUrls.push(`/icons/navigator/loc-${i}.png`)
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

                    deg = (Math.floor(deg / 5) * 5) % 360
                }

                const sprite = `/icons/navigator/loc-${deg}.png`

                return {

                    icon: sprite,

                    size: 28,

                    offset: 1
                }
            }

            case 'Drone Image': return {

                icon: '/icons/360VideoWalkInViewer.svg',

                size: isMobile() ? 25 : 12,

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

                size: isMobile() ? 25 : 12,

                offset: 1500
            }

            case ForgeDataVizUtils.ISSUE: return {

                icon: '/icons/issuesInViewer.svg',

                size: 48,

                offset: 500
            }

            case ForgeDataVizUtils.TASK: return {

                icon: '/icons/tasksInViewer.svg',

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

    _toGlobalPosition = (position) => {

        let _position = applyTM(position, this._tm)

        _position = removeOffset(_position, this._offset)

        return _position
    }

    _addListeners = () => {

        this._viewer.addEventListener(Autodesk.DataVisualization.Core.MOUSE_CLICK, this._onSpriteClick)
    }

    _onSpriteClick = (event) => {

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
        if (!viewableData || !viewableData.viewables || viewableData.viewables.length == 0) return
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

                const updates = callback(dbId);
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