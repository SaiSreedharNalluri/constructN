import React, { useEffect, useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import UploaderDateDetails from "../../../../components/divami_components/uploader_details/uploaderDetails";
import UploaderFiles from "../../../../components/divami_components/uploader_details/uploaderFiles";
import UploaderStepper from "../../../../components/divami_components/uploader_details/uploaderStepper";
import UploaderFooter from "../../../../components/divami_components/uploader_details/uploaderFooter"; 
import { UploaderContextProvider, useUploaderContext } from "../../../../state/uploaderState/context";
import { UploaderStep } from "../../../../state/uploaderState/state";
import UploaderFinal from "../../../../components/divami_components/uploader_details/uploaderFinal/uploaderFinal";
import UploaderGCP from "../../../../components/divami_components/uploader_details/uploaderGCP";
import UploaderReview from "../../../../components/divami_components/uploader_details/uploaderReview";
import { addCapture, addRawImages } from "../../../../services/captureManagement";
import { uploaderContextActions } from "../../../../state/uploaderState/action";
import { RawImage, RawImageCreateResp } from "../../../../models/IRawImages";
import { WebWorkerManager } from "../../../../utils/webWorkerManager";

interface IProps {}
const Index: React.FC<IProps> = () => {
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
        mode:'Drone Image',
        type: "exterior",
        structure: uploaderState.structure?._id as string,
        captureDateTime: uploaderState.date as Date
      }).then((response)=>{
        if(response.success===true)
        {
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
    const sendingFilesToworker=(FileList:RawImageCreateResp[],captureId:string)=>{
      uploaderAction.next()
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
      worker.onmessage = (event) => {
        console.log('event',event.data)
      }
    
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
        
            <div className="fixed m-4px  bg-transparent left-6 bottom-0 right-4  p-4 ">


          <UploaderFooter/>
        </div>
        
      </div>
  );
};

export default Index;
