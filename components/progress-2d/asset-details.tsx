import { useState, useEffect } from 'react'

import { IAsset, IAssetCategory, IAssetProgress } from '../../models/IAssetCategory'

import instance from '../../services/axiosInstance'

import ElementDetails from './element-details'

import { Tab, Tabs, Typography } from '@mui/material'

import AssetTimeline from './asset-timeline'

import { toast } from 'react-toastify'

import { API } from '../../config/config'
import Metrics from './metrics-details'


const fetchAssetDetails = (assetId: string, date: string) => {

    try {

        return instance.get(`${API.PROGRESS_2D_URL}/assets/${assetId}?date=${date}`)

    } catch (error) { throw error }

}

const updateAssetDetails = (assetId: string, data: Partial<IAsset>) => {

    try {

        return instance.put(`${API.PROGRESS_2D_URL}/assets/${assetId}`, data)

    } catch (error) { throw error }

}

const changeAssetStage = (assetId: string, stage: string, date: Date) => {

    try {

        return instance.put(`${API.PROGRESS_2D_URL}/assets/${assetId}/change-stage`, { stage, date })

    } catch (error) { throw error }

}

const removeAssetStage = (assetId: string, stage: string) => {

    try {

        return instance.put(`${API.PROGRESS_2D_URL}/assets/${assetId}/remove-stage`, { stage })

    } catch (error) { throw error }

}

const AssetDetails: React.FC<{ assetId: string, snapshotBase: any, onChange?: (asset: IAsset) => void, supportUser: boolean }> =

    ({ assetId, snapshotBase, onChange, supportUser }) => {

        const [asset, setAsset] = useState<IAsset>()

        const [selectedTab, setSelectedTab] = useState<string>('asset-details')

        const [loading, setLoading] = useState<boolean>(false)

        const [values, setValues] = useState({ name : '', description: '', stage: '' })

        const refetchAssets = () => {

            setLoading(true)

            fetchAssetDetails(assetId, snapshotBase.date).then(res => {

                setLoading(false)

                setAsset(res.data.result)

            }).catch(err => {

                setLoading(false)

                console.log(err)

            })

        }

        useEffect(() => {
            refetchAssets()
        }, [assetId])

        useEffect(()=>{
            setValues({ name: actualName , description: actualDecription, stage: actualStage as string })
        },[asset])

        const { category ='' , description: actualDecription = '', progress = {} , name: actualName = '', metrics = {} } = asset || {}
        
        const { stages} = category as IAssetCategory || {}
        
        const { stage: actualStage } = progress  as IAssetProgress || {}

        const { name , description, stage } = values || {}

        const onSave = () => {

                if (stage !== actualStage ) {

                setLoading(true)

                changeAssetStage(assetId, values.stage, snapshotBase.date).then(res => {

                    onChange && onChange(res.data.result)

                    toast.success('Updated asset stage successfully!', { autoClose: 5000 })

                    // setLoading(false)

                }).catch(err => {

                    setLoading(false)

                    toast.error('Failed to update asset stage!', { autoClose: 5000 })

                })

            }  
            if(name !== actualName || description !== actualDecription) {

                        setLoading(true)
        
                        updateAssetDetails(assetId, { name, description}).then(res => {
        
                            if(onChange) onChange(res.data.result)
        
                            toast.success('Updated asset details successfully!', { autoClose: 5000 })
        
                            // setLoading(false)
        
                        }).catch(err => {
        
                            console.log(err)
        
                            setLoading(false)
        
                            toast.error('Failed to update asset details!', { autoClose: 5000 })
        
                        })
        
                    }

        }

        const _onChange = (key: string, value: string) => setValues({ ...values, [key]: value})

        const _onDeleteStage = (stage: string) => {

            setLoading(true)

            removeAssetStage(assetId, stage).then(res => {

                onChange && onChange(res.data.result)

                toast.success('Removed asset stage successfully!', { autoClose: 5000 })

                // setLoading(false)

            }).catch(err => {

                setLoading(false)

                toast.error('Failed to remove asset stage!', { autoClose: 5000 })

            })
        }

        const _renderAssetDetailsShimmer = () => {

            return (

                <div className='animate-pulse rounded-md'>

                    <div className='h-[3rem] bg-slate-200 rounded'></div>

                    <div className='h-[1rem] w-[3rem] mt-6 mx-4 bg-slate-200 rounded'></div>

                    <div className='h-[2.25rem] mt-2 mx-4 bg-slate-200 rounded'></div>

                    <div className='h-[1rem] w-[3rem] mt-6 mx-4 bg-slate-200 rounded'></div>

                    <div className='h-[5rem] mt-2 mx-4 bg-slate-200 rounded'></div>

                    <div className='h-[1rem] w-[3rem] mt-6 mx-4 bg-slate-200 rounded'></div>

                    <div className='h-[2.25rem] mt-2 mx-4 bg-slate-200 rounded'></div>

                    <div className='h-[1.1rem] w-[60%] mt-4 mx-4 bg-slate-200 rounded'></div>

                </div>
            )
        }


        return (

            <>

                {loading && _renderAssetDetailsShimmer()}

                {
                    asset && !loading && <div className='flex flex-col h-full bg-white'>

                        <Tabs

                            centered value={selectedTab} className='text-black bg-[#fbece2]' textColor='inherit'

                            TabIndicatorProps={{ style: { backgroundColor: '#f1742e' } }} >

                            <Tab

                                value='asset-details' label={<Typography fontFamily='Open Sans' fontSize={14}

                                    variant='caption'>Details</Typography>} onClick={() => setSelectedTab('asset-details')} />

                            <Tab

                                value='asset-timeline' label={<Typography fontFamily='Open Sans' fontSize={14}

                                    variant='caption'>Timeline</Typography>} onClick={() => setSelectedTab('asset-timeline')} />
                            {supportUser && <Tab
                                    value='metrics' label={<Typography fontFamily='Open Sans' fontSize={14}
                                    variant='caption'>Metrics</Typography>} onClick={() => setSelectedTab('metrics')} />}

                        </Tabs>

                        {selectedTab === 'asset-details' && <div className='px-4 '><ElementDetails asset={asset} onChange={_onChange} values={values} supportUser={supportUser} onDeleteStage={_onDeleteStage} onSave={onSave}/> </div>}

                        {selectedTab === 'asset-timeline' && <div className='px-4 overflow-auto'><AssetTimeline asset={asset} /> </div>}

                        {selectedTab === 'metrics' && supportUser && <div className='px-4'><Metrics stages={stages} assetId={assetId} metrics={metrics} refetchAssets={refetchAssets} asset={asset} /></div>}

                    </div>
                }
            </>
        )
    }

export default AssetDetails