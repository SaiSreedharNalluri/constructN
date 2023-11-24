import React, { useEffect, useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import UploaderDateDetails from "../../../../components/divami_components/uploader_details/uploaderDetails";
import UploaderFiles from "../../../../components/divami_components/uploader_details/uploaderFiles";
import UploaderStepper from "../../../../components/divami_components/uploader_details/uploaderStepper";
import UploaderFooter from "../../../../components/divami_components/uploader_details/uploaderFooter"; 
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { UploaderFinishState, UploaderStep, captureRawImageMap } from "../../../../state/uploaderState/state";
import UploaderFinal from "../../../../components/divami_components/uploader_details/uploaderFinal/uploaderFinal";
import UploaderGCP from "../../../../components/divami_components/uploader_details/uploaderGCP";
import UploaderReview from "../../../../components/divami_components/uploader_details/uploaderReview";
import { addCapture, addGcp, addRawImages, getCaptureDetails, getRawImages } from "../../../../services/captureManagement";
import { RawImage, RawImageCreateResp } from "../../../../models/IRawImages";
import { WebWorkerManager } from "../../../../utils/webWorkerManager";
import { useRouter } from "next/router";
import { ChildrenEntity } from "../../../../models/IStructure";
import { getStructureHierarchy } from "../../../../services/structure";
import { useAppContext } from "../../../../state/appState/context";
import { getJobsByStatus, getJobsByStatusMode, getjobs, updateJobStatus } from "../../../../services/jobs";
import { IJobs, JobStatus } from "../../../../models/IJobs";
import { CaptureMode, CaptureType, ICapture } from "../../../../models/ICapture";
import { IUploadFile, UploadStatus } from "../../../../models/IUploader";
import CustomLoader from '../../../../components/divami_components/custom_loader/CustomLoader';
import { Content } from "../../../../components/divami_components/project-users-list/usersListStyles";
import { getCaptureIdFromModelOrString, getJobIdFromModelOrString } from "../../../../utils/utils";
import { CustomToast } from "../../../../components/divami_components/custom-toaster/CustomToast";
interface IProps {}
const Index: React.FC<IProps> = () => {
  const router = useRouter();
  const { state: appState, appContextAction } = useAppContext();
  const { appAction } = appContextAction;
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [prjId,setprojId] =useState()
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
    getJobsByStatusMode(projectId, [JobStatus.pendingUpload, JobStatus.uploaded], uploaderState.captureMode).then((response)=>{
      console.log("TestingUploader: getJobs", response.data.result)
      let jobs: IJobs[] = response.data.result;
      uploaderAction.setCaptureJobs(jobs)
      uploaderAction.setIsLoading(false)
    }).catch((error)=>{
      console.log("Error: ", error)
    })
  }
  
  /**
   * UseEffect to get Structure Hierarchy of the project if it is not already present in AppState
   */
  useEffect(() => {
    let hierarchy = appState.hierarchy
    if (router.isReady) {
      if(hierarchy) {
         if(hierarchy[0]?.project===localStorage.getItem("projectId")){
          uploaderAction.setResetUploaderState();
          console.log(' project id same')
          getStructureHierarchy(router.query.projectId as string)
          .then((response) => {
            let hierarchyList: ChildrenEntity[] = response.data.result
            appAction.setHierarchy(hierarchyList)
          //  setState(hierarchyList);
          
          })
        }else{
          uploaderAction.setResetUploaderState();
          localStorage.setItem("projectId",hierarchy[0]?.project)
        }
       
      } else {
        console.log('come out of the function');
        getStructureHierarchy(router.query.projectId as string)
          .then((response) => {
            let hierarchyList: ChildrenEntity[] = response.data.result
            appAction.setHierarchy(hierarchyList)
          //  setState(hierarchyList);
          
          })
       
      }
    }
  }, [router.isReady, router.query.projectId, router.query.structId]);

  useEffect(() => {
    console.log("TestingUploader updateJobs UseEffect: ", uploaderState.updateJobs, router.query.projectId as string)
    if(uploaderState.updateJobs && router.query.projectId as string) {
      refreshJobs(router.query.projectId as string)
    }
  }, [uploaderState.updateJobs])

  /**
   * UseEffect to 
   */
  useEffect(()=>{
    if (router.isReady){
      refreshJobs(router.query.projectId as string)
    }
  },[router.isReady, router.query.projectId])

  /**
   * useEffect to show loading animation
   */
  useEffect(() => {

  }, [uploaderState.isLoading])

  useEffect(() => {
    if(uploaderState.pendingUploadJobs.length > 0) {
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
      })
    } else {

    }
  }, [uploaderState.pendingUploadJobs.length])

  useEffect(() => {
    if(uploaderState.completionState !== undefined) {
      switch(uploaderState.completionState) {
        case UploaderFinishState.withError:

          return
        case UploaderFinishState.withoutError:

          return
        default:
          return
      }
    }
  }, [uploaderState.completionState])

  useEffect(()=>{
    if(uploaderState.uploadinitiate)
    {
      CustomToast('Initialing upload...','success')
      uploaderAction.setIsLoading(true)
      if (uploaderState.isAppendingCapture && uploaderState.selectedJob) {
        addGcpToCapture(uploaderState.selectedJob)
      } else {
      addCapture(uploaderState.project?._id as string,{
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
          let captureJobs = uploaderState.pendingProcessJobs.concat(uploaderState.pendingUploadJobs)
          captureJobs.push(job)
          uploaderAction.setCaptureJobs(captureJobs)
          uploaderAction.setSelectedJob(job)
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
        uploaderAction.changeUploadinitiate(false)
        uploaderAction.next()
        // uploaderAction.refreshJobs();
        sendingFilesToworker(response.result, job)
        uploaderAction.setIsLoading(false)
        CustomToast(`Started uploading ${uploaderState?.choosenFiles?.validFiles?.length} file(s)`,'success')
      }
    }).catch((error)=>{
      uploaderAction.setIsLoading(false)
      uploaderAction.changeUploadinitiate(false)
      CustomToast('Something went wrong. Please try again after some time.','error')
    })
  }

  const sendingFilesToworker=(fileList:RawImageCreateResp[], job: IJobs)=>{
    let captureId = getCaptureIdFromModelOrString(job.captures[0])  
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
    let worker = new Worker(new URL('../../../../components/divami_components/web_worker/fileUploadManager.ts',import.meta.url), {name: captureId});
    WorkerManager.createWorker(captureId,worker)
    worker.onmessage = onMessageFromWorker;
    worker.postMessage(uploadFiles);
    // uploaderAction.next()
  }
  const updateTheJobStatus=(captureId:string)=>{
    let captureObj = uploaderState.pendingUploadJobs.find((jobObj)=> getCaptureIdFromModelOrString(jobObj.captures[0]) === captureId)
    if (captureObj) {
      updateJobStatus(uploaderState?.project?._id as string, captureObj._id,'uploaded').then((response)=>{
        if(response.data.success===true) {
          console.log('dfuykfdghjdf',uploaderState.inProgressWorkers)
        }
      }).catch((error)=>{
        console.log('errror',error)
      })
      } else {
        getCaptureDetails(uploaderState?.project?._id as string, captureId).then((response) => {
          if(response.data.success===true) {
            let capture = response.data.result
            updateJobStatus(uploaderState?.project?._id as string, getJobIdFromModelOrString(capture.jobId), JobStatus.uploaded).then((response)=>{
              if(response.data.success===true) {
                // uploaderAction.refreshJobs();
                uploaderAction.setUploadCompletionState(UploaderFinishState.withoutError)
              } else {
                uploaderAction.setUploadCompletionState(UploaderFinishState.withError)
              }
            }).catch((error)=>{
              console.log('errror',error)
            })
          }
        })
      }
  }
  const onMessageFromWorker = function(this:Worker,event: MessageEvent<{filesList: IUploadFile<RawImage>[], completedFileList: IUploadFile<RawImage>[]}>){
    uploaderAction.updateWorkerStatus(event.data.filesList)
    if(event?.data?.filesList?.length != undefined && event?.data?.completedFileList?.length !=undefined && (event?.data?.filesList?.length === event?.data?.completedFileList?.length))
    {
      updateTheJobStatus(event?.data?.filesList[0]?.uploadObject?.capture as string)
      this.terminate()
    }
  }

  const beforeUnloadHandler = (event:BeforeUnloadEvent) => {
    event.preventDefault();
     event.returnValue = true;
  };
  const popStateHandler =()=>{
    alert('You have unsaved changes.you may lose your data')
    history.pushState(null, '', document.URL); 
  }
  useEffect(()=>{
    if(uploaderState.step != UploaderStep.Upload)
    {
      window.addEventListener("beforeunload", beforeUnloadHandler);
      history.pushState(null, '', document.URL); 
      window.addEventListener('popstate',popStateHandler)
    }
   return () => { 
    window.removeEventListener('beforeunload',beforeUnloadHandler)
    window.removeEventListener('popstate',popStateHandler)
    };
  },[typeof window !== "undefined",uploaderState.step])
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
        <div>
              {
              uploaderState.stepperSideFileList &&(<UploaderStepper />)
            }
             </div>
        </header>
     {!uploaderState.isLoading?  
  <div>
        <main className={`overflow-y-auto  ${ uploaderState.stepperSideFileList?`calc-h253`:`calc-h`} `}>
          <div>
          {renderCenterContent()}
           
          </div>
        </main>
  
        <footer className="py-[4px] text-center">
        <UploaderFooter/>
        </footer></div>:<CustomLoader/>}
      </div>
    </div>
    <div >
            
            </div>
  </div>
  );
};

export default Index;
