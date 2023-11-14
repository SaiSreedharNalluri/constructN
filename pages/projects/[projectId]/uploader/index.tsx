import React, { useEffect, useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import UploaderDateDetails from "../../../../components/divami_components/uploader_details/uploaderDetails";
import UploaderFiles from "../../../../components/divami_components/uploader_details/uploaderFiles";
import UploaderStepper from "../../../../components/divami_components/uploader_details/uploaderStepper";
import UploaderFooter from "../../../../components/divami_components/uploader_details/uploaderFooter"; 
import { UploaderContextProvider, useUploaderContext } from "../../../../state/uploaderState/context";
import { UploaderStep, captureRawImageMap } from "../../../../state/uploaderState/state";
import UploaderFinal from "../../../../components/divami_components/uploader_details/uploaderFinal/uploaderFinal";
import UploaderGCP from "../../../../components/divami_components/uploader_details/uploaderGCP";
import UploaderReview from "../../../../components/divami_components/uploader_details/uploaderReview";
import { addCapture, addRawImages, getRawImages } from "../../../../services/captureManagement";
import { uploaderContextActions } from "../../../../state/uploaderState/action";
import { RawImage, RawImageCreateResp } from "../../../../models/IRawImages";
import { WebWorkerManager } from "../../../../utils/webWorkerManager";
import { useRouter } from "next/router";
import { ChildrenEntity } from "../../../../models/IStructure";
import { getStructureHierarchy } from "../../../../services/structure";
import { useAppContext } from "../../../../state/appState/context";
import { getjobs } from "../../../../services/jobs";
import { IJobs } from "../../../../models/IJobs";
import { string } from "yup";
import { CaptureMode, CaptureType, ICapture } from "../../../../models/ICapture";

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
  useEffect(()=>{
    if(uploaderState.uploadinitiate)
    {
      addCapture(uploaderState.project?._id as string,{
        mode: CaptureMode.droneImage,
        type: CaptureType.exterior,
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

  useEffect(()=>{
    if (router.isReady && uploaderState.step === UploaderStep.Upload ){
      getjobs(router.query.projectId as string).then((response)=>{
        console.log("TestingUploader: getJobs", response.data.result)
        let jobs: IJobs[] = response.data.result;
        uploaderAction.setCaptureJobs(jobs)
      }).catch((error)=>{
        console.log("Error: ", error)
      })
    }
  },[router.isReady, router.query.projectId, uploaderState.step])

  useEffect(() => {
    if(uploaderState.pendingUploadJobs.length > 0) {
      Promise.all(uploaderState.pendingUploadJobs.map((job) => {
        let captureId = ""
        if((job.captures[0] as ICapture)._id) {
          captureId = (job.captures[0] as ICapture)._id
        } else {
          captureId = job.captures[0] as string
        }
        return getRawImages(router.query.projectId as string, captureId)
      })).then((response) =>{
        console.log('enter getraw iamges')
        let rawImagesMap = response.reduce<captureRawImageMap>((prev, current):captureRawImageMap => {
          if (current.data.success) {
            let rawImages = current.data.result
            if (rawImages[0]?.capture) {
              console.log('raw images')
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
        console.log("TestingUploader: rawImagesMap ", rawImagesMap)
        uploaderAction.setRawImagesMap(rawImagesMap);
      })
    } else {

    }
  }, [uploaderState.pendingUploadJobs.length])
   const addGcpToCapture=(captureId:string)=>{
       if(uploaderState.skipGCP===false)
       {

       }else{
        addRawImagesTOCapture(captureId)
       }
    }
    const addRawImagesTOCapture=(captureId:string)=>{

      console.log("addRaw image console",uploaderState?.choosenFiles?.validFiles?.map(({file,...rawImage})=>rawImage))
      addRawImages(uploaderState.project?._id as string,captureId,uploaderState?.choosenFiles?.validFiles?.map(({file,...rawImage})=>rawImage)).then((response)=>{
        if(response.success===true)
        {
            sendingFilesToworker(response.result,captureId)
            uploaderAction.changeUploadinitiate(false)
        }
      })
    }
    const sendingFilesToworker=(FileList:RawImageCreateResp[],captureId:string)=>{
      const fileListWithUrl:Array<{ file: File, putSignedURL: string }> | null= uploaderState?.choosenFiles?.validFiles?.map(item => {
        const matchingItem:any = new Map(FileList&& FileList.map(item => [item.externalId, item])).get(item.externalId);
        if (matchingItem) {
          return {
            file: item.file,
            putSignedURL: matchingItem.putSignedURL,
          };
        }
        return null; // If no matching item found in input2
      }).filter((item): item is { file: File; putSignedURL: string } => item !== null);
     let worker = new Worker(new URL('../../../../components/divami_components/web_worker/fileUploadManager.ts',import.meta.url));
      WorkerManager.createWorker(captureId,worker)
      worker.postMessage({fileListWithUrl});
      uploaderAction.next()
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
