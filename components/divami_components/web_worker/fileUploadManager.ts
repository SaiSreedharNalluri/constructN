import _ from "lodash";
interface fileInfo{ status: string; fileName: string;errorMessage?:string }
self.onmessage = async (event) => {
    let userFileList: fileInfo[]=[]
    let uploadedFileList:fileInfo[]=[]
    const filesLsit:Array<{ file: File, putSignedURL: string }> = event.data.fileListWithUrl
    if(filesLsit?.length===0)
    {
        return
    }
    for (let i = 0; i < filesLsit?.length; i++) {
        userFileList.push({status: 'progress',fileName:filesLsit[i]?.file.name})
        self.postMessage({userFileList,uploadedFileList})
        const worker = new Worker(new URL('./fileUploaderWorker.ts',import.meta.url));
        
        worker.postMessage({file:filesLsit[i].file,url:filesLsit[i].putSignedURL});
        worker.onmessage = (event) => {
            const { status, fileName,errorMessage } = event.data;
            var index = _.findIndex(userFileList, {fileName:fileName});
            userFileList.splice(index, 1, {fileName: fileName, status:status})
            if(errorMessage!='')
            {
                uploadedFileList.push({fileName: fileName, status:status,errorMessage:errorMessage})
            }
            else{
                uploadedFileList.push({fileName: fileName, status:status})
            };
            
            self.postMessage({userFileList,uploadedFileList})
              worker.terminate();
        };    
      }
     
}