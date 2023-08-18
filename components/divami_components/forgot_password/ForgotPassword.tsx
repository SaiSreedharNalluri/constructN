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
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";
const ForgotPassword = () => {
  // form wrapper code
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const [resetPasswordEnable, setResetPasswordEnable] = useState(true)
  const [token, setToken] = useState("");
  const router = useRouter();

  const formHandler = (event: any) => {
    const email = formData[0].defaultValue;
    const checkError = formData[0].isError;
    setValidate(true);

    if (!email || checkError) {
      return; // Stop execution here
    }

    handleForgotPassword(email);
  };

  const handleForgotPassword = (email: string) => {
    if(resetPasswordEnable){
      setResetPasswordEnable(false)
      resetPasswordInit(email?.toLocaleLowerCase())
      .then((response: any) => {
        if (response?.success) {
          CustomToast(response?.message,"success");
          setResetPasswordEnable(true)
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
        setResetPasswordEnable(true)
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        CustomToast("Unregistered User email","error");
      });
    }
   
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
            <HeaderImageLogo
              src={backIcon}
              alt="logo"
              onClick={() => {
                router.push("/login");
              }}
            />

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
