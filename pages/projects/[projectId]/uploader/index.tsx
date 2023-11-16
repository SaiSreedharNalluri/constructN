import React, { useEffect } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import UploaderDateDetails from "../../../../components/divami_components/uploader_details/uploaderDetails";
import UploaderFiles from "../../../../components/divami_components/uploader_details/uploaderFiles";
import UploaderStepper from "../../../../components/divami_components/uploader_details/uploaderStepper";
import UploaderFooter from "../../../../components/divami_components/uploader_details/uploaderFooter"; 
import { useUploaderContext } from "../../../../state/uploaderState/context";
import { UploaderStep, captureRawImageMap } from "../../../../state/uploaderState/state";
import UploaderFinal from "../../../../components/divami_components/uploader_details/uploaderFinal/uploaderFinal";
import UploaderGCP from "../../../../components/divami_components/uploader_details/uploaderGCP";
import UploaderReview from "../../../../components/divami_components/uploader_details/uploaderReview";
import { addCapture, addGcp, addRawImages, getRawImages } from "../../../../services/captureManagement";
import { uploaderContextActions } from "../../../../state/uploaderState/action";
import { RawImage, RawImageCreateResp } from "../../../../models/IRawImages";
import { WebWorkerManager } from "../../../../utils/webWorkerManager";
import { useRouter } from "next/router";
import { ChildrenEntity } from "../../../../models/IStructure";
import { getStructureHierarchy } from "../../../../services/structure";
import { useAppContext } from "../../../../state/appState/context";
import { getJobsByStatus, getjobs } from "../../../../services/jobs";
import { IJobs, JobStatus } from "../../../../models/IJobs";
import { string } from "yup";
import { CaptureMode, CaptureType, ICapture } from "../../../../models/ICapture";
import { IUploadFile, UploadStatus, UploadType } from "../../../../models/IUploader";

interface IProps {}
const Index: React.FC<IProps> = () => {
  const router = useRouter();
  const { state: appState, appContextAction } = useAppContext();
  const { appAction } = appContextAction;
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;

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
  
  /**
   * UseEffect to get Structure Hierarchy of the project if it is not already present in AppState
   */
  useEffect(() => {
    if (router.isReady) {
      let hierarchy = appState.hierarchy
      if(hierarchy) {
       // setState(hierarchy)
      } else {
        getStructureHierarchy(router.query.projectId as string)
        .then((response) => {
          let hierarchyList: ChildrenEntity[] = response.data.result
          appAction.setHierarchy(hierarchyList)
        //  setState(hierarchyList);
        })
      }
    }
  }, [router.isReady, router.query.projectId, router.query.structId]);

  /**
   * UseEffect to 
   */
  useEffect(()=>{
    if (router.isReady && uploaderState.step === UploaderStep.Upload ){
      uploaderAction.setIsLoading(true)
      getJobsByStatus(router.query.projectId as string, [JobStatus.pendingUpload, JobStatus.uploaded]).then((response)=>{
        console.log("TestingUploader: getJobs", response.data.result)
        let jobs: IJobs[] = response.data.result;
        uploaderAction.setCaptureJobs(jobs)
        uploaderAction.setIsLoading(false)
      }).catch((error)=>{
        console.log("Error: ", error)
      })
    }
  },[router.isReady, router.query.projectId, uploaderState.step])

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

  useEffect(()=>{
    if(uploaderState.uploadinitiate)
    {
      addCapture(uploaderState.project?._id as string,{
        mode: uploaderState.captureMode,
        type: uploaderState.captureType,
        structure: uploaderState.structure?._id as string,
        captureDateTime: uploaderState.date as Date
      }).then((response)=>{
        if(response.success===true)
        {
          console.log("TestingUploader: add capture success ", response?.result?._id);
          addGcpToCapture(response?.result?._id)
        }
        
      }).catch((error)=>{
        console.log('error',error)
      })
      
    }
  },[uploaderState.uploadinitiate])

  const addGcpToCapture=(captureId:string)=>{
      if(uploaderState.skipGCP===false)
      {     

          addGcp(uploaderState.project?._id as string,captureId,uploaderState.gcpList).then((response)=>{
            if(response.success===true){
              addRawImagesTOCapture(captureId)
            }
           })
        }else{
      addRawImagesTOCapture(captureId)
      }
  }
  const addRawImagesTOCapture=(captureId:string)=>{
      
    addRawImages(uploaderState.project?._id as string,captureId,uploaderState?.choosenFiles?.validFiles?.map(({file,...rawImage})=>rawImage)).then((response)=>{
      if(response.success===true)
      {
          sendingFilesToworker(response.result,captureId)
          uploaderAction.changeUploadinitiate(false)
      }
    })
  }
  const sendingFilesToworker=(fileList:RawImageCreateResp[],captureId:string)=>{
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
    uploaderAction.next()
  }

  const onMessageFromWorker = function (this: Worker, event: MessageEvent<{filesList: IUploadFile<RawImage>[], completedFileList: IUploadFile<RawImage>[]}>) {
    console.log("TestingUploader: worker mesaage ", event, this);
    uploaderAction.updateWorkerStatus(event.data.filesList)
  }
    
  return (
    <div>
      <div>
        <Header showBreadcrumbs breadCrumbData={[]} showFirstElement={true}></Header>
      </div>
      <div className="flex w-full fixed">
        <div>
          <SidePanelMenu onChangeData={() => {}}></SidePanelMenu>
        </div>
        <div className="calc-w calc-h mx-2 p-1 overflow-y-auto flex-1">
          {
            uploaderState.stepperSideFileList &&(<UploaderStepper />)
          }
          <div className="flex-1 content-container max-h-[400px]">{renderCenterContent()}</div>
        </div>
        </div>
        
            <div className="fixed m-4px  bg-transparent left-6 bottom-0 right-4  p-2 ">


          <UploaderFooter/>
        </div>
        
      </div>
  );
};

export default Index;
