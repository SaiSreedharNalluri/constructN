import { useRouter } from 'next/router';
import React, { useState } from 'react';
import authHeader from '../services/auth-header';
interface fileData{ status: string, fileName: string; }
const MyComponent = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<any>();
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);

  const startUpload = () => {
    if (selectedFile) {
      const worker = new Worker(new URL('../components/divami_components/web_worker/fileUploadManager.ts',import.meta.url));
      let authToken =authHeader.getAuthToken()
      worker.postMessage({selectedFile,authToken});
      worker.onmessage = (event) => {
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
