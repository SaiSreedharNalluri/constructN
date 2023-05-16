import React, { useState } from "react";

import {
  ButtonSection,
  CheckTickBox,
  CheckTickDiv,
  ExtraTickDiv,
  ForgotDiv,
  FormContainerSign,
  FormDiv,
  HeaderContainer,
  HeaderImageLogo,
  IllustrationBackground,
  NewUserDiv,
  NewUserSpan,
  Overlay,
  ParentTickDiv,
  RememberDiv,
  SectionShowcase,
  SignInHeader,
} from "./SignUpPageStyles";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";
import Mail from "../../../public/divami_icons/Mail.svg";
import lock from "../../../public/divami_icons/lock.svg";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import FormBody from "./FormBody";
import Image from "next/image";
import UnChecked from "../../../public/divami_icons/unchecked.svg";
import Checked from "../../../public/divami_icons/checked.svg";
import FooterSignIn from "../sign-in/FooterSignIn";

const SignUpPage = () => {
  const [buttonSearch, setButtonSearch] = useState(true);
  // form wrapper code
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const [token, setToken] = useState("");
  const handleFormData = (data: any) => {
    setFormData(data);
  };

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const formHandler = (event: any) => {
    console.log("formData", formData);
    const email = formData[0].defaultValue;
    const password = formData[1].defaultValue;
    console.log(email, password);

    setValidate(true);
    // handlerLogin(email, password);
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
          <SignInHeader>Signup</SignInHeader>
          <FormBody
            handleFormData={handleFormData}
            validate={validate}
            setIsValidate={setValidate}
            tagsList={tagList}
            setCanBeDisabled={setCanBeDisabled}
            loginField={true}
          />
          <ExtraTickDiv>
            <ParentTickDiv>
              <CheckTickDiv>
                <CheckTickBox
                  sx={{ padding: 0 }}
                  icon={
                    <Image
                      width={24}
                      height={24}
                      src={UnChecked}
                      alt="Search"
                    />
                  }
                  checkedIcon={
                    <Image width={24} height={24} src={Checked} alt="Search" />
                  }
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </CheckTickDiv>

              <RememberDiv>Remember me</RememberDiv>
            </ParentTickDiv>

            <ForgotDiv>Forgot password?</ForgotDiv>
          </ExtraTickDiv>
          <ButtonSection buttonSearch={buttonSearch}>
            {/* <SignInContainedButton variant="outlined">
              Sign In
            </SignInContainedButton> */}

            <FooterSignIn
              formHandler={formHandler}
              canBeDisabled={canBeDisabled}
              loginField={true}
              customLabel={true}
            />
          </ButtonSection>

          <NewUserDiv>
            Already a User? <NewUserSpan>Sign in</NewUserSpan>
          </NewUserDiv>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default SignUpPage;
