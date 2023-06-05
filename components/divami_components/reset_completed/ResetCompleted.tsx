import React from "react";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";

import SuccessImg from "../../../public/divami_icons/SuccessImg.svg";
import Infographic from "../../../public/divami_icons/Infographic.svg";
import { useRouter } from "next/router";

import {
  AccountVerifyDiv,
  AccountVerifyHeader,
  DrawerImageLogo,
  FormContainerSign,
  FormDiv,
  HeaderContainer,
  HeaderImageLogo,
  IllustrationBackground,
  LoginButton,
  Overlay,
  ProceedText,
  SectionShowcase,
} from "./ResetCompletedStyles";
const ResetCompleted = () => {
  const router = useRouter();

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
            <DrawerImageLogo src={Infographic} alt="logo" />
            <AccountVerifyHeader>Reset Completed</AccountVerifyHeader>

            <ProceedText>Your password has been reset successfully</ProceedText>
            <LoginButton
              onClick={() => {
                router.push("/login");
              }}
            >
              Log In
            </LoginButton>
          </AccountVerifyDiv>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default ResetCompleted;
