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

                setCookie("isProjectTimeZone", true)
                setCookie("user", JSON.stringify({
                    _id: userProfileObj._id,
                    email: userProfileObj.email,
                    token: userProfileObj.token,
                    isSupportUser: userProfileObj.isSupportUser,
                    refreshToken: userProfileObj.refreshToken,
                    avatar: userProfileObj.avatar || ''
                }));
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
              if(error.response.status===401){
                
                CustomToast('login via procore is failed','error')
                setLoading(false)
                router.push("/login")
              }
            });

    }
},[router.isReady])
  

    return (
        <>


            <SectionShowcase>
                <HeaderContainer>
                    <HeaderImageLogo src={constructnLogo} alt="logo" />
                    {loading === true ?
                <CustomLoader></CustomLoader>
                :''}
                </HeaderContainer>

                <IllustrationBackground src={Illustration} alt="construct" />

                <Overlay></Overlay>

            </SectionShowcase>
        </>
    );
}
export default SignIn;
