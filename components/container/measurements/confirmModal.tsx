import { TextField } from '@mui/material'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import PopupComponent from '../../popupComponent/PopupComponent'
import instance from '../../../services/axiosInstance';
import { API } from '../../../config/config';
import authHeader from '../../../services/auth-header';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { CustomToast } from '../../divami_components/custom-toaster/CustomToast';

const createMeasurement = async ({ name = '', type = '', snapshot = '', context = {}, data = [] , setLoading, setShow , setSelected}: {name?: string ,type?: string, snapshot?: string, context?: object, data?:{position?: object}[] , setLoading: React.Dispatch<React.SetStateAction<boolean>>,setShow: (v: boolean) => void, setSelected: Dispatch<SetStateAction<string>>}) => {
  const formatData = data.map((single)=>(single.position))
  try{
    setLoading(true)
  const resp =  await instance.post(
    `${API.BASE_URL}/measurements`,
    {
      name,
      type,
      snapshot,
      context,
      data: formatData,
    },
    {
      headers: authHeader.authHeader(),
    },
  );
  CustomToast('Created Sucessfully!',"success");
  setSelected(resp?.data?.result?._id || '');
  setShow(false);
  }catch{
    CustomToast('Failed to Create Measurement!',"error");
  }finally{
    setLoading(false)
  }
};

const ConfirmModal = ({show = false, setShow =()=>{}, measurement ={}, onCancel=()=>{}, refetch =()=>{}, setLoading=()=>{} , loading=false, setSelected =()=>{}, apiPoints= []}: {setShow?: Dispatch<SetStateAction<boolean>>, show?: boolean, measurement: {name?: string; points?: object[]; uuid?: string}; onCancel: Function, refetch: Function, setLoading: Dispatch<SetStateAction<boolean>>, loading?: boolean ,setSelected?: Dispatch<SetStateAction<string>>, apiPoints: {name: string}[]}) => {
    const router = useRouter();
    const snapshot = router.query.snap as string;
    const [name, setName] = useState('');
    const content = (
        <div className='flex ml-2.5'>
            <TextField color='warning' 
            label='Name' 
            type='small'
            fullWidth 
            value={name}
            onChange={(e) => setName(e.target.value) } />
        </div>)

        useEffect(()=>{
          setName(measurement.name || '')
        },[measurement])
        
  return (
    <div>
        <PopupComponent
          open={show}
          hideButtons
          setShowPopUp={setShow}
          modalTitle={"Save Measurement"}
          modalContent={content}
          modalmessage={""}
          primaryButtonLabel={"Confirm"}
          SecondaryButtonlabel={"Cancel"}
          disableSecondaryButton={loading}
          disablePrimaryButton={loading}
          callBackvalue={async () =>{
            const isNameExists = apiPoints.find((point)=> (point.name === name?.trim()) );
            if(isNameExists){
              toast.error("Name Already Exists Please Choose a Different Name");
              return;
            }
            await createMeasurement({ name: name , type: measurement?.name, snapshot, data: measurement?.points, setLoading, setShow , setSelected});
            refetch();
          }}
          secondaryCallback={onCancel}
        />
    </div>
  )
}

export default ConfirmModal