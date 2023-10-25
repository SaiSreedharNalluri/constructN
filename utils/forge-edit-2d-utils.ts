import { subscribe } from "../services/light-box-service"

export class ForgeEdit2DUtils {

    private _edit2DExtn: Autodesk.Extensions.Edit2D

    private _viewer: Autodesk.Viewing.GuiViewer3D

    private _tm: THREE.Matrix4

    private _offset: number[]

    constructor(viewer: Autodesk.Viewing.GuiViewer3D, _edit2DExtn: Autodesk.Extensions.Edit2D) {

        this._viewer = viewer

        this._edit2DExtn = _edit2DExtn

        this._edit2DExtn.registerDefaultTools()

        // this._eventHandler = dataVizHandler

        this._addListeners()

        this._tm = new THREE.Matrix4().identity()

        this._offset = [0, 0, 0]

        // Create simple triangle
        var poly = new Autodesk.Edit2D.Polyline([
            { x: 10, y: 15 },
            { x: 20, y: 10 },
            { x: 15, y: 15 }
        ]);

        // Show it
        this._edit2DExtn.defaultContext.layer.addShape(poly);

        
        // this._viewer.setNavigationLockSettings({

        //     orbit: true,

        //     pan: false,

        //     zoom: true,

        //     roll: true,

        //     fov: true,

        // })

        // this._viewer.setNavigationLock(true)

        subscribe('startTool', (event: any) => {

            const tool = event.detail

            console.log(event, tool)

            this.startTool(this._edit2DExtn.defaultTools.polygonEditTool)

        })

        this._edit2DExtn.defaultContext.undoStack.addEventListener(Autodesk.Edit2D.UndoStack.AFTER_ACTION, (event: any) => {

            console.log(event)

            // this.stopTool()

            console.log(this._edit2DExtn.defaultTools)

            // this.startTool(this._edit2DExtn.defaultTools.polylineTool)

        });

        (this._edit2DExtn.defaultContext as any).selection.addEventListener(Autodesk.Edit2D.Selection.Events.SELECTION_CHANGED, (event: any) => {

            console.log(event)

            // this.stopTool()

            // this.startTool(this._edit2DExtn.defaultTools.PolygonEditTool)

        })
    }

    startTool(tool: Autodesk.Viewing.ToolInterface) {

        const controller = this._viewer.toolController

        let activeTool: any = controller.getActiveTool()

        console.log(activeTool.getName())

        const isEdit2D = activeTool && activeTool.getName().startsWith("Edit2")

        // deactivate any previous edit2d tool

        if (isEdit2D) {

            controller.deactivateTool(activeTool.getName())

            activeTool = null
        }

        // stop editing tools

        if (!tool) return

        controller.activateTool(tool.getName())

        console.log(controller.getActiveTool().getName())

    }

    stopTool() {

        const controller = this._viewer.toolController

        let activeTool: any = controller.getActiveTool()

        console.log(activeTool.getName())

        const isEdit2D = activeTool && activeTool.getName().startsWith("Edit2")

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

        
    }

    _removeListeners = () => {

        
    }
}

