import '../styles/globals.css';
import type { AppProps } from 'next/app';
import "mapbox-gl/dist/mapbox-gl.css";
import Head from 'next/head';
import React from 'react';
import Script from 'next/script';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;



export default function App({ Component, pageProps }: AppProps) {
  function onScriptLoad(){
    console.log("Script Loaded From App Component: ")
  }
  return (
    <>
    <Head>
            <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css" type="text/css"/>
      </Head>
      <Script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js" onLoad={onScriptLoad}/>
      <Component {...pageProps} />
    </>
  )
}
