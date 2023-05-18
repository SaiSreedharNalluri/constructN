import React, { useState } from "react";
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
import { Mixpanel } from "../../analytics/Mixpanel";
import { toast } from "react-toastify";

const SignInPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  // form wrapper code
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const [token, setToken] = useState("");

  const handleFormData = (data: any) => {
    setFormData(data);
  };

  const handleForm = () => {
    console.log("hello form");
    // formHandler();
  };
  const formHandler = (event: any) => {
    console.log("formData", formData);
    const email = formData[0].defaultValue;
    const password = formData[1].defaultValue;
    console.log(email, password);

    setValidate(true);

    if (email === "" || password === "") {
      console.log("Email and password are empty. Aborting login.");
      return; // Stop execution here
    }

    handlerLogin(email, password);
  };

  const handlerLogin = (email: string, password: string) => {
    login(email?.toLocaleLowerCase(), password)
      .then((response: any) => {
        if (response.success === true) {
          if (response?.result?.verified === true) {
            localStorage.setItem("userInfo", response.result?.fullName);
            toast.success("user logged in sucessfully");
            Mixpanel.identify(email);
            Mixpanel.track("login_success", {
              email: email,
            });
            Mixpanel.track("login_page_close");
            router.push("/projects");
          } else {
            // setOpen(true);
            setToken(response.result.token);
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

        console.log("errorlogin", error.response.data.message);

        Mixpanel.track("login_fail", {
          email: email,
        });

        // setLoading(false);
        // setMessage(resMessage);
      });
  };

  function isValidEmail(email: any) {
    if (/\S+@\S+\.\S+/.test(email)) {
      console.log("true");
    } else {
      console.log("false");
    }
    // return /\S+@\S+\.\S+/.test(email);
  }
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
          <SignInHeader>Sign In</SignInHeader>
          <FormBody
            handleFormData={handleFormData}
            validate={validate}
            setIsValidate={setValidate}
            tagsList={tagList}
            setCanBeDisabled={setCanBeDisabled}
            loginField={true}
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
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </CheckTickDiv>

              <RememberDiv>Remember me</RememberDiv>
            </ParentTickDiv>

            <ForgotDiv>Forgot password?</ForgotDiv>
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
