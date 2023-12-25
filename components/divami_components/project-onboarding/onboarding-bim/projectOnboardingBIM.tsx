import React, { useEffect, useState } from "react";
import UploadingStatus from "../../uploaderFIle/uploadingStatus";
import ChooseOnboardingFiles from "../chooseOnboardingFiles";
import PopupComponent from "../../../popupComponent/PopupComponent";
import { useProjectContext } from "../../../../state/projectState/context";
import { IOnboardingProps } from "../projectOnboarding";
import { effect, useSignal } from "@preact/signals-react";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { Uploader } from "../../web_worker/uploadFileWorker";
import { Button, LinearProgress, Typography } from "@mui/material";

const ProjectOnboardingBIM = ({ step, action, projectId, structureId }: IOnboardingProps) => {

  useSignals()
  const fileToUpload = useSignal<File | undefined>(undefined)
  const uploadComplete = useSignal(false)
  const isUploading = useSignal(false)
  const uploadProgress = useSignal<number>(-1)
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
      uploadProgress.value = percentage
    })
      .onError((error: any) => {
        isUploading.value = false
        console.error(error)
      })
      .onComplete(() => {
        isUploading.value = false
        uploadProgress.value = -1
        uploadComplete.value = true
      })
    isUploading.value = true
    uploader.start()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex mt-12 flex-col justify-center items-center">
        <ChooseOnboardingFiles
          onDrop={onDrop}
          onUpload={onUpload}
          onDelete={onDelete}
          dragDropText={dragDropText}
          supportFileText={supportFileText}
          uploadedFileName={fileToUpload.value ? fileToUpload.value.name : ''}
          UploadingStatus={<UploadingStatus />}
          isDisabled={uploadComplete.value}
          acceptFiles={{ "application/octet-stream": [".nwd", ".rvt"] }}
        ></ChooseOnboardingFiles>
      </div>

      { uploadProgress.value !== -1 && isUploading.value == true &&
        <LinearProgress className='mt-8 w-[400px]' color='warning' variant="determinate" value={uploadProgress.value} />
      }

      {uploadComplete.value == false &&
        <Button variant='contained' disabled={fileToUpload.value === undefined || isUploading.value === true} size='small' className='flex-1 mt-8 bg-[#F1742E]'
          color='warning' onClick={() => proceedUpload()} >
          Upload
        </Button>
      }

      {uploadComplete.value == true &&
        <Typography className='text-emerald-500 m-8' variant="body1">Uploaded BIM successfully</Typography>
      }

      {uploadComplete.value == false && (
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
            step.value = 3
            action!.value = ''
          }}
        />
    </div>
  );
};

export default ProjectOnboardingBIM;
