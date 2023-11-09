import { useEffect, useRef, useState } from 'react'

import Script from 'next/script'

import { useRouter, useSearchParams } from 'next/navigation'

import { toast } from 'react-toastify'

import instance from '../../../../services/axiosInstance'

import Header from '../../../../components/divami_components/header/Header'

import SidePanelMenu from '../../../../components/divami_components/side-panel/SidePanel'

import Progress2DComponent from '../../../../components/viewer/progress-2d.component'

import { LightBoxInstance, publish, subscribe, unsubscribe } from '../../../../services/light-box-service'

import AssetCategoryPicker from '../../../../components/core/asset-category-picker'

import { IAsset, IAssetCategory, IAssetStage, NOT_STARTED_STAGE } from '../../../../models/IAssetCategory'

import Progress2DStage from '../../../../components/viewer/progress-2d-stage'

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined'

import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined'

import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined'

import { updateQueryParam } from '../../../../utils/router-utils'

import AssetDetails from './asset-details'

import { Button, Divider, IconButton, Paper, Typography } from '@mui/material'

import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined'

import StructureHierarchy from '../../../../components/viewer/structure-hierarchy'

import { API } from '../../../../config/config'

import moment from 'moment'


const fetchViewerData = (projectId: string, structureId: string) => {

    try {

        return instance.get(`${API.BASE_URL}/projects/${projectId}/structures/${structureId}/viewer-data`)

    } catch (error) { throw error }

}

const fetchStructureHierarchy = (projectId: string) => {

    try { return instance.get(`${API.BASE_URL}/projects/${projectId}/structures/hierarchy`) } catch (error) { throw error }

}

const fetchAssetCategories = (projectId: string) => {

    try {

        return instance.get(`${API.PROGRESS_2D_URL}/asset-categories?project=${projectId}`)

    } catch (error) { throw error }

}

const fetchAssets = (structureId: string, category: string) => {

    try {

        return instance.get(`${API.PROGRESS_2D_URL}/assets?structure=${structureId}&category=${category}`)

    } catch (error) { throw error }

}

const createAsset = (asset: Partial<IAsset>) => {

    try {

        return instance.post(`${API.PROGRESS_2D_URL}/assets`, asset)

    } catch (error) { throw error }

}

const updateAsset = (assetId: string, asset: Partial<IAsset>) => {

    try {

        return instance.put(`${API.PROGRESS_2D_URL}/assets/${assetId}`, asset)

    } catch (error) { throw error }
}

const deleteAsset = (assetId: string) => {

    try {

        return instance.delete(`${API.PROGRESS_2D_URL}/assets/${assetId}`)

    } catch (error) { throw error }
}

const autodeskAuth = () => {

    try { return instance.get(`${API.BASE_URL}/aps/getAPSToken`) } catch (error) { throw error }

}

const fetchImagesData = (path: string) => {

    try { return instance.get(path) } catch (error) { throw error }

}

const Progress2DPage: React.FC<any> = () => {

    const [isScriptsLoaded, setIsScriptsLoaded] = useState(false)

    const [isAutodeskInitialised, setAutodeskInitialised] = useState(false)

    const router = useRouter()

    const searchParams = useSearchParams()

    const searchParamsRef = useRef<URLSearchParams>()

    const [loading, setLoading] = useState<boolean>(false)

    const [snapshotBase, setSnapshotBase] = useState()

    const [hierarchy, setHierarchy] = useState<any>()

    const [showHierarchy, setShowHierarchy] = useState<boolean>(false)

    const [showCategoryFilters, setShowCategoryFilters] = useState<boolean>(true)

    const [assetCategories, setAssetCategories] = useState<IAssetCategory[]>([])

    const [assets, setAssets] = useState<IAsset[]>([])

    const [selectedAsset, setSelectedAsset] = useState<string | undefined>()

    const [stages, setStages] = useState<({ assets: string[] } & Partial<IAssetStage>)[]>()

    const [selectedCategory, setSelectedCategory] = useState<IAssetCategory>()

    const currentCategory = useRef<IAssetCategory>()

    const currentAsset = useRef<string>()

    const structureId = useRef<string>()

    const projectId = useRef<string>()

    const _assetMap = useRef<{ [key: string]: { assets: string[] } & Partial<IAssetStage> }>({})

    useEffect(() => {

        const structId = searchParams.get('structId')

        const projId = searchParams.get('projectId')

        const snapshotId = searchParams.get('snapshotId')

        if (projId && !projectId.current) {

            projectId.current = projId

            fetchStructureHierarchy(projId!).then(data => {

                if (data.data.result) {

                    LightBoxInstance.setStructureHierarchy(data.data.result)

                    setHierarchy(data.data.result)

                }

            }).catch(err => { })

        }

        if (structId && structureId.current !== structId) {

            structureId.current = structId

            fetchViewerData(projId!, structId!).then(async data => {

                LightBoxInstance.save(data.data.result)

                const snapshots = LightBoxInstance.viewerData().snapshots

                if (!snapshots || snapshots.length == 0) {

                    toast.warning('Snapshots are not available for this structure!', { autoClose: 5000 })

                }

                let baseSnapshot: any

                if (!snapshotId) {

                    baseSnapshot = snapshots[0]

                } else {

                    for (let i = 0; i < snapshots.length; i++) {

                        if (snapshots[i]._id === snapshotId) {

                            baseSnapshot = snapshots[i]

                            break

                        }
                    }
                }

                if (baseSnapshot) {

                    for (const Key of Object.keys(baseSnapshot.layers)) {

                        for (let i = 0; i < baseSnapshot.layers[Key].length; i++) {

                            if (!baseSnapshot.layers[Key][i].position) {

                                const path = baseSnapshot.layers[Key][i].path

                                try {

                                    const response = await fetchImagesData(path)

                                    baseSnapshot.layers[Key][i].position = response.data

                                } catch (e) { }
                            }
                        }
                    }

                    LightBoxInstance.setSnapshotBase(baseSnapshot)

                    setSnapshotBase(baseSnapshot)

                }


            }).catch(e => console.log(e))

            fetchAssetCategories(projId!).then(async data => {

                setAssetCategories(data.data.result)

                if (currentCategory.current) _loadAssetsForCategory(currentCategory.current)

            }).catch(e => console.log(e))

        }

    }, [searchParams])

    useEffect(() => {

        if (isScriptsLoaded) {

            autodeskAuth().then(res => {

                const data = res.data.result

                const initializeOptions: Autodesk.Viewing.InitializerOptions = {

                    env: 'AutodeskProduction2',

                    api: 'streamingV2',

                    getAccessToken: async function (onSuccess: (access_token: string, expity: number) => void) {

                        onSuccess(data.access_token, data.expires_in);
                    },
                }

                Autodesk.Viewing.Initializer(initializeOptions, () => {

                    setAutodeskInitialised(true)

                })
            })
        }

    }, [isScriptsLoaded])

    useEffect(() => {

        subscribe('add-2d-shape', _onAddShape)

        subscribe('update-2d-shape', _onUpdateShape)

        subscribe('select-2d-shape', _onSelectShape)

        subscribe('delete-2d-shape', _onDeleteShape)

        return () => {

            unsubscribe('add-2d-shape', _onAddShape)

            unsubscribe('update-2d-shape', _onUpdateShape)

            unsubscribe('select-2d-shape', _onSelectShape)

            unsubscribe('delete-2d-shape', _onDeleteShape)

        }

    }, [])

    const _onAddShape = (event: Event) => {

        const shapeDetails = (event as CustomEvent).detail

        if (currentCategory.current !== undefined) {

            const shapeId = shapeDetails.id

            const assetBody: Partial<IAsset> = {

                name: `${currentCategory.current.name}`,

                structure: structureId.current!,

                project: projectId.current!,

                category: currentCategory.current._id,

                shape: shapeDetails.type,

                points: shapeDetails.points

            }

            createAsset(assetBody).then(res => {

                toast.success('Created asset successfully!', { autoClose: 5000 })

                const assetId = res.data.result._id

                publish('asset-created', { shapeId, assetId })

            }).catch(err => toast.error('Failed to create asset!', { autoClose: 5000 }))

        }

    }

    const _onUpdateShape = (event: Event) => {

        const shapeDetails = (event as CustomEvent).detail

        if (currentCategory !== undefined) {

            const assetId = shapeDetails._id

            const points = shapeDetails.points

            const assetBody: Partial<IAsset> = { points }

            updateAsset(assetId, assetBody).then(res => {

                toast.success('Updated asset successfully!', { autoClose: 5000 })

            }).catch(err => toast.error('Failed to update asset!', { autoClose: 5000 }))

        }

    }

    const _onDeleteShape = () => {

        if (currentAsset.current !== undefined) deleteAsset(currentAsset.current).then(res => {

            toast.success('Deleted asset successfully!', { autoClose: 5000 })

            publish('delete-shape', currentAsset.current)

        }).catch(err => toast.error('Failed to delete asset!', { autoClose: 5000 }))

        else toast.warning('Please select an asset!', { autoClose: 5000 })

    }

    const _onSelectShape = (event: Event) => {

        const shapeDetails: string | undefined = (event as CustomEvent).detail

        currentAsset.current = shapeDetails

        setShowCategoryFilters(false)

        setSelectedAsset(shapeDetails)

    }

    const _onCategorySelected = (category: IAssetCategory | undefined) => {

        setStages([])

        setAssets([])

        currentCategory.current = category

        setSelectedCategory(category)

        if (category !== undefined) {

            _loadAssetsForCategory(category)

        }

    }

    const _loadAssetsForCategory = (category: IAssetCategory) => {

        setLoading(true)

        _assetMap.current = { 'NOT_STARTED': { ...NOT_STARTED_STAGE, assets: [] } }

        const stages = category.stages.sort((a: IAssetStage, b: IAssetStage) => a.sequence - b.sequence)

        stages.forEach((stage: IAssetStage) => _assetMap.current[stage._id] = { assets: [], ...stage })

        if (structureId.current!) fetchAssets(structureId.current!, category!._id).then(res => {

            if (res.data.success) {

                setLoading(false)

                const result = res.data.result

                result.forEach((asset: IAsset) => {

                    const stages = (asset.category as IAssetCategory).stages.filter(stage => stage._id === asset.progress.stage)

                    asset.progress.stage = stages.length == 0 ? NOT_STARTED_STAGE : stages[0]

                    if (_assetMap.current[asset.progress.stage._id]) _assetMap.current[asset.progress.stage._id].assets.push(asset._id)

                    else _assetMap.current[asset.progress.stage._id] = { assets: [asset._id] }

                })

                setStages(Object.values(_assetMap.current).sort((a, b) => a.sequence! - b.sequence!))

                setAssets(result)

            }

        }).catch(e => setLoading(false))
    }

    const _onAssetDetailsChange = (asset: IAsset) => {

        if (currentCategory.current !== undefined) _loadAssetsForCategory(currentCategory.current)

    }

    const _changeStructure = (structure: any) => {

        setShowHierarchy(false)

        const queryParams = updateQueryParam(searchParamsRef.current!, 'structId', structure._id)

        router.replace(`${window.location.pathname}?${queryParams}`)

    }

    const _closeDetails = () => {

        setSelectedAsset(undefined)

        setShowCategoryFilters(true)

        publish('clear-shape-selection', '')
    }

    const _renderTitle = () => {

        if (currentCategory.current === undefined) return <Typography variant='h6'>Choose a category</Typography>

        else {

            if (LightBoxInstance.getSnapshotBase() === undefined)

                return <Typography variant='h6'>Progress of {currentCategory.current.name}</Typography>

            const date = moment(new Date(LightBoxInstance.getSnapshotBase().date)).format('DD MMM, yyyy')

            const assetsMessage = assets && assets.length > 0 ? `${assets.length} asset(s)` : 'No assets'

            return <>

                <Typography variant='h6'>Progress of {currentCategory.current.name}</Typography>

                <Typography className='text-[#aaa] ml-1' variant='caption'>as on {date} [ {assetsMessage} ]</Typography>

            </>

        }
    }

    const _renderStageShimmer = (index: number) => {

        if (assets.length === 0)

            return (

                <div className='animate-pulse px-4 py-4 mt-6 rounded-md' key={index} style={{ border: '1px solid #e2e3e5' }}>

                    <div className='flex-1 flex mt-2'>

                        <div className='rounded bg-slate-200 h-[1.25rem] w-[1.25rem]'></div>

                        <div className='flex-1 ml-2 mt-[2px] h-[0.9rem] bg-slate-200 rounded'></div>

                    </div>

                    <div className='h-[0.5rem] mt-6 bg-slate-200 rounded'></div>

                    <div className='flex mt-2 justify-between'>

                        <div className='rounded bg-slate-200 h-[1rem] w-[2.5rem]'></div>

                        <div className='rounded bg-slate-200 h-[1rem] w-[3.5rem]'></div>

                    </div>

                </div>
            )

        else return <></>
    }

    return (

        <>

            <Script

                src='https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js'

                onReady={() => { setIsScriptsLoaded(true) }} />

            {
                isScriptsLoaded && isAutodeskInitialised ?

                    <>

                        <div className='flex flex-col'>

                            <div>

                                <Header showBreadcrumbs breadCrumbData={[]} showFirstElement={true} />

                            </div>

                            <div id='compare-container' className='flex w-full'>

                                <div>

                                    <SidePanelMenu onChangeData={() => { }}></SidePanelMenu>

                                </div>

                                <div id='left-container' className={`w-3/4 relative flex flex-col items-center py-4 px-2`} style={{ height: 'calc(100vh - 64px)' }}>

                                    {snapshotBase && <Progress2DComponent

                                        id={'left-container'}

                                        viewType={'Plan Drawings'}

                                        snapshot={snapshotBase}

                                        assets={assets} />

                                    }

                                    <div

                                        className='fixed cursor-pointer bg-white rotate-[270deg] z-10 bottom-[2.5rem] left-[1.5rem] text-[#4a4a4a] py-1 pr-3 pl-1'

                                        onClick={() => setShowHierarchy(!showHierarchy)}

                                        style={{ border: '1px solid #e2e3e5', borderRadius: '4px' }}>

                                        <KeyboardDoubleArrowRightOutlinedIcon fontSize={'small'} className='mr-1' />

                                        <Typography variant='caption' fontSize={14} className='select-none'>Hierarchy</Typography>

                                    </div>

                                </div>

                                <div id='right-container' className={'flex flex-col w-1/4 my-4 mr-4 py-4'}

                                    style={{ height: 'calc(100vh - 88px)', border: '1px solid #e2e3e5', borderRadius: '6px' }} >

                                    <div className='flex px-4'>

                                        <div className='text-[16px] text-[#4a4a4a] w-fit flex-grow'>

                                            {selectedAsset ? 'Asset Details' : _renderTitle()}

                                        </div>

                                        {!selectedAsset && <IconButton onClick={() => setShowCategoryFilters(!showCategoryFilters)}

                                            className='mt-[-6px] mr-[-6px]'>

                                            {showCategoryFilters ?

                                                <KeyboardDoubleArrowUpOutlinedIcon fontSize='small' /> :

                                                <KeyboardDoubleArrowDownOutlinedIcon fontSize='small' />

                                            }

                                        </IconButton>}

                                        {selectedAsset && <IconButton size='small' onClick={() => _closeDetails()}

                                            className='mt-[-6px] mr-[-6px]'>

                                            <CloseOutlinedIcon fontSize='small' />

                                        </IconButton>}

                                    </div>

                                    {hierarchy && showCategoryFilters && <div className='mt-6 px-4'>

                                        <AssetCategoryPicker selected={selectedCategory} categories={assetCategories} onSelect={_onCategorySelected} />

                                    </div>}

                                    {!selectedAsset && <div className='flex mt-6 px-6 justify-between'>

                                        <Typography className='text-[11px] cursor-pointer' color='#F1742E'>SELECT ALL</Typography>

                                        <Typography className='text-[11px] cursor-pointer' color='#F1742E'>CLEAR ALL</Typography>

                                    </div>}

                                    <Divider className='mt-2' orientation='horizontal' variant='fullWidth' flexItem />

                                    {!selectedAsset && <div className='px-4'>

                                        <div className='overflow-auto' style={{ height: 'calc(100vh - 220px)' }}>

                                            {loading && [1, 2, 3, 4, 5].map(val => _renderStageShimmer(val))}

                                            {stages?.map(stage => <Progress2DStage key={stage._id} assetCount={assets.length} stage={stage} />)}

                                        </div>

                                    </div>}

                                    {selectedAsset && <AssetDetails assetId={selectedAsset} onChange={_onAssetDetailsChange} />}

                                </div>

                                {hierarchy && showHierarchy &&

                                    <Paper elevation={4} className='absolute h-4/5 bottom-0 bg-white overflow-auto' style={{ zIndex: 11, left: '62px' }} >

                                        <StructureHierarchy

                                            structure={structureId.current}

                                            hierarchy={hierarchy}

                                            onClose={() => setShowHierarchy(false)}

                                            onSelect={_changeStructure} />

                                    </Paper>

                                }

                            </div>

                        </div>

                    </> : ''
            }
        </>

    )
}

export default Progress2DPage