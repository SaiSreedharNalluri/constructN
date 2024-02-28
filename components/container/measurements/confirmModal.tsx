import { TextField } from '@mui/material'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import PopupComponent from '../../popupComponent/PopupComponent'
import instance from '../../../services/axiosInstance';
import { API } from '../../../config/config';
import authHeader from '../../../services/auth-header';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { CustomToast } from '../../divami_components/custom-toaster/CustomToast';
import { getCookie } from 'cookies-next';
import ShortUniqueId  from 'short-unique-id';
import { IAssetCategory } from '../../../models/IAssetCategory';
import AssetCategoryPicker from '../../progress-2d/asset-category-picker';
// import { useParams } from 'next/navigation';

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

// const createAsset = (asset: any, date: string = '2000-01-01T00:00:00.000Z') => {

//   const formatData = asset.points?.map((single: { position: object })=>(single.position));

//   try {

//       return instance.post(`${API.PROGRESS_2D_URL}/assets?date=${date}`, { ...asset, points: formatData }, { headers: authHeader.authHeader() })

//   } catch (error) { throw error }

// }

interface Props {
  setShow?: Dispatch<SetStateAction<boolean>>,
  show?: boolean,
  measurement: {name?: string; points?: object[]; uuid?: string};
  onCancel: Function,setActiveMeasure: Dispatch<SetStateAction<"" | { name: string }>>,refetch: Function, 
  setLoading: Dispatch<SetStateAction<boolean>>,
  loading?: boolean ,
  setSelected?: Dispatch<SetStateAction<string>>,
  apiPoints: {name: string}[] ,
  getContext: Function,
  setMeasurementType: Function,
  selectedCategory:  IAssetCategory | undefined ,
  assetCategories:  IAssetCategory[] ,
}

const ConfirmModal = ({show = false, setShow =()=>{}, measurement ={}, onCancel=()=>{}, setMeasurementType=()=>{}, refetch =()=>{}, setLoading=()=>{} , getContext=()=>{}, setActiveMeasure =()=>{}, loading=false, setSelected =()=>{}, apiPoints= [], selectedCategory = undefined, assetCategories =[]}: Props) => {
    const userObj: any = getCookie('user');
    const user = JSON.parse(userObj);
    // const params = useParams();
    const router = useRouter();
    const snapshot = router.query.snap as string;
    // const structureId = router.query.structId as string;
    const [name, setName] = useState('');
    const [category, setCategory]= useState<IAssetCategory | undefined>(selectedCategory);

    const _onCategorySelected = (categ: IAssetCategory | undefined) =>(setCategory(categ));

    const content = (
        <div className='flex ml-2.5 flex-col'>
            <TextField color='warning' 
            label='Name' 
            type='small'
            fullWidth 
            value={name}
            onChange={(e) => setName(e.target.value) } />
            {user?.isSupportUser ? <div className='mt-3 w-fit'>
                  <AssetCategoryPicker selected={category} categories={[...(assetCategories || []), { name: 'None', _id: '', project: '', stages : [], shape: 'Polgon', height: 0, width: 0, properties: ''}]} onSelect={_onCategorySelected} /> 
              </div>: null}
        </div>)

        useEffect(()=>{
          const uid = new ShortUniqueId({ length: 10, dictionary: 'alphanum_upper' });
          setName((measurement.name === "Distance" ? "Length" : measurement.name || '') + `-${uid.rnd()}`);
        },[])
        
    const callBack = async () =>{
      const isNameExists = apiPoints.find((point)=> (point.name === name?.trim()) );
      if(isNameExists){
        toast.error("Name Already Exists Please Choose a Different Name");
        return;
      }
      // if(category){

      //   await createAsset({

      //     name: `${name}`,
        
      //     structure: structureId,
        
      //     project: params["projId"] as string,
        
      //     category: category._id,
        
      //     shape: "Polygon",
        
      //     points: measurement?.points
        
      //   });
        
      // }else{
      await createMeasurement({ name: name , type: measurement?.name, snapshot, data: measurement?.points, setLoading, setShow , setSelected, context : { ...(getContext() || {}), createdBy: user._id, ...( category?._id ? { category: category?._id }: {}) } });
      // }
      setActiveMeasure('');
      setMeasurementType('');
      refetch();
    }
  return (
    <div onKeyDown={(e)=>{
      e.stopPropagation();
      if(e.key === 'Enter'){
        callBack();
      }
    }}>
        <PopupComponent
          open={show}
          hideButtons
          setShowPopUp={setShow}
          modalTitle={"Save Measurement"}
          modalContent={content}
          modalmessage={""}
          primaryButtonLabel={"Confirm"}
          SecondaryButtonlabel={"Cancel"}
          disableSecondaryButton={!name?.trim() || loading}
          disablePrimaryButton={!name?.trim() || loading}
          callBackvalue={callBack}
          secondaryCallback={onCancel}
        />
    </div>
  )
}

export default ConfirmModal