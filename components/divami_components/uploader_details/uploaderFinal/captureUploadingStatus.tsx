import React, { useState } from "react";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { getPathToRoot } from "../../../../utils/utils";
import { useAppContext } from "../../../../state/appState/context";
import { TooltipText } from "../../side-panel/SidePanelStyles";
import { IStructure } from "../../../../models/IStructure";
interface Iprops {
  isUploading: boolean;
  isUploadedOn: boolean;
  buttonName: string;
}
const CaptureUploadingStatus: React.FC<Iprops> = ({
  isUploading,
  isUploadedOn,
  buttonName,
}) => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const { state: appState, appContextAction } = useAppContext();

  const handleHeaderCheckboxChange = () => {
    const allSelected = selectedCheckboxes.every((checkbox) => checkbox);
    const newSelection = selectedCheckboxes.map(() => allSelected);
    setSelectedCheckboxes(newSelection);
  };

  const handleCheckboxChange = (index: number) => {
    const newSelection = [...selectedCheckboxes];
    newSelection[index] = !newSelection[index];
    setSelectedCheckboxes(newSelection);
  };
  const gethierarchyPath = (structure:string | IStructure): string => {
    let structureId  = ""
    if((structure as IStructure)._id) {
      structureId = (structure as IStructure)._id
    } else {
      structureId  = structure as string
    }

    if(appState.hierarchy) {
      return getPathToRoot(
        structureId,
      appState.hierarchy[0]
      );
    } else {
      return ""
    }
  }
  
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

  /**
   * If isUploading true case, get data from uploaderState.pendingUploadJobs
   * If isUploading false case, get data from uploaderState.pendingProcessJobs
   * populate this data in table tr
   */
  const data = isUploading
    ? uploaderState.pendingUploadJobs
    : uploaderState.pendingProcessJobs;

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<boolean[]>([
    true,
    ...Array(data.length).fill(false),
  ]);

  const TruncatedString = ({ text, maxLength, suffixLength }: any) => {
    let truncatedText = text;

    if (text.length > maxLength) {
      const prefix = text.substring(0, maxLength - suffixLength);
      const suffix = text.substring(text.length - suffixLength);
      truncatedText = prefix + "..." + suffix;
    }

    return truncatedText;
  };
  return (
    <React.Fragment>
      <div
        className={`w-full mt-2 ${
          isUploadedOn ? "bg-white" : ""
        } rounded-2xl h-30`}
      >
        <div
          className=""
          style={{ overflow: "auto", height: `calc(80vh - 350px)` }}
        >
          <table className="w-full">
            <thead
              className={`text-jusitfy sticky top-0 ${
                isUploadedOn ? "bg-white" : "bg-orange-100"
              }`}
            >
              <tr className="border-b border-b-[#F1742E]">
                <th className="pl-2 py-2">
                  {isUploadedOn && (
                    <input
                      type="checkbox"
                      checked={selectedCheckboxes.every((checkbox) => checkbox)}
                      onChange={handleHeaderCheckboxChange}
                    />
                  )}
                  <span className="ml-0 text-jusitfy">Level</span>
                </th>
                <th className="pl-2">Capture Date</th>
                {isUploading && <th>Uploading</th>}
                {isUploadedOn && <th>Uploaded On</th>}
              </tr>
            </thead>
            <tbody className="text-justify">
              {data.map((job, index) => (
                <tr key={index}>
                  <td className="pl-2">
                    {isUploadedOn && (
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes[index]}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    )}
                    &nbsp;
                    {gethierarchyPath(job.structure)}
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
        <div className="text-center my-[10px]">
          <button
            className="bg-[#F1742E] py-2 pl-[7px] pr-[8px] rounded-[8px] font-semibold text-white"
            onClick={() => {
              if (isUploading) {
                uploaderAction.startNewUpload();
              } else {
                
              }
            }}
          >
            {buttonName}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
export default CaptureUploadingStatus;
