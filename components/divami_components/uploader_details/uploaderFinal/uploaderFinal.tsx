import React, { useEffect, useState } from "react";
import CaptureUploadingStatus from "./captureUploadingStatus";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { WebWorkerManager } from "../../../../utils/webWorkerManager";
import FileNameListing from "../../fileListing/fileNameListing";
import FileStatus from "../../fileListing/fileStatus";
import { getjobs } from "../../../../services/jobs";
import { IJobs } from "../../../../models/IJobs";
import { IStructure } from "../../../../models/IStructure";
import { getCaptureIdFromModelOrString, getPathToRoot } from "../../../../utils/utils";
import { useAppContext } from "../../../../state/appState/context";
import { UploadStatus } from "../../../../models/IUploader";
import { RawImageStatus } from "../../../../models/IRawImages";

interface fileData {
  status: UploadStatus;
  fileName: string;
}
const UploaderFinal: React.FC = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);
  // const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const { state: appState, appContextAction } = useAppContext();
  const workerManager = WebWorkerManager.getInstance();
   const updateTheJobStatus=(captureId:string)=>{
    console.log('fvdbjkvdfkkl',captureId,uploaderState.pendingUploadJobs)
  let captureObj = uploaderState.pendingUploadJobs.find((jobObj:any)=> jobObj.captures[0]._id as string === captureId)
console.log('fdhjkfdiklfdm',captureObj)
  }
  // useEffect(() => {
  //   if (
  //     workerManager &&
  //     workerManager.getWorker() &&
  //     Object.keys(workerManager.getWorker())?.length > 0
  //   ) {
  //     for (let key of Object.keys(workerManager.getWorker())) {
  //       workerManager.getWorker()[key].onmessage = (event) => {
  //       setFileProgressList(event.data.userFileList);
  //       // if(event?.data?.userFileList?.length != undefined && event?.data?.uploadedFileList?.length !=undefined && (event?.data?.userFileList?.length === event?.data?.uploadedFileList?.length))
  //       // {
  //       //   //console.log('keys',key)
  //       //   updateTheJobStatus(key,)
  //       // }
  //       // };
  //     }
  //   }
  // }, [Object.keys(workerManager.getWorker())?.length]);

  useEffect(() => {
    if(uploaderState.selectedJob) {
      let selectedCaptureId = getCaptureIdFromModelOrString(uploaderState.selectedJob.captures[0])
      if ( uploaderState.inProgressWorkers && uploaderState.inProgressWorkers[selectedCaptureId]) {
        let fileList: fileData[] = uploaderState.inProgressWorkers[selectedCaptureId].map((e) => {
          return {
            fileName: e.uploadObject.filename,
            status: e.status
          }
        })
        setFileProgressList(fileList)
      }
    }
  }, [uploaderState.inProgressWorkers])

  useEffect(() => {
    if(uploaderState.selectedJob) {
      console.log("TestingUploader inside uploader final ", uploaderState.selectedJob)
      let selectedCaptureId = getCaptureIdFromModelOrString(uploaderState.selectedJob.captures[0])
      if ( uploaderState.inProgressWorkers && uploaderState.inProgressWorkers[selectedCaptureId]) {
        console.log("TestingUploader inside uploader final inside if", uploaderState.inProgressWorkers)
        let fileList: fileData[] = uploaderState.inProgressWorkers[selectedCaptureId].map((e) => {
          return {
            fileName: e.uploadObject.filename,
            status: e.status
          }
        })
        setFileProgressList(fileList)
      } else {
        console.log("TestingUploader inside uploader final inside else", uploaderState.rawImagesMap[selectedCaptureId])
        let rawImages = uploaderState.rawImagesMap[selectedCaptureId]
        let fileList: fileData[] = rawImages?.map((e) => {
          return {
            fileName: e.filename,
            status: e.status === RawImageStatus.uploaded ? UploadStatus.success : UploadStatus.inProgress
          }
        })
        setFileProgressList(fileList)
      }
    }
  }, [uploaderState.selectedJob])

  const handleRowClick = (job: IJobs, index: number) => {
    //  setSelectedRow(index);
     uploaderAction.setSelectedJob(job);
  };
  const gethierarchyPath = (structure: string | IStructure): string => {
    let structureId = "";
    if ((structure as IStructure)._id) {
      structureId = (structure as IStructure)._id;
    } else {
      structureId = structure as string;
    }

    if (appState.hierarchy) {
      return getPathToRoot(structureId, appState.hierarchy[0]);
    } else {
      return "";
    }
  };

  return (
    <React.Fragment>
      <div className="flex ml-[6px] mt-[15px] calc-w">
        <div className="flex flex-col w-[70%]">
              <div>
                <CaptureUploadingStatus
                  isUploadedOn={false}
                  isUploading={true}
                  buttonName="+ Start a new upload"
                  button="Start Upload"
                  onRowClick={handleRowClick}
                />
              </div> 

              <div>
                <CaptureUploadingStatus
                  isUploadedOn={true}
                  isUploading={false}
                  buttonName="Process"
                  button=""
                  onRowClick={handleRowClick}
                />
              </div>
         
        </div>
        { uploaderState.selectedJob && (
        <div className="w-[30%] h-[280px]   ml-[30px] mt-2  overflow-x-hidden bg-[#FFECE2] rounded-3xl overflow-y-auto">
          <div className=" mt-2 w-[60%] ml-[30px] font-open-sans italic font-normal text-base leading-5 text-black">
                      Uploading progress for{" "}
                      <span className="font-bold not-italic">
                      { gethierarchyPath(uploaderState.selectedJob?.structure)}
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
        )}
      </div>
    </React.Fragment>
  );
};
export default UploaderFinal;