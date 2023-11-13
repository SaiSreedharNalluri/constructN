'use client'

import { MutableRefObject, useEffect, useRef, useState } from 'react'

import Forge from './forge'

import { LightBoxInstance, publish } from '../../services/light-box-service'

import { ForgeDataVizUtils } from '../../utils/forge-utils'

import { ForgeEdit2DUtils } from '../../utils/forge-edit-2d-utils'

import { IAsset, IAssetCategory, IAssetStage } from '../../models/IAssetCategory'

import ClickTypesPicker from './segment-class-filters'

import { Paper } from '@mui/material'

interface _ViewerProps {

    id: string,

    viewType: string,

    snapshot: any

    compare: boolean

    assets: IAsset[]

    category: IAssetCategory | undefined

    selectedLayers: string[] | undefined
}


function Progress2DComponent(props: _ViewerProps) {

    const _forge = useRef<Autodesk.Viewing.GuiViewer3D>()

    const _initialised = useRef<boolean>(false)

    const _model = useRef<Autodesk.Viewing.Model>()

    const _layers = useRef<any>()

    const _tm = useRef<THREE.Matrix4>()

    const _offset = useRef<number[]>()

    const _dataVizUtils = useRef<ForgeDataVizUtils>()

    const _edit2dUtils = useRef<ForgeEdit2DUtils>()

    const [viewType, setViewType] = useState<string>(props.viewType)

    const [modelsData, setModelsData] = useState<any[]>([])

    const _assetMap = useRef<{ [key: string]: { assets: string[] } & Partial<IAssetStage> }>({})


    const onInit = async (forge: Autodesk.Viewing.GuiViewer3D | undefined, alreadyInitialised: boolean) => {

        _forge.current = forge

        if (!alreadyInitialised) {

            _initialised.current = true

            _removeToolbar(_forge.current!)

            _changeBackground(_forge.current!)

            if (LightBoxInstance.getViewTypes().indexOf('Plan Drawings') > -1) {

                setModelsData(LightBoxInstance.viewerData()['modelData']['Plan Drawings'])
            }

        }
    }

    useEffect(() => {

        return (() => {

            _edit2dUtils.current?.destroy()

        })

    }, [])

    useEffect(() => { setViewType(props.viewType) }, [props.viewType])

    useEffect(() => { _resize() }, [props.compare])

    useEffect(() => _edit2dUtils.current?.loadAssets(props.assets), [props.assets])

    useEffect(() => {

        if (props.snapshot) {

            _layers.current = props.snapshot.layers

            console.log(_model.current, _layers.current, props.snapshot)

            if (_model.current) loadLayers(props.snapshot.layers)

        }

    }, [props.snapshot])

    useEffect(() => {

        if (props.selectedLayers) {

            _dataVizUtils.current?.showTag('360 Video', props.selectedLayers.includes('360 Video'))

            _dataVizUtils.current?.showTag('360 Image', props.selectedLayers.includes('360 Image'))

            _dataVizUtils.current?.showTag('Phone Image', props.selectedLayers.includes('Phone Image'))

        }

    }, [props.selectedLayers])


    const onModelLoaded = (model: Autodesk.Viewing.Model, tm: THREE.Matrix4, offset: number[]) => {

        _model.current = model

        _tm.current = tm

        _offset.current = offset

        if (_edit2dUtils.current) _edit2dUtils.current.setTransform(_tm.current, _offset.current)

        loadLayers(_layers.current)

        publish('progress-2d-tool', 'Select')

    }

    const loadLayers = (layers?: any[], onLayersLoad?: Function) => {

        if (_tm.current && _offset.current && _dataVizUtils.current) {

            _dataVizUtils.current?.removeLoadedData()

            _dataVizUtils.current?.setTransform(_tm.current!, _offset.current!)

            if (layers) _dataVizUtils.current.loadMediaData(layers)
        }
    }

    const onExtnLoaded = (_extn: Autodesk.Viewing.Extension, extensionId: string) => {

        if (extensionId === 'Autodesk.DataVisualization') {

            _dataVizUtils.current = new ForgeDataVizUtils(_forge.current!, _extn as Autodesk.Extensions.DataVisualization)

        } else if (extensionId === 'Autodesk.Edit2D') {

            _edit2dUtils.current = new ForgeEdit2DUtils(_forge.current!, _extn as Autodesk.Extensions.Edit2D)

            if (_tm.current && _offset.current) _edit2dUtils.current.setTransform(_tm.current, _offset.current)

        }

    }

    const _removeToolbar = (viewer: Autodesk.Viewing.GuiViewer3D) => {

        viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, (e) => {

            const toolbarControls = []

            for (let i = 0; i < e.target.toolbar.getNumberOfControls(); i++) {

                toolbarControls.push(e.target.toolbar.getControlId(i))

            }

            toolbarControls.forEach(control => e.target.toolbar.removeControl(control))

        })

    }

    const _changeBackground = (viewer: Autodesk.Viewing.GuiViewer3D) => {

        viewer.addEventListener(Autodesk.Viewing.MODEL_LAYERS_LOADED_EVENT, (e) => {

            viewer.setBackgroundColor(255, 255, 255, 255, 255, 255)

        })

    }

    const _resize = () => {

        if (_forge && _forge.current) {

            _forge.current.resize()

        }
    }

    return (
        <>

            <Forge

                viewType={viewType}

                onInit={onInit}

                id={`minimap-${props.id}`}

                models={modelsData}

                onModelLoaded={onModelLoaded}

                onExtnLoaded={onExtnLoaded} />

            <div className='flex absolute right-2 w-fit h-fit mt-1' style={{ zIndex: 5 }}>

                { props.category && <Paper className='ml-3' elevation={1}>

                    <ClickTypesPicker />

                </Paper> }

            </div>

        </>
    )
}

export default Progress2DComponent