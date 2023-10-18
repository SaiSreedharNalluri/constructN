import _ from "lodash";
import { getPutSignedUrl } from "../../../services/s3Service";
interface fileInfo{ status: string; fileName: string; }
self.onmessage = async (event) => {
    let userFileList: fileInfo[]=[]
    let uploadedFileList:fileInfo[]=[]
    const filesLsit = event.data.selectedFile
    if(filesLsit?.length===0)
    {
        return
    }
    for (let i = 0; i < filesLsit?.length; i++) {
        userFileList.push({status: 'progress',fileName:filesLsit[i]?.name})
        self.postMessage({userFileList,uploadedFileList})
       getPutSignedUrl(`uploader/${filesLsit[i]?.name}`,event.data.authToken).then((response)=>{
            if(response.success===true)
            {
                const worker = new Worker(new URL('./fileUploaderWorker.ts',import.meta.url));
                worker.postMessage({file:filesLsit[i],url:response.result[0]});
                worker.onmessage = (event) => {
                    const { status, fileName } = event.data;
                    var index = _.findIndex(userFileList, {fileName:fileName});
                    userFileList.splice(index, 1, {fileName: fileName, status:status});
                    uploadedFileList.push({fileName: fileName, status:status})
                    self.postMessage({userFileList,uploadedFileList})
                    self.postMessage({ status: 'done',fileName:fileName});
                      // Handle completion
                      worker.terminate();
                    
                  };
            }
        })
        
      }
     
}