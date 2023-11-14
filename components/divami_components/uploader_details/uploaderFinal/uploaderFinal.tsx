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
      <div style={{ display: "flex", marginLeft: "6px", marginTop: "15px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "60%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              marginBottom: "5px",
              backgroundColor: "#ffedd5",
              borderRadius: "1rem",
              overflowY: "hidden",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="mt-[8px] mb-[3px] rounded-2xl overflow-y-scroll shadow-md mb-4">
              <div className="rounded-2xl">
                <CaptureUploadingStatus
                  isUploadedOn={false}
                  isUploading={true}
                  buttonName="+ Start a new upload"
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex-1",
              flexDirection: "column",
              width: "100%",
              padding: "1px",
            }}
          >
            <div className="mt-[8px] mb-[3px] rounded-2xl overflow-y-scroll drop-shadow-lg mb-4">
              <div className="rounded-2xl">
                <CaptureUploadingStatus
                  isUploadedOn={true}
                  isUploading={false}
                  buttonName="Process"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-[30%]  ml-[30px] mb-[30px] mt-[10px] bg-orange-100 rounded-2xl overflow-y-auto " style={{ maxHeight: '300px' }}>
          <div className="w-full mt-[20px]">
          <div className="ml-[10px] mt-2 w-full font-open-sans italic font-normal text-base leading-5 text-black">
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
                  <div className=" ">
                   
                    <div className="flex" >
                      <div className="  ml-[20px] mt-2 w-40">
                        <FileNameListing fileName={fileProgressObj.fileName} />
                      </div>
                      <div className="w-40 mt-3">
                        <FileStatus status={fileProgressObj.status} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default UploaderFinal;
