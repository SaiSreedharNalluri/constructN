import React from "react";
import { Button } from "@mui/material";
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

  const renderButtons = () => {
    switch (state.step) {
      case UploaderStep.Details:
        return (
          <>
           <p className="font-sans non-italic font-normal text-lg">
              Contact us at{" "}
              <a href="mailto:support@constructn.ai" style={{ color: "#F1742E" }}>
                support@constructn.ai
              </a>{" "}
              if you need to add a new level
            </p>
            
          <Button 
            disabled={state.step === UploaderStep.Details}
            onClick={() => uploaderAction.goBack()} 
            className={`${backbuttonStyle} text-orange-500 border border-solid rounded-md`}>
            Go Back
          </Button>
          <Button
            disabled={!state.isNextEnabled}
            onClick={() => uploaderAction.next()}
            className={`${nextButtonStyle} bg-orange-500 text-white border border-solid rounded-md`}>
              
            Continue
          </Button>
          </>
        );
      case UploaderStep.ChooseFiles:
        return (
          <>
          <Button   
            onClick={() => uploaderAction.goBack()}
            className={`${backbuttonStyle} text-orange-500 border border-solid rounded-md`}>
            Go Back
          </Button>
          <Button
            disabled={!state.isNextEnabled}
            onClick={() => uploaderAction.next()}
            className={`${nextButtonStyle} bg-orange-500 text-white border border-solid rounded-md`}>
            Confrim Images
          </Button>
          </>
        );
      case UploaderStep.ChooseGCPs:
        return (
          <>
          <Button 
            onClick={() => uploaderAction.goBack()} 
            className={`${backbuttonStyle} text-orange-500 border border-solid rounded-md`}>
            Go Back
          </Button>
          <Button
            onClick={() => uploaderAction.skipGCP()} 
            className={`${nextButtonStyle} bg-orange-500 text-white border border-solid rounded-md`}>
            Skip Gcps
          </Button>
          <Button
          disabled={!state.isNextEnabled}
            onClick={() => uploaderAction.next()}
            className={`${nextButtonStyle} bg-orange-500 text-white border border-solid rounded-md`}>
              Continue
          </Button>
          </>
        );
      case UploaderStep.Review:
        return (
          <>
          <Button 
            onClick={() => uploaderAction.goBack()} 
            className={`${backbuttonStyle} text-orange-500 border border-solid rounded-md`}>
          Go Back
          </Button>
          <Button
            onClick={() => uploaderAction.next()}
            className={`${nextButtonStyle} bg-orange-500 text-white border border-solid rounded-md`}>
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
        <div style={textContainerStyle}></div>
          <div style={buttonContainerStyle}>
    {renderButtons()}
    
    </div>
    </div>
    </div>;
};

export default UploaderFooter;
