import Script from "next/script";
import Moment from 'moment';
import React, { useEffect, useState, memo, useRef, useCallback } from "react";
import Head from "next/head";
import Header from "./header";
import { ForgeViewerUtils } from "../../utils/ForgeWrapper";
import { PotreeViewerUtils } from "../../utils/PotreeWrapper";
import {
  getPointCloudTM,
  getRealityImagesPath,
  getRealityPositions,
  getRealityPositionsPath,
} from "../../services/reality";
import { getSnapshotsList } from "../../services/snapshot";
import { getRealityPath, getDesignPath } from "../../utils/S3Utils";
import { getStructureDesigns, getDesignTM } from "../../services/design";
import DatePicker from "./datePicker";
import Pagination from "./pagination";
import ForgeViewer from "./forgeViewer";
import PotreeViewer from "./potreeViewer";
import {
  getForgeModels,
  getPointCloud,
  getPointCloudReality,
  getRealityLayers,
  getRealityLayersPath,
  getDesignMap,
  getRealityMap, getFloorPlanData,
} from "../../utils/ViewerDataUtils";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons";
import TimelineContainer from "./timelineContainer";

function GenericViewer(props) {
  const genericViewer = "genericViewer";
  const genericViewerRef = useRef();
  const compareViewer = "compareViewer";
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

  let viewType = props.viewType;
  let viewLayers = props.viewLayers;

  let [isCompare, setIsCompare] = useState(false);
  let currentIsCompare = useRef(isCompare);
  let [compareViewMode, setCompareViewMode] = useState("Reality");
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


  const [bottomNav, setBottomNav] = useState(false);
  const toggleTimeline = () => {
    setBottomNav(!bottomNav);
  }

  let [currentViewer, setCurrentViewer] = useState('Forge');

  let [isMarkerMode, setMarkerMode] = useState(false);

  function handleViewModeChange() {
    console.log(
      "Generic Viewer After change in viewmode, clean: ",
      currentContext.current
    );
    console.log(
      "Generic Viewer After change in viewmode, clean: ",
      currentContext.current
    );

    loadViewerData();
    loadLayerData();
  }

  function handleDesignTypeChange() {}

  function handleRealityTypeChange() {}
  
  function handleToolChange() {
    console.log("My new tool=",activeTool);
    switch(activeTool.current===undefined?'':activeTool.current.toolAction){
      case 'issueCreate':
        addTag("Issue")
        break;
      case 'taskCreate':
        addTag("Task");
        break;
      case 'showCompare':
        let currentMode = activeTool.current.toolName.endsWith("Design") ? "Design" : "Reality";
        getContext();
        setCompareViewMode(currentMode);
        currentCompareViewMode.current = currentMode
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
    switch (viewMode) {
      case "Design" :
        if (forgeUtils.current) {
          forgeUtils.current.initiateAddTag(type);
        }
        break;
      case "Reality":
        if (potreeUtils.current) {
          potreeUtils.current.initiateAddTag(type);
        }
        break;
    }
  }

  const animationNow = () => {
    // console.log("Inside Animate now: ")
    syncViewer();
    animationRequestId = requestAnimationFrame(animationNow);
    if (potreeUtils.current) {
      potreeUtils.current.updateFloormapAnimation();
    }

    if (currentIsCompare.current == true && potreeCompareUtils.current) {
      potreeCompareUtils.current.updateFloormapAnimation();
    }
  }

  const syncViewer = () => {
    // console.log("Inside sync viewer: ", isMouseOnMainViewer.current)
    if(currentIsCompare.current == true) {
      if(isMouseOnMainViewer.current == true) {
        if(currentCompareViewMode.current === "Reality") {
          // get from potree utils
          //give to potree compare utile
          let viewerState = potreeUtils.current.getViewerState();
          potreeCompareUtils.current.updateViewerState(viewerState);
        } else {
          // get from potree utils
          //give to forge compare utile
          let viewerState = potreeUtils.current.getViewerState();
          forgeCompareUtils.current.updateViewerState(viewerState);
        }
      } else {
        if(currentCompareViewMode.current === "Reality") {
          //get from potree compare utils
          // give to potree utils
          let viewerState = potreeCompareUtils.current.getViewerState();
          potreeUtils.current.updateViewerState(viewerState);

        } else {
          // get from forge compare utils
          // give to potree utils
          let viewerState = forgeCompareUtils.current.getViewerState();
          potreeUtils.current.updateViewerState(viewerState);
        }
      }
    }
  }

  const viewerEventHandler = (viewerId, event) => {
    console.log("Inside generic viewer: ", event);
    switch (event.type) {
      case "360 Video":
        currentContext.current = event;
        if (viewMode == "Design") {
          setViewMode("Reality");
        } else {
          setViewMode("Design");
        }
        break;
      case "Reality":
        break;
      case "Task":
      case "Issue":
        setMarkerMode(false)
        activeTool.current.response = event;
        pushToolResponse(activeTool.current);
        console.log("Marked Point========",event);
        break;
      case "panorama":
      case "image":
        if (currentIsCompare.current == true) {
          if(isCompareViewer(viewerId)) {
            potreeUtils.current.updateContext(event);
          } else {
            potreeCompareUtils.current.updateContext(event);
          }
        }
        break;
      case "sync":
        // console.log("Sync event handler: ", viewerId);
        if (currentIsCompare.current == true) {
          syncViewer(viewerId);
        }
        break;
      case "mouse":
        if (currentIsCompare.current == true) {
          if(isCompareViewer(viewerId)) {
            isMouseOnMainViewer.current = false;
          } else {
            isMouseOnMainViewer.current = true;
          }
        }
        break;
    }
  };

  const initViewer = (viewerId) => {
    switch (viewMode) {
      case "Design":
        if (forgeUtils.current == undefined) {
          let forge = new ForgeViewerUtils(viewerId, viewerEventHandler.bind(this));
          forgeUtils.current = forge;
        }
        break;
      case "Reality":
        if (potreeUtils.current == undefined) {
          let potree = new PotreeViewerUtils(viewerId, viewerEventHandler.bind(this));
          if (!potree.isViewerLoaded()) {
            potree.initialize();
          }
          potreeUtils.current = potree;
        }
        break;
    }
  };

  const initCompareViewer = (viewerId) => {
    switch (compareViewMode) {
      case "Design":
        if (forgeCompareUtils.current == undefined) {
          let forge = new ForgeViewerUtils(viewerId, viewerEventHandler.bind(this));
          forgeCompareUtils.current = forge;
        }
        break;
      case "Reality":
        if (potreeCompareUtils.current == undefined) {
          let potree = new PotreeViewerUtils(viewerId, viewerEventHandler.bind(this));
          if (!potree.isViewerLoaded()) {
            potree.initialize();
          }
          potreeCompareUtils.current = potree;
        }
        break;
    }
  };

  async function loadViewerData() {
    switch (viewMode) {
      case 'Design':
        forgeUtils.current.updateData(getForgeModels(designMap));
        if (isCompare) {
          forgeCompareUtils.current.updateData(getForgeModels(designMap));
        }
        break;
      case "Reality":
        break;
    }
  }

  async function loadLayerData() {
    switch (viewMode) {
      case "Design":
        let data = await getRealityLayers(structure, realityMap);
        forgeUtils.current.updateLayersData(data, currentContext.current);
        break;
      case 'Reality':
        potreeUtils.current.updateData(await getPointCloud(structure, snapshot), getFloorPlanData(designMap));
        potreeUtils.current.updateLayersData(
          getRealityLayersPath(structure, realityMap),
          currentContext.current
        );
        break;
    }

    currentContext.current = undefined;
  }


  async function loadCompareViewerData() {
    switch (compareViewMode) {
      case 'Design':
        forgeCompareUtils.current.updateData(getForgeModels(designMap));
        break;
      case "Reality":
        break;
    }
  }

  async function loadCompareLayerData() {
    switch (compareViewMode) {
      case "Design":
         let data = await getRealityLayers(structure, compareRealityMap);
          forgeCompareUtils.current.updateLayersData(data, currentContext.current);
        break;
      case 'Reality':
          potreeCompareUtils.current.updateData(await getPointCloud(structure, compareSnapshot), getFloorPlanData(designMap));
          potreeCompareUtils.current.updateLayersData(getRealityLayersPath(structure, compareRealityMap), currentContext.current);
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
    console.log("Generic Viewer Inside render View: ", viewMode, count);
    if (count != 1 && !isCompare) {
      return;
    }
    let mode = count == 1 ? viewMode : compareViewMode;
    console.log("Checking render mode", mode);
    switch (mode) {
      case "Design":
        return (
          <ForgeViewer
            viewerCount={count}
            setForgeViewer={setForgeViewerUtils}
          ></ForgeViewer>
        );
      case "Reality":
        return (
          <PotreeViewer
            viewerCount={count}
            setPotreeViewer={setpotreeViewerUtils}
          ></PotreeViewer>
        );
    }
  }



  const modifyDesignList = async (designList) => {
    console.log("Generic Viewer Inside Modified design List: ", designList);
    for (let design of designList) {
      if (!design.tm) {
        let response = await getDesignTM(
          getDesignPath(design.project, design.structure, design._id)
        );
        design.tm = response.data;
      }
    }
    console.log("Generic Viewer design modified: ", designList);
    setDesignList(designList);
    setDesignMap(getDesignMap(designList));
    updateDesignMap(getDesignMap(designList));
    return designList;
  };

  const getSnapshotList = async (projectId, structurId) => {
    let snapshotList = await getSnapshotsList(projectId, structurId);

    snapshotList = snapshotList.data.result.mSnapshots.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (snapshotList.length > 0) {
      setSnapshotList(snapshotList);
      setCurrentSnapshot(snapshotList[0]);
      if (snapshotList.length > 1) {
        setCurrentCompareSnapshot(snapshotList[1]);
      } else {
        setCurrentCompareSnapshot(snapshotList[0]);
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
    let split = viewerId.split("_")[1]
    if (viewerId.split("_")[1] === "1") {
      return false;
    } else {
      return true;
    }
  }

  const removeContext = () => {
    setContext(undefined);
    currentContext.current = undefined;
  }

  const getContext = () => {
    let context;
    console.log("Getting context from existing viewmode: ", currentViewMode.current, forgeUtils, potreeUtils);
    switch (currentViewMode.current) {
      case "Design":
        if (forgeUtils.current) {
          context = forgeUtils.current.getContext();
        }
        break;
      case "Reality":
        if (potreeUtils.current) {
          context = potreeUtils.current.getContext();
        }
        break;
    }
    console.log("Generic Viewer getContext: camera ", context);
    // setContext(context);
    currentContext.current = context;
  }

  const removeData = () => {
    switch (currentViewMode.current) {
      case "Design":
        if (forgeUtils.current) {
          forgeUtils.current.removeData();
        }
        break;
      case "Reality":
        if (potreeUtils.current) {
          potreeUtils.current.removeData();
        }
        break;
    }
  }

  const removeLayers = () => {
    switch (currentViewMode.current) {
      case "Design":
        if (forgeUtils.current) {
          forgeUtils.current.removeLayers();
        }
        break;
      case "Reality":
        if (potreeUtils.current) {
          potreeUtils.current.removeData();
        }
        break;
    }
  }


  const removeCompareLayers = () => {
    switch (currentViewMode.current) {
      case "Design":
        if (forgeCompareUtils.current) {
          forgeCompareUtils.current.removeLayers();
        }
        break;
      case "Reality":
        if (potreeCompareUtils.current) {
          potreeCompareUtils.current.removeData();
        }
        break;
    }
  }

  const destroyViewer = () => {
    switch (viewMode) {
      case "Design":
        if (forgeUtils.current) {
          delete forgeUtils.current;
        }
        break;
      case "Reality":
        if (potreeUtils.current) {
          delete potreeUtils.current;
        }
        break;
    }
  }

  const destroyCompareViewer = () => {
    switch (compareViewMode) {
      case "Design":
        if (forgeCompareUtils.current) {
          delete forgeCompareUtils.current;
        }
        break;
      case "Reality":
        if (potreeCompareUtils.current) {
          delete potreeCompareUtils.current;
        }
        break;
    }
  }

  useEffect(() => {
    return cleanUpOnPageChange;
  }, []);

  const cleanUpOnPageChange = () => {
    // console.log("Inside cleanup no dependencies: ");
  };

  useEffect(() => {
    console.log("Generic Viewer Structure UseEffect:");
    if (currentStructure.current != structure) {
      currentStructure.current = structure;
      if (structure.designs.length > 0) {
        modifyDesignList(structure.designs);
      }
      getSnapshotList(structure.project, structure._id);
      console.log("Generic Viewer load: Structure Changed", structure);
    }
    animationRequestId = requestAnimationFrame(animationNow);
    return cleanUpOnStructureChange;
  }, [structure]);

  const cleanUpOnStructureChange = () => {
    console.log(
      "Generic Viewer Inside cleanup structure cleanup:",
      currentStructure.current
    );
    removeData();
    removeContext();
    setIsCompare(false);
    cancelAnimationFrame(animationRequestId)
  };

  useEffect(() => {
    console.log("Generic Viewer load: Snapshot UseEffect", snapshot);
    return cleanUpOnSnapshotChange;
  }, [snapshot]);

  const cleanUpOnSnapshotChange = () => {
    console.log(
      "Generic Viewer Inside cleanup: snapshot cleanup",
      snapshot
    );
    getContext();
    removeLayers();
  };

  useEffect(() => {
    console.log("Generic Viewer load: Compare Snapshot UseEffect", snapshot);
    return cleanUpOnCompareSnapshotChange;
  }, [compareSnapshot]);

  const cleanUpOnCompareSnapshotChange = () => {
    console.log(
      "Generic Viewer Inside cleanup: snapshot cleanup",
      compareSnapshot
    );
    getContext();
    removeCompareLayers();
  };

  useEffect(() => {
    console.log("Generic Viewer load: Design List UseEffect", designList);
    if (designList.length > 0) {
      loadViewerData();
    }
  }, [designList]);

  useEffect(() => {
    console.log("Generic Viewer load: Reality UseEffect", realityList);
    if (realityList.length > 0) {
      loadLayerData();
    }
  }, [realityList]);

  useEffect(() => {
    console.log("Generic Viewer load: Reality UseEffect", compareRealityList);
    if (realityList.length > 0 && isCompare) {
      loadCompareLayerData();
    }
  }, [compareRealityList]);

  useEffect(() => {
    console.log("Generic Viewer tool UseEffect", tool);
    if (activeTool.current != tool) {
      activeTool.current = tool
      handleToolChange();
    }
    
  }, [tool]);

  useEffect(() => {
    console.log("Generic Viewer View Mode UseEffect", viewMode);
    if (currentViewMode.current != viewMode) {
      currentViewMode.current = viewMode;
      handleViewModeChange();
    }
    return cleanUpOnViewModeChange;
  }, [viewMode]);

  const cleanUpOnViewModeChange = () => {
    console.log(
      "Generic Viewer Inside cleanup: viewmode dependencies",
      viewMode
    );
    setIsCompare(false);
    // getContext();
    destroyViewer();
  };

  useEffect(() => {
    console.log("Generic Viewer View Mode Parent UseEffect", viewModeParent);
    setViewMode(viewModeParent);
    return cleanUpOnParentViewModeChange;
  }, [viewModeParent]);

  const cleanUpOnParentViewModeChange = () => {
    console.log(
      "Generic Viewer Inside cleanup: parent viewmode dependencies",
      viewMode
    );
    setIsCompare(false);
    getContext();
    destroyViewer();
  }

  useEffect(() => {
    console.log("Generic Viewer View Type UseEffect", viewType);
    handleDesignTypeChange();
  }, [viewType]);

  useEffect(() => {
    console.log("Generic Viewer View Layers UseEffect", viewLayers);
    handleRealityTypeChange();
  }, [viewLayers]);


  // Triggered when compareViewMode changed
  useEffect(() => {
    console.log("Inside isCompareMode and isCompare state UseEffect", isCompare, compareViewMode);
    if (currentIsCompare.current != isCompare) {
      currentIsCompare.current = isCompare;
    }
    if (isCompare) {
      loadCompareViewerData();
      loadCompareLayerData();
    }
    return cleanUpOnCompareViewModeChange;
  }, [isCompare, compareViewMode])

  const cleanUpOnCompareViewModeChange = () => {
    console.log("Inside compare viewMode chnage cleanip", potreeUtils.current, forgeUtils.current);
    // getContext();
    destroyCompareViewer();
  }

  return (
      <div className="fixed calc-w calc-h flex flex-row">
        <div className="relative basis-1/2 flex grow shrink">
          {renderViewer(1)}
          <TimelineContainer currentSnapshot={snapshot} snapshotList={snapshotList} snapshotHandler={setCurrentSnapshot}></TimelineContainer>
        </div>
        <div className={`relative ${isCompare ? "basis-1/2": "hidden" }`}>
          {renderViewer(2)}
          <TimelineContainer currentSnapshot={compareSnapshot} snapshotList={snapshotList} snapshotHandler={setCurrentCompareSnapshot}></TimelineContainer>
        </div>
      </div>
  );
}
// export default GenericViewer;
export default GenericViewer;