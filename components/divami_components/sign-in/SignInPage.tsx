import React, { useEffect, useRef, useState } from "react";
import {
  ButtonSection,
  CheckTickBox,
  CheckTickDiv,
  ExtraTickDiv,
  ForgotDiv,
  FormContainerSign,
  FormDiv,
  HeaderContainer,
  HeaderImageLogo,
  IllustrationBackground,
  NewUserDiv,
  NewUserSpan,
  Overlay,
  ParentTickDiv,
  RememberDiv,
  SectionShowcase,
  SignInHeader,
  ProcoreButton,
  ProcoreLogo,
  TextContainer
} from "./SignInPageStyle";

import { useRouter } from "next/router";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import procore from "../../../public/divami_icons/procore.svg";
// import Logo from "../../../public/divami_icons/Logo.svg";

import Checked from "../../../public/divami_icons/checked.svg";
import UnChecked from "../../../public/divami_icons/unchecked.svg";

import { getCookie,setCookie } from "cookies-next";
import Image from "next/image";
import { login } from "../../../services/userAuth";
import { Mixpanel } from "../../analytics/mixpanel";
import FooterSignIn from "./FooterSignIn";
import FormBody from "./FormBody";
import CustomLoader from "../custom_loader/CustomLoader";
import { CustomToast } from "../custom-toaster/CustomToast";
import constructnLogo from "../../../public/divami_icons/logo-yellow.svg";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import { PROCORE } from "../../../config/config";
const SignInPage = () => {
  const customLogger = new CustomLoggerClass();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [checked, setChecked] = React.useState(true);
  // form wrapper code
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const [token, setToken] = useState("");
  const [userEmail, setUserEmail] = useState<any>("");
  const [newProp, setNewProp] = useState<any>({});
  const [loading, setLoading] = useState(false); // Loading state for the button click
  const [loginEnable, setLoginEnable] = useState(true)
  const submitButtonRef: any = useRef(null);

  const handleFormData = (data: any) => {
    setFormData(data);
  };

  const formHandler = (event: any) => {
    const email = formData[0].defaultValue;
    const password = formData[1].defaultValue;
    // Sentry.captureMessage("User clicked the 'Login' button", {
    //   level: "info",
    // });
    // Sentry.configureScope(function (scope) {
    //   scope.setUser(null);
    // });
    // Sentry.configureScope(function (scope) {
    //   scope.setUser({ email });
    // });
    // Sentry.configureScope(function (scope)  {
    //   scope.setTag('page', 'signin page');
    // });
    // Sentry.configureScope(function (scope) {
    //   scope.setLevel("info");
    // });
    // Sentry.captureMessage("Click on the login button");
    customLogger.logInfo("Signin");
    setValidate(true);

    if (email === "" || password === "" || formData[0].isError) {
      return; // Stop execution here
    }
    setLoading(true); // Set loading state to true

    handlerLogin(email, password, rememberMe);
  };

  const handlerLogin = (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    if(loginEnable){
      setLoginEnable(false)
      login(email?.toLocaleLowerCase(), password,12345)
      .then((response: any) => {
        if (response.success === true) {
          if (response?.result?.verified) {
            localStorage.setItem("userInfo", response.result?.fullName);
            let userProfileObj = {
              rememberMe: rememberMe,
              ...response?.result,
              password: rememberMe ? "" : "",
              email: rememberMe ? email : email,
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
            Mixpanel.identify(response.result._id); 
            Mixpanel.people.set({ 
            "user_id":response.result._id,
            "name":response.result.fullName,
            "$email":response.result.email
          });
            Mixpanel.track( {name: "login_successful",project_id:"unknown",company_id:"unknown",screen_name:"login_page",event_category:"login",event_action:"login_successful",user_id:response.result._id})
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
                query: { email: email }, // Pass the email as a query parameter
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
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoginEnable(true)
          // CustomLogger("capture exception",`failed to login ${email}`)
        const customErrorMessage = `failed to login ${email}`;
         customLogger.logError(customErrorMessage)
 
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
        CustomToast(error?.response?.data?.message, "error");

        setLoading(false);
        Mixpanel.track( {name: "login_failed",project_id:"unknown",company_id:"unknown",screen_name:"login_page",event_category:"login",event_action:"login_failed",user_id:"unknown",error_message:error?.response?.data?.message})
        // setLoading(false);
        // setMessage(resMessage);
      });
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.code === "Enter") {
      event.preventDefault();
      formHandler(event);
    }
  };

  // form wrapper code

  useEffect(() => {
    const userObj: any = getCookie("user");
    if (userObj) router.push("/projects");
  }, [])

  const handleProcoreButtonClick = () => {
    const redirectUrl = `${PROCORE.LOGIN_URL}/oauth/authorize?response_type=code&client_id=${PROCORE.CLIENT_ID}&redirect_uri=${PROCORE.REDIRECT_URI}`;
    window.location.href = redirectUrl;
  };

  return (
    <>
      {loading && <CustomLoader />}

      <SectionShowcase style={{ visibility: loading ? "hidden" : undefined }}>
        <HeaderContainer>
          <HeaderImageLogo src={constructnLogo} alt="logo" />
        </HeaderContainer>

        <IllustrationBackground src={Illustration} alt="construct" />

        <Overlay></Overlay>
        <FormDiv>
          <FormContainerSign>
            <SignInHeader data-testid="SignInHeading">Sign In</SignInHeader>
            <FormBody
              handleFormData={handleFormData}
              validate={validate}
              setIsValidate={setValidate}
              tagsList={tagList}
              setCanBeDisabled={setCanBeDisabled}
              loginField={true}
              signUpMsg={true}
              handleKeyPress={handleKeyPress}
            />
            <ExtraTickDiv>

              <ForgotDiv
                onClick={() => {
                  router.push("/forgot_password");
                }}
                data-testid="forgotPasswordClick"
              >
                Forgot password?
              </ForgotDiv>
            </ExtraTickDiv>
            <ButtonSection>
              {/* <SignInContainedButton variant="outlined">
              Sign In
            </SignInContainedButton> */}
              <FooterSignIn
                formHandler={formHandler}
                canBeDisabled={canBeDisabled}
                loginField={true}
                ref={submitButtonRef}
                // customLabel={true}
              />

              {/* Render the loader if loading state is true */}
            </ButtonSection>
            <br />
            <p className="flex justify-center">or</p>
            <ProcoreButton onClick={handleProcoreButtonClick}>
            <ProcoreLogo src={procore} alt="logo" />
            <TextContainer>Sign In with Procore</TextContainer>
          </ProcoreButton>

            <NewUserDiv>
              New User?{"   "}
              <NewUserSpan
                onClick={() => {
                  router.push("/signup");
                }}
                data-testid="signUpRoute"
              >
                Sign Up
              </NewUserSpan>
            </NewUserDiv>
          </FormContainerSign>
        </FormDiv>
      </SectionShowcase>
    </>
  );
};

export default SignInPage;
