
import { toast } from 'react-toastify'

import { IAsset, IAssetPoint, IAssetStage } from '../models/IAssetCategory'

import { publish, subscribe, unsubscribe } from '../services/light-box-service'

export class ForgeEdit2DUtils {

    private _edit2DExtn: Autodesk.Extensions.Edit2D

    private _viewer: Autodesk.Viewing.GuiViewer3D

    private _edit2DContext: Autodesk.Edit2D.Edit2DContext

    private _edit2DLayer: Autodesk.Edit2D.EditLayer

    private _tm: THREE.Matrix4

    private _offset: number[]

    private _editable: boolean

    private _shapeMap: { [key: number]: Autodesk.Edit2D.Shape } = {}


    constructor(viewer: Autodesk.Viewing.GuiViewer3D, _edit2DExtn: Autodesk.Extensions.Edit2D, editable: boolean = true) {

        this._viewer = viewer

        this._edit2DExtn = _edit2DExtn

        this._edit2DExtn.registerDefaultTools()

        this._edit2DContext = this._edit2DExtn.defaultContext

        this._edit2DLayer = this._edit2DContext.layer

        // this._eventHandler = dataVizHandler

        this._addListeners()

        this._editable = editable

        this._tm = new THREE.Matrix4().identity()

        this._offset = [0, 0, 0]

        
    }

    loadAssets(assets: IAsset[]) {

        this._edit2DLayer?.clear()

        assets.forEach(asset => {

            const color = asset.progress.stage == 'NOT_STARTED' ? '#000080' : (asset.progress.stage as IAssetStage).color

            if(asset.shape == 'Polygon') this._createPolygon(asset._id, asset.points, color)

            else if(asset.shape == 'Polyline') this._createPolyline(asset._id, asset.points, color)

        })

    }

    _createPolygon(assetId: string, points: IAssetPoint[], color: string) {

        var poly = new Autodesk.Edit2D.Polygon(points, new Autodesk.Edit2D.Style({

            lineColor: color, lineWidth: 6, fillColor: color, fillAlpha: 0.25

        }));

        (poly as any).name = assetId

        this._edit2DLayer.addShape(poly)
    }

    _createPolyline(assetId: string, points: IAssetPoint[], color: string) {

        var poly = new Autodesk.Edit2D.Polyline(points, new Autodesk.Edit2D.Style({

            lineColor: color, lineWidth: 6

        }));

        (poly as any).name = assetId

        this._edit2DLayer.addShape(poly)
    }

    _onMoveVertex(event: any) {

        if (!this._editable) {

            event.action.undo();

            (this._edit2DExtn.defaultContext as any).selection.clear()

        } else {

            // console.log(event.action.poly)

            publish('update-2d-shape', { _id: event.action.poly.name, points: event.action.poly._loops[0] })

        }

    }

    _onMoveShapes(event: any) {

        if (!this._editable) {

            event.action.undo()

        } else {

            // console.log(event.action.shapes[0])

            publish('update-2d-shape', { _id: event.action.shapes[0].name, points: event.action.shapes[0]._loops[0] })

        }

        (this._edit2DExtn.defaultContext as any).selection.clear()

    }

    _getTool(type: string) {

        switch (type) {

            case 'Select': return this._edit2DExtn.defaultTools.polygonEditTool

            case 'Move': return this._edit2DExtn.defaultTools.moveTool

            case 'Polygon': return this._edit2DExtn.defaultTools.polygonTool

            case 'Line': return this._edit2DExtn.defaultTools.polylineTool

            case 'Circle': return this._edit2DExtn.defaultTools.insertSymbolTool

        }
    }

    _startTool(tool: Autodesk.Viewing.ToolInterface) {

        const controller = this._viewer.toolController

        let activeTool: any = controller.getActiveTool()

        const isEdit2D = activeTool && activeTool.getName().startsWith('Edit2')

        // deactivate any previous edit2d tool

        if (isEdit2D) {

            controller.deactivateTool(activeTool.getName())

            activeTool = null
        }

        // stop editing tools

        if (!tool) return

        controller.activateTool(tool.getName())

    }

    _stopTool() {

        const controller = this._viewer.toolController

        let activeTool: any = controller.getActiveTool()

        const isEdit2D = activeTool && activeTool.getName().startsWith('Edit2')

        // deactivate any previous edit2d tool

        if (isEdit2D) {

            controller.deactivateTool(activeTool.getName())

            activeTool = null

        }

    }

    setTransform(tm: THREE.Matrix4, offset: number[]) {

        this._tm = tm

        this._offset = offset
    }

    _toLocalPosition = (position: THREE.Vector3) => {

        let _position = this._applyTMInverse(position, this._tm)

        return this._applyOffset(_position, this._offset)
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

    private _progress2dTool = (event: any) => {

        const tool = event.detail

        // console.log(event, tool)

        if (tool && this._edit2DExtn) this._startTool(this._getTool(tool))

        else this._stopTool()

    }

    private _assetCreated = (event: any) => {

        const {shapeId, assetId} = event.detail

        // console.log(event, shapeId)

        const shape = this._edit2DLayer.shapes.find((value: Autodesk.Edit2D.Shape, index: number, obj: Autodesk.Edit2D.Shape[]) => shapeId == value.id)

        if(shape !== undefined) (shape as any).name = assetId;

        (this._edit2DContext as any).selection.selectOnly(shape)

        publish('select-2d-shape', assetId)
    }

    private _clearSelection = (event: any) => {

        (this._edit2DContext as any).selection.selectOnly(undefined)

    }

    private _deleteShape = (event: any) => {

        const assetId = event.detail

        const shape = this._edit2DLayer.shapes.find((value: any, index: number, obj: Autodesk.Edit2D.Shape[]) => assetId == value.name)

        if(shape !== undefined) this._edit2DLayer.removeShape(shape)

    }

    private _visibilityChange = (event: any) => {

        const visibilityMap: any = {}

        const {assets, stageMap} = structuredClone(event.detail)

        assets.forEach((asset: IAsset) => {

            const progressSnapshot = asset.progressSnapshot

            for(let i = progressSnapshot.length - 1; i >= 0; i--) {

                const snapshotStage = stageMap[progressSnapshot[i].stage as string]

                if(snapshotStage.visible) {

                    visibilityMap[asset._id] = snapshotStage.color

                    break

                }

            }

            if(!visibilityMap[asset._id]) visibilityMap[asset._id] = '#000080'

        })

        this._edit2DLayer.shapes.forEach((shape: any) => {

            if(visibilityMap[shape.name]) {

                const style = shape.style

                style.lineColor = visibilityMap[shape.name]

                style.fillColor = visibilityMap[shape.name]

                // style.lineAlpha = visibilityMap[shape.name] === '#000080' ? 0 : 1

            }

        })

        this._edit2DLayer.update()

    }

    private _undoStackAction = (event: any) => {

        // console.log(event)

        switch (event.action.constructor.name) {

            case 'MoveVertex':

            case 'Re':

            case 'MoveLoop':

                this._onMoveVertex(event)

                break

            case 'MoveShapes':

                this._onMoveShapes(event)

                break

            case 'AddShape':

                const matches = this._viewer.toolController.getActiveTool().getName().match(new RegExp('Edit2_' + '(.*)' + '_default'))

                publish('add-2d-shape', { id: event.action.shape.id, points: event.action.shape._loops[0], type: matches ? matches[1].replace('Tool', '') : '' })

                break

            case 'RemoveShape':

                if(this._editable) publish('remove-2d-shape', { id: event.action.shape.id, assetId: event.action.shape.name })

                else {
                    
                    toast.warning('You are not authorised to remove an asset!', { autoClose: 5000 })

                    publish('remove-2d-shape', undefined)

                }

                break

        }

    }

    private _selectionChanged = (event: any) => {

        // console.log(event)

        const selected: any[] = Object.values(event.target.isSelected)

        const selectedId = selected.length == 0 ? undefined : selected[0].name

        publish('select-2d-shape', selectedId)

    }

    _addListeners = () => {

        subscribe('progress-2d-tool', this._progress2dTool)

        subscribe('asset-created', this._assetCreated)

        subscribe('clear-shape-selection', this._clearSelection)

        subscribe('delete-shape', this._deleteShape)

        subscribe('visibility-change', this._visibilityChange)

        this._edit2DContext.undoStack.addEventListener(Autodesk.Edit2D.UndoStack.AFTER_ACTION, this._undoStackAction);

        (this._edit2DContext as any).selection.addEventListener(Autodesk.Edit2D.Selection.Events.SELECTION_CHANGED, this._selectionChanged)

    }

    _removeListeners = () => {

        unsubscribe('progress-2d-tool', this._progress2dTool)

        unsubscribe('asset-created', this._assetCreated)

        unsubscribe('clear-shape-selection', this._clearSelection)

        unsubscribe('delete-shape', this._deleteShape)

        unsubscribe('visibility-change', this._visibilityChange)

        this._edit2DContext.undoStack.removeEventListener(Autodesk.Edit2D.UndoStack.AFTER_ACTION, this._undoStackAction);

        (this._edit2DContext as any).selection.removeEventListener(Autodesk.Edit2D.Selection.Events.SELECTION_CHANGED, this._selectionChanged)

    }

    destroy = () => {

        this._removeListeners()

        this._edit2DExtn.unregisterDefaultTools()

        this._edit2DExtn.unload()

    }
}

