'use client'

import { MutableRefObject, useEffect, useRef } from 'react'

interface _ViewerProps {

    id: string,

    viewType: string,

    onInit: (forge: MutableRefObject<Autodesk.Viewing.GuiViewer3D | undefined>, alreadyInitialised: boolean) => void,

    models?: any[],

    onModelLoaded?: Function,

    layers?: any,

    onLayersLoaded?: Function,

    viewerState?: any,

    onExtnLoaded?: Function
}


function Forge(props: _ViewerProps) {

    const viewerId = props.id

    const _forge = useRef<Autodesk.Viewing.GuiViewer3D>()

    const _manifestNode = useRef<Autodesk.Viewing.BubbleNode>()

    const _model = useRef<Autodesk.Viewing.Model>()

    const _tm = useRef<THREE.Matrix4>()

    const _globalOffset = useRef<number[]>()

    const _models = useRef<any[]>()

    const _onMouseOver = useRef<boolean>(false)

    useEffect(() => {

        document.getElementById(viewerId)?.addEventListener('mouseenter', _onMouseEnter)

        document.getElementById(viewerId)?.addEventListener('mouseleave', _onMouseLeave)

    }, [])

    useEffect(() => { initViewer(props.onInit) }, [props.viewType])

    useEffect(() => { updateViewerState(props.viewerState) }, [props.viewerState])

    useEffect(() => { 

        _models.current = props.models
        
        loadModels(props.models, props.onModelLoaded) 
    
    }, [props.models])

    const initViewer = (onInit?: (forge: MutableRefObject<Autodesk.Viewing.GuiViewer3D | undefined>, alreadyInitialised: boolean) => void) => {

        if (!_forge.current) {

            let htmlDiv = document.getElementById(viewerId)

            if (htmlDiv) {

                if (viewerId == 'left')

                    _forge.current = ForgeInstance.Instance.getBaseViewer(viewerId)!

                else if (viewerId == 'right')

                    _forge.current = ForgeInstance.Instance.getCompareViewer(viewerId)!

                else if (viewerId == 'minimap-left-container')

                    _forge.current = ForgeInstance.Instance.getMinimapBaseViewer(viewerId)!

                else

                    _forge.current = ForgeInstance.Instance.getMinimapCompareViewer(viewerId)!

                _forge.current?.addEventListener(

                    Autodesk.Viewing.VIEWER_INITIALIZED,

                    () => { if (onInit) onInit(_forge, false) }
                    
                )

                _forge.current?.addEventListener(

                    Autodesk.Viewing.CAMERA_CHANGE_EVENT,

                    (camera: any) => { 

                        if(viewerId != 'minimap') {

                            const state  = _forge.current!.getState({viewport: true}).viewport

                            const viewState = {

                                position: {x: state.eye[0], y: state.eye[1], z: state.eye[2]},
    
                                target: {x: state.target[0], y: state.target[1], z: state.target[2]},
    
                                viewerId
                            }
                            
                            if(_onMouseOver.current) {
                                
                                

                            }
                        }
                    }                    
                )

                let startedCode = _forge.current.start()

                _forge.current.canvas.id = viewerId

                if (startedCode > 0) {

                    console.error('Failed to create a Viewer: WebGL not supported.')

                    return
                
                } else {

                    if (onInit) onInit(_forge, false) 

                }

                _forge.current.navigation.setWorldUpVector(
                    new THREE.Vector3(0, 1, 0), true, false
                )

                _forge.current.navigation.setReverseZoomDirection(true)

                _forge.current.setReverseHorizontalLookDirection(true)

                _setForgeControls()

                _forge.current.addEventListener(Autodesk.Viewing.EXTENSION_LOADED_EVENT, _onExtensionLoadedEvent)
            }

        } else {

            console.log('CNI.AI', 'Forge viewer already Initialised', viewerId)

            if (onInit) onInit(_forge, true)
        }
    }

    const loadModels = (models?: any[], onModelLoaded?: Function) => {

        _forge.current?.addEventListener(

            Autodesk.Viewing.MODEL_ADDED_EVENT,

            (e) => { if (onModelLoaded) onModelLoaded(e.model, _tm.current, _globalOffset.current) }
            
        )

        if (_model.current) {

            _forge.current?.unloadModel(_model.current)
        }

        if (models && models.length > 0) {

            const document = models[0]

            const _matrix4: any = new THREE.Matrix4()
                    
            _tm.current = _matrix4.fromArray(document.tm).transpose()

            _globalOffset.current = document.offset

            // _globalOffset.current![0] = 0
                
            // _globalOffset.current![1] = 0

            Autodesk.Viewing.Document.load(
                document.urn,
                async function (viewerDocument) {

                    _manifestNode.current = viewerDocument.getRoot().getDefaultGeometry();

                    _model.current = await _forge.current?.loadDocumentNode(
                        viewerDocument,
                        _manifestNode.current,
                        generateModelOptions(document.tm, document.offset, _manifestNode.current!!)
                    )
                },

                function () {

                    console.error('Failed fetching Forge manifest');
                }
            )

            const generateModelOptions = (tm: THREE.Matrix4, offset: number[], manifestNode: Autodesk.Viewing.BubbleNode) => {

                const modelOptions: Autodesk.Viewing.ViewerConfig = { applyScaling: 'm' }

                if (manifestNode.is2D()) {

                    let leafletOptions = {
                    
                        fitPaperSize: true,
                    
                        isPdf: true,
                    }

                    modelOptions.page = 1

                    modelOptions.leafletOptions = leafletOptions

                }

                if (tm && !manifestNode.is2D()) {
                    
                    modelOptions.placementTransform = _tm.current
                
                }

                modelOptions.globalOffset = { x: 0, y: 0, z: 0 }

                _globalOffset.current = offset ? offset : [0, 0, 0]

                modelOptions.globalOffset = {

                    x: _globalOffset.current[0],

                    y: _globalOffset.current[1],

                    z: _globalOffset.current[2]
                
                }
                
                if (_manifestNode.current?.is2D()) {
                
                    _globalOffset.current![0] = 0
                    
                    _globalOffset.current![1] = 0
                
                }

                return modelOptions;
            };
        }
    }

    const _setForgeControls = () => {

        if (_manifestNode.current?.is2D()) {

            _forge.current?.setNavigationLockSettings({

                orbit: false,

                pan: true,

                zoom: true,

                roll: true,

                fov: true,

            })

            _forge.current?.setNavigationLock(false)

        } else {

            if (viewerId == 'right') {

                _forge.current?.setNavigationLockSettings({

                    orbit: false,

                    pan: true,

                    zoom: false,

                    roll: true,

                    fov: false

                })

                _forge.current?.setNavigationLock(false)

            }

        }

    }

    const _onExtensionLoadedEvent = (parameter: any) => {

        const _extn = _forge.current?.getExtension(parameter.extensionId)

        if(props.onExtnLoaded) props.onExtnLoaded(_extn, parameter.extensionId)
        
        if (parameter.extensionId === 'Autodesk.BimWalk') {

            if(viewerId == 'right') (_forge.current?.getExtension("Autodesk.BimWalk") as any).activate()

        }
    }

    const _onMouseEnter = () => { _onMouseOver.current = true }

    const _onMouseLeave = () => { _onMouseOver.current = false }

    const updateViewerState = (viewerState: any) => {

        if (viewerState && viewerId != viewerState.viewerId) {

            if(viewerId == 'right') (_forge.current?.getExtension("Autodesk.BimWalk") as any).activate()

            if (viewerId === 'minimap') {

                console.log('Skipping in minimap')

            } else {

                // console.log(viewerState)

                const position = structuredClone(viewerState.position)

                const target = structuredClone(viewerState.target)

                if (viewerState.position)

                    _forge.current?.navigation.setPosition(position)

                if (viewerState.target)

                    _forge.current?.navigation.setTarget(target)

                if (viewerState.fov)

                    _forge.current?.navigation.setVerticalFov(viewerState.fov, false)

            }

        }

    }

    return (
        <>
            <div id={viewerId} className='relative h-full w-full' ></div>
        </>
    )
}

export default Forge


class ForgeInstance {

    private static _instance: ForgeInstance

    private _baseViewer: Autodesk.Viewing.GuiViewer3D | undefined = undefined

    private _compareViewer: Autodesk.Viewing.GuiViewer3D | undefined = undefined

    private _baseMinimapViewer: Autodesk.Viewing.GuiViewer3D | undefined = undefined

    private _compareMinimapViewer: Autodesk.Viewing.GuiViewer3D | undefined = undefined

    private viewerConfig = {

        extensions: ['Autodesk.BimWalk', 'Autodesk.DataVisualization', 'Autodesk.Edit2D'],

        theme: 'light-theme'

    }

    private constructor() { }

    public static get Instance() {

        if (!this._instance) {

            this._instance = new ForgeInstance()
        }

        return this._instance
    }

    public getBaseViewer(viewerId: string) {

        if (!this._baseViewer) {

            const htmlDiv = document.getElementById(viewerId)

            if (htmlDiv) {

                this._baseViewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, this.viewerConfig)

            }

        } else {

            const child = document.getElementById(viewerId)

            if (child) {

                const parent = child.parentElement

                if (parent) {

                    parent.removeChild(child)

                    parent.insertBefore(this._baseViewer.clientContainer, parent.firstChild)

                }
            }
        }

        return this._baseViewer
    }

    public getCompareViewer(viewerId: string) {

        if (!this._compareViewer) {

            const htmlDiv = document.getElementById(viewerId)

            if (htmlDiv) {

                this._compareViewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, this.viewerConfig)

            }

        } else {

            const child = document.getElementById(viewerId)

            if (child) {

                const parent = child.parentElement

                if (parent) {

                    parent.removeChild(child)

                    parent.insertBefore(this._compareViewer.clientContainer, parent.firstChild)

                }
            }
        }

        return this._compareViewer
    }

    public getMinimapBaseViewer(viewerId: string) {

        if (!this._baseMinimapViewer) {

            const htmlDiv = document.getElementById(viewerId)

            if (htmlDiv) {

                this._baseMinimapViewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, this.viewerConfig)

            }

        } else {

            const child = document.getElementById(viewerId)

            if (child) {

                const parent = child.parentElement

                if (parent) {

                    parent.removeChild(child)

                    parent.appendChild(this._baseMinimapViewer.clientContainer)

                }
            }
        }

        return this._baseMinimapViewer
    }

    public getMinimapCompareViewer(viewerId: string) {

        if (!this._compareMinimapViewer) {

            const htmlDiv = document.getElementById(viewerId)

            if (htmlDiv) {

                this._compareMinimapViewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, this.viewerConfig)

            }

        } else {

            const child = document.getElementById(viewerId)

            if (child) {

                const parent = child.parentElement

                if (parent) {

                    parent.removeChild(child)

                    parent.appendChild(this._compareMinimapViewer.clientContainer)

                }
            }
        }

        return this._compareMinimapViewer
    }

}