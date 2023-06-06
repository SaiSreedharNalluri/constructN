import React, { useState } from "react";
// import CustomButton from '../../Common/custom-button/CustomButton'
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import CustomButton from "../custom-button/CustomButton";

const ButtonsContainer = styled(Box)({
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});
const FooterSignIn = ({
  formHandler,
  canBeDisabled,
  loginField,
  customLabel,
}: any) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  return (
    <CustomButton
      // type={canBeDisabled && buttonClicked ? "disabled" : "contained"}
      type={canBeDisabled ? "disabled" : "contained"}
      label={customLabel ? "Create Account" : "Send Reset Link"}
      formHandler={formHandler}
      setButtonClicked={setButtonClicked}
      loginField={loginField}
    />
  );
};

export default FooterSignIn;