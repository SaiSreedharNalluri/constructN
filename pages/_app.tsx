import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'mapbox-gl/dist/mapbox-gl.css';
import Head from 'next/head';
import React from 'react';
import Script from 'next/script';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
