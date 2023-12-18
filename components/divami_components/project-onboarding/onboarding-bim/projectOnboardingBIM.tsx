import React, { useEffect, useState } from "react";
import UploadingStatus from "../../uploaderFIle/uploadingStatus";
import ChooseOnboardingFiles from "../chooseOnboardingFiles";
import PopupComponent from "../../../popupComponent/PopupComponent";
import { useProjectContext } from "../../../../state/projectState/context";

const ProjectOnboardingBIM = () => {
  const { state: OnBoardingProjectState, projectContextAction } =
    useProjectContext();
  const { ProjectAction } = projectContextAction;
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileUpload, setFileUpload] = useState<any>();
  const [showPopUp, setshowPopUp] = useState(false);

  const dragDropText = "(or drag and drop file here)";
  const supportFileText = "Upload .RVT or .NWD file";

  const onDrop = (acceptedFiles: any) => {
    const firstFile = acceptedFiles[0];
    const fileSizeKB = Math.round(firstFile.size / 1024);
    const fileSizeMB = fileSizeKB / 1024;

    const fileSizeFormatted =
      fileSizeMB >= 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB} KB`;

    setUploadedFileName(`${firstFile.name} (${fileSizeFormatted})`);
    setFileUpload(acceptedFiles);
  };
  const onDelete = (e: any) => {
    setUploadedFileName(null);
    ProjectAction.setBimFile(null);
    e.stopPropagation();
  };
  const onUpload = (e: any) => {
    ProjectAction.setBimFile(fileUpload);
    e.stopPropagation();
  };
  useEffect(() => {
    if (OnBoardingProjectState.isBimNotAvailable === true) {
      setshowPopUp(true);
    }
  }, [OnBoardingProjectState.isBimNotAvailable === true]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col justify-center items-center">
        <ChooseOnboardingFiles
          onDrop={onDrop}
          onUpload={onUpload}
          onDelete={onDelete}
          dragDropText={dragDropText}
          supportFileText={supportFileText}
          uploadedFileName={uploadedFileName}
          UploadingStatus={<UploadingStatus />}
          isDisabled={false}
          acceptFiles={{ "application/octet-stream": [".nwd", ".rvt"] }}
        ></ChooseOnboardingFiles>
      </div>

      {uploadedFileName && (
        <div style={{ textAlign: "left", marginTop: "20px" }}>
          <a
            href={`#`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "1.2em", color: "blue" }}
          >
            Instructions/Tips for Upload Floor Plans
          </a>
        </div>
      )}
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Warning"}
          modalmessage={"Are you sure you do not want to upload without BIM?"}
          primaryButtonLabel={"No BIM"}
          SecondaryButtonlabel={"Cancel"}
          callBackvalue={() => {
            ProjectAction.next();
          }}
        />
      )}
    </div>
  );
};

export default ProjectOnboardingBIM;
