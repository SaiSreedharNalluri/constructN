import React, { useState } from "react";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { TruncatedString, getPathToRoot } from "../../../../utils/utils";
import { useAppContext } from "../../../../state/appState/context";
import { TooltipText } from "../../side-panel/SidePanelStyles";
import { IStructure } from "../../../../models/IStructure";
import { IJobs, JobStatus } from "../../../../models/IJobs";
import { updateMultipleJobStatus } from "../../../../services/jobs";
import router from "next/router";
interface Iprops {
  isUploading: boolean;
  isUploadedOn: boolean;
  buttonName: string;
  button: string;
  onRowClick?: (job: IJobs, index: any) => void;
}
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
    setValue(true);
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

  const formatDate = (dateString: any, includeTime?: boolean) => {
    if (typeof dateString === "string") {
      const date = new Date(dateString);

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };

      if (includeTime) {
        options.hour = "numeric";
        options.minute = "numeric";
      }

      const formattedDate = date.toLocaleDateString("en-US", options);

      return includeTime ? formattedDate.replace(",", "") : formattedDate;
    }

    return "";
  };
  
  const getSelectedStructures = () => {
    const selectedPendingProcess = data.filter(
      (_, index) => selectedCheckboxes[index]
    );
    const jobDetails = selectedPendingProcess.map((job) => ({
      status: JobStatus.readyForProcessing,
      jobId: job._id,
    }));
    updateMultipleJobStatus(router.query.projectId as string, jobDetails).then(
      (response) => {
        if (response.data.success === true) {
          console.log("console check sucess", response.data.result);
        }
      }
    );
  };
  return (
    <React.Fragment>
      <div
        className={`w-full mt-2 ${
          isUploadedOn ? "bg-white" : "bg-[#FFECE2] "
        } rounded-3xl h-[280px]  `}
        style={{ boxShadow: " 0px 4px 4px 0px #00000040" }}
      >
        <div className="relative top-[20px]  w-[90%] mx-auto  h-[195px] ">
          <div className="overflow-x-hidden h-full mt-[8px]">
            <table className="w-full">
              <thead
                className={`text-jusitfy sticky top-0 ${
                  isUploadedOn ? "bg-white" : "bg-[#FFECE2]"
                } w-full`}
              >
                <tr className="w-full flex justify-evenly border-b border-b-[#F1742E] mx-auto">
                  <th className="pl-2 text-left w-[35%]">
                    {isUploadedOn && (
                      <input
                        type="checkbox"
                        checked={
                          selectedCheckboxes.every((checkbox) => checkbox) &&
                          value
                        }
                        onChange={handleHeaderCheckboxChange}
                      />
                    )}
                    <span
                      className="ml-[8px] text-jusitfy"
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        fontStyle: "normal",
                        fontFamily: "Open sans",
                        marginLeft: "8px",
                        lineHeight: "20px",
                        color: "#101f4c",
                      }}
                    >
                      Level
                    </span>
                  </th>
                  <th
                    className="pl-2 text-left w-[18%]"
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      fontStyle: "normal",
                      fontFamily: "Open sans",
                      marginLeft: "8px",
                      lineHeight: "20px",
                      color: "#101f4c",
                    }}
                  >
                    Capture Date
                  </th>
                  {isUploading && (
                    <th
                      className="pl-2 text-left w-[18%]"
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        fontStyle: "normal",
                        fontFamily: "Open sans",
                        marginLeft: "8px",
                        lineHeight: "20px",
                        color: "#101f4c",
                      }}
                    >
                      Uploading
                    </th>
                  )}
                  {isUploadedOn && (
                    <th
                      className="pl-2 text-left w-[18%]"
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        fontStyle: "normal",
                        fontFamily: "Open sans",
                        marginLeft: "8px",
                        lineHeight: "20px",
                        color: "#101f4c",
                      }}
                    >
                      Uploaded On
                    </th>
                  )}
                </tr>
              </thead>
              <tbody
                className="bg-grey-light flex flex-col items-center  overflow-y-scroll w-full"
                style={{ height: "150px" }}
              >
                {data.map((job, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      if (isUploading && onRowClick) {
                        onRowClick(job as IJobs, index);
                      }
                    }}
                    className={`cursor-${isUploading ? "pointer" : "default"} ${
                      index === hoveredRowIndex ? "bg-gray-200" : ""
                    } flex justify-evenly w-full mb-4 mx-auto`}
                    onMouseEnter={() => setHoveredRowIndex(index)}
                    onMouseLeave={() => setHoveredRowIndex(null)}
                  >
                    <td className="pl-2 w-[35%]">
                      {isUploadedOn && (
                        <input
                          type="checkbox"
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
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            fontStyle: "normal",
                            fontFamily: "Open sans",
                            marginLeft: "8px",
                            lineHeight: "20px",
                            color: "#101f4c",
                          }}
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
                      className="pl-2 w-[18%]"
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        fontStyle: "normal",
                        fontFamily: "Open sans",
                        lineHeight: "20px",
                        color: "#101f4c",
                      }}
                    >
                      {formatDate(
                        job.captures && job.captures.length > 0
                          ? (job.captures[0] as any)?.captureDateTime
                          : ""
                      )}
                    </td>
                    <td
                      className="pl-2 w-[18%]"
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        fontStyle: "normal",
                        fontFamily: "Open sans",
                        lineHeight: "20px",
                        color: "#101f4c",
                      }}
                    >
                      {formatDate(job.updatedAt, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-[10px] w-[90%]">
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
      </div>
    </React.Fragment>
  );
};
export default CaptureUploadingStatus;
