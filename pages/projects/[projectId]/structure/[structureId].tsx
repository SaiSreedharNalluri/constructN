import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import NewGenViewer from "../../../../components/container/NewGenViewer";
import { getSnapshotsList } from '../../../../services/snapshot';
import { IGenData } from "../../../../models/IGenData";
//import * as AAA from "multiverse-viewer";
//import {NewGenViewer, IGenData} from "multiverse-viewer/lib/cjs";
import { IDesign } from "../../../../models/IDesign";
import { getDesignTM } from "../../../../services/design";
import { getDesignPath } from "../../../../utils/S3Utils";
import { IGenPayload } from "../../../../models/IGenPayload";
import { useRouter } from "next/router";
import { getGenViewerData } from "../../../../services/genviewer";
import TimeLineComponent from "../../../../components/divami_components/timeline-container/TimeLineComponent";
import { ISnapshot } from "../../../../models/ISnapshot";
import { CustomToast } from "../../../../components/divami_components/custom-toaster/CustomToast"
const StructPage: React.FC = () => {
    //const [initData,setInintData] = useState<IGenData>(sampleGenData);
    const router = useRouter();
    let temp_list:IDesign[] ;
    //sampleGenData.structure.designs&& (temp_list= sampleGenData.structure.designs);
    let incomingPayload = useRef<IGenPayload>()
    let myProject = useRef<string>();

    const [offset, setOffset] = useState(1);
    const pageSize = 10;
    const [totalSnaphotsCount,setTotalSnaphotsCount] = useState(0);
    let [isFullScreenMode, setFullScreenMode] = useState(false);
  
    const [totalPages, setTotalPages] = useState(Math.ceil(totalSnaphotsCount / pageSize));

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
            CustomToast("failed to load data","error");
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
            CustomToast("failed to load data","error");
          });

            break;
          case 'syncGenViewer':
            //if(incomingPayload.current?.action?.data){ setInintData(incomingPayload.current?.action?.data as IGenData)}
            break;


        }


    }
  
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

useEffect(() => {
  setTotalPages(Math.ceil(totalSnaphotsCount / 10));
}, [totalSnaphotsCount]);

const setPrevList = () => {
  if (offset < totalPages) {
    initData&&getSnapshotList(initData.project, initData?.structure._id, offset + 1, pageSize);
    setOffset(offset + 1);
    // setPage(0);
  }
};

const setNextList = () => {
  if (offset > 1) {
    initData&&getSnapshotList(initData.project, initData?.structure._id, offset - 1, pageSize);

    setOffset(offset - 1);
    // setPage(0);
  }
};

const setCurrentSnapshot = (snapshot:ISnapshot) => {
  if(snapshot){
    incomingPayload.current= {action:{type:'setBaseSnapshot',data:snapshot as ISnapshot}}
    window.dispatchEvent(new CustomEvent('notifyViewer',{detail:incomingPayload.current}));

}

};

const setCurrentCompareSnapshot = (snapshot:ISnapshot) => {
  if(snapshot){
    incomingPayload.current= {action:{type:'setCompareSnapshot',data:snapshot as ISnapshot}}
    window.dispatchEvent(new CustomEvent('notifyViewer',{detail:incomingPayload.current}));

  }
};

const getSnapshotList = async (projectId:string, structurId:string,offset:Number,limit:Number) => {
  let list= await getSnapshotsList(projectId, structurId,offset||1,limit||10);
  setTotalSnaphotsCount(list.data?.result?.totalSnapshots)
  //let list:ISnapshot[];
  let snapList:ISnapshot[] = list.data.result.mSnapshots.sort(
    (a:ISnapshot, b:ISnapshot) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  if (snapList.length > 0) {
    //setSnapshotList(list);
    //dispatchChangeViewerData();
    setCurrentSnapshot(snapList[snapList.length - 1]);
    if (snapList.length > 1) {
      setCurrentCompareSnapshot(snapList[snapList.length - 2]);
    } else {
      setCurrentCompareSnapshot(snapList[snapList.length - 1]);
    }
  }
};
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
            initData&& <div><NewGenViewer 
            tmcBase={<TimeLineComponent currentSnapshot={initData.currentSnapshotBase} snapshotList={initData.snapshotList} snapshotHandler={setCurrentSnapshot} isFullScreen={isFullScreenMode} getSnapshotList={getSnapshotList} setPrevList={setPrevList}
            setNextList={setNextList}
            totalPages={totalPages}
            offset={offset} totalSnaphotsCount={totalSnaphotsCount} structure={initData.structure}></TimeLineComponent>}
            tmcCompare={<TimeLineComponent currentSnapshot={initData.currentSnapshotCompare||initData.currentSnapshotBase} snapshotList={initData.snapshotList} snapshotHandler={setCurrentCompareSnapshot} isFullScreen={isFullScreenMode} getSnapshotList={getSnapshotList} setPrevList={setPrevList}
            setNextList={setNextList}
            totalPages={totalPages}
            offset={offset} totalSnaphotsCount={totalSnaphotsCount} structure={initData.structure}></TimeLineComponent>}
            data={initData} updateData={updateData}></NewGenViewer> </div>
            
          }
          {/* {initData&&<div className=""><TimeLineComponent currentSnapshot={initData.currentSnapshotBase} snapshotList={initData.snapshotList} snapshotHandler={setCurrentSnapshot} isFullScreen={isFullScreenMode} getSnapshotList={getSnapshotList} setPrevList={setPrevList}
        setNextList={setNextList}
        totalPages={totalPages}
        offset={offset} totalSnaphotsCount={totalSnaphotsCount} structure={initData.structure}></TimeLineComponent> </div>
        
        } */}
        </div>
      </div>
    </React.Fragment>
  );
};
export default StructPage;