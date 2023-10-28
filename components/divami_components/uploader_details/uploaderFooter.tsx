import React from "react";
import { Button } from "@mui/material";

interface IProps{
    activeStep:any,
    steps:any,
    handleNext:any,
    handleBack:any,
    isDateSelected: boolean;
}
const UploaderFooter : React.FC<IProps> =({ activeStep, steps, handleNext, handleBack,isDateSelected,}) => {

  const containerStyle: React.CSSProperties = {
    
    position: "absolute",
    bottom: 0,
    left: -16,
    width: "100%",
    backgroundColor: "transparent",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
 const textContainerStyle: React.CSSProperties = {
    flex: 1,
    marginLeft: "30px",
    marginTop: "20px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    alignItems:"start",
  };
  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "left",
    gap: "8px",
    justifyContent:"space-between",
  };
  const nextButtonStyle = {
    display:"flex",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    padding:"8px 8px 8px 7px",
    gap:"10px",
    width:"77px",
    height:"35px",
    border: "1px solid #F1742E",
    backgroundColor:"#F1742E",
    boxSizing: "border-box",
    borderRadius:"4px",
    fontFamily:"Open Sans",
    fontStyle:"normal",
    fontWeight:"600",
    fontSize:"14px",
    lineHeight:"19px",
    color:"#F1742E",
    order:"1",
    
  };

  const backbuttonStyle = {
    fontFamily: "Open Sans",
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "19px",
    textAlign: "center",
    color: "#F1742E",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: '8px',
    gap: "4px",
    width: "71px",
    height: "35px",
    order:"0",
  };
  
  return (
    <div>
       {isDateSelected ? (
        <div style={containerStyle}>
        <div style={textContainerStyle}>
        <p className="font-sans non-italic font-normal text-lg">
              Contact us at{" "}
              <a href="mailto:support@constructn.ai" style={{ color: "#F1742E" }}>
                support@constructn.ai
              </a>{" "}
              if you need to add a new level
            </p>
        </div>
        <div style={buttonContainerStyle}>    
       <Button
        disabled={activeStep === 0}
        onClick={handleBack}
        className={`${backbuttonStyle} text-orange-500 border border-solid rounded-md`}
        
      >
        Go Back
      </Button>
      <Button
        disabled={activeStep === steps.length - 1}
        onClick={handleNext}
        className={`${nextButtonStyle} bg-orange-500 text-white border border-solid rounded-md`} 
      >
      Continue
      </Button>
      </div>
      </div>
      ):(<p></p>)}
    </div>
    
  );
};

export default  UploaderFooter;
