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
const Footer = ({ formHandler, canBeDisabled, handleEditClose, save }: any) => {
  return (
    <ButtonsContainer>
      <CustomButton type="outlined" label="Cancel" formHandler={formHandler} />
      <CustomButton
        type="formik"
        label={save === "Save" ? "Save" : ""}
        formHandler={formHandler}
        setButtonClicked={handleEditClose}
      />
    </ButtonsContainer>
  );
};

export default Footer;
