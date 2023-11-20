import React from "react";
import { Button, LinearProgress } from "@mui/material";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { UploaderStep } from "../../../state/uploaderState/state";
import { backbuttonStyle, nextButtonStyle } from "./uploaderStyles";

// interface IProps {
//   currentStep:any
//   isEnabled:any
// }

const UploaderFooter: React.FC<any> = ({  }) => {
  const { state, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;

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
    marginLeft: "0px",
    marginTop: "px",
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
  const progressContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  };
  const linearProgressStyle: React.CSSProperties = {
    width: "50%", // Adjust the width as needed
    marginRight: "1rem",
  };

  const imageCountStyle: React.CSSProperties = {
    marginRight: "1rem",
  };

  const duplicateCountStyle: React.CSSProperties = {
    marginRight: "1rem",
  };

  const renderButtons = () => {
    switch (state.step) {
      case UploaderStep.Details:
        return (
          <>
          
          {/* <Button 
            disabled={state.step === UploaderStep.Details}
            onClick={() => uploaderAction.goBack()} 
            className={`${backbuttonStyle} text-[#F1742E] border border-solid rounded-[4px]`}>
            Go Back
          </Button> */}
          <Button
            disabled={!state.isNextEnabled}
            onClick={() => uploaderAction.next()}
            className={`${nextButtonStyle} bg-[#F1742E] text-white border border-solid rounded-[4px] hover:bg-[#F1742E]  hover:text-white`}>
              
            Continue
          </Button>
          </>
        );
      case UploaderStep.ChooseFiles:
        return (
          <>

          <Button   
            onClick={() => uploaderAction.goBack()}
            className={`${backbuttonStyle} text-[#F1742E] border border-solid rounded-[4px]`}>
            Go Back
          </Button>
          <Button
            disabled={!state.isNextEnabled}
            onClick={() => uploaderAction.next()}
            className={`${nextButtonStyle} bg-[#F1742E] text-white border border-solid rounded-[4px] hover:bg-[#F1742E] hover:text-white`}>
            Confirm Images
          </Button>
          </>
        );
      case UploaderStep.ChooseGCPs:
        return (
          <>
          <Button 
            onClick={() => uploaderAction.goBack()} 
            className={`${backbuttonStyle} text-[#F1742E] border border-solid rounded-[4px] `}>
            Go Back
          </Button>
          <Button
            onClick={() => uploaderAction.skipGCP()} 
            className={`${nextButtonStyle} bg-[#F1742E] text-white border border-solid rounded-[4px] hover:bg-[#F1742E] hover:text-white`}>
            Skip Gcps
          </Button>
          <Button
          disabled={!state.isNextEnabled}
            onClick={() => uploaderAction.next()}
            className={`${nextButtonStyle} bg-[#F1742E] text-white border border-solid rounded-[4px] hover:bg-[#F1742E] hover:text-white`}>
              Continue
          </Button>
          </>
        );
      case UploaderStep.Review:
        return (
          <>
          <Button 
            onClick={() => uploaderAction.goBack()} 
            className={`${backbuttonStyle} text-[#F1742E] border border-solid rounded-[4px]`}>
          Go Back
          </Button>
          <Button
            onClick={() =>{
              uploaderAction.changeUploadinitiate(true)
              // uploaderAction.next()
            }}
            className={`${nextButtonStyle} bg-[#F1742E] text-white border border-solid rounded-[4px] hover:bg-[#F1742E] hover:text-white`}>
            Upload
          </Button>
          </>
        );
      default:
        return null;
    }
  };

  return <div>
    <div style={containerStyle}>
    {state.step === UploaderStep.Details && (
          <div style={textContainerStyle}>
            <p className="font-sans non-italic font-normal text-lg">
              Contact us at{" "}
              <a href="mailto:support@constructn.ai" style={{ color: "#F1742E" }}>
                support@constructn.ai
              </a>{" "}
              if you need to add a new level
            </p>
          </div>
        )}
        {state.step === UploaderStep.ChooseFiles && state.choosenFiles.validFiles.length>0 && (
              
            <div style={progressContainerStyle} className="flex  rounded-[10px] items-center bg-[#FFECE2] p-2 w-[60%]">
              <LinearProgress
                variant="determinate"
                style={linearProgressStyle}
                value={(state.choosenFiles.validFiles.length / state.choosenFiles.validFiles.length) * 100}
              />
              <div style={imageCountStyle}>
                {state.choosenFiles.validFiles.length} images
              </div>
              <div style={duplicateCountStyle}>
                {state.choosenFiles.duplicateFiles.length} duplicates have been skipped
              </div>
              </div>
             
              )}
        <div style={textContainerStyle}></div>
       <div style={buttonContainerStyle}>
    {renderButtons()}
    
    </div>
    </div>
    </div>;
};

export default UploaderFooter;