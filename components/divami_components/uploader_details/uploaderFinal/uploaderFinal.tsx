import React, { useEffect, useState } from "react";
import CaptureUploadingStatus from "./captureUploadingStatus";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { WebWorkerManager } from "../../../../utils/webWorkerManager";
import FileNameListing from "../../fileListing/fileNameListing";
import FileStatus from "../../fileListing/fileStatus";
import { getjobs } from "../../../../services/jobs";
import { IJobs } from "../../../../models/IJobs";
import { IStructure } from "../../../../models/IStructure";
import { getPathToRoot } from "../../../../utils/utils";
import { useAppContext } from "../../../../state/appState/context";

interface fileData {
  status: string;
  fileName: string;
}
const UploaderFinal: React.FC = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);
  const [structureId, setStructureId] = useState<string>();
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const { state: appState, appContextAction } = useAppContext();
  const workerManager = WebWorkerManager.getInstance();
  useEffect(() => {
    if (
      workerManager &&
      workerManager.getWorker() &&
      Object.keys(workerManager.getWorker())?.length > 0
    ) {
      for (let key of Object.keys(workerManager.getWorker())) {
        workerManager.getWorker()[key].onmessage = (event) => {
          console.log("event.data", event.data);
          setFileProgressList(event.data.userFileList);
        };
      }
    }
  }, [Object.keys(workerManager.getWorker())?.length]);

  const handleRowClick = (job: IJobs, index: number) => {
     setSelectedRow(index);
    if (job.structure && typeof job.structure === "object") {
      const structureId: string = job.structure._id || "";
      setStructureId(structureId);
    } else {
      console.error("Structure is not available or not an object");
    }
  };
  const gethierarchyPath = (structure: string | IStructure | any): string => {
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
        {selectedRow !== null && (
        <div className="w-[30%] h-[280px]   ml-[30px] mt-2  overflow-x-hidden bg-[#FFECE2] rounded-3xl overflow-y-auto">
          <div className=" mt-2 w-[60%] ml-[30px] font-open-sans italic font-normal text-base leading-5 text-black">
                      Uploading progress for{" "}
                      <span className="font-bold not-italic">
                      {gethierarchyPath(structureId)}
                      </span>{" "}
                      Expected to complete in 10 mins
                    </div>
            {fileProgressList &&
              fileProgressList.length > 0 &&
              fileProgressList.map((fileProgressObj: fileData) => {
                return (
                    <div key={fileProgressObj.fileName} className="flex w-full" >
                      <div className="  ml-[30px] mt-[20px] w-[25%] ">
                        <FileNameListing fileName={fileProgressObj.fileName} />
                      </div>
                      <div className="mt-[20px]">
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
