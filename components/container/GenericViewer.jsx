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
  getForgeModels2,
  getPointCloud,
  getPointCloudReality,
  getRealityLayers,
  getRealityLayersPath,
  getDesignMap,
  getRealityMap,
} from "../../utils/ViewerDataUtils";

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

  let viewModeParent = props.viewMode;
  let [viewMode, setViewMode] = useState(props.viewMode);
  let currentViewMode = useRef(viewMode);

  let viewType = props.viewType;
  let viewLayers = props.viewLayers;

  const [bottomNav, setBottomNav] = useState(false);
  let BottomOverlayRef = useRef();
  let bottomRefContainer = useRef();

  let [compareView, setCompareView] = useState(false);
  let [compareMode, setCompareMode] = useState(0);

  let tool = props.tools;
  let activeTool = tool;
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
  
  function handleToolChange(newTool) {
    console.log("My new tool=",newTool);
    switch(newTool===undefined?'':newTool.toolAction){
      case 'issueCreate':
    //set to Marker Mode
      console.log("set Marker Mode for issue")
      setMarkerMode(true);
    //forgeUtils.current.startTool(newTool);
      break;
      case 'taskCreate':
      //set to Marker Mode
      console.log("set Marker Mode for task")
      setMarkerMode(true);
      break;
      default:
      break;

    }

  }

  const viewerEventHandler = (type, event) => {
    console.log("Inside generic viewer: ", type, event);
    currentImageContext.current = event;
    switch (type) {
      case "Design":
        if (event.type == "360 Video") {
          setViewMode("Reality");
        } else {
          console.log("Task Clicked", event);
        }
        break;
      case "Reality":
        break;
      case "issue":
        if(isMarkerMode){setMarkerMode(false)}
          console.log("Marked Point========",event.point);
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
      case "Design":
        forgeUtils.current.updateData(getForgeModels2(designMap));
        if (isCompare) {
          forgeCompareUtils.current.updateData(getForgeModels2(designMap));
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
        let data = await getRealityLayers(structure, snapshot, realityMap);
        forgeUtils.current.updateLayersData(data, context);
        if (isCompare) {
          forgeCompareUtils.current.updateLayersData(data, context);
        }
        break;
      case "Reality":
        potreeUtils.current.updateData(
          await getPointCloud(structure, snapshot)
        );
        // potreeUtils.current.updateLayersData(getRealityLayersPath(structure, snapshot, realityMap), currentCamera.current);
        potreeUtils.current.updateLayersData(
          getRealityLayersPath(structure, snapshot, realityMap),
          context
        );

        if (isCompare) {
          potreeCompareUtils.current.updateData(
            await getPointCloud(structure, snapshot)
          );
          // potreeUtils.current.updateLayersData(getRealityLayersPath(structure, snapshot, realityMap), currentCamera.current);
          potreeCompareUtils.current.updateLayersData(
            getRealityLayersPath(structure, snapshot, realityMap),
            context
          );
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

  const bottomOverLay = () => {
    if (!bottomNav) {
      BottomOverlayRef.current.style.width = "45%";
    } else {
      BottomOverlayRef.current.style.width = "0%";
    }
    setBottomNav(!bottomNav);
  };

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
    }
  };

  const setCurrentSnapshot = (snapshot) => {
    setSnapshot(snapshot);
    updateSnapshot(snapshot);
    setRealityList(snapshot.reality);
    setRealityMap(getRealityMap(snapshot));
    updateRealityMap(getRealityMap(snapshot));
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
    handleToolChange(tool);
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
    // <div className='flex flex-row flex-wrap'>
    //   <div className="basis-1/2">
    //     {renderViewer(1)}
    //     <div id={compareViewer} ref={compareViewerRef}></div>
    //     <div
    //       ref={bottomRefContainer}
    //       className="flex-wrap items-center absolute inset-x-0 top-0 z-10"
    //     >
    //       <p
    //         className={`left-48  bg-gray-300 rounded absolute duration-300 cursor-pointer ${
    //           bottomNav ? "top-11" : "top-2"
    //         } `}
    //         onClick={bottomOverLay}
    //       >
    //         {getSnapshotDate()}
    //       </p>
    //       <div
    //         ref={BottomOverlayRef}
    //         className="w-0 left-1/2 top-1 absolute overflow-x-hidden "
    //       >
    //         <div className="flex ">
    //           <div className=" bg-gray-200 rounded">
    //             <Pagination
    //               snapshots={snapshotList}
    //               getSnapshotInfo={setCurrentSnapshot}
    //             />
    //           </div>
    //           <div>
    //             <DatePicker></DatePicker>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   {/* <div className={`basis-1/2 w-1/2 ${isCompare ? "" : "hidden"} `}>
    //     {renderViewer(2)}
    //     <div id={compareViewer} ref={compareViewerRef}></div>
    //     <div
    //       ref={bottomRefContainer}
    //       className="flex-wrap items-center absolute inset-x-0 top-0 z-10"
    //     >
    //       <p
    //         className={`left-48  bg-gray-300 rounded absolute duration-300 cursor-pointer ${
    //           bottomNav ? "top-11" : "top-2"
    //         } `}
    //         onClick={bottomOverLay}
    //       >
    //         {getSnapshotDate()}
    //       </p>
    //       <div
    //         ref={BottomOverlayRef}
    //         className="w-0 left-1/2 top-1 absolute overflow-x-hidden "
    //       >
    //         <div className="flex ">
    //           <div className=" bg-gray-200 rounded">
    //             <Pagination
    //               snapshots={snapshotList}
    //               getSnapshotInfo={setCurrentSnapshot}
    //             />
    //           </div>
    //           <div>
    //             <DatePicker></DatePicker>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div> */}
    // </div>

    <div className="fixed calc-w calc-h">
      {renderViewer(1)}
      <div id={compareViewer} ref={compareViewerRef}></div>
      <div
        ref={bottomRefContainer}
        className="flex-wrap items-center absolute inset-x-0 top-0 z-10"
      >
        

        <div
          ref={BottomOverlayRef}
          className="w-0 left-48 top-0 absolute overflow-x-hidden "
        >
          <div className="flex ">
            <div className=" bg-gray-200 border border-gray-300 rounded">
              <Pagination
                snapshots={snapshotList}
                getSnapshotInfo={setCurrentSnapshot}
              />
            </div>
            <div className="">
              <DatePicker></DatePicker>
            </div>
          </div>
        </div>
        <p
          className={`left-1/2  bg-gray-300 border border-gray-700 rounded absolute duration-300 cursor-pointer ${
            bottomNav ? "top-11" : "top-0"
          } `}
          onClick={bottomOverLay}
        >
          {Moment(getSnapshotDate()).format('Do MMM YYYY')}
        </p>
      </div>
    </div>
  );
}
// export default GenericViewer;
export default GenericViewer;