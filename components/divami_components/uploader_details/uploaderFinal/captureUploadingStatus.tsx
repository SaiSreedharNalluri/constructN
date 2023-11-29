import React, { useState } from "react";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { TruncatedString, getPathToRoot, getStructureIdFromModelOrString } from "../../../../utils/utils";
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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PopupComponent from "../../../popupComponent/PopupComponent";
interface Iprops {
  isUploading: boolean;
  isUploadedOn: boolean;
  buttonName: string;
  button: string;
  onRowClick?: (job: IJobs, index: any) => void;
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
}) => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const { state: appState, appContextAction } = useAppContext();
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [popUpHeading,setPopUPHeading] =useState('')
  const [popUpConfirm,setPopUPConfirm] =useState('')
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
  const updateJobStatusUploadCompleteWithErrors =()=>{
     let ignoreImagesCheck = true
      updateJobStatus(uploaderState.selectedJob?.project as string,uploaderState.selectedJob?._id as string,JobStatus.uploaded,ignoreImagesCheck).then((response:any)=>{
        if(response.data.success===true)
        {
          let captureJobs = uploaderState.pendingProcessJobs.concat(uploaderState.pendingUploadJobs)
          captureJobs.forEach((job) => {
            if (job._id === response.data.result?._id) {
              job.status = JobStatus.uploaded
            }
          })
          uploaderAction.setCaptureJobs(captureJobs)
        }

      }).catch((error)=>{

      })
  }
  return (
    <React.Fragment>
      <div
        className={`w-full my-2 ${
          isUploadedOn ? "bg-white" : "bg-[#FFECE2] "
        } rounded-3xl h-[280px]  `}
        style={{ boxShadow: " 0px 4px 4px 0px #00000040" }}
      >
        <div className="relative top-[20px]  w-[90%] mx-auto  h-[195px] ">
          <div className="overflow-x-hidden h-full mt-[8px]" style={{
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
                <tr className="w-full flex justify-evenly border-b border-b-[#F1742E] mx-auto">
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
                    className="pl-2 text-left w-[18%]">
                    Capture Date
                  </th>
                  {isUploading && (
                    <th
                      className="pl-2 text-left w-[18%]"
                    >
                      Uploading
                    </th>
                  )}
                  {isUploadedOn && (
                    <th
                      className="pl-2 text-left w-[18%]"
                    >
                      Uploaded On
                    </th>
                  )}
                  {
                    isUploading && (
                      <th
                        className="pl-2 text-left w-[18%]"
                      >
                        
                      </th>
                    )
                  }
                </tr>
              </thead>
              <tbody
                className="bg-grey-light flex flex-col items-center  overflow-y-auto w-full"
                style={{ height: "150px" }}
              >
                {data.map((job, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      if (isUploading && onRowClick) {
                        onRowClick(job as IJobs, index);
                       if(!uploaderState.stepperSideFileList)
                        {
                          uploaderAction.setStepperSideFilesList(true)
                        }
                      }
                    }}
                    className={`cursor-${isUploading ? "pointer" : "default"} ${
                      index === hoveredRowIndex ? "bg-gray-200" : ""
                    }  ${uploaderState.selectedJob?._id===job._id?"bg-[#D9D9D9] text-[#F1742E]":""} flex justify-evenly w-full my-[4px] mx-auto`}
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
                    {
                      isUploading &&<td
                      className="pl-2 w-[18%] flex items-center"
                    >
                      {getCaptureStatus(job.status)}
                    </td>
                    }
                    
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
                  uploaderAction.setStepperSideFilesList(true)
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
      </div>
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
    </React.Fragment>
  );
};
export default CaptureUploadingStatus;
