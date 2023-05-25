import { styled } from "@mui/system";
import { Button } from "@mui/material";
import React from "react";

// const StyledButton = styled(Button)({
//   width: "180px",
//   height: "40px",
//   textTransform: "none",
// });
const StyledButton = styled(Button)((props: any) => ({
  width: props.loginField ? "340px" : "180px !important",
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
  const { type, label, formHandler, setButtonClicked, loginField } = props;
  if (type === "contained") {
    return (
      <div>
        <ContainedButton
          data-testid="testing_button"
          variant="contained"
          onClick={() => {
            console.log("bbbb");
            formHandler(label);
            setButtonClicked ? setButtonClicked(true) : null;
          }}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              console.log("hellooo");
              formHandler(label);
              setButtonClicked ? setButtonClicked(true) : null;
            } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.stopPropagation();
            }
          }}
          loginField={loginField}
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
        <StyledButton
          data-testid="testing_button"
          variant="outlined"
          disabled
          loginField={loginField}
        >
          {label}
        </StyledButton>
      </div>
    );
  } else {
    return <></>;
  }
};

export default CustomButton;
