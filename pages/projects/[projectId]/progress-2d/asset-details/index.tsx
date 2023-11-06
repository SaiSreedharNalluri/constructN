import { useState, useEffect } from 'react'

import { IAsset } from '../../../../../models/IAssetCategory'

import instance from '../../../../../services/axiosInstance'

import ElementDetails from '../element-details'

import { Tab, Tabs } from '@mui/material'

import AssetTimeline from '../asset-timeline'


const fetchAssetDetails = (assetId: string) => {

    try {

        return instance.get(`http://localhost:3001/api/assets/${assetId}`)

    } catch (error) { throw error }

}

const updateAssetDetails = (assetId: string, data: Partial<IAsset>) => {

    try {

        return instance.put(`http://localhost:3001/api/assets/${assetId}`, data)

    } catch (error) { throw error }

}

const changeAssetStage = (assetId: string, stage: string, date: Date) => {

    try {

        return instance.put(`http://localhost:3001/api/assets/${assetId}/change-stage`, { stage, date })

    } catch (error) { throw error }

}

const AssetDetails: React.FC<{ assetId: string, onChange?: (asset: IAsset) => void }> = ({ assetId, onChange }) => {

    const [asset, setAsset] = useState<IAsset>()

    const [selectedTab, setSelectedTab] = useState<string>('asset-details')

    useEffect(() => {

        fetchAssetDetails(assetId).then(res => {

            setAsset(res.data.result)

        }).catch(err => console.log(err))

    }, [assetId])

    const _onChange = (key: string, value: string) => {

        if (key === 'stage')

            changeAssetStage(assetId, value, new Date()).then(res => onChange && onChange(res.data.result)).catch(err => console.log(err))

        else

            updateAssetDetails(assetId, { name: value }).then(res => onChange && onChange(res.data.result)).catch(err => console.log(err))

    }


    return (

        <>
            {
                asset && <div className='h-full bg-white'>

                    <Tabs

                        centered value={selectedTab} className='text-[#4a4a4a] bg-[#f2f3f5]' textColor='inherit'

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