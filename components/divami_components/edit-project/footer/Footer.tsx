import React, { useState } from "react";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import CustomButton from "../../custom-button/CustomButton";
const ButtonsContainer = styled(Box)({
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});
const Footer = ({ formHandler,  canBeDisabled ,handleEditClose}: any) => {
  console.log("customDisable", canBeDisabled);
  return (
    <ButtonsContainer>
      <CustomButton type="outlined" label="Cancel" formHandler={formHandler} />
      <CustomButton
        type={canBeDisabled ? "disabled" : "contained"}
        label={ "Update"}
        formHandler={formHandler}
        setButtonClicked={handleEditClose}
        disabledButton={canBeDisabled}
      />
    </ButtonsContainer>
  );
};

export default Footer;
