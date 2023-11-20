import _ from "lodash";
import { IUploadFile, UploadStatus, UploadType } from "../../../models/IUploader";
interface fileInfo{ status: string; fileName: string;errorMessage?:string }
self.onmessage = async (event: MessageEvent<IUploadFile<UploadType>[]>) => {
    console.log("TestingUploader: inside worker manager ", event, event.data);
    const filesList = event.data
    const completedFileList: IUploadFile<UploadType>[] = []
    if(filesList?.length===0) {
        return;
    }
    
    for (let i = 0; i < filesList?.length; i++) {
        const worker = new Worker(new URL('./fileUploaderWorker.ts',import.meta.url));
        worker.postMessage(filesList[i]);
        worker.onmessage = (event) => {
            console.log("TestingUploader: inside worker manager on message", event);
            const { status, id, fileName,errorMessage } = event.data;
            let file = filesList.find((e) => { return e.uploadObject._id === id})
            if (file) {
                file.status = status
                file.error = errorMessage
                file.progress.value = status === UploadStatus.success ? 100 : 0
                completedFileList.push(file)
                self.postMessage({filesList, completedFileList})
            
            }
            worker.terminate();
        };    
    }
    self.postMessage({filesList,completedFileList})
     
}