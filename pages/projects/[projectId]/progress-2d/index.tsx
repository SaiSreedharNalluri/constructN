import { useEffect, useRef, useState } from 'react'

import Script from 'next/script'

import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation'

import { toast } from 'react-toastify'

import instance from '../../../../services/axiosInstance'

import Header from '../../../../components/divami_components/header/Header'

import SidePanelMenu from '../../../../components/divami_components/side-panel/SidePanel'

import Progress2DComponent from '../../../../components/viewer/progress-2d.component'

import { LightBoxInstance, publish, subscribe, unsubscribe } from '../../../../services/light-box-service'

import AssetCategoryPicker from '../../../../components/core/asset-category-picker'

import ClickTypesPicker from '../../../../components/viewer/segment-class-filters'

import { IAsset, IAssetCategory } from '../../../../models/IAssetCategory'


const fetchViewerData = (projectId: string, structureId: string) => {

    try {

        return instance.get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures/${structureId}/viewer-data`)

    } catch (error) { throw error }

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

    const searchParamsRef = useRef<ReadonlyURLSearchParams>()

    const [snapshotBase, setSnapshotBase] = useState()

    const [assetCategories, setAssetCategories] = useState<IAssetCategory[]>([])

    const [assets, setAssets] = useState<IAsset[]>([])

    const currentCategory = useRef<IAssetCategory>()

    const structureId = useRef<string>()

    useEffect(() => {

        const structId = searchParams.get('structId')

        const projId = searchParams.get('projectId')

        const snapshotId = searchParams.get('snapshotId')

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

        return () => {

            unsubscribe('add-2d-shape', _onAddShape)

        }

    }, [])

    const _onAddShape = (event: Event) => {

        const shapeDetails = (event as CustomEvent).detail

        if (currentCategory.current !== undefined) {

            const dbId = shapeDetails.id

            const assetBody: Partial<IAsset> = {

                name: `${currentCategory.current.name}`,

                structure: structureId.current!,

                category: currentCategory.current._id,

                shape: shapeDetails.type,

                points: shapeDetails.points

            }

            console.log(dbId, assetBody)

            createAsset(assetBody).then(res => {

                console.log(res)

            }).catch(err => console.log(err))

        }

    }

    const _onCategorySelected = (category: IAssetCategory | null) => {

        if (category !== null) {

            currentCategory.current = category

            if (structureId.current!) fetchAssets(structureId.current!, currentCategory.current._id).then(res => {

                if (res.data.success) setAssets(res.data.result)

            }).catch(e => console.log(e))

        }

        console.log(currentCategory)

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

                                <div id='left-container' className={`w-2/3 flex my-4 mx-2`} style={{ height: 'calc(100vh - 64px)' }}>

                                    {snapshotBase && <Progress2DComponent id={'left-container'} viewType={'Plan Drawings'} snapshot={snapshotBase} assets={assets} />}

                                </div>

                                <div id='right-container' className={'w-1/3 my-4 mr-4 p-4'} style={{ height: 'calc(100vh - 88px)', border: '1px solid #e2e3e5', borderRadius: '6px' }}>

                                    <AssetCategoryPicker categories={assetCategories} onSelect={_onCategorySelected} />

                                    <div className='w-fit mt-4'>

                                        <ClickTypesPicker />

                                    </div>
                                </div>

                            </div>
                        </div>

                    </> : ''
            }
        </>

    )
}

export default Progress2DPage