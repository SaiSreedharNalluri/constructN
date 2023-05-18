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
} from "./VerifyUserStyles";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";
import Mail from "../../../public/divami_icons/Mail.svg";
import lock from "../../../public/divami_icons/lock.svg";

const VerifyUser = ({ queryMail }) => {
  // const maskedEmail = queryMail.replace(/.(?=.*?@)/g, "*");
  const [maskedMail, setMaskedMail] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (queryMail) {
      convertEmail(queryMail);
    }
  }, [queryMail]);

  function convertEmail(email) {
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
              We've sent an email to {maskedMail} to verify your email address
              and activate your account.
            </SentDivShow>

            <LinkExpireDiv>
              The link in the email will expire in 24 hours.
            </LinkExpireDiv>

            <ChangeSignDiv
              onClick={() => {
                router.push("/signup");
              }}
            >
              Change Signed Up Email
            </ChangeSignDiv>

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
