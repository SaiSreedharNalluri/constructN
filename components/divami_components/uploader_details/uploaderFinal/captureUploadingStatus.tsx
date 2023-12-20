import React, { useEffect, useState } from "react";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { TruncatedString, getCaptureIdFromModelOrString, getPathToRoot, getStructureIdFromModelOrString } from "../../../../utils/utils";
import { useAppContext } from "../../../../state/appState/context";
import { TooltipText } from "../../side-panel/SidePanelStyles";
import { IStructure } from "../../../../models/IStructure";
import { IJobs, JobStatus } from "../../../../models/IJobs";
import { updateJobStatus, updateMultipleJobStatus } from "../../../../services/jobs";
import router from "next/router";
 import Image from "next/image";
 import UnChecked from "../../../../public/divami_icons/unchecked.svg";
 import Checked from "../../../../public/divami_icons/checked.svg";
import { getTheProjectDateAndTime, setTheFormatedDate } from "../../../../utils/ViewerDataUtils";
import { ICapture } from "../../../../models/ICapture";
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Delete from "../../../../public/divami_icons/delete.svg";
import PopupComponent from "../../../popupComponent/PopupComponent";
import { UploadStatus, UploaderModalMessage, UploaderModalPrimaryButton, UploaderModalSecondaryButton, UploaderModalTitle } from "../../../../models/IUploader";
interface fileData {
  status: UploadStatus;
  fileName: string;
}
interface Iprops {
  isUploading: boolean;
  isUploadedOn: boolean;
  buttonName: string;
  button: string;
  onRowClick?: (job: IJobs, index: any) => void;
  fileProgressList:fileData[]
}
const CustomCheckbox = ({ checked, onChange }:any) => {
  return (
    <div
      className="custom-checkbox"
      onClick={()=>onChange()}
      style={{ cursor: 'pointer' }}
    >
      {checked ? (
        <Image src={Checked} alt="Checked" />
      ) : (
        <Image src={UnChecked} alt="Unchecked" />
      )}
    </div>
  );
};
const CaptureUploadingStatus: React.FC<Iprops> = ({
  isUploading,
  isUploadedOn,
  buttonName,
  button,
  onRowClick,
  fileProgressList
}) => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { state: appState, appContextAction } = useAppContext();
  const [isDelete,setIsDelete]=useState(false)
  const [modalTitle,setModalTitle] =useState(UploaderModalTitle.UploadCompleteWithErrors)
  const[modalMessage,setModalMessage] =useState<string>(UploaderModalMessage.UploadCompleteWithErrorsModalMessage)
  const [primaryButtonLabel,setPrimaryButtonLabel] = useState(UploaderModalPrimaryButton.UploadCompleteWithErrorsPButton)
  const [secondaryButtonlabel,setSecondaryButtonlabel] =useState(UploaderModalSecondaryButton.UploadCompleteWithErrorsSButton)
  const [jobStatus,setJobStatus] =useState(JobStatus.uploadFailed)
  /**
   * If isUploading true case, get data from uploaderState.pendingUploadJobs
   * If isUploading false case, get data from uploaderState.pendingProcessJobs
   * populate this data in table tr
   */
  const data = isUploading
    ? uploaderState.pendingUploadJobs
    : uploaderState.pendingProcessJobs;
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<boolean[]>(
    Array(data.length).fill(false)
  );
  const [value, setValue] = useState<boolean>(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const handleHeaderCheckboxChange = () => {
    // setValue(true);
    const allSelected = selectedCheckboxes.every((checkbox) => checkbox);
    const newSelection = Array(data.length).fill(!allSelected);
    const anySelected = newSelection.some((checkbox) => checkbox);
    setValue(anySelected);
    setSelectedCheckboxes(newSelection);
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedCheckboxes((prevSelection) => {
      const newSelection = [...prevSelection];
      newSelection[index] = !newSelection[index];
      const anySelected = newSelection.some((checkbox) => checkbox);
      setValue(anySelected);
      return newSelection;
    });
  };
  const gethierarchyPath = (structure: string | IStructure): string => {
    let structureId = getStructureIdFromModelOrString(structure)

    if (appState.currentProjectData && appState.currentProjectData.hierarchy) {
      return getPathToRoot(structureId, appState.currentProjectData.hierarchy[0]);
    } else {
      return "";
    }
  };
  
  const getSelectedStructures = () => {
    const selectedPendingProcess = data.filter(
      (_, index) => selectedCheckboxes[index]
    );
    const jobDetails = selectedPendingProcess.map((job) => ({
      status: JobStatus.readyForProcessing,
      jobId: job._id,
    }));
    uploaderAction.setIsLoading(true)
    updateMultipleJobStatus(router.query.projectId as string, jobDetails).then(
      (response) => {
        uploaderAction.refreshJobs();
        if (response.data.success === true) {
          console.log("console check sucess", response.data.result);
        }
      }
    );
  };
  const getCaptureStatus =(jobStatus:JobStatus)=>{
    switch(jobStatus)
    {
      case JobStatus.uploaded:
      return(<CheckCircleIcon style={{ color: "green" }} />)
      case JobStatus.pendingUpload:
        return (<CircularProgress color="warning" size={"28px"} thickness={5}/>)
      case JobStatus.uploadFailed:
        return (<ErrorIcon color="error" />)
      default:
          return (<CircularProgress color="warning" size={"28px"} thickness={5}/>) 
    } 
  }
  const updateJobStatusBasedOnAction = (deleteJob:boolean) => {
    let ignoreImagesCheck = true;
    uploaderAction.setIsLoading(true);
    updateJobStatus(
      uploaderState.selectedJob?.project as string,
      uploaderState.selectedJob?._id as string,
      deleteJob ? JobStatus.archived : JobStatus.uploaded,
      ignoreImagesCheck
    )
      .then((response) => {
        uploaderAction.setIsLoading(false);
        if (response.data.success === true) {
          let updatedJob = response.data.result
          let captureJobs = uploaderState.pendingProcessJobs.concat(
            uploaderState.pendingUploadJobs
          );
          captureJobs.forEach((job) => {
            if (job._id === updatedJob._id) {
              job.status = updatedJob.status;
            }
          });
          uploaderAction.setCaptureJobs(captureJobs);
          // appAction.removeCaptureUpload(updatedJob)
          // uploaderAction.removeWorker(getCaptureIdFromModelOrString(updatedJob.captures[0]));
        }
      })
      .catch((error) => {
        uploaderAction.setIsLoading(false);
      });
  };
  useEffect(()=>{
  if(!isDelete)
  {
    setModalTitle(UploaderModalTitle.UploadCompleteWithErrors)
    setPrimaryButtonLabel(UploaderModalPrimaryButton.UploadCompleteWithErrorsPButton)
    setSecondaryButtonlabel(UploaderModalSecondaryButton.UploadCompleteWithErrorsSButton)
    setModalMessage(`${fileProgressList.filter(obj => obj.status === 2).length} of ${fileProgressList.length} file(s) failed to upload`)
  }
  },[isDelete,fileProgressList])
  return (
    <React.Fragment>
      <div className="calc-h130 bg-[#FFECE2] rounded-3xl shadow-[0px 4px 4px 0px #00000040]"
       >
        <div className="relative top-[20px]  w-[90%] mx-auto">
                 <div style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        fontStyle: "normal",
                        fontFamily: "Open sans",
                        lineHeight: "20px",
                        color: "#101f4c",
                        marginLeft:"14px"
          }}>
          {isUploading?<p>Uploads In Progress</p>: <p >Pending Processing </p> }  
          </div>
          <div className="overflow-x-hidden h-full mt-[12px]" style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        fontStyle: "normal",
                        fontFamily: "Open sans",
                        marginLeft: "8px",
                        lineHeight: "20px",
                        color: "#101f4c",
          }}>
            {
              data.length > 0 ?(<table className="w-full">
              <thead
                className={`text-jusitfy sticky top-0 ${
                  isUploadedOn ? "bg-white" : "bg-[#FFECE2]"
                } w-full`}
              >
                <tr className="w-full flex justify-between border-b border-b-[#F1742E] mx-auto">
                  <th className="ml-[8px] py-[2px] text-left w-[35%]  flex items-center">
                    {isUploadedOn && (
                <CustomCheckbox
                checked={
                  selectedCheckboxes.every((checkbox) => checkbox) &&
                  value
                }
                onChange={handleHeaderCheckboxChange}
               />
                    )}
                    <span className="ml-[8px]">
                      Level
                    </span>
                  </th>
                  <th
                    className=" text-left w-[18%]">
                    Capture Date
                  </th>
                  <th
                      className="pl-2 text-left w-[18%]"
                    >
                      Uploaded Date
                    </th>
                 
                      <><th
                          className="pl-2 text-left w-[9%]"
                        >

                        </th>
                        <th
                          className="pl-2 text-left w-[9%]"
                        >

                        </th></>
            </tr>
              </thead>
              <tbody
                className="bg-grey-light flex flex-col items-center  overflow-y-auto w-full"
              >
                {data.map((job, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      if (isUploading && onRowClick) {
                        onRowClick(job as IJobs, index);
                        if(uploaderState?.selectedJob && uploaderState?.selectedJob.status === JobStatus.uploadFailed)
                        {
                          setIsShowPopUp(true)
                         
                        }
                      }
                    }}
                    className={`cursor-${isUploading ? "pointer" : "default"} ${
                      index === hoveredRowIndex ? "bg-gray-200" : ""
                    }  ${uploaderState.selectedJob?._id===job._id?"bg-[#D9D9D9] text-[#F1742E]":""} flex justify-between w-full my-[4px] mx-auto`}
                    onMouseEnter={() => setHoveredRowIndex(index)}
                    onMouseLeave={() => setHoveredRowIndex(null)}
                  >
                    <td className="pl-2 w-[35%]  flex items-center">
                      {isUploadedOn && (
                             <CustomCheckbox
                             checked={selectedCheckboxes[index]}
                             onChange={() => handleCheckboxChange(index)}
                           />
                      )}
                      <TooltipText
                        title={
                          gethierarchyPath(job.structure).length > 40
                            ? gethierarchyPath(job.structure)
                            : ""
                        }
                        placement="right"
                      >
                        <span
                        className="ml-[8px]"
                        >
                          <TruncatedString
                            text={gethierarchyPath(job.structure)}
                            maxLength={40}
                            suffixLength={40}
                          />
                        </span>
                      </TooltipText>
                    </td>
                    <td
                      className="pl-2 w-[18%] flex items-center"
                    >
                     {
                      job.captures && job.captures.length > 0 && typeof job.captures[0] != 'string' ? (
                        <div>
                          {setTheFormatedDate((job.captures[0] as ICapture).captureDateTime)}
                        </div>
                      ) : ('-')
                    }
                    </td>
                    <td
                      className="pl-2 w-[18%] flex items-center"
                    >
                      {getTheProjectDateAndTime(job.updatedAt)}
                    </td>
                    <td
                        className="pl-2 w-[9%] flex items-center"
                      >
                        {getCaptureStatus(job.status)}
                      </td>
                    <td
                        className="pl-2 w-[9%] flex items-center"
                    >
                      {
                        job.status === JobStatus.uploadFailed &&(<Image src={Delete} alt={""} onClick={(e)=>{
                          e.stopPropagation()
                          setIsDelete(true)
                          setModalTitle(UploaderModalTitle.uploadDeleteJob)
                          setModalMessage(UploaderModalMessage.uploadDeleteJob)
                          setPrimaryButtonLabel(UploaderModalPrimaryButton.uploadDeleteJobPButton)
                          setSecondaryButtonlabel(UploaderModalSecondaryButton.uploadDeleteJobSButton)
                          setIsShowPopUp(true)
                          }}/>)
                      }
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>):(<p className="h-full flex justify-center items-center">No jobs in progress! 
                Ready to begin a new upload ? Click the button below to get started.</p>)
            }
            </div>
          <div className="text-center mt-[10px]">
            <button
              className={`py-2 pl-[7px] pr-[8px] rounded-[8px] font-semibold text-white ${
                isUploadedOn && !value ? "bg-gray-400" : "bg-[#F1742E]"
              }`}
              onClick={() => {
                if (isUploading) {
                    // stubToUpdateStatus(); Only for clearing testing and  debug data
                  uploaderAction.startNewUpload();
                } else {
                  getSelectedStructures();
                }
              }}
              disabled={isUploadedOn && !value}
            >
              {buttonName}
            </button>
          </div>
        </div>
        <PopupComponent
      open={isShowPopUp}
      setShowPopUp={setIsShowPopUp}
      modalTitle={modalTitle}
      modalmessage={modalMessage}
      primaryButtonLabel={primaryButtonLabel}
      SecondaryButtonlabel={secondaryButtonlabel}
      isShowWarningText={isDelete}
      isCancelCallBack={true}
      callBackvalue={() => {
        if(isDelete)
        {
          setIsDelete(false)
          updateJobStatusBasedOnAction(true)
        }else{
          updateJobStatusBasedOnAction(false)
        }
      }}
      handleCancel={(value)=>{
        if(isDelete)
        {
          setIsDelete(false)
        }
        if(value === true && !isDelete)
        {
          updateJobStatusBasedOnAction(true)
        }
        setIsShowPopUp(false)
      }}
    />
      </div>
    </React.Fragment>
  );
};
export default CaptureUploadingStatus;
