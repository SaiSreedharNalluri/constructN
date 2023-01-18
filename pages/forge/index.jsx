import Script from "next/script";
import React, { useEffect, useState } from "react";
import Head from 'next/head';
import Header from "../../components/container/header";
import { autodeskAuth } from "../../services/forgeService";
import {ForgeViewerUtils} from "../../utils/ForgeWrapper"

function ForgeViewer() {
  const viewerId = "forgeViewer";
  let forgeUtils;

  async function onLoadScript(viewerId) {
    console.log('Script loaded:')
    // var documentId = 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL0EzX2Zyb21fYmltLnBkZg==' // pdf 
    // var documentId = 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL2J0cnNfZ2xvYmFsLmR3Zw==' // scaled dwg
    var documentId = 'urn:' + 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdDJkcGRmL0EzJTIwQ2FkJTIwd2l0aCUyMGdsb2JhbCUyMHNjYWxlZC5kd2c=' // scaled dwg adani
    forgeUtils = new ForgeViewerUtils(viewerId, documentId)
    forgeUtils.initialize()
  }

    return (
      <React.Fragment>
        <Head>
            <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css" type="text/css"/>
        </Head>
        <Script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js" />
        <Script type="module" src="scripts/ForgeExtension.js" onLoad={onLoadScript.bind(this, viewerId)} strategy="lazyOnload"/>
        <div className="bg-gray-100">
          <Header />
          <div id={viewerId}>
          
          </div>
        </div>
      </React.Fragment>
    );
  };
  export default ForgeViewer;