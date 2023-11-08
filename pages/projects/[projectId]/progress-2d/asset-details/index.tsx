import { useState, useEffect } from 'react'

import { IAsset } from '../../../../../models/IAssetCategory'

import instance from '../../../../../services/axiosInstance'

import ElementDetails from '../element-details'

import { Tab, Tabs } from '@mui/material'

import AssetTimeline from '../asset-timeline'

import { API } from '../../../../../config/config'

import { toast } from 'react-toastify'


const fetchAssetDetails = (assetId: string) => {

    try {

        return instance.get(`${API.PROGRESS_2D_URL}/assets/${assetId}`)

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

const AssetDetails: React.FC<{ assetId: string, onChange?: (asset: IAsset) => void }> = ({ assetId, onChange }) => {

    const [asset, setAsset] = useState<IAsset>()

    const [selectedTab, setSelectedTab] = useState<string>('asset-details')

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {

        setLoading(true)

        fetchAssetDetails(assetId).then(res => {

            setLoading(false)

            setAsset(res.data.result)

        }).catch(err => {

            setLoading(false)
            
            console.log(err)

        })

    }, [assetId])

    const _onChange = (key: string, value: string) => {

        if (key === 'stage')

            changeAssetStage(assetId, value, new Date()).then(res => {
                
                onChange && onChange(res.data.result)

                toast.success('Updated asset stage successfully!')
            
            }).catch(err => toast.error('Failed to update asset stage!'))

        else

            updateAssetDetails(assetId, { name: value }).then(res => {
                
                onChange && onChange(res.data.result)

                toast.success('Updated asset details successfully!')
                
            }).catch(err => toast.error('Failed to update asset details!'))

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

            </div>
        )
    }


    return (

        <>

            { loading && _renderAssetDetailsShimmer() }
            
            {
                asset && !loading && <div className='h-full bg-white'>

                    <Tabs

                        centered value={selectedTab} className='text-black bg-[#fbece2]' textColor='inherit'

                        TabIndicatorProps={{ style: { backgroundColor: '#f1742e' } }} >

                        <Tab value='asset-details' label='Details' onClick={() => setSelectedTab('asset-details')} />

                        <Tab value='asset-timeline' label='Timeline' onClick={() => setSelectedTab('asset-timeline')} />

                    </Tabs>

                    {selectedTab === 'asset-details' && <div className='px-4 '><ElementDetails asset={asset} onChange={_onChange} /> </div>}

                    {selectedTab === 'asset-timeline' && <div className='px-4 '><AssetTimeline asset={asset} /> </div>}

                </div>
            }
        </>
    )
}

export default AssetDetails