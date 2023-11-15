import React, { useEffect, useState } from "react";
import CaptureUploadingStatus from "./captureUploadingStatus";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { WebWorkerManager } from "../../../../utils/webWorkerManager";
import FileNameListing from "../../fileListing/fileNameListing";
import FileStatus from "../../fileListing/fileStatus";
import { getjobs, updateJobStatus } from "../../../../services/jobs";
import { IJobs } from "../../../../models/IJobs";

interface fileData {
  status: string;
  fileName: string;
}
const UploaderFinal: React.FC = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);
  const workerManager = WebWorkerManager.getInstance();
   const updateTheJobStatus=(captureId:string)=>{
    console.log('fvdbjkvdfkkl',captureId,uploaderState.pendingUploadJobs)
  let captureObj = uploaderState.pendingUploadJobs.find((jobObj:any)=> jobObj.captures[0]._id as string === captureId)
console.log('fdhjkfdiklfdm',captureObj)
  }
  useEffect(() => {
    if (
      workerManager &&
      workerManager.getWorker() &&
      Object.keys(workerManager.getWorker())?.length > 0
    ) {
      for (let key of Object.keys(workerManager.getWorker())) {
        workerManager.getWorker()[key].onmessage = (event) => {
        setFileProgressList(event.data.userFileList);
        if(event?.data?.userFileList?.length != undefined && event?.data?.uploadedFileList?.length !=undefined && (event?.data?.userFileList?.length === event?.data?.uploadedFileList?.length))
        {
          //console.log('keys',key)
          updateTheJobStatus(key,)
        }
        };
      }
    }
  }, [Object.keys(workerManager.getWorker())?.length]);
console.log('uploadStata',uploaderState)
  return (
    <React.Fragment>
      <div className="flex ml-[6px] mt-[15px] calc-w">
        <div className="flex flex-col w-[70%]">
              <div>
                <CaptureUploadingStatus
                  isUploadedOn={false}
                  isUploading={true}
                  buttonName="+ Start a new upload"
                />
              </div> 

              <div>
                <CaptureUploadingStatus
                  isUploadedOn={true}
                  isUploading={false}
                  buttonName="Process"
                />
              </div>
         
        </div>

        <div className="w-[30%] h-[280px]   ml-[30px] mt-2  overflow-x-hidden bg-[#FFECE2] rounded-3xl overflow-y-auto">
          <div className=" mt-2 w-[60%] ml-[30px] font-open-sans italic font-normal text-base leading-5 text-black">
                      Uploading progress for{" "}
                      <span className="font-bold not-italic">
                        structure name
                      </span>{" "}
                      Expected to complete in 10 mins
                    </div>
            {fileProgressList &&
              fileProgressList.length > 0 &&
              fileProgressList.map((fileProgressObj: fileData) => {
                return (
                    <div key={fileProgressObj.fileName} className="flex w-full justify-between items-center" >
                      <div className="  ml-[30px] mt-[20px] w-[25%] ">
                        <FileNameListing fileName={fileProgressObj.fileName} />
                      </div>
                      <div className="mt-[20px] w-[100px]">
                        <FileStatus status={fileProgressObj.status} />
                      </div>
                    </div>
                 
                );
              })}
          </div>
      </div>
    </React.Fragment>
  );
};
export default UploaderFinal;
