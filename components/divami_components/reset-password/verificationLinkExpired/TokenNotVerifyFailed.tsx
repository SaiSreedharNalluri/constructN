import React from "react";
import {
  AccountVerifyDiv,
  FormContainerSign,
  FormDiv,
  HeaderContainer,
  HeaderImageLogo,
  IllustrationBackground,
  Overlay,
  DrawerImageLogo,
  SectionShowcase,
  AccountVerifyHeader,
  ProceedText,
  LoginButton,
  ClickHereText,
  ResendText,
} from "./TokenNotVerifyFailedStyles";
import Illustration from "../../../../public/divami_icons/Illustration.svg";
import Logo from "../../../../public/divami_icons/Logo.svg";

import SuccessImg from "../../../public/divami_icons/SuccessImg.svg";
import { useRouter } from "next/router";

import { toast } from "react-toastify";
import { CustomToast } from "../../custom-toaster/CustomToast";
import { resetPasswordInit } from "../../../../services/userAuth";


const TokenNotVerifyFailed = (props: any) => {
  const router = useRouter();
  const resendEmail = () => {
    resetPasswordInit(null,router.query.token as string)
    .then((response: any) => {
      if (response?.success) {
        CustomToast(response?.message,"success");
       
        router.push('/login');
      }
    })
    .catch((error: any) => {
     
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

       CustomToast("Unregistered User email", "error");
    });
  };
  return (
    <SectionShowcase>
      <HeaderContainer>
        <HeaderImageLogo src={Logo} alt="logo" />
      </HeaderContainer>

      <IllustrationBackground src={Illustration} alt="construct" />

      <Overlay></Overlay>

      <FormDiv>
        <FormContainerSign>
          <AccountVerifyDiv>
            <AccountVerifyHeader>Verification Link Expired</AccountVerifyHeader>

            <ProceedText>
              Your  reset password link has been expired.
            </ProceedText>

            <ResendText>
              Click <ClickHereText onClick={resendEmail}>here</ClickHereText> to
              resend reset password link.
            </ResendText>
            <LoginButton
              onClick={() => {
                router.push("/login");
              }}
            >
             Back To Log In
            </LoginButton>
          </AccountVerifyDiv>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default TokenNotVerifyFailed;
