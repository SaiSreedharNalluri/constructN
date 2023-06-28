import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
  ChangeMailText,
  CheckInboxText,
  DrawerImageLogo,
  FormContainerSign,
  FormDiv,
  FormHeader,
  HeaderContainer,
  HeaderImageLogo,
  IllustrationBackground,
  LinkEmailText,
  MessageContainer,
  Overlay,
  RecieveMailText,
  SectionShowcase,
  SignInHeader,
  SpanResend,
} from "./ResetLinkStyles";
import Logo from "../../../public/divami_icons/Logo.svg";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import backIcon from "../../../public/divami_icons/backIcon.svg";
import resentSuccess from "../../../public/divami_icons/resentSuccess.svg";
import { resetPasswordInit } from "../../../services/userAuth";
import { toast } from "react-toastify";

const ResetLink = ({ queryMail }: any) => {
  // const maskedEmail = queryMail.replace(/.(?=.*?@)/g, "*");
  const [maskedMail, setMaskedMail] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (queryMail) {
      setMaskedMail(queryMail);
    }
  }, [queryMail]);

  const handleForgotPassword = (email: string) => {
    resetPasswordInit(email?.toLocaleLowerCase())
      .then((response: any) => {
        if (response?.success) {
          toast.success(response?.message);

          // router.push(
          //   {
          //     pathname: "/reset_link",
          //     query: { email: email }, // Pass the email as a query parameter
          //   },
          //   "/reset_link"
          // );
          // router.push("/reset_pass_word/xyz123456");
        }
      })
      .catch((error: any) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        toast.error("Invalid Credentials");
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
          <FormHeader>
            <HeaderImageLogo
              src={backIcon}
              alt="logo"
              onClick={() => {
                router.push("/forgot_password");
              }}
            />

            <SignInHeader>Reset Link Sent</SignInHeader>
          </FormHeader>

          <MessageContainer>
            <DrawerImageLogo src={resentSuccess} alt="logo" />

            <CheckInboxText>
              Please check your Inbox {maskedMail}
            </CheckInboxText>
            <LinkEmailText>
              The link in the email will expire in 24 hours.
            </LinkEmailText>

            <ChangeMailText
              onClick={() => {
                // router.push("/signup");
                // router.push("/signup");
                router.push("/signup");
                // router.push("/reset_pass_word/xyz123456");
              }}
            >
              Change Email
            </ChangeMailText>

            <RecieveMailText>
              Didn’t recieve the email?
              <SpanResend
                onClick={() => {
                  // router.push("/signup");
                  // router.push("/signup");
                  handleForgotPassword(maskedMail);
                  // router.push("/reset_pass_word/xyz123456");
                }}
              >
                Click to resend
              </SpanResend>
            </RecieveMailText>
          </MessageContainer>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default ResetLink;
