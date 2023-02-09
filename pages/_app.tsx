import "../styles/globals.css";
import type { AppProps } from "next/app";
import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-modal/styles.css";
import "public/potree/build/potree/potree.css";
import "public/potree/libs/jquery-ui/jquery-ui.min.css";
import "public/potree/libs/openlayers3/ol.css";
import "public/potree/libs/spectrum/spectrum.css";
import "public/potree/libs/jstree/themes/mixed/style.css";
import "react-tagsinput/react-tagsinput.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { styled, createTheme, ThemeProvider } from "@mui/system";

config.autoAddCss = false;

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#F1742E",
      default: "#FFFFFF",
      fontColor: "#36415D",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <ThemeProvider theme={customTheme}>
    <Component {...pageProps} />
    // <ToastContainer position="bottom-center" autoClose={5000} />
    // </ThemeProvider>
  );
}
