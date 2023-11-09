import { SelectChangeEvent, Box, Checkbox, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material'

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

import React, { FC, useState } from 'react'

import cameraIcon from '../../public/divami_icons/cameraIcon.svg'

import hexagonIcon from '../../public/divami_icons/hexagonIcon.svg'

import videoRecorderIcon from '../../public/divami_icons/videoRecorderIcon.svg'

import DroneImage from '../../public/divami_icons/DroneImage.svg'

import { LayerSecondSectionCamImg, CameraIcon } from '../divami_components/toolbar/ToolBarStyles'

const ITEM_HEIGHT = 48

const ITEM_PADDING_TOP = 8

const MenuProps = {

  PaperProps: {

    style: {

      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,

      marginTop: 2,

      width: 200,

    }
  }
}

const LayerSelect: FC<any> = (props) => {

  const [selected, setSelected] = useState<string[]>(props.layers)

  const layers = props.layers

  const handleChange = (event: SelectChangeEvent<typeof selected>) => {

    const { target: { value } } = event

    setSelected(typeof value === 'string' ? value.split(',') : value)

    if (props.onChange) props.onChange(typeof value === 'string' ? value.split(',') : value)

  }

  const _renderIcon = (label: string) => {

    if (label === 'Phone Image') {

      return (

        <LayerSecondSectionCamImg className='w-[1.1rem] h-[1.1rem] mt-[-4px]'>

          <CameraIcon src={hexagonIcon} alt='Arrow' />

        </LayerSecondSectionCamImg>

      )

    } else if (label === '360 Image') {

      return (

        <LayerSecondSectionCamImg className='w-[1.1rem] h-[1.1rem] mt-[-4px]'>

          <CameraIcon src={cameraIcon} alt='Arrow' />

        </LayerSecondSectionCamImg>

      )

    } else if (label === '360 Video') {

      return (

        <LayerSecondSectionCamImg className='w-[1.1rem] h-[1.1rem] mt-[-4px]'>

          <CameraIcon src={videoRecorderIcon} alt='Arrow' />

        </LayerSecondSectionCamImg>

      )

    } else if (label === 'Drone Image') {

      return (

        <LayerSecondSectionCamImg className='w-[1.1rem] h-[1.1rem] mt-[-4px]'>

          <CameraIcon src={DroneImage} alt='Arrow' />

        </LayerSecondSectionCamImg>

      )

    } else return <></>

  }

  return (

    <Select multiple size='small' sx={{

      boxShadow: 'none',

      '.MuiOutlinedInput-notchedOutline': { border: 0 },

      '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {

        border: 0

      },

      '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {

        border: 0

      }

    }} value={selected} onChange={handleChange}

      input={

        <OutlinedInput size='small' className='min-w-[200px]'

          startAdornment={<Typography className='text-[#4a4a4a] text-sm mr-1'>Layers: </Typography>} />

      }

      renderValue={(selected) => (

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>

          {selected.map((value) => _renderIcon(value))}

        </Box>

      )}

      MenuProps={MenuProps}>

      {layers.map((mLayer: string) => (

        <MenuItem color='warning' className='h-8' key={mLayer} value={mLayer}>

          <Checkbox color='warning' checked={selected.indexOf(mLayer) > -1} />

          <ListItemText color='warning' secondary={mLayer} />

        </MenuItem>

      ))}

    </Select>

  )
}

export default LayerSelect