import React from 'react'
import CaptureUploadingStatus from './captureUploadingStatus'
import { useUploaderContext } from '../../../../state/uploaderState/context';

const UploaderFinal:React.FC =()=>{
const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
    return(
    <React.Fragment>
         <div className='flex w-[100%] mt-[100px]'>
           <div className='w-[60%]  bg-orange-100 rounded-2xl'>
            <CaptureUploadingStatus isUploadedOn={false} isUploading={true} buttonName='+ Start a new upload'/>
            </div>
            {
                uploaderState.stepperSideFileList &&
                (
                <div className='ml-[10px] w-[40%] bg-orange-100 rounded-2xl'>
            
                </div>)
            }
            
        </div>
        <div className='w-[60%] mt-[50px]'>
        <CaptureUploadingStatus isUploadedOn={true} isUploading={false} buttonName='Process'/>
        </div>
    
    </React.Fragment>)

}
export default UploaderFinal