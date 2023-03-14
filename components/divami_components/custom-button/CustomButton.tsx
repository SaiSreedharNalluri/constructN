import { styled } from "@mui/system";
import { Button } from "@mui/material";
import React from "react";

const StyledButton = styled(Button)({
  width: "180px",
  height: "40px",
  textTransform: "none",
});

const ContainedButton = styled(StyledButton)({
  backgroundColor: "#f1742e !important",
  color: "#ffffff",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "16px",
  "&:hover": {
    backgroundColor: "#f1742e",
    color: "#ffffff",
  },
});

const OulinedButton = styled(StyledButton)({
  backgroundColor: "#ffffff",
  color: "#f1742e",
  borderColor: "#f1742e",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "16px",
  "&:hover": {
    backgroundColor: "#ffffff",
    borderColor: "#f1742e",
  },
});

const CustomButton = (props: any) => {
  const { type, label, formHandler, dataTestid } = props;
  if (type === "contained") {
    return (
      <div>
        <ContainedButton
          data-testid={dataTestid}
          variant="contained"
          onClick={() => formHandler(label)}
        >
          {label}
        </ContainedButton>
      </div>
    );
  } else if (type === "outlined") {
    return (
      <div>
        <OulinedButton
          data-testid={dataTestid}
          variant="outlined"
          onClick={() => formHandler(label)}
        >
          {label}
        </OulinedButton>
      </div>
    );
  } else if (type === "disabled") {
    return (
      <div>
        <StyledButton data-testid={dataTestid}
          variant="outlined" disabled>
          {label}
        </StyledButton>
      </div>
    );
  } else {
    return <></>;
  }
};

export default CustomButton;
