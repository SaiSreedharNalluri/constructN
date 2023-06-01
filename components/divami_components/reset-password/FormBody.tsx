import React, { useState, useEffect } from "react";

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
import { RESET_FORM_CONFIG } from "./Constant";

const FormBody = ({
  handleFormData,
  validate,
  setIsValidate,
  tagsList,
  issueStatusList,
  setCanBeDisabled,
  loginField,
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
  const [formConfig, setFormConfig] = useState(RESET_FORM_CONFIG);
  useEffect(() => {
    console.log(formConfig, "formconfig in effect");
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
      />
    </>
  );
};

export default FormBody;
