import React, { useEffect, useState } from "react";
import CaptureUploadingStatus from "./captureUploadingStatus";
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { WebWorkerManager } from "../../../../utils/webWorkerManager";
import FileNameListing from "../../fileListing/fileNameListing";
import FileStatus from "../../fileListing/fileStatus";
import { getjobs } from "../../../../services/jobs";

interface fileData {
  status: string;
  fileName: string;
}
const UploaderFinal: React.FC = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [fileProgressList, setFileProgressList] = useState<fileData[]>([]);
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

  return (
    <React.Fragment>
      <div className="flex ml-[6px] mt-[15px] calc-w">
        <div className="flex flex-col w-[70%]">
              <div>
                <CaptureUploadingStatus
                  isUploadedOn={false}
                  isUploading={true}
                  buttonName="+ Start a new upload"
                />
              </div> 

              <div>
                <CaptureUploadingStatus
                  isUploadedOn={true}
                  isUploading={false}
                  buttonName="Process"
                />
              </div>
         
        </div>

        <div className="w-[30%] h-[280px]   ml-[30px] mt-2  overflow-x-hidden bg-[#FFECE2] rounded-3xl overflow-y-auto">
          <div className=" mt-2 w-[60%] ml-[30px] font-open-sans italic font-normal text-base leading-5 text-black">
                      Uploading progress for{" "}
                      <span className="font-bold not-italic">
                        structure name
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
      </div>
    </React.Fragment>
  );
};
export default UploaderFinal;
