import { FC, useEffect, useRef, useState } from 'react'

import IconButton from '@mui/material/IconButton'

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

import LinearScaleIcon from '@mui/icons-material/LinearScale'

import HeightIcon from '@mui/icons-material/Height'

import CloseIcon from '@mui/icons-material/Close';

import PolylineIcon from '@mui/icons-material/Polyline'

import FormatShapesIcon from '@mui/icons-material/FormatShapes'

import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined'

import LayersClearOutlinedIcon from '@mui/icons-material/LayersClearOutlined'

import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import { styled, ToggleButtonGroup, ButtonGroup, Tooltip, ToggleButton, Divider, Checkbox, List, ListItem, ListItemButton } from '@mui/material'


const Measurements3DView: FC<any> = ({ potreeUtils = {}}) => {

  return (<div id='rahmanMeasurement'>
            <MeasurementTypePicker potreeUtils={potreeUtils} />
          </div>)

}

export default Measurements3DView


const SegmentToggleButtonGroup = styled(ToggleButtonGroup)({

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
});

const SegmentButtonGroup = styled(ButtonGroup)({

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

});


const MeasurementTypePicker: FC<any> = ({ onMeasurementChange, potreeUtils}) => {

  const [render, setRender]=useState(false)
  
  const [points, setPoints]=useState([])

  const { loadMeasurementModule, loadAddMeasurementsEvents , getPoints , removeMeasurement, undoMeasurement, clearAllMeasurements } = potreeUtils || {}

  const [show, setShow] = useState<boolean>(false)

  const [measurementType, setMeasurementType] = useState<string>()


  const [selected, setSelected] = useState<string>()

  useEffect(()=>{
    if(loadMeasurementModule && show){
      loadMeasurementModule()
    }
  },[show])
  

  useEffect(()=>{
    if(loadAddMeasurementsEvents){
      loadAddMeasurementsEvents()
    }
    if(getPoints){
      setPoints(getPoints())
    }
  },[loadAddMeasurementsEvents, getPoints])


  const getIconForType = (type: string) => {

    switch (type) {

      case 'Point': return <FiberManualRecordIcon id="rahmanMeasure_point" />

      case 'Distance': return <LinearScaleIcon id="rahmanMeasure_distance" />

      case 'Height': return <HeightIcon  id="rahmanMeasure_height" />

      case 'Angle': return <PolylineIcon id="rahmanMeasure_angle"/>

      case 'Area': return <FormatShapesIcon id="rahmanMeasure_area" />

      case 'Undo': return <ReplayOutlinedIcon id="rahmanMeasure_undo" onClick={()=>{
        undoMeasurement();
        setRender(!render);
      }}/>

      case 'Clear': return <LayersClearOutlinedIcon id="rahmanMeasure_clear" onClick={()=>{
        clearAllMeasurements();
        setRender(!render);
      }}/>

      case 'Save': return <VerifiedOutlinedIcon />

    }

  }

  const toggleButtons = ['Point', 'Distance', 'Height', 'Angle', 'Area'].map((type: string) => {

    return (

      <Tooltip key={type} title={`${type}`} arrow >

        <IconButton

        className={measurementType == type?" bg-[#F1742E] text-[#fff]":""}

        onClick={()=> {
          setMeasurementType(type);
          setRender(!render);
        }}
        
        aria-label={type} >

          {getIconForType(type)}

        </IconButton>

      </Tooltip>

    )

  })

  const iconButtons = ['Undo', 'Clear', 'Save'].map((action: string) => {

    return (

      <Tooltip key={action} title={action} arrow >

        <IconButton
        
        onClick={()=> setMeasurementType('')}

          aria-label={action} >

          {getIconForType(action)}

        </IconButton>

      </Tooltip>

    )

  })

  const handleToggle = (measurement: {visible: boolean}) => () => measurement.visible = !measurement.visible

  const onSelect = () => {}

  return (

    <div className={`flex-column absolute right-[60px] bottom-0 rounded-t-md select-none h-auto rounded w-auto bg-white font-['Open_Sans']`} >

      <div

        className='rounded h-4 bg-white w-full cursor-pointer flex align-items-center'

        style={{ borderRadius: '4px 4px 0 0', border: '1px solid #e2e3e5' }}

        onClick={() => setShow(!show)} >

        <div className='pl-4 pt-3 text-xs flex-1 items-center text-gray-600 cursor-pointer'>{show ? 'Hide' : 'Show'} Measurements</div>

        <IconButton size="small" className='w-3 h-4 mt-1 text-l mx-2 pb-3' aria-label="delete">

          {show ? <KeyboardArrowDownIcon fontSize="inherit" /> : <KeyboardArrowUpIcon fontSize="inherit" />}

        </IconButton>

      </div>

      {/* <h6 className='px-6 py-1 bg-[#e2e3e5] text-sm rounded-t-md text-gray-700'>Measurements</h6> */}

      { show && <div className={`flex mx-3 mt-3 rounded-md`} style={{border: '1px solid #e2e3e5'}}>

        <SegmentButtonGroup
        
        variant="outlined"
        
        aria-label='text alignment'

          >

          {toggleButtons}

        </SegmentButtonGroup>

        <Divider orientation="vertical" variant="middle" flexItem />

        <SegmentButtonGroup

          variant="outlined"

          aria-label='text alignment'>

          {iconButtons}

        </SegmentButtonGroup>

      </div> }

      { show && <List dense className='rounded-md m-4' sx={{ maxWidth: 360, bgcolor: 'background.paper', border: '1px solid #e2e3e5' }} key={points?.length}>

        {points?.length > 0 && points?.map((measurement: {uuid: string; type: string; name: string, visible: boolean }) => {

          const measurementId = `checkbox-list-secondary-measurement-${measurement.uuid}`;

          return (

            measurement && <ListItem

              key={measurement.uuid}

              className={`mt-2${selected === measurement.uuid ? ' bg-orange-100' : ''}`}

              secondaryAction={

                <Checkbox

                  edge="start"

                  color="warning"

                  size='small'

                  checked={measurement.visible}

                  onChange={handleToggle(measurement)}

                  className='mr-[12px]'

                  inputProps={{ 'aria-labelledby': measurementId }}

                />

              }

              // onClick={() => onSelect()}

              disablePadding >

              <ListItemButton>

                <div className='flex items-center' style={{ fontSize: '0.65rem' }}>

                  <div className={`w-3.5 h-3.5 mr-4 [&>*]:w-4 [&>*]:h-4 [&>*]:text-[#7a7a7a]`}> { getIconForType(measurement['type']) } </div>

                  <div className='px-2 truncate md:text-clip'>{measurement && measurement.name.toUpperCase()}</div>

                </div>

              </ListItemButton>

              <div onClick={()=>{
                removeMeasurement(measurement);
                setRender(!render);
                }}
                className='mr-[10px] cursor-pointer'>
                <CloseIcon
                    style={{ color:"#101F4C", fontSize: "16px" }}
                    data-testid={"addIcon"}
                  />
              </div>

            </ListItem>

          )

        })}

      </List> }

    </div>

  )

}
