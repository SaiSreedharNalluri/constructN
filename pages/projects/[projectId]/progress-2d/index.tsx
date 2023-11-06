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

import { updateQueryParam } from '../../../../utils/router-utils'

import AssetDetails from './asset-details'

import { Button, Divider, IconButton, Paper, Typography } from '@mui/material'

import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined'

import StructureHierarchy from '../../../../components/viewer/structure-hierarchy'


const fetchViewerData = (projectId: string, structureId: string) => {

    try {

        return instance.get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures/${structureId}/viewer-data`)

    } catch (error) { throw error }

}

const fetchStructureHierarchy = (projectId: string) => {

    try { return instance.get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures/hierarchy`) } catch (error) { throw error }

}

const fetchAssetCategories = (projectId: string) => {

    try {

        return instance.get(`http://localhost:3001/api/asset-categories?project=${projectId}`)

    } catch (error) { throw error }

}

const fetchAssets = (structureId: string, category: string) => {

    try {

        return instance.get(`http://localhost:3001/api/assets?structure=${structureId}&category=${category}`)

    } catch (error) { throw error }

}

const createAsset = (asset: Partial<IAsset>) => {

    try {

        return instance.post(`http://localhost:3001/api/assets`, asset)

    } catch (error) { throw error }

}

const updateAsset = (assetId: string, asset: Partial<IAsset>) => {

    try {

        return instance.put(`http://localhost:3001/api/assets/${assetId}`, asset)

    } catch (error) { throw error }

}

const autodeskAuth = () => {

    try { return instance.get(`${process.env.NEXT_PUBLIC_HOST}/aps/getAPSToken`) } catch (error) { throw error }

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

    const [assetCategories, setAssetCategories] = useState<IAssetCategory[]>([])

    const [assets, setAssets] = useState<IAsset[]>([])

    const [selectedAsset, setSelectedAsset] = useState<string | undefined>()

    const [stages, setStages] = useState<({ assets: string[] } & Partial<IAssetStage>)[]>()

    const [currentCategory, setCurrentCategory] = useState<IAssetCategory>()

    const structureId = useRef<string>()

    const _assetMap = useRef<{ [key: string]: { assets: string[] } & Partial<IAssetStage> }>({})

    useEffect(() => {

        const structId = searchParams.get('structId')

        const projId = searchParams.get('projectId')

        const snapshotId = searchParams.get('snapshotId')

        fetchStructureHierarchy(projId!).then(data => {

            if (data.data.result) {

                LightBoxInstance.setStructureHierarchy(data.data.result)

                setHierarchy(data.data.result)

            }

        }).catch(err => { })

        if (structId) {

            structureId.current = structId

            fetchViewerData(projId!, structId!).then(async data => {

                LightBoxInstance.save(data.data.result)

                const snapshots = LightBoxInstance.viewerData().snapshots

                if (!snapshots || snapshots.length == 0) {

                    toast.warning('Snapshots are not available for this structure!')

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

                console.log(data.data.result)

                setAssetCategories(data.data.result)

                if (currentCategory) _loadAssetsForCategory(currentCategory)

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

        return () => {

            unsubscribe('add-2d-shape', _onAddShape)

            unsubscribe('update-2d-shape', _onUpdateShape)

            subscribe('select-2d-shape', _onSelectShape)

        }

    }, [])

    const _onAddShape = (event: Event) => {

        const shapeDetails = (event as CustomEvent).detail

        if (currentCategory !== undefined) {

            const dbId = shapeDetails.id

            const assetBody: Partial<IAsset> = {

                name: `${currentCategory.name}`,

                structure: structureId.current!,

                category: currentCategory._id,

                shape: shapeDetails.type,

                points: shapeDetails.points

            }

            createAsset(assetBody).then(res => {

                console.log(res)

            }).catch(err => console.log(err))

        }

    }

    const _onUpdateShape = (event: Event) => {

        const shapeDetails = (event as CustomEvent).detail

        if (currentCategory !== undefined) {

            const assetId = shapeDetails._id

            const points = shapeDetails.points

            const assetBody: Partial<IAsset> = { points }

            console.log(assetId, assetBody)

            updateAsset(assetId, assetBody).then(res => {

                console.log(res)

            }).catch(err => console.log(err))

        }

    }

    const _onSelectShape = (event: Event) => {

        const shapeDetails: string | undefined = (event as CustomEvent).detail

        console.log(shapeDetails)

        setSelectedAsset(shapeDetails)

    }

    const _onCategorySelected = (category: IAssetCategory | undefined) => {

        setStages([])

        setAssets([])

        setCurrentCategory(category)

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

        if (currentCategory !== undefined) _loadAssetsForCategory(currentCategory)

    }

    const _changeStructure = (structure: any) => {

        setShowHierarchy(false)

        const queryParams = updateQueryParam(searchParamsRef.current!, 'structId', structure._id)

        router.replace(`${window.location.pathname}?${queryParams}`)

    }

    const _closeDetails = () => {

        setSelectedAsset(undefined)

        publish('clear-shape-selection', '')
    }

    const _renderStageShimmer = () => {

        if (assets.length === 0)

            return (

                <div className='animate-pulse px-4 py-4 mt-6 rounded-md' style={{ border: '1px solid #e2e3e5' }}>

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

    const _renderAssetCountMessage = () => {

        let message = ''

        if (assets && assets.length > 0)

            message = `Showing ${assets.length} assets of ${currentCategory!.name}`

        else

            message = `No assets available for ${currentCategory!.name}`

        return (<Typography variant='caption' className='ml-2 text-[#9a9a9a]' > {message} </Typography>)

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

                                        <div className='text-[16px] text-[#4a4a4a] w-fit flex-grow'> {selectedAsset ? 'Asset Details' : 'Stage wise progress'} </div>

                                        {selectedAsset && <IconButton size='small' onClick={() => _closeDetails()}

                                            className='mt-[-6px] mr-[-6px]'>

                                            <CloseOutlinedIcon fontSize='small' />

                                        </IconButton>}

                                    </div>

                                    <Divider className='my-4' orientation='horizontal' variant='fullWidth' flexItem />

                                    {!selectedAsset && <div className='px-4'>

                                        {hierarchy && <AssetCategoryPicker selected={currentCategory} categories={assetCategories} onSelect={_onCategorySelected} />}

                                        <div className='mt-4' ></div>

                                        {currentCategory && _renderAssetCountMessage()}

                                        <div className='overflow-auto' style={{ height: 'calc(100vh - 254px)' }}>

                                            {loading && [1, 2, 3, 4, 5].map(val => _renderStageShimmer())}

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