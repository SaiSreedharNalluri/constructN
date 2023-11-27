
import { Box, Checkbox, FormControlLabel } from '@mui/material'

import HierarchyPicker from './hierarchy-picker'

import LayerFilter from './layer-filter'

import AssetCategoryPicker from '../asset-category-picker'

import { IAssetCategory } from '../../../models/IAssetCategory'

import { useEffect, useState } from 'react'

import { LightBoxInstance } from '../../../services/light-box-service'

import AssetCategoryDatePicker from '../asset-category-date-picker'

export interface IProps {

    hierarchy: any

    onSelectHierarchy: (structure: any) => void

    snapshotBase: any

    snapshotCompare: any

    onSnapshotBaseChange: (value: Date, snapshot: any) => void

    onSnapshotCompareChange?: (value: Date, snapshot: any) => void

    onLayersSelected: (selected: string[]) => void

    assetCategories: IAssetCategory[]

    selectedCategory: IAssetCategory | undefined

    onCategorySelected: (category: IAssetCategory | undefined) => void

    onCompareChange: (compare: boolean) => void

}

export default function Progress2DToolbar({ 
    
    hierarchy, onSelectHierarchy, snapshotBase, snapshotCompare, 
    
    onSnapshotBaseChange, onSnapshotCompareChange, onLayersSelected,

    assetCategories, selectedCategory, onCategorySelected, onCompareChange

}: IProps) {

    const [currentStructure, setCurrentStructure] = useState<any>(LightBoxInstance.viewerData().structure)

    const [layers, setLayers] = useState<any>([])

    const [isCompare, setIsCompare] = useState<boolean>(false)

    useEffect(() => _getLayers, [snapshotBase])

    const _getLayers = () => {

        setCurrentStructure(LightBoxInstance.viewerData().structure)

        if(snapshotBase && snapshotBase.layers) setLayers(Object.keys(snapshotBase.layers))

        else setLayers([])

    }

    const _onStructureChange = (structure: any) => {

        setCurrentStructure(structure)

        onSelectHierarchy(structure)

    }

    const _onCompareChange = (event: any) => {

        const value = event.target.checked

        setIsCompare(value)

        onCompareChange(value)

    }

    return (

        <Box sx={{ display: 'flex', flexWrap: 'wrap', borderRadius: '6px', margin: '0.5rem', padding: '0.5rem' }}>

            <HierarchyPicker hierarchy={hierarchy} selected={currentStructure} onSelect={_onStructureChange} onClose={() => {}} />

            <div className='ml-2'></div>

            <LayerFilter layers={layers} onChange={onLayersSelected} />

            <div className='ml-2'></div>

            <AssetCategoryPicker selected={selectedCategory} categories={assetCategories} onSelect={onCategorySelected} />

            <div className='ml-2'></div>

            <AssetCategoryDatePicker 
            
                snapshots={LightBoxInstance.viewerData().snapshots} 
                
                snapshotBase={snapshotBase} snapshotCompare={snapshotCompare} compare={isCompare}

                onChangeToDate={onSnapshotBaseChange}
                
                onChangeFromDate={onSnapshotCompareChange}/>

            <div className='ml-2 flex-1'></div>

            <div className='ml-2'>

                <FormControlLabel control={<Checkbox color='warning' checked={isCompare} size='small' />} onChange={_onCompareChange} label='Compare'
                
                className='border border-[#e2e3e5] rounded [&>.MuiFormControlLabel-label]:select-none [&>.MuiFormControlLabel-label]:text-[#4a4a4a] [&>.MuiFormControlLabel-label]:text-sm [&>.MuiFormControlLabel-label]:mr-2' 
                
                sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'Open Sans' } }}  />

            </div>

        </Box>
        
    )
}