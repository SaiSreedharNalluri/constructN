import { SelectChangeEvent, Box, Checkbox, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material'

import React, { FC, useEffect, useState } from 'react'

import { IAssetCategory } from '../../models/IAssetCategory'

const ITEM_HEIGHT = 48

const ITEM_PADDING_TOP = 8

const MenuProps = {

  PaperProps: {

    style: {

      maxHeight: ITEM_HEIGHT * 15 + ITEM_PADDING_TOP,

      marginTop: 2,

      width: 200,

    }
  }
}

export interface IProps {

    categories: IAssetCategory[]

    selected: IAssetCategory | undefined

    onSelect: (category: IAssetCategory | undefined) => void

}

const AssetCategoryPicker: FC<IProps> = ({categories, selected, onSelect}) => {

  const handleChange = (event: SelectChangeEvent<typeof selected>) => {

    const { target: { value } } = event

    console.log(categories.find((category: IAssetCategory) => category._id === value), '')

    onSelect(categories.find((category: IAssetCategory) => category._id === value))

  }

  useEffect(() => console.log(selected), [])

  return (

    <Box sx={{ display: 'flex', flexWrap: 'wrap', border: '1px solid #e2e3e5', borderRadius: '6px', padding: '0' }}>

      <Select size='small' sx={{

        boxShadow: 'none',
        
        '&.MuiOutlinedInput-root': { paddingLeft: '4px'},

        '.MuiOutlinedInput-notchedOutline': { border: 0 },

        '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {

          border: 0

        },

        '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {

          border: 0

        }

      }} value={selected || ''} onChange={handleChange}

        input={

          <OutlinedInput size='small' className='min-w-[200px]'

            startAdornment={<Typography className='text-[#4a4a4a] rounded bg-[#F1742E] bg-opacity-10 px-2 py-[6px] text-sm mr-3'>
                
                Category: 
                
            </Typography>} />

        }

        renderValue={(selected) => (

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>

            <div className='text-black text-sm mt-[2px]'>{ (selected as IAssetCategory).name }</div>

          </Box>

        )}

        MenuProps={MenuProps}>

        {categories.map((category: IAssetCategory) => (

          <MenuItem sx={{

            '&.MuiMenuItem-root.Mui-selected': {

              backgroundColor: 'rgba(246, 116, 46, 0.1)'

            }

          }} color='warning' className='h-8' key={category._id} value={category._id}>

            <Checkbox color='warning' size='small' checked={selected && selected._id === category._id} />

            <ListItemText color='warning' secondary={category.name} />

          </MenuItem>

        ))}

      </Select>

    </Box>

  )
}

export default AssetCategoryPicker