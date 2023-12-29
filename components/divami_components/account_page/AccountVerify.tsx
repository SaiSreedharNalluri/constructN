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
} from "./AccountVerifyStyles";

import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";

import SuccessImg from "../../../public/divami_icons/SuccessImg.svg";
import { useRouter } from "next/router";

const AccountVerify = () => {
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
            <DrawerImageLogo src={SuccessImg} alt="logo" />
            <AccountVerifyHeader>
              Account Verified Successfully
            </AccountVerifyHeader>

            <ProceedText>You can proceed and login to your account</ProceedText>
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

export default AccountVerify;
