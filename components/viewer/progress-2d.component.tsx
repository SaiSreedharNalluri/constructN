'use client'

import { MutableRefObject, useEffect, useRef, useState } from 'react'

import Forge from './forge'

import { LightBoxInstance, publish } from '../../services/light-box-service'

import { ForgeDataVizUtils } from '../../utils/forge-utils'

import { ForgeEdit2DUtils } from '../../utils/forge-edit-2d-utils'

import { IAsset, IAssetCategory } from '../../models/IAssetCategory'

import ClickTypesPicker from './segment-class-filters'

import { Paper } from '@mui/material'
import dayjs from 'dayjs'
import moment from 'moment'

interface _ViewerProps {

    id: string,

    viewType: string,

    snapshot: any

    compare: boolean

    reality: boolean

    assets: IAsset[]

    isSupportUser: boolean

    category: IAssetCategory | undefined

    selectedLayers: string[] | undefined

    _forge: MutableRefObject<Autodesk.Viewing.GuiViewer3D | undefined>;

    right?: boolean

    _dataViz: MutableRefObject<ForgeDataVizUtils | undefined>

}


function Progress2DComponent(props: _ViewerProps) {

    const _forge = props._forge

    const _initialised = useRef<boolean>(false)

    const _model = useRef<Autodesk.Viewing.Model>()

    const _layers = useRef<any>()

    const _assets = useRef<any>()

    const _tm = useRef<THREE.Matrix4>()

    const _offset = useRef<number[]>()

    const _dataVizUtils = props._dataViz

    const _edit2dUtils = useRef<ForgeEdit2DUtils>()

    const [viewType, setViewType] = useState<string>(props.viewType)

    const [modelsData, setModelsData] = useState<any[]>([])

    const _currentStructure = useRef<string>()

    const newStructure = LightBoxInstance.viewerData().structure?._id


    const onInit = async (forge: Autodesk.Viewing.GuiViewer3D | undefined, alreadyInitialised: boolean) => {

        _forge.current = forge

        if (!alreadyInitialised) {

            _initialised.current = true

            _removeToolbar(_forge.current!)

            _changeBackground(_forge.current!)

            if (LightBoxInstance.getViewTypes().indexOf('Plan Drawings') > -1) {

                setModelsData(LightBoxInstance.viewerData()['modelData']?.['Plan Drawings'])
            }

        }
    }

    useEffect(() => {

        return (() => {

            if (_dataVizUtils.current && _edit2dUtils.current) {

                try {

                    _dataVizUtils.current?.destroy()

                    _edit2dUtils.current?.destroy()

                    _forge.current?.forEachExtension(extn => {

                        extn.deactivate()

                        extn.unload()

                    })

                    _forge.current?.tearDown(true)

                    _forge.current?.finish()

                } catch (err) { console.log(err) }
            }
        })

    }, [])

    useEffect(() => { setViewType(props.viewType) }, [props.viewType])

    useEffect(() => { _resize() }, [props.reality])

    useEffect(() => {

        _assets.current = props.assets

        _edit2dUtils.current?.loadAssets(props.assets)

    }, [props.assets])

    useEffect(() => {

        if (props.snapshot) {

            _layers.current = props.snapshot.layers

        }

            if(_currentStructure.current !== newStructure) {

                if (LightBoxInstance.getViewTypes().indexOf('Plan Drawings') > -1) {

                    setModelsData(LightBoxInstance.viewerData()['modelData']?.['Plan Drawings'])
                    
                }
    
                _currentStructure.current = newStructure
    
            } else {

                if (_model.current && props.snapshot) loadLayers(props.snapshot.layers)

            }

    }, [props.snapshot, newStructure])

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

        if (_edit2dUtils.current) {
            
            _edit2dUtils.current.setTransform(_getTm(), _getOffset())

            _edit2dUtils.current?.loadAssets(_assets.current)

        }

        loadLayers(_layers.current)

        if (props.selectedLayers) {

            _dataVizUtils.current?.showTag('360 Video', props.selectedLayers.includes('360 Video'))

            _dataVizUtils.current?.showTag('360 Image', props.selectedLayers.includes('360 Image'))

            _dataVizUtils.current?.showTag('Phone Image', props.selectedLayers.includes('Phone Image'))

        }

        publish('progress-2d-tool', 'Select')

        publish('progress-2d-tool-type', 'Select')

    }

    const loadLayers = (layers?: any[], onLayersLoad?: Function) => {

        if (_tm.current && _offset.current && _dataVizUtils.current) {

            _dataVizUtils.current?.removeLoadedData()

            _dataVizUtils.current?.setTransform(_tm.current!, _offset.current!)

            if (layers && props.snapshot) _dataVizUtils.current.loadMediaData(layers, props.snapshot.date)
        }
    }

    const onExtnLoaded = (_extn: Autodesk.Viewing.Extension, extensionId: string) => {

        if (extensionId === 'Autodesk.DataVisualization') {

            _dataVizUtils.current = new ForgeDataVizUtils(_forge.current!, _extn as Autodesk.Extensions.DataVisualization, props.compare)

        } else if (extensionId === 'Autodesk.Edit2D') {

            _edit2dUtils.current = new ForgeEdit2DUtils(_forge.current!, _extn as Autodesk.Extensions.Edit2D, props.isSupportUser)

            if (_tm.current && _offset.current) _edit2dUtils.current.setTransform(_getTm(), _getOffset())

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

           try {

             _forge.current?.resize()

           } catch(e) { console.log(e) }

        }
    }

    const _getTm = () => {

        let mTm = _tm.current
        if(_currentStructure.current === 'STR940183') {
            mTm = applyRotationTm(mTm!)
        } else if(_currentStructure.current === 'STR967653') {
            mTm = applyRotationTm(mTm!)
        }

        return mTm!
    }

    const _getOffset = () => {

        let mOffset = _offset.current
        if(_currentStructure.current === 'STR940183') {
            mOffset = [1.2, -0.85, 0]
        } if(_currentStructure.current === 'STR967653') {
            mOffset = [1.375, -0.7, 0]
        } else if(_currentStructure.current === 'STR719122') {
            mOffset = [0.075, -0.9, 0]
        } else if(_currentStructure.current === 'STR709859') {
            mOffset = [0.075, -0.9, 0]
        }

        return mOffset!
    }

    const applyRotationTm = (originalMatrix: THREE.Matrix4) => {
        // Assuming you have your original transformation matrix named 'originalMatrix'

        // Decompose the original matrix
        var position = new THREE.Vector3();
        var quaternion = new THREE.Quaternion();
        var scale = new THREE.Vector3();
        originalMatrix.decompose(position, quaternion, scale);

        // Adjust the rotation as needed
        // For example, rotate around Y axis by 90 degrees
        // quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.4));
        quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.06));

        // Compose a new matrix with the adjusted rotation
        var newMatrix = new THREE.Matrix4();
        newMatrix.compose(position, quaternion, scale);
        return newMatrix
    }

    return (
        <>

            <Forge

                viewType={viewType}

                onInit={onInit}

                id={`minimap-${props.id}`}

                models={modelsData}

                onModelLoaded={onModelLoaded}

                compare={props.right}

                onExtnLoaded={onExtnLoaded} />

            {!props.compare ? <div className='flex absolute right-2 w-fit h-fit mt-1' style={{ zIndex: 5 }}>

                { props.category && props.isSupportUser && <Paper className='ml-3' elevation={1}>

                    <ClickTypesPicker />

                </Paper> }

            </div>: null}

            {props.compare ? <div className={`flex absolute bottom-2 ${!props.right ? 'right-0': 'left-2' } text-[#4a4a4a] rounded bg-[#F1742E] bg-opacity-10 px-2 py-[6px] text-sm mr-3`} style={{ zIndex: 5 }}>
                {moment(new Date(props.snapshot?.date)).format('DD MMM, yyyy')}
            </div> : null}

        </>
    )
}

export default Progress2DComponent