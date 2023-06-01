import React, { useState } from "react";
// import CustomButton from '../../Common/custom-button/CustomButton'
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import CustomButton from "../../custom-button/CustomButton";

const ButtonsContainer = styled(Box)({
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const Footer = ({ formHandler, editData, canBeDisabled }: any) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  return (
    <ButtonsContainer>
      <CustomButton type="outlined" label="Cancel" formHandler={formHandler} />
      <CustomButton
        // type={canBeDisabled && buttonClicked ? "disabled" : "contained"}
        type={canBeDisabled ? "disabled" : "contained"}
        label={editData ? "Update" : "Create"}
        formHandler={formHandler}
        setButtonClicked={setButtonClicked}
      />
    </ButtonsContainer>
  );
};

export default Footer;
