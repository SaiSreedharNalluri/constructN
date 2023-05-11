import "../styles/globals.css";
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
import "../styles/ganttView.css";
import mixpanel from "mixpanel-browser";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  mixpanel.init(`${process.env.MIX_PANEL_TOKEN}`, { debug: true });
  const router = useRouter();
  const openRoutes = [
    "/register",
    "/reset-password",
    "/verify-account/[token]",
  ];
  useEffect(() => {
    const userObj: any = getCookie("user");
    if (userObj === undefined && !openRoutes.includes(router.asPath)) {
      router.push("/login");
    }
  }, []);

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
