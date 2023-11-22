import React, { useEffect, useState } from "react";
import CaptureUploadingStatus from "./captureUploadingStatus";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import FileNameListing from "../../fileListing/fileNameListing";
import FileStatus from "../../fileListing/fileStatus";
import { IJobs } from "../../../../models/IJobs";
import { IStructure } from "../../../../models/IStructure";
import { getCaptureIdFromModelOrString, getPathToRoot } from "../../../../utils/utils";
import { useAppContext } from "../../../../state/appState/context";
import { UploadStatus } from "../../../../models/IUploader";
interface fileData {
  status: UploadStatus;
  fileName: string;
}
const UploaderFinal: React.FC = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);
  const { state: appState, appContextAction } = useAppContext();
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
    const getFileStatus=(rawImageStatus:string)=>{

      switch(rawImageStatus)
      {
        case 'Uploaded':
        return UploadStatus.success
        case 'Initiated':
          return UploadStatus.inProgress
        case 'FailedTimedOut':
          return UploadStatus.failed 
        default:
            return UploadStatus.inProgress; 
      }
    }
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
      } else {
        let rawImages = uploaderState.rawImagesMap[selectedCaptureId]
        let fileList: fileData[] = rawImages?.map((e) => {
          return {
            fileName: e.filename,
            status: getFileStatus(e?.status)
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
      <div className="flex ml-[30px] mt-[15px] calc-w">
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
                {
                  uploaderState?.pendingProcessJobs?.length> 0 && <CaptureUploadingStatus
                  isUploadedOn={true}
                  isUploading={false}
                  buttonName="Process"
                  button=""
                  onRowClick={handleRowClick}
                />
                }
               </div>
         </div>
        { uploaderState.selectedJob && uploaderState.stepperSideFileList && (
        <div className="w-[30%] h-[280px]   ml-[30px] mt-2  overflow-x-hidden bg-[#FFECE2] rounded-3xl overflow-y-auto">
          <div className=" mt-2 ml-[30px] font-open-sans italic font-normal text-base leading-5 text-black">
                      Uploading progress for{" "}
                      <span className="font-bold not-italic">
                      { gethierarchyPath(uploaderState.selectedJob?.structure)}
                      </span>{" "}
                    </div>
            {fileProgressList &&
              fileProgressList.length > 0 &&
              fileProgressList.map((fileProgressObj: fileData) => {
                return (
                    <div key={fileProgressObj.fileName} className="flex w-full justify-between items-center" >
                      <div className="  ml-[30px] my-[20px] ">
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
