import React, { useState } from "react";
import {
  ButtonSection,
  FormContainerSign,
  FormDiv,
  FormHeader,
  HeaderContainer,
  HeaderImageLogo,
  IllustrationBackground,
  Overlay,
  SectionShowcase,
  SignInHeader,
  TextContainer,
} from "./ForgotPasswordStyles";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";
import Mail from "../../../public/divami_icons/Mail.svg";
import lock from "../../../public/divami_icons/lock.svg";
import backIcon from "../../../public/divami_icons/backIcon.svg";

import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FormBody from "./FormBody";
import FooterSignIn from "./FooterSign";
import { resetPasswordInit } from "../../../services/userAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  // form wrapper code
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();

  const formHandler = (event: any) => {
    console.log("formData", formData);
    const email = formData[0].defaultValue;
    const checkError = formData[0].isError;
    setValidate(true);

    if (!email || checkError) {
      console.log("Email and password are empty. Aborting login.");
      return; // Stop execution here
    }

    handleForgotPassword(email);
  };

  const handleForgotPassword = (email: string) => {
    console.log(email, "fdfsfdlkk");
    resetPasswordInit(email?.toLocaleLowerCase())
      .then((response: any) => {
        console.log("response", response);
        if (response?.success) {
          toast.success(response?.message);

          router.push(
            {
              pathname: "/reset_link",
              query: { email: email }, // Pass the email as a query parameter
            },
            "/reset_link"
          );
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
      });
  };

  const handleFormData = (data: any) => {
    setFormData(data);
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
          <FormHeader>
            <HeaderImageLogo src={backIcon} alt="logo" />

            <SignInHeader>Forgot Password</SignInHeader>
          </FormHeader>
          <TextContainer>
            To Reset your Password, enter the Email Address you use to sign in
            to Constructn
          </TextContainer>

          <FormBody
            handleFormData={handleFormData}
            validate={validate}
            setIsValidate={setValidate}
            tagsList={tagList}
            setCanBeDisabled={setCanBeDisabled}
            loginField={true}
          />

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
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default ForgotPassword;