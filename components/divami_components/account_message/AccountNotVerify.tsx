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
} from "./AccountVerifyNotStyles";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";

import SuccessImg from "../../../public/divami_icons/SuccessImg.svg";
import { useRouter } from "next/router";
import { ResendEmailVerification } from "../../../services/userAuth";
import { toast } from "react-toastify";
const AccountNotVerify = (props: any) => {
  const router = useRouter();
  const resendEmail = () => {
    ResendEmailVerification(router.query.token as string)
      .then((response) => {
        if (response.success === true) {
          toast.success(response.message);
          toast.info("Redirecting ... ");
          setTimeout(() => {
            // router.push("/login");
            router.push("/login");
          }, 5000);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        // setCheckResponse(error);
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
              Your Account verification link has been expired.
            </ProceedText>

            <ResendText>
              Click <ClickHereText onClick={resendEmail}>here</ClickHereText> to
              receive another verification email.
            </ResendText>
            {/* <LoginButton
              onClick={() => {
                router.push("/login");
              }}
            >
              Log In
            </LoginButton> */}
          </AccountVerifyDiv>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default AccountNotVerify;
