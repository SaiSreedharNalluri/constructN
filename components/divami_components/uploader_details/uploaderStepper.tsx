import React from "react";
import { Stepper, Step, StepLabel, createTheme, ThemeProvider } from "@mui/material";

interface IProps{
activeStep:any,
steps:any;
}
const UploaderStepper : React.FC<IProps> =({ activeStep, steps }) => {
  const theme = createTheme({
    components: {
      MuiStepIcon: {
        styleOverrides: {
          root: {
            color: "#f1742e",
          },
        },
      },
    },
  });

  return (
    <div>
        <div style={{ margin: "4px 0", fontWeight: "bold", fontSize: "18px", }}>Upload</div>
    <ThemeProvider theme={theme}>
      <Stepper activeStep={activeStep} alternativeLabel style={{ maxWidth: "800px",margin: "0 auto", }}>
        {steps.map((label:any, index:any) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </ThemeProvider>
  
    </div>
  );
};

export default UploaderStepper;
