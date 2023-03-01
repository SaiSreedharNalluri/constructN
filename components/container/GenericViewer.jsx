import Script from 'next/script';
import Moment from 'moment';
import React, { useEffect, useState, memo, useRef, useCallback } from 'react';
import Head from 'next/head';
import Header from './header';
import { ForgeViewerUtils } from '../../utils/ForgeWrapper2';
import { PotreeViewerUtils } from '../../utils/PotreeWrapper';
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
  getRealityMap,
  getFloorPlanData,
} from '../../utils/ViewerDataUtils';
import { faToggleOff } from '@fortawesome/free-solid-svg-icons';
import TimelineContainer from './timelineContainer';

function GenericViewer(props) {
  const genericViewer = 'genericViewer';
  const genericViewerRef = useRef();
  const compareViewer = 'compareViewer';
  const compareViewerRef = useRef();
  let structure = props.structure;
  let currentStructure = useRef();

  let [designList, setDesignList] = useState([]);
  let [designMap, setDesignMap] = useState({});
  let updateDesignMap = props.updateDesignMap;

  let [snapshotList, setSnapshotList] = useState([]);
  let [snapshot, setSnapshot] = useState({});
  let updateSnapshot = props.updateSnapshot;

  let [realityList, setRealityList] = useState([]);
  let [realityMap, setRealityMap] = useState({});
  let updateRealityMap = props.updateRealityMap;

  let [compareSnapshot, setCompareSnapshot] = useState({});
  let [compareRealityList, setCompareRealityList] = useState([]);
  let [compareRealityMap, setCompareRealityMap] = useState({});

  let viewModeParent = props.viewMode;
  let [viewMode, setViewMode] = useState(props.viewMode);
  let currentViewMode = useRef(viewMode);

  let viewType = useRef(props.viewType);
  let viewLayers = props.viewLayers;

  let [isCompare, setIsCompare] = useState(false);
  let currentIsCompare = useRef(isCompare);
  let [compareViewMode, setCompareViewMode] = useState('Reality');
  let currentCompareViewMode = useRef(compareViewMode);

  let tool = props.tools;
  let activeTool = useRef(tool);
  let pushToolResponse = props.toolRes;

  let forgeUtils = useRef();
  let potreeUtils = useRef();

  let potreeCompareUtils = useRef();
  let forgeCompareUtils = useRef();

  let [context, setContext] = useState({});
  let currentContext = useRef();

  let animationRequestId;
  let isMouseOnMainViewer = useRef(true);
  let syncForgeEvent = useRef(false);
  let syncPotreeEvent = useRef(false);

  let tasksList = props.tasksList;
  let issuesList = props.issuesList;

  const [bottomNav, setBottomNav] = useState(false);
  const toggleTimeline = () => {
    setBottomNav(!bottomNav);
  };

  let [currentViewer, setCurrentViewer] = useState('Forge');

  let [isMarkerMode, setMarkerMode] = useState(false);

  function handleViewModeChange() {
    // console.log(
    //   "Generic Viewer After change in viewmode, clean: ",
    //   currentContext.current
    // );
    // console.log(
    //   "Generic Viewer After change in viewmode, clean: ",
    //   currentContext.current
    // );

    loadViewerData();
    loadLayerData();
  }

  function handleDesignTypeChange() {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          forgeUtils.current.setType(viewType.current);
          forgeUtils.current.refreshData();
        }
        break;
      case 'Reality':
        break;
    }
  }

  function handleRealityTypeChange() {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          forgeUtils.current.showLayers(viewLayers);
        }
        break;
      case 'Reality':
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
          ? 'Design'
          : 'Reality';
        getContext();
        setCompareViewMode(currentMode);
        currentCompareViewMode.current = currentMode;
        setIsCompare(true);
        break;
      case 'closeCompare':
        setIsCompare(false);
        break;
      default:
        break;
    }
  }

  const addTag = (type) => {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          forgeUtils.current.initiateAddTag(type);
        }
        break;
      case 'Reality':
        if (potreeUtils.current) {
          potreeUtils.current.initiateAddTag(type);
        }
        break;
    }
  };

  const cancelAddTag = (type) => {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          forgeUtils.current.cancelAddTag();
        }
        break;
      case 'Reality':
        if (potreeUtils.current) {
          potreeUtils.current.cancelAddTag();
        }
        break;
    }
  };

  const selectTag = (tag) => {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          forgeUtils.current.selectTag(tag);
        }
        break;
      case 'Reality':
        if(potreeUtils.current) {
          potreeUtils.current.selectTag(tag);
        }
        break;
    }
  };

  const showTag = (tag, show) => {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          forgeUtils.current.showTag(tag, show);
        }
        break;
      case 'Reality':
        break;
    }
  };

  const animationNow = () => {
    // console.log("Inside Animate now: ")
    syncViewer();
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
    if (currentIsCompare.current == true) {
      if (isMouseOnMainViewer.current == true) {
        if (currentCompareViewMode.current === 'Reality') {
          // get from potree utils
          //give to potree compare utile
          if (
            potreeUtils.current != undefined &&
            potreeCompareUtils.current != undefined
          ) {
            let viewerState = potreeUtils.current.getViewerState();
            potreeCompareUtils.current.updateViewerState(viewerState);
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
          }
        }
      } else {
        if (currentCompareViewMode.current === 'Reality') {
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

  const handleTagListChange = (type) => {
    console.log('Inside taglist change: ', type, issuesList, tasksList);
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          if (type === 'Issue') {
            forgeUtils.current.updateIssuesData(issuesList);
          } else if (type === 'Task') {
            forgeUtils.current.updateTasksData(tasksList);
          }
        }
        break;
      case 'Reality':
        if (potreeUtils.current) {
          if (type === 'Issue') {
            potreeUtils.current.updateIssuesData(issuesList);
          } else if (type === 'Task') {
            potreeUtils.current.updateTasksData(tasksList);
          }
        }
        break;
    }
  };

  const viewerEventHandler = (viewerId, event) => {
    // console.log("Inside generic viewer: ", event, );
    if (event) {
      switch (event.type) {
        case '360 Video':
          currentContext.current = event;
          if (currentViewMode.current == 'Design') {
            pushToolResponse({
              toolName: 'viewMode',
              toolAction: 'Reality',
            });
            setViewMode('Reality');
          } else {
            pushToolResponse({
              toolName: 'viewMode',
              toolAction: 'Design',
            });
            setViewMode('Design');
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
          console.log('Marked Point========', event);
          break;
        case '3d':
        case 'panorama':
        case 'image':
          if (currentIsCompare.current == true) {
            if (isCompareViewer(viewerId)) {
              potreeUtils.current.updateContext(event, false);
            } else {
              if (currentCompareViewMode.current === 'Reality') {
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
          break;
        case 'zoom':
          // console.log("Sync event handler: ", viewerId);
          if (currentIsCompare.current === true) {
            syncViewer(viewerId);
          }
          break;
        case 'mouse':
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

  const initViewer = (viewerId) => {
    // console.log("Inside init viewer: ", potreeUtils.current, forgeUtils.current);
    switch (viewMode) {
      case 'Design':
        if (forgeUtils.current == undefined) {
          forgeUtils.current = ForgeViewerUtils;
          forgeUtils.current.initializeViewer(viewerId, viewerEventHandler);
          forgeUtils.current.setType(viewType.current);
        }
        break;
      case 'Reality':
        if (potreeUtils.current == undefined) {
          potreeUtils.current = new PotreeViewerUtils(
            viewerId,
            viewerEventHandler.bind(this)
          );
          if (!potreeUtils.current.isViewerLoaded()) {
            potreeUtils.current.initialize();
          }
        }
        break;
    }
  };

  const initCompareViewer = (viewerId) => {
    switch (compareViewMode) {
      case 'Design':
        if (forgeCompareUtils.current == undefined) {
          forgeCompareUtils.current = ForgeViewerUtils;
          forgeCompareUtils.current.initializeViewer(
            viewerId,
            viewerEventHandler
          );
          forgeCompareUtils.current.setType(viewType.current);
        }
        break;
      case 'Reality':
        if (potreeCompareUtils.current == undefined) {
          potreeCompareUtils.current = new PotreeViewerUtils(
            viewerId,
            viewerEventHandler.bind(this)
          );
          if (!potreeCompareUtils.current.isViewerLoaded()) {
            potreeCompareUtils.current.initialize();
          }
        }
        break;
    }
  };

  async function loadViewerData() {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current != undefined) {
          forgeUtils.current.setStructure(structure);
          forgeUtils.current.updateData(getForgeModels(designMap));
        }

        break;
      case 'Reality':
        if (potreeUtils.current != undefined) {
          potreeUtils.current.setStructure(structure);
        }
        break;
    }
  }

  async function loadLayerData() {
    console.log('Load layer data: ', issuesList, tasksList);
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current != undefined) {
          forgeUtils.current.setSnapshot(snapshot);
          forgeUtils.current.updateIssuesData(issuesList);
          // forgeUtils.current.updateTasksData(tasksList);
          let data = await getRealityLayers(structure, realityMap);
          forgeUtils.current.updateLayersData(data, currentContext.current);
        }
        break;
      case 'Reality':
        if (potreeUtils.current != undefined) {
          potreeUtils.current.setSnapshot(snapshot);
          potreeUtils.current.updateIssuesData(issuesList);
          // potreeUtils.current.updateTasksData(tasksList);
          potreeUtils.current.updateData(
            await getPointCloud(structure, snapshot),
            getFloorPlanData(designMap)
          );
          potreeUtils.current.updateLayersData(
            getRealityLayersPath(structure, realityMap),
            currentContext.current
          );
        }
        break;
    }

    currentContext.current = undefined;
  }

  function loadCompareViewerData() {
    switch (compareViewMode) {
      case 'Design':
        if (forgeCompareUtils.current != undefined) {
          forgeCompareUtils.current.setStructure(structure);
          forgeCompareUtils.current.updateData(getForgeModels(designMap));
        }

        break;
      case 'Reality':
        if (potreeCompareUtils.current != undefined) {
          potreeCompareUtils.current.setStructure(structure);
        }
        break;
    }
  }

  async function loadCompareLayerData() {
    switch (compareViewMode) {
      case 'Design':
        if (forgeCompareUtils.current) {
          forgeCompareUtils.current.setSnapshot(compareSnapshot);
          let data = await getRealityLayers(structure, compareRealityMap);
          forgeCompareUtils.current.updateLayersData(
            data,
            currentContext.current
          );
        }
        break;
      case 'Reality':
        if (potreeCompareUtils.current) {
          potreeCompareUtils.current.setSnapshot(compareSnapshot);
          potreeCompareUtils.current.updateData(
            await getPointCloud(structure, compareSnapshot),
            getFloorPlanData(designMap)
          );
          potreeCompareUtils.current.updateLayersData(
            getRealityLayersPath(structure, compareRealityMap),
            currentContext.current
          );
        }

        break;
    }
    currentContext.current = undefined;
  }

  function updateViewerChanges() {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
        }
        break;
      case 'Reality':
        if (potreeUtils.current) {
          potreeUtils.current.readyForCompare(currentCompareViewMode.current);
        }
        break;
    }
  }

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

  function renderViewer(count) {
    // console.log("Generic Viewer Inside render View: ", viewMode, count);
    if (count != 1 && !isCompare) {
      return;
    }
    let mode = count == 1 ? viewMode : compareViewMode;
    // console.log("Checking render mode", mode);
    switch (mode) {
      case 'Design':
        return (
          <ForgeViewer
            viewerCount={count}
            setForgeViewer={setForgeViewerUtils}
          ></ForgeViewer>
        );
      case 'Reality':
        return (
          <PotreeViewer
            viewerCount={count}
            setPotreeViewer={setpotreeViewerUtils}
          ></PotreeViewer>
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
    return designList;
  };

  const getSnapshotList = async (projectId, structurId) => {
    let list = await getSnapshotsList(projectId, structurId);

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
    setSnapshot(snapshot);
    updateSnapshot(snapshot);
    setRealityList(snapshot.reality);
    setRealityMap(getRealityMap(snapshot));
    updateRealityMap(getRealityMap(snapshot));
  };

  const setCurrentCompareSnapshot = (snapshot) => {
    setCompareSnapshot(snapshot);
    // updateSnapshot(snapshot);
    setCompareRealityList(snapshot.reality);
    setCompareRealityMap(getRealityMap(snapshot));
    // updateRealityMap(getRealityMap(snapshot));
  };

  const isCompareViewer = (viewerId) => {
    if (viewerId.split('_')[1] === '1') {
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
    // console.log("Getting context from existing viewmode: ", currentViewMode.current, forgeUtils.current, potreeUtils.current);
    if (currentContext.current) {
      console.log(
        'Generic Viewer getContext: already available ',
        currentContext.current
      );
      return;
    }
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          context = forgeUtils.current.getContext();
        }
        break;
      case 'Reality':
        if (potreeUtils.current) {
          context = potreeUtils.current.getContext();
        }
        break;
    }
    console.log('Generic Viewer getContext: camera ', context);
    // setContext(context);
    currentContext.current = context;
  };

  const removeData = () => {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          forgeUtils.current.removeData();
        }
        break;
      case 'Reality':
        if (potreeUtils.current) {
          potreeUtils.current.removeData();
        }
        break;
    }
  };

  const removeLayers = () => {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          forgeUtils.current.removeLayers();
        }
        break;
      case 'Reality':
        if (potreeUtils.current) {
          potreeUtils.current.removeData();
        }
        break;
    }
  };

  const removeCompareLayers = () => {
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeCompareUtils.current) {
          forgeCompareUtils.current.removeLayers();
        }
        break;
      case 'Reality':
        if (potreeCompareUtils.current) {
          potreeCompareUtils.current.removeData();
        }
        break;
    }
  };

  const destroyViewer = () => {
    console.log('Inside destroy viewer: ');
    switch (currentViewMode.current) {
      case 'Design':
        if (forgeUtils.current) {
          forgeUtils.current.shutdown();
          delete forgeUtils.current;
        }
        break;
      case 'Reality':
        if (potreeUtils.current) {
          potreeUtils.current.shutdown();
          potreeCompareUtils.current = undefined;
          delete potreeUtils.current;
        }
        break;
    }
  };

  const destroyCompareViewer = () => {
    switch (currentCompareViewMode.current) {
      case 'Design':
        if (forgeCompareUtils.current) {
          forgeCompareUtils.current.shutdown();
          delete forgeCompareUtils.current;
        }
        break;
      case 'Reality':
        if (potreeCompareUtils.current) {
          potreeCompareUtils.current.shutdown();
          potreeCompareUtils.current = undefined;
          delete potreeCompareUtils.current;
        }
        break;
    }
  };

  useEffect(() => {
    return cleanUpOnPageChange;
  }, []);

  const cleanUpOnPageChange = () => {
    // console.log("Inside cleanup no dependencies: ");
  };

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
    // console.log("Generic Viewer load: Design List UseEffect", designList);
    if (designList.length > 0) {
      loadViewerData();
    }
  }, [designList]);

  useEffect(() => {
    // console.log("Generic Viewer load: Reality UseEffect", realityList);
    if (realityList.length > 0) {
      loadLayerData();
    }
  }, [realityList]);

  useEffect(() => {
    // console.log("Generic Viewer load: Reality UseEffect", compareRealityList);
    if (realityList.length > 0 && isCompare) {
      loadCompareLayerData();
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
    // console.log("Generic Viewer View Mode UseEffect", viewMode);
    if (currentViewMode.current != viewMode) {
      currentViewMode.current = viewMode;
      handleViewModeChange();
    }
    return cleanUpOnViewModeChange;
  }, [viewMode]);

  const cleanUpOnViewModeChange = () => {
    // console.log(
    //   "Generic Viewer Inside cleanup: viewmode dependencies",
    //   viewMode
    // );
    setIsCompare(false);
    // getContext();
    destroyViewer();
  };

  useEffect(() => {
    // console.log("Generic Viewer View Mode Parent UseEffect", viewModeParent);
    setViewMode(viewModeParent);
    return cleanUpOnParentViewModeChange;
  }, [viewModeParent]);

  const cleanUpOnParentViewModeChange = () => {
    // console.log(
    //   "Generic Viewer Inside cleanup: parent viewmode dependencies",
    //   viewMode
    // );
    setIsCompare(false);
    getContext();
    destroyViewer();
  };

  useEffect(() => {
    console.log('Generic Viewer View Type UseEffect', props.viewType);
    if (viewType.current != props.viewType) {
      viewType.current = props.viewType;
      handleDesignTypeChange();
    }

    return cleanUpOnViewTypeChange;
  }, [props.viewType]);

  const cleanUpOnViewTypeChange = () => {
    console.log(
      'Generic Viewer View Type Cleanup',
      props.viewType,
      viewType.current
    );
    setIsCompare(false);
    getContext();
  };

  useEffect(() => {
    // console.log("Generic Viewer View Layers UseEffect", viewLayers);
    handleRealityTypeChange();
  }, [viewLayers]);

  // Triggered when compareViewMode changed
  useEffect(() => {
    // console.log("Inside isCompareMode and isCompare state UseEffect", isCompare, compareViewMode);
    if (currentIsCompare.current != isCompare) {
      currentIsCompare.current = isCompare;
    }
    if (isCompare === true) {
      updateViewerChanges();
      loadCompareViewerData();
      loadCompareLayerData();
    } else {
      updateViewerChanges();
    }
    return cleanUpOnCompareViewModeChange;
  }, [isCompare, compareViewMode]);

  const cleanUpOnCompareViewModeChange = () => {
    // console.log("Inside compare viewMode chnage cleanip", potreeUtils.current, forgeUtils.current);
    // getContext();
    removeCompareLayers();
    destroyCompareViewer();
  };

  return (
    <div className="fixed calc-w calc-h flex flex-row">
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
    </div>
  );
}
// export default GenericViewer;
export default GenericViewer;
