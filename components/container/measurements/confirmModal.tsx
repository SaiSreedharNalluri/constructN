import { TextField } from '@mui/material'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import PopupComponent from '../../popupComponent/PopupComponent'
import instance from '../../../services/axiosInstance';
import { API } from '../../../config/config';
import authHeader from '../../../services/auth-header';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';

const createMeasurement = async ({ name = '', type = '', snapshot = '', context = {}, data = [] , setLoading, setShow , setSelected}: {name?: string ,type?: string, snapshot?: string, context?: object, data?:{position?: object}[] , setLoading: React.Dispatch<React.SetStateAction<boolean>>,setShow: (v: boolean) => void, setSelected?: Dispatch<SetStateAction<string>>}) => {
  const formatData = data.map((single)=>(single.position))
  try{
    setLoading(true)
  const resp =  await instance.post(
    `${API.STAGE_URL}/measurements`,
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
  toast.success('Created Sucessfully!', { autoClose: 5000 });
  setSelected(resp?.data?.result?._id || '');
  setShow(false);
  }catch{
    toast.error('Failed to Create Measurement!', { autoClose: 5000 });
  }finally{
    setLoading(false)
  }
};

const ConfirmModal = ({show = false, setShow =()=>{}, measurement ={}, onCancel=()=>{}, refetch =()=>{}, setLoading=()=>{} , loading=false, setSelected =()=>{}}: {setShow?: Dispatch<SetStateAction<boolean>>, show?: boolean, measurement: {name?: string; points?: object[]; uuid?: string}; onCancel: Function,refetch: Function, setLoading: Function, loading?: boolean ,setSelected?: Dispatch<SetStateAction<string>>}) => {
    const router = useRouter();
    const snapshot = router.query.snap as string;
    const [name, setName] = useState('');
    const content = (
        <div className='flex ml-2.5 w-80'>
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
            await createMeasurement({ name: name , type: measurement?.name, snapshot, data: measurement?.points, setLoading, setShow , setSelected});
            refetch();
          }}
          secondaryCallback={onCancel}
        />
    </div>
  )
}

export default ConfirmModal