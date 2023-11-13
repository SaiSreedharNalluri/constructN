
import { Box, Checkbox, FormControlLabel } from '@mui/material'

import HierarchyPicker from './hierarchy-picker'

import LayerFilter from './layer-filter'

import AssetCategoryPicker from '../asset-category-picker'

import { IAssetCategory } from '../../../../../../models/IAssetCategory'

import { useEffect, useState } from 'react'

import { LightBoxInstance } from '../../../../../../services/light-box-service'

import AssetCategoryDatePicker from '../asset-category-date-picker'

export interface IProps {

    hierarchy: any

    onSelectHierarchy: (structure: any) => void

    snapshotBase: any

    onSnapshotBaseChange: (value: Date, snapshot: any) => void

    onLayersSelected: (selected: string[]) => void

    assetCategories: IAssetCategory[]

    selectedCategory: IAssetCategory | undefined

    onCategorySelected: (category: IAssetCategory | undefined) => void

}

export default function Progress2DToolbar({ 
    
    hierarchy, onSelectHierarchy,

    snapshotBase, onSnapshotBaseChange, onLayersSelected,

    assetCategories, selectedCategory, onCategorySelected

}: IProps) {

    const [currentStructure, setCurrentStructure] = useState<any>(LightBoxInstance.viewerData().structure)

    const [isCompare, setIsCompare] = useState<boolean>(false)

    const _getLayers = () => {

        if(snapshotBase.layers) return Object.keys(snapshotBase.layers)

        else return []

    }

    const _onStructureChange = (structure: any) => {

        setCurrentStructure(structure)

        onSelectHierarchy(structure)

    }

    const _onCompareChange = (event: any) => {

        const value = event.target.checked

        setIsCompare(value)

    }

    useEffect(() => console.log(selectedCategory), [])

    return (

        <Box sx={{ display: 'flex', flexWrap: 'wrap', border: '1px solid #e2e3e5', borderRadius: '6px', margin: '0.5rem', padding: '0.5rem' }}>

            <HierarchyPicker hierarchy={hierarchy} selected={currentStructure} onSelect={_onStructureChange} onClose={() => {}} />

            <div className='ml-2'></div>

            <LayerFilter layers={_getLayers()} onChange={onLayersSelected} />

            <div className='ml-2'></div>

            <AssetCategoryPicker selected={selectedCategory} categories={assetCategories} onSelect={onCategorySelected} />

            <div className='ml-2'></div>

            <AssetCategoryDatePicker 
            
                snapshots={LightBoxInstance.viewerData().snapshots} 
                
                snapshotBase={snapshotBase} compare={isCompare}
                
                onChangeToDate={onSnapshotBaseChange}/>

            <div className='ml-2'></div>

            <div className='ml-2'>

                <FormControlLabel className='border border-[#e2e3e5] rounded [&>.MuiFormControlLabel-label]:select-none [&>.MuiFormControlLabel-label]:text-[#4a4a4a] [&>.MuiFormControlLabel-label]:text-sm [&>.MuiFormControlLabel-label]:mr-2' 
                
                control={<Checkbox color='warning' checked={isCompare} size='small' />} onChange={_onCompareChange} label='Enable Compare' />

            </div>

        </Box>
        
    )
}