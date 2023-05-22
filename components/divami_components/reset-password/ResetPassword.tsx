import React, { useState } from "react";
import {
  ButtonSection,
  FormContainerSign,
  FormDiv,
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
import FormBody from "./FormBody";
import FooterSignIn from "./FooterSign";
import { resetPasswordToken } from "../../../services/userAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ResetPassword = () => {
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
    console.log("formData", formData);
    const formValues = {
      password: formData[0].defaultValue,
      confirm_password: formData[1].defaultValue,
    };
    console.log("formValues", formValues);

    setValidate(true);

    const hasEmptyValue = Object.values(formValues).some(
      (value) => value === ""
    );

    let hasError = formData.some(function (obj: any) {
      return obj.isError === true;
      // console.log(obj)
    });

    // const isErrorExist = formData.some

    if (hasEmptyValue) {
      setShowError(true);
      console.log("Form has empty values. Aborting registration.");
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
      dummyToken,
      formPassword.password as string
    )
      .then((response) => {
        console.log("tokenresponse", response);
        if (response.success === true) {
          toast.info("Redirecting ... ");
          setTimeout(() => {
            toast.info(" reset password completed");
            // router.push('/login');
            // router.push("/signin");
          }, 5000);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error.message);
          // setCheckResponse(error.success);
        }
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
          <SignInHeader>Reset Password</SignInHeader>

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
