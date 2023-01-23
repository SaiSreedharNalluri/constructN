import Script from "next/script";
import React, { useEffect, useState, memo, useRef } from "react";
import Head from 'next/head';
import Header from "./header";
import {ForgeViewerUtils} from "../../utils/ForgeWrapper"

function initViewer(genericViewer, compareViewer, onForgeViewerLoaded) {
  let forgeUtils = ForgeViewerUtils.getInstance(genericViewer)
  console.log("isForgeViewer Loaded: ", forgeUtils.isViewerLoaded())
  if(!forgeUtils.isViewerLoaded()) {
    forgeUtils.initialize(onForgeViewerLoaded);
  }
  return forgeUtils
}


function getForgeModels(structureId) {
  var documentIds = [
    { urn: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL0EzX2Zyb21fYmltLnBkZg==', tm : [10.709603309631, 1.489653229713, 0.000000000000, 385315.343750000000,
     -1.489653229713, 10.709603309631, 0.000000000000, 2049716.750000000000,
     0.000000000000, 0.000000000000, 10.812708854675, 95.249374,
     0.000000000000, 0.000000000000, 0.000000000000, 1.000000000000] }, // pdf 
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

 ] 

 return documentIds;
}

function getForgeLayers(snapshotDetails) {

}


function GenericViewer(props) {
  const genericViewer = "genericViewer";
  const compareViewer = "compareViewer";
  let structureId = props.structureId;
  let snapshot = props.snapshotDetails;
  let viewType = props.viewType;
  let [camera, setCamera] = useState({});
  let scriptsLoaded = props.scriptsLoaded;
  let toolclk = props.tools;
  let respData = props.toolRes;

  let forgeUtils = useRef();
  
  
  
  useEffect(() => {
    console.log("Generic Viewer load: Structure Changed", scriptsLoaded)
    console.log("Is ForgeUtils Initialized: ", forgeUtils.current)
    // if (scriptsLoaded) {
      console.log("Is Scripts Loaded: ", scriptsLoaded)
      forgeUtils.current = initViewer(genericViewer, compareViewer);
      forgeUtils.current.updateModels(getForgeModels());
    // }
    return () => {
      delete forgeUtils.current.shutdown();
    }
  }, [scriptsLoaded, structureId]);

  useEffect(()=>{

    console.log(toolclk,"tool clicked");
    respData(toolclk);

  },[toolclk]);

  useEffect(() => {
    console.log("Generic Viewer load: Snapshot Changed")

  }, [snapshot]);

  

    return (
      <React.Fragment>
        <div className="w-screen h-screen">
          <div id={genericViewer}>
          
          </div>
          <div id={compareViewer}>

          </div>
        </div>
      </React.Fragment>
    );
  };
  // export default GenericViewer;
  export default memo(GenericViewer);