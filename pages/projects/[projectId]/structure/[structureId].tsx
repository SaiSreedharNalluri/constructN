import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import NewGenViewer from "../../../../components/container/NewGenViewer";
import { IGenData } from "../../../../models/IGenData";
//import * as AAA from "multiverse-viewer";
//import {NewGenViewer, IGenData} from "multiverse-viewer/lib/cjs";
import { IDesign } from "../../../../models/IDesign";
import { getDesignTM } from "../../../../services/design";
import { getDesignPath } from "../../../../utils/S3Utils";
import { IGenPayload } from "../../../../models/IGenPayload";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getGenViewerData } from "../../../../services/genviewer";
const StructPage: React.FC = () => {
    //const [initData,setInintData] = useState<IGenData>(sampleGenData);
    const router = useRouter();
    let temp_list:IDesign[] ;
    //sampleGenData.structure.designs&& (temp_list= sampleGenData.structure.designs);
    let incomingPayload = useRef<IGenPayload>()
    let myProject = useRef<string>();
    useEffect(() => {
      if (router.isReady && router.query?.projectId) {
        myProject.current=router.query.projectId as string;
        getGenViewerData(router.query.projectId as string,router.query.structureId as string)
          .then((response) => {
            if (response.success === true) {
              console.log('IGendata API Response',response.result);
              setInintData(response.result);
            }
          })
          .catch((error) => {
            toast.error("failed to load data");
          });
        }
        },[router.isReady,router.query.projectId,router.query.structureId]);

    useEffect(()=>{
   
      window.addEventListener('notifyApp', notifyAppEvent);
      return()=>{
        window.removeEventListener('notifyApp', notifyAppEvent);
      }
    },[]);
    const notifyAppEvent =(e:any)=>{
      let cusEve: CustomEvent =e
      incomingPayload.current =  cusEve.detail;
      console.log(
        'My custom event triggered on APP :',
        incomingPayload?.current
        );
        switch(incomingPayload.current?.action?.type){
          case 'setStructure':
            console.log('App Set structure', myProject.current);
            getGenViewerData(myProject.current as string,incomingPayload.current.action.data as string)
          .then((response) => {
            if (response.success === true) {
              console.log('IGendata API Response',response.result);
              setInintData(response.result);
            }
          })
          .catch((error) => {
            toast.error("failed to load data");
          });

            break;

        }
    }
  //   const fetchTM = //useMemo(
  //     async ()=>{
  //     if(temp_list!==undefined)
  //      for (let design of temp_list) {
  //     if (!design.tm) {
  //       let response :any= await getDesignTM(
  //         getDesignPath(design.project, design.structure, design._id)
  //       );
  //       design.tm = response.data;
        
  //     }

  //   }
  //   sampleGenData.structure.designs=temp_list;
  //   console.log('My Comp Parent Refetch')
    
  // };
  // //,[sampleGenData]);
  // fetchTM();//useMemo
  const updateData= (newData:IGenData):void=>{
    console.log('My comp updated',newData);
    setInintData(newData);
  }
  //console.log("OVERHERE",sampleGenData.structure.designs);
  const [initData,setInintData] = useState<IGenData>();
//   useEffect(()=>{
//     console.log('My comp useEffect');
// setInintData(sampleGenData);
//   },[sampleGenData]);
  return (
    <React.Fragment>
      <div className="h-screen flex flex-col">
        {/* <div>
          <Header />
        </div>*/}
        <div className="flex flex-row left-0">
          {/* <CollapsableMenu onChangeData={() => {}} /> */}
          {/* <div><SidePanelMenu onChangeData={() => {}} /></div>  */}
         
          {
            initData&& <div><NewGenViewer data={initData} updateData={updateData}></NewGenViewer> </div>
          }
        </div>
        
      </div>
    </React.Fragment>
  );
};
export default StructPage;