import React, { useState, useEffect } from "react";
import {
  FormContainerSign,
  FormDiv,
  FormText,
  HeaderContainer,
  HeaderImageLogo,
  IllustrationBackground,
  Overlay,
  SectionShowcase,
  SignInHeader,
  StyledPasswordField,
  StyledTextField,
  ShowHideDiv,
  ExtraTickDiv,
  CheckTickDiv,
  CheckTickBox,
  RememberDiv,
  ParentTickDiv,
  ForgotDiv,
  SignInContainedButton,
  ButtonSection,
  NewUserDiv,
  NewUserSpan,
} from "./SignInPageStyle";

import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";
import Mail from "../../../public/divami_icons/Mail.svg";
import lock from "../../../public/divami_icons/lock.svg";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { useRouter } from "next/router";

import { Checkbox, InputAdornment, TextField } from "@mui/material";
import Checked from "../../../public/divami_icons/checked.svg";
import UnChecked from "../../../public/divami_icons/unchecked.svg";

import Image from "next/image";
import FormBody from "./FormBody";
import FooterSignIn from "./FooterSignIn";
import { CollectionsOutlined } from "@mui/icons-material";
import { login } from "../../../services/userAuth";
import { Mixpanel } from "../../analytics/mixpanel";
import { toast } from "react-toastify";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const SignInPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // const handleClickShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };
  useEffect(() => {}, [rememberMe]);

  // const handleMouseDownPassword = (event: any) => {
  //   event.preventDefault();
  // };

  const [checked, setChecked] = React.useState(true);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setChecked(event.target.checked);
  // };

  // useEffect(() => {
  //   const userObj: any = getCookie("user");
  //   console.log("userObj", userObj, router);
  //   let user = null;
  //   if (router.isReady) {
  //     if (userObj) user = JSON.parse(userObj);
  //     if (user && user.token) {
  //       if (router.query.sessionExpired === undefined) {
  //         // router.push("/projects");
  //       } else {
  //         deleteCookie("user");
  //       }
  //     }
  //   }
  // }, [router, router.isReady]);

  // form wrapper code
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const [token, setToken] = useState("");
  const [userEmail, setUserEmail] = useState<any>("");
  const [newProp, setNewProp] = useState<any>({});

  const handleFormData = (data: any) => {
    setFormData(data);
  };

  const handleForm = () => {
    // formHandler();
  };
  const formHandler = (event: any) => {
    const email = formData[0].defaultValue;
    const password = formData[1].defaultValue;

    setValidate(true);

    if (email === "" || password === "" || formData[0].isError) {
      return; // Stop execution here
    }

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

        toast.error("Invalid User Credentials");

        Mixpanel.track("login_fail", {
          email: email,
        });

        // setLoading(false);
        // setMessage(resMessage);
      });
  };

  // form wrapper code

  return (
    <SectionShowcase>
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
          />
          <ExtraTickDiv>
            <ParentTickDiv>
              <CheckTickDiv>
                <CheckTickBox
                  sx={{ padding: 0 }}
                  icon={
                    <Image
                      width={24}
                      height={24}
                      src={UnChecked}
                      alt="Search"
                    />
                  }
                  checkedIcon={
                    <Image width={24} height={24} src={Checked} alt="Search" />
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
              // customLabel={true}
            />
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
  );
};

export default SignInPage;
