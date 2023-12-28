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
import { UploaderPopups } from "../../../../state/uploaderState/state";
interface fileData {
  status: UploadStatus;
  fileName: string;
}
const UploaderFinal: React.FC = () => {
  const { state: appState, appContextAction } = useAppContext();
  const { appAction } = appContextAction;
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);
  const[isCustomLoader,setCustomLoader]=useState<boolean>(false);
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
        showSelectedJobPopup(uploaderState.selectedJob, fileList)
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
        showSelectedJobPopup(uploaderState.selectedJob, fileList)
      }
      else{
       setCustomLoader(true) 
       return
      }
    }
  }, [uploaderState.selectedJob,uploaderState.rawImagesMap])

  useEffect(() => {
    if(uploaderState.selectedJob && uploaderState.isDelete) {
      showSelectedJobPopup(uploaderState.selectedJob, fileProgressList)
    }
  }, [uploaderState.isDelete])

  const showSelectedJobPopup = (selectedJob: IJobs, fileList: fileData[]) => {
    if (selectedJob.status === JobStatus.uploadFailed) {
      if (uploaderState.isDelete) {
        uploaderAction.setIsShowPopup({
          isShowPopup: true, 
          popupType: UploaderPopups.deleteJob, 
        })
      } else {
        uploaderAction.setIsShowPopup({
          isShowPopup: true, 
          popupType: UploaderPopups.completedWithError, 
          message: `${fileList.filter(obj => obj.status === 2).length} of ${fileList.length} file(s) failed to upload`
        })
      }

    }
  }
  const handleRowClick = (job: IJobs, index: number) => {
    //  setSelectedRow(index);
    if (uploaderState.selectedJob?._id === job._id && isCustomLoader == false) {
      showSelectedJobPopup(uploaderState.selectedJob, fileProgressList)
    }
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
              {/* <div>
                {
                  uploaderState?.pendingProcessJobs?.length> 0 && <CaptureUploadingStatus
                  isUploadedOn={true}
                  isUploading={false}
                  buttonName="Process"
                  button=""
                  onRowClick={handleRowClick}
                />
                }
               </div> */}
         </div>
        { uploaderState.selectedJob && (
        <div className="w-[30%] calc-h130 ml-[30px] overflow-x-hidden bg-[#FFECE2] rounded-3xl overflow-y-auto" style={{ boxShadow: " 0px 4px 4px 0px #00000040" }}>
          <div className=" mt-2 ml-[30px] font-open-sans italic font-normal text-base leading-5 text-black sticky top-0 bg-[#FFECE2]">
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
                      <div className="ml-[30px]">
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
       
      </div>
    </React.Fragment>
  );
};
export default UploaderFinal;
