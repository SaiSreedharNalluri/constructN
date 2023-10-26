import React from "react";
import { Button } from "@mui/material";

interface IProps{
    activeStep:any,
    steps:any,
    handleNext:any,
    handleBack:any,
}
const Buttons : React.FC<IProps> =({ activeStep, steps, handleNext, handleBack }) => {
  const nextButtonStyle = {
    background: "#f1742e",
    color: "white",
  };

  const backButtonStyle = {
    border: "2px solid #f1742e",
    color: "#f1742e",
  };

  return (
    <div className=" calc-w  fixed bottom-0 mx-40 bg-gray p-3 flex justify-center mt-3">
      <div>
       <Button
        disabled={activeStep === 0}
        onClick={handleBack}
        style={backButtonStyle}
        size="small"
        className="mr-2"
      >
        Go Back
      </Button>
      <Button
        disabled={activeStep === steps.length - 1}
        onClick={handleNext}
        style={nextButtonStyle}
        size="small"
      >
        Next
      </Button>
      </div>
    </div>
  );
};

export default Buttons;
