import Script from 'next/script';
import Moment from 'moment';
import {Rnd } from 'react-rnd';
import { Mixpanel } from '../analytics/mixpanel';
import React, { useEffect, useState, memo, useRef, useCallback } from 'react';
import Draggable, { DraggableCore } from "react-draggable";
import Head from 'next/head';
import Header from './header';
import { autodeskAuth } from "../../services/forgeService";
import { MinimapUtils } from '../../utils/MinimapWrapper';
import { ForgeViewerUtils } from '../../utils/ForgeWrapper2';
import { PotreeViewerUtils } from '../../utils/PotreeWrapper2';
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
import MiniMap from './minimap';
import ForgeViewer from './forgeViewer';
import PotreeViewer from './potreeViewer';
import MapboxViewer from './mapboxViewer';
import {
  getForgeModels,
  getPointCloud,
  getPointClouds,
  getPointCloudReality,
  getRealityLayers,
  getRealityLayersPath,
  getDesignMap,
  getMapboxLayers, getMapboxHotspots,
  getRealityMap, getFloorPlanData,
} from "../../utils/ViewerDataUtils";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import RemoveIcon from '@mui/icons-material/Remove';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import { IconButton } from '@mui/material';
import { faToggleOff } from "@fortawesome/free-solid-svg-icons";
import TimeLineComponent from '../divami_components/timeline-container/TimeLineComponent'
import Hotspots from './hotspots';
import HotspotsCompare from './hotspotsCompare';
import styles from "../../styles/GenericViewer.module.css"
function GenericViewer(props) {
  const genericViewer = 'genericViewer';
  const genericViewerRef = useRef();
  const compareViewer = 'compareViewer';
  const compareViewerRef = useRef();
  const [fullScreenMode, setFullScreenMode] = useState(props.isFullScreen)
  let structure = props.structure;
  let isFullScreenActive=props.isFullScreenActive;
  let isFullScreens=props.isFullScreen;
  
  let currentStructure = useRef();

  let [designList, setDesignList] = useState([]);
  let [designMap, setDesignMap] = useState({});
  let updateDesignMap = props.updateDesignMap;

  let [snapshotList, setSnapshotList] = useState([]);
  let [snapshot, setSnapshot] = useState({});
  let updateSnapshot = props.updateSnapshot;

  let project = props.project;

  let [realityList, setRealityList] = useState([]);
  let [realityMap, setRealityMap] = useState({});
  let updateRealityMap = props.updateRealityMap;

  let [compareSnapshot, setCompareSnapshot] = useState({});
  let [compareRealityList, setCompareRealityList] = useState([]);
  let [compareRealityMap, setCompareRealityMap] = useState({});

  let viewMode = props.viewMode;
  // let [viewMode, setViewMode] = useState(props.viewMode);
  let currentViewMode = useRef(viewMode);

  let [viewerType, setViewerType] = useState('Forge');
  let currentViewerType = useRef(viewerType);

  let viewType = (props.viewType);
  let currentViewType = useRef(viewType);

  let viewLayers = props.viewLayers;

  let [showMinimap, setShowMinimap] = useState(false);
  let [isCompare, setIsCompare] = useState(false);
  let currentIsCompare = useRef(isCompare);
  let [compareViewMode, setCompareViewMode] = useState({});
  let currentCompareViewMode = useRef(compareViewMode);

  let tool = props.tools;
  let activeTool = useRef(tool);
  let pushToolResponse = props.toolRes;

  let minimapUtils = useRef();
  let minimapCompareUtils = useRef();
  let forgeUtils = useRef();
  let potreeUtils = useRef();
  let mapboxUtils = useRef();

  let potreeCompareUtils = useRef();
  let forgeCompareUtils = useRef();
  let mapboxCompareUtils = useRef();

  let _minimap;
  let _minimapCompare;

  let [context, setContext] = useState({});
  let currentContext = useRef();

  let animationRequestId;
  let isMouseOnMainViewer = useRef(true);
  let syncForgeEvent = useRef(false);
  let syncPotreeEvent = useRef(false);
  let syncMapboxEvent = useRef(false);

  let tasksList = props.tasksList;
  let issuesList = props.issuesList;

  const [bottomNav, setBottomNav] = useState(false);
  const toggleTimeline = () => {
    setBottomNav(!bottomNav);
  };

  let [hotspots, setHotspots] = useState([]);
  let [hotspotsCompare, setHotspotsCompare] = useState([]);
  let [selectedHotspot, setSelectedHotspot] = useState(0);
  let [selectedHotspotDetails, setSelectedHotspotDetails] = useState();
  let [selectedHotspotCompareDetails, setSelectedHotspotCompareDetails] = useState();
  let [forgeInitialised, setForgeInitialised] = useState(false);
  let [currentViewer, setCurrentViewer] = useState('Forge');

  let [isMarkerMode, setMarkerMode] = useState(false);
  const [offset, setOffset] = useState(1);
  const pageSize = 10;
  const [totalSnaphotsCount,setTotalSnaphotsCount] = useState(0)

  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalSnaphotsCount / 10)
  );

  const initializeOptions = {
    env: "AutodeskProduction2", //Local, AutodeskProduction, AutodeskProduction2
    api: "streamingV2", // for models uploaded to EMEA change this option to 'derivativeV2_EU'
    getAccessToken: async function (onSuccess) {
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

  useEffect(()=>{
    setFullScreenMode(props.isFullScreen)
  },[props.isFullScreen])
  const getViewerTypeFromViewMode = () => {
    switch (viewMode) {
      case 'Design':
        return 'Forge';
        break;
      case 'Reality':
        return 'Potree';
        break;
    }
  }

  const getViewerTypeFromViewType = () => {
    switch (viewType) {
      case 'pointCloud':
        if (currentViewMode.current == 'Design') {
          currentViewMode.current = 'Reality'
          pushToolResponse({
            toolName: 'viewMode',
            toolAction: 'Reality',
          });
        }
        return 'Potree';
        break;
      case 'orthoPhoto':
        if (currentViewMode.current == 'Design') {
          currentViewMode.current = 'Reality'
          pushToolResponse({
            toolName: 'viewMode',
            toolAction: 'Reality',
          });
        }
        return 'Mapbox';
        break;
      default:
        if (currentViewMode.current == 'Reality') {
          currentViewMode.current = 'Design'
          pushToolResponse({
            toolName: 'viewMode',
            toolAction: 'Design',
          });
        } else {
          handleDesignTypeChange();
        }
        return 'Forge';
    }
  }


  function handleViewerTypeChange() {
    // console.log(
    //   "Generic Viewer After change in viewmode, clean: ",
    //   currentContext.current
    // );
    // console.log(
    //   "Generic Viewer After change in viewmode, clean: ",
    //   currentContext.current
    // );

    loadViewerData();

    if (realityList.length > 0) {
      loadLayerData();
      // loadMinimapLayerData();
    }
  }

  function handleDesignTypeChange() {

    switch (currentViewerType.current) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.setType(currentViewType.current);
          forgeUtils.current.refreshData(currentContext.current);
        }
        break;
    }
    currentContext.current = undefined;
  }

  function handleRealityTypeChange() {

    if (viewLayers) {
      Object.keys(viewLayers).forEach(type => {
        if (minimapUtils.current) {
          minimapUtils.current.showTag(type, viewLayers[type].isSelected)
        }

        if (minimapCompareUtils.current) {
          minimapCompareUtils.current.showTag(type, viewLayers[type].isSelected)
        }
      })
    }
    
    switch (currentViewerType.current) {
      case 'Forge':
        if (forgeUtils.current) {
          viewLayers && forgeUtils.current.showLayers(Object.values(viewLayers).map(v => {
            if (v.isSelected) return v.name
          }));
        }

        break;
      case 'Potree':
        // loadViewerData();
        // loadLayerData();
        if (forgeCompareUtils.current) {
          viewLayers && forgeCompareUtils.current.showLayers(Object.values(viewLayers).map(v => {
            if (v.isSelected) return v.name
          }));
        }
        break;
      case 'Mapbox':
        break;
    }
  }

  function handleToolChange() {
    // console.log("My new tool=",activeTool);
    switch (
    activeTool.current === undefined ? '' : activeTool.current.toolAction
    ) {
      case 'issueCreate':
        addTag('Issue');
        break;
      case 'issueCreateSuccess':
        finishAddTag(activeTool.current.response);
        break;
      case 'issueCreateFail':
        cancelAddTag('Issue');
        break;
      case 'issueSelect':
        selectTag(activeTool.current.response);
        break;
      case 'issueShow':
        showTag('Issue', true);
        break;
      case 'issueHide':
        showTag('Issue', false);
        break;
      case 'taskCreate':
        addTag('Task');
        break;
      case 'taskCreateSuccess':
        finishAddTag(activeTool.current.response);
        break;
      case 'taskCreateFail':
        cancelAddTag('Task');
        break;
      case 'taskSelect':
        selectTag(activeTool.current.response);
        break;
      case 'taskShow':
        showTag('Task', true);
        break;
      case 'taskHide':
        showTag('Task', false);
        break;
      case 'showCompare':
        let currentMode = activeTool.current.toolName.endsWith('Design')
          ? 'Forge'
          : currentViewerType.current;
        getContext();
        setCompareViewMode(currentMode);
        currentCompareViewMode.current = currentMode;
        setIsCompare(true);
        break;
      case 'closeCompare':
        setIsCompare(false);
        if (mapboxUtils.current && mapboxUtils.current.getMap()) {
          setTimeout(() => {
            if (mapboxUtils.current) {
              mapboxUtils.current.resize()
            }
          },
            100)
        }
        break;
      default:
        break;
    }
  }

  const addTag = (type) => {
    switch (currentViewerType.current) {
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

  const cancelAddTag = (type) => {
    switch (currentViewerType.current) {
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

  const finishAddTag = (tag) => {
    switch (currentViewerType.current) {
      case 'Forge':
        // if (forgeUtils.current) {
        //   forgeUtils.current.finishAddTag();
        // }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.finishAddTag(tag);
        }
        break;
    }
  };

  const selectTag = (tag) => {
    switch (currentViewerType.current) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.selectTag(tag);
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.selectTag(tag);
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current) {
          mapboxUtils.current.selectTag(tag);
        }
        break;
    }
  };

  const showTag = (tag, show) => {
    if (minimapUtils.current) {
      minimapUtils.current.showTag(tag, show);
    }

    if (isCompare && minimapCompareUtils.current) {
      minimapCompareUtils.current.showTag(tag, show);
    }
    switch (currentViewerType.current) {
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
      case 'Mapbox':
        if (mapboxUtils.current) {
          mapboxUtils.current.showTag(tag, show);
        }
        break;
    }
  }

  const animationNow = () => {
    // console.log("Inside Animate now: ")
    syncViewer();
    // getContext();
    animationRequestId = requestAnimationFrame(animationNow);
    if (potreeUtils.current) {
      potreeUtils.current.updateFloormapAnimation();
    }

    if (currentIsCompare.current === true && potreeCompareUtils.current) {
      potreeCompareUtils.current.updateFloormapAnimation();
    }
  };

  const syncViewer = () => {
    // console.log("Inside sync viewer: ", isMouseOnMainViewer.current, syncPotreeEvent, syncForgeEvent)
    if(minimapUtils.current) {
      let minimapState;
      if(currentViewerType.current === 'Potree' && potreeUtils.current) {
        minimapState = potreeUtils.current.getContext();
      } else if(currentViewerType.current === 'Forge' && forgeUtils.current) {
        minimapState = forgeUtils.current.getContext();
      }
      minimapUtils.current.updateViewerState(minimapState)
    }

    if(minimapCompareUtils.current) {
      let minimapState;
      if(potreeUtils.current) {
        minimapState = potreeCompareUtils.current.getContext();
      }
      minimapCompareUtils.current.updateViewerState(minimapState)
    }

    if (currentIsCompare.current == true) {
      if (isMouseOnMainViewer.current == true) {
        if (currentCompareViewMode.current === 'Potree') {
          // get from potree utils
          //give to potree compare utile
          if (
            potreeUtils.current != undefined &&
            potreeCompareUtils.current != undefined
          ) {
            let viewerState = potreeUtils.current.getViewerState();
            potreeCompareUtils.current.updateViewerState(viewerState);
            syncPotreeEvent.current = false;
          }
        } else if (syncPotreeEvent.current) {
          // }else {
          // get from potree utils
          //give to forge compare utile
          if (
            potreeUtils.current != undefined &&
            forgeCompareUtils.current != undefined
          ) {
            let viewerState = potreeUtils.current.getViewerState();
            forgeCompareUtils.current.updateViewerState(viewerState);
            syncPotreeEvent.current = false;
          }
        }
      } else {
        if (currentCompareViewMode.current === 'Potree') {
          //get from potree compare utils
          // give to potree utils
          if (
            potreeUtils.current != undefined &&
            potreeCompareUtils.current != undefined
          ) {
            let viewerState = potreeCompareUtils.current.getViewerState();
            potreeUtils.current.updateViewerState(viewerState);
            syncPotreeEvent.current = false;
          }
        } else if (syncPotreeEvent.current) {
          if (
            potreeUtils.current != undefined &&
            forgeCompareUtils.current != undefined
          ) {
            let viewerState = potreeUtils.current.getViewerState();
            forgeCompareUtils.current.updateViewerState(viewerState);
            syncPotreeEvent.current = false;
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
            syncForgeEvent.current = false;
          }
        }
      }
      // syncPotreeEvent.current = false;
      // syncForgeEvent.current = false;
    }
  };

  const handleTagListChange = (type) => {
    console.log('Inside taglist change: ', type, issuesList, tasksList);
    if (minimapUtils.current) {
      if (type === 'Issue') {
        minimapUtils.current.updateIssuesData(issuesList);
      } else if (type === 'Task') {
        minimapUtils.current.updateTasksData(tasksList);
      }
    }

    if (isCompare && minimapCompareUtils.current) {
      if (type === 'Issue') {
        minimapCompareUtils.current.updateIssuesData(issuesList);
      } else if (type === 'Task') {
        minimapCompareUtils.current.updateTasksData(tasksList);
      }
    }

    switch (currentViewerType.current) {
      case 'Forge':
        if (forgeUtils.current) {
          if (type === 'Issue') {
            forgeUtils.current.updateIssuesData(issuesList);
          } else if (type === 'Task') {
            forgeUtils.current.updateTasksData(tasksList);
          }
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          if (type === 'Issue') {
            potreeUtils.current.updateIssuesData(issuesList);
          } else if (type === 'Task') {
            potreeUtils.current.updateTasksData(tasksList);
          }
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current) {
          if (type === 'Issue') {
            mapboxUtils.current.updateIssuesData(issuesList);
          } else if (type === 'Task') {
            mapboxUtils.current.updateTasksData(tasksList);
          }
        }
        break;
    }
  };

  const viewerEventHandler = (viewerId, event) => {
    // console.log("Inside generic viewer: ", event);
    if (event) {
      switch (event.type) {
        case 'Drone Image':
        case 'Phone Image':
        case '360 Image':
        case '360 Video':
          currentContext.current = event;
          const isMinimap = viewerId.indexOf('minimap') > -1;
          if(isMinimap) {
            if (isMinimapCompareViewer(viewerId)) {
              if (currentCompareViewMode.current === 'Potree') {
                potreeCompareUtils.current.updateContext(event, true);
              } else {
                potreeUtils.current.updateContext(event, true);
                // forgeCompareUtils.current.updateContext(event, true);
              }
              currentContext.current = undefined;
            } else {
              if (currentViewerType.current == 'Forge') {
                pushToolResponse({
                  toolName: 'viewMode',
                  toolAction: 'Reality',
                });
                setViewerType('Potree');
              }
              else {
                potreeUtils.current.updateContext(event, true);
                currentContext.current = undefined;
              }
            }
            return;
          }
            
          if (currentIsCompare.current == true) {
            if (isCompareViewer(viewerId)) {
              potreeUtils.current.updateContext(event, false);
            } else {
              if (currentCompareViewMode.current === 'Potree') {
                potreeCompareUtils.current.updateContext(event, false);
              } else {
                forgeCompareUtils.current.updateContext(event, false);
              }
            }
            currentContext.current = undefined;
          } else if (currentViewerType.current == 'Forge') {
            pushToolResponse({
              toolName: 'viewMode',
              toolAction: 'Reality',
            });
            setViewerType('Potree');
            // setViewMode('Reality');
          } else if (currentViewerType.current == 'Mapbox') {
            
          } else if (currentViewerType.current == 'Potree') {
            
          }
          break;
        case 'Reality':
          break;
        case 'Task':
        case 'Issue':
          if (!activeTool.current) {
            activeTool.current = {};
          }
          activeTool.current.toolName = event.type;
          activeTool.current.toolAction = event.id.includes('Temp')
            ? `create${event.type}`
            : `select${event.type}`;
          activeTool.current.response = event;
          pushToolResponse(activeTool.current);
          if(!event.id.includes('Temp') && potreeUtils.current) {
            selectTag(event)
          }
          console.log('Marked Point========', event);
          break;
        case '3d':
        case 'panorama':
        case 'image':
          if (currentIsCompare.current == true) {
            if (isCompareViewer(viewerId)) {
              potreeUtils.current.updateContext(event, false);
            } else {
              if (currentCompareViewMode.current === 'Potree') {
                potreeCompareUtils.current.updateContext(event, false);
              } else {
                forgeCompareUtils.current.updateContext(event, false);
              }
            }
          }
          break;
        case 'sync':
          // console.log("Inside sync event: ", currentIsCompare.current, isRealityViewer(viewerId))
          if (currentIsCompare.current == true) {
            if (isRealityViewer(viewerId)) {
              syncPotreeEvent.current = true;
            } else {
              syncForgeEvent.current = true;
            }
          }

          if(currentViewerType.current === 'Forge') {
            let con = event.context;
            if(con && minimapUtils.current) {
              minimapUtils.current.updateViewerState(con)
            }
          }
          break;
        case 'zoom':
          // console.log("Sync event handler: ", viewerId);
          if (currentIsCompare.current === true) {
            syncViewer(viewerId);
          }
          break;
        case 'mouse':
          // console.log("Potree Sync event handler: ", viewerId);
          if (currentIsCompare.current === true) {
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

  const initMinimap = (viewerId) => {
    if (minimapUtils.current == undefined) {
      minimapUtils.current = MinimapUtils();
      minimapUtils.current.setupViewer(viewerId, viewerEventHandler);
      if(forgeInitialised) minimapUtils.current.initializeViewer();
      minimapUtils.current.setType(currentViewType.current);
    }
  };

  const initMinimapCompare = (viewerId) => {
    if (minimapCompareUtils.current == undefined) {
      minimapCompareUtils.current = MinimapUtils();
      minimapCompareUtils.current.setupViewer(viewerId, viewerEventHandler);
      if(forgeInitialised) minimapCompareUtils.current.initializeViewer();
      minimapCompareUtils.current.setType(currentViewType.current);
    }
  };

  const initViewer = (viewerId) => {
    console.log("Generic Viewer Inside init viewer: ", viewerType, currentViewerType.current, forgeUtils, potreeUtils, mapboxUtils);
    switch (viewerType) {
      case 'Forge':
        if (forgeUtils.current == undefined) {
          forgeUtils.current = ForgeViewerUtils();
          forgeUtils.current.setupViewer(viewerId, viewerEventHandler);
          if(forgeInitialised) forgeUtils.current.initializeViewer()
          forgeUtils.current.setType(currentViewType.current);
        }
        break;
      case 'Potree':
        if (potreeUtils.current == undefined) {
          potreeUtils.current = PotreeViewerUtils();
          if (!potreeUtils.current.isViewerLoaded()) {
            potreeUtils.current.initializeViewer(viewerId, viewerEventHandler);
          }
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current == undefined) {
          mapboxUtils.current = MapboxViewerUtils();
          mapboxUtils.current.initializeViewer(viewerId, viewerEventHandler, { utm: project.utm, context: currentContext.current.cameraObject });
          mapboxUtils.current.setType(viewType);
        }
        break;
    }
    Mixpanel.track('viewer_initialised')
  };

  const initCompareViewer = (viewerId) => {
    console.log("Generic Viewer Init compare viewer: ", compareViewMode, currentCompareViewMode, forgeCompareUtils, potreeCompareUtils, mapboxCompareUtils);
    switch (compareViewMode) {
      case 'Forge':
        if (forgeCompareUtils.current == undefined) {
          forgeCompareUtils.current = ForgeViewerUtils();
          forgeCompareUtils.current.setupViewer(viewerId, viewerEventHandler);
          if(forgeInitialised) forgeCompareUtils.current.initializeViewer()
          forgeCompareUtils.current.setType(currentViewType.current);
        }
        break;
      case 'Potree':
        if (potreeCompareUtils.current == undefined) {
          potreeCompareUtils.current = PotreeViewerUtils();
          if (!potreeCompareUtils.current.isViewerLoaded()) {
            potreeCompareUtils.current.initializeViewer(viewerId, viewerEventHandler);
          }
        }
        break;
      case 'Mapbox':
        if (mapboxCompareUtils.current == undefined) {
          mapboxCompareUtils.current = MapboxViewerUtils();
          mapboxCompareUtils.current.initializeViewer(viewerId, viewerEventHandler, {utm: project.utm}, mapboxUtils.current.getMap());
          mapboxCompareUtils.current.setType(viewType);
        }
        break;
    }
  };

  async function loadMinimapData() {
    if (minimapUtils.current != undefined) {
      minimapUtils.current.setStructure(structure);
      if (designList.length > 0) {
        const forgeModels = getForgeModels(designMap)
        if(forgeModels && forgeModels['Plan Drawings']) {
          setShowMinimap(true);
          minimapUtils.current.updateData(forgeModels); 
        } else {
          setShowMinimap(false);
        }
        resizeMinimap('default', 1)
      }
    }
  }

  async function loadMinimapCompareData() {
    if (minimapCompareUtils.current != undefined) {
      minimapCompareUtils.current.setStructure(structure);
      if (designList.length > 0) {
        const forgeModels = getForgeModels(designMap)
        if(forgeModels && forgeModels['Plan Drawings']) {
          setShowMinimap(true);
          minimapCompareUtils.current.updateData(getForgeModels(designMap)); 
        } else {
          setShowMinimap(false);
        }
      }
    }
  }

  async function loadViewerData() {
    console.log("Generic Viewer Load Viewer Data", viewerType, currentViewType.current, mapboxUtils, potreeUtils, designMap, designMap)
    switch (currentViewerType.current) {
      case 'Forge':
        if (forgeUtils.current != undefined) {
          forgeUtils.current.setStructure(structure);
          if (designList.length > 0) {
            forgeUtils.current.setType(currentViewType.current);
            forgeUtils.current.updateData(getForgeModels(designMap));
          } else {
            pushToolResponse({
              toolName: 'viewMode',
              toolAction: 'Reality',
            });
            setViewerType('Potree');
          }

        }

        break;
      case 'Potree':
        if (potreeUtils.current != undefined) {
          potreeUtils.current.setStructure(structure);
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current != undefined) {
          mapboxUtils.current.setProject(project);
          mapboxUtils.current.setStructure(structure);
        }
        break;
    }
  }

  async function loadMinimapLayerData() {
    if (minimapUtils.current != undefined) {
      minimapUtils.current.setSnapshot(snapshot);
      minimapUtils.current.updateIssuesData(issuesList);
      minimapUtils.current.updateTasksData(tasksList);
      let data = await getRealityLayersPath(structure, realityMap);
      minimapUtils.current?.updateLayersData(data);
    }
    // currentContext.current = undefined;
  }

  async function loadMinimapCompareLayerData() {
    if (minimapCompareUtils.current != undefined) {
      minimapCompareUtils.current.setSnapshot(compareSnapshot);
      minimapCompareUtils.current.updateIssuesData(issuesList);
      minimapCompareUtils.current.updateTasksData(tasksList);
      let data = await getRealityLayersPath(structure, compareRealityMap);
      minimapCompareUtils.current?.updateLayersData(data);
    }
    // currentContext.current = undefined;
  }

  async function loadLayerData() {
    console.log("Testing View mode Change: Inside loadLayerData: ", realityMap);
    console.log('Generic Viewer Load layer data: ', viewerType, currentViewerType.current, currentContext.current, issuesList, tasksList);
    switch (currentViewerType.current) {
      case 'Forge':
        if (forgeUtils.current != undefined) {
          forgeUtils.current.setSnapshot(snapshot);
          forgeUtils.current.updateIssuesData(issuesList);
          forgeUtils.current.updateTasksData(tasksList);
          let data = await getRealityLayersPath(structure, realityMap);
          forgeUtils.current?.updateLayersData(data, currentContext.current);
        }
        break;
      case 'Potree':
        if (potreeUtils.current != undefined) {
          potreeUtils.current.setSnapshot(snapshot);
          potreeUtils.current.updateIssuesData(issuesList);
          potreeUtils.current.updateTasksData(tasksList);
          potreeUtils.current.updateData(
            {},
            getFloorPlanData(designMap)
          );
          potreeUtils.current.updateLayersData(
            await getRealityLayersPath(structure, realityMap),
            currentContext.current
          );
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current != undefined) {
          mapboxUtils.current.setSnapshot(snapshot);
          mapboxUtils.current.setHotspotClick(selectHotspot);
          let data = await getMapboxLayers(structure, snapshot);
          const reality = snapshot.reality.find((reality) => { return reality })
          let hotspots = await getMapboxHotspots(project._id, structure._id, snapshot._id, reality._id)
          if (data) {
            const map = getRealityMap(snapshot)
            const stages = {
              name: 'Stages',
              children: [],
              isSelected: true
            }
            data.forEach((layer) => {
              if (layer.categories) {
                layer.categories.forEach((category) => {
                  category.filters.forEach((stage) => {
                    const subLayer = {
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
            map['Stages'] = stages
            setRealityMap(map)
            updateRealityMap(map)
          }
          setTimeout(() => {
            if (mapboxUtils.current != undefined) {

              mapboxUtils.current.updateData(data, currentContext.current);
              hotspots && hotspots.data && setHotspots(hotspots.data.features);
              mapboxUtils.current.updateIssuesData(issuesList);
              mapboxUtils.current.updateTasksData(tasksList);
            }
          }, 700);
        }
        break;
    }
    currentContext.current = undefined;
  }

  async function loadCompareViewerData() {
    switch (compareViewMode) {
      case 'Forge':
        if (forgeCompareUtils.current != undefined) {
          forgeCompareUtils.current.setStructure(structure);
          if (designList.length > 0) {
            forgeCompareUtils.current.updateData(getForgeModels(designMap));
          } else {
            getContext();
            setCompareViewMode(currentViewerType.current);
            currentCompareViewMode.current = currentViewerType.current;
            setIsCompare(true);
          }
        }

        break;
      case 'Potree':
        if (potreeCompareUtils.current != undefined) {
          potreeCompareUtils.current.setStructure(structure);
        }
        break;
      case 'Mapbox':
        if (mapboxCompareUtils.current != undefined) {
          mapboxCompareUtils.current.setProject(project);
          mapboxCompareUtils.current.setStructure(structure);
        }
        break;
    }
  }

  async function loadCompareLayerData() {
    switch (compareViewMode) {
      case 'Forge':
        if (forgeCompareUtils.current) {
          forgeCompareUtils.current.setSnapshot(compareSnapshot);
          let data = await getRealityLayersPath(structure, compareRealityMap);
          forgeCompareUtils.current.updateLayersData(
            data,
            currentContext.current
          );
        }
        break;
      case 'Potree':
        if (potreeCompareUtils.current) {
          potreeCompareUtils.current.setSnapshot(compareSnapshot);
          potreeCompareUtils.current.updateData(
            {},
            getFloorPlanData(designMap)
          );
          potreeCompareUtils.current.updateLayersData(
            await getRealityLayersPath(structure, compareRealityMap),
            currentContext.current
          );
        }
        break;
      case 'Mapbox':
        if (mapboxCompareUtils.current != undefined) {
          mapboxCompareUtils.current.setSnapshot(compareSnapshot);
          mapboxCompareUtils.current.setHotspotClick(selectHotspot);
          let data = await getMapboxLayers(structure, compareSnapshot);
          const reality = compareSnapshot.reality.find((reality) => { return reality })
          let hotspots = await getMapboxHotspots(project._id, structure._id, compareSnapshot._id, reality._id)
          setTimeout(() => {
            if (mapboxCompareUtils.current != undefined) {
              mapboxCompareUtils.current.updateData(data, currentContext.current);
              hotspots && hotspots.data && (hotspotsCompare = hotspots.data.features);
              hotspots && hotspots.data && setHotspotsCompare(hotspots.data.features);
              mapboxCompareUtils.current.updateIssuesData(issuesList);
              mapboxUtils.current.updateTasksData(tasksList);
              setTimeout(() => {

                if (viewLayers && viewLayers['Stages']) {
                  const filters = ['any']
                  const children = viewLayers['Stages'].children;
                  for (let i = 0; i < children.length; i++) {
                    if (children[i].isSelected) {
                      filters.push(children[i].filters)
                    }
                  }

                  if (mapboxCompareUtils.current && mapboxCompareUtils.current.isViewerInitialized()) {
                    mapboxCompareUtils.current.getMap().setFilter('progress-stages', filters)
                  }
                }
              }, 500)
            }
          }, 700);
        }
        break;
    }
    currentContext.current = undefined;
  }

  function updateViewerChanges() {
    switch (currentViewerType.current) {
      case 'Forge':
        if (forgeUtils.current) {
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.readyForCompare(currentCompareViewMode.current);
        }
        break;
      case 'Mapbox':

        break;
    }
  }

  const setMinimapUtils = function (viewerId) {
    initMinimap(viewerId);
  };

  const setMinimapCompareUtils = function (viewerId) {
    initMinimapCompare(viewerId);
  };

  const setForgeViewerUtils = function (viewerId) {
    if (!isCompareViewer(viewerId)) {
      initViewer(viewerId);
    } else {
      initCompareViewer(viewerId);
    }
  };

  const setpotreeViewerUtils = function (viewerId) {
    if (!isCompareViewer(viewerId)) {
      initViewer(viewerId);
    } else {
      initCompareViewer(viewerId);
    }
  };

  const setMapboxViewerUtils = function (viewerId) {
    if (!isCompareViewer(viewerId)) {
      initViewer(viewerId);
    } else {
      initCompareViewer(viewerId);
    }
  };

  function renderViewer(count) {
    // console.log("Generic Viewer Inside render View: ", currentViewerType.current, viewerType, compareViewMode, currentCompareViewMode.current);
    if (count != 1 && !isCompare) {
      return;
    }
    let mode = count == 1 ? viewerType : compareViewMode;
    // console.log("Generic Viewer Checking render mode", mode);
    switch (mode) {
      case 'Forge':
        return (
          <ForgeViewer
            viewerCount={count}
            setForgeViewer={setForgeViewerUtils}
          ></ForgeViewer>
        );
      case 'Potree':
        return (
          <PotreeViewer
            viewerCount={count}
            setPotreeViewer={setpotreeViewerUtils}
          ></PotreeViewer>
        );
      case 'Mapbox':
        return (
          <MapboxViewer
            viewerCount={count}
            setMapboxViewer={setMapboxViewerUtils}
          ></MapboxViewer>
        );
    }
  }

  const modifyDesignList = async (designList) => {
    console.log('Generic Viewer Inside Modified design List: ', designList);
    for (let design of designList) {
      if (!design.tm) {
        let response = await getDesignTM(
          getDesignPath(design.project, design.structure, design._id)
        );
        design.tm = response.data;
      }
    }
    console.log('Generic Viewer design modified: ', designList);
    setDesignList(designList);
    //Set current design type and pass it to structure page.
    setDesignMap(getDesignMap(designList));
    updateDesignMap(getDesignMap(designList));
    console.log(getDesignMap(designList));
    return designList;
  };


  const getSnapshotList = async (projectId, structurId,offset,limit) => {
    let list = await getSnapshotsList(projectId, structurId,offset||1,limit||10);
    setTotalSnaphotsCount(list.data?.result?.totalSnapshots)
    list = list.data.result.mSnapshots.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (list.length > 0) {
      setSnapshotList(list);
      setCurrentSnapshot(list[list.length - 1]);
      if (list.length > 1) {
        setCurrentCompareSnapshot(list[list.length - 2]);
      } else {
        setCurrentCompareSnapshot(list[list.length - 1]);
      }
    }
  };

  const setCurrentSnapshot = (snapshot) => {
    if (snapshot) {

      setSnapshot(snapshot);
      updateSnapshot(snapshot);
      setRealityList(snapshot.reality);
      setRealityMap(getRealityMap(snapshot));
      updateRealityMap(getRealityMap(snapshot));
    }

  };

  const setCurrentCompareSnapshot = (snapshot) => {
    if (snapshot) {

      setCompareSnapshot(snapshot);
      // updateSnapshot(snapshot);
      setCompareRealityList(snapshot.reality);
      setCompareRealityMap(getRealityMap(snapshot));
      // updateRealityMap(getRealityMap(snapshot));
    }
  };

  const isCompareViewer = (viewerId) => {
    if (viewerId.split('_')[1] === '1') {
      return false;
    } else {
      return true;
    }
  };

  const isMinimapCompareViewer = (viewerId) => {
    if (viewerId.split('-')[1] === '1') {
      return false;
    } else {
      return true;
    }
  };

  const isRealityViewer = (viewerId) => {
    if (viewerId.split('_')[0] === 'forgeViewer') {
      return false;
    } else {
      return true;
    }
  };

  const removeContext = () => {
    setContext(undefined);
    currentContext.current = undefined;
  };

  const getContext = () => {
    let context;
    console.log("Generic Viewer Getting context from existing viewmode: ", viewerType, currentViewerType.current, forgeUtils.current, potreeUtils.current);
    if (currentContext.current) {
      console.log(
        'Generic Viewer getContext: already available ',
        currentContext.current
      );
      return;
    }
    switch (currentViewerType.current) {
      case 'Forge':
        if (forgeUtils.current) {
          context = forgeUtils.current.getContext();
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          context = potreeUtils.current.getContext();
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current) {
          // context = mapboxUtils.current.getContext();
        }
        break;
    }
    console.log('Generic Viewer getContext: camera ', context);
    // setContext(context);
    currentContext.current = context;
    // currentContext.current && minimapUtils.current.createMarker(currentContext.current.cameraObject.cameraTarget, currentContext.current.cameraObject.yaw)
  };

  const removeData = () => {
    switch (currentViewerType.current) {
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

  const removeLayers = () => {
    if (minimapUtils.current) {
      minimapUtils.current.removeLayers();
    }

    switch (currentViewerType.current) {
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

  const removeCompareLayers = () => {
    if (isCompare && minimapCompareUtils.current) {
      minimapCompareUtils.current.removeLayers();
    }

    switch (currentCompareViewMode.current) {
      case 'Forge':
        if (forgeCompareUtils.current) {
          forgeCompareUtils.current.removeLayers();
        }
        break;
      case 'Potree':
        if (potreeCompareUtils.current) {
          potreeCompareUtils.current.removeData();
        }
        break;
      case 'Mapbox':
        if (mapboxCompareUtils.current) {
          mapboxCompareUtils.current.removeData()
        }
        break;
    }
  };

  const destroyViewer = () => {
    // console.log('Generic Viewer Inside destroy viewer: ', viewerType, currentViewerType.current);
    switch (currentViewerType.current) {
      case 'Forge':
        if (forgeUtils.current) {
          forgeUtils.current.shutdown();
          delete forgeUtils.current;
        }
        break;
      case 'Potree':
        if (potreeUtils.current) {
          potreeUtils.current.shutdown();
          potreeUtils.current = undefined;
          delete potreeUtils.current;
        }
        break;
      case 'Mapbox':
        if (mapboxUtils.current) {
          mapboxUtils.current.shutdown();
          mapboxCompareUtils.current = undefined;
          delete mapboxUtils.current;
          realityMap && realityMap['Stages'] && delete realityMap['Stages']
          // setRealityMap(realityMap)
          // updateRealityMap(realityMap)
        }
        break;
    }
    Mixpanel.track('viewer_closed')
  };

  const destroyCompareViewer = () => {
    if(minimapCompareUtils.current) {
      minimapCompareUtils.current.shutdown();
      minimapCompareUtils.current = undefined;
      delete minimapCompareUtils.current;
    }
    switch (currentCompareViewMode.current) {
      case 'Forge':
        if (forgeCompareUtils.current) {
          forgeCompareUtils.current.shutdown();
          delete forgeCompareUtils.current;
        }
        break;
      case 'Potree':
        if (potreeCompareUtils.current) {
          potreeCompareUtils.current.shutdown();
          potreeCompareUtils.current = undefined;
          delete potreeCompareUtils.current;
        }
        break;
      case 'Mapbox':
        if (mapboxCompareUtils.current) {
          mapboxCompareUtils.current.shutdown();
          mapboxCompareUtils.current = undefined;
          delete mapboxCompareUtils.current;
        }
        break;
    }
  };

  

  useEffect(() => {
    if (forgeInitialised) {
      if(minimapUtils.current) {
        minimapUtils.current.initializeViewer();
      }
      if(minimapCompareUtils.current) {
        minimapCompareUtils.current.initializeViewer();
      }
      if(forgeUtils.current) {
        forgeUtils.current.initializeViewer();
      }
    }
  }, [forgeInitialised]);

  useEffect(() => {
    // To stop Minimap from accepting keyboard events
    document.addEventListener(
      "keydown", (event) => {
        const forgeAvailable = document.getElementById('forgeViewer_1')
        if(!forgeAvailable) event.stopPropagation()
      }, false
    );
    // return cleanUpOnPageChange;
  }, []);

  // const cleanUpOnPageChange = () => {
  //   // console.log("Inside cleanup no dependencies: ");
  // };

  useEffect(() => {
    // console.log("Generic Viewer Structure UseEffect:");
    if (currentStructure.current != structure) {
      currentStructure.current = structure;
      if (structure.designs.length > 0) {
        modifyDesignList(structure.designs);
      }
      getSnapshotList(structure.project, structure._id);
      // console.log("Generic Viewer load: Structure Changed", structure);
    }
    animationRequestId = requestAnimationFrame(animationNow);
    return cleanUpOnStructureChange;
  }, [structure]);

  const cleanUpOnStructureChange = () => {
    // console.log(
    //   "Generic Viewer Inside cleanup structure cleanup:",
    //   currentStructure.current
    // );
    removeData();
    removeContext();
    setIsCompare(false);
    cancelAnimationFrame(animationRequestId);
  };

  useEffect(() => {
    handleTagListChange('Issue');
  }, [issuesList]);

  useEffect(() => {
    handleTagListChange('Task');
  }, [tasksList]);

  useEffect(() => {
    // console.log("Generic Viewer load: Snapshot UseEffect", snapshot);
    return cleanUpOnSnapshotChange;
  }, [snapshot]);

  const cleanUpOnSnapshotChange = () => {
    // console.log(
    //   "Generic Viewer Inside cleanup: snapshot cleanup",
    //   snapshot
    // );
    getContext();
    removeLayers();
  };

  useEffect(() => {
    // console.log("Generic Viewer load: Compare Snapshot UseEffect", snapshot);
    return cleanUpOnCompareSnapshotChange;
  }, [compareSnapshot]);

  const cleanUpOnCompareSnapshotChange = () => {
    // console.log(
    //   "Generic Viewer Inside cleanup: snapshot cleanup",
    //   compareSnapshot
    // );
    getContext();
    removeCompareLayers();
  };

  useEffect(() => {
    console.log("Generic Viewer ViewerType UseEffect:", viewerType, currentViewerType.current);
    if (currentViewerType.current != viewerType) {
      currentViewerType.current = viewerType;
      handleViewerTypeChange();
    }
    if(minimapUtils.current) minimapUtils.current.fitToView()
    if(minimapCompareUtils.current) minimapCompareUtils.current.fitToView()
    return cleanUpOnViewerTypeChange;
  }, [viewerType])

  const cleanUpOnViewerTypeChange = () => {
    console.log("Generic Viewer ViewerType Cleanup:", viewerType, currentViewerType.current);
    setIsCompare(false);
    getContext();
    destroyViewer();
  };

  // useEffect(() => {
  //   console.log("Generic Viewer View Mode UseEffect", viewMode, currentViewMode.current);
  //   if (currentViewMode.current != viewMode) {
  //     currentViewMode.current = viewMode;
  //     setViewerType(getViewerTypeFromViewMode());
  //   }
  //   return cleanUpOnViewModeChange;
  // }, [viewMode]);

  // const cleanUpOnViewModeChange = () => {
  //   console.log(
  //     "Generic Viewer Inside cleanup: viewmode dependencies",
  //     viewMode
  //   );
  //   setIsCompare(false);
  //   getContext();
  //   // destroyViewer();
  // };

  useEffect(() => {
    console.log('Generic Viewer View Type UseEffect', viewType, currentViewType.current);
    if (currentViewType.current != viewType) {
      currentViewType.current = viewType;
      // handleDesignTypeChange();
      setViewerType(getViewerTypeFromViewType());
    }

    return cleanUpOnViewTypeChange;
  }, [viewType]);

  const cleanUpOnViewTypeChange = () => {
    console.log(
      'Generic Viewer View Type Cleanup',
      props.viewType,
      currentViewType.current
    );
    setIsCompare(false);
    getContext();
  };

  useEffect(() => {
    console.log("Generic Viewer load: Design List UseEffect", designList);
    if (designList.length > 0) {
      loadViewerData();
      loadMinimapData();
    }
  }, [designList]);

  useEffect(() => {
    console.log("Generic Viewer load: Reality UseEffect", realityList);
    if (realityList.length > 0) {
      if (designList.length <= 0 && currentViewerType.current === 'Forge') {
        pushToolResponse({
          toolName: 'viewMode',
          toolAction: 'Reality',
        });
        setViewerType('Potree');
      }
      loadLayerData();
      loadMinimapLayerData();
    }
  }, [realityList]);

  useEffect(() => {
    // console.log("Generic Viewer load: Reality UseEffect", compareRealityList);
    if (realityList.length > 0 && isCompare) {
      loadCompareLayerData();
      loadMinimapCompareLayerData();
    }
  }, [compareRealityList]);

  useEffect(() => {
    // console.log("Generic Viewer tool UseEffect", tool);
    if (activeTool.current != tool) {
      activeTool.current = tool;
      handleToolChange();
    }
  }, [tool]);

  useEffect(() => {
    console.log("Generic Viewer View Layers UseEffect", viewLayers);
    if (viewLayers && viewLayers['Stages']) {
      const filters = ['any']
      const children = viewLayers['Stages'].children;
      for (let i = 0; i < children.length; i++) {
        if (children[i].isSelected) {
          filters.push(children[i].filters)
        }
      }

      if (mapboxUtils.current && mapboxUtils.current.isViewerInitialized()) {
        mapboxUtils.current.getMap().getLayer('progress-stages') && mapboxUtils.current.getMap().setFilter('progress-stages', filters)
      }

      if (mapboxCompareUtils.current && mapboxCompareUtils.current.isViewerInitialized()) {
        mapboxCompareUtils.current.getMap().getLayer('progress-stages') && mapboxCompareUtils.current.getMap().setFilter('progress-stages', filters)
      }
    }

    handleRealityTypeChange();
  }, [viewLayers, props.layersUpdated]);

  // Triggered when compareViewMode changed
  useEffect(() => {
    console.log("Generic Viewer Inside isCompareMode and isCompare state UseEffect", isCompare, compareViewMode);
    if (currentIsCompare.current != isCompare) {
      currentIsCompare.current = isCompare;
    }
    if (isCompare === true) {
      if(designList.length <=0 && compareViewMode === "Forge") {
        getContext();
        setCompareViewMode(currentViewerType.current);
        currentCompareViewMode.current = currentViewerType.current;
        setIsCompare(true);
      } else {
        loadCompareViewerData();
        loadCompareLayerData();
        loadMinimapCompareData();
        loadMinimapCompareLayerData();
      }
      updateViewerChanges();
    } else {
      updateViewerChanges();
    }
    return cleanUpOnCompareViewModeChange;
  }, [isCompare, compareViewMode]);

  const cleanUpOnCompareViewModeChange = () => {
    console.log("Generic Viewer Inside compare viewMode chnage cleanip", potreeUtils.current, forgeUtils.current, currentCompareViewMode.current, compareViewMode);
    // getContext();
    removeCompareLayers();
    destroyCompareViewer();
  };

  const onHotspotClick = (hotspot) => {
    setSelectedHotspot(hotspot.properties.id)
    setSelectedHotspotDetails(hotspot)

    for (let i = 0; i < hotspotsCompare.length; i++) {
      if (hotspotsCompare[i].properties.id == hotspot.properties.id) {
        setSelectedHotspotCompareDetails(hotspotsCompare[i])
        break;
      }
    }
    if (mapboxUtils.current) {
      mapboxUtils.current.onLayerClick(hotspot, isCompare ? true : false)
    }
  }

  const selectHotspot = (hotspot) => {
    setSelectedHotspot(hotspot.properties.id)
  }

  const renderMinimap = (count) => {
    if (count != 1 && !isCompare) {
      return;
    }

    if(count == 2) {
      setTimeout(() => {
        resizeMinimap('minimize', count)
      }, 3000)
    }
    
    return (<Rnd
      ref={c => { count == 1 ? _minimap = c : _minimapCompare = c }}
      style={{ top:count == 1 ? '0px' : '0px', zIndex: showMinimap && ((count == 1 && viewerType === "Potree") || (count == 2 &&  compareViewMode === "Potree")) ? 10 : -1}}
      minWidth={320}
      minHeight={28}
      maxWidth={'99%'}
      maxHeight={'99%'}
      bounds={count == 1 ? '#TheView' : '#CompareView'}
      default={{ x: count == 1 ? 84 : 24, y: 75, width: 320, height: 320 }}
      onDragStop={(e,data)=>{minimapUtils.current.resize();}}
      onResize={(e, direction, ref, delta, position) => {
        count == 1 ? minimapUtils.current?.resize() : minimapCompareUtils.current?.resize()
      }}
      className={`${'rounded-lg bg-white'}`} 
      cancel={`#minimap-${count}`}>
      <div className='flex flex-col h-full' onKeyDown={(e) => e.nativeEvent.preventDefault()}>
        <div className='h-8 rounded-lg bg-white flex'>
          <IconButton className='cursor-move' size="small">
            <DragIndicatorIcon fontSize="inherit" />
          </IconButton>
          <div className='flex items-center text-[#F1742E] pl-2 flex-1'>Minimap</div>
          <IconButton size="small" onClick={() => { resizeMinimap('minimize', count) } } onTouchEnd={() => { resizeMinimap('minimize', count) } }>
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
          compareViewMode={compareViewMode} 
          setMinimap={count == 1 ? setMinimapUtils : setMinimapCompareUtils}>
            
          </MiniMap>
      </div>
    </Rnd>)
  }

  const resizeMinimap = (mode, count) => {
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
    <div className={` ${fullScreenMode?"w-full h-full":`${styles.calcWidth} ${styles.calcHeight}`} fixed flex flex-row overflow-hidden`}>
       <div className={`flex relative ${fullScreenMode?"left-0 w-full":"left-59 calc-width"}  `}>
    <div id="TheView" className={`calc-width-half  relative flex grow shrink`}>
          {renderViewer(1)}
          {renderMinimap(1)}
          <TimeLineComponent currentSnapshot={snapshot} snapshotList={snapshotList} snapshotHandler={setCurrentSnapshot} isFullScreen={fullScreenMode} getSnapshotList={getSnapshotList} totalSnaphotsCount={totalSnaphotsCount} structure={structure}
            setPrevList={setPrevList}   
            setNextList={setNextList}
            totalPages={totalPages}
           offset={offset}

          ></TimeLineComponent>
        </div>
      <div className={isCompare?'w-0.5':''} color='gray'></div>
    <div id="CompareView" className={`relative basis-1/2  flex grow shrink  ${isCompare ? "calc-whalf ": "hidden " }`}>
          {renderViewer(2)}
          {compareViewMode === 'Potree' ? renderMinimap(2) : <></>}
          <TimeLineComponent currentSnapshot={compareSnapshot} snapshotList={snapshotList} snapshotHandler={setCurrentCompareSnapshot} isFullScreen={fullScreenMode} getSnapshotList={getSnapshotList} totalSnaphotsCount={totalSnaphotsCount} structure={structure}
           setPrevList={setPrevList}
           setNextList={setNextList}
           totalPages={totalPages}
           offset={offset}
           tools={props?.tools}

          ></TimeLineComponent>
        </div>
        {
          viewerType === "Mapbox"  && viewMode === "Reality" && hotspots && hotspots.length > 0 ?
          <Hotspots data={hotspots} selected={selectedHotspot} onHotspotClick={onHotspotClick}></Hotspots>
          : <></>
      }
      {
        isCompare && viewerType === 'Mapbox' && viewMode === 'Reality' ?
          <HotspotsCompare
            snapshot={snapshot}
            compareSnapshot={compareSnapshot}
            hotspotDetails={selectedHotspotDetails}
            hotspotCompareDetails={selectedHotspotCompareDetails}>
          </HotspotsCompare>
          : <></>
      }
      </div>
      {/* 
    <div className={` ${isFullScreenActive?"w-full h-full":" calc-w calc-h"} fixed flex flex-row`}>
      <div id="TheView" className="relative basis-1/2 flex grow shrink">
        {renderViewer(1)}
        <TimelineContainer
          currentSnapshot={snapshot}
          snapshotList={snapshotList}
          snapshotHandler={setCurrentSnapshot}
        ></TimelineContainer>
      </div>
      <div className={`relative ${isCompare ? 'basis-1/2' : 'hidden'}`}>
        {renderViewer(2)}
        <TimelineContainer
          currentSnapshot={compareSnapshot}
          snapshotList={snapshotList}
          snapshotHandler={setCurrentCompareSnapshot}
        ></TimelineContainer>
      </div>
    </div> */}
    </div>
  );
}
// export default GenericViewer;
export default GenericViewer;
