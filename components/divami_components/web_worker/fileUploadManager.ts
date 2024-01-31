import _ from "lodash";
import { IUploadFile, UploadStatus, UploadType } from "../../../models/IUploader";
import axios from "axios";
import { API } from "../../../config/config";
interface eventType
{ headerValue: {
    Authorization: string;
}; 
uploadFiles:IUploadFile<UploadType>[] 
}
self.onmessage = async (event: MessageEvent<eventType>) => {
    const filesList = event.data.uploadFiles
    let completedFileList: IUploadFile<UploadType>[] =  filesList.filter((fileObj)=>fileObj.status === 1)
    if(filesList?.length===0) {
        return;
    }
    let currentTask = 0
    completedFileList = filesList.filter((fileObj)=>fileObj.status === 1)
    for (currentTask = 0; currentTask < Math.min(5, filesList.length); currentTask++) {
         uploadTask(currentTask);    
    }
    self.postMessage({filesList,completedFileList})
     

    async function uploadTask(i: number) {
        if(filesList[i].status != 1)
        { 
            if(filesList[i].status === 2)
            {
                filesList[i].status = 0
            }
            await axios.put( `${API.BASE_URL}/rawimages/${filesList[i].uploadObject._id}`,{status: 'Started'}, {
                headers: event.data.headerValue,
              }).then((response) => {
                return response.data;
              })
              .catch((error) => {
                return error.response;
              });
            const worker = new Worker(new URL('./fileUploaderWorker.ts', import.meta.url));
            worker.postMessage(filesList[i]);
            worker.onmessage = (event) => {
                const { status, id, errorMessage } = event.data;
                let file = filesList.find((e) => { return e.uploadObject._id === id; });
                if (file) {
                    file.status = status;
                    file.error = errorMessage;
                    file.progress.value = status === UploadStatus.success ? 100 : 0;
                    completedFileList.push(file);
                    self.postMessage({ filesList, completedFileList });
    
                }
                if(currentTask < filesList.length) uploadTask(currentTask++)
                worker.terminate();
            };
        }
        
    }
}