import React, { useEffect, useRef, useState } from "react";
import {

    HeaderContainer,
    HeaderImageLogo,
    IllustrationBackground,
    Overlay,
    SectionShowcase,

} from "./SignInPageStyle";

import { useRouter } from "next/router";
import Illustration from "../../../public/divami_icons/Illustration.svg";
// import Logo from "../../../public/divami_icons/Logo.svg";

import Checked from "../../../public/divami_icons/checked.svg";
import UnChecked from "../../../public/divami_icons/unchecked.svg";

import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { login, loginProcore } from "../../../services/userAuth";
import { Mixpanel } from "../../analytics/mixpanel";
import FooterSignIn from "./FooterSignIn";
import FormBody from "./FormBody";
import CustomLoader from "../custom_loader/CustomLoader";
import { CustomToast } from "../custom-toaster/CustomToast";
import constructnLogo from "../../../public/divami_icons/logo-yellow.svg";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import { RotatingLines } from 'react-loader-spinner'
const SignIn = () => {
    const customLogger = new CustomLoggerClass();
    const router = useRouter();
    const { code } = router.query;

    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [loginEnable, setLoginEnable] = useState(true)

    // form wrapper code
useEffect(()=>{
    if(loginEnable && router.query.code){

        setLoginEnable(false)
        setLoading(true)
       
        loginProcore(router.query.code)
        .then((response: any) => {
            if (response.success === true) {
              if (response?.result?.verified) {
                localStorage.setItem("userInfo", response.result?.fullName);
                let userProfileObj = {
                  rememberMe: rememberMe,
                  ...response?.result,
                  password: rememberMe ? "" : "",
                  email: rememberMe ? response.result.email : response.result.email,
                };
                localStorage.setItem(
                  "userCredentials",
                  JSON.stringify(userProfileObj)
                );
              //  Sentry.setUser({email:userProfileObj.email})
                  //  CustomLogger("set user", userProfileObj.email,"email")
                  customLogger.logActivity(userProfileObj.email, "email")
                  customLogger.logInfo(`user successfully logged`);
                  // CustomLogger("capture message", `user successfully logged ${userProfileObj.email}`)           if(userProfileObj.unReadNotifications)
                  delete userProfileObj.unReadNotifications
                setCookie("isProjectTimeZone", true);
                setCookie("user", userProfileObj);
                localStorage.setItem('uploaededData',JSON.stringify({}))
                CustomToast("User signed in successfully", "success");
                const previousPage:any = router.query["history"] || "";
                setLoginEnable(true);
              if (previousPage!=="") {         
                router.push(previousPage);
              } else {
                router.push("/projects");
              }
              } else {
                router.push(
                  {
                    pathname: "/verify_page",
                    query: { email: response.result.email }, // Pass the email as a query parameter
                  },
                  "/verify_page"
                );
                setLoginEnable(true)
                // setToken(response.result.token);
                return;
              }
            }
          })
            .catch((error: any) => {
                // const resMessage =
                //     (error.response &&
                //         error.response.data &&
                //         error.response.data.message) ||
                //     error.message ||
                //     error.toString();
                // setLoginEnable(true)
                // // CustomLogger("capture exception",`failed to login ${email}`)
                // const customErrorMessage = `failed to login ${"vineeth@constructn.ai"}`;
                // customLogger.logError(customErrorMessage)

                // setLoginEnable(true);

                // Create a custom error object with the desired message
                // const customError = new Error(customErrorMessage);

                // Capture the custom error with Sentry
                // Sentry.captureException(customError);
                // Sentry.configureScope(function (scope) {
                //   scope.setLevel("warning");
                // });
                // Sentry.captureMessage("This is a warning message.");
                // // Sentry.captureException(error?.response?.data?.message)
                // CustomToast(error?.response?.data?.message, "error");

                // setLoading(false);

                // Mixpanel.track("login_fail", {
                //     email: "vineeth@constructn.ai",
                // });

                // setLoading(false);
                // setMessage(resMessage);
            });

    }
},[router.isReady])
    useEffect(() => {
        const userObj: any = getCookie("user");
        if (userObj) router.push("/projects");
    }, [])

    return (
        <>


            <SectionShowcase>
                <HeaderContainer>
                    <HeaderImageLogo src={constructnLogo} alt="logo" />
                    {loading === true ?
                <div className="flex justify-center items-center h-screen">
                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="96"
                        visible={true}
                    />
                      </div>
                :''}
                </HeaderContainer>

                <IllustrationBackground src={Illustration} alt="construct" />

                <Overlay></Overlay>

            </SectionShowcase>
        </>
    );
}
export default SignIn;
