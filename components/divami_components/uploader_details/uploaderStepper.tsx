import React from "react";
import { Stepper, Step, StepLabel, createTheme, ThemeProvider } from "@mui/material";
import { useUploaderContext } from "../../../state/uploaderState/context";

interface IProps{

}
const UploaderStepper : React.FC<IProps> =() => {
  const { state } = useUploaderContext();
  const theme = createTheme({
    components: {
      MuiStepIcon: {
        styleOverrides: {
          root:{
            
          }
          
        },
      },
    },
  });

  return (
    <div>
       


        <div style={{ margin: "4px 0", fontWeight: "600", fontSize: "22px",fontFamily:"Open Sans",fontStyle:"normal" }}>Upload</div>
    <ThemeProvider theme={theme}>
      <Stepper activeStep={state.step} alternativeLabel style={{ maxWidth: "800px",margin: "0 auto", }}>
        {state.stepNames?.map((label:any, index:any) => (
          <Step key={label}>
            <StepLabel style={{fontFamily:"Open Sans",fontStyle:"normal",fontWeight:"400",fontSize:"18px", lineHeight:"20px"}}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </ThemeProvider>
  
    </div>
  );
};

export default UploaderStepper;
