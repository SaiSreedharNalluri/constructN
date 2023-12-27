import { Stepper, Step, StepLabel, StepConnector, Typography } from '@mui/material'
import React from 'react'
import { withStyles } from "@mui/styles";
import { IOnboardingProps } from '../projectOnboarding';
import { useSignals } from '@preact/signals-react/runtime';

const CustomStepIcon = ({ active, completed, icon }: any) => {
  const iconStyle = {
    width: "9px",
    height: "19px",
    fontSize: "14px",
    color: active ? "#32353A" : completed ? "#fff" : "#D9D9D9",
    backgroundColor: active ? "white" : completed ? "#FF843F" : "white",
    borderRadius: "50%",
    border: active ? "1px solid #32353A" : completed ? "1px solid #FF843F" : "1px solid #D9D9D9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "400",
    lineHeight: "19.07px",
    fontFamily: "Open Sans",
    boxShadow: "0px 3px 8px 0px #00000033",
    padding: "10px"
  };
  return (
    <div style={iconStyle}>{icon}</div>
  );
};

const ColoredStepConnector = withStyles({
  active: {
    "& $line": {
      borderColor: "#32353A",
      position: "relative",
      top: "4px"
    },
  },
  completed: {
    "& $line": {
      borderColor: "#FF843F",
      position: "relative",
      top: "4px"
    },
  },
  line: {
    borderColor: "#D9D9D9",
    width: "80px",
    position: "relative",
    top: "4px",
    borderBottomWidth: 1.5,
    borderRadius: 1,
  },
})(StepConnector);

const ProjectOnboardingStepper = ({ step }: IOnboardingProps) => {

  useSignals()

  const STEPS = [
    "Project Details",
    "Project Hierachy",
    "BIM",
    "Add Users",
    "Review"
  ]

  return (

    <>
      <Stepper activeStep={step.value} alternativeLabel 
        style={{ width: "770px", margin: "0 auto", }} connector={<ColoredStepConnector />}>

        {STEPS?.map((label: any, index: any) => (
          
          <Step key={label} >
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Typography style={{ fontFamily: "Open Sans", fontSize: "13px", lineHeight: "20px", fontWeight: "400" }}
                className={`${step.value === index ? "text-[#000000]" : step.value > index ? "text-[#000000]" : "text-[#D9D9D9]"
                  }`}>{label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>

  )
}

export default ProjectOnboardingStepper