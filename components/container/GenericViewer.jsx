import Script from 'next/script';
import React, { useEffect, useState, memo, useRef } from 'react';
import Head from 'next/head';
import Header from './header';
import { ForgeViewerUtils } from '../../utils/ForgeWrapper';
import { PotreeViewerUtils } from "../../utils/PotreeWrapper";
import { getPointCloudTM } from "../../services/reality";
import { getSnapshotPath, getStructurePath } from "../../utils/s3Utils";

function getForgeModels(structure, snapshot) {
  var documentIds = [
    {
      // urn: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL0EzX2Zyb21fYmltLnBkZg==',
      urn: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTM2MTM4JTJGZGVzaWducyUyRkRTRzIzNDI5MyUyRmFkaGFuaV9hM19ibG9jay5ydnQ',
      tm: [
        10.709603309631, 1.489653229713, 0.0, 385315.34375, -1.489653229713,
        10.709603309631, 0.0, 2049716.75, 0.0, 0.0, 10.812708854675, 95.249374,
        0.0, 0.0, 0.0, 1.0,
      ],
    }, // pdf
    // 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL2J0cnNfZ2xvYmFsLmR3Zw==', // scaled dwg
    // { urn: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL0FHUC1BREEtQTMtWFgtQVItU1QtTTMtVE9XRVJfZGV0YWNoZWQucnZ0', tm: [
    //   -0.136552, 0.992896 ,0.000000 ,385382.750000,
    //   -0.992896, -0.136552, 0.000000, 2049802.000000,
    //   0.000000, 0.000000, 1.002242, 95.249374,
    //   0.000000, 0.000000 ,0.000000, 1.000000
    //     ]}, // revit a3 adani 3D
    // 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL0EzXzJEX0Zsb29ycGxhbl9leHBvcnRlZF9mcm9tX3Jldml0LmR3Zw==', // revit generated dwg a3 shared
    // 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL0EzXzJEX0Zsb29ycGxhbl9leHBvcnRlZF9mcm9tX3Jldml0X2ludGVybmFsX2V4cG9ydC5kd2c=', // revit generated dwg a3 internal
    // 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL0EzJTIwQ2FkJTIwd2l0aCUyMGdsb2JhbCUyMHNjYWxlZC5kd2c=', // scaled dwg adani
    // 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmLzIxLTMwMUFfQlRSUy1UUEEtQUQtUjIwX2RldGFjaGVkJTIwLSUyMEZsb29yJTIwUGxhbiUyMC0lMjBGTE9PUiUyMFBMQU4lMjAtJTIwQ0VOVEVSTElORSUyMFBMQU4uZHdn', // scaled dwg tata revit
    // 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmLzIxLTMwMUFfQlRSUy1UUEEtQUQtUjIwX2RldGFjaGVkLnJ2dA' // scaled rvt tata 3D
  ];

  return documentIds;
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
  let structure = props.structure;
  let snapshot = props.snapshot;
  let viewType = props.viewMode;
  let designType = props.viewType;
  let realityType = props.realityType;

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

  function initViewer(viewer) {
    switch (viewType) {
      case 'Design':
        console.log("Inside ViewType Design");
        let forge = ForgeViewerUtils.getInstance(genericViewer);
        console.log("Inside load viewer: ", viewer);
        console.log("isForgeViewer Loaded: ", forge.isViewerLoaded());
        if(!forge.isViewerLoaded()) {
          forge.initialize();
        }
        forgeUtils.current = forge;
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
    switch (viewType) {
      case 'Design':
        forgeUtils.current.updateData(getForgeModels());
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

  function cleanUpViewer() {
    switch (viewType) {
      case 0:
        // delete forgeUtils.current.shutdown();
        if (compareView) {
          // delete forgeUtils2.current.shutdown();
        }
      case 1:

    }
  }
  
  useEffect(() => {
    console.log("Generic Viewer load: Structure Changed", structure)
    initViewer()
    return () => {
      cleanUpViewer();
    }
  }, [structure]);

  useEffect(() => {
    console.log("Generic Viewer load: Snapshot Changed", snapshot)

  }, [snapshot]);

  useEffect(()=>{
    console.log("tool clicked", tool);
    handleToolChange(tool);
  },[tool]);

  useEffect(() => {
    console.log("View Type Changes", viewType)
    handleViewChange();
  }, [viewType]);


  useEffect(() => {
    console.log("View Type Changes", designType)
    handleDesignTypeChange();
  }, [designType]);

  useEffect(() => {
    console.log("View Type Changes", realityType)
    handleRealityTypeChange();
  }, [realityType]);

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
  export default memo(GenericViewer);