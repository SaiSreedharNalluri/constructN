import "../styles/globals.css";
import type { AppProps } from "next/app";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
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
import { firebaseapp } from "../components/analytics/firebase";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import toastClose from "../public/divami_icons/toastClose.svg";
import PopupComponent from "../components/popupComponent/PopupComponent";
import { IntercomProvider } from 'react-use-intercom'
config.autoAddCss = false;
import instance from '../services/axiosInstance'
export default function App({ Component, pageProps }: AppProps) {
  mixpanel.init(`${process.env.MIX_PANEL_TOKEN}`, { debug: true });
  const router = useRouter();
  const signInRoutes = ["/login"];
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
  };
  const openRoutes = [
    "/signup",
    "/login",
    "/reset-password",
    "/verify-account/[token]",
  ];
  useEffect(() => {
    // instance?.interceptors?.response.use(
    //   (response) => {
    //     return response;
    //   },
    //   (error) => {
    //     if(error?.response?.status === 403)
    //     {
          
    //       if(openRoutes.includes(router.asPath) === false)
    //       {
    //         setshowPopUp(true)
            
    //       }
    //     }
    //     // Do something with response error
    //     return Promise.reject(error);
    //   }
    // );
    const userObj: any = getCookie("user");
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (!user?.rememberMe && signInRoutes.includes(router.asPath)) {
      router.push("/login");
    } else if (user?.rememberMe && signInRoutes.includes(router.asPath)) {
      router.push("/projects");
    }
    setupFirebase();
  }, []);
 const [showPopUp, setshowPopUp] = useState(false);
  return (
    <>
    <IntercomProvider appId={process.env.INTERCOM_APP_ID||"e3sowuh7"}>
        <Component {...pageProps} />
        </IntercomProvider>
        <StyledToastContainer
        position="bottom-right"
        autoClose={false}
        hideProgressBar={true}
        closeButton={toastClose}
      />
      <PopupComponent  open={showPopUp}
         setShowPopUp={setshowPopUp}
                modalTitle={"Access  Denied"}
                modalmessage={`You don't have permissions to complete this operation. Please contact your admin.`}
                primaryButtonLabel={"OK"}
                SecondaryButtonlabel={""}
                callBackvalue={()=>{       
                setshowPopUp(false)
      }}></PopupComponent>
    </>
  );
}