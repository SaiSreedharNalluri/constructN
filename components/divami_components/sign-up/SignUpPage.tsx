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
  ErrorSectonDiv,
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
import { registerUser } from "../../../services/userAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import FooterSignUp from "./FooterSignUp";

const SignUpPage = () => {
  const router = useRouter();

  const [buttonSearch, setButtonSearch] = useState(true);
  // form wrapper code
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(true);
  const [token, setToken] = useState("");
  const [showError, setShowError] = useState<boolean>(false);
  const [signUpMsg, setSignUpMsg] = useState<boolean>(false);
  const handleFormData = (data: any) => {
    setFormData(data);
  };

  const [checked, setChecked] = React.useState(true);
  const [formInfo, setFormInfo] = useState<any>({});
  const [errorExist, setErrorExist] = useState<any>(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const formHandler = (event: any) => {
    const formValues = {
      firstName: formData[0].defaultValue,
      lastName: formData[1].defaultValue,
      email: formData[2].defaultValue.toLocaleLowerCase(),
      password: formData[3].defaultValue,
      confirm_password: formData[4].defaultValue,
    };
    console.log("formValues", formValues);
    console.log("formData", formData);

    let errorObjects = formData.filter(function (obj: any) {
      // return obj.isError === true;
      if (obj.isError === true) {
      }
    });

    errorObjects.forEach(function (obj: any) {
      // console.log(obj.id + " has isError = true");
    });

    // const email = formData[0].defaultValue;
    // const password = formData[1].defaultValue;
    // console.log(email, password);

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
    delete formValues.confirm_password;
    setFormInfo(formValues);
    setSignUpMsg(true);
    handleRegister(formValues);
  };
  const handleRegister = (formValue: any) => {
    // formValue.email = formValue.email.toLocaleLowerCase();

    console.log("hiii");

    // return;
    // setLoading(true);
    registerUser(formValue)
      .then((response) => {
        if (response.success === true) {
          toast.success("User Registeration completed in sucessfully");
          // toast.info("Redirecting ... ");
          console.log("formInfo", formValue);

          // setTimeout(() => {
          //   toast.info("Please check your e-mail to verify the account");
          // router.push("/login");
          // router.push("/signin");
          // router.push("verify_page");
          router.push(
            {
              pathname: "/verify_page",
              query: { email: formValue.email }, // Pass the email as a query parameter
            },
            "/verify_page"
          );
          // }, 5000);
        }
      })
      .catch((error) => {
        if (error?.response?.status === 409) {
          toast.error(error.response.data.message);
        }
        // resetForm();
        // setLoading(false);
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
          <SignInHeader>Signup</SignInHeader>
          {/* {showError ? (
            <ErrorSectonDiv>All fields are required*</ErrorSectonDiv>
          ) : (
            ""
          )} */}

          <FormBody
            handleFormData={handleFormData}
            validate={validate}
            setIsValidate={setValidate}
            tagsList={tagList}
            setCanBeDisabled={setCanBeDisabled}
            loginField={true}
            signUpMsg={signUpMsg}
            errorStylingSignup={true}
          />
          {/* <ExtraTickDiv>
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
          </ExtraTickDiv> */}
          <ButtonSection buttonSearch={buttonSearch}>
            {/* <SignInContainedButton variant="outlined">
              Sign In
            </SignInContainedButton> */}

            <FooterSignUp
              formHandler={formHandler}
              canBeDisabled={canBeDisabled}
              loginField={true}
              customLabel={true}
            />
          </ButtonSection>

          <NewUserDiv>
            Already a User?{" "}
            <NewUserSpan
              onClick={() => {
                router.push("/signin");
              }}
            >
              Sign in
            </NewUserSpan>
          </NewUserDiv>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default SignUpPage;
