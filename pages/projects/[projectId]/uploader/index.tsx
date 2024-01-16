import React, { useEffect, useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import UploaderDateDetails from "../../../../components/divami_components/uploader_details/uploaderDetails";
import UploaderFiles from "../../../../components/divami_components/uploader_details/uploaderFiles";
import UploaderStepper from "../../../../components/divami_components/uploader_details/uploaderStepper";
import UploaderFooter from "../../../../components/divami_components/uploader_details/uploaderFooter"; 
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { UploaderFinishState, UploaderPopups, UploaderStep, captureRawImageMap } from "../../../../state/uploaderState/state";
import UploaderFinal from "../../../../components/divami_components/uploader_details/uploaderFinal/uploaderFinal";
import UploaderGCP from "../../../../components/divami_components/uploader_details/uploaderGCP";
import UploaderReview from "../../../../components/divami_components/uploader_details/uploaderReview";
import { addGcp, addNewCaptureOnly, addRawImages, getCaptureDetails, getRawImages } from "../../../../services/captureManagement";
import { RawImage, RawImageCreateResp } from "../../../../models/IRawImages";
import { WebWorkerManager } from "../../../../utils/webWorkerManager";
import { useRouter } from "next/router";
import { useAppContext } from "../../../../state/appState/context";
import { getJobsByStatusMode, updateJobStatus } from "../../../../services/jobs";
import { IJobs, JobStatus } from "../../../../models/IJobs";
import { ICapture } from "../../../../models/ICapture";
import { IUploadFile, UploadStatus } from "../../../../models/IUploader";
import CustomLoader from '../../../../components/divami_components/custom_loader/CustomLoader';
import { getCaptureIdFromModelOrString, getJobIdFromModelOrString, getPathToRoot, getProjectIdFromModelOrString, getStructureIdFromModelOrString } from "../../../../utils/utils";
import { CustomToast } from "../../../../components/divami_components/custom-toaster/CustomToast";
import PopupComponent from "../../../../components/popupComponent/PopupComponent";
import Warning from '../../../../public/divami_icons/Warning_Icon.svg'
import moment from "moment";
import { AxiosError } from "axios";
import { IBaseResponse } from "../../../../models/IBaseResponse";
import { ProjectData } from "../../../../state/appState/state";
import authHeader from "../../../../services/auth-header";
interface IProps {}
const Index: React.FC<IProps> = () => {
  const router = useRouter();
  const { state: appState, appContextAction } = useAppContext();
  const { appAction } = appContextAction;
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [popUpHeading,setPopUPHeading] =useState('')
  const [popUpClose,setPopUPClose] =useState('')
  const [popUpConform,setPopUPConform] =useState('')
  let WorkerManager = WebWorkerManager.getInstance()
  const renderCenterContent = () => {
    switch (uploaderState.step) {
        case UploaderStep.Details:
          return  (
            <UploaderDateDetails/>
          );
        case UploaderStep.ChooseFiles:
          return <UploaderFiles/>;
        case UploaderStep.ChooseGCPs:
          return <UploaderGCP/>
        case UploaderStep.Review:
          return  <UploaderReview/>;
        case UploaderStep.Upload:
          return (<UploaderFinal/>) ;
        default:
          return null;
      }
  };
  const refreshJobs = (projectId: string) =>{
    uploaderAction.setIsLoading(true)
    getJobsByStatusMode(projectId, [JobStatus.uploadFailed, JobStatus.pendingUpload,], uploaderState.captureMode).then((response)=>{
      console.log("TestingUploader: getJobs", response.data.result)
      let jobs: IJobs[] = response.data.result;
      uploaderAction.setCaptureJobs(jobs)
    }).catch((error)=>{
      console.log("TestingUploader: Error: ", error)
      uploaderAction.setIsLoading(false)
    })
  }

  /**
   * UseEffect to reset and initialize uploaderState
   */
  useEffect(() => {
    console.log("TestingUploader: newUseEffect: ", appState.currentProjectData)
    let allWorkers = WorkerManager.getWorker();
   
   if(Object.keys(allWorkers).length>0)
    {
      for(let key of Object.keys(allWorkers)) {
        allWorkers[key].onmessage = onMessageFromWorker;
      }
    }
    if (appState.currentProjectData) {
      uploaderAction.setProject(appState.currentProjectData.project);
      refreshJobs(appState.currentProjectData.project._id)
    }

    return () => {
      console.log("TestingUploader: newUseEffect cleanup: ", appState.currentProjectData)
      uploaderAction.setResetUploaderState();
    }
  }, [appState.currentProjectData])


  /**
   * UseEffect to update jobs when update job status is true
   */
  useEffect(() => {
    console.log("TestingUploader updateJobs UseEffect: ", uploaderState.updateJobs, router.query.projectId as string)
    if(uploaderState.updateJobs && router.query.projectId as string) {
      refreshJobs(router.query.projectId as string)
    }
  }, [uploaderState.updateJobs])

  // /**
  //  * UseEffect to update jobs when route is ready
  //  */
  // useEffect(()=>{
  //   if (router.isReady){
  //     refreshJobs(router.query.projectId as string)
  //   }
  // },[router.isReady, router.query.projectId])

  /**
   * useEffect to show loading animation
   */
  useEffect(() => {

  }, [uploaderState.isLoading])

  useEffect(() => {
    if(uploaderState.pendingUploadJobs.length > 0) {
      uploaderAction.setIsLoading(true)
      Promise.all(uploaderState.pendingUploadJobs.map((job) => {
        let captureId = ""
        if((job.captures[0] as ICapture)?._id) {
          captureId = (job.captures[0] as ICapture)?._id
        } else {
          captureId = job.captures[0] as string
        }
        return getRawImages(router.query.projectId as string, captureId)
      })).then((response) =>{
       
        let rawImagesMap = response.reduce<captureRawImageMap>((prev, current):captureRawImageMap => {
          if (current?.data?.success) {
            let rawImages = current.data.result
            if (rawImages[0]?.capture) {
            
              let captureId: string = rawImages[0].capture
              return {
                ...prev,
                [captureId]: rawImages
              }
            } else {
              return prev
            }
          } else {
            return prev
          }
        }, {})
        uploaderAction.setRawImagesMap(rawImagesMap);
        uploaderAction.setIsLoading(false)
      }).catch(() => {
        uploaderAction.setIsLoading(false)
      })
    } else {
      uploaderAction.setIsLoading(false)
    }
  }, [uploaderState.pendingUploadJobs])

  useEffect(() => {
    if(uploaderState.completionState !== undefined) {
      switch(uploaderState.completionState) {
        case UploaderFinishState.withError:
          setIsShowPopUp(true)
          setPopUPHeading('Upload complete with errors')
          setPopUPConform('Skip Files and Complete')
          setPopUPClose('Re-upload error files')
          return
        case UploaderFinishState.withoutError:
          setIsShowPopUp(true)
          setPopUPHeading('All files and GCPs uploaded successfully')
          setPopUPConform('Process')
          setPopUPClose('Don’t Process Add images Later')
          return
        default:
          return
      }
    }
  }, [uploaderState.completionState])

  useEffect(()=>{
    if(uploaderState.uploadinitiate)
    {
      CustomToast('Initializing upload...','success')
      uploaderAction.setIsLoading(true)
      if (uploaderState.isAppendingCapture && uploaderState.selectedJob) {
        let selectedJob = uploaderState.selectedJob
        let captureJobs = uploaderState.pendingProcessJobs.concat(uploaderState.pendingUploadJobs)
        captureJobs.forEach((job) => {
          if (job._id === selectedJob._id) {
            job.status = JobStatus.pendingUpload
          }
        })
        uploaderAction.setCaptureJobs(captureJobs)
        addGcpToCapture(uploaderState.selectedJob)
      } else {
        addNewCaptureOnly(uploaderState.project?._id as string,{
        mode: uploaderState.captureMode,
        type: uploaderState.captureType,
        structure: uploaderState.structure?._id as string,
        captureDateTime: uploaderState.date as Date
      }).then((response)=>{
        console.log("TestingUploader: add capture response: ", response?.result)
        if(response.success===true)
        {
          let capture = response?.result
          let job = response?.result.jobId as IJobs;
          job.captures = [capture]
          //let captureJobs = uploaderState.pendingProcessJobs.concat(uploaderState.pendingUploadJobs)
          //captureJobs.push(job)
         // uploaderAction.setCaptureJobs(captureJobs)
         // uploaderAction.setSelectedJob(job)
          addGcpToCapture(job)
        }
        
      }).catch((error)=>{
        CustomToast('Something went wrong. Please try again after some time.','error')
        uploaderAction.setIsLoading(false)
        uploaderAction.changeUploadinitiate(false)
      })
    }
      
    }
  },[uploaderState.uploadinitiate])

  const addGcpToCapture=(job: IJobs)=>{
      if(uploaderState.skipGCP===false) {   
        let captureId = getCaptureIdFromModelOrString(job.captures[0])  
          addGcp(uploaderState.project?._id as string,captureId,uploaderState.gcpList).then((response)=>{
            if(response.success===true){
              addRawImagesTOCapture(job)
            }
           }).catch((error)=>{
            uploaderAction.setIsLoading(false)
            uploaderAction.changeUploadinitiate(false)
            CustomToast('Something went wrong. Please try again after some time.','error')
          })
      } else {
        addRawImagesTOCapture(job)
      }
  }
  const addRawImagesTOCapture=(job: IJobs)=>{
    let captureId = getCaptureIdFromModelOrString(job.captures[0])  
    addRawImages(uploaderState.project?._id as string,captureId,uploaderState?.choosenFiles?.validFiles?.map(({file,...rawImage})=>rawImage)).then((response)=>{
      
      if(response.success===true)
      {
        let captureJobs = uploaderState.pendingProcessJobs.concat(uploaderState.pendingUploadJobs)
        captureJobs.push(job)
          uploaderAction.setCaptureJobs(captureJobs)
          uploaderAction.setSelectedJob(job)
        uploaderAction.setCurrentUploadFiles(getUploadFiles(response.result, job))
        appAction.addCaptureUpload(job)
        uploaderAction.changeUploadinitiate(false)
        uploaderAction.next()
        // uploaderAction.refreshJobs();
        uploaderAction.setIsLoading(false)
        CustomToast(`Started uploading ${uploaderState?.choosenFiles?.validFiles?.length} file(s)`,'success')
      }
    }).catch((error)=>{
      uploaderAction.setIsLoading(false)
      uploaderAction.changeUploadinitiate(false)
      CustomToast('Something went wrong. Please try again after some time.','error')
    })
  }

  const getUploadFiles = (fileList:RawImageCreateResp[], job: IJobs): IUploadFile<RawImage>[] => {
    const uploadFiles: IUploadFile<RawImage>[] = fileList.reduce<IUploadFile<RawImage>[]>((array, currentfile): IUploadFile<RawImage>[] => {
      let fileObject = uploaderState.choosenFiles.validFiles.find((e) => { return e.externalId === currentfile.externalId })
      if (fileObject) {
        array.push({
          destination: currentfile.putSignedURL,
          progress: {value: 0},
          status: UploadStatus.inProgress,
          uploadObject: currentfile as RawImage,
          file: fileObject.file
        })
      }
      return array
    }, [])
    return uploadFiles
  }

  useEffect(() => {
    if(uploaderState.currentUploadFiles && uploaderState.currentUploadFiles.length > 0) {
      sendingFilesToworker(uploaderState.currentUploadFiles)
    }
  }, [uploaderState.currentUploadFiles])

  const sendingFilesToworker=(uploadFiles: IUploadFile<RawImage>[])=>{
    let captureId = uploadFiles[0].uploadObject.capture
    if(captureId) {
      let worker = new Worker(new URL('../../../../components/divami_components/web_worker/fileUploadManager.ts',import.meta.url), {name: captureId});
      WorkerManager.createWorker(captureId,worker)
      worker.onmessage = onMessageFromWorker;
      let headerValue = authHeader.authHeader()
      worker.postMessage({uploadFiles,headerValue});
    }
  }

  const onMessageFromWorker = function(this:Worker,event: MessageEvent<{filesList: IUploadFile<RawImage>[], completedFileList: IUploadFile<RawImage>[]}>){
    uploaderAction.updateWorkerStatus(event.data.filesList)
    if(event?.data?.filesList?.length != undefined && event?.data?.completedFileList?.length !=undefined && (event?.data?.filesList?.length === event?.data?.completedFileList?.length))
    {
      handleOnWorkerCompletion(event?.data?.filesList[0]?.uploadObject?.capture as string)
      WorkerManager.removeWorker(event?.data?.filesList[0]?.uploadObject?.capture as string)
      this.terminate()
    }
  }

  const handleOnWorkerCompletion = (captureId:string) => {
    let job = appState.inProgressPendingUploads.find((job) => {
      return getCaptureIdFromModelOrString(job.captures[0]) === captureId
    })
    if(job) {
      updateUploadCompletionStatus(getProjectIdFromModelOrString(job.project), job._id, captureId)
    } else {
      console.log("TestingUploader handlWorkerCompletionStatus no job in appState: ")
    }
  }

  const updateUploadCompletionStatus = (projectId: string, jobId: string, captureId: string) => {
    let jobProject = appState.projectDataList.find((projectData) => {
      return projectData.project._id === projectId
    })
    if (appState.currentProjectData && jobProject && appState.currentProjectData.project._id === jobProject.project._id) {
      uploaderAction.setIsLoading(true)
    }
    updateJobStatus(projectId, jobId, JobStatus.uploaded).then((response)=>{
      uploaderAction.setIsLoading(false)
      if(response.data.success===true) {
        let job = response.data.result
        appAction.removeCaptureUpload(job)
        updateJobStatusOnView(job, jobProject);
        if (jobProject) {
          CustomToast(`SUCCESSFULLY uploaded all file(s) for the ${getPathToRoot(getStructureIdFromModelOrString(job.structure),jobProject.hierarchy[0])} on ${moment(job.date).format("MMM DD YYYY")}`,'success', false) 
        } else {
          CustomToast(`Upload Completed SUCCESSFULLY`,'success')
        }
      }
    }).catch((axiosError: AxiosError<IBaseResponse<IJobs>>)=>{
      uploaderAction.setIsLoading(false)
      if(axiosError && axiosError.response?.status === 422) {
        let job = axiosError.response.data.result
        appAction.removeCaptureUpload(job)
        updateJobStatusOnView(job, jobProject);
        if (jobProject) {
          CustomToast(`Upload completed with ERRORS for the ${getPathToRoot(getStructureIdFromModelOrString(job.structure),jobProject.hierarchy[0])} on ${moment(job.date).format("MMM DD YYYY")}`,'success', false) 
        } else {
          CustomToast(`Upload Completed with ERRORS`,'success')
        }
      }
    }).catch((error) => {
      uploaderAction.setIsLoading(false)
      console.log("TestingUploader uploadCompletionStatus: catch error ", error)
    })
  }

  const updateJobStatusOnView = (updatedJob:IJobs, jobProject: ProjectData | undefined) => {
    if (jobProject) {
      if (appState.currentProjectData && appState.currentProjectData.project._id === jobProject.project._id) {
        let captureJobs = uploaderState.pendingProcessJobs.concat(uploaderState.pendingUploadJobs)
        captureJobs.forEach((job) => {
          if (job._id === updatedJob._id) {
            job.status = updatedJob.status
          }
        })
        uploaderAction.setCaptureJobs(captureJobs)
        if(updatedJob.status === JobStatus.uploadFailed) {
          uploaderAction.setSelectedJob(updatedJob)
        } else {
          uploaderAction.removeWorker(getCaptureIdFromModelOrString(updatedJob.captures[0]));
        }
      }
    }
  }

  const updateJobStatusBasedOnAction = (deleteJob:boolean) => {
    let jobProject = appState.projectDataList.find((projectData) => {
      return projectData.project._id === router.query.projectId
    })
    let ignoreImagesCheck = true;
    uploaderAction.setIsLoading(true);
    updateJobStatus(
      uploaderState.selectedJob?.project as string,
      uploaderState.selectedJob?._id as string,
      deleteJob ? JobStatus.archived : JobStatus.uploaded,
      ignoreImagesCheck
    )
      .then((response) => {
        uploaderAction.setIsLoading(false);
        if (response.data.success === true) {
          let updatedJob = response.data.result
          let captureJobs = uploaderState.pendingProcessJobs.concat(
            uploaderState.pendingUploadJobs
          );
          captureJobs.forEach((job) => {
            if (job._id === updatedJob._id) {
              job.status = updatedJob.status;
            }
          });
          if(deleteJob === true)
          {
            if(uploaderState?.selectedJob && jobProject)
            {
              CustomToast(`Discarded all files for the ${getPathToRoot(getStructureIdFromModelOrString(uploaderState?.selectedJob?.structure),jobProject.hierarchy[0])} on ${moment(uploaderState.selectedJob.date).format("MMM DD YYYY")}`,'success')
            }
            else{
              CustomToast(`Discarded all files.`,'success') 
            }
          }
          else{
            if(uploaderState?.selectedJob && jobProject)
            {
              CustomToast(`Files for the ${getPathToRoot(getStructureIdFromModelOrString(uploaderState?.selectedJob?.structure),jobProject.hierarchy[0])} on ${moment(uploaderState.selectedJob.date).format("MMM DD YYYY")} have been sent for processing.`,'success')
            }else{
              CustomToast(`Files have been sent for processing.`,'success')
            } 
          }
          uploaderAction.setCaptureJobs(captureJobs);
        }
      })
      .catch((error) => {
        uploaderAction.setIsLoading(false);
      });
  };
  
  const setThecalHeight=()=>{
    if(uploaderState.selectedJob && uploaderState.step === UploaderStep.Upload)
    {
      return
    }
    else if(uploaderState.selectedJob || uploaderState.step !== UploaderStep.Upload)
    {
      return 'calc-h223'
    }
    else{
      return 'calc-h100'
    }
  }
  return (
    <div className="w-full h-full">
    <div className="w-full">
    <Header
            showBreadcrumbs
            breadCrumbData={[]}
            fromUsersList
            showFirstElement={true}
          />
     
    </div>
    <div className="flex  ">
      <SidePanelMenu onChangeData={() => {}} />
      <div className="flex flex-col calc-w  calc-h">
        <header>
        <div style={{ margin: "4px 20px", fontWeight: "600", fontSize: "22px",fontFamily:"Open Sans",fontStyle:"normal" }}>Upload</div>
        <div>
              {
              (uploaderState.selectedJob || uploaderState.step !== UploaderStep.Upload) &&(<UploaderStepper />)
            }
             </div>
        </header>
     { uploaderState.isLoading === false ?  
    <div>
        <main className={`overflow-y-auto  ${setThecalHeight()} `}>
          <div>
          {renderCenterContent()}
           
          </div>
        </main>
        <footer className="py-[4px] text-center">
        <UploaderFooter/>
        </footer></div>:<CustomLoader isLoadingClose={true}/>}
      </div>
    </div>
    <div >
    </div>
    {/* <PopupComponent
      open={isShowPopUp}
      setShowPopUp={setIsShowPopUp}
      modalTitle={popUpHeading}
      modalmessage={'You can upload later by selecting the same date from the uploader tab'}
      isImageThere={true}
      imageSrc={Warning}
      primaryButtonLabel={popUpConform}
      SecondaryButtonlabel={""}
      isUploader={false}
      callBackvalue={() => {
        setIsShowPopUp(false)
      }}
    /> */}
    { uploaderState.currentPopup && (<PopupComponent
      open={uploaderState.isShowPopup}
      setShowPopUp={(value) => {
        if (!value) {
          uploaderAction.setIsShowPopup({isShowPopup: false})
        }
      }}
      modalTitle={uploaderState.currentPopup.modalTitle}
      modalmessage={uploaderState.currentPopup.modalMessage}
      primaryButtonLabel={uploaderState.currentPopup.primaryButtonLabel}
      SecondaryButtonlabel={uploaderState.currentPopup.secondaryButtonlabel}
      isShowWarningText={uploaderState.currentPopup.type === UploaderPopups.deleteJob ? true : false}
      isCancelCallBack={true}
      callBackvalue={() => {
        switch (uploaderState.currentPopup?.type) {
          case UploaderPopups.deleteJob:
            // setIsDelete(false)
            updateJobStatusBasedOnAction(true)
            uploaderAction.setIsShowPopup({isShowPopup: false})
            return
          case UploaderPopups.completedWithError:
            updateJobStatusBasedOnAction(false)
            uploaderAction.setIsShowPopup({isShowPopup: false})
            return
        }
      }}
      handleCancel={(value)=>{
        switch (uploaderState.currentPopup?.type) {
          case UploaderPopups.deleteJob:
            uploaderAction.setIsShowPopup({isShowPopup: false})
            return
          case UploaderPopups.completedWithError:
            if (value) {
              uploaderAction.setIsShowPopup({isShowPopup: true, popupType: UploaderPopups.deleteJob})
            } else {
              uploaderAction.setIsShowPopup({isShowPopup: false})
            }
            return
        }
      }}
    />)}
    </div>
  );
};

export default Index;
