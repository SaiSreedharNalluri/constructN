import Script from 'next/script';
import Moment from 'moment';
import {Rnd } from 'react-rnd';
import React, { useEffect, useState, memo, useRef, useCallback, useReducer, ReactElement, KeyboardEvent } from 'react';
import Head from 'next/head';
import Header from './header';
import { ForgeViewerUtils } from '../../utils/ForgeWrapper2';
import { PotreeViewerUtils } from '../../utils/PotreeWrapper2';
import { MapboxViewerUtils } from '../../utils/MapboxWrapper';
import { MinimapUtils } from '../../utils/MinimapWrapper';
import { autodeskAuth } from "../../services/forgeService";
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
import MiniMap from './minimap';
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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RemoveIcon from '@mui/icons-material/Remove';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import { IconButton } from '@mui/material';

type TMCIProps ={
  currentSnapshot: ISnapshot;
  snapshotList: ISnapshot[];
  snapshotHandler: (snapshotData: ISnapshot) => void;
  isFullScreen?: boolean;
  getSnapshotList: any;
  totalSnaphotsCount: any;
  structure: any;
  setPrevList: any;
  setNextList: any;
  totalPages: any;
  offset: any;
  tools?: any;
}

type ForgeViewerUtilsType = {
  setupViewer: Function,
  initializeViewer: Function,
  setType: Function,
  setStructure: Function,
  setSnapshot: Function,
  updateData: Function,
  updateLayersData: Function,
  updateIssuesData: Function,
  updateTasksData: Function,
  refreshData: Function,
  showLayers: Function,
  initiateAddTag: Function,
  cancelAddTag: Function,
  selectTag: Function,
  showTag: Function,
  getContext: Function,
  getViewerState: Function,
  updateViewerState: Function,
  updateContext: Function,
  removeData: Function,
  removeLayers: Function,
  shutdown: Function,
}

type PotreeViewerUtilsType = {
  initializeViewer: Function,
  isViewerLoaded: Function,
  isCompareView: Function,
  readyForCompare: Function,
  finishForCompare: Function,
  setStructure: Function,
  setSnapshot: Function,
  updateIssuesData: Function,
  updateTasksData: Function,
  updateProgressData: Function,
  updateData: Function,
  updateLayersData: Function,
  initiateAddTag: Function,
  cancelAddTag: Function,
  finishAddTag: Function,
  selectTag: Function,
  showTag: Function,
  getContext: Function,
  updateContext: Function,
  getViewerState: Function,
  updateViewerState: Function,
  updateFloormapAnimation: Function,
  removeData: Function,
  shutdown: Function,
}

type MapboxViewerUtilsType = {
    initializeViewer: Function,
    setType: Function,
    setProject: Function,
    setStructure: Function,
    setSnapshot: Function,
    isViewerInitialized: Function,
    updateData: Function,
    updateLayersData: Function,
    updateIssuesData: Function,
    updateTasksData: Function,
    refreshData: Function,
    showLayers: Function,
    initiateAddTag: Function,
    cancelAddTag: Function,
    selectTag: Function,
    showTag: Function,
    onLayerClick: Function,
    getContext: Function,
    getMap: Function,
    resize: Function,
    updateContext: Function,
    removeData: Function,
    removeLayers: Function,
    setHotspotClick: Function,
    shutdown: Function,
}
type MinimapViewerUtilsType ={
  setupViewer: Function,
    initializeViewer: Function,
    setType: Function,
    createMarker: Function,
    setStructure: Function,
    setSnapshot: Function,
    updateData: Function,
    updateLayersData: Function,
    updateIssuesData: Function,
    updateTasksData: Function,
    refreshData: Function,
    showLayers: Function,
    initiateAddTag: Function,
    cancelAddTag: Function,
    selectTag: Function,
    showTag: Function,
    fitToView: Function,
    getContext: Function,
    getViewerState: Function,
    updateViewerState: Function,
    updateContext: Function,
    removeData: Function,
    removeLayers: Function,
    resize: Function,
    shutdown: Function,
}
interface IProps {
data:IGenData;
updateData?: (newData :IGenData)=> void;
tmcBase?:ReactElement<TMCIProps>
tmcCompare?:ReactElement<TMCIProps>
}
const NewGenViewer: React.FC<IProps> = ({ data, updateData,tmcBase,tmcCompare }) => {


  let structure = data.structure;

  const [isInitReady,setInitReady] = useState<boolean>(false);
  const [isCompareMode,setCompareMode] = useState<boolean>(false);

  let forgeUtils = useRef<ForgeViewerUtilsType>();
  let potreeUtils = useRef<PotreeViewerUtilsType>();
  let mapboxUtils = useRef<MapboxViewerUtilsType>();

  let minimapUtils = useRef<MinimapViewerUtilsType>();

  let _minimap:any;
  let _minimapCompare:any;


  let [hotspots, setHotspots] = useState([]);
  let [hotspotsCompare, setHotspotsCompare] = useState<any>([]);
  let [selectedHotspot, setSelectedHotspot] = useState(0);
  let [selectedHotspotDetails, setSelectedHotspotDetails] = useState();
  let [selectedHotspotCompareDetails, setSelectedHotspotCompareDetails] = useState();
  let [isFullScreenMode, setFullScreenMode] = useState(false);
  let [forgeInitialised, setForgeInitialised] = useState(false);
  let [showMinimap, setShowMinimap] = useState(false);

 //let incomingPayload :IGenPayload;
 let incomingPayload = useRef<IGenPayload>();
 let viewerData = useRef<IGenData>();
 let changeType = useRef<string>();
 var compareMode = useRef<string>('noCompare');

  let multiverseViewer : undefined |typeof PotreeViewerUtils | typeof ForgeViewerUtils | typeof MapboxViewerUtils = undefined ;//forgeUtils.current as typeof ForgeViewerUtils;

  let potreeCompareUtils = useRef<PotreeViewerUtilsType>();
  let forgeCompareUtils = useRef<ForgeViewerUtilsType>();
  let mapboxCompareUtils = useRef<MapboxViewerUtilsType>();

  let minimapCompareUtils = useRef<MinimapViewerUtilsType>();

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

  const [offset, setOffset] = useState(1);
  const pageSize = 10;
  const [totalSnaphotsCount,setTotalSnaphotsCount] = useState(0)

  const [totalPages, setTotalPages] = useState(Math.ceil(totalSnaphotsCount / pageSize));

  const initializeOptions = {
    env: "AutodeskProduction2", //Local, AutodeskProduction, AutodeskProduction2
    api: "streamingV2", // for models uploaded to EMEA change this option to 'derivativeV2_EU'
    getAccessToken: async function (onSuccess:any) {
      const response = await autodeskAuth();
      // console.log("Autodesk auth token:", response.data.result);
      const res = response.data.result;

      onSuccess(res.access_token, res.expires_in);
    },
  };

  const initializerCallBack = () => {
    // console.log("Inside Forge Initializer");
    setForgeInitialised(true)
  };

  Autodesk.Viewing.Initializer(initializeOptions, initializerCallBack);


  useEffect(() => {
    if (forgeInitialised) {
      // if(minimapUtils.current) {
      //   minimapUtils.current.initializeViewer();
      // }
      // if(minimapCompareUtils.current) {
      //   minimapCompareUtils.current.initializeViewer();
      // }
      if(forgeUtils.current) {
        forgeUtils.current.initializeViewer();
      }
    }
  }, [forgeInitialised]);
  

  useEffect(()=>{
   
    window.addEventListener('notifyViewer', notifyViewerEvent);
    // To stop Minimap from accepting keyboard events
    document.addEventListener(
      "keydown", (event) => {
        const forgeAvailable = document.getElementById('forgeViewer_1')
        if(!forgeAvailable) event.stopPropagation()
      }, false
    );
    
    return()=>{
      window.removeEventListener('notifyViewer', notifyViewerEvent);
      document.removeEventListener(
        "keydown", (event) => {
          const forgeAvailable = document.getElementById('forgeViewer_1')
          if(!forgeAvailable) event.stopPropagation()
        }, false
      );

    }
  },[]);
  useEffect(() => {
    if(isInitReady===true){
    incomingPayload.current={action:{type:'setStructure',data:data}}
    dispatchChangeViewerData(incomingPayload.current?.action);
    }
  }, [data]);
  //const getViewerTypefromViewType = (viewType:string) :string=> {
    function getViewerTypefromViewType(viewType:string){
    //console.log('Getting ViewerType for ',viewType);
    switch(viewType){
      case 'compareDesign':
      case 'Plan Drawings':
      case 'PlanDrawings':
      case 'BIM':
        return 'Forge';
      case 'compareReality':
      case 'pointCloud':
        return 'Potree';
      case 'compareMap':
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
          break;//return newViewerData;
        case 'closeGenViewer':
          if(isInitReady){
            destroyViewer(getViewerTypefromViewType(oldViewerData.currentViewType));
            setInitReady(false);
            compareMode.current='noCompare';
            console.log('Dispatching Close Viewer with',getViewerTypefromViewType(oldViewerData.currentViewType));
          }
          break;
        case 'setFullScreenMode':
          setFullScreenMode(action.data==='true'?true:false);
          break;
        case 'setStructure':
          newViewerData=action.data as IGenData;
          newViewerData = {...newViewerData,currentViewType:oldViewerData.currentViewType};
          removeCompareLayers(oldViewerData.currentCompareMode);
          destroyCompareViewer(oldViewerData.currentCompareMode);
          setCompareMode(false);
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
          break;//return newViewerData;
          
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
              newViewerData = {...oldViewerData,currentViewType:action.data as string,currentCompareMode:'noCompare'}
            }
            else{
              console.log('Viewer Type NOT Changed',getViewerTypefromViewType(oldViewerData.currentViewType),getViewerTypefromViewType(action.data as string));
              changeType.current='changeType';
              newViewerData = {...oldViewerData,currentViewType:action.data as string,currentCompareMode:'noCompare'}
              
            }
          }
          else{
            console.log('Nothing to change ->',oldViewerData.currentViewType);
          }
            console.log('Dispatching ViewType',newViewerData.currentViewType);
            //newViewerData.currentCompareMode="noCompare";

            removeCompareLayers(oldViewerData.currentCompareMode);
            destroyCompareViewer(oldViewerData.currentCompareMode);
            //newViewerData = {...oldViewerData,currentCompareMode:'noCompare'};
            setCompareMode(false);
            compareMode.current='noCompare';
          //return newViewerData;
          break;

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
          //return newViewerData;
          break;
          
        case 'setViewLayers':
          break;
        case 'addViewLayer':
          break;
        case 'removeViewLayer':
          break;
        case 'showIssue':
          showTag('Issue',true,getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'hideIssue':
          showTag('Issue',false,getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'createIssue':
          addTag('Issue',getViewerTypefromViewType(oldViewerData.currentViewType));            
          break;
        case 'createSuccessIssue':
          let myNewIssue:Issue = action.data as Issue;
          let tempIssueContext:IContext = myNewIssue.context as IContext;
          tempIssueContext.id=myNewIssue._id;
          newViewerData = {...oldViewerData,currentIssueList:[...oldViewerData.currentIssueList,myNewIssue]};
          handleTagListChange('Issue',getViewerTypefromViewType(oldViewerData.currentViewType),newViewerData);
          finishAddTag(tempIssueContext as IContext,getViewerTypefromViewType(oldViewerData.currentViewType));
          //addTag('Issue',getViewerTypefromViewType(oldViewerData.currentViewType));            
          break;
        case 'createFailIssue':
          cancelAddTag('Issue',getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'removedIssue':
          //issue obj needed
          cancelAddTag('Issue',getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'selectIssue':
          selectTag(action.data as IContext,getViewerTypefromViewType(oldViewerData.currentViewType));
          //issue obj needed to jump to context
          break;
        case 'showTask':
          showTag('Task',true,getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'hideTask':
          showTag('Task',false,getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'createTask':
          addTag('Task',getViewerTypefromViewType(oldViewerData.currentViewType));            
          break;
        case 'createSuccessTask':
          //cancelAddTag('Task',getViewerTypefromViewType(oldViewerData.currentViewType));
          let myNewTask:ITasks = action.data as ITasks;
          let tempTaskContext:IContext = myNewTask.context as IContext;
          tempTaskContext.id=myNewTask._id;
          newViewerData = {...oldViewerData,currentTaskList:[...oldViewerData.currentTaskList,myNewTask]};
          handleTagListChange('Task',getViewerTypefromViewType(oldViewerData.currentViewType),newViewerData);
          finishAddTag(tempTaskContext as IContext,getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'createFailTask':
          cancelAddTag('Task',getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'removedTask':
          //task obj needed
          cancelAddTag('Task',getViewerTypefromViewType(oldViewerData.currentViewType));
          break;
        case 'selectTask':
          selectTag(action.data as IContext,getViewerTypefromViewType(oldViewerData.currentViewType));
          //task obj needed to jump to context
          break;
        case 'setFilteredIssueList':
          let myNewIssueList:Issue[] = action.data as Issue[];
          newViewerData = {...oldViewerData,currentIssueList:myNewIssueList};
          handleTagListChange('Issue',getViewerTypefromViewType(oldViewerData.currentViewType),newViewerData);
          break;
        case 'setFilteredTaskList':
          let myNewTaskList:ITasks[] = action.data as ITasks[];
          newViewerData = {...oldViewerData,currentTaskList:myNewTaskList};
          handleTagListChange('Task',getViewerTypefromViewType(oldViewerData.currentViewType),newViewerData);
          break;




      }
      console.log("Change is,",action,newViewerData.currentViewType);
      viewerData.current=newViewerData;
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
            // removeLayers(getViewerTypefromViewType(incomingPayload.current.action.data as string));
            // removeData(getViewerTypefromViewType(incomingPayload.current.action.data as string));

            if(getViewerTypefromViewType(incomingPayload.current.action.data as string)==='Forge')
            handleDesignTypeChange(getViewerTypefromViewType(currentViewerData.currentViewType));
            else
            handleRealityTypeChange(getViewerTypefromViewType(currentViewerData.currentViewType));

            // if(viewerData.current!==undefined){
            //   loadViewerData(viewerData.current);
            //  loadLayerData(viewerData.current);
            //  }
            break;
          case 'changeViewerAndType':
            if(viewerData.current!==undefined){
              loadViewerData(viewerData.current);
             loadLayerData(viewerData.current);
             }
            console.log('Viewer Type Updated');
            break;
          
        }
        if(viewerData.current!==undefined){
        loadMinimapData(viewerData.current)
        loadMinimapLayerData(viewerData.current);
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
          loadMinimapCompareData(currentViewerData);
          loadMinimapCompareLayerData(currentViewerData);
          console.log("Compare Use Effect Done");
        } 
        animationRequestId = requestAnimationFrame(animationNow);
        break;
      case 'setStructure':
        if(currentViewerData?.structure?.designs !==undefined) {
          if(viewerData.current!==undefined){
            loadViewerData(viewerData.current);
           loadLayerData(viewerData.current);
           loadMinimapData(viewerData.current)
           loadMinimapLayerData(viewerData.current);
           
           }
           
          }
        
          console.log("Generic Viewer load: Structure Changed", currentViewerData);
            
          animationRequestId = requestAnimationFrame(animationNow);
        
        break;
      case 'createSuccessIssue':
        //handleTagListChange('Issue',getViewerTypefromViewType(currentViewerData.currentViewType));
        break;
      case 'createSuccessTask':
        //handleTagListChange('Task',getViewerTypefromViewType(currentViewerData.currentViewType));
        break;
      case 'setBaseSnapshot':
        console.log('asdf',currentViewerData);
        if(viewerData.current!==undefined){
          //loadViewerData(viewerData.current);
         loadLayerData(viewerData.current);
         loadMinimapLayerData(viewerData.current)
         }
        break;
      case 'setCompareSnapshot':
        if(currentViewerData.currentCompareMode==='compareReality'){
          if(viewerData.current!==undefined){
          loadCompareLayerData(currentViewerData.structure,currentViewerData.currentSnapshotCompare|| currentViewerData.currentSnapshotBase,'compareReality');
          loadMinimapCompareLayerData(viewerData.current)
          }
        }
        
        break;
    }

    incomingPayload.current=undefined;
  }
  console.log("updated currentViewerData Use Effect",currentViewerData);
  window.dispatchEvent(new CustomEvent('notifyApp',{detail:{type:'syncGenViewer',data:currentViewerData}}));
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

  function addTag (type:string,viewerType:string) {
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.initiateAddTag(type);
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          console.log('TAG ADD');
          potreeUtils.current.initiateAddTag(type);
        }
        break;
    }
  };

  function finishAddTag (type:IContext,viewerType:string){
    switch (viewerType) {
      case 'Forge':
        // if (forgeUtils.current) {
        //   forgeUtils.current.finishAddTag();
        // }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.finishAddTag(type);
        }
        break;
    }
  };

  function cancelAddTag  (type:string,viewerType:string) {
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

  function selectTag  (tag:IContext,viewerType:string)  {
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

    if(viewerData.current&&viewerData.current.currentCompareMode==='compareReality'){
    //if (currentIsCompare.current === true && potreeCompareUtils.current) {
      potreeCompareUtils.current?.updateFloormapAnimation();
    }
  };

  function syncViewer  (){
    if(minimapUtils.current) {
      let minimapState;
      if( viewerData.current?.currentViewType && getViewerTypefromViewType(viewerData.current?.currentViewType) === 'Potree' && potreeUtils.current) {
        minimapState = potreeUtils.current.getContext();
      } else if(viewerData.current?.currentViewType && getViewerTypefromViewType(viewerData.current?.currentViewType) === 'Forge' && forgeUtils.current) {
        minimapState = forgeUtils.current.getContext();
      }
      minimapUtils.current.updateViewerState(minimapState)
    }

    if(minimapCompareUtils.current) {
      let minimapState;
      if(potreeUtils.current && potreeCompareUtils.current) {
        minimapState = potreeCompareUtils.current.getContext();
      }
      minimapCompareUtils.current.updateViewerState(minimapState)
    }



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

  function handleTagListChange (type:string,viewerType:string,thisViewerData:IGenData)  {
    //console.log('Inside taglist change: ', type, issuesList, tasksList);
    if (minimapUtils.current) {
      if (type === 'Issue') {
        minimapUtils.current.updateIssuesData(thisViewerData.currentIssueList);
      } else if (type === 'Task') {
        minimapUtils.current.updateTasksData(thisViewerData.currentTaskList);
      }
    }
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current) {
          if (type === 'Issue') {
            forgeUtils.current.updateIssuesData(thisViewerData.currentIssueList);
          } else if (type === 'Task') {
            forgeUtils.current.updateTasksData(thisViewerData.currentTaskList);
          }
          //forgeUtils.current.refreshData();
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          if (type === 'Issue') {
            console.log("TEST ISSUELIST",thisViewerData.currentIssueList);
            potreeUtils.current.updateIssuesData(thisViewerData.currentIssueList);
            
          } else if (type === 'Task') {
            potreeUtils.current.updateTasksData(thisViewerData.currentTaskList);
          }
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current) {
          if (type === 'Issue') {
            mapboxUtils.current.updateIssuesData(thisViewerData.currentIssueList);
          } else if (type === 'Task') {
            mapboxUtils.current.updateTasksData(thisViewerData.currentTaskList);
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
          if (currentViewerData.currentViewType==='Plan Drawings' || currentViewerData.currentViewType==='BIM')
          {
            dispatchChangeViewerData({type:'setViewType',data:'pointCloud'});
          }
          else if(currentViewerData.currentViewType==='pointCloud')
          {
            //dispatchChangeViewerData({type:'setViewType',data:'Plan Drawings'});
          }
          break;
        case 'Reality':
          break;
        case 'Task':
        case 'Issue':
          if (!incomingPayload.current) {
            incomingPayload.current = undefined;
          }
          window.dispatchEvent(new CustomEvent('notifyApp',{detail:{type:event.id.includes('Temp')
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
  const initMinimap = (viewerId:string) => {
    if (minimapUtils.current == undefined) {
      minimapUtils.current = MinimapUtils();
      minimapUtils.current.setupViewer(viewerId, viewerEventHandler);
      if(forgeInitialised) minimapUtils.current.initializeViewer();
      minimapUtils.current.setType(viewerData.current?.currentViewType);
    }
  };

  const initMinimapCompare = (viewerId:string) => {
    if (minimapCompareUtils.current == undefined) {
      minimapCompareUtils.current = MinimapUtils();
      minimapCompareUtils.current.setupViewer(viewerId, viewerEventHandler);
      if(forgeInitialised) minimapCompareUtils.current.initializeViewer();
      minimapCompareUtils.current.setType(viewerData.current?.currentViewType);
    }
  };
  async function loadMinimapData(myViewerData:IGenData) {
    if (minimapUtils.current !== undefined && myViewerData) {
      minimapUtils.current.setStructure(myViewerData.structure);
      if(myViewerData.structure.designs){
        let dMaps=getDesignMap(myViewerData.structure.designs)
        let forgeModels=getForgeModels(dMaps)
        if(forgeModels && (Object.keys(forgeModels).find(k=>k==='Plan Drawings'))){
          setShowMinimap(true);
          minimapUtils.current.updateData(forgeModels); 
        } else {
          setShowMinimap(false);
        }
        resizeMinimap('default', 1)
      }

        
      
    }
  }

  async function loadMinimapCompareData(myViewerData:IGenData) {
    if (minimapCompareUtils.current !== undefined && myViewerData) {
      minimapCompareUtils.current.setStructure(myViewerData.structure);
      if(myViewerData.structure.designs){
        let dMaps=getDesignMap(myViewerData.structure.designs)
        let forgeModels=getForgeModels(dMaps)
        if(forgeModels && (Object.keys(forgeModels).find(k=>k==='Plan Drawings'))){
          setShowMinimap(true);
          minimapCompareUtils.current.updateData(forgeModels); 
        } else {
          setShowMinimap(false);
        }
        resizeMinimap('default', 1)
      }
    }
  }

  async function loadMinimapLayerData(myViewerData:IGenData) {
    if (minimapUtils.current !== undefined) {
      minimapUtils.current.setSnapshot(myViewerData.currentSnapshotBase);
      minimapUtils.current.updateIssuesData(myViewerData.currentIssueList);
      minimapUtils.current.updateTasksData(myViewerData.currentTaskList);
      let data = await getRealityLayersPath(myViewerData.structure, getRealityMap(myViewerData.currentSnapshotBase));
      minimapUtils.current?.updateLayersData(data);
    }
    // currentContext.current = undefined;
  }

  async function loadMinimapCompareLayerData(myViewerData:IGenData) {
    if (minimapCompareUtils.current != undefined) {
      minimapCompareUtils.current.setSnapshot(myViewerData.currentSnapshotCompare);
      minimapCompareUtils.current.updateIssuesData(myViewerData.currentIssueList);
      minimapCompareUtils.current.updateTasksData(myViewerData.currentTaskList);
      let data = await getRealityLayersPath(structure, getRealityMap(myViewerData.currentSnapshotCompare));
      minimapCompareUtils.current?.updateLayersData(data);
    }
    // currentContext.current = undefined;
  }


  function renderMinimap  (count:number)  {
    if (count !== 1 && !isCompareMode) {
      return;
    }

    if(count == 2) {
      setTimeout(() => {
        resizeMinimap('minimize', count)
      }, 3000)
    }
    
    return (<Rnd
      ref={c => { count == 1 ? _minimap = c : _minimapCompare = c }}
      style={{ top:count == 1 ? '0px' : '0px'   }}
      minWidth={320}
      minHeight={28}
      maxWidth={'99%'}
      maxHeight={'99%'}
      bounds={count == 1 ? '#TheView' : '#CompareView'}
      default={{ x: count == 1 ? 84 : 24, y: 75, width: 320, height: 320 }}
      onResize={(e, direction, ref, delta, position) => {
        count == 1 ? minimapUtils.current?.resize() : minimapCompareUtils.current?.resize()
      }}
      className={`${'z-10 rounded-lg bg-white'} ${showMinimap && ((count == 1 && (getViewerTypefromViewType(viewerData.current?.currentViewType||'') === "Potree")) || (count == 2 &&  (getViewerTypefromViewType(viewerData.current?.currentCompareMode||'') === "Potree"))) ? 'opacity-100' : 'opacity-0'}`}>
      <div className='flex flex-col h-full' onKeyDown={(e) => e.nativeEvent.preventDefault()}>
        <div className='h-8 rounded-lg bg-white flex'>
          <IconButton className='cursor-move' size="small">
            <DragIndicatorIcon fontSize="inherit" />
          </IconButton>
          <div className='flex items-center text-[#F1742E] pl-2 flex-1'>Minimap</div>
          <IconButton size="small" onClick={() => { resizeMinimap('minimize', count) }} onTouchEnd={() => { resizeMinimap('minimize', count) }}>
            <RemoveIcon fontSize="inherit" />
          </IconButton>
          <IconButton size="small" onClick={() => { resizeMinimap('default', count) }} onTouchEnd={() => { resizeMinimap('default', count) }}>
            <PictureInPictureIcon fontSize="inherit" />
          </IconButton>
          <IconButton size="small" onClick={() => { resizeMinimap('fullscreen', count) }} onTouchEnd={() => { resizeMinimap('fullscreen', count) }}>
            <FullscreenIcon fontSize="inherit" />
          </IconButton>
        </div>
        <MiniMap 
          count={count} 
          style={{ height: 'calc(100%)' }} 
          compareViewMode={getViewerTypefromViewType(viewerData.current?.currentCompareMode||'')} 
          setMinimap={count == 1 ? setMinimapUtils : setMinimapCompareUtils}>
            
          </MiniMap>
      </div>
    </Rnd>)
  }

  function resizeMinimap  (mode:string, count:number)  {
    const minimap = count == 1 ? _minimap : _minimapCompare
    const utils = count == 1 ? minimapUtils.current : minimapCompareUtils.current
    switch(mode) {
      case 'minimize':
        minimap?.updateSize({ width: 320, height: 28 });
        break;
      case 'fullscreen':
        minimap?.updateSize({ width: '95%', height: '90%' });
        minimap?.updatePosition({ x: count == 1 ? 24 : 24, y: 84 });
        break;
      default:
        minimap?.updateSize({ width: 320, height: 320 });
        break;
    }
    setTimeout(() => utils?.resize(), 50)
  }


  const initViewer = (viewerId:string) => {
    // console.log("Inside init viewer: ", potreeUtils.current, forgeUtils.current);
    //console.log("InitViewer", forgeUtils.current,currentViewerData.currentViewType);
    switch (getViewerTypefromViewType(currentViewerData.currentViewType)) {
      case 'Forge':
        if (forgeUtils.current === undefined) {
          
          forgeUtils.current = ForgeViewerUtils();
          console.log("InitViewer", forgeUtils.current);
          forgeUtils.current.setupViewer(viewerId, viewerEventHandler);
          if(forgeInitialised)forgeUtils.current.initializeViewer();
          if(incomingPayload.current?.action.type==='setViewType')
          {
            console.log("InitViewer", forgeUtils.current);
            forgeUtils.current.setType(incomingPayload.current?.action.data);
          }
          else
          forgeUtils.current.setType(currentViewerData.currentViewType);

          console.log("InitViewer", forgeUtils.current);
          // multiverseViewer = forgeUtils.current;
        }
        break;
      case 'Potree':
        if (potreeUtils.current === undefined) {
          potreeUtils.current = PotreeViewerUtils();
          if (!potreeUtils.current.isViewerLoaded()) {
            potreeUtils.current.initializeViewer(viewerId, viewerEventHandler);
          }
          console.log("InitViewer", potreeUtils.current);
          // multiverseViewer = potreeUtils.current;
        }
        break;
        case 'Mapbox':
          if (mapboxUtils.current === undefined) {
             mapboxUtils.current = MapboxViewerUtils();
            mapboxUtils.current.initializeViewer(viewerId, viewerEventHandler, {utm: currentViewerData.projectUTM, context: currentContext.current?.cameraObject});
            mapboxUtils.current.setType(incomingPayload.current?.action.data);
            // multiverseViewer = mapboxUtils.current;
          }
          break;
    }
  };

  const initCompareViewer = (viewerId:string) => {
    //console.log("InitCompareViewer TEST", viewerId,currentContext,currentViewerData.currentCompareMode);
    switch (currentViewerData.currentCompareMode) {
      case 'compareDesign':
        if (forgeCompareUtils.current === undefined) {
          forgeCompareUtils.current = ForgeViewerUtils();
          forgeCompareUtils.current.setupViewer(
            viewerId,
            viewerEventHandler
          );
          if(forgeInitialised)forgeCompareUtils.current.initializeViewer();
          forgeCompareUtils.current.setType(currentViewerData.currentViewType);
        }
        break;
      case 'compareReality':
        //console.log('Compare Reality Init TEST');
        if (potreeCompareUtils.current === undefined) {
          potreeCompareUtils.current = PotreeViewerUtils();
          if (!potreeCompareUtils.current.isViewerLoaded()) {
            potreeCompareUtils.current.initializeViewer(viewerId, viewerEventHandler);
          }
        }
        break;
      case 'compareMap':
        if (mapboxCompareUtils.current == undefined) {
          mapboxCompareUtils.current = MapboxViewerUtils();
          mapboxCompareUtils.current.initializeViewer(viewerId, viewerEventHandler, {utm: currentViewerData.projectUTM}, mapboxUtils.current?.getMap());
          mapboxCompareUtils.current.setType(currentViewerData.currentViewType);          
          }
          break;
    }
  };

  async function loadViewerData(myViewerData:IGenData) {
    console.log('Load Viewer Data');
    switch (getViewerTypefromViewType(myViewerData.currentViewType)) {
      case 'Forge':
        if (forgeUtils.current !== undefined ) {
          forgeUtils.current.setStructure(myViewerData.structure);
          console.log("MyViewerStructData",myViewerData.structure.designs);
          let dMaps=getDesignMap(myViewerData.structure.designs)
          let fModels=getForgeModels(dMaps)
          forgeUtils.current.updateData(fModels);

        }

        break;
      case 'Potree':
        if (potreeUtils.current !== undefined) {
          potreeUtils.current.setStructure(myViewerData.structure);
        }
        break;
        case 'Mapbox':
          if (mapboxUtils.current !== undefined) {
            mapboxUtils.current.setProject(myViewerData.project);
            mapboxUtils.current.setStructure(myViewerData.structure);
          }
          break;
    }
  }

  async function loadLayerData(myViewerData:IGenData) {
    //console.log('Load layer data: ', issuesList, tasksList);
    switch (getViewerTypefromViewType(myViewerData.currentViewType)) {
      case 'Forge':
        if (forgeUtils.current != undefined) {
          forgeUtils.current.setSnapshot(myViewerData.currentSnapshotBase);
          forgeUtils.current.updateIssuesData(myViewerData.currentIssueList);
          forgeUtils.current.updateTasksData(myViewerData.currentTaskList);
          let Rdata = await getRealityLayersPath(myViewerData.structure, getRealityMap(myViewerData.currentSnapshotBase));
          console.log('Reality Layers',Rdata);
          forgeUtils.current.updateLayersData(Rdata,currentContext.current);
          forgeUtils.current.showLayers(myViewerData.currentLayersList);
        }
        break;
      case 'Potree':
        if (potreeUtils.current != undefined) {
          potreeUtils.current.setSnapshot(myViewerData.currentSnapshotBase);
          potreeUtils.current.updateIssuesData(myViewerData.currentIssueList);
          potreeUtils.current.updateTasksData(myViewerData.currentTaskList);
          potreeUtils.current.updateData(
            // await getPointCloud(currentViewerData.structure, currentViewerData.currentSnapshotBase),
            {},
            getFloorPlanData(getDesignMap(myViewerData.structure.designs))
          );
          //console.log("ContextVariable",currentContext.current);
          //getContext(myViewerData);
          potreeUtils.current.updateLayersData(
            await getRealityLayersPath(myViewerData.structure, getRealityMap(myViewerData.currentSnapshotBase)),
            currentContext.current//currentViewerData.viewerContext// was here
          );
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current !== undefined) {
          mapboxUtils.current.setSnapshot(myViewerData.currentSnapshotBase);
          mapboxUtils.current.setHotspotClick(selectHotspot);
          let data:IMapboxLayer[] = await getMapboxLayers(myViewerData.structure, myViewerData.currentSnapshotBase);
          const reality :IReality| undefined= myViewerData?.currentSnapshotBase?.reality?.find((reality) => { return reality })
          let hotspots = await getMapboxHotspots(myViewerData.project, myViewerData.structure._id, myViewerData.currentSnapshotBase._id, reality?._id)
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
                    stages.children?.push(subLayer)
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
                mapboxUtils.current.updateIssuesData(myViewerData.currentIssueList);
                mapboxUtils.current.updateTasksData(myViewerData.currentTaskList);
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
          let data = await getRealityLayersPath(structure, getRealityMap(compareSnapshot));
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
            {},
            getFloorPlanData(getDesignMap(structure.designs))
          );
          potreeCompareUtils.current.updateLayersData(
            await getRealityLayersPath(structure, getRealityMap(compareSnapshot)),
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
  const setMinimapUtils = function (viewerId:string) {
    initMinimap(viewerId);
    if(viewerData.current!==undefined){
      loadMinimapData(viewerData.current);
      loadMinimapLayerData(viewerData.current);
    }
  };

  const setMinimapCompareUtils = function (viewerId:string) {
    initMinimapCompare(viewerId);
    if(viewerData.current!==undefined && viewerData.current.currentCompareMode!=='noCompare'){
      loadMinimapCompareData(viewerData.current);
      loadMinimapCompareLayerData(viewerData.current);
    }
  };
  const setForgeViewerUtils = function (viewerId:string) {
    if (!isCompareViewer(viewerId)) {
      initViewer(viewerId);
      if(viewerData.current!==undefined){
      loadViewerData(viewerData.current);
      loadLayerData(viewerData.current);
      }
      //forgeUtils.current?.refreshData();
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
      if(viewerData.current!==undefined){
        loadViewerData(viewerData.current);
       loadLayerData(viewerData.current);
       }
    } else {
      initCompareViewer(viewerId);
    }
  };

  const setMapboxViewerUtils = function (viewerId:string) {
    if (!isCompareViewer(viewerId)) {
      initViewer(viewerId);
      if(viewerData.current!==undefined){
        loadViewerData(viewerData.current);
       loadLayerData(viewerData.current);
       }
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

  function removeContext  (){
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
    if(minimapCompareUtils.current) {
      minimapCompareUtils.current.shutdown();
      minimapCompareUtils.current = undefined;
      delete minimapCompareUtils.current;
    }
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

  useEffect(() => {
    setTotalPages(Math.ceil(totalSnaphotsCount / 10));
  }, [totalSnaphotsCount]);

  const setPrevList = () => {
    if (offset < totalPages) {
      getSnapshotList(structure.project, structure._id, offset + 1, pageSize);
      setOffset(offset + 1);
      // setPage(0);
    }
  };

  const setNextList = () => {
    if (offset > 1) {
      getSnapshotList(structure.project, structure._id, offset - 1, pageSize);

      setOffset(offset - 1);
      // setPage(0);
    }
  };

  return (
      <div className="fixed  h-full w-full flex flex-col">
        <div id="TheView" className="relative basis-1/2 flex grow shrink">
          {isInitReady && renderViewer(1)}
          {isInitReady && renderMinimap(1)}
          {tmcBase}
          {/* <TimeLineComponent currentSnapshot={currentViewerData.currentSnapshotBase} snapshotList={currentViewerData.snapshotList} snapshotHandler={setCurrentSnapshot} isFullScreen={isFullScreenMode} getSnapshotList={getSnapshotList} setPrevList={setPrevList}
        setNextList={setNextList}
        totalPages={totalPages}
        offset={offset} totalSnaphotsCount={totalSnaphotsCount} structure={currentViewerData.structure}></TimeLineComponent> */}
        </div>
        <div className={`relative ${currentViewerData.currentCompareMode!=='noCompare' ? "basis-1/2": "hidden" }`}>
          {isInitReady && isCompareMode && renderViewer(2)}
          {(currentViewerData.currentCompareMode==='compareReality')?renderMinimap(2):<></>}
          {tmcCompare}
          {/* <TimeLineComponent currentSnapshot={currentViewerData.currentSnapshotCompare||currentViewerData.currentSnapshotBase} snapshotList={currentViewerData.snapshotList} snapshotHandler={setCurrentCompareSnapshot} isFullScreen={isFullScreenMode}></TimeLineComponent> */}
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
