import React, { useEffect, useState } from 'react'
import CaptureUploadingStatus from './captureUploadingStatus'
import { useUploaderContext } from '../../../../state/uploaderState/context';
import { WebWorkerManager } from '../../../../utils/webWorkerManager';
import FileNameListing from '../../fileListing/fileNameListing';
import FileStatus from '../../fileListing/fileStatus';
import { getjobs } from '../../../../services/jobs';

interface fileData{ status: string, fileName: string; }
const UploaderFinal:React.FC =()=>{
const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const[captureList,setCaptureList]=useState<any>()
  useEffect(()=>{
    getjobs(uploaderState.project?._id as string).then((response)=>{
    setCaptureList(response.result)
    }).catch(()=>{

    })
  },[])
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);
  const workerManager = WebWorkerManager.getInstance()
  useEffect(()=>{
    
    
    if (workerManager && workerManager.getWorker() && Object.keys(workerManager.getWorker())?.length > 0)
    {
      for(let key of Object.keys(workerManager.getWorker()))
      {
        workerManager.getWorker()[key].onmessage = (event) => {
          console.log("event.data",event.data)
          setFileProgressList(event.data.userFileList);
        }
      }
    }
  },[Object.keys(workerManager.getWorker())?.length])
 
    return(
    <React.Fragment>
         <div className='flex w-[100%] mt-[100px]'>
           <div className='w-[60%]  bg-orange-100 rounded-2xl h-10'>
            <CaptureUploadingStatus isUploadedOn={false} isUploading={true} buttonName='+ Start a new upload'/>
            </div>
          <div className='ml-[10px] w-[40%] bg-orange-100 rounded-2xl  overflow-y-visible '>
            {
              fileProgressList &&fileProgressList.length>0&& fileProgressList.map((fileProgressObj:fileData)=>{
                 return(
                 <div className='flex '>
                  <div className='ml-[20px] mt-2 w-40'>
                    <FileNameListing fileName={fileProgressObj.fileName}/>
                  </div>
                  <div className='w-40 mt-3'>
                    <FileStatus status={fileProgressObj.status }/>
                  </div>
                 </div>)
              })
            }
            
          </div>
        </div>
        <div className='w-[60%] mt-[50px]'>
        <CaptureUploadingStatus isUploadedOn={true} isUploading={false} buttonName='Process' />
        </div>
    
    </React.Fragment>)

}
export default UploaderFinal