import styled from '@emotion/styled'

import { ToggleButtonGroup, ToggleButton, IconButton, Divider, ButtonGroup, Tooltip } from '@mui/material'

import FormatShapesIcon from '@mui/icons-material/FormatShapes'

import PolylineIcon from '@mui/icons-material/Polyline'

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

import SwipeRightOutlinedIcon from '@mui/icons-material/SwipeRightOutlined'

import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined'

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

import React, { FC, useEffect } from 'react'

import { publish } from '../../services/light-box-service'

const SegmentToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({

  '& .MuiToggleButtonGroup-grouped': {

    margin: '0.25rem',

    border: 0,

    '&.Mui-disabled': {

      border: 0

    },

    '&.Mui-selected': {

      color: 'white',

      backgroundColor: 'rgb(241, 116, 46)'

    },

    '&.MuiToggleButton-root:hover': {

      color: 'white',

      backgroundColor: 'rgba(241, 116, 46)'

    },

    '&.Mui-selected:hover': {

      color: 'white',

      backgroundColor: 'rgba(241, 116, 46)'

    },

    '&:not(:first-of-type)': {

      borderRadius: '0.25rem'

    },

    '&:first-of-type': {

      borderRadius: '0.25rem',

    },

    '& .MuiSvgIcon-root': {

      width: '1.15rem',

      height: '1.15rem'
    }
  }
}));

const SegmentButtonGroup = styled(ButtonGroup)(({ theme }) => ({

  padding: '0 0.25rem',

  alignItems: 'center',

  '& .MuiButtonBase-root': {

    borderRadius: '0.25rem',

    width: '2.15rem',

    height: '2.15rem'

  },

  '& .MuiButtonBase-root:not(:first-of-type):not(:last-of-type)': {

    marginLeft: '0.15rem'

  },

  '& .MuiButtonBase-root:hover': {

    color: 'white',

    backgroundColor: 'rgba(241, 116, 46, 100)'

  },

  '& .MuiSvgIcon-root': {

    width: '1.15rem',

    height: '1.15rem'
  }

}));


const ClickTypesPicker: FC<any> = (props) => {

  const [clickType, setClickType] = React.useState<string>('Select')

  const getIconForType = (type: string) => {

    switch (type) {

      case 'Polygon': return <FormatShapesIcon />

      case 'Line': return <PolylineIcon />

      case 'Circle': return <RadioButtonUncheckedIcon />

      case 'Select': return <TouchAppOutlinedIcon />

      case 'Move': return <SwipeRightOutlinedIcon />

      case 'Delete': return <DeleteOutlineOutlinedIcon />

    }

  }

  const toggleButtons = ['Polygon', 'Line', 'Circle'].map((type: string) => {

    return (

      <Tooltip key={type} title={`${type} Shape`} arrow >

        <ToggleButton

          selected={clickType == type}

          value={type}

          aria-label={type} >

          {getIconForType(type)}

        </ToggleButton>

      </Tooltip>

    )

  })

  const iconButtons = ['Delete'].map((type: string) => {

    return (

      <Tooltip key={type} title={type} arrow >

        <IconButton

          onClick={(event: React.MouseEvent<HTMLElement>) => {

            event.stopPropagation()

            // setClickType(type)

            // publish('progress-2d-tool', type)

          }}

          aria-label={type} >

          {getIconForType(type)}

        </IconButton>

      </Tooltip>

    )

  })

  return (

    <div className='flex'>

      <SegmentToggleButtonGroup

        size='small'

        exclusive

        value={clickType}

        onChange={(event: React.MouseEvent<HTMLElement>, newValue: string) => {

          event.stopPropagation()

          setClickType(newValue)

          publish('progress-2d-tool', newValue)

        }}

        aria-label='text alignment'>

        <Tooltip key={'Select'} title={`${'Select'} Shape`} arrow >

          <ToggleButton

            selected={clickType == 'Select'}

            value={'Select'}

            aria-label={'Select'} >

            {getIconForType('Select')}

          </ToggleButton>

        </Tooltip>

      </SegmentToggleButtonGroup>

      <Divider orientation="vertical" variant="middle" className='w-[1.5px] bg-[#e5e5e5]' flexItem />


      <SegmentToggleButtonGroup

        size='small'

        exclusive

        value={clickType}

        onChange={(event: React.MouseEvent<HTMLElement>, newValue: string) => {

          event.stopPropagation()

          setClickType(newValue)

          publish('progress-2d-tool', newValue)

        }}

        aria-label='text alignment'>

        {toggleButtons}

      </SegmentToggleButtonGroup>

      {/* <Divider orientation="vertical" variant="middle" flexItem />

      <SegmentButtonGroup

        variant="outlined"

        aria-label='text alignment'>

        {iconButtons}

      </SegmentButtonGroup> */}

    </div>

  )

}

export default ClickTypesPicker