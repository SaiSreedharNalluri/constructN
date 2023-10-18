import { useRouter } from 'next/router';
import React, { useState } from 'react';
import authHeader from '../services/auth-header';
import { WebWorkerManager } from '../utils/webWorkerManager';
interface fileData{ status: string, fileName: string; }
const MyComponent = () => {
  const router = useRouter();
  const [isAppend,setIsAppend]=useState(false)
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);
 
 const manager = WebWorkerManager.getInstance() 
  
  if (manager && manager.getWorker && manager.getWorker()['sathya1']) {
    // Set the onmessage handler
      manager.getWorker()['sathya1'].onmessage = (event) => {
      setFileProgressList(event.data);
      if(event?.data?.userFileList?.length != undefined && event?.data?.uploadedFileList?.length !=undefined && (event?.data?.userFileList?.length === event?.data?.uploadedFileList?.length))
      {
        localStorage.setItem('uploaededData',JSON.stringify(event.data.uploadedFileList))
        const evt = new CustomEvent("fileUploader", {detail:event.data.uploadedFileList });
        window.dispatchEvent(evt);
        manager.getWorker()['sathya1'].terminate()
      }
    };
  }
   const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      if(isAppend)
      {
        const files: File[] = Array.from(event.target.files);
        setSelectedFile([...selectedFile, ...files]);
      }
      else{
        const files: File[] = Array.from(event.target.files);
        setSelectedFile(files)
      }
     
    }
  }
  const startUpload = () => {
    if (selectedFile) {
      setSelectedFile([])
      const worker = new Worker(new URL('../components/divami_components/web_worker/fileUploadManager.ts',import.meta.url));
      let authToken =authHeader.getAuthToken()
      worker.postMessage({selectedFile,authToken});
      worker.onmessage = (event) => {
        setFileProgressList(event.data.userFileList);
        if(event?.data?.userFileList?.length != undefined && event?.data?.uploadedFileList?.length !=undefined && (event?.data?.userFileList?.length === event?.data?.uploadedFileList?.length))
        {
          localStorage.setItem('uploaededData',JSON.stringify(event.data.uploadedFileList))
          const evt = new CustomEvent("fileUploader", {detail:event.data.uploadedFileList });
          window.dispatchEvent(evt);
          worker.terminate()
        }
      };
    }
  };
  return (
    <div>
      <input type="file"  name="file" multiple 
      onChange={handleFileChange}/>
      <br/>
      <button onClick={startUpload}>Upload</button>
      <br/>
      <button onClick={()=>{router.push('/projects')}}>Back</button>
      <br/>
      <h1>Uploading Status</h1>
      <div> {fileProgressList?.length>0 && fileProgressList.map((fileObj:fileData)=>{
        return(
          <div key={fileObj.fileName} className='flex w-[40%] justify-between'>
            <span>
              {fileObj.fileName}
            </span>
            <span>
              {fileObj.status}
            </span>
          </div>
        )
        
      })}</div>
     </div>
  );
};

export default MyComponent;
