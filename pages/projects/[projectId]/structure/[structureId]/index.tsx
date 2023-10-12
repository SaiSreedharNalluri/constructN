import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../../components/divami_components/side-panel/SidePanel";
import NewGenViewer from "../../../../../components/container/NewGenViewer";
import { getSnapshotsList } from '../../../../../services/snapshot';
import { IGenData } from "../../../../../models/IGenData";
//import * as AAA from "multiverse-viewer";
//import {NewGenViewer, IGenData} from "multiverse-viewer/lib/cjs";
import { IDesign } from "../../../../../models/IDesign";
import { getDesignTM } from "../../../../../services/design";
import { getDesignPath } from "../../../../../utils/S3Utils";
import { IGenPayload } from "../../../../../models/IGenPayload";
import { useRouter } from "next/router";
import { getGenViewerData } from "../../../../../services/genviewer";
import TimeLineComponent from "../../../../../components/divami_components/timeline-container/TimeLineComponent";
import { ISnapshot } from "../../../../../models/ISnapshot";
import { CustomToast } from "../../../../../components/divami_components/custom-toaster/CustomToast";

const StructPage: React.FC = () => {
    //const [initData,setInintData] = useState<IGenData>(sampleGenData);
    const router = useRouter();
    let temp_list:IDesign[] ;
    //sampleGenData.structure.designs&& (temp_list= sampleGenData.structure.designs);
    let incomingPayload = useRef<IGenPayload>()
    let myProject = useRef<string>();
    let myStructure = useRef<string>();
    let [snapshotListCal, setSnapshotListCal] = useState([]);
    let [selectedBaseSnapshot,setBaseSnapshot] =useState<ISnapshot>();
    let [selectedCompareSnapshot,setCompareSnapshot] =useState<ISnapshot>();
    let [snapshotList, setSnapshotList] = useState<ISnapshot[]>([]);
    let [snapshotCompareList, setSnapshotCompareList] = useState<ISnapshot[]>([]);
    const [offset, setOffset] = useState(1);
    const [compareOffset, setCompareOffset] = useState(1);
    const pageSize = 10;
    const [totalSnaphotsCount,setTotalSnaphotsCount] = useState(0);
    let [isFullScreenMode, setFullScreenMode] = useState(false);
  
    const [totalPages, setTotalPages] = useState(Math.ceil(totalSnaphotsCount / pageSize));

    useEffect(() => {
      if (router.isReady && router.query?.projectId) {
        myProject.current=router.query.projectId as string;
        myStructure.current = router.query.structureId as string;
        // getGenViewerData(router.query.projectId as string,router.query.structureId as string)
        //   .then((response) => {
        //     if (response.success === true) {
        //       console.log('IGendata API Response',response.result);
        //       setInintData(response.result);
        //       setBaseSnapshot(response.result.currentSnapshotBase);
        //       setCompareSnapshot(response.result.currentSnapshotCompare);
        //     }
        //   })
        //   .catch((error) => {
        //     console.log("Error in loading data: 1 ", error);
        //     CustomToast("failed to load data","error");
        //   });
        }
        },[router.isReady,router.query.projectId,router.query.structureId]);

    useEffect(()=>{
   
      window.addEventListener('notifyApp', notifyAppEvent);
      return()=>{
        window.removeEventListener('notifyApp', notifyAppEvent);
      }
    },[]);
    const getListOfSnapshots = async (projectId:string, structurId:string,offset:number=1,limit:number=10) => {
      let list : any = await getSnapshotsList(projectId, structurId,offset,limit);
      setTotalSnaphotsCount(list.data?.result?.totalSnapshots)
      setSnapshotListCal(list.data?.result?.calendarSnapshots)
      list = list.data.result.mSnapshots.sort(
        (a:ISnapshot, b:ISnapshot) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      //console.log("MyNewList ...", list);
      return list;
    };
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
              //setInintData(response.result);
              window.dispatchEvent(new CustomEvent('notifyViewer',{detail:{action:{type:'setStructure',data:response.result}}}));
              setBaseSnapshot(response.result.currentSnapshotBase);
              setCompareSnapshot(response.result.currentSnapshotCompare);
            }
          })
          .catch((error) => {
            console.log("Error in loading data: 2 ", error);
            CustomToast("failed to load data","error");
          });

            break;
          case 'syncGenViewer':
            //if(incomingPayload.current?.action?.data){ setInintData(incomingPayload.current?.action?.data as IGenData)}
            break;
          case 'getGenData':
           
            getGenViewerData(myProject.current as string,myStructure.current as string)
            .then((response) => {
              if (response.success === true) {
                console.log('IGendata API Response',response.result);
                setInintData(response.result);
                setBaseSnapshot(response.result.currentSnapshotBase);
                setCompareSnapshot(response.result.currentSnapshotCompare);
                setSnapshotList(response.result.snapshotList.slice(0,9).sort(
                  (a:ISnapshot, b:ISnapshot) => new Date(a.date).getTime() - new Date(b.date).getTime()
                ));
                setSnapshotCompareList(response.result.snapshotList.slice(0,9).sort(
                  (a:ISnapshot, b:ISnapshot) => new Date(a.date).getTime() - new Date(b.date).getTime()
                ));
                setSnapshotListCal(response.result.snapshotList);
                setTotalSnaphotsCount(response.result.snapshotList.length);
              }
            })
            .catch((error) => {
              console.log("Error in loading data: 1 ", error);
              CustomToast("failed to load data","error");
            });
         
            break;


        }


    }
  
  const updateData= (newData:IGenData):void=>{
    console.log('My comp updated',newData);
    setInintData(newData);
    setBaseSnapshot(newData.currentSnapshotBase);
    setCompareSnapshot(newData.currentSnapshotCompare);
  }
  //console.log("OVERHERE",sampleGenData.structure.designs);
  const [initData,setInintData] = useState<IGenData>();
//   useEffect(()=>{
//     console.log('My comp useEffect');
// setInintData(sampleGenData);
//   },[sampleGenData]);

useEffect(()=>{
  if(initData){
    console.log("InitData Loading..");
    window.dispatchEvent(new CustomEvent('notifyViewer',{detail:{action:{type:'loadGenViewer',data:(initData.currentViewType==='PlanDrawings')?'Plan Drawings':initData.currentViewType}}}));
  }
   

},[initData]);

useEffect(() => {
  setTotalPages(Math.ceil(totalSnaphotsCount / 10));
}, [totalSnaphotsCount]);

// const setPrevList = () => {
//   if (offset < totalPages) {
//     initData&&getSnapshotList(initData.project, initData?.structure._id, offset + 1, pageSize);
//     setOffset(offset + 1);
//     // setPage(0);
//   }
// };
// const setNewList = (newOffset:number,snap:string) => {
//   if (offset < totalPages) {
//     initData&&getSnapshotList(initData.project, initData?.structure._id, newOffset, pageSize,snap);
//     setOffset(newOffset);
    
//     //setPage(newPage);
//   }
// };
// const setNextList = () => {
//   if (offset > 1) {
//     initData&&getSnapshotList(initData.project, initData.project, offset - 1, pageSize);

//     setOffset(offset - 1);
//     // setPage(0);
//   }
// };

const setPrevList = async (key:string) => {
 
  let myList :ISnapshot[];
  switch (key){
    case "1":
      console.log("... Clicked Prev List")
      if((offset<totalPages) && initData){
        myList = await getListOfSnapshots(initData.project, initData.structure._id, offset + 1, pageSize);
        console.log("myList returned ...", myList)
        if (myList.length>0){
          
          setSnapshotList(myList);
          if(router.query.snap!==null)
          {
            let mySnap=myList.find((s:ISnapshot)=>{if(s._id==router.query.snap)return s;})
            if (mySnap) setCurrentSnapshot(mySnap);
            else setCurrentSnapshot(myList[myList.length - 1]);
          }
          else{
            setCurrentSnapshot(myList[myList.length - 1]);
          }
        }
        else{
          setSnapshotList([]);

        }
        setOffset(offset + 1)
      }
      break;
    case "2":
      if((compareOffset<totalPages) && initData){
        myList = await getListOfSnapshots(initData.project, initData.structure._id, compareOffset + 1, pageSize);
        if (myList.length>0){
          setSnapshotCompareList(myList);
          if(router.query.snap!==null)
          {
            let mySnap=myList.find((s:ISnapshot)=>{if(s._id==router.query.snap)return s;})
            if (mySnap) setCurrentCompareSnapshot(mySnap);
            else setCurrentCompareSnapshot(myList[myList.length - 1]);
          }
          else{
            setCurrentCompareSnapshot(myList[myList.length - 1]);
          }
        }
        else{
          setSnapshotCompareList([]);

        }
        setCompareOffset(compareOffset + 1)
      }
      break;
  }
};
const setNewList = async(newOffset:number,snap:string,key:string) => {
  let myList:ISnapshot[];
  switch (key){
    case "1":
      if((newOffset<=totalPages)&&initData){
        myList = await getListOfSnapshots(initData.project, initData.structure._id, newOffset, pageSize);
        if (myList.length>0){
          setSnapshotList(myList);
          if(snap && router.query.snap!==null)
          {
            let mySnap=myList.find((s:ISnapshot)=>{if(s._id==snap)return s;})
            if (mySnap) setCurrentSnapshot(mySnap);
            else setCurrentSnapshot(myList[myList.length - 1]);
          }
          else{
            setCurrentSnapshot(myList[myList.length - 1]);
          }
        }
        else{
          setSnapshotList([]);

        }
        setOffset(newOffset)
      }
      break;
    case "2":
      if((newOffset<=totalPages)&&initData){
        myList = await getListOfSnapshots(initData.project, initData.structure._id, newOffset, pageSize);
        if (myList.length>0){
          setSnapshotCompareList(myList);
          if(snap && router.query.snap!==null)
          {
            let mySnap=myList.find((s:ISnapshot)=>{if(s._id==snap)return s;})
            if (mySnap) setCurrentCompareSnapshot(mySnap);
            else setCurrentCompareSnapshot(myList[myList.length - 1]);
          }
          else{
            setCurrentCompareSnapshot(myList[myList.length - 1]);
          }
        }
        else{
          setSnapshotCompareList([]);

        }
        setCompareOffset(newOffset)
      }
      break;
  }
};

const setNextList = async (key:string) => {
  let myList:ISnapshot[];
  switch (key){
    case "1":
      if((offset>1)&&initData){
        myList = await getListOfSnapshots(initData.project, initData.structure._id, offset - 1, pageSize);
        if (myList.length>0){
          setSnapshotList(myList);
          if(router.query.snap!==null)
          {
            let mySnap=myList.find((s:ISnapshot)=>{if(s._id==router.query.snap)return s;})
            if (mySnap) setCurrentSnapshot(mySnap);
            else setCurrentSnapshot(myList[myList.length - 1]);
          }
          else{
            setCurrentSnapshot(myList[myList.length - 1]);
          }
        }
        else{
          setSnapshotList([]);

        }
        setOffset(offset - 1)
      }
      break;
    case "2":
      if((compareOffset>1)&&initData){
        myList = await getListOfSnapshots(initData.project, initData.structure._id, compareOffset - 1, pageSize);
        if (myList.length>0){
          setSnapshotCompareList(myList);
          if(router.query.snap!==null)
          {
            let mySnap=myList.find((s:ISnapshot)=>{if(s._id==router.query.snap)return s;})
            if (mySnap) setCurrentCompareSnapshot(mySnap);
            else setCurrentCompareSnapshot(myList[myList.length - 1]);
          }
          else{
            setCurrentCompareSnapshot(myList[myList.length - 1]);
          }
        }
        else{
          setSnapshotCompareList([]);

        }
        setCompareOffset(compareOffset - 1)
      }
      break;
  }
};

const setCurrentSnapshot = (snapshot:ISnapshot) => {
  if(snapshot){
    incomingPayload.current= {action:{type:'setBaseSnapshot',data:snapshot as ISnapshot}}
    window.dispatchEvent(new CustomEvent('notifyViewer',{detail:incomingPayload.current}));
    setBaseSnapshot(snapshot);

}

};

const setCurrentCompareSnapshot = (snapshot:ISnapshot) => {
  if(snapshot){
    incomingPayload.current= {action:{type:'setCompareSnapshot',data:snapshot as ISnapshot}}
    window.dispatchEvent(new CustomEvent('notifyViewer',{detail:incomingPayload.current}));
    setCompareSnapshot(snapshot);
  }
};

// const getSnapshotList = async (projectId:string, structurId:string,offset:Number,limit:Number,setSnap:string="") => {
//   let list= await getSnapshotsList(projectId, structurId,offset||1,limit||10);
//   setTotalSnaphotsCount(list.data?.result?.totalSnapshots)
//   //let list:ISnapshot[];
//   //setSnapshotList()
//   let snapList:ISnapshot[] = list.data.result.mSnapshots.sort(
//     (a:ISnapshot, b:ISnapshot) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   );
//   setSnapshotList(snapList);
//   if (snapList.length>0 && setSnap!==""){
//     let mySnap=snapList.find((s)=>{if(s._id==setSnap)return s;})
//     //setSnapshotList(snapList);
//     if (mySnap){
//       setCurrentSnapshot(mySnap);
//       setCurrentCompareSnapshot(snapList[snapList.length - 1]); 
//     }
//     else {
//     setCurrentSnapshot(snapList[snapList.length - 1]);
//     if (snapList.length > 1) {
//       setCurrentCompareSnapshot(snapList[snapList.length - 2]);
//     } 
//     else {
//       setCurrentCompareSnapshot(snapList[snapList.length - 1]);
//     }
//   }
//   }
//   else if(snapList.length>0 && router.query.snap!=null){
//     let mySnap=snapList.find((s)=>{if(s._id==router.query.snap)return s;})
//     //setSnapshotList(snapList);
//     if (mySnap)
//     setCurrentSnapshot(mySnap);
//     else 
//     setCurrentSnapshot(snapList[snapList.length - 1]);
//     if (snapList.length > 1) {
//       setCurrentCompareSnapshot(snapList[snapList.length - 2]);
//     } 
//     else {
//       setCurrentCompareSnapshot(snapList[snapList.length - 1]);
//     }
//   }
//   else if (snapList.length > 0) {
//     //setSnapshotList(snapList);
//     //dispatchChangeViewerData();
//     setCurrentSnapshot(snapList[snapList.length - 1]);
//     if (snapList.length > 1) {
//       setCurrentCompareSnapshot(snapList[snapList.length - 2]);
//     } else {
//       setCurrentCompareSnapshot(snapList[snapList.length - 1]);
//     }
//   }
// };
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
            tmcBase={<TimeLineComponent currentSnapshot={selectedBaseSnapshot|| initData.currentSnapshotBase} snapshotList={snapshotList} snapshotHandler={setCurrentSnapshot} isFullScreen={isFullScreenMode} getSnapshotList={getListOfSnapshots} 
                    setPrevList={setPrevList}
                    setNextList={setNextList}
                    setNewList={setNewList}
                    totalPages={totalPages}
                    snapshotListCal={snapshotListCal} 
                    offset={offset} _id={"1"} totalSnaphotsCount={totalSnaphotsCount} structure={initData.structure}></TimeLineComponent>}
            tmcCompare={<TimeLineComponent currentSnapshot={selectedCompareSnapshot||initData.currentSnapshotCompare||initData.currentSnapshotBase} snapshotList={snapshotCompareList} snapshotHandler={setCurrentCompareSnapshot} isFullScreen={isFullScreenMode} getSnapshotList={getListOfSnapshots} setPrevList={setPrevList}
                        setNextList={setNextList}
                        setNewList={setNewList}
                        totalPages={totalPages}
                        snapshotListCal={snapshotListCal} 
                        offset={compareOffset} _id={"2"} totalSnaphotsCount={totalSnaphotsCount} structure={initData.structure}></TimeLineComponent>}
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