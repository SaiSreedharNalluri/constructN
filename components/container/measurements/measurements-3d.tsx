import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'

import IconButton from '@mui/material/IconButton'

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

import LinearScaleIcon from '@mui/icons-material/LinearScale'

import HeightIcon from '@mui/icons-material/Height'

import DeleteIcon from '@mui/icons-material/Delete';

import VisibilityIcon from '@mui/icons-material/Visibility';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import PolylineIcon from '@mui/icons-material/Polyline'

import FormatShapesIcon from '@mui/icons-material/FormatShapes'

import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined'

import LayersClearOutlinedIcon from '@mui/icons-material/LayersClearOutlined'

import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import { styled, ToggleButtonGroup, ButtonGroup, Tooltip, ToggleButton, Divider, Checkbox, List, ListItem, ListItemButton, Button, OutlinedInput } from '@mui/material'
import instance from '../../../services/axiosInstance'
import { API } from '../../../config/config'
import authHeader from '../../../services/auth-header'
import ConfirmModal from './confirmModal'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import CustomLoader from '../../divami_components/custom_loader/CustomLoader'
import PopupComponent from '../../popupComponent/PopupComponent'
import { CustomToast } from '../../divami_components/custom-toaster/CustomToast'


const subscribe = (eventName: string, listener: EventListenerOrEventListenerObject) => {

  document.addEventListener(eventName, listener)
}

const unsubscribe = (eventName: string, listener: EventListenerOrEventListenerObject) => {
  document.removeEventListener(eventName, listener)
}

const getMeasurements = async (snapshot: string, setApiPoints: Dispatch<SetStateAction<never[]>>, setLoading: Dispatch<SetStateAction<boolean>>) => {
  try{
    setLoading(true);
    const resp =  await instance.get(
      `${API.BASE_URL}/measurements`,
      {
        headers: authHeader.authHeader(),
        params: { snapshot }
      }
    )
    setApiPoints(resp.data.result);
  }catch{
    setApiPoints([]);
    CustomToast('Failed to Load Measurements!',"error");
  }finally{
    setLoading(false);
  }
};

const getMeasurement = async (measurementId: string) => {
  return await instance.get(
    `${API.BASE_URL}/measurements/${measurementId}`,
    {
      headers: authHeader.authHeader(),
    }
  )
};

const updateMeasurement = async ({
  name = '',
  type = '',
  snapshot = '',
  context= {},
  data = [],
  measurementId = '',
  setLoading=()=>{},
  refetch=()=>{},
}: { name?: string, type?: string, measurementId?: string; data?:object[]; context?: object; snapshot: string; setLoading: Dispatch<SetStateAction<boolean>>; refetch: Function}) => {
  try{
  setLoading(true);
  await instance.put(
    `${API.BASE_URL}/measurements/${measurementId}`,
    {
      name,
      type,
      snapshot,
      context,
      data,
    },
    {
      headers: authHeader.authHeader(),
    }
  );
  CustomToast('Measurement Updated Sucessfull!',"success");
  refetch();
  }catch{
    CustomToast('Failed to Update Measurement!',"error");
  }finally{
    setLoading(false);
  }
};

const deleteMeasurement = async (measurementId: string, setLoading: Dispatch<SetStateAction<boolean>>, refetch: Function=()=>{}) => {
  try{
    setLoading(true)
    await instance.delete(
    `${API.BASE_URL}/measurements/${measurementId}`,
    {
      headers: authHeader.authHeader(),
    }
  )
  refetch();
  CustomToast('Measurement Sucessfully Deleted!',"success");
  }catch{
    CustomToast('Failed to Delete Measurement!',"error");
  }finally{
    setLoading(false)
  }
};

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



const MeasurementTypePicker: FC<any> = ({ potreeUtils}) => {

  const [measurementsLoaded, setMeasurementsLoaded]=useState(false)
  
  const [points, setPoints]= useState<{ _id?: string, removeMarker: Function; position: object; mtype?: string; uuid: string; name?: string, points?: { position: object}[], visible: boolean}[]>([]);

  const [apiPoints, setApiPoints]= useState([])

  const { loadMeasurementModule, loadAddMeasurementsEvents , getPoints , removeMeasurement, clearAllMeasurements , loadMeasurements } = potreeUtils || {}

  const [show, setShow] = useState<boolean>(false)

  const [measurementType, setMeasurementType] = useState<string>()

  const [selected, setSelected] = useState<string>('')

  const [showModal , setShowModal] = useState(false);

  const [deleteMeasurementId, setDeleteMeasurementId] = useState<string>('');

  const [hideButton, setHideButton] = useState(true);

  const [search ,setSearch] = useState('');

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const snapshot = router.query.snap as string;

  const onSelect = (measure: { uuid?: string; _id?: string }, fromEvent = false) => {
    if(fromEvent){
      setSelected(measure?._id || measure?.uuid || '');
      setShow(true);
    }else{
      setSelected((prem) => ((prem === (measure?._id || measure?.uuid )) ? "" : (measure?._id || '')));
    };
  }

  useEffect(()=>{
    if(loadMeasurementModule && show){
      loadMeasurementModule();
    }
  },[show])

  useEffect(()=>{
    if(loadMeasurements && !loading){
      loadMeasurements(apiPoints);
      setMeasurementsLoaded(!measurementsLoaded)
    }
  },[apiPoints.length])

  const refetch = ()=> {
    getMeasurements(snapshot, setApiPoints, setLoading)
  }

  useEffect(()=>{
    (points || []).forEach((point: any)=>{
      if(point._id === selected || point.uuid === selected){
        if(point.mtype !== 'Point'){
          point.lineMaterial.linewidth = 3
        }else{
          point.spheres[0]?.material.color.setRGB(255,255,0);
        }
        point.color.setRGB(255,255,0);
      }else{
        if(point.mtype !== 'Point'){
          point.lineMaterial.linewidth = 2
        }else{
          point.spheres[0]?.material.color.setRGB(1,0,0);
        }
        point.color.setRGB(1,0,0);
      };
    })
  },[selected, measurementsLoaded]);

  const mouseMoved = (e: any)=>{
    const { measure , isClick } = e.detail;
    onSelect(measure, true);
    if(!isClick){
      const formatData = measure.points?.map((point:{position: object})=>(point.position))
      updateMeasurement({
        name: measure.name,
        type: measure.mtype,
        snapshot,
        context: {},
        data: formatData,
        measurementId: measure._id,
        setLoading,
        refetch
      });
    }
  }

  const markerAdded = (e: any) =>{
    const { measurement } = e.detail
    onSelect(measurement, true);
  }

  const showConfirm = () => setShowModal(true);
  
  useEffect(()=>{
    refetch();
    subscribe("measurement-moved", mouseMoved);
    subscribe("marker-added", markerAdded);
    subscribe('measurement-created', showConfirm);
    return(()=>{
      unsubscribe("measurement-moved", mouseMoved);
      unsubscribe("marker-added", markerAdded);
      unsubscribe("measurement-created", showConfirm);
    })
  },[])
  

  useEffect(()=>{
    if(loadAddMeasurementsEvents){
      loadAddMeasurementsEvents()
    }
    if(getPoints){
      setPoints(getPoints())
    }
  },[loadAddMeasurementsEvents, getPoints])

  const measurement = points.find((point)=>((point._id === selected || point.uuid === selected)));


  const getIconForType = (type: string) => {

    switch (type) {

      case 'Point': return <FiberManualRecordIcon id="rahmanMeasure_point" />

      case 'Distance': return <LinearScaleIcon id="rahmanMeasure_distance" />

      case 'Height': return <HeightIcon  id="rahmanMeasure_height" />

      case 'Angle': return <PolylineIcon id="rahmanMeasure_angle"/>

      case 'Area': return <FormatShapesIcon id="rahmanMeasure_area" />

      case 'Undo': return <ReplayOutlinedIcon id="rahmanMeasure_undo" onClick={()=>{
        if(measurement?.points?.length! > 1){
          measurement?.removeMarker(measurement?.points?.length! - 1);
      }else{
        setDeleteMeasurementId(measurement?._id || '');
      }
      }}/>

      case 'Clear': return <LayersClearOutlinedIcon id="rahmanMeasure_clear" onClick={()=> {
        removeMeasurement(measurement);
      }}/>

      case 'Update': return <VerifiedOutlinedIcon onClick={()=>{
      const formatData = measurement?.points?.map((point)=>(point.position))
        updateMeasurement({
          name: measurement?.name,
          type: measurement?.mtype,
          snapshot,
          context: {},
          data: formatData,
          measurementId: measurement?._id,
          setLoading,
          refetch
        });
      }} />

    }

  }

  const toggleButtons = ['Point', 'Distance', 'Height', 'Angle', 'Area'].map((type: string) => {

    return (

      <Tooltip key={type} title={`${type}`} arrow >

        <IconButton

        className={measurementType == type?" bg-[#F1742E] text-[#fff]":""}

        onClick={()=> {
          setMeasurementType(type);
        }}
        
        aria-label={type} >

          {getIconForType(type)}

        </IconButton>

      </Tooltip>

    )

  })

  const iconButtons = ['Undo', 'Clear', 'Update'].map((action: string) => {

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

  const clearAll = ['Update','Undo'].map((action: string) => {

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

  const filteredpoints = points.filter((point) =>
    point.name?.toLowerCase()?.includes(search?.toLowerCase())
	);


  return (

    <div className={`flex-column absolute right-[60px] bottom-0 rounded-t-md select-none h-auto rounded w-auto bg-white font-['Open_Sans']`} >

      <div

        className='rounded h-4 bg-white w-full cursor-pointer flex items-center'

        style={{ borderRadius: '4px 4px 0 0', border: '1px solid #e2e3e5' }}

        onClick={() =>{
          setShow(!show);
          if(show){
            setSelected('');
          }
        }} >

        <div className='pl-4 text-[12px] flex-1 items-center text-gray-600 cursor-pointer'>{show ? 'Hide' : 'Show'} Measurements</div>

        <IconButton size="small" className='w-3 h-4 text-l mx-2' aria-label="delete">

          {show ? <KeyboardArrowDownIcon fontSize="inherit" /> : <KeyboardArrowUpIcon fontSize="inherit" />}

        </IconButton>

      </div>

      {/* <h6 className='px-6 py-1 bg-[#e2e3e5] text-sm rounded-t-md text-gray-700'>Measurements</h6> */}

      { show && <div className={`flex mx-3 mt-3 rounded-md justify-between`} style={{border: '1px solid #e2e3e5'}}>

        <SegmentButtonGroup
        
        variant="outlined"
        
        aria-label='text alignment'
        className='flex justify-between w-full'

          >

          {toggleButtons}

        </SegmentButtonGroup>

      {selected ?<>
        <Divider orientation="vertical" variant="middle" flexItem />

        <SegmentButtonGroup

          variant="outlined"

          aria-label='text alignment'>

          {clearAll}

        </SegmentButtonGroup>
        </>: null}

      </div> }

      {((show || selected) && apiPoints?.length > 0 ) ? <div className='flex mt-2 justify-between mr-4'>
        <div className='ml-4 text-[12px] text-gray-600 font-medium'>Measurements</div>
          {hideButton ? <Button variant="text" className='text-xs' onClick={()=>{
            points?.forEach((measurement: {visible: boolean})=>{
              measurement.visible = false;
            });
            setHideButton(false);
          }}>
            Hide All
          </Button>: <Button variant="text" className='text-xs' onClick={()=>{
            points?.forEach((measurement)=>{
              measurement.visible = true;
            });
            setHideButton(true);
          }}>
            Show All
          </Button>}
      </div>: null}
      {(show || selected) ? <div className="m-4 mt-1">
        {apiPoints?.length > 0 ? <OutlinedInput
				size="small"
				placeholder="Search"
				onChange={(e) => setSearch(e.target.value)}
				fullWidth
			/>: null}
      </div>: null}

      { (show || selected) && <List dense className='rounded-md m-4 mt-1 pb-0  overflow-scroll' sx={{ minWidth: 240, maxWidth: 360, bgcolor: 'background.paper', border: '1px solid #e2e3e5', maxHeight: 360 }} key={points?.length} >

        {points?.length > 0 && filteredpoints?.map((measurement: { type?: string; name?: string, visible?: boolean, mtype?: string, _id?: string }) => {

          return (

            measurement && measurement?._id && <ListItem

              key={measurement._id}

              className={`${selected === measurement._id ? ' bg-orange-100' : ''}`}

              secondaryAction={

                measurement.visible ? 
                <VisibilityIcon onClick={()=>{ measurement.visible = !measurement.visible }} style={{ fontSize: "18px" }} className='mr-[26px] cursor-pointer'/>: 
                <VisibilityOffIcon onClick={()=>{ measurement.visible = !measurement.visible }} style={{ fontSize: "18px" }} className='mr-[26px] cursor-pointer' />

              }

              onClick={() => onSelect(measurement)}

              disablePadding >

              <ListItemButton>

                <div className='flex items-center' style={{ fontSize: '0.65rem' }}>

                  <div className={`w-3.5 mr-4 [&>*]:text-[#7a7a7a]`}> {getIconForType(measurement.mtype || measurement.name || '') } </div>

                  <div className='px-2 truncate md:text-clip'>{measurement && measurement?.name?.toUpperCase()}</div>

                </div>

              </ListItemButton>

                <DeleteIcon
                    onClick={()=> setDeleteMeasurementId(measurement._id!)}
                    style={{ fontSize: "18px" }}
                    data-testid={"addIcon"}
                    className='cursor-pointer mr-2 z-10'
                  />

            </ListItem>

          )

        })}
        {show ? <ConfirmModal show={showModal} setShow={setShowModal} measurement={measurement!} onCancel={()=>{
          removeMeasurement(measurement);
          setSelected('');
        }
          } refetch={refetch} setLoading={setLoading} loading={loading} setSelected={setSelected} apiPoints={apiPoints} />: null}
        {!!deleteMeasurementId ? <PopupComponent
          open={!!deleteMeasurementId}
          hideButtons
          setShowPopUp={setDeleteMeasurementId}
          modalTitle={"Delete Measurement"}
          modalContent={'Are You Sure You Want To Delete?'}
          modalmessage={""}
          primaryButtonLabel={"Confirm"}
          SecondaryButtonlabel={"Cancel"}
          disableSecondaryButton={loading}
          disablePrimaryButton={loading}
          callBackvalue={async () =>{ 
            await deleteMeasurement(deleteMeasurementId, setLoading, refetch);
            setDeleteMeasurementId('');
            setSelected('');
          }}
          secondaryCallback={()=> setDeleteMeasurementId('')}
        />: null}

      </List> }
      {loading ? <CustomLoader />: null}
    </div>

  )

}
