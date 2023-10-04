import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

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
  SignupContainer,
} from "./VerifyUserStyles";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import constructnLogo from "../../../public/divami_icons/logo-yellow.svg";
import Mail from "../../../public/divami_icons/Mail.svg";
import lock from "../../../public/divami_icons/lock.svg";
import { verifyResendEmail } from "../../../services/userAuth";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";

const VerifyUser = ({ queryMail }: { queryMail: string }) => {
  // const maskedEmail = queryMail.replace(/.(?=.*?@)/g, "*");
  const [maskedMail, setMaskedMail] = useState("");
  const [verifyEnable, setVerifyEnabled] = useState<boolean>(true)
  const router = useRouter();

  useEffect(() => {
    if (queryMail) {
      convertEmail(queryMail);
    }
  }, [queryMail]);

  function convertEmail(email: string) {
    let parts = email.split("@");
    let username = parts[0];
    let domain = parts[1];

    let newDomain = domain.split(".");
    //   console.log("newDomain",newDomain)
    //   console.log("newDomain",newDomain[0].length)
    let asterisks = "*".repeat(newDomain[0].length);
    //   console.log(asterisks);

    let usernameHidden = username.slice(0, 2) + "*".repeat(username.length - 2);
    let domainHidden = domain.slice(0, 3);
    const getMaildId = usernameHidden + "@" + asterisks + "." + newDomain[1];
    setMaskedMail(getMaildId);

    return;
  }

  const handleEmailVerification = (email: string) => {
    if(verifyEnable){
      setVerifyEnabled(false)
      verifyResendEmail(email)
      .then((response) => {
        setVerifyEnabled(true)
        CustomToast(response.message,"success");
        return;
      })
      .catch((error) => {
        setVerifyEnabled(true)
        CustomToast(error.message,"error");
        return;
        // resetForm();
        // setLoading(false);
      });
    }
   
  };

  return (
    <SectionShowcase>
      <HeaderContainer>
        <HeaderImageLogo src={constructnLogo} alt="logo" />
      </HeaderContainer>
      <IllustrationBackground src={Illustration} alt="construct" />

      <Overlay></Overlay>
      <FormDiv>
        <FormContainerSign>
          {/* <SignInHeader>Sign In</SignInHeader> */}
          <VerifyUserDiv>
            <MessageDivShow>Verify your account</MessageDivShow>

            <SentDivShow>
              We&apos;ve sent an email to {maskedMail} verify your email address
              and activate your account.
            </SentDivShow>

            <LinkExpireDiv>
              The link in the email will expire in 24 hours.
            </LinkExpireDiv>

            {/* <ChangeSignDiv
              onClick={() => {
                // router.push("/signup");
                router.push("/signup");
                // router.push("/verify-block/xyz123456");
              }}
            >
              Change Signed Up Email
            </ChangeSignDiv> */}

            <ResendMailDiv>
              Didn’t recieve the email?
              <SpanResend
                onClick={() => {
                  handleEmailVerification(queryMail);
                }}
              >
                {" "}
                Click to resend
              </SpanResend>{" "}
            </ResendMailDiv>

            <SignupContainer>
              Already a User?{" "}
              <SpanResend
                onClick={() => {
                  router.push("/login");
                }}
              >
                {" "}
                Sign In
              </SpanResend>{" "}
            </SignupContainer>
          </VerifyUserDiv>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default VerifyUser;
