import Script from 'next/script';
import Moment from 'moment';
import React, { useEffect, useState, memo, useRef, useCallback, useReducer } from 'react';
import Head from 'next/head';
import Header from './header';
import { ForgeViewerUtils } from '../../utils/ForgeWrapper2';
import { PotreeViewerUtils } from '../../utils/PotreeWrapper';
import { MapboxViewerUtils } from '../../utils/MapboxWrapper';
import {
  getPointCloudTM,
  getRealityImagesPath,
  getRealityPositions,
  getRealityPositionsPath,
} from '../../services/reality';
import { getSnapshotsList } from '../../services/snapshot';
import { getRealityPath, getDesignPath } from '../../utils/S3Utils';
import { getStructureDesigns, getDesignTM } from '../../services/design';
import DatePicker from './datePicker';
import Pagination from './pagination';
import ForgeViewer from './forgeViewer';
import PotreeViewer from './potreeViewer';
import {
  getForgeModels,
  getPointCloud,
  getPointCloudReality,
  getRealityLayers,
  getRealityLayersPath,
  getDesignMap,
  getMapboxLayers, getMapboxHotspots,
  getRealityMap, getFloorPlanData,
} from "../../utils/ViewerDataUtils";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons";
import TimeLineComponent from '../divami_components/timeline-container/TimeLineComponent'
import { IGenData } from '../../models/IGenData';
import { IGenPayload } from '../../models/IGenPayload';
import { IDesign, IDesignMap } from '../../models/IDesign';
import { IGenNotifyViewerAction } from '../../models/IGenAction';
import MapboxViewer from './mapboxViewer';
import { IContext } from '../../models/ITools';
import { IStructure } from '../../models/IStructure';
import { ISnapshot } from '../../models/ISnapshot';
import { ITasks } from '../../models/Itask';
import { Issue } from '../../models/Issue';
import { IActiveReality, IActiveRealityMap, ILayer, IReality } from '../../models/IReality';
import mapboxgl from 'mapbox-gl';
import { IMapboxLayer } from '../../models/IMapboxLayer';
import Hotspots from './hotspots';
import HotspotsCompare  from './hotspotsCompare';
interface IProps {
data:IGenData;
updateData?: (newData :IGenData)=> void;
}
const NewGenViewer: React.FC<IProps> = ({ data, updateData }) => {


  let structure = data.structure;

  const [isInitReady,setInitReady] = useState<boolean>(false);
  const [isCompareMode,setCompareMode] = useState<boolean>(false);

  let forgeUtils = useRef<typeof ForgeViewerUtils>();
  let potreeUtils = useRef<PotreeViewerUtils>();
  let mapboxUtils = useRef<typeof MapboxViewerUtils>();

  let [hotspots, setHotspots] = useState([]);
  let [hotspotsCompare, setHotspotsCompare] = useState<any>([]);
  let [selectedHotspot, setSelectedHotspot] = useState(0);
  let [selectedHotspotDetails, setSelectedHotspotDetails] = useState();
  let [selectedHotspotCompareDetails, setSelectedHotspotCompareDetails] = useState();

 //let incomingPayload :IGenPayload;
 let incomingPayload = useRef<IGenPayload>();
 let changeType = useRef<string>();
 var compareMode = useRef<string>('noCompare');

  let multiverseViewer : undefined | PotreeViewerUtils | typeof ForgeViewerUtils | typeof MapboxViewerUtils = undefined ;//forgeUtils.current as typeof ForgeViewerUtils;

  let potreeCompareUtils = useRef<PotreeViewerUtils>();
  let forgeCompareUtils = useRef<typeof ForgeViewerUtils>();
  let mapboxCompareUtils = useRef<typeof MapboxViewerUtils>();

  let [context, setContext] = useState({});
  let currentContext = useRef<IContext>();

  let animationRequestId:any;
  let isMouseOnMainViewer = useRef(true);
  let syncForgeEvent = useRef(false);
  let syncPotreeEvent = useRef(false);

  var [currentViewerData,dispatchChangeViewerData] = useReducer(changeViewerData,data);

  const [bottomNav, setBottomNav] = useState(false);
  const toggleTimeline = () => {
    setBottomNav(!bottomNav);
  };

  useEffect(()=>{
   
    window.addEventListener('notify-viewer', notifyViewerEvent);
    return()=>{
      window.removeEventListener('notify-viewer', notifyViewerEvent);
    }
  },[]);
  //const getViewerTypefromViewType = (viewType:string) :string=> {
    function getViewerTypefromViewType(viewType:string){
    //console.log('Getting ViewerType for ',viewType);
    switch(viewType){
      case 'PlanDrawings':
      case 'BIM':
        return 'Forge';
      case 'pointCloud':
        return 'Potree';
      case 'orthoPhoto':
        return 'Mapbox';
    }
    return '';
  }
  function changeViewerData (oldViewerData:IGenData,action:IGenNotifyViewerAction):IGenData{
    let newViewerData:IGenData=structuredClone(oldViewerData);
    console.log("Got Event:",action.type,oldViewerData);
    switch (action.type)
      {
        case 'loadGenViewer':
          if(isInitReady==false){
            setInitReady(true);
            if(action.data)
            {
              newViewerData = {...oldViewerData,currentViewType:action.data as string}
            }
          //newViewerData = {...oldViewerData,currentViewType:action.data as string}
          compareMode.current='noCompare';
            console.log('Dispatching Load Viewer with',newViewerData.currentViewType);
          }
          return newViewerData;
        case 'closeGenViewer':
          if(isInitReady){
            destroyViewer(getViewerTypefromViewType(oldViewerData.currentViewType));
            setInitReady(false);
            compareMode.current='noCompare';
            console.log('Dispatching Close Viewer with',getViewerTypefromViewType(oldViewerData.currentViewType));
          }
          break;
        case 'setStructure':
          newViewerData=action.data as IGenData;
          compareMode.current='noCompare';
          removeLayers(getViewerTypefromViewType(oldViewerData.currentViewType));
          removeData(getViewerTypefromViewType(oldViewerData.currentViewType));
          removeContext();
          //setIsCompare(false);
          cancelAnimationFrame(animationRequestId);
            break;
        case 'setBaseSnapshot':
          newViewerData = {...oldViewerData,currentSnapshotBase:action.data as ISnapshot};
          getContext(oldViewerData);
          removeLayers(getViewerTypefromViewType(oldViewerData.currentViewType));
          console.log("setBaseSnapshot",action.data);
          return newViewerData;
          
        case 'setCompareSnapshot':
          newViewerData = {...oldViewerData,currentSnapshotCompare:action.data as ISnapshot};
          getContext(oldViewerData);
          removeCompareLayers(oldViewerData.currentCompareMode);
          break;
        case 'syncGenViewer':
          break;
        case 'setViewMode':
          break;
        case 'setViewType':
          if((action.data) && (oldViewerData.currentViewType!==action.data)){
            getContext(oldViewerData);
            if(getViewerTypefromViewType(oldViewerData.currentViewType)!==getViewerTypefromViewType(action.data as string)){
              destroyViewer(getViewerTypefromViewType(oldViewerData.currentViewType));
              changeType.current='changeViewerAndType';
              console.log('Viewer Type Changed',getViewerTypefromViewType(oldViewerData.currentViewType),getViewerTypefromViewType(action.data as string));
              newViewerData = {...oldViewerData,currentViewType:action.data as string}
            }
            else{
              console.log('Viewer Type NOT Changed',getViewerTypefromViewType(oldViewerData.currentViewType),getViewerTypefromViewType(action.data as string));
              changeType.current='changeType';
              newViewerData = {...oldViewerData,currentViewType:action.data as string}
              
            }
          }
          else{
            console.log('Nothing to change ->',oldViewerData.currentViewType);
          }
            console.log('Dispatching ViewType',newViewerData.currentViewType);
            //newViewerData.currentCompareMode="noCompare";
            setCompareMode(false);
          return newViewerData;

        case 'setCompareMode':
          newViewerData = {...oldViewerData,currentCompareMode:action.data as string}
          
          if(incomingPayload.current && incomingPayload.current.action.data === 'compareReality'){
            getContext(oldViewerData);
            setCompareMode(true);
            updateViewerChanges(getViewerTypefromViewType(oldViewerData.currentViewType),'Potree');
            compareMode.current='compareReality';

          }
          else if (incomingPayload.current && incomingPayload.current.action.data === 'compareDesign'){
            getContext(oldViewerData);
            setCompareMode(true);
            updateViewerChanges(getViewerTypefromViewType(oldViewerData.currentViewType),'Forge');
            compareMode.current='compareDesign';
          }
          else if (incomingPayload.current && incomingPayload.current.action.data === 'compareMap'){
            getContext(oldViewerData);
            setCompareMode(true);
            updateViewerChanges(getViewerTypefromViewType(oldViewerData.currentViewType),'Mapbox');
            compareMode.current='compareMap';
          }
          else if (incomingPayload.current && incomingPayload.current.action.data === 'noCompare'){
            removeCompareLayers(oldViewerData.currentCompareMode);
            destroyCompareViewer(oldViewerData.currentCompareMode);
            setCompareMode(false);
            compareMode.current='noCompare';
          }
          return newViewerData;
          
        
        case 'issueShow':
          showTag('Issue',true,getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'issueHide':
          showTag('Issue',false,getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'issueCreate':
          addTag('Issue',getViewerTypefromViewType(oldViewerData.currentViewType));            
          break;
        case 'issueCreateSuccess':
          newViewerData = {...oldViewerData,currentIssueList:{...oldViewerData.currentIssueList,...action.data as Issue}};
          //addTag('Issue',getViewerTypefromViewType(oldViewerData.currentViewType));            
          break;
        case 'issueCreateFail':
          cancelAddTag('Issue',getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'issueRemoved':
          //issue obj needed
          cancelAddTag('Issue',getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'issueSelect':
          selectTag('Issue',getViewerTypefromViewType(oldViewerData.currentViewType));
          //issue obj needed to jump to context
          break;
        case 'taskShow':
          showTag('Task',true,getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'taskHide':
          showTag('Task',false,getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'taskCreate':
          addTag('Task',getViewerTypefromViewType(oldViewerData.currentViewType));            
          break;
        case 'taskCreateSuccess':
          //cancelAddTag('Task',getViewerTypefromViewType(oldViewerData.currentViewType));
          newViewerData = {...oldViewerData,currentTaskList:{...oldViewerData.currentTaskList,...action.data as ITasks}};
          break;
        case 'taskCreateFail':
          cancelAddTag('Task',getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'taskRemoved':
          //task obj needed
          cancelAddTag('Task',getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'taskSelect':
          selectTag('Task',getViewerTypefromViewType(oldViewerData.currentViewType));
          //task obj needed to jump to context
          break;




      }
      console.log("Change is,",action,newViewerData.currentViewType);
    return newViewerData
  }

  

  useEffect(()=>{
  //console.log("my Changed Use Effect",incomingPayload.current,isInitReady)
  //console.log("currentViewerData Use Effect",currentViewerData);
  
  //updateData(currentViewerData);
  if(incomingPayload.current){
    switch(incomingPayload.current.action.type){
      case 'loadGenViewer':
        animationRequestId = requestAnimationFrame(animationNow);
        break;
      case 'closeGenViewer':
        cancelAnimationFrame(animationRequestId);
        break;
      case 'setViewType':
        switch(changeType.current){
          case 'changeType':
            console.log("Proper Change",currentViewerData.currentViewType,"-->",incomingPayload.current.action.data as string);
            removeLayers(getViewerTypefromViewType(incomingPayload.current.action.data as string));
            removeData(getViewerTypefromViewType(incomingPayload.current.action.data as string));

            if(getViewerTypefromViewType(incomingPayload.current.action.data as string)==='Forge')
            handleDesignTypeChange(getViewerTypefromViewType(currentViewerData.currentViewType));
            else
            handleRealityTypeChange(getViewerTypefromViewType(currentViewerData.currentViewType));

            loadViewerData();
            loadLayerData();
            break;
          case 'changeViewerAndType':
            loadViewerData();
            loadLayerData();
            console.log('Viewer Type Updated');
            break;
          
            

        }
        console.log("Changed View Type")
        
        changeType.current=undefined;
        break; 
      case 'setCompareMode':
        //cancelAnimationFrame(animationRequestId);
        if(incomingPayload.current.action.data as string ==='noCompare'){
          console.log("No Compare Use Effect");
         
        }
        else{
          
          loadCompareViewerData(currentViewerData.structure,incomingPayload.current.action.data as string)
          loadCompareLayerData(currentViewerData.structure,currentViewerData.currentSnapshotCompare|| currentViewerData.currentSnapshotBase,incomingPayload.current.action.data as string);
          console.log("Compare Use Effect Done");
        } 
        animationRequestId = requestAnimationFrame(animationNow);
        break;
      case 'setStructure':
        if(currentViewerData?.structure?.designs !==undefined) {
          loadViewerData();
          loadLayerData();
          }
        
          // console.log("Generic Viewer load: Structure Changed", structure);
            
          animationRequestId = requestAnimationFrame(animationNow);
        
        break;
      case 'issueCreateSuccess':
        handleTagListChange('Issue',getViewerTypefromViewType(currentViewerData.currentViewType));
        break;
      case 'taskCreateSuccess':
        handleTagListChange('Task',getViewerTypefromViewType(currentViewerData.currentViewType));
        break;
      case 'setBaseSnapshot':
        console.log('asdf',currentViewerData);
        loadLayerData();
        break;
      case 'setCompareSnapshot':
        if(currentViewerData.currentCompareMode==='compareReality'){
          loadCompareLayerData(currentViewerData.structure,currentViewerData.currentSnapshotCompare|| currentViewerData.currentSnapshotBase,'compareReality');
        }
        
        break;
    }

    incomingPayload.current=undefined;
  }
  console.log("updated currentViewerData Use Effect",currentViewerData);
  window.dispatchEvent(new CustomEvent('notify-app',{detail:currentViewerData}));
  return ()=>{

        console.log("Changed Use Effect--Return",incomingPayload.current);

    
  }
  },[currentViewerData]);

  function getContext  (currentViewerData:IGenData) {
    let context:IContext|undefined=undefined;
    // console.log("Getting context from existing viewmode: ", currentViewMode.current, forgeUtils.current, potreeUtils.current);
    if (currentContext.current!==undefined) 
    {
      console.log(
        'Generic Viewer getContext: already available ',
        currentContext.current
      );
     return;
    }
    console.log('Trying to get some context',getViewerTypefromViewType(currentViewerData.currentViewType));
    switch (getViewerTypefromViewType(currentViewerData.currentViewType)) {
      case 'Forge':
        console.log('Trying to get Forge Context',forgeUtils.current);
        if (forgeUtils.current) {
          context = forgeUtils.current.getContext();
          console.log('Trying to get Forge Context');
          //currentContext.current = context;
        }
        break;
      case 'Potree':
        console.log('Trying to get Potree Context',potreeUtils.current);
        if (potreeUtils.current) {
          context = potreeUtils.current.getContext();
          console.log('Trying to get Potree Context');
          //currentContext.current = context;
        }
        break;
    }
    console.log('Generic Viewer getContext: camera ', context);
    // setContext(context);
    //if(context?.type!==undefined)
    currentContext.current = context;
  }


  function handleDesignTypeChange(viewerType:string) {
    switch (viewerType) {
      case 'Forge':
        if (incomingPayload.current && forgeUtils.current) {
          forgeUtils.current.setType(incomingPayload.current.action.data);
          forgeUtils.current.refreshData();
          

        }
        break;
      case 'Potree':
        break;
    }
  }

  function handleRealityTypeChange(viewerType:string) {
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.showLayers(currentViewerData.currentLayersList);
        }
        break;
      case 'Potree':
        break;
    }
  }

  const notifyViewerEvent =(e:any)=>{
    let cusEve: CustomEvent =e
  incomingPayload.current =  cusEve.detail;
  
  let incomingData:IGenData=cusEve.detail.data;
  console.log(
    'My custom event triggered on component :',
    incomingPayload?.current?.action,
    currentViewerData,isInitReady
    );
    if(incomingPayload.current!==undefined){
      dispatchChangeViewerData(incomingPayload.current.action);
  
    }

   }

  const addTag = (type:string,viewerType:string) => {
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.initiateAddTag(type);
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.initiateAddTag(type);
        }
        break;
    }
  };

  const cancelAddTag = (type:string,viewerType:string) => {
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.cancelAddTag();
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.cancelAddTag();
        }
        break;
    }
  };

  const selectTag = (tag:string,viewerType:string) => {
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.selectTag(tag);
        }
        break;
      case 'Potree':
        if(potreeUtils.current) {
          potreeUtils.current.selectTag(tag);
        }
        break;
    }
  };

  function showTag (tag:string, show:boolean,viewerType:string) {
    console.log(show?"Show":"Hide",tag,viewerType);
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.showTag(tag, show);
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.showTag(tag, show);
        }
        break;
    }
  }

  function animationNow() {
    // console.log("Inside Animate now: ")
    syncViewer();
    animationRequestId = requestAnimationFrame(animationNow);
    if (potreeUtils.current) {
      potreeUtils.current.updateFloormapAnimation();
    }

    if(currentViewerData.currentCompareMode==='compareReality'){
    //if (currentIsCompare.current === true && potreeCompareUtils.current) {
      potreeCompareUtils.current?.updateFloormapAnimation();
    }
  };

  function syncViewer  (){
     //console.log("Inside sync viewer: ", isMouseOnMainViewer.current, syncPotreeEvent, syncForgeEvent,currentViewerData)
    if (compareMode.current !== 'noCompare') {
      //console.log('Sync My Compare Viewer');
      if (isMouseOnMainViewer.current === true) {
        //console.log('Sync My Compare Viewer',syncForgeEvent,syncPotreeEvent);
        if (compareMode.current === 'compareReality') {
          // get from potree utils
          //give to potree compare utile
          if (
            potreeUtils.current !== undefined &&
            potreeCompareUtils.current !== undefined
          ) {
            let viewerState = potreeUtils.current.getViewerState();
            potreeCompareUtils.current.updateViewerState(viewerState);
          }
        } else if (syncPotreeEvent.current) {
          
          // }else {
          // get from potree utils
          //give to forge compare utile
          if (
            potreeUtils.current !== undefined &&
            forgeCompareUtils.current !== undefined
          ) {
            
            let viewerState = potreeUtils.current.getViewerState();
            forgeCompareUtils.current.updateViewerState(viewerState);
          }
        }
      } else {
        if (compareMode.current === 'compareReality') {
          //get from potree compare utils
          // give to potree utils
          if (
            potreeUtils.current != undefined &&
            potreeCompareUtils.current != undefined
          ) {
            let viewerState = potreeCompareUtils.current.getViewerState();
            potreeUtils.current.updateViewerState(viewerState);
          }
        } else if (syncForgeEvent.current) {
          // } else {
          // get from forge compare utils
          // give to potree utils
          if (
            potreeUtils.current != undefined &&
            forgeCompareUtils.current != undefined &&
            forgeCompareUtils.current
          ) {
            let viewerState = forgeCompareUtils.current.getViewerState();
            if (viewerState) {
              potreeUtils.current.updateViewerState(viewerState);
            }
          }
        }
      }
      syncPotreeEvent.current = false;
      syncForgeEvent.current = false;
    }
  };

  const handleTagListChange = (type:string,viewerType:string) => {
    //console.log('Inside taglist change: ', type, issuesList, tasksList);
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          if (type === 'Issue') {
            forgeUtils.current.updateIssuesData(currentViewerData.currentIssueList);
          } else if (type === 'Task') {
            forgeUtils.current.updateTasksData(currentViewerData.currentTaskList);
          }
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          if (type === 'Issue') {
            potreeUtils.current.updateIssuesData(currentViewerData.currentIssueList);
          } else if (type === 'Task') {
            potreeUtils.current.updateTasksData(currentViewerData.currentTaskList);
          }
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current) {
          if (type === 'Issue') {
            mapboxUtils.current.updateIssuesData(currentViewerData.currentIssueList);
          } else if (type === 'Task') {
            mapboxUtils.current.updateTasksData(currentViewerData.currentTaskList);
          }
        }
        break;
    }
  };

  function viewerEventHandler (viewerId:string, event:any){
    //console.log("Inside generic viewer: ",viewerId, event, );
    if (event) {
      switch (event.type) {
        case '360 Video':
          currentContext.current = event;
          if (currentViewerData.currentViewType==='PlanDrawings' || currentViewerData.currentViewType==='BIM')
          {
            dispatchChangeViewerData({type:'setViewType',data:'pointCloud'});
          }
          else if(currentViewerData.currentViewType==='pointCloud')
          {
            dispatchChangeViewerData({type:'setViewType',data:'PlanDrawings'});
          }
          break;
        case 'Reality':
          break;
        case 'Task':
        case 'Issue':
          if (!incomingPayload.current) {
            incomingPayload.current = undefined;
          }
          window.dispatchEvent(new CustomEvent('notify-app',{detail:{type:event.id.includes('Temp')
          ? `create${event.type}`
          : `select${event.type}`,data:event}}));
          console.log('Marked Point========', event);
          break;
        case '3d':
        case 'panorama':
        case 'image':
          if (compareMode.current!== 'noCompare') {
            if (isCompareViewer(viewerId)) {
              potreeUtils.current?.updateContext(event, false);
            } else {
              if(compareMode.current === 'compareReality') {
                potreeCompareUtils.current?.updateContext(event, false);
              } else {
                forgeCompareUtils.current?.updateContext(event, false);
              }
            }
          }
          break;
        case 'sync':
           //console.log("Inside sync event: ", isCompareMode, isRealityViewer(viewerId),currentViewerData)
          if (compareMode.current!== 'noCompare') {
            if (isRealityViewer(viewerId)) {
              syncPotreeEvent.current = true;
            } else {
              syncForgeEvent.current = true;
            }
          }
          break;
        case 'zoom':
          // console.log("Sync event handler: ", viewerId);
          if (compareMode.current!== 'noCompare') {
            //syncViewer(viewerId);
            syncViewer();
          }
          break;
        case 'mouse':
          //console.log("Mouse Event",isCompareViewer(viewerId),viewerId,event)
          if (compareMode.current!== 'noCompare') {
            
            if (isCompareViewer(viewerId)) {
              isMouseOnMainViewer.current = false;
            } else {
              isMouseOnMainViewer.current = true;
            }
          }
          break;
      }
    }
  };

  const initViewer = (viewerId:string) => {
    // console.log("Inside init viewer: ", potreeUtils.current, forgeUtils.current);
    //console.log("InitViewer", forgeUtils.current,currentViewerData.currentViewType);
    switch (getViewerTypefromViewType(currentViewerData.currentViewType)) {
      case 'Forge':
        if (forgeUtils.current === undefined) {
          
          forgeUtils.current = ForgeViewerUtils;
          console.log("InitViewer", forgeUtils.current);
          forgeUtils.current.initializeViewer(viewerId, viewerEventHandler);
          if(incomingPayload.current?.action.type==='setViewType')
          {
            console.log("InitViewer", forgeUtils.current);
            forgeUtils.current.setType(incomingPayload.current?.action.data);
          }
          else
          forgeUtils.current.setType(currentViewerData.currentViewType);

          console.log("InitViewer", forgeUtils.current);
          multiverseViewer = forgeUtils.current;
        }
        break;
      case 'Potree':
        if (potreeUtils.current === undefined) {
          potreeUtils.current = new PotreeViewerUtils(
            viewerId,
            viewerEventHandler
          );
          if (!potreeUtils.current.isViewerLoaded()) {
            potreeUtils.current.initialize();
          }
          console.log("InitViewer", potreeUtils.current);
          multiverseViewer = potreeUtils.current;
        }
        break;
        case 'Mapbox':
          if (mapboxUtils.current === undefined) {
             mapboxUtils.current = MapboxViewerUtils;
            mapboxUtils.current.initializeViewer(viewerId, viewerEventHandler, {context: currentContext.current?.cameraObject});
            mapboxUtils.current.setType(incomingPayload.current?.action.data);
            multiverseViewer = mapboxUtils.current;
          }
          break;
    }
  };

  const initCompareViewer = (viewerId:string) => {
    //console.log("InitCompareViewer TEST", viewerId,currentContext,currentViewerData.currentCompareMode);
    switch (currentViewerData.currentCompareMode) {
      case 'compareDesign':
        if (forgeCompareUtils.current === undefined) {
          forgeCompareUtils.current = ForgeViewerUtils;
          forgeCompareUtils.current.initializeViewer(
            viewerId,
            viewerEventHandler
          );
          forgeCompareUtils.current.setType(currentViewerData.currentViewType);
        }
        break;
      case 'compareReality':
        //console.log('Compare Reality Init TEST');
        if (potreeCompareUtils.current === undefined) {
          potreeCompareUtils.current = new PotreeViewerUtils(
            viewerId,
            viewerEventHandler
          );
          console.log('Compare Reality Init TEST');
          if (!potreeCompareUtils.current.isViewerLoaded()) {
            potreeCompareUtils.current.initialize();
            console.log('Compare Reality Viewer Loaded TEST');
          }
        }
        break;
      case 'compareMap':
        if (mapboxCompareUtils.current == undefined) {
          mapboxCompareUtils.current = MapboxViewerUtils;
          mapboxCompareUtils.current.initializeViewer(viewerId, viewerEventHandler, undefined, mapboxUtils.current?.getMap());
          mapboxCompareUtils.current.setType(currentViewerData.currentViewType);          
          }
          break;
    }
  };

  async function loadViewerData() {
    switch (getViewerTypefromViewType(currentViewerData.currentViewType)) {
      case 'Forge':
        if (forgeUtils.current != undefined) {
          forgeUtils.current.setStructure(currentViewerData.structure);
          console.log("MyViewerStructData",currentViewerData.structure.designs);
          let dMaps=getDesignMap(currentViewerData.structure.designs)
          let fModels=getForgeModels(dMaps)
          forgeUtils.current.updateData(fModels);

        }

        break;
      case 'Potree':
        if (potreeUtils.current !== undefined) {
          potreeUtils.current.setStructure(currentViewerData.structure);
        }
        break;
        case 'Mapbox':
          if (mapboxUtils.current !== undefined) {
            mapboxUtils.current.setProject(currentViewerData.project);
            mapboxUtils.current.setStructure(currentViewerData.structure);
          }
          break;
    }
  }

  async function loadLayerData() {
    //console.log('Load layer data: ', issuesList, tasksList);
    switch (getViewerTypefromViewType(currentViewerData.currentViewType)) {
      case 'Forge':
        if (forgeUtils.current != undefined) {
          forgeUtils.current.setSnapshot(currentViewerData.currentSnapshotBase);
          forgeUtils.current.updateIssuesData(currentViewerData.currentIssueList);
          forgeUtils.current.updateTasksData(currentViewerData.currentTaskList);
          let Rdata = await getRealityLayers(currentViewerData.structure, getRealityMap(currentViewerData.currentSnapshotBase));
          //console.log('HERE',Rdata);
          forgeUtils.current.updateLayersData(Rdata,currentContext.current);
          forgeUtils.current.showLayers(currentViewerData.currentLayersList);
        }
        break;
      case 'Potree':
        if (potreeUtils.current != undefined) {
          potreeUtils.current.setSnapshot(currentViewerData.currentSnapshotBase);
          potreeUtils.current.updateIssuesData(currentViewerData.currentIssueList);
          potreeUtils.current.updateTasksData(currentViewerData.currentTaskList);
          potreeUtils.current.updateData(
            await getPointCloud(currentViewerData.structure, currentViewerData.currentSnapshotBase),
            getFloorPlanData(getDesignMap(currentViewerData.structure.designs))
          );
          //console.log("ContextVariable",currentContext.current);
          potreeUtils.current.updateLayersData(
            getRealityLayersPath(currentViewerData.structure, getRealityMap(currentViewerData.currentSnapshotBase)),
            currentContext.current//currentViewerData.viewerContext// was here
          );
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current !== undefined) {
          mapboxUtils.current.setSnapshot(currentViewerData.currentSnapshotBase);
          mapboxUtils.current.setHotspotClick(selectHotspot);
          let data:IMapboxLayer[] = await getMapboxLayers(currentViewerData.structure, currentViewerData.currentSnapshotBase);
          const reality :IReality| undefined= currentViewerData?.currentSnapshotBase?.reality?.find((reality) => { return reality })
          let hotspots = await getMapboxHotspots(currentViewerData.project, currentViewerData.structure._id, currentViewerData.currentSnapshotBase._id, reality?._id)
          if(data) {
            
            const stages : ILayer = {
              name: 'Stages',
              children: [],
              isSelected: true
            }
            data.forEach((layer) => {
              if(layer.categories) {
                layer.categories.forEach((category) => {
                  category.filters.forEach((stage) => {
                    const subLayer:ILayer = {
                      name: stage.name,
                      children: [],
                      isSelected: true,
                      filters: stage.filter
                    }
                    stages.children.push(subLayer)
                  })
                })
              }
            })
            
            //var map:IActiveRealityMap  =  getRealityMap(currentViewerData.currentSnapshotBase)
            //if(map!==undefined && map['Stages'] !==undefined) {map['Stages']= stages}
            //setRealityMap(map)
            //updateRealityMap(map)
          }
          setTimeout(() => {
            if (mapboxUtils.current !== undefined) {

                mapboxUtils.current.updateData(data, currentContext.current);
                hotspots && hotspots.data && setHotspots(hotspots.data.features);
                mapboxUtils.current.updateIssuesData(currentViewerData.currentIssueList);
                mapboxUtils.current.updateTasksData(currentViewerData.currentTaskList);
            }
          }, 700);
        }
        break;
    }

     currentContext.current = undefined;
  }

  function loadCompareViewerData(structure:IStructure, compareMode:string) {
    switch (compareMode) {
      case 'compareDesign':
        if (forgeCompareUtils.current !== undefined) {
          forgeCompareUtils.current.setStructure(structure);
          forgeCompareUtils.current.updateData(getForgeModels(getDesignMap(structure.designs)));
        }

        break;
      case 'compareReality':
        if (potreeCompareUtils.current !== undefined) {
          potreeCompareUtils.current.setStructure(structure);
        }
        break;
        case 'compareMap':
        if (mapboxCompareUtils.current != undefined) {
          mapboxCompareUtils.current.setProject(structure.project);
          mapboxCompareUtils.current.setStructure(structure);
        }
        break;
    }
  }

  async function loadCompareLayerData(structure:IStructure,compareSnapshot:ISnapshot,compareMode:string) {
    //console.log('Compare View Data TEST');
    switch (compareMode) {
      case 'compareDesign':
        if (forgeCompareUtils.current) {
          forgeCompareUtils.current.setSnapshot(compareSnapshot);
          let data = await getRealityLayers(structure, getRealityMap(compareSnapshot));
          forgeCompareUtils.current.updateLayersData(
            data,
            currentContext.current
          );
        }
        break;
      case 'compareReality':
        //console.log('Compare Reality TEST');
        if (potreeCompareUtils.current!==undefined) {
          //console.log('Compare Reality TEST');
          potreeCompareUtils.current.setSnapshot(compareSnapshot);
          potreeCompareUtils.current.updateData(
            await getPointCloud(structure, compareSnapshot),
            getFloorPlanData(getDesignMap(structure.designs))
          );
          potreeCompareUtils.current.updateLayersData(
            getRealityLayersPath(structure, getRealityMap(compareSnapshot)),
            currentContext.current
          );
        }

        break;
      case 'compareMap':
        if (mapboxCompareUtils.current != undefined) {
          mapboxCompareUtils.current.setSnapshot(compareSnapshot);
          mapboxCompareUtils.current.setHotspotClick(selectHotspot);
          let data = await getMapboxLayers(structure, compareSnapshot);
          const reality = compareSnapshot?.reality?.find((reality) => { return reality })
          let hotspots = await getMapboxHotspots(currentViewerData.project, currentViewerData.structure._id, compareSnapshot._id, reality?._id)
          setTimeout(() => {
              if (mapboxCompareUtils.current != undefined) {
                mapboxCompareUtils.current.updateData(data, currentContext.current);
                hotspots && hotspots.data && (hotspotsCompare = hotspots.data.features);
                hotspots && hotspots.data && setHotspotsCompare(hotspots.data.features);
                mapboxCompareUtils.current.updateIssuesData(currentViewerData.currentIssueList);
                mapboxCompareUtils.current.updateTasksData(currentViewerData.currentTaskList);
                ///////NEED TO MOVE TO UPDATE MAP
                // setTimeout(() => {
                  
                //   if(currentViewerData.currentLayersList /*&& viewLayers['Stages']*/) {
                //   const filters = ['any']
                //   //const children = viewLayers['Stages'].children;
                //   //   for(let i = 0; i < children.length; i++) {
                //   //     if(children[i].isSelected) {
                //   //       filters.push(children[i].filters)
                //   //     }
                //   //   }
                
                //     if(mapboxCompareUtils.current && mapboxCompareUtils.current.isViewerInitialized()) {
                //       mapboxCompareUtils.current.getMap().setFilter('progress-stages', filters)
                //     }
                //   }
                // }, 500)
            }
          }, 700);
          }
          break;
    }
    currentContext.current = undefined;
  }

  function updateViewerChanges(viewerType:string,compareViewerType:string) {
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.readyForCompare(compareViewerType);
        }
        break;
      case 'Mapbox':
        break;
    }
  }

  const setForgeViewerUtils = function (viewerId:string) {
    if (!isCompareViewer(viewerId)) {
      initViewer(viewerId);
       loadViewerData();
      loadLayerData();
      forgeUtils.current?.refreshData();
      //console.log('trying to reload....forge');
      
    } else {
      //console.log('trying to load....compare forge');
      initCompareViewer(viewerId);
    }
  };

  const setpotreeViewerUtils = function (viewerId:string) 
  {
    if (!isCompareViewer(viewerId)) {
      initViewer(viewerId);
      //console.log('trying to reload....potree');
       loadViewerData();
       loadLayerData();
    } else {
      initCompareViewer(viewerId);
    }
  };

  const setMapboxViewerUtils = function (viewerId:string) {
    if (!isCompareViewer(viewerId)) {
      initViewer(viewerId);
      loadViewerData();
      loadLayerData();
    } else {
      initCompareViewer(viewerId);
    }
  };

  function renderViewer(count:Number) {
     //console.log("Generic Viewer Inside render View: ", currentViewerData.currentViewType, count,currentViewerData.currentCompareMode);
    if (count != 1 && (currentViewerData.currentCompareMode==='noCompare')) {
      console.log("Improper mode", currentViewerData.currentCompareMode);
      return;
    }
    let mode = (count == 1) ? getViewerTypefromViewType(currentViewerData.currentViewType) : currentViewerData.currentCompareMode;
     //console.log("Checking render mode", mode);
    switch (mode) {
      case 'Forge':
      case 'compareDesign':
        //console.log('Trial',currentViewerData.currentViewType,getViewerTypefromViewType(currentViewerData.currentViewType));
        return (
          <ForgeViewer
            viewerCount={count}
            setForgeViewer={setForgeViewerUtils}
          ></ForgeViewer>
        );
      case 'Potree':
      case 'compareReality':
        return (
          <PotreeViewer
            viewerCount={count}
            setPotreeViewer={setpotreeViewerUtils}
          ></PotreeViewer>
        );
        case 'Mapbox':
          case 'compareMap':
          return (
            <MapboxViewer
              viewerCount={count}
              setMapboxViewer={setMapboxViewerUtils}
            ></MapboxViewer>
          );
    }
  }

  
  // const getSnapshotList = async (projectId, structurId) => {
  //   let list = await getSnapshotsList(projectId, structurId);

  //   list = list.data.result.mSnapshots.sort(
  //     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  //   );
  //   if (list.length > 0) {
  //     setSnapshotList(list);
  //     setCurrentSnapshot(list[list.length - 1]);
  //     if (list.length > 1) {
  //       setCurrentCompareSnapshot(list[list.length - 2]);
  //     } else {
  //       setCurrentCompareSnapshot(list[list.length - 1]);
  //     }
  //   }
  // };

  const setCurrentSnapshot = (snapshot:ISnapshot) => {
    if(snapshot){
      incomingPayload.current= {action:{type:'setBaseSnapshot',data:snapshot as ISnapshot}}
     dispatchChangeViewerData(incomingPayload.current.action);

    // setSnapshot(snapshot);
    // //updateSnapshot(snapshot);
    // setRealityList(snapshot.reality);
    // setRealityMap(getRealityMap(snapshot));
    // //updateRealityMap(getRealityMap(snapshot));
  }

  };

  const setCurrentCompareSnapshot = (snapshot:ISnapshot) => {
    if(snapshot){
      incomingPayload.current= {action:{type:'setCompareSnapshot',data:snapshot as ISnapshot}}
      dispatchChangeViewerData(incomingPayload.current.action);
    // setCompareSnapshot(snapshot);
    // // updateSnapshot(snapshot);
    // setCompareRealityList(snapshot.reality);
    // setCompareRealityMap(getRealityMap(snapshot));
    // // updateRealityMap(getRealityMap(snapshot));
    }
  };

  const isCompareViewer = (viewerId:string) => {
    if (viewerId.split('_')[1] === '1') {
      return false;
    } else {
      return true;
    }
  };

  const isRealityViewer = (viewerId:string) => {
    if (viewerId.split('_')[0] === 'forgeViewer') {
      return false;
    } else {
      return true;
    }
  };

  const removeContext = () => {
    setContext(typeof undefined);
    currentContext.current = undefined;
  };

  

  function removeData  (viewerType:string){
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.removeData();
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.removeData();
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current) {
          mapboxUtils.current.removeData();
        }
        break;
    }
  };

  function removeLayers (viewerType:string) {
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.removeLayers();
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.removeData();
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current) {
          mapboxUtils.current.removeLayers();
        }
        break;
    }
  };

  function removeCompareLayers(viewerType:string){
    switch (viewerType) {
      case 'compareDesign':
        if (forgeCompareUtils.current) {
          forgeCompareUtils.current.removeLayers();
        }
        break;
      case 'compareReality':
        if (potreeCompareUtils.current) {
          potreeCompareUtils.current.removeData();
        }
        break;
      case 'compareMap':
        if (mapboxCompareUtils.current) {
          mapboxCompareUtils.current.removeLayers()//why not layers?
        }
        break;
    }
  };

  //const destroyViewer = (viewerType:string) => {
    function destroyViewer(viewerType:string){
    console.log('Inside destroy viewer: ');
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.shutdown();
          delete forgeUtils.current;

        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.shutdown();
          potreeCompareUtils.current = undefined;
          delete potreeUtils.current;
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current) {
          mapboxUtils.current.shutdown();
          mapboxCompareUtils.current = undefined;
          delete mapboxUtils.current;
          //realityMap && realityMap['Stages'] && delete realityMap['Stages'] //NEED TO RECTIFY
            // setRealityMap(realityMap)
            // updateRealityMap(realityMap)
        }
        break;
    }
  };

  function destroyCompareViewer (compareMode:string)  {
    switch (compareMode) {
      case 'compareDesign':
        if (forgeCompareUtils.current) {
          forgeCompareUtils.current.shutdown();
          delete forgeCompareUtils.current;
        }
        break;
      case 'compareReality':
        if (potreeCompareUtils.current) {
          potreeCompareUtils.current.shutdown();
          potreeCompareUtils.current = undefined;
          delete potreeCompareUtils.current;
        }
        break;
      case 'compareMap':
        if (mapboxCompareUtils.current) {
          mapboxCompareUtils.current.shutdown();
          mapboxCompareUtils.current = undefined;
          delete mapboxCompareUtils.current;
        }
        break;
    }
  };

  const onHotspotClick = (hotspot:any) => {
    setSelectedHotspot(hotspot.properties.id)
    setSelectedHotspotDetails(hotspot)
    
    for(let i = 0; i < hotspotsCompare.length; i++) {
      if(hotspotsCompare[i].properties.id == hotspot.properties.id) {
        setSelectedHotspotCompareDetails(hotspotsCompare[i]) 
        break;
      }
    }
    if(mapboxUtils.current) {
      mapboxUtils.current.onLayerClick(hotspot, compareMode.current!=='noCompare' ? true : false)
    }
  }

  const selectHotspot = (hotspot:any) => {
    setSelectedHotspot(hotspot.properties.id)
  }


  return (
      <div className="fixed calc-w calc-h flex flex-row">
        <div id="TheView" className="relative basis-1/2 flex grow shrink">
          {isInitReady && renderViewer(1)}
          <TimeLineComponent currentSnapshot={currentViewerData.currentSnapshotBase} snapshotList={currentViewerData.snapshotList} snapshotHandler={setCurrentSnapshot}></TimeLineComponent>
        </div>
        <div className={`relative ${currentViewerData.currentCompareMode!=='noCompare' ? "basis-1/2": "hidden" }`}>
          {isInitReady && isCompareMode && renderViewer(2)}
          <TimeLineComponent currentSnapshot={currentViewerData.currentSnapshotCompare||currentViewerData.currentSnapshotBase} snapshotList={currentViewerData.snapshotList} snapshotHandler={setCurrentCompareSnapshot}></TimeLineComponent>
        </div>
        {
          currentViewerData.currentViewType === "Mapbox"  && hotspots && hotspots.length > 0 ?
          <Hotspots data={hotspots} selected={selectedHotspot} onHotspotClick={onHotspotClick}></Hotspots>
          : <></>
        }
        {
          currentViewerData.currentCompareMode==='compareMap' && currentViewerData.currentViewType === "Mapbox"?
          <HotspotsCompare
            snapshot={currentViewerData.currentSnapshotBase}
            compareSnapshot={currentViewerData.currentSnapshotCompare|| currentViewerData.currentSnapshotBase}
            hotspotDetails={selectedHotspotDetails}
            hotspotCompareDetails={selectedHotspotCompareDetails}/>
          
          : <></>
        }
    </div>
  );
  }
// export default GenericViewer;
export default NewGenViewer;
