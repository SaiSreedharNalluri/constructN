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
} from "./SignInPageStyle";

import { useRouter } from "next/router";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";

import Checked from "../../../public/divami_icons/checked.svg";
import UnChecked from "../../../public/divami_icons/unchecked.svg";

import { setCookie } from "cookies-next";
import Image from "next/image";
import { toast } from "react-toastify";
import { login } from "../../../services/userAuth";
import { Mixpanel } from "../../analytics/mixpanel";
import FooterSignIn from "./FooterSignIn";
import FormBody from "./FormBody";
import CustomLoader from "../custom_loader/CustomLoader";
import { CustomToast } from "../custom-toaster/CustomToast";

const SignInPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {}, [rememberMe]);
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
  const submitButtonRef: any = useRef(null);

  const handleFormData = (data: any) => {
    setFormData(data);
  };

  const formHandler = (event: any) => {
    // alert("TEST");
    // console.log("TEST HERE");
    const email = formData[0].defaultValue;
    const password = formData[1].defaultValue;

    setValidate(true);

    if (email === "" || password === "" || formData[0].isError) {
      return; // Stop execution here
    }
    setLoading(true); // Set loading state to true

    // handlerLogin(email, password, rememberMe);
    handlerLogin(email, password, rememberMe);
  };

  const handlerLogin = (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    login(email?.toLocaleLowerCase(), password)
      .then((response: any) => {
        if (response.success === true) {
          if (response?.result?.verified) {
            localStorage.setItem("userInfo", response.result?.fullName);
            // if (rememberMe) {
            // let newProperty = response?.result;
            // let userProfileObj = {
            //   rememberMe: rememberMe ? "T" : "",
            //   ...response?.result,
            // };

            let userProfileObj = {
              rememberMe: rememberMe,
              ...response?.result,
            };
            // {...newProp,rememberMe}
            // setCookie("user", JSON.stringify(response?.result));
            // setCookie("user", JSON.stringify(userProfileObj));
            setCookie("user", userProfileObj);

            // }
            toast.success("user logged in sucessfully");
            CustomToast("User logged in sucessfully", "success");

            router.push("/projects");
          } else {
            // setOpen(true);
            // router.push("/verify_page");

            router.push(
              {
                pathname: "/verify_page",
                query: { email: email }, // Pass the email as a query parameter
              },
              "/verify_page"
            );
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

        // toast.error(error.response.data.message);
        CustomToast(error.response.data.message, "error");

        setLoading(false);

        Mixpanel.track("login_fail", {
          email: email,
        });

        // setLoading(false);
        // setMessage(resMessage);
      });
  };

  const handleKeyPress = (event: any) => {
    if (event.code === "Enter") {
      event.preventDefault();
      formHandler(event);
    }
  };

  // form wrapper code

  return (
    <>
      {loading && <CustomLoader />}

      <SectionShowcase style={{ visibility: loading ? "hidden" : undefined }}>
        <HeaderContainer>
          <HeaderImageLogo src={Logo} alt="logo" />
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
              <ParentTickDiv>
                <CheckTickDiv>
                  <CheckTickBox
                    sx={{ padding: 0 }}
                    icon={
                      <Image
                        style={{
                          width: "20px",
                          height: "20px",
                        }}
                        src={UnChecked}
                        alt="Search"
                      />
                    }
                    checkedIcon={
                      <Image
                        style={{
                          width: "20px",
                          height: "20px",
                        }}
                        src={Checked}
                        alt="Search"
                      />
                    }
                    checked={rememberMe}
                    // onChange={handleChange}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                    data-testid="rememeberClick"
                  />
                </CheckTickDiv>

                <RememberDiv>Remember me</RememberDiv>
              </ParentTickDiv>

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

            <NewUserDiv>
              New User?{"   "}
              <NewUserSpan
                onClick={() => {
                  router.push("/signup");
                }}
                data-testid="signUpRoute"
              >
                Signup
              </NewUserSpan>
            </NewUserDiv>
          </FormContainerSign>
        </FormDiv>
      </SectionShowcase>
    </>
  );
};

export default SignInPage;
