import _ from "lodash";
import { IUploadFile, UploadStatus, UploadType } from "../../../models/IUploader";
interface fileInfo{ status: string; fileName: string;errorMessage?:string }
self.onmessage = async (event: MessageEvent<IUploadFile<UploadType>[]>) => {
    const filesList = event.data
    const completedFileList: IUploadFile<UploadType>[] = []
    if(filesList?.length===0) {
        return;
    }
    
    let currentTask = 0
    for (currentTask = 0; currentTask < Math.min(5, filesList.length); currentTask++) {
        uploadTask(currentTask);    
    }
    self.postMessage({filesList,completedFileList})
     

    function uploadTask(i: number) {
        const worker = new Worker(new URL('./fileUploaderWorker.ts', import.meta.url));
        worker.postMessage(filesList[i]);
        worker.onmessage = (event) => {
            const { status, id, fileName, errorMessage } = event.data;
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