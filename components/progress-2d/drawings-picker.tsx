import { SelectChangeEvent, Box, Checkbox, ListItemText, MenuItem, OutlinedInput, Select, Typography, Radio } from '@mui/material'

import React, { FC } from 'react'

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

    drawings: string[]

    selected: string | undefined

    onSelect: (drawing: string | undefined) => void

}

const DrawingsPicker: FC<IProps> = ({drawings, selected, onSelect}) => {

  const handleChange = (event: SelectChangeEvent<typeof selected>) => {

    const { target: { value } } = event

    onSelect(drawings.find((drawing: string) => drawing === value))

  }

  return (

    <Box sx={{ display: 'flex', flexWrap: 'wrap', padding: '0' }}>

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

      }} value={drawings.find((drawing: string) => drawing === selected) ? selected : 'Plan Drawings'} onChange={handleChange}

        input={

          <OutlinedInput size='small' className='min-w-[200px]'

            startAdornment={<Typography fontFamily='Open Sans' className='text-[#4a4a4a] rounded bg-[#F1742E] bg-opacity-10 px-2 py-[6px] text-[0.8rem] mr-3'>
                
                Drawing: 
                
            </Typography>} />

        }

        renderValue={(selected) => (

          <Box sx={{ display: 'flex', flexWrap: 'wrap', fontFamily: 'Open Sans', gap: 0.5 }}>

            <div className='text-black text-[0.8rem] mt-[2px]'>{ selected }</div>

          </Box>

        )}

        MenuProps={MenuProps}>

        {drawings.map((drawing: string) => (

          <MenuItem sx={{

            '&.MuiMenuItem-root.Mui-selected': {

              backgroundColor: 'rgba(246, 116, 46, 0.1)'

            }

          }} color='warning' className='h-8' key={drawing} value={drawing}>

            <Radio color='warning' size='small' checked={selected === drawing} />

            <ListItemText sx={{fontFamily: 'Open Sans'}} color='warning' secondary={drawing} />

          </MenuItem>

        ))}

      </Select>

    </Box>

  )
}

export default DrawingsPicker