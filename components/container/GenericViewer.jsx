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

  let [compareView, setCompareView] = useState(false);
  let [compareMode, setCompareMode] = useState(0);

  let tool = props.tools;
  let activeTool = useRef(tool);
  let pushToolResponse = props.toolRes;

  let forgeUtils = useRef();
  let potreeUtils = useRef();

  let isCompare = false;
  let potreeCompareUtils = useRef();
  let forgeCompareUtils = useRef();

  let [cameraContext, setCameraContext] = useState({});
  let currentCameraContext = useRef();

  let [imageContext, setImageContext] = useState({});
  let currentImageContext = useRef();

  const [bottomNav, setBottomNav] = useState(false);
  const toggleTimeline = () => {
    setBottomNav(!bottomNav);
  }

  let [currentViewer, setCurrentViewer] = useState('Forge');

  let [isMarkerMode, setMarkerMode] = useState(false);

  function handleViewModeChange() {
    console.log(
      "Generic Viewer After change in viewmode, clean: ",
      currentCameraContext.current
    );
    console.log(
      "Generic Viewer After change in viewmode, clean: ",
      currentCameraContext.current
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
    //set to Marker Mode
      console.log("set Marker Mode for issue")
      // setMarkerMode(true);
      addTag("Issue")
    //forgeUtils.current.startTool(newTool);
      break;
      case 'taskCreate':
      //set to Marker Mode
      addTag("Task");
      setMarkerMode(true);
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

  const viewerEventHandler = (event) => {
    console.log("Inside generic viewer: ", event.type);
    switch (event.type) {
      case "360 Video":
        currentImageContext.current = event;
        if (viewMode == "Design") {
          setViewMode("Reality");
        } else {
          setViewMode("Design");
        }
        break;
      case "Reality":
        break;
      case "Issue":
        setMarkerMode(false)
        activeTool.current.response = event;
        pushToolResponse(activeTool.current);
        console.log("Marked Point========",event);
        break;
    }
  };

  const initViewer = (viewerId) => {
    switch (viewMode) {
      case "Design":
        console.log(
          "Generic viewer checking existing view: ",
          forgeUtils.current
        );
        if (!forgeUtils.current) {
          console.log("Generic viewer creating new view: ", forgeUtils.current);
          let forge = new ForgeViewerUtils(viewerId, viewerEventHandler);
          console.log(
            "iGeneric Viewer sForgeViewer Loaded: ",
            forge.isViewerLoaded()
          );
          forgeUtils.current = forge;
        }
        break;
      case "Reality":
        if (!potreeUtils.current) {
          let potree = new PotreeViewerUtils(viewerId, viewerEventHandler);
          if (!potree.isViewerLoaded()) {
            potree.initialize();
          }
          potreeUtils.current = potree;
        }
        break;
    }
  };

  const initCompareViewer = (viewerId) => {
    switch (viewMode) {
      case "Design":
        if (forgeCompareUtils.current == undefined) {
          let forge = new ForgeViewerUtils(viewerId, viewerEventHandler);
          console.log(
            "Generic Viewer isForgeViewer Loaded: ",
            forge.isViewerLoaded()
          );
          forgeCompareUtils.current = forge;
        }
        break;
      case "Reality":
        if (potreeCompareUtils.current == undefined) {
          let potree = new PotreeViewerUtils(viewerId, viewerEventHandler);
          if (!potree.isViewerLoaded()) {
            potree.initialize();
          }
          potreeCompareUtils.current = potree;
        }
        break;
    }
  };

  async function loadViewerData() {
    console.log("Generic Viewer Inside load view data: ");
    switch (viewMode) {
      case 'Design':
        forgeUtils.current.updateData(getForgeModels(designMap));
        if (isCompare) {
          forgeCompareUtils.current.updateData(getForgeModels(designMap));
        }
        // let data = await getRealityLayers(structure, snapshot, realityMap, realityList);
        // forgeUtils.current.updateLayersData(data, currentCamera.current);
        break;
      case "Reality":
        // potreeUtils.current.updateLayersData(getRealityLayersPath(structure, snapshot, realityMap), currentCamera.current);
        break;
    }
  }

  async function loadLayerData() {
    console.log("Generic Viewer Inside load layer data: ");
    let context = {};
    if (currentImageContext.current) {
      context.type = "image";
      context.image = currentImageContext.current;
    } else if (currentCameraContext.current) {
      context.type = "camera";
      context.camera = currentCameraContext.current;
    } else {
      context = undefined;
    }

    switch (viewMode) {
      case "Design":
        // forgeUtils.current.updateData(getForgeModels(designList));
        let data = await getRealityLayers(structure, realityMap);
        forgeUtils.current.updateLayersData(data, context);
        if (isCompare) {
          let data = await getRealityLayers(structure, compareRealityMap);
          forgeCompareUtils.current.updateLayersData(data, context);
        }
        break;
      case 'Reality':
        potreeUtils.current.updateData(await getPointCloud(structure, snapshot), getFloorPlanData(designMap));
        // potreeUtils.current.updateLayersData(getRealityLayersPath(structure, snapshot, realityMap), currentCamera.current);
        potreeUtils.current.updateLayersData(
          getRealityLayersPath(structure, realityMap),
          context
        );

        if(isCompare) {
          potreeCompareUtils.current.updateData(await getPointCloud(structure, compareSnapshot), getFloorPlanData(designMap));
        // potreeUtils.current.updateLayersData(getRealityLayersPath(structure, snapshot, realityMap), currentCamera.current);
          potreeCompareUtils.current.updateLayersData(getRealityLayersPath(structure, compareRealityMap), context);
        }
        break;
    }

    currentCameraContext.current = undefined;
    currentImageContext.current = undefined;
  }

  const setForgeViewerUtils = function (viewerId) {
    // forgeUtils.current = forge;
    if (viewerId.split("_")[1] == 1) {
      console.log(
        "Generic viewer inside main viewer: ",
        viewerId,
        viewerId.split("_")[1]
      );
      initViewer(viewerId);
    } else {
      console.log(
        "Generic viewer inside compare viewer: ",
        viewerId,
        viewerId.split("_")[1]
      );
      initCompareViewer(viewerId);
    }

    // loadViewerData();
  };

  const setpotreeViewerUtils = function (viewerId) {
    // potreeUtils.current = potree;
    if (viewerId.split("_")[1] == 1) {
      initViewer(viewerId);
    } else {
      initCompareViewer(viewerId);
    }
    // loadViewerData();
  };

  function renderViewer(count) {
    console.log("Generic Viewer Inside render View: ", viewMode);
    switch (viewMode) {
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
      setCurrentCompareSnapshot(snapshotList[0]);
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

  const getSnapshotDate = () => {
    if (snapshot) {
      return snapshot.date;
    } else {
      return "No Reality";
    }
  };

  const cleanUpOnViewModeChange = () => {
    console.log(
      "Generic Viewer Inside cleanup: viewmode dependencies",
      viewMode
    );
    let camObject;
    switch (viewMode) {
      case "Design":
        if (forgeUtils.current) {
          camObject = forgeUtils.current.getCamera();
          console.log(
            "Generic Viewer Inside clean camObject from forge: ",
            camObject
          );
          delete forgeUtils.current;
        }
        if (isCompare && forgeCompareUtils.current)
          delete forgeCompareUtils.current;
        break;
      case "Reality":
        if (potreeUtils.current) {
          camObject = potreeUtils.current.getCamera();
          console.log(
            "Generic Viewer Inside clean camObject from potree: ",
            camObject
          );
          delete potreeUtils.current;
        }
        if (isCompare && potreeCompareUtils.current)
          delete potreeCompareUtils.current;
        break;
    }
    setCameraContext(camObject);
    currentCameraContext.current = camObject;
  };

  const cleanUpOnSnapshotChange = () => {
    console.log(
      "Generic Viewer Inside cleanup: snapshot dependencies",
      snapshot
    );
    switch (currentViewMode.current) {
      case "Design":
        if (forgeUtils.current) {
          forgeUtils.current.removeLayers();
        }
        break;
      case "Reality":
        break;
    }
  };

  const cleanUpOnStructureChange = () => {
    console.log(
      "Generic Viewer Inside cleanup structure dependencies:",
      currentStructure.current
    );
    switch (currentViewMode.current) {
      case "Design":
        if (forgeUtils.current) {
          forgeUtils.current.removeData();
        }
        break;
      case "Reality":
        break;
    }
  };

  const cleanUpOnPageChange = () => {
    // console.log("Inside cleanup no dependencies: ");
  };

  useEffect(() => {
    return cleanUpOnPageChange;
  }, []);

  useEffect(() => {
    console.log("Generic Viewer Structure prop clicked:");
    if (currentStructure.current != structure) {
      currentStructure.current = structure;
      if (structure.designs.length > 0) {
        modifyDesignList(structure.designs);
      }
      getSnapshotList(structure.project, structure._id);
      console.log("Generic Viewer load: Structure Changed", structure);
    }
    return cleanUpOnStructureChange;
  }, [structure]);

  useEffect(() => {
    console.log("Generic Viewer load: Snapshot Changed", snapshot);
    return cleanUpOnSnapshotChange;
  }, [snapshot]);

  useEffect(() => {
    console.log("Generic Viewer load: Design List Changed", designList);
    if (designList.length > 0) {
      loadViewerData();
    }
  }, [designList]);

  useEffect(() => {
    console.log("Generic Viewer load: Reality Changed", realityList);
    if (realityList.length > 0) {
      loadLayerData();
    }
  }, [realityList]);

  useEffect(() => {
    console.log("Generic Viewer tool clicked", tool);
    if (activeTool.current != tool) {
      activeTool.current = tool
      handleToolChange();
    }
    
  }, [tool]);

  useEffect(() => {
    console.log("Generic Viewer View Mode Changes", viewMode);
    if (currentViewMode.current != viewMode) {
      currentViewMode.current = viewMode;
      handleViewModeChange();
    }
    return cleanUpOnViewModeChange;
  }, [viewMode]);

  useEffect(() => {
    console.log("Generic Viewer View Mode Parent Changes", viewModeParent);
    setViewMode(viewModeParent);
  }, [viewModeParent]);

  useEffect(() => {
    console.log("Generic Viewer View Type Changes", viewType);
    handleDesignTypeChange();
  }, [viewType]);

  useEffect(() => {
    console.log("Generic Viewer View Layers Changes", viewLayers);
    handleRealityTypeChange();
  }, [viewLayers]);

  useEffect(() => {}, [compareView]);

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