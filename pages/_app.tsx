import "../styles/globals.css";
import type { AppProps } from "next/app";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect } from "react";
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
import MyErrorBoundary from "../components/container/errorBoundary";
import { firebaseapp } from "../components/analytics/firebase";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import toastClose from "../public/divami_icons/toastClose.svg";

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  mixpanel.init(`${process.env.MIX_PANEL_TOKEN}`, { debug: true });
  const router = useRouter();
  const signInRoutes = ["/login"];
  const openRoutes = [
    // "/register",
    "/signup",
    "/reset-password",
    "/verify-account/[token]",
  ];

  const setupFirebase = async () => {
    const analytics = await isSupported().then((yes) =>
      yes ? getAnalytics(firebaseapp) : null
    );
    // if (process.env.NODE_ENV === 'production') {
    const logScreenEvent = (url: string) => {
      if (analytics) analytics.app.automaticDataCollectionEnabled = true;
      analytics &&
        logEvent(analytics, "page_view", {
          url,
        });
    };

    router.events.on("routeChangeComplete", logScreenEvent);
    //For First Page
    logScreenEvent(window.location.pathname);

    //Remvove Event Listener after un-mount
    return () => {
      router.events.off("routeChangeComplete", logScreenEvent);
    };
    // }
  };

  useEffect(() => {
    const userObj: any = getCookie("user");
    // let convertUserObj = JSON.parse(userObj);
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    // console.log(
    //   "convertUserObj",
    //   typeof convertUserObj,
    //   convertUserObj["rememberMe"]
    // );

    if (!user?.rememberMe && signInRoutes.includes(router.asPath)) {
      router.push("/login");
    } else if (user?.rememberMe && signInRoutes.includes(router.asPath)) {
      router.push("/projects");
    }
    // else if (router.asPath == "/login" && userObj.rememberMe) {
    //   console.log("coming to projects");
    //   router.push("/projects");
    // }

    setupFirebase();
  }, []);

  // useEffect(() => {
  //   const userObj: any = getCookie("userProfile");
  //   if (userObj === undefined && !openRoutes.includes(router.asPath)) {
  //     // router.push("/login");
  //     router.push("/login");
  //   } else {
  //     router.push("/projects");
  //   }
  // }, []);

  return (
    <>
      <MyErrorBoundary>
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
        closeButton={toastClose}
      />
      </MyErrorBoundary>
  </>
  );
}