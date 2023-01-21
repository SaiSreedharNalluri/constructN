import '../styles/globals.css';
import type { AppProps } from 'next/app';
import "mapbox-gl/dist/mapbox-gl.css";
import Head from 'next/head';
import React from 'react';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
            <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css" type="text/css"/>
      </Head>
      <Script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"/>
      <Component {...pageProps} />
    </>
  )
}
