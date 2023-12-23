import React, { useEffect, useState } from "react";
import UploadingStatus from "../../uploaderFIle/uploadingStatus";
import ChooseOnboardingFiles from "../chooseOnboardingFiles";
import PopupComponent from "../../../popupComponent/PopupComponent";
import { useProjectContext } from "../../../../state/projectState/context";
import { IOnboardingProps } from "../projectOnboarding";
import { effect, useSignal } from "@preact/signals-react";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { Uploader } from "../../web_worker/uploadFileWorker";

const ProjectOnboardingBIM = ({ step, action, projectId, structureId }: IOnboardingProps) => {

  // useSignals()
  const fileToUpload = useSignal<File | undefined>(undefined)
  const uploadComplete = useSignal(false)
  const showPopUp = useSignal(false)

  const dragDropText = "(or drag and drop file here)";
  const supportFileText = "Upload .RVT or .NWD file";

  console.log('rendering BIM')

  useSignalEffect(() => {
    console.log('Action inside BIM', 'Step:', step.peek(), 'Action:', action?.peek(), 'Project ID:', projectId.peek(), 'Structure ID:', structureId?.peek())
    switch(action!.value) {
      case 'Back-2':
        step.value = 1
        action!.value = ''
        break
      case 'Next-2':
        console.log(fileToUpload.peek(), showPopUp.peek())
        if (fileToUpload.peek() === undefined) {
          showPopUp.value = true
          action!.value = ''
        } else if(uploadComplete.peek() === false) {
          showPopUp.value = true
          action!.value = ''
        } else if(uploadComplete.peek() === true) {
          step.value = 3
          action!.value = ''
        }
        break
      default:
        break
    }
  })

  const onDrop = (acceptedFiles: File[]) => {
    console.log(acceptedFiles)
    const firstFile = acceptedFiles[0];
    const fileSizeKB = Math.round(firstFile.size / 1024);
    const fileSizeMB = fileSizeKB / 1024;

    const fileSizeFormatted =
      fileSizeMB >= 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB} KB`;

    fileToUpload.value = firstFile;
  };
  const onDelete = (e: any) => {
    fileToUpload.value = undefined
    e.stopPropagation();
  };
  const onUpload = (e: any) => {
    e.stopPropagation();
    proceedUpload()
  };

  const proceedUpload = () => {
    // const worker = new Worker(new URL('../../web_worker/uploadFileWorker.ts', import.meta.url));
    // console.log(worker)
    // worker.postMessage({ file: fileToUpload.peek(), type: 'BIM', projectId: projectId.peek(), structureId: structureId?.peek() });
    // console.log(worker)
    // worker.onmessage = (event) => {
    //   const { structureId, type, percentage } = event.data;
    //   console.log(structureId, type, percentage)
    //   // worker.terminate();
    // };
    const uploader = new Uploader({file: fileToUpload.value, projectId, structureId, type: 'BIM'})

    uploader.onProgress(({ sent, total, percentage }: { percentage: number, sent: number, total: number }) => {
      console.log(`${percentage}%`)
    })
      .onError((error: any) => {
        console.error(error)
      })
      .onComplete(() => {
        uploadComplete.value = true
      })

    uploader.start()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col justify-center items-center">
        <ChooseOnboardingFiles
          onDrop={onDrop}
          onUpload={onUpload}
          onDelete={onDelete}
          dragDropText={dragDropText}
          supportFileText={supportFileText}
          uploadedFileName={fileToUpload.value ? fileToUpload.value.name : ''}
          UploadingStatus={<UploadingStatus />}
          isDisabled={false}
          acceptFiles={{ "application/octet-stream": [".nwd", ".rvt"] }}
        ></ChooseOnboardingFiles>
      </div>

      {fileToUpload.value && (
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
      <PopupComponent
          open={showPopUp.value}
          setShowPopUp={(state: boolean) => {showPopUp.value = state}}
          modalTitle={"Warning"}
          modalmessage={"Are you sure you do not want to proceed without BIM?"}
          primaryButtonLabel={"No BIM"}
          SecondaryButtonlabel={"Cancel"}
          callBackvalue={() => {
            showPopUp.value = false
          }}
        />
    </div>
  );
};

export default ProjectOnboardingBIM;
