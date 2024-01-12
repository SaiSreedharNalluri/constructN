import React, { useEffect, useState } from "react";
import UploadingStatus from "../../uploaderFIle/uploadingStatus";
import ChooseOnboardingFiles from "../chooseOnboardingFiles";
import PopupComponent from "../../../popupComponent/PopupComponent";
import { IOnboardingProps } from "../projectOnboarding";
import { effect, useSignal } from "@preact/signals-react";
import { useComputed, useSignalEffect } from "@preact/signals-react/runtime";
import { Uploader } from "../../web_worker/uploadFileWorker";
import { Button, LinearProgress, Typography } from "@mui/material";
import { getStructureHierarchy } from "../../../../services/structure";
import moment from "moment";

const ProjectOnboardingBIM = ({ step, action, projectId, hierarchy, loader }: IOnboardingProps) => {

  type UploadProgress = {
    sent: number
    total: number
    percentage: number
  }

  const fileToUpload = useSignal<File | undefined>(undefined)
  const existingBIM = useComputed(() => {
    if(hierarchy !== undefined && hierarchy.value.length > 0) {
      if(hierarchy.value[0].designs !== undefined && hierarchy.value[0].designs.length > 0 ) {
        hierarchy.value[0].designs.forEach(design => {
          if(design.type === 'BIM') return design.name
        })
      }
    }
    return undefined
  })
  const uploadComplete = useSignal(hierarchy!.value.length > 0 && hierarchy!.value[0].designs!.length > 0 && hierarchy!.value[0].designs![0].type === 'BIM')
  const isUploading = useSignal(false)
  const uploadProgress = useSignal<UploadProgress>({ sent: 0, total: 0, percentage: -1 })
  const showPopUp = useSignal(false)

  const dragDropText = "(or drag and drop file here)";
  const supportFileText = "Upload .RVT or .NWD file";

  console.log(hierarchy?.peek()[0]._id, existingBIM.value)

  useSignalEffect(() => {
    console.log('Action inside BIM', 'Step:', step.peek(), 'Action:', action?.peek(), 'Project ID:', projectId.peek(), 'Structure ID:', hierarchy?.peek()[0]._id)
    switch (action!.value) {
      case 'Back-2':
        step.value = 1
        action!.value = ''
        break
      case 'Next-2':
        console.log(fileToUpload.peek(), showPopUp.peek())
        if (existingBIM.peek() !== undefined) {
          step.value = 3
          action!.value = ''
        } else if (fileToUpload.peek() === undefined) {
          showPopUp.value = true
          action!.value = ''
        } else if (uploadComplete.peek() === false) {
          showPopUp.value = true
          action!.value = ''
        } else if (uploadComplete.peek() === true) {
          step.value = 3
          action!.value = ''
        }
        break
      default:
        break
    }
  })

  const renderProgress = useComputed(() => uploadProgress.value.percentage !== -1 && isUploading.value == true ?
    <div className='mt-8 w-[400px] py-4 px-8'>
      <div className='flex justify-between'>
        <div className='text-[12px] text-[600]'>{`${(uploadProgress.value.sent / (1024 * 1024)).toFixed(1)} MB / ${(uploadProgress.value.total / (1024 * 1024)).toFixed(1)} MB`}</div>
        <div className='text-[12px] text-[700]'>{`${(uploadProgress.value.percentage).toFixed(1)}%`}</div>
      </div>
      <LinearProgress className='mt-4' color='warning' variant="determinate" value={uploadProgress.value.percentage} />
    </div>
    : <></>)

  const renderSuccessMessage = useComputed(() => uploadComplete.value == true && existingBIM.value === undefined ?
    <Typography className='text-emerald-500 m-8' variant="body1">Uploaded BIM successfully</Typography> : <></>)

  const renderUploadedOn = useComputed(() => existingBIM.value !== undefined ?
    <Typography className='text-orange-600 m-8' variant="body1">
      Uploaded on: {moment(hierarchy!.value[0].designs![0].createdAt).format('LL')}
    </Typography> : <></>)
  const renderLoader = useComputed(() => {
    if (loader) {
      if (loader.value === true) {
        return <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999
        }}></div>
      }
    }
  }

  )
  const renderUploadButton = useComputed(() => uploadComplete.value == false ?
    <Button variant='contained' disabled={fileToUpload.value === undefined || isUploading.value === true} size='small' className='flex-1 mt-8 bg-[#F1742E]'
      color='warning' onClick={() => { if (loader) loader.value = true, proceedUpload() }} >
      Upload
    </Button> : <></>)

  const renderPopup = useComputed(() => showPopUp.value === true ? <PopupComponent
    open={showPopUp.value}
    setShowPopUp={(state: boolean) => { showPopUp.value = state }}
    modalTitle={"Warning"}
    modalmessage={`${isUploading.value == true ? 'BIM upload in progress. Clicking next will discard the file. ' : ''}Are you sure you want to proceed without BIM?`}
    primaryButtonLabel={"Yes"}
    SecondaryButtonlabel={"Discard"}
    callBackvalue={() => {
      showPopUp.value = false
      step.value = 3
      action!.value = ''
    }}
  /> : <></>)

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
    console.log("procced method");

    // const worker = new Worker(new URL('../../web_worker/uploadFileWorker.ts', import.meta.url));
    // console.log(worker)
    // worker.postMessage({ file: fileToUpload.peek(), type: 'BIM', projectId: projectId.peek(), structureId: structureId?.peek() });
    // console.log(worker)
    // worker.onmessage = (event) => {
    //   const { structureId, type, percentage } = event.data;
    //   console.log(structureId, type, percentage)
    //   // worker.terminate();
    // };
    const uploader = new Uploader({ file: fileToUpload.value, projectId, structureId: hierarchy!.value[0]._id, type: 'BIM' })

    uploader.onProgress(({ sent, total, percentage }: { percentage: number, sent: number, total: number }) => {
      // console.log(`${percentage}%`)
      uploadProgress.value = { sent, total, percentage }
      if (loader) {
        loader.value = true
      }
    })
      .onError((error: any) => {
        isUploading.value = false
        console.error(error)
        if (loader) {
          loader.value = true
        }
      })
      .onComplete(() => {
        getStructureHierarchy(projectId.peek()).then((res => {
          isUploading.value = false
          uploadProgress.value = { sent: 0, total: 0, percentage: -1 }
          uploadComplete.value = true
          if (loader) {
            loader.value = false
          }
          if (hierarchy) hierarchy.value = res.data.result
        })).catch(err => console.log(err))
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
          fileToUpload={fileToUpload}
          uploadStatus={uploadComplete}
          existingBIM={existingBIM}
          UploadingStatus={<UploadingStatus />}
          isDisabled={uploadComplete.value}
          acceptFiles={{ "application/octet-stream": [".nwd", ".rvt"] }}
        ></ChooseOnboardingFiles>
      </div>
      {renderProgress}

      {renderUploadedOn}

      {renderUploadButton}

      {renderSuccessMessage}
      {renderLoader}

      <div style={{ textAlign: "left", marginTop: "20px" }}>
        <a
          href={`https://help.constructn.ai/en/articles/8756456-bim-and-floor-plan-requirements`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "1.2em", color: "blue" }}
        >
          Please visit the following link for detailed guidance on selecting the appropriate BIM for your upload.
        </a>
      </div>

      {renderPopup}

    </div>
  );
};

export default ProjectOnboardingBIM;
