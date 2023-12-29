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
  PasswordPopupContainer,
} from "./ResetPasswordStyles";
import Illustration from "../../../public/divami_icons/Illustration.svg";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";
import Logo from "../../../public/divami_icons/Logo.svg";
import backIcon from "../../../public/divami_icons/backIcon.svg";

import FormBody from "./FormBody";
import FooterSignIn from "./FooterSign";
import { resetPasswordToken } from "../../../services/userAuth";
import { useRouter } from "next/router";
import PasswordRequired from "../password-field/PasswordRequired";

const ResetPassword = () => {
  const router = useRouter();

  // form wrapper code

  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [childData, setChildData] = useState<string>("");
  const handleFormData = (data: any) => {
    setFormData(data);
  };

  const handleChildData = (data: string) => {
    setChildData(data);
  };

  function checkPassword(str: any) {
    if (str.length > 0) {
   
      let rePass = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?!\s).{8,14}(?<!\s)$/;

      let passwordTru = rePass.test(str);
      return !passwordTru;
    } else {
      return false;
    }
  }

  const formHandler = (event: any) => {
    const formValues = {
      password: formData[0].defaultValue.trim(),
      confirm_password: formData[1].defaultValue.trim(),
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
   if(router.isReady)
   {
    resetPasswordToken(
      router.query.token as string,
      formPassword.password as string
    )
      .then((response) => {
        if (response.success === true) {
          CustomToast(response?.message,"success");

          router.push("/reset_completed");
        }
      })
      .catch((error) => {
        CustomToast(error.message,"error");
        router.push("/reset_completed");
        return;
      });
   }
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
          <div style={{ position: "relative" }}>
            <FormBody
              handleFormData={handleFormData}
              validate={validate}
              setIsValidate={setValidate}
              tagsList={tagList}
              setCanBeDisabled={setCanBeDisabled}
              loginField={true}
              onData={handleChildData}
            />
            {checkPassword(childData) ? (
              <PasswordPopupContainer>
                <PasswordRequired passwordString={childData} />
              </PasswordPopupContainer>
            ) : null}
          </div>
          <ButtonSection>
            <FooterSignIn
              formHandler={formHandler}
              canBeDisabled={canBeDisabled}
              loginField={true}
            />
          </ButtonSection>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default ResetPassword;
