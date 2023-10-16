import { useRouter } from 'next/router';
import React, { useState,useEffect } from 'react';
import authHeader from '../services/auth-header';
import { WebWorkerManager } from '../utils/webWorkerManager';
interface fileData{ status: string, fileName: string; }
const MyComponent = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<any>();
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);
 
   const manager = WebWorkerManager.getInstance() 
  if (manager && manager.getWorker && manager.getWorker()['sathya1']) {
    // Set the onmessage handler
    manager.getWorker()['sathya1'].onmessage = (event) => {
      console.log('eventevent1',event.data)
      setFileProgressList(event.data);
    };
  }
   
   
  const startUpload = () => {
    if (selectedFile) {
      const worker = new Worker(new URL('../components/divami_components/web_worker/fileUploadManager.ts',import.meta.url));
      manager.createWorker('sathya1',worker);
      let authToken =authHeader.getAuthToken()
      worker.postMessage({selectedFile,authToken});
      worker.onmessage = (event) => {
        console.log('eventevent2',event.data)
        setFileProgressList(event.data);
        // if (event.data.userFileList[0] === 'progress') {
        // setFileProgressList(event.data);
        // } else if (status === 'done') {
        //   // Handle completion
        //   setFileProgressList(event.data);
        //   worker.terminate();
        // }
      };
    }
  };
  return (
    <div>
      <input type="file"  name="file" multiple 
      onChange={(event:React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files!);
      }}/>
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
     
      {/* <div>Progress: {progress}%</div> */}
    </div>
  );
};

export default MyComponent;
