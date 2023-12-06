import React, { useEffect, useState } from "react";
import CaptureUploadingStatus from "./captureUploadingStatus";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import FileNameListing from "../../fileListing/fileNameListing";
import FileStatus from "../../fileListing/fileStatus";
import { IJobs, JobStatus } from "../../../../models/IJobs";
import { IStructure } from "../../../../models/IStructure";
import { getCaptureIdFromModelOrString, getPathToRoot, getStructureIdFromModelOrString } from "../../../../utils/utils";
import { useAppContext } from "../../../../state/appState/context";
import { UploadStatus } from "../../../../models/IUploader";
import CircularProgress from '@mui/material/CircularProgress';
import { updateJobStatus } from "../../../../services/jobs";
import PopupComponent from "../../../popupComponent/PopupComponent";
interface fileData {
  status: UploadStatus;
  fileName: string;
}
const UploaderFinal: React.FC = () => {
  const { state: appState, appContextAction } = useAppContext();
  const { appAction } = appContextAction;
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);
  const[isCustomLoader,setCustomLoader]=useState<boolean>(false);
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
       setCustomLoader(false) 
        let fileList: fileData[] = uploaderState.inProgressWorkers[selectedCaptureId].map((e) => {
          return {
            fileName: e.uploadObject.filename,
            status: e.status
          }
        })
        setFileProgressList(fileList)
      } 
      else if(uploaderState.rawImagesMap[selectedCaptureId]) {
       setCustomLoader(false) 
        let rawImages = uploaderState.rawImagesMap[selectedCaptureId]
        let fileList: fileData[] = rawImages?.map((e) => {   
          return {
            fileName: e.filename,
            status: getFileStatus(e?.status)
          }
        })
        setFileProgressList(fileList)
      }
      else{
       setCustomLoader(true) 
       return
      }
      if(uploaderState.selectedJob.status === JobStatus.uploadFailed)
      {
        setIsShowPopUp(true)
      }
    }
  }, [uploaderState.selectedJob,uploaderState.inProgressWorkers,uploaderState.rawImagesMap])

  const handleRowClick = (job: IJobs, index: number) => {
    //  setSelectedRow(index);
     uploaderAction.setSelectedJob(job);
  };
  const gethierarchyPath = (structure: string | IStructure): string => {
    let structureId = getStructureIdFromModelOrString(structure)

    if (appState.currentProjectData && appState.currentProjectData.hierarchy) {
      return getPathToRoot(structureId, appState.currentProjectData.hierarchy[0]);
    } else {
      return "";
    }
  };
  const updateJobStatusUploadCompleteWithErrors = () => {
    let ignoreImagesCheck = true;
    updateJobStatus(
      uploaderState.selectedJob?.project as string,
      uploaderState.selectedJob?._id as string,
      JobStatus.uploaded,
      ignoreImagesCheck
    )
      .then((response) => {
        if (response.data.success === true) {
          let updatedJob = response.data.result
          let captureJobs = uploaderState.pendingProcessJobs.concat(
            uploaderState.pendingUploadJobs
          );
          captureJobs.forEach((job) => {
            if (job._id === updatedJob._id) {
              job.status = JobStatus.uploaded;
            }
          });
          uploaderAction.setCaptureJobs(captureJobs);
          appAction.removeCaptureUpload(updatedJob)
          uploaderAction.removeWorker(getCaptureIdFromModelOrString(updatedJob.captures[0]));
        }
      })
      .catch((error) => {});
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
        { uploaderState.selectedJob && (
        <div className="w-[30%] h-[280px]   ml-[30px] mt-2  overflow-x-hidden bg-[#FFECE2] rounded-3xl overflow-y-auto"         style={{ boxShadow: " 0px 4px 4px 0px #00000040" }}>
          <div className=" mt-2 ml-[30px] font-open-sans italic font-normal text-base leading-5 text-black">
                      Uploading progress for{" "}
                      <span className="font-bold not-italic">
                      { gethierarchyPath(uploaderState.selectedJob?.structure)}
                      </span>{" "}
                    </div>
            {isCustomLoader?<div className="flex justify-center items-center h-1/2"><CircularProgress  color="warning" size={"28px"} thickness={5}></CircularProgress></div> :fileProgressList &&
              fileProgressList.length > 0 &&
              fileProgressList.map((fileProgressObj: fileData) => {
                return (
                    <div key={fileProgressObj.fileName} className="flex w-full justify-between items-center my-[8px]" >
                      <div className="  ml-[30px]  ">
                        <FileNameListing fileName={fileProgressObj.fileName} />
                      </div>
                      <div className=" w-[100px]">
                        <FileStatus status={fileProgressObj.status} />
                      </div>
                    </div>
                 
                );
              })}
          </div>
        )}
        <PopupComponent
      open={isShowPopUp}
      setShowPopUp={setIsShowPopUp}
      modalTitle={'Upload complete with errors'}
      modalmessage={''}
      primaryButtonLabel={'Skip Files and Complete'}
      SecondaryButtonlabel={''}
      isUploaderFinal={false}
      callBackvalue={() => {
        setIsShowPopUp(false)
        updateJobStatusUploadCompleteWithErrors()
      }}
    />
      </div>
    </React.Fragment>
  );
};
export default UploaderFinal;
