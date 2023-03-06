import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import type { AppProps } from "next/app";
import "public/potree/build/potree/potree.css";
import "public/potree/libs/jquery-ui/jquery-ui.min.css";
import "public/potree/libs/jstree/themes/mixed/style.css";
import "public/potree/libs/openlayers3/ol.css";
import "public/potree/libs/spectrum/spectrum.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-responsive-modal/styles.css";
// import "react-tagsinput/react-tagsinput.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

import "../styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-modal/styles.css";
import "public/potree/build/potree/potree.css";
import "public/potree/libs/jquery-ui/jquery-ui.min.css";
import "public/potree/libs/openlayers3/ol.css";
import "public/potree/libs/spectrum/spectrum.css";
import "public/potree/libs/jstree/themes/mixed/style.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "styles/scrollbar.css";
import { StyledToastContainer } from "../components/divami_components/custom-toaster/CustomToastStyles";
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
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
        autoClose={false}
        hideProgressBar={true}
      />
    </>
  );
}
