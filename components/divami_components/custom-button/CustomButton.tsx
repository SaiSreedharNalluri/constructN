import { styled } from "@mui/system";
import { Button } from "@mui/material";
import React from "react";

interface ContainerProps {
  loginField: boolean;
  createIssueForm: boolean;
}
const StyledButtonDisable = styled(Button)((props: any) => ({
  width: "180px !important",
  height: "40px",
  textTransform: "none",
  backgroundColor: "#888888 !important",
  color: "#ffffff !important",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "16px",
})) as any;

const StyledButton = styled(Button)((props: any) => ({
  // border: "2px solid red",

  width: props.loginField ? "340px" : "180px !important",
  height: "40px",
  textTransform: "none",
  backgroundColor: props.loginField ? "#888888 !important" : "",
  color: props.loginField ? "#ffffff !important" : "",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "16px",
})) as any;

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
  const {
    type,
    label,
    formHandler,
    setButtonClicked,
    loginField,
    disabledButton,
    ref,
  } = props;
  if (type === "contained") {
    return (
      <div>
        <ContainedButton
          data-testid="testing_button"
          variant="contained"
          onClick={() => {
            formHandler(label);
            setButtonClicked ? setButtonClicked(true) : null;
          }}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              formHandler(label);
              setButtonClicked ? setButtonClicked(true) : null;
            } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.stopPropagation();
            }
          }}
          loginField={loginField}
          ref={ref}
        >
          {label}
        </ContainedButton>
      </div>
    );
  } else if (type === "outlined") {
    return (
      <div>
        <OulinedButton
          data-testid="testing_button"
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
        {loginField ? (
          <StyledButton
            data-testid="testing_button"
            variant="outlined"
            disabled
            loginField={loginField}
          >
            {label}
          </StyledButton>
        ) : (
          <StyledButtonDisable
            data-testid="testing_button"
            variant="outlined"
            disabled
          >
            {label}
          </StyledButtonDisable>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};

export default CustomButton;
