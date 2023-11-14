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
  const CustomStepIcon= ({ active, completed, icon }:any) => { 
    const iconStyle= {
      width: "32px",
      height: "32px",
      fontSize: "14px",
      color: active ? "#32353A" : completed ? "#fff" : "#D9D9D9", 
      backgroundColor: active ? "white" : completed ? "#FF843F" : "white", 
      borderRadius: "50%", 
      border: active ? "1px solid #32353A" : completed ? "1px solid #FF843F" : "1px solid #D9D9D9",  
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight:"400",
      lineHeight:"19.07px",
      fontFamily:"Open Sans"
    };
    return (
      <div style={iconStyle}>{icon}</div>
    );
  };
  return (
    <div>
       


        <div style={{ margin: "4px 0", fontWeight: "600", fontSize: "22px",fontFamily:"Open Sans",fontStyle:"normal" }}>Upload</div>
    <ThemeProvider theme={theme}>
      <Stepper activeStep={state.step} alternativeLabel style={{ maxWidth: "800px",margin: "0 auto", }}>
        {state.stepNames?.map((label:any, index:any) => (
          <Step key={label} >
            <StepLabel  StepIconComponent={CustomStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </ThemeProvider>
  
    </div>
  );
};

export default UploaderStepper;
