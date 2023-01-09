import Script from "next/script";
import React, { useEffect, useState } from "react";
import Head from 'next/head';
import Header from "../../components/container/header";
import { autodeskAuth } from "../../services/forgeService";
import {ForgeViewerUtils} from "../../utils/ForgeWrapper"

var startTool = function(tool) {

  var controller = viewer.toolController;

  // Check if currently active tool is from Edit2D
  var activeTool = controller.getActiveTool();
  var isEdit2D = activeTool && activeTool.getName().startsWith("Edit2");

  // deactivate any previous edit2d tool
  if (isEdit2D) {
      controller.deactivateTool(activeTool.getName());
      activeTool = null;
  }

  // stop editing tools
  if (!tool) {
      return;
  }

  controller.activateTool(tool.getName());
}

function ForgeViewer() {
  const viewerId = "forgeViewer";
  let forgeUtils;

  async function onLoadScript(viewerId) {
    console.log('Script loaded:')
    // var documentId = 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL0EzX2Zyb21fYmltLnBkZg==' // pdf 
    var documentId = 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL2J0cnNfZ2xvYmFsLmR3Zw==' // scaled dwg
    forgeUtils = new ForgeViewerUtils(viewerId, documentId)
    forgeUtils.initialize()
  }

    return (
      <React.Fragment>
        <Head>
            <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css" type="text/css"/>
        </Head>
        <Script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js" onLoad={onLoadScript.bind(this, viewerId)}/>
        <div className="bg-gray-100">
          <Header />
          <div id={viewerId}>
          
          </div>
        </div>
      </React.Fragment>
    );
  };
  export default ForgeViewer;