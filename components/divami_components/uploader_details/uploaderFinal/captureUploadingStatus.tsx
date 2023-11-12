import React from 'react'
import { useUploaderContext } from '../../../../state/uploaderState/context';
interface Iprops{
    isUploading:boolean,
    isUploadedOn:boolean,
    buttonName:string
}
const CaptureUploadingStatus:React.FC<Iprops>=({isUploading,isUploadedOn,buttonName})=>{
    const { state: uploaderState, uploaderContextAction } = useUploaderContext();
    const { uploaderAction } = uploaderContextAction;

    
    /**
     * If isUploading true case, get data from uploaderState.pendingUploadJobs
     * If isUploading false case, get data from uploaderState.pendingProcessJobs
     * populate this data in table tr
     */
    const data = isUploading ? uploaderState.pendingUploadJobs : uploaderState.pendingProcessJobs


return(
<React.Fragment>
<div className="overflow-y-scroll shadow">
    <table className='w-[100%]'>
        <thead className='text-justify'>
        <tr className="border-b border-b-[#F1742E]">
        <th className="pl-2 py-2">{isUploadedOn&&<input type='checkbox'/>}
        <span className='ml-2'>Level</span></th>
        <th className="pl-2">Capture Date</th>
        {
        isUploading&&<th>Uploading</th>
        }
        {
        isUploadedOn&&<th>Uploaded On</th>
        }
        </tr>
        </thead> 
        <tbody className='text-justify'> 
        <tr>
            <td className="pl-2">
            {`prroject > Tower > Level1`}
            </td>
            <td className="pl-2">
           {`2023 oct 1`}
           </td>
           {isUploading&&
             <td>
           {`10/1000 files`}
            </td>
            }
            {isUploadedOn&&
             <td>
           {`2023 oct 6 12:30 hrs`}
            </td>
            }
        </tr>
        
    </tbody>
   </table>
   <div className='text-center my-[20px]'>
    <button className='bg-[#F1742E] py-2 pl-[7px] pr-[8px] rounded-[8px] font-semibold text-white'
    onClick={()=> {
        if(isUploading) {
            uploaderAction.startNewUpload();
        } else {
            // call process api once available based on check box
        }
        
    }}
    >
    {buttonName}
    </button>
   </div>
   </div> 
</React.Fragment>
)
}
export default CaptureUploadingStatus