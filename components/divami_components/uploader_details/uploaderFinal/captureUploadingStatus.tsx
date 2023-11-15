import React, { useState } from "react";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { getPathToRoot } from "../../../../utils/utils";
import { useAppContext } from "../../../../state/appState/context";
import { TooltipText } from "../../side-panel/SidePanelStyles";
import { IStructure } from "../../../../models/IStructure";
import { IJobs } from "../../../../models/IJobs";
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
  const data = isUploading ? uploaderState.pendingUploadJobs : uploaderState.pendingProcessJobs;
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<boolean[]>(Array(data.length).fill(false));
  const [value, setValue] = useState<boolean>(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const handleHeaderCheckboxChange = () => {
    setValue(true);
    const allSelected = selectedCheckboxes.every((checkbox) => checkbox);
    const newSelection = Array(data.length).fill(!allSelected);
    setSelectedCheckboxes(newSelection);
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedCheckboxes((prevSelection) => {
      const newSelection = [...prevSelection];
      newSelection[index] = !newSelection[index];
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

const TruncatedString = ({ text, maxLength, suffixLength }: any) => {
    let truncatedText = text;

    if (text.length > maxLength) {
      const prefix = text.substring(0, maxLength - suffixLength);
      const suffix = text.substring(text.length - suffixLength);
      truncatedText = prefix + "..." + suffix;
    }

    return truncatedText;
  };
  
  const getSelectedStructures = () => {
    const selectedStructures = data.filter(
      (_, index) => selectedCheckboxes[index]
    );
  };
  return (
    <React.Fragment>
<div className={`w-full mt-2 ${ isUploadedOn ? "bg-white" : "bg-[#FFECE2] "} rounded-3xl h-[280px]  `} style={{boxShadow:" 0px 4px 4px 0px #00000040"}}>
    
                <div className="relative top-[20px]  w-[90%] mx-auto  h-[195px] ">
          
                  <div className="overflow-x-hidden h-full">
                  <table className="w-full">
            <thead
              className={`text-jusitfy sticky top-0 ${
                isUploadedOn ? "bg-white" : "bg-[#FFECE2]"
              }`}
            >
              <tr className="border-b border-b-[#F1742E]">
                <th className="pl-2 py-2  text-left">
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
                  <span className="ml-0 text-jusitfy">Level</span>
                </th>
                <th className="pl-2 text-left">Capture Date</th>
                {isUploading && <th className="text-left">Uploading</th>}
                {isUploadedOn && <th className="text-left">Uploaded On</th>}
              </tr>
            </thead>
            <tbody className="text-justify">
              {data.map((job, index) => (
                <tr key={index}  onClick={() => {
                    if (isUploading && onRowClick) {
                      onRowClick(job as IJobs, index);
                    }
                  }}
                  className={`cursor-${isUploading ? "pointer" : "default"} ${
                    index === hoveredRowIndex ? "bg-gray-200" : ""
                  }`}
                  onMouseEnter={() => setHoveredRowIndex(index)}
                  onMouseLeave={() => setHoveredRowIndex(null)}>
                  <td className="pl-2 w-[40%]">
                    {isUploadedOn && (
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes[index]}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    )}
                                   <TooltipText title={gethierarchyPath(job.structure).length > 40 ? gethierarchyPath(job.structure) : ""} placement="right">
      <span>
      <TruncatedString text={gethierarchyPath(job.structure)} maxLength={40}
              suffixLength={40} ></TruncatedString> 
        </span> 
        </TooltipText>
                  </td>
                  <td className="pl-2">
                    {formatDate(
                      job.captures && job.captures.length > 0
                        ? (job.captures[0] as any)?.captureDateTime
                        : ""
                    )}
                  </td>
                  <td>{formatDate(job.updatedAt, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
                  </div>
     <div className="text-center mt-[10px] w-[90%]">
     <button
            className="bg-[#F1742E] py-2 pl-[7px] pr-[8px] rounded-[8px] font-semibold text-white"
            onClick={() => {
              if (isUploading) {
                uploaderAction.startNewUpload();
              } else {
                getSelectedStructures();
              }
            }}
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
