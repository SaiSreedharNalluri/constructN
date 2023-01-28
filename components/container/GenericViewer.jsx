import Script from 'next/script';
import React, { useEffect, useState, memo, useRef, useCallback } from 'react';
import Head from 'next/head';
import Header from './header';
import { ForgeViewerUtils } from '../../utils/ForgeWrapper';
import { potreeViewerUtils } from "../../utils/PotreeWrapper";
import { getPointCloudTM, getRealityPositions } from "../../services/reality";
import { getSnapshotsList } from '../../services/snapshot';
import { getRealityPath, getDesignPath } from "../../utils/S3Utils";
import { getStructureDesigns, getDesignTM } from '../../services/design';
import DatePicker from './datePicker';
import Pagination from './pagination';
import ForgeViewer from './forgeViewer';
import PotreeViewer from './potreeViewer';

function getForgeModels(designs) {
  let documentList = designs.map((design) => {
    let document = {};
    let storage = design.storage.find(storage => storage.provider === "autodesk-oss");
    if (storage) {
    document.urn = `urn:${storage.pathId}`;
    document.tm = design.tm;
    }
    return document
  })
  console.log("Design models: ", documentList);
  return documentList;
}

// const getForgeModels = (designList) => {
//   designList.forEach((design, index, array) => {

//   })
// }

function getPointCloudReality(snapshot) {
  return snapshot.reality.find((reality) => {
    console.log("Inside find reality function:");
    if (reality.mode === "360 Video" || reality.mode === "Drone Image") {
      console.log("found reality: ", reality)
      return reality
    }
  });
}

async function getPointCloud(structure, snapshot) {
  const tmResponse = await getPointCloudTM(getRealityPath(snapshot.project, structure._id, snapshot._id, getPointCloudReality(snapshot).reality));
  const pointCloudData = {
    path: `${getRealityPath(snapshot.project, structure._id, snapshot._id, getPointCloudReality(snapshot).reality)}/pointcloud/cloud.json`,
    tm: tmResponse ? tmResponse.data.tm : [],
    offset: tmResponse ? tmResponse.data.offset: []
  }
  return pointCloudData;
}

const getRealityLayers = async (structure, snapshot, realityMap) => {
  console.log("Inside get Reality layers: ", realityMap)
  let realityPositionMap = {}
  for (const mode in realityMap) {
    console.log("Inside reality Map for: ", mode);
    switch (mode) {
      case "360 Video":
        console.log("Inside get Reality layers: In 360 mode: ")
        let position360Video = {};
        for (let reality of realityMap[mode]) {
          console.log("Inside reality list: ", reality);
          let response = await getRealityPositions(getRealityPath(snapshot.project, structure._id, snapshot._id, reality.reality));
          position360Video = {...position360Video, ...response.data};
          console.log("Main for: ", position360Video);
        }
        realityPositionMap[mode] = position360Video;
        break;
      case "360 Image":
        break;
      case "Phone Image":
        break;
      case "Drone Image":
        let positionDroneImage = {};
        for (let reality of realityMap[mode]) {
          console.log("Inside reality list: ", reality);
          let response = await getRealityPositions(getRealityPath(snapshot.project, structure._id, snapshot._id, reality.reality));
          positionDroneImage = {...positionDroneImage, ...response.data};
          console.log("Main for: ", positionDroneImage);
        }
        realityPositionMap[mode] = positionDroneImage;
        break;
    }
  }
  return realityPositionMap;
}

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


  let viewMode = props.viewMode;
  let viewType = props.viewType;
  let viewLayers = props.viewLayers;

  const [bottomNav, setBottomNav] = useState(false);
  let BottomOverlayRef = useRef();
  let bottomRefContainer = useRef();


  let [compareView, setCompareView] = useState(false);
  let [compareMode, setCompareMode] = useState(0);
  
  let tool = props.tools;
  let activeTool = tool;
  let toolHandler = props.toolRes;
  let [camera, setCamera] = useState({});
  let forgeUtils = useRef();
  let potreeUtils = useRef();
  let forgeUtils2 = useRef();

  let [currentViewer, setCurrentViewer] = useState('Forge');

  function handleViewModeChange() {
    
  }

  function handleDesignTypeChange() {

  }

  function handleRealityTypeChange() {

  }
  
  function handleToolChange() {

  }

  async function loadViewerData() {
    switch (viewMode) {
      case 'Design':
        forgeUtils.current.updateData(getForgeModels(designList));
        let data = await getRealityLayers(structure, snapshot, realityMap, realityList);
        
        forgeUtils.current.updateLayersData(data);
        break;
      case 'Reality':
        potreeUtils.current.updateData(await getPointCloud(structure, snapshot));
        potreeUtils.current.updateLayersData(getRealityLayers(structure, snapshot, realityMap));
        break;
    }
  }

  const setForgeViewerUtils = function(forge) {
    forgeUtils.current = forge;
    loadViewerData();
  }

  const setpotreeViewerUtils = function(potree) {
    potreeUtils.current = potree;
    loadViewerData();
  }

  function renderViewer() {
    console.log("Inside render View: ", viewMode)
    switch (viewMode) {
      case "Design":
        return <ForgeViewer viewerCount={1} setForgeViewer={setForgeViewerUtils}></ForgeViewer>;
      case "Reality":
        return <PotreeViewer viewerCount={1} setPotreeViewer={setpotreeViewerUtils}></PotreeViewer>;
        
    }
  }

  const bottomOverLay = () => {
    if (!bottomNav) {
      BottomOverlayRef.current.style.width = '45%';
    } else {
      BottomOverlayRef.current.style.width = '0%';
    }
    setBottomNav(!bottomNav);
  };

  const getRealityMap = (snapshot) => {
    let map = {

    };
    snapshot?.reality?.forEach((reality, i, array) => {
      if (map[reality.mode]) {
        map[reality.mode].push(reality);
      } else {
        map[reality.mode] = [reality];
      }
    })
    console.log("Reality map: ", map);
    return map;
  }

  const getDesignMap = (designs) => {
    let map = {

    };
    designs.forEach((design, i, array) => {
      if (map[design.type]) {
        map[design.type].push(design);
      } else {
        map[design.type] = [design]
      }
    });

    console.log("Design map: ", map);
    return map;
  }

  const modifyDesignList = async (designList) => {
    console.log("Inside Modified design List: ", designList);
    await designList.forEach(async (design, i, array) => {
      if(!design.tm) {
        let response = await getDesignTM(getDesignPath(design.project, design.structure, design._id));
        if (response?.data) {
          design.tm = response.data;
        }
      }
    })

    console.log("design modified: ", designList);
    setDesignList(designList);
    setDesignMap(getDesignMap(designList));
    updateDesignMap(getDesignMap(designList));
  }

  const getSnapshotList = async (projectId, structurId) => {
    let snapshotList = await getSnapshotsList(projectId, structurId);

    snapshotList = snapshotList.data.result.mSnapshots.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (snapshotList.length>0) {
      setSnapshotList(snapshotList);
      setCurrentSnapshot(snapshotList[0]);
    }
  };

  const setCurrentSnapshot = (snapshot) => {
    setSnapshot(snapshot);
    updateSnapshot(snapshot);
    setRealityList(snapshot.reality)
    setRealityMap(getRealityMap(snapshot));
    updateRealityMap(getRealityMap(snapshot));
  }

  const getSnapshotDate = () => {
    if (snapshot) {
      return snapshot.date;
    } else {
      return "No Reality"
    }
  }

  useEffect(() => {
    console.log('Inside useeffect without dependencies: ', viewMode);
  
  }, []);

  useEffect(() => {
    console.log("Structure prop clicked:");
    if(currentStructure.current != structure) {
      currentStructure.current = structure;
      if (structure.designs.length>0) {
        let designList = modifyDesignList(structure.designs);
      }
      getSnapshotList(structure.project, structure._id);
      console.log("Generic Viewer load: Structure Changed", structure)
    }
  },[structure]);

  useEffect(() => {
    console.log("Generic Viewer load: Snapshot Changed", snapshot)
    loadViewerData();
  }, [snapshot]);

  useEffect(()=>{
    console.log("tool clicked", tool);
    handleToolChange(tool);
  },[tool]);

  useEffect(() => {
    console.log("View Mode Changes", viewMode)
    handleViewModeChange();
  }, [viewMode]);


  useEffect(() => {
    console.log("View Type Changes", viewType)
    handleDesignTypeChange();
  }, [viewType]);

  useEffect(() => {
    console.log("View Layers Changes", viewLayers)
    handleRealityTypeChange();
  }, [viewLayers]);

  useEffect(() => {

  }, [compareView])

    return (
      <React.Fragment>
        <div className="relative w-screen h-screen">
          {renderViewer()}
          <div id={compareViewer} ref={compareViewerRef}></div>
          <div
            ref={bottomRefContainer}
            className="flex-wrap items-center absolute inset-x-0 top-0 z-10"
          >
            <p
              className={`left-48  bg-gray-300 rounded absolute duration-300 cursor-pointer ${
                bottomNav ? "top-11" : "top-2"
              } `}
              onClick={bottomOverLay}
            >
              {getSnapshotDate()}
            </p>
            <div
              ref={BottomOverlayRef}
              className="w-0 left-1/2 top-1 absolute overflow-x-hidden "
            >
              <div className="flex ">
                <div className=" bg-gray-200 rounded">
                  <Pagination
                    snapshots={snapshotList}
                    getSnapshotInfo={setCurrentSnapshot}
                  />
                </div>
                <div>
                  <DatePicker></DatePicker>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };
  // export default GenericViewer;
  export default GenericViewer;