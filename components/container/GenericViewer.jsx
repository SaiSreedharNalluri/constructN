import Script from 'next/script';
import React, { useEffect, useState, memo, useRef } from 'react';
import Head from 'next/head';
import Header from './header';
import { ForgeViewerUtils } from '../../utils/ForgeWrapper';
import { PotreeViewerUtils } from "../../utils/PotreeWrapper";
import { getPointCloudTM } from "../../services/reality";
import { getSnapshotPath, getStructurePath } from "../../utils/s3Utils";
import { getStructureDesigns } from '../../services/design';

async function getForgeModels(structure) {
  let designs = await (await getStructureDesigns(structure.project, structure._id)).data.result;
  let documentList = designs.map((design) => {
    let document = {};
    let storage = design.storage.find(storage => storage.provider === "autodesk-oss");
    if (storage) {
    document.urn = `urn:${storage.pathId}`;
    document.tm = design.tm
    }
    return document
  })
  return documentList;
}

async function getPointCloud(structure, snapshot) {
  const tmResponse = await getPointCloudTM(snapshot.project, structure._id, snapshot._id);
  const pointCloudData = {
    path: `${getSnapshotPath(snapshot.project, structure._id, snapshot._id)}/pointcloud/cloud.json`,
    tm: tmResponse.data.tm,
    offset: tmResponse.data.offset
  }
  return pointCloudData;
}

function getRealityData(snapshot) {

}

function GenericViewer(props) {
  const genericViewer = 'genericViewer';
  const genericViewerRef = useRef();
  const compareViewer = 'compareViewer';
  const compareViewerRef = useRef();
  var structure = Object.assign(props.structure);
  let currentStructure = useRef();
  let snapshot = props.snapshot;
  let viewMode = props.viewMode;
  let viewType = props.viewType;
  let viewLayers = props.viewLayers;


  let [compareView, setCompareView] = useState(false);
  let [compareMode, setCompareMode] = useState(0);
  
  let tool = props.tools;
  let activeTool = tool;
  let toolHandler = props.toolRes;
  let [camera, setCamera] = useState({});
  let forgeUtils = useRef();
  let potreeUtils = useRef();
  let forgeUtils2 = useRef();
  

  function handleViewChange() {

  }

  function handleDesignTypeChange() {

  }

  function handleRealityTypeChange() {

  }
  
  function handleToolChange() {

  }

  async function initViewer(viewer) {
    switch (viewMode) {
      case 'Design':
        console.log("Inside ViewType Design");
        if (!forgeUtils.current) {
          let forge = new ForgeViewerUtils(genericViewer);
          console.log("Inside load viewer: ", viewer);
          console.log("isForgeViewer Loaded: ", forge.isViewerLoaded());
          forgeUtils.current = forge;
        }

        forgeUtils.current.updateData(await getForgeModels(structure));

        break;
      case 'Reality':
        console.log("Inside ViewType Reality");
        let potree = new PotreeViewerUtils(genericViewer);
        if(!potree.isViewerLoaded()) {
          potree.initialize();
        }
        potreeUtils.current = potree;
        break;
    }

    loadViewerData();
  }



  async function loadViewerData() {
    switch (viewMode) {
      case 'Design':
        // forgeUtils.current.updateData(await getForgeModels(structure));
        // forgeUtils.current.updateLayers(getRealityData());
        break;
      case 'Reality':
        potreeUtils.current.updateData(await getPointCloud(structure, snapshot));
        potreeUtils.current.updateLayers(getRealityData());
        break;
    }
  }
  
  // function updateCompareView() {
  //   if(compareView) {
  //     genericViewerRef.current.style.width = '50%'
  //     compareViewerRef.current.style.display = 'block'
  //   } else {
  //     genericViewerRef.current.style.width = '100%'
  //     compareViewerRef.current.style.display = 'none'
  //   }
  // }

  // function updateViewer() {
  //   updateCompareView();
  //   // forgeUtils.current = initViewer(genericViewer);
  //   // forgeUtils.current.updateModels(getForgeModels());
  //   if (compareView) {
  //     forgeUtils2.current = initViewer(compareViewer);
  //     // forgeUtils2.current.updateModels(getForgeModels());
  //   }
  // }

  useEffect(() => {
    console.log("Structure prop clicked:");
    if(currentStructure.current != structure) {
      console.log("Generic Viewer load: Structure Changed", structure)
      currentStructure.current = structure
      initViewer();
    }
  },[structure]);

  useEffect(() => {
    console.log("Generic Viewer load: Snapshot Changed", snapshot)

  }, [snapshot]);

  useEffect(()=>{
    console.log("tool clicked", tool);
    handleToolChange(tool);
  },[tool]);

  useEffect(() => {
    console.log("View Type Changes", viewMode)
    handleViewChange();
  }, [viewMode]);


  useEffect(() => {
    console.log("View Type Changes", viewType)
    handleDesignTypeChange();
  }, [viewType]);

  useEffect(() => {
    console.log("View Type Changes", viewLayers)
    handleRealityTypeChange();
  }, [viewLayers]);

  useEffect(() => {

  }, [compareView])

  

    return (
      <React.Fragment>
        <div className="w-screen h-screen">
          <div id={genericViewer} ref={genericViewerRef} className="w-screen h-screen">
          
          </div>
          <div id={compareViewer} ref = {compareViewerRef}>

          </div>
        </div>
      </React.Fragment>
    );
  };
  // export default GenericViewer;
  export default GenericViewer;