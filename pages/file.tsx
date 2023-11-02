import { useRouter } from 'next/router';
import React, {useState } from 'react';
import authHeader from '../services/auth-header';
import { WebWorkerManager } from '../utils/webWorkerManager';
import Header from '../components/divami_components/header/Header';
import SidePanelMenu from '../components/divami_components/side-panel/SidePanel';
import FileUploader from '../components/divami_components/uploaderFIle/chooseUploaderFile';
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
  const startUpload = (acceptedFiles:any) => {
    if (selectedFile) {
      console.log('dcvsgds',acceptedFiles)
     // setSelectedFile([])
      const worker = new Worker(new URL('../components/divami_components/web_worker/fileUploadManager.ts',import.meta.url));
      let authToken =authHeader.getAuthToken()
      worker.postMessage({acceptedFiles,authToken});
      worker.onmessage = (event) => {
        console.log('event',event.data)
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
  console.log('selectedFile',selectedFile)
  return (
  <div>
    <Header/>
    <div className="flex w-screen fixed">
    <div>
    <SidePanelMenu onChangeData={() => {}} />
    </div> 
    <FileUploader isAppend={isAppend}selectedFile={selectedFile}setSelectedFile={setSelectedFile}/>
    </div>        

</div>


    
  );
};

export default MyComponent;
