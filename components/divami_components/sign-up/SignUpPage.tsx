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
  PasswordPopupContainer,
  TermsAndConditionDiv,
  SpanDiv,
  SignUpSubHeader,
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
import { useRouter } from "next/router";
import FooterSignUp from "./FooterSignUp";
import PasswordRequired from "../password-field/PasswordRequired";
import { CustomToast } from "../custom-toaster/CustomToast";
import constructnLogo from "../../../public/divami_icons/logo-yellow.svg";
import Link from "next/link";
import { Mixpanel } from "../../analytics/mixpanel";
const SignUpPage = () => {
  const router = useRouter();

  const [buttonSearch, setButtonSearch] = useState(true);
  // form wrapper code
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const [token, setToken] = useState("");
  const [showError, setShowError] = useState<boolean>(false);
  const [signUpMsg, setSignUpMsg] = useState<boolean>(false);
  const [signUpEnable, setSignUpEnabled] = useState<boolean>(false);
  const handleFormData = (data: any) => {
    setFormData(data);
  };
  const [childData, setChildData] = useState<string>("");

  const handleChildData = (data: string) => {
    setChildData(data);
  };

  const [checked, setChecked] = React.useState(true);
  const [formInfo, setFormInfo] = useState<any>({});
  const [errorExist, setErrorExist] = useState<any>(true);
  const [registerEnable, setRegisterEnable] = useState<boolean>(true)
  const [isCheckBoxSelected,setCheckBoxSelected]=useState<boolean>(false)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
 const handleCheckboxChange=(event:any)=>{
  setCheckBoxSelected(event.target.checked)
 }
  // const formHandler = (event: any) => {
  //   const firstName = formData[0].defaultValue;
  //   const lastName = formData[1].defaultValue;

  //   const nameRegex = /^[A-Za-z]+$/; // Regular expression to match alphabetic characters

  //   if (
  //     firstName.trim() === "" ||
  //     lastName.trim() === "" ||
  //     !nameRegex.test(firstName) ||
  //     !nameRegex.test(lastName)
  //   ) {
  //     // Display error or handle empty first name or last name
  //     // For example:
  //     // setErrorMsg('Please provide both first name and last name.');\
  //     toast.error("Invalid input for first name or last name");
  //     return;
  //   }

  //   const formValues = {
  //     firstName: firstName,
  //     lastName: lastName,

  //     email: formData[2].defaultValue.toLocaleLowerCase(),
  //     password: formData[3].defaultValue,
  //     confirm_password: formData[4].defaultValue,
  //   };

  //   let errorObjects = formData.filter(function (obj: any) {
  //     // return obj.isError === true;
  //     if (obj.isError === true) {
  //     }
  //   });

  //   errorObjects.forEach(function (obj: any) {
  //     // console.log(obj.id + " has isError = true");
  //   });

  //   // const email = formData[0].defaultValue;
  //   // const password = formData[1].defaultValue;
  //   // console.log(email, password);

  //   setValidate(true);

  //   const hasEmptyValue = Object.values(formValues).some(
  //     (value) => value === ""
  //   );

  //   let hasError = formData.some(function (obj: any) {
  //     return obj.isError === true;
  //     // console.log(obj)
  //   });

  //   // const isErrorExist = formData.some

  //   if (hasEmptyValue) {
  //     setShowError(true);
  //     return; // Stop execution here
  //   }

  //   if (hasError) {
  //     return; // Stop execution here
  //   }
  //   delete formValues.confirm_password;
  //   setFormInfo(formValues);
  //   setSignUpMsg(true);
  //   handleRegister(formValues);
  // };
  const formHandler = (event: any) => {
    const formValues = {
      firstName: formData[0].defaultValue.trim(),
      lastName: formData[1].defaultValue.trim(),
      email: formData[2].defaultValue.toLocaleLowerCase(),
      password: formData[3].defaultValue,
      confirm_password: formData[4].defaultValue,
    };


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

  function checkPassword(str: any) {
    if (str.length > 0) {
      let rePass =
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?!\s).{8,14}(?<!\s)$/;
      let passwordTru = rePass.test(str);
      return !passwordTru;
    } else {
      return false;
    }
  }
  const handleRegister = (formValue: any) => {
    if(registerEnable){
      setRegisterEnable(false)
      if(router?.query?.token)
      {
        formValue.inviteToken = router?.query?.token
      }
      registerUser(formValue)
      .then((response) => {
        setRegisterEnable(true)
        if (response.success === true) {
          Mixpanel.track( {name: "signup_successful",project_id:"unknown",company_id:"unknown",screen_name:"sign_page",event_category:"signup",event_action:"sign_successful",user_id:"unknown"})
          CustomToast("You have Successfully Registered", "success");
      if( response.result.verified===true)
      {

        router.push('/login')
      }else{
        router.push(
          {
            pathname: "/verify_page",
            query: { email: formValue.email }, // Pass the email as a query parameter
          },
          "/verify_page"
        );
      }
       }
      })
      .catch((error) => {
        setRegisterEnable(true)
        Mixpanel.track( {name: "signup_failed",project_id:"unknown",company_id:"unknown",screen_name:"sign_page",event_category:"signup",event_action:"signup_failed",user_id:"unknown",error_message:error.response.data.message})
        CustomToast(error.response.data.message,"error");
      });
    }
  };
  // form wrapper code

  return (
    <SectionShowcase>
      <HeaderContainer>
        <HeaderImageLogo src={constructnLogo} alt="logo" />
      </HeaderContainer>
      <IllustrationBackground src={Illustration} alt="construct" />

      <Overlay></Overlay>
      <FormDiv>
        <FormContainerSign>
          <SignInHeader>Create your Account</SignInHeader>
          <SignUpSubHeader>Enter the fields below to get started</SignUpSubHeader>
          {/* {showError ? (
            <ErrorSectonDiv>All fields are required*</ErrorSectonDiv>
          ) : (
            ""
          )} */}
          <div style={{ position: "relative" }}>
            <FormBody
              handleFormData={handleFormData}
              validate={validate}
              setIsValidate={setValidate}
              tagsList={tagList}
              setCanBeDisabled={setCanBeDisabled}
              loginField={true}
              signUpMsg={signUpMsg}
              errorStylingSignup={true}
              onData={handleChildData}
            />
            {checkPassword(childData) ? (
              <PasswordPopupContainer>
                <PasswordRequired passwordString={childData} />
              </PasswordPopupContainer>
            ) : null}
          </div>

         <ExtraTickDiv>
              <CheckTickDiv>
                <CheckTickBox
                  sx={{ padding: 0 }}
                  icon={
                    <Image
                      width={18}
                      height={18}
                      src={UnChecked}
                      alt="Search"
                    />
                  }
                  checkedIcon={
                    <Image width={18} height={18} src={Checked} alt="Search" />
                  }
                  onChange={handleCheckboxChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </CheckTickDiv>

              <TermsAndConditionDiv> I agree to the <Link  href="https://constructn.ai/terms-conditions/" target="_blank" passHref>
                <SpanDiv > Terms of Service</SpanDiv></Link> and  <Link  href="https://constructn.ai/privacy-policy/" target="_blank" passHref><SpanDiv>Privacy Policy</SpanDiv> </Link></TermsAndConditionDiv> 
          </ExtraTickDiv>
     
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
              canBeDisabled={!canBeDisabled && isCheckBoxSelected}
              loginField={true}
              customLabel={true}
              // isCheckBoxSelected={isCheckBoxSelected}
            />
          </ButtonSection>

          <NewUserDiv>
            Already a User?{" "}
            <NewUserSpan
              onClick={() => {
                router.push("/login");
              }}
            >
              Sign In
            </NewUserSpan>
          </NewUserDiv>
        </FormContainerSign>
      </FormDiv>
    </SectionShowcase>
  );
};

export default SignUpPage;
