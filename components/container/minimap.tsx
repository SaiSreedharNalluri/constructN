import React, { useEffect, useRef, useState } from 'react'

interface IProps {

    id: string,

    onInit?: Function,

    token: string,

    expiry: number,

    url?: string,

    model?: any
}

const viewerConfig = {

    extensions: ['Autodesk.BimWalk', 'Autodesk.DataVisualization'],
}


function MiniMap(props: IProps) {

    const viewerId = props.id

    const _forge = useRef<any>()

    const _manifestNode = useRef<Autodesk.Viewing.BubbleNode>()

    const _model = useRef<Autodesk.Viewing.Model>()

    let _tm

    let _globalOffset

    const initViewer = function () {

        if (!_forge.current) {

            const initializerCallBack = () => {

                let htmlDiv = document.getElementById(viewerId)

                if (htmlDiv) {

                    _forge.current = new Autodesk.Viewing.GuiViewer3D(htmlDiv, viewerConfig)

                    setUpEventListeners()

                    console.log('Initialised.....')

                    let startedCode = _forge.current.start(initializeOptions)

                    _forge.current.canvasId = viewerId

                    if (startedCode > 0) {

                        console.error('Failed to create a Viewer: WebGL not supported.')

                        return
                    }

                    if (props.url) {

                        console.log('Coming here.....')

                        _forge.current.loadExtension('Autodesk.PDF').then(() => {

                            _forge.current.loadModel(props.url, _forge.current);
                            
                            _forge.current.loadExtension("Autodesk.Viewing.MarkupsCore");
                            
                            _forge.current.loadExtension("Autodesk.Viewing.MarkupsGui");
                        });
                    }
                }
            };

            console.log('Initialising')

            Autodesk.Viewing.Initializer(initializeOptions, initializerCallBack)
        }
    }

    useEffect(() => { initViewer() }, [])

    useEffect(() => { loadModels() }, [props.model])

    const initializeOptions = {

        
        useADP: false,

        method: "POST",
        
        url: props.url,

        env: 'AutodeskProduction2',

        api: 'streamingV2',

        getAccessToken: async function (onSuccess: (access_token: string, expity: number) => void) {

            onSuccess(props.token, props.expiry);
        },
    }

    const loadModels = () => {

        if (props.model) {

            const document = props.model

            Autodesk.Viewing.Document.load(
                document.urn,
                async function (viewerDocument) {

                    _manifestNode.current = viewerDocument.getRoot().getDefaultGeometry();

                    _model.current = await _forge.current.loadDocumentNode(
                        viewerDocument,
                        _manifestNode.current,
                        generateModelOptions(document.tm, _manifestNode.current!!)
                    )
                },

                function () {
                    console.error('Failed fetching Forge manifest');
                }
            )

            const generateModelOptions = (tm: any, manifestNode: Autodesk.Viewing.BubbleNode) => {

                const modelOptions: Autodesk.Viewing.ViewerConfig = {
                    applyScaling: 'm'
                };

                if (manifestNode.is2D()) {
                    let leafletOptions = {
                        fitPaperSize: true,
                        isPdf: true,
                    };

                    modelOptions.page = 1;
                    modelOptions.leafletOptions = leafletOptions;
                }

                modelOptions.globalOffset = { x: 0, y: 0, z: 0 };
                let globalOff = [0, 0, 0];

                _tm = []
                _globalOffset = globalOff
                if (tm && tm.tm) {
                    _tm = tm.tm
                    const _matrix4: any = new THREE.Matrix4()
                    modelOptions.placementTransform = _matrix4
                        .fromArray(tm.tm)
                        .transpose();
                    // console.log('BIM TM Loaded', tm);
                }

                if (tm && tm.offset) {
                    globalOff = tm.offset;
                    modelOptions.globalOffset = {
                        x: globalOff[0],
                        y: globalOff[1],
                        z: globalOff[2],
                    };
                    _globalOffset = tm.offset
                    if (_manifestNode.current?.is2D()) {
                        _globalOffset[0] = 0;
                        _globalOffset[1] = 0;
                    }
                }
                return modelOptions;
            };
        }
    }

    const setUpEventListeners = () => {
        _forge.current.addEventListener(
            Autodesk.Viewing.VIEWER_INITIALIZED,
            () => { if (props.onInit) props.onInit(_forge) }
        );
        // _forge.current.addEventListener(
        //   Autodesk.Viewing.VIEWER_UNINITIALIZED,
        //   onViewerUnInitialized
        // );
        // _forge.current.addEventListener(
        //   Autodesk.Viewing.PROGRESS_UPDATE_EVENT,
        //   modelLoadProgress
        // );
        // _forge.current.addEventListener(
        //   Autodesk.Viewing.MODEL_LAYERS_LOADED_EVENT,
        //   onModelLayersLoadedEvent
        // );
        // _forge.current.addEventListener(
        //   Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
        //   onGeometryLoadedEvent
        // );
        // _forge.current.addEventListener(
        //   Autodesk.Viewing.MODEL_UNLOADED_EVENT,
        //   onModelUnLoadedEvent
        // );
        // _forge.current.addEventListener(
        //   Autodesk.Viewing.EXTENSION_LOADED_EVENT,
        //   onExtensionLoadedEvent
        // );
        // _forge.current.addEventListener(
        //   Autodesk.Viewing.CAMERA_CHANGE_EVENT,
        //   onCameraChangeEvent
        // );

        // let viewerElement = document.getElementById(viewerId);
        // if (viewerElement) {
        //   viewerElement.addEventListener('mouseenter', onMouseEnter);
        // }
    };

    const removeEventListeners = () => {
        // _forge.current.removeEventListener(
        //   Autodesk.Viewing.VIEWER_INITIALIZED,
        //   onViewerInitialized
        // );
        // _forge.current.removeEventListener(
        //   Autodesk.Viewing.VIEWER_UNINITIALIZED,
        //   onViewerUnInitialized
        // );
        // _forge.current.removeEventListener(
        //   Autodesk.Viewing.PROGRESS_UPDATE_EVENT,
        //   modelLoadProgress
        // );
        // _forge.current.removeEventListener(
        //   Autodesk.Viewing.MODEL_LAYERS_LOADED_EVENT,
        //   onModelLayersLoadedEvent
        // );
        // _forge.current.removeEventListener(
        //   Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
        //   onGeometryLoadedEvent
        // );
        // _forge.current.removeEventListener(
        //   Autodesk.Viewing.MODEL_UNLOADED_EVENT,
        //   onModelUnLoadedEvent
        // );
        // _forge.current.removeEventListener(
        //   Autodesk.Viewing.EXTENSION_LOADED_EVENT,
        //   onExtensionLoadedEvent
        // );
        // _forge.current.removeEventListener(
        //   Autodesk.Viewing.CAMERA_CHANGE_EVENT,
        //   onCameraChangeEvent
        // );

        // let viewerElement = document.getElementById(viewerId);
        // if (viewerElement) {
        //   viewerElement.removeEventListener('mouseenter', onMouseEnter);
        // }
    };

    return (
        <>
            <div id={viewerId} className='relative w-full h-full z-5'></div>
        </>
    );
};

export default MiniMap