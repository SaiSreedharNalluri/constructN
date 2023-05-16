import React from "react";
import {
  FormContainerSign,
  FormDiv,
  HeaderContainer,
  HeaderImageLogo,
  IllustrationBackground,
  MessageDivShow,
  Overlay,
  SectionShowcase,
  SentDivShow,
  SignInHeader,
  VerifyUserDiv,
  LinkExpireDiv,
  ChangeSignDiv,
  ResendMailDiv,
  SpanResend,
} from "./VerifyUserStyles";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";
import Mail from "../../../public/divami_icons/Mail.svg";
import lock from "../../../public/divami_icons/lock.svg";

const VerifyUser = () => {
  return (
    <SectionShowcase>
      <HeaderContainer>
        <HeaderImageLogo src={Logo} alt="logo" />
      </HeaderContainer>
      <IllustrationBackground src={Illustration} alt="construct" />

      <Overlay></Overlay>
      <FormDiv>
        <FormContainerSign>
          {/* <SignInHeader>Sign In</SignInHeader> */}
          <VerifyUserDiv>
            <MessageDivShow>Verify your account</MessageDivShow>

            <SentDivShow>
              We've sent an email to Ex*m*p@e**l.com to verify your email
              address and activate your account.
            </SentDivShow>

            <LinkExpireDiv>
              The link in the email will expire in 24 hours.
            </LinkExpireDiv>

            <ChangeSignDiv>Change Signed Up Email</ChangeSignDiv>

            <ResendMailDiv>
              Didn’t recieve the email?<SpanResend> Click to resend</SpanResend>{" "}
            </ResendMailDiv>
          </VerifyUserDiv>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default VerifyUser;
