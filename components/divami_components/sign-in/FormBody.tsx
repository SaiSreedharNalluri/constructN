import React, { useState, useEffect } from "react";

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
import FormWrapper from "../form-wrapper/FormWrapper";
import { SIGN_IN_FORM_CONFIG } from "./Constant";

const FormBody = ({
  handleFormData,
  validate,
  setIsValidate,
  tagsList,
  issueStatusList,
  setCanBeDisabled,
  loginField,
  signUpMsg,
  handleKeyPress,
  
}: any) => {
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

  

  const [formState, setFormState] = useState({ selectedValue: "" });
  const [formConfig, setFormConfig] = useState(SIGN_IN_FORM_CONFIG);
  useEffect(() => {
    let updatedFormData = [...formConfig];
    handleFormData(updatedFormData);
    let count = 0;
    formConfig.forEach((item: any) => {
      if (item.isError) {
        count++;
      }
    });
    // if (count === 0) {
    //   setCanBeDisabled(true);
    // }
  }, [formConfig]);

 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Perform localStorage action
      let storedCredentials =  localStorage.getItem("userCredentials")
      let userCredentials = null
   //   let userCredentials = JSON.parse(localStorage.getItem("userCredentials"))
       if(storedCredentials){
        try{
          userCredentials = JSON.parse(storedCredentials)
          let newConfig = [
            {
              ...SIGN_IN_FORM_CONFIG[0], defaultValue:  userCredentials && userCredentials?.email ? userCredentials.email : ""
            },
            {
              ...SIGN_IN_FORM_CONFIG[1], defaultValue:  userCredentials && userCredentials?.password ? userCredentials.password : ""
            }
            
          ]
    
          setFormConfig(newConfig)
    
        }catch(error){
          console.log("Error parsing stored object:",error)
        }
       }
      //  console.log("CREDENTIALS",userCredentials)
   
      // console.log("TEST",userCredentials, userCredentials.password)
     
    }

  },[])

  return (
    <>
      <FormWrapper
        config={formConfig}
        setFormConfig={setFormConfig}
        formState={formState}
        setFormState={setFormState}
        validate={validate}
        setIsValidate={setIsValidate}
        setCanBeDisabled={setCanBeDisabled}
        loginField={true}
        signUpMsg={signUpMsg}
        handleKeyPress={handleKeyPress}
      />
    </>
  );
};

export default FormBody;
