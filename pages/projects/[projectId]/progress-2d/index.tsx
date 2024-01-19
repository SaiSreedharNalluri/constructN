'use client'

import { useEffect, useRef, useState } from 'react'

import Script from 'next/script'

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'

import { toast } from 'react-toastify'

import instance from '../../../../services/axiosInstance'

import Header from '../../../../components/divami_components/header/Header'

import SidePanelMenu from '../../../../components/divami_components/side-panel/SidePanel'

import Progress2DComponent from '../../../../components/viewer/progress-2d.component'

import { LightBoxInstance, publish, subscribe, unsubscribe } from '../../../../services/light-box-service'

import { IAsset, IAssetCategory, IAssetProgress, IAssetStage, NOT_STARTED_STAGE } from '../../../../models/IAssetCategory'

import Progress2DStages from '../../../../components/viewer/progress-2d-stage'

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

import { updateQueryParam } from '../../../../utils/router-utils'

import AssetDetails from '../../../../components/progress-2d/asset-details'

import { Button, Divider, IconButton, Typography, Tab, Tabs } from '@mui/material'

import { API } from '../../../../config/config'

import moment from 'moment'

import RealityPage from '../../../../components/viewer/reality'

import Progress2DToolbar from '../../../../components/progress-2d/toolbar/progress-2d-toolbar'

import { getCookie } from 'cookies-next'

import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

import { IUser } from '../../../../models/IUser'

import CustomLoader from '../../../../components/divami_components/custom_loader/CustomLoader'

import Progress2dAssets from '../../../../components/viewer/progress-2d-assets'

import { ForgeDataVizUtils } from '../../../../utils/forge-utils'

import authHeader from '../../../../services/auth-header'

import { useRouter as Router  } from 'next/router'

import PopupComponent from '../../../../components/popupComponent/PopupComponent'

const headers = {headers: authHeader.authHeader()}


const fetchViewerData = (projectId: string, structureId: string) => {

    try {

        return instance.get(`${API.BASE_URL}/projects/${projectId}/structures/${structureId}/viewer-data`, headers)

    } catch (error) { throw error }

}

const fetchStructureHierarchy = (projectId: string) => {

    try { return instance.get(`${API.BASE_URL}/projects/${projectId}/structures/hierarchy`, headers) } catch (error) { throw error }

}

const fetchAssetCategories = (projectId: string) => {

    try {

        return instance.get(`${API.PROGRESS_2D_URL}/asset-categories?project=${projectId}`, headers)

    } catch (error) { throw error }

}

const fetchAssets = (structureId: string, category: string, date: string = '2000-01-01T00:00:00.000Z') => {

    const userObj: any = getCookie('user');

    const user = JSON.parse(userObj);


    try {

        return instance.get(`${API.PROGRESS_2D_URL}/assets`, { headers: headers.headers, params:{ structure: structureId, category, date , status: !user?.isSupportUser ? 'Active' : null } })

    } catch (error) { throw error }

}

const createAsset = (asset: Partial<IAsset>, date: string = '2000-01-01T00:00:00.000Z') => {

    try {

        return instance.post(`${API.PROGRESS_2D_URL}/assets?date=${date}`, asset, headers)

    } catch (error) { throw error }

}

const updateAsset = (assetId: string, asset: Partial<IAsset>) => {

    try {

        return instance.put(`${API.PROGRESS_2D_URL}/assets/${assetId}`, asset, headers)

    } catch (error) { throw error }
}

const deleteAsset = (assetId: string) => {

    try {

        return instance.delete(`${API.PROGRESS_2D_URL}/assets/${assetId}`, headers)

    } catch (error) { throw error }
}

const autodeskAuth = () => {

    try { return instance.get(`${API.BASE_URL}/aps/getAPSToken`, headers) } catch (error) { throw error }

}

const fetchImagesData = (path: string) => {

    try { return instance.get(path) } catch (error) { throw error }

}

const Progress2DPage: React.FC<any> = () => {

    const nextRouter = Router();

    const _forge = useRef<Autodesk.Viewing.GuiViewer3D>()

    const _compareForge = useRef<Autodesk.Viewing.GuiViewer3D>()

    const _dataViz = useRef<ForgeDataVizUtils>()

    const _compareDataViz = useRef<ForgeDataVizUtils>()

    const [isScriptsLoaded, setIsScriptsLoaded] = useState(false)

    const [isAutodeskInitialised, setAutodeskInitialised] = useState(false)

    const router = useRouter()

    const path = usePathname()

    const searchParams = useSearchParams()

    const searchParamsRef = useRef<URLSearchParams>()

    const [isCompare, setIsCompare] = useState<boolean>(false)

    const [showReality, setShowReality] = useState<boolean>(false)

    const compare = useRef<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const [showProgress, setShowProgress] = useState<boolean>(false)

    const [snapshotBase, setSnapshotBase] = useState<any>()

    const [snapshotCompare, setSnapshotCompare] = useState<any>()

    const [selectedCompare, setSelectedCompare] = useState<any>()

    const [hierarchy, setHierarchy] = useState<any>()

    const [assetCategories, setAssetCategories] = useState<IAssetCategory[]>([])

    const [assets, setAssets] = useState<IAsset[]>([])

    const [comparisionAssets, setComparisionAssets] = useState<IAsset[]>([])

    const [selectedAsset, setSelectedAsset] = useState<string | undefined>()

    const [stages, setStages] = useState<({ assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & Partial<IAssetStage> & { visible: boolean })[]>()

    const [selectedCategory, setSelectedCategory] = useState<IAssetCategory>()

    const [selectedLayers, setSelectedLayers] = useState<string[]>()

    const [showMessage, setShowMessage] = useState(false);

    const [realityDate, setRealityDate] = useState('')

    const currentCategory = useRef<IAssetCategory>()

    const currentAsset = useRef<string>()

    const structureId = useRef<string>()

    const projectId = useRef<string>()

    const [isSupportUser, setIsSupportUser] = useState<boolean>(false)

    const [showPopup, setShowPopup] = useState<boolean>(false)

    const [selectedTab , setSelectedTab] = useState('stages') 


    const [clipValue, setClipValue] = useState(50);

    const structId = searchParams.get('structId')

    const handleMouseMove = (e: { buttons: number; clientX: number }) => {
    if (e.buttons === 1) {
      // Left mouse button is clicked
        const container = document.getElementById("container-right-full");
        const containerRect = container!.getBoundingClientRect();
        const mouseX = e.clientX - containerRect.left;

      // Ensure clipValue doesn't go out of bounds (0 to 100)
        const newClipValue = Math.min(
        100,
        Math.max(0, (mouseX / containerRect.width) * 100),
        );

        setClipValue(newClipValue);
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = () => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const _assetMap = useRef<{ 
        
        [key: string]: { assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & Partial<IAssetStage> & { visible: boolean } 
    
    }>({})

    const params = useParams();

    const refetchCategories = () =>{

        setShowProgress(true);

        const projId = params && params['projectId'] as string;
        
        fetchAssetCategories(projId!).then((response) => {
            if (response.data.result) {
                const catSelected = response.data.result.find((cate: {_id: string})=>(cate._id === (selectedCategory ? selectedCategory :response.data.result[1])._id))
                setAssetCategories(response.data.result);
                _loadAssetsForCategory(catSelected);
            }
            setShowProgress(false);
        })
    }

    const refetch = () => {

        const projId = params && params['projectId'] as string

        const snapshotId = searchParams.get('snapshotId')

        if (projId && !projectId.current) {

            projectId.current = projId

            setShowProgress(true)

            Promise.all([fetchStructureHierarchy(projId!), fetchAssetCategories(projId!)]).then(response => {

                setShowProgress(false)

                if (response[0].data.result) {

                    LightBoxInstance.setStructureHierarchy(response[0].data.result)

                    setHierarchy(response[0].data.result)

                    if (!structId) _changeStructure(response[0].data.result[0])

                }

                if (response[1].data.result) {

                    setAssetCategories(response[1].data.result)

                    if(response[1].data.result.length > 0) _onCategorySelected(response[1].data.result[1])

                }
                
            }).catch(e => setShowProgress(false))

        }

        if (structId && structureId.current !== structId) {

            structureId.current = structId

            setShowProgress(true)

            setStages([])

            setAssets([])

            _assetMap.current = {}

            fetchViewerData(projId!, structId!).then(async data => {

                setShowProgress(false)

                LightBoxInstance.save(data.data.result)

                const snapshots = LightBoxInstance.viewerData().snapshots

                const drawings = LightBoxInstance.viewerData().structure.designs['Plan Drawings']
                
                if (!drawings || drawings.length == 0 || (drawings.length > 0 && Object.keys(drawings[0] || {}).length == 0)) {
                    
                    setShowPopup(true);

                    return
                }

                if (!snapshots || snapshots.length == 0) {

                    toast.warning('Snapshots are not available for this structure!', { autoClose: 5000 })

                }

                let baseSnapshot: any

                let compareSnapshot: any

                if (!snapshotId) {

                    baseSnapshot = snapshots[0]

                    if(snapshots.length > 1) compareSnapshot = snapshots[1]

                } else {

                    for (let i = 0; i < snapshots.length; i++) {

                        if (snapshots[i]._id === snapshotId) {

                            baseSnapshot = snapshots[i]

                            if(i + 1 < snapshots.length) compareSnapshot = snapshots[i + 1]

                            break

                        }
                    }
                }

                await _extractBaseSnapshot(baseSnapshot)

                await _extractCompareSnapshot(compareSnapshot)

            }).catch(e => setShowProgress(false))

        }
    }

    useEffect(() => {
        refetch()
    }, [searchParams])



    useEffect(()=>{
        if(isCompare){
            publish('progress-2d-tool', 'Select');
            if(selectedAsset){
                toast.warn('Exit Compare Mode to Select Assets')
            }
            _closeDetails()
        }
    },[isCompare, selectedAsset])

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
        if(typeof window !== 'undefined' && window.Autodesk){
            setIsScriptsLoaded(true)
        }
    },[])

    useEffect(() => {

        const userObj: any = getCookie('user')

        let user: IUser

        if (userObj) {

            user = JSON.parse(userObj)

            if (user?._id) setIsSupportUser(user?.isSupportUser)

        }

        subscribe('add-2d-shape', _onAddShape)

        subscribe('update-2d-shape', _onUpdateShape)

        subscribe('select-2d-shape', _onSelectShape)

        subscribe('sync-viewer', _syncViewer)

        // subscribe('delete-2d-shape', _onDeleteShape)

        subscribe('remove-2d-shape', _onDeleteShape)

        subscribe('reality-click', _onRealityItemClick)


        subscribe('sync-nav', _syncNavigator)

        return () => {

            unsubscribe('add-2d-shape', _onAddShape)

            unsubscribe('update-2d-shape', _onUpdateShape)

            unsubscribe('select-2d-shape', _onSelectShape)

            unsubscribe('sync-viewer', _syncViewer)

            unsubscribe('sync-nav', _syncNavigator)

            // unsubscribe('delete-2d-shape', _onDeleteShape)

            unsubscribe('remove-2d-shape', _onDeleteShape)

            unsubscribe('reality-click', _onRealityItemClick)

        }

    }, [])

    const _extractBaseSnapshot = async (snapshot: any) => {

        LightBoxInstance.setSnapshotBase(snapshot);

        if (currentCategory.current) _loadAssetsForCategory(currentCategory.current)

        if (snapshot) {

            await _extractSnapshotPaths(snapshot)
           
            setSnapshotBase(snapshot)


        }

    }

    const _extractCompareSnapshot = async (snapshot: any) => {

        LightBoxInstance.setSnapshotCompare(snapshot);
        if (currentCategory.current) _loadCompareAssets(currentCategory.current);

        if (snapshot) {

            await _extractSnapshotPaths(snapshot)

            setSnapshotCompare(snapshot)


        } else setSnapshotCompare(undefined)

    }

    const _extractSnapshotPaths = async (snapshot: any) => {

        if (snapshot) {

            for (const Key of Object.keys(snapshot.layers)) {

                for (let i = 0; i < snapshot.layers[Key].length; i++) {

                    if (!snapshot.layers[Key][i].position) {

                        const path = snapshot.layers[Key][i].path

                        try {

                            const response = await fetchImagesData(path)

                            snapshot.layers[Key][i].position = response.data

                        } catch (e) { console.log(e) }
                    }
                }
            }
        }
    }

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

            setShowProgress(true)

            setLoading(true)

            createAsset(assetBody, LightBoxInstance.getSnapshotBase()?.date).then(res => {

                setShowProgress(false)

                setLoading(false)

                toast.success('Created asset successfully!', { autoClose: 5000 })

                const assetId = res.data.result._id

                publish('asset-created', { shapeId, assetId })

            }).catch(err => {

                setShowProgress(false)

                setLoading(false)

                toast.error('Failed to create asset!', { autoClose: 5000 })

            })

        }

    }

    const _onUpdateShape = (event: Event) => {

        const shapeDetails = (event as CustomEvent).detail

        if (currentCategory !== undefined) {

            const assetId = shapeDetails._id

            const points = shapeDetails.points

            const assetBody: Partial<IAsset> = { points }

            setShowProgress(true)

            setLoading(true)

            updateAsset(assetId, assetBody).then(res => {

                setShowProgress(false)

                setLoading(false)

                toast.success('Updated asset successfully!', { autoClose: 5000 })

            }).catch(err => {

                setShowProgress(false)

                setLoading(false)

                toast.error('Failed to update asset!', { autoClose: 5000 })

            })

        }

    }

    const _onDeleteShape = (event: Event) => {

        const shapeDetails = (event as CustomEvent).detail

        setShowProgress(true)

        setLoading(true)

        if (shapeDetails) deleteAsset(shapeDetails.assetId).then(res => {

            setShowProgress(false)

            setLoading(false)

            if(currentCategory.current) _loadAssetsForCategory(currentCategory.current);

            toast.success('Deleted asset successfully!', { autoClose: 5000 })

            // publish('delete-shape', currentAsset.current)

        }).catch(err => {

            setShowProgress(false)

            setLoading(false)

            toast.error('Failed to delete asset!', { autoClose: 5000 })

        })

        else {

            setShowProgress(false)

            if (currentCategory.current) if (currentCategory.current) _loadAssetsForCategory(currentCategory.current)

        }

    }

    const _onSelectShape = (event: Event) => {

        const shapeDetails: string | undefined = (event as CustomEvent).detail

        currentAsset.current = shapeDetails

        setSelectedAsset(shapeDetails)

    }

    const _syncViewer = (event: any) =>{

        const details = event.detail;

        const _viewer = details.compare ? _forge: _compareForge;

        _viewer?.current?.navigation?.setPosition(details.position)

        _viewer?.current?.navigation?.setTarget(details.target)

    }

    const _syncNavigator = (event: any) =>{

        const details = event.detail;

        const _tools = details.compare ? _dataViz: _compareDataViz;

        _tools?.current?.updateNavigator(new THREE.Vector3(-1000, -1000, 0), 0)

    }

    const _onCategorySelected = (category: IAssetCategory | undefined) => {

        setStages([])

        setAssets([])

        currentCategory.current = category

        setSelectedCategory(category)


        if (category !== undefined) {

            _loadAssetsForCategory(category)

            _loadCompareAssets(category)

        }

    }

    const _onCompareChange = (compare: boolean) => setIsCompare(compare)

    const _loadAssetsForCategory = (category: IAssetCategory, currentAsset?: string) => {

        setLoading(true)

        _assetMap.current = { 'NOT_STARTED': { ...NOT_STARTED_STAGE, assets: [], assetsCompare: [], visible: true } }

        const stages = category.stages.sort((a: IAssetStage, b: IAssetStage) => a.sequence - b.sequence)

        stages.forEach((stage: IAssetStage) => _assetMap.current[stage._id] = { assets: [], assetsCompare: [], ...stage, visible: true })

        if (structureId.current!) fetchAssets(structureId.current!, category!._id, LightBoxInstance.getSnapshotBase()?.date).then(res => {

            if (res.data.success) {

                setLoading(false)

                const result = res.data.result

                _setupAssetMap(result)

                if(currentAsset) setTimeout(() => {
                    
                    setSelectedAsset(currentAsset)

                    publish('select-shape', currentAsset)
                    
                }, 500)

            }

        }).catch(e => {

            console.log(e)

            setLoading(false)

        })
    }

    const _setupAssetMap = (assets: IAsset[]) => {

        assets.forEach((asset: IAsset) => {

            const mStage: any = typeof(asset.progress.stage) === 'string' ? { ...(_assetMap.current[asset.progress.stage] || {} )} : (asset.progress.stage as IAssetStage)

            delete mStage.assets

            delete mStage.visible

            asset.progress.stage = mStage

            for (let i = 0; i < asset.progressSnapshot.length; i++) {

                const mProgress = asset.progressSnapshot[i]

                _assetMap.current[mProgress.stage as string].assets.push(asset)

            }

        })

        setStages([])

        setStages(Object.values(_assetMap.current).sort((a, b) => a.sequence! - b.sequence!))

        setAssets(assets)

    }

    const _loadCompareAssets = (category: IAssetCategory) => {

        setLoading(true)

        const stages = category.stages.sort((a: IAssetStage, b: IAssetStage) => a.sequence - b.sequence)

        stages.forEach((stage: IAssetStage) => _assetMap.current[stage._id].assetsCompare = [])

        if (structureId.current!) fetchAssets(structureId.current!, category!._id, LightBoxInstance.getSnapshotCompare()?.date).then(res => {

            if (res.data.success) {

                setLoading(false)

                const result = res.data.result

                result.forEach((asset: IAsset) => {

                    const mStage: any = {...(_assetMap.current[asset.progress.stage as string] || {})}

                    delete mStage.assets

                    delete mStage.visible

                    asset.progress.stage = mStage

                    for (let i = 0; i < asset.progressSnapshot.length; i++) {

                        const mProgress = asset.progressSnapshot[i]

                        _assetMap.current[mProgress.stage as string].assetsCompare.push(asset)

                    }

                })

                setStages([])

                console.log(_assetMap.current)

                setStages(Object.values(_assetMap.current).sort((a, b) => a.sequence! - b.sequence!))

                setComparisionAssets(result)

            }

        }).catch(e => {

            console.log(e)

            setLoading(false)

        })
    }


    const _onAssetDetailsChange = (asset: IAsset) => {

        currentAsset.current = asset._id

        if (currentCategory.current !== undefined) _loadAssetsForCategory(currentCategory.current, asset._id)

    }

    const _changeStructure = (structure: any) => {

        setShowReality(false);

        compare.current = false;

        const queryParams = updateQueryParam(searchParamsRef.current!, 'structId', structure._id)

        router.replace(`${window.location.pathname}?${queryParams}`)

    }

    const _closeDetails = () => {

        setSelectedAsset(undefined);

        publish('clear-shape-selection', '');
    }

    const _toggleStageSelection = (checked: boolean) => {

        setStages([])

        Object.values(_assetMap.current).forEach(entry => entry.visible = checked)

        publish('visibility-change', { assets: assets, stageMap: _assetMap.current })

        setStages(Object.values(_assetMap.current).sort((a, b) => a.sequence! - b.sequence!))

    }

    const _onRealityItemClick = (event: Event) => {

        if (!compare.current) {

            const reality = (event as CustomEvent).detail

            setShowReality(true)

            compare.current = true

            setTimeout(() => publish('reality-click', reality), 1000)

        }
        setRealityDate((event as CustomEvent).detail.snapshotDate);

    }

    const _onSnapshotBaseChange = (date: Date, snapshot: any) => _extractBaseSnapshot(snapshot)

    const _onSnapshotCompareChange = (date: Date, snapshot: any) => _extractCompareSnapshot(snapshot)

    const _renderTitle = () => {

        if (currentCategory.current === undefined)

            return <Typography fontFamily='Open Sans' variant='subtitle1' className='select-none text-[18px]'>Choose a category</Typography>

        else {

            if (LightBoxInstance.getSnapshotBase() === undefined)

                return <Typography fontFamily='Open Sans' variant='subtitle1'>Progress of {currentCategory.current.name}</Typography>

            const date = moment(new Date(LightBoxInstance.getSnapshotBase().date)).format('DD MMM, yyyy')


            return <>

                <Typography fontFamily='Open Sans' variant='subtitle1' className='select-none text-[18px]'>Progress of {currentCategory.current.name}</Typography>

                <Typography fontFamily='Open Sans' className='select-none text-[#aaa] text-[12px]' variant='caption'>as on {date}</Typography>

            </>

        }
    }

    const _renderStageShimmer = (index: number) => {

        if (loading)

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


    if(showPopup){
        return (<>
        <div>
            <Header showBreadcrumbs breadCrumbData={[]} showFirstElement={true} />
        </div>
        {showPopup && <PopupComponent
        
            showButton={false}

            open={showPopup} 

            hideButtons 
            
            setShowPopUp={setShowPopup}

            primaryButtonLabel={""} 
            
            SecondaryButtonlabel={""}
            
            secondaryCallback={async () => { 
                await nextRouter.push('/projects/[projectId]/sections',`/projects/${params['projectId']}/sections`);
                setShowPopup(false);
            }}


            modalTitle={'Plan Drawings not available!'}
            
            modalmessage={
            <>
                <div className='text-base'>Plan drawings not available. Please change level</div>
                <div className='flex justify-center'>
                <Button
                onClick={async () => { 
                    await nextRouter.push('/projects/[projectId]/sections',`/projects/${params['projectId']}/sections`);
                    setShowPopup(false);
                }}
                className='bg-[#F1742E] h-[40px] text-base text-[#fff] mt-[20px] normal-case hover:bg-[#F1742E]'
                style={{ fontFamily: "Open Sans" }}
                >
                Ok
                </Button>
                </div>
            </>}
            
            width={'458px'} backdropWidth={true}
            
            />}
        </>)
    }

    return (

        <>
       {
                isScriptsLoaded && isAutodeskInitialised ?
                        <div className='flex flex-col'>

                            <div>

                                <Header showBreadcrumbs breadCrumbData={[]} showFirstElement={true} />

                            </div>

                            <div className='flex w-full'>

                                <div>

                                    <SidePanelMenu onChangeData={() => { }}></SidePanelMenu>

                                </div>

                                <div className='flex flex-col w-full' style={{ height: 'calc(100vh - 64px)' }}>

                                    {hierarchy && <Progress2DToolbar

                                        hierarchy={hierarchy}

                                        onSelectHierarchy={_changeStructure}

                                        snapshotBase={snapshotBase}

                                        snapshotCompare={snapshotCompare}

                                        onSnapshotBaseChange={_onSnapshotBaseChange}

                                        onSnapshotCompareChange={_onSnapshotCompareChange}

                                        onLayersSelected={(selected: string[]) => setSelectedLayers(selected)}

                                        selectedCategory={selectedCategory} assetCategories={assetCategories}

                                        onCategorySelected={_onCategorySelected}
                                        
                                        onCompareChange={_onCompareChange} />}

                                    <div className='flex w-full' style={{ height: 'calc(100vh - 144px)' }}>

                                        <div className={`w-3/4 relative flex items-center mx-2`}>

                                            <div id='left-container' className={`relative h-full w-${showReality ? '1/2' : 'full'} border border-[#e2e3e5] z-20 rounded-lg p-[2px] flex justify-center ${showReality ? '' : 'grow shrink'}`}  
                                                    style={isCompare ? {
                                                        clipPath: `polygon(${clipValue}% 0%, 100% 0%, 100% 100%, ${clipValue}% 100%)`,
                                                        } : {} }>

                                                <Progress2DComponent

                                                    id={'left-container'}

                                                    viewType={'Plan Drawings'}

                                                    category={selectedCategory}

                                                    snapshot={snapshotBase}

                                                    compare={isCompare}

                                                    reality={showReality}

                                                    assets={assets}

                                                    isSupportUser={isSupportUser}

                                                    _forge={_forge}

                                                    _dataViz={_dataViz}

                                                    selectedLayers={selectedLayers} />

                                            </div>

                                            {showReality ? (<>

                                                    <div className='flex h-full w-[3px] rounded bg-white items-center' style={{ zIndex: 20 }}>

                                                    </div>

                                                    <div id='right-container' className={'relative h-full w-1/2 z-20 border border-[#e2e3e5] rounded-lg'} >

                                                        <RealityPage snapshot={realityDate === snapshotCompare?.date ? snapshotCompare: snapshotBase} id={'left'} />

                                                        <div className={`flex absolute bottom-0 left-2' } text-[#4a4a4a] rounded bg-[#F1742E] hover:text-[#fff] hover:bg-[#f1742e] bg-opacity-10 px-2 py-[6px] text-sm mr-3`} >
                                                        {`SnapshotDate: ${moment(realityDate).format("DD MMM, yyyy")}`}
                                                        </div>

                                                        <IconButton

                                                            size='large' onClick={() => {

                                                                compare.current = false

                                                                setShowReality(false)

                                                                publish('viewerState', undefined)

                                                            }}

                                                            className='absolute top-2 right-2 bg-black bg-opacity-30'>

                                                            <CloseOutlinedIcon htmlColor='#ffffff' />

                                                        </IconButton>

                                                    </div>

                                                </>) : ''
                                            }

                                            {isCompare  ? <div id='container-right-full' className={`absolute h-full w-${showReality ? '1/2' : 'full'} border z-10 border-[#e2e3e5] rounded-lg p-[2px] flex justify-center ${showReality ? '' : 'grow shrink'}`}>

                                            <Progress2DComponent

                                                id={'container-right'}
                                                
                                                viewType={'Plan Drawings'}

                                                category={selectedCategory}

                                                snapshot={snapshotCompare}

                                                compare={isCompare}

                                                reality={showReality}

                                                assets={comparisionAssets}

                                                _forge={_compareForge}

                                                _dataViz={_compareDataViz}

                                                right

                                                isSupportUser={isSupportUser}

                                                selectedLayers={selectedLayers} />

                                            </div>:null}

                                            {isCompare ? <div
                                                className={`absolute h-full w-[4px] z-20 bg-[#cccccc]`}
                                                
                                                style={{ left: showReality? `calc(${clipValue/2}%)`: `calc(${clipValue}%)`}}
                                                >
                                                    <CompareArrowsIcon 
                                                        className='relative top-40 right-[26px] p-1 text-white rounded-[50%] w-[60px] h-[60px] bg-[#FF843F] cursor-ew-resize' 
                                                        onMouseDown={handleMouseDown} 
                                                    />
                                            </div>: null}

                                        </div>

                                        <div className={'flex flex-col w-1/4 mr-4 py-4'}

                                            style={{ height: 'calc(100vh - 144px)', border: '1px solid #e2e3e5', borderRadius: '6px' }} >

                                            <div className='flex px-4'>

                                                <div className='text-[16px] text-[#4a4a4a] w-fit flex-grow'>

                                                    {selectedAsset ?

                                                        <Typography

                                                            fontFamily='Open Sans'

                                                            variant='subtitle1'

                                                            className='select-none text-[18px]'>

                                                            Asset Details

                                                        </Typography> : _renderTitle()}

                                                </div>

                                                {selectedAsset && <IconButton size='small' onClick={() => _closeDetails()}

                                                    className='mt-[-6px] mr-[-6px]'>

                                                    <CloseOutlinedIcon fontSize='small' />

                                                </IconButton>}

                                            </div>

                                            <Divider className='mt-2' orientation='horizontal' variant='fullWidth' flexItem />
                                            {!selectedAsset && <Tabs

                                            centered value={selectedTab} className='text-black bg-[#fbece2]' textColor='inherit'

                                            TabIndicatorProps={{ style: { backgroundColor: '#f1742e' } }} >

                                                <Tab

                                                value='stages' label={<Typography fontFamily='Open Sans' fontSize={14}

                                                variant='caption'>Stages</Typography>} onClick={() => setSelectedTab('stages')} />

                                                <Tab

                                                value='assets' label={<Typography fontFamily='Open Sans' fontSize={14}

                                                variant='caption'>Assets</Typography>} onClick={() => setSelectedTab('assets')} />
                                                </Tabs>}

                                            {!selectedAsset && selectedTab === 'stages' && <div className='px-4 overflow-auto' style={{ height: 'calc(100vh - 220px)' }}>

                                                {!selectedAsset && selectedCategory && <div className='flex pt-4 mb-2 justify-between sticky top-0 bg-white z-10'>

                                                <Button

                                                    size='small' onClick={() => _toggleStageSelection(true)} variant='text'

                                                    className='select-none text-[11px] text-[#F1742E] cursor-pointer'>

                                                    SELECT ALL

                                                </Button>

                                                <Button

                                                    size='small' onClick={() => _toggleStageSelection(false)} variant='text'

                                                    className='select-none text-[11px] text-[#F1742E] cursor-pointer'>

                                                    CLEAR ALL

                                                </Button>

                                            </div>}

                                                {loading ? [1, 2, 3, 4, 5].map(val => _renderStageShimmer(val))
                                                : <Progress2DStages stages={stages} compare={isCompare} assets={assets} structId={structId || ''}
                                                
                                                snapShotDate={snapshotBase?.date}
                                                
                                                selectedCategory={selectedCategory}
                                                
                                                refetchCategories={refetchCategories}
                                                
                                                setLoading = {setLoading}
                                                
                                                loading={loading}
                                                
                                                refetch={()=>{ _loadAssetsForCategory(selectedCategory as IAssetCategory, selectedAsset) }}
                                                
                                                onToggleVisibility={(stage: Partial<IAssetStage> & { assets: Partial<IAsset>[] } & { visible: boolean }) => {
                                                    
                                                    _assetMap.current[stage._id!].visible = stage.visible
                                                    
                                                    setStages([])
                                                    
                                                    publish('visibility-change', { assets: assets, stageMap: _assetMap.current })
                                                    
                                                    setStages(Object.values(_assetMap.current).sort((a, b) => a.sequence! - b.sequence!))
                                                    
                                                }} />}
                                                
                                            </div>}
                                            
                                            {selectedTab === 'assets' && !selectedAsset && <div className='overflow-auto relative' style={{ height: 'calc(100vh - 220px)' }}>
                                                    <Progress2dAssets assets={assets} />
                                                </div>}
                                        
                                            {selectedAsset && !isCompare && <AssetDetails

                                                assetId={selectedAsset}

                                                snapshotBase={selectedCompare? snapshotCompare: snapshotBase}

                                                supportUser={isSupportUser}

                                                onChange={_onAssetDetailsChange}/>}

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {(showProgress || loading) && <CustomLoader/>}

                        </div>: ''
}

                    </>

    )
}

export default Progress2DPage