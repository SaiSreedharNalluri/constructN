import React, { useState } from "react";
import {
  FormContainerSign,
  FormDiv,
  FormText,
  HeaderContainer,
  HeaderImageLogo,
  IllustrationBackground,
  Overlay,
  SectionShowcase,
  SignInHeader,
  StyledPasswordField,
  StyledTextField,
  ShowHideDiv,
  ExtraTickDiv,
  CheckTickDiv,
  CheckTickBox,
  RememberDiv,
  ParentTickDiv,
  ForgotDiv,
  SignInContainedButton,
  ButtonSection,
  NewUserDiv,
  NewUserSpan,
} from "./SignInPageStyle";

import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";
import Mail from "../../../public/divami_icons/Mail.svg";
import lock from "../../../public/divami_icons/lock.svg";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

import { Checkbox, InputAdornment, TextField } from "@mui/material";
import Checked from "../../../public/divami_icons/checked.svg";
import UnChecked from "../../../public/divami_icons/unchecked.svg";

import Image from "next/image";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  return (
    <SectionShowcase>
      <HeaderContainer>
        <HeaderImageLogo src={Logo} alt="logo" />
      </HeaderContainer>

      <IllustrationBackground src={Illustration} alt="construct" />

      <Overlay></Overlay>

      <FormDiv>
        {/* <h2>Never Stop</h2>
        <h3>Exploring The World</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
          voluptatibus, fuga nobis ratione laudantium itaque fugiat voluptate
          corporis libero tempore?
        </p> */}

        <FormContainerSign>
          <SignInHeader>Sign In</SignInHeader>
          <FormText>
            <form>
              {" "}
              <StyledTextField
                variant="outlined"
                type="email"
                placeholder={"Email ID"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Image width={24} height={24} src={Mail} alt="Search" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledPasswordField
                variant="outlined"
                placeholder={"Enter Password"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Image width={24} height={24} src={lock} alt="Search" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {showPassword ? (
                        //   <VisibilityOffIcon onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} />
                        <ShowHideDiv
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          Hide
                        </ShowHideDiv>
                      ) : (
                        //   <VisibilityIcon onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} />
                        <ShowHideDiv
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          Show
                        </ShowHideDiv>
                      )}
                    </InputAdornment>
                  ),
                }}
                type={showPassword ? "text" : "password"}
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
                        <Image
                          width={24}
                          height={24}
                          src={Checked}
                          alt="Search"
                        />
                      }
                      onChange={handleChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  </CheckTickDiv>

                  <RememberDiv>Remember me</RememberDiv>
                </ParentTickDiv>

                <ForgotDiv>Forgot password?</ForgotDiv>
              </ExtraTickDiv>
              <ButtonSection>
                <SignInContainedButton variant="outlined">
                  Sign In
                </SignInContainedButton>
              </ButtonSection>
              <NewUserDiv>
                New User? <NewUserSpan>Signup</NewUserSpan>
              </NewUserDiv>
            </form>
          </FormText>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default SignInPage;
