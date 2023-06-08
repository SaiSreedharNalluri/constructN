import React, { useState } from "react";
import {
  ButtonSection,
  FormContainerSign,
  FormDiv,
  FormHeader,
  HeaderContainer,
  HeaderImageLogo,
  IllustrationBackground,
  Overlay,
  SectionShowcase,
  SignInHeader,
  UserText,
} from "./ResetPasswordStyles";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import Logo from "../../../public/divami_icons/Logo.svg";
import backIcon from "../../../public/divami_icons/backIcon.svg";

import FormBody from "./FormBody";
import FooterSignIn from "./FooterSign";
import { resetPasswordToken } from "../../../services/userAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ResetPassword = ({ uniqueToken }: any) => {
  const router = useRouter();

  // form wrapper code

  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const [token, setToken] = useState("");
  const [showError, setShowError] = useState<boolean>(false);
  const [dummyToken, setDummyToken] = useState<string>(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVVNSMzI1MzA5IiwiaWF0IjoxNjg0NzQ0NDQwLCJleHAiOjE2ODQ3NDUwNDB9.gB7nESNWljQp5l2lHytUWlnclMB6hnhIpyPV9sVKbyE"
  );

  const handleFormData = (data: any) => {
    setFormData(data);
  };
  const formHandler = (event: any) => {
    const formValues = {
      password: formData[0].defaultValue,
      confirm_password: formData[1].defaultValue,
    };

    setValidate(true);

    const hasEmptyValue = Object.values(formValues).some(
      (value) => value === ""
    );

    let hasError = formData.some(function (obj: any) {
      return obj.isError === true;
      // console.log(obj)
    });

    // const isErrorExist = formData.some

    if (hasEmptyValue || formData[0].isError || formData[1].isError) {
      setShowError(true);
      return; // Stop execution here
    }
    if (hasError) {
      return; // Stop execution here
    }

    handleResetPassword(formValues);
  };

  const handleResetPassword = (formPassword: any) => {
    resetPasswordToken(
      // router.query.token as string,
      uniqueToken,
      formPassword.password as string
    )
      .then((response) => {
        if (response.success === true) {
          toast.info("Redirecting ... ");

          router.push("/reset_completed");
        }
      })
      .catch((error) => {
        toast.error(error.message);

        router.push("/reset_completed");

        return;
        // setCheckResponse(error.success);
      });
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
          <FormHeader>
            <HeaderImageLogo
              onClick={() => {
                router.push("/login");
              }}
              src={backIcon}
              alt="logo"
            />

            <SignInHeader>Reset Password</SignInHeader>
          </FormHeader>

          <UserText>
            Hi User, kindly create a new password. <br></br>Your new password
            must be different to your previously three used passwords
          </UserText>

          <FormBody
            handleFormData={handleFormData}
            validate={validate}
            setIsValidate={setValidate}
            tagsList={tagList}
            setCanBeDisabled={setCanBeDisabled}
            loginField={true}
          />
          <ButtonSection>
            <FooterSignIn
              formHandler={formHandler}
              canBeDisabled={canBeDisabled}
              loginField={true}
              // customLabel={true}
            />
          </ButtonSection>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default ResetPassword;
