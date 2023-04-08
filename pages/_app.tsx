import "../styles/globals.css";
import {notifyViewerEvent} from "../utils/GenericViewerTransportLayer"
import type { AppProps } from "next/app";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-modal/styles.css";
import "public/potree/build/potree/potree.css";
import "public/potree/libs/jquery-ui/jquery-ui.min.css";
import "public/potree/libs/openlayers3/ol.css";
import "public/potree/libs/spectrum/spectrum.css";
import "public/potree/libs/jstree/themes/mixed/style.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "react-tabs/style/react-tabs.css";
import { StyledToastContainer } from "../components/divami_components/custom-toaster/CustomToastStyles";

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  mixpanel.init(`${process.env.MIX_PANEL_TOKEN}`, {debug: true}); 
  useEffect(()=>{
    globalThis.addEventListener('notify-viewer', notifyViewerEvent);
  },[]);
  return (
    <>
      <Component {...pageProps} />
      {/* <ToastContainer
        position="bottom-center"
        autoClose={false}
        pauseOnHover={true}
        hideProgressBar={true}
      /> */}

      {/* <ToastContainer
        position="bottom-center"
        autoClose={false}
        hideProgressBar={true}
        closeOnClick
        rtl={false}
        pauseOnHover={true}
        theme="light"
      /> */}

      <StyledToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
      />
    </>
  );
}
