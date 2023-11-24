import { degrees2radians, radians2degrees } from '@turf/turf'

import { publish, subscribe, unsubscribe } from '../services/light-box-service'


export class ForgeDataVizUtils {

    static NAVIGATOR = 'NAVIGATOR'

    static ISSUE = 'Issue'

    static TASK = 'Task'

    private _dataVizExtn: Autodesk.Extensions.DataVisualization

    private _viewer: Autodesk.Viewing.GuiViewer3D

    private _viewableDataMap: {[key: string]: Autodesk.DataVisualization.Core.ViewableData[]}

    private _dbMap: {[key: number]: any}

    private _existingTags: string[]

    private _existingImages: string[]

    private _lastUpdated?: number

    private _tm: THREE.Matrix4

    private _offset: number[]

    private _windowScale: number

    private _scaleFactor: number = 1

    private _navigatorMesh?: THREE.Group

    private _navPosition = new THREE.Vector3(0, 0, 0)

    private tagVisibility = {

        '360 Video': true,

        '360 Image': true,

        'Phone Image': true,

        'Task': true,

        'Issue': true

    }

    constructor(viewer: Autodesk.Viewing.GuiViewer3D, dataVizExtn: Autodesk.Extensions.DataVisualization) {

        this._viewer = viewer

        this._dataVizExtn = dataVizExtn

        // this._eventHandler = dataVizHandler

        this._addListeners()

        this._viewableDataMap = {}

        this._dbMap = {}

        this._existingTags = []

        this._existingImages = []

        this._tm = new THREE.Matrix4().identity()

        this._offset = [0, 0, 0]

        this._windowScale = 1

        this._viewer.impl.overlayScenes.pivot.scene.children = []

        this._viewer.impl.overlayScenes.pivot.needSeparateDepth = true

        this._viewer.impl.overlayScenes.DataVizDots.needSeparateDepth = true

        this._viewer.impl.invalidate(false, false, true)

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

    setWindowScale(mScale: number) {

        const scale = this._scaleFactor / 17

        this._windowScale = mScale

        if (this._navigatorMesh) {

            this._navigatorMesh.scale.x = scale * this._windowScale

            this._navigatorMesh.scale.y = scale * this._windowScale

        }
    }

    setTransform(tm: THREE.Matrix4, offset: number[]) {

        this._tm = tm

        this._offset = offset
    }

    loadTasks = async (tasks: any[]) => {

        const data: any[] = []

        tasks.forEach(task => {

            if(task.context) {

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

    loadIssues = async (issues: any[]) => {

        const data: any[] = []

        issues.forEach((issue: any) => {

            if(issue.context) {

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

    loadMediaData = async (mediaData: any[]) => {

        let dbObject: any

        for (const [type, realities] of Object.entries(mediaData)) {

            const data: any[] = []

            realities.forEach((reality: any) => {

                if (reality['position']) {

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

                        if (this._existingImages.indexOf(images[i]) == -1) {

                            let mPosition = []

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

                                imageName: `${reality.path.replace('.json', '/')}${images[i]}`,

                                position: this._toLocalPosition(new THREE.Vector3(mPosition[0], mPosition[1], mPosition[2])),

                                originalPosition: new THREE.Vector3(mPosition[0], mPosition[1], mPosition[2]),

                                rotation: mRotation,

                                type: type
                            })
                        }
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

            let mType = type as '360 Video' | '360 Image' | 'Phone Image' | 'Task' | 'Issue'

            if(this.tagVisibility[mType] === false) this.showTag(mType, this.tagVisibility[mType])

            if(type === '360 Video' && !dbObject) {

                dbObject = data[0]

            }
        }
    }

    showTag = (type: '360 Video' | '360 Image' | 'Phone Image' | 'Task' | 'Issue', show: boolean) => {

        this.tagVisibility[type] = show

        const viewableDatas = this._viewableDataMap[type]

        if (viewableDatas) {

            for (let i = 0; i < viewableDatas.length; i++) {

                const viewableData = viewableDatas[i]

                if (viewableData) {

                    const dbIds = viewableData.viewables.map(v => { return v.dbId })

                    this._invalidateViewables(dbIds, (this._dataVizExtn as any).pointMeshes, viewableData, () => {

                        return {

                            scale: show ? 1 : 0
                        }
                    })
                }
            }
        }
    }

    removeLoadedData = () => {

        this._dataVizExtn.removeAllViewables()

        // this._viewer.overlays.removeMesh(this._navigatorMesh as any, 'pivot')

        this._viewableDataMap = {}

        this._dbMap = {}

        this._existingImages = []

        this._existingTags = []
    }

    updateNavigator = async (position: THREE.Vector3 | undefined, yaw: number) => {

        if(position) this._navPosition = this._toLocalPosition(position)

        // localPos.z += 10

        if(this._navigatorMesh) {

            this._navigatorMesh.rotation.z = yaw

            this._navigatorMesh.position.set(this._navPosition.x, this._navPosition.y, this._navPosition.z)

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

            group.position.set(-1000, -1000, 0)

            group.rotation.z = 0

            this._navigatorMesh = group

            this._viewer.overlays.addMesh(this._navigatorMesh as any, 'pivot')

            this._viewer.impl.overlayScenes['pivot'].scene.position.z = 1

        }

    }

    _createArrow = () => {

        const shape = new THREE.Shape()

        shape.moveTo(0, 0.3)

        shape.moveTo(-0.25, -0.25)

        shape.moveTo(0, -0.075)

        shape.moveTo(0.25, -0.2)

        shape.moveTo(0, 0.3)

        const geom = new THREE.ShapeGeometry(shape as any)

        const material = new THREE.MeshBasicMaterial({ color: 0xffffff })

        const mesh = new THREE.Mesh(geom as any, material)

        return mesh

    }

    _createBaseCircle = () => {

        const geom = new THREE.RingGeometry(0, 0.375, 360)

        const material = new THREE.MeshBasicMaterial({ color: 0x797ef6 })

        const mesh = new THREE.Mesh(geom as any, material)

        return mesh

    }

    _createBorder = () => {

        const geom = new THREE.RingGeometry(0.4, 0.45, 360)

        const material = new THREE.MeshBasicMaterial({ color: 0x797ef6 })

        const mesh = new THREE.Mesh(geom as any, material)

        return mesh

    }

    _createViewableData = async (data: any[], type: string , yaw?: number) => {

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

    _createSpriteViewable = (spriteIcon: string, position: THREE.Vector3, dbId: number) => {

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

    _spriteConfigForType = (type: string, yaw?: number): { icon: string, size: number, offset: number } => {

        switch (type) {

            case ForgeDataVizUtils.NAVIGATOR: {

                let deg: number = 0

                if (yaw) {

                    deg = radians2degrees(yaw) % 360

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

                icon: '/icons/issuesInViewer.svg',

                size: 48,

                offset: 500
            }

            case ForgeDataVizUtils.TASK: return {

                icon: '/icons/tasksInViewer.svg',

                size: 48,

                offset: 10
            }

            default: return {

                icon: '/icons/forge360Image.png',

                size: 48,

                offset: 10
            }
        }
    }

    _toLocalPosition = (position: THREE.Vector3) => {

        let _position = this._applyTMInverse(position, this._tm)

        return  this._applyOffset(_position, this._offset)
    }

    _toGlobalPosition = (position: THREE.Vector3) => {

        let _position = this._applyTM(position, this._tm)

        _position = this._removeOffset(_position, this._offset)

        return _position
    }

    _applyOffset = (position: THREE.Vector4, offset: number[]) => {

        return new THREE.Vector3(position.x - offset[0], position.y - offset[1], position.z - offset[2])
    }
    
    _removeOffset = (position: THREE.Vector3, offset: number[]) => {

        return new THREE.Vector3(position.x + offset[0], position.y + offset[1], position.z + offset[2])
    }
    
    _applyTMInverse = (position: THREE.Vector3, tm: THREE.Matrix4) => {

        const a = new THREE.Vector4(position.x, position.y, position.z, 1)
        
        const matrixInv = new THREE.Matrix4()
        
        matrixInv.copy(tm).invert()
        
        a.applyMatrix4(matrixInv)
        
        return a
    }
    
    _applyTM = (position: THREE.Vector3, tm: THREE.Matrix4) => {

        const a = new THREE.Vector3(position.x, position.y, position.z)
        
        a.applyMatrix4(tm)
        
        return a
    }

    _addListeners = () => {

        subscribe('viewerState', this._onViewerStateChange)

        this._viewer.addEventListener(Autodesk.DataVisualization.Core.MOUSE_CLICK, this._onSpriteClick)
    }

    _onSpriteClick = (event: any) => {

        this._dataVizExtn.clearHighlightedViewables()

        let dbObject = structuredClone(this._dbMap[event.dbId])

        if (dbObject) {

            dbObject.position = dbObject.originalPosition

            this.updateNavigator(dbObject.position, 0)

            publish('reality-click', dbObject)

        }
    }

    _removeListeners = () => {

        this._viewer.addEventListener(Autodesk.DataVisualization.Core.MOUSE_CLICK, this._onSpriteClick)

        unsubscribe('viewerState', this._onViewerStateChange)
    }

    destroy = () => {

        this.removeLoadedData()

        this._removeListeners()

        this._dataVizExtn.deactivate()

        this._dataVizExtn.unload()

    }

    _invalidateViewables = (dbIds: number[], meshes: any[], viewableData: any, callback: Function) => {
        if (!dbIds || !meshes || !callback) {
            throw new Error(`Parameters of 'invalidateViewables' are mandatory`);
        }

        if (!(dbIds instanceof Array)) {
            dbIds = [dbIds];
        }

        const dbIdSet = new Set(dbIds);

        /** @type {Map<number, CustomViewable>} */
        const viewables = new Map();
        if (!viewableData || !viewableData.viewables || viewableData.viewables.length == 0) return
        viewableData.viewables.forEach((v: any) => viewables.set(v.dbId, v));

        let sceneUpdated = false;

        for (let k = 0; k < meshes.length; k++) {
            const mesh = meshes[k];
            const geometry = mesh.geometry;
            const ids = geometry.attributes['id'].array;

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
                    const positions = geometry.attributes['position'].array;
                    geometry.attributes['position'].needsUpdate = true;
                    positions[pointIndex * 3 + 0] = updates.position.x;
                    positions[pointIndex * 3 + 1] = updates.position.y;
                    positions[pointIndex * 3 + 2] = updates.position.z;

                    sceneUpdated = true;
                }

                if (updates.url) {
                    const uv = viewableData.getSpriteUV(updates.url);
                    if (uv) {
                        const uvp = geometry.attributes['uvp'].array;
                        geometry.attributes['uvp'].needsUpdate = true;
                        uvp[pointIndex * 4 + 0] = uv.x;
                        uvp[pointIndex * 4 + 1] = uv.y;
                        uvp[pointIndex * 4 + 2] = uv.w;
                        uvp[pointIndex * 4 + 3] = uv.h;

                        sceneUpdated = true;
                    }
                }

                if (updates.color) {
                    const colors = geometry.attributes['color'].array;
                    geometry.attributes['color'].needsUpdate = true;
                    colors[pointIndex * 3 + 0] = updates.color.r * 255;
                    colors[pointIndex * 3 + 1] = updates.color.g * 255;
                    colors[pointIndex * 3 + 2] = updates.color.b * 255;

                    sceneUpdated = true;
                }

                if (updates.scale !== undefined) {
                    if (updates.scale > 2.0 || updates.scale < 0) {
                        const msg = `invalidateViewables: 'scale' of '${updates.scale}' out of range [0, 2]`;
                    }
                    const scale = geometry.attributes['pointScale'].array;
                    geometry.attributes['pointScale'].needsUpdate = true;
                    scale[pointIndex] = updates.scale;

                    sceneUpdated = true;
                }
            }
        }

        if (sceneUpdated) {
            this._viewer.impl.invalidate(false, false, true);
        }
    }

    _onViewerStateChange = (event: Event) => {

        const viewerState = (event as CustomEvent).detail

        if (viewerState) {

            let rotation = viewerState.rotation

            rotation = rotation - Math.PI / 2

            // console.log(rotation)

            this.updateNavigator(undefined, rotation)

        } else {

            this.updateNavigator(new THREE.Vector3(-1000, -1000, 0), 0)

        }

    }
}

