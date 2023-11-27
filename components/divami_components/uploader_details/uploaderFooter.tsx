import React from "react";
import { Button, LinearProgress } from "@mui/material";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { UploaderStep } from "../../../state/uploaderState/state";
import { backbuttonStyle, nextButtonStyle } from "./uploaderStyles";
import { calculateTotalFileSize } from "../../../utils/utils";

// interface IProps {
//   currentStep:any
//   isEnabled:any
// }

const UploaderFooter: React.FC<any> = ({ }) => {
  const { state, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const containerStyle: React.CSSProperties = {
  //  bottom: 0,
    // left: -16,
    // width: "100%",
    // backgroundColor: "transparent",
    // padding: "1rem",
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
    alignItems: "start",
  };
  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "left",
    gap: "8px",
    justifyContent: "space-between",
  };
  const progressContainerStyle: React.CSSProperties = {
    // display: "flex",
    // alignItems: "center",
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
              className={`${nextButtonStyle} bg-[#F1742E] text-white border border-solid rounded-[4px] hover:bg-[#F1742E]  hover:text-white mr-[20px]`}>

              Continue
            </Button>
          </>
        );
      case UploaderStep.ChooseFiles:
        return (
          <>

            <Button
             disabled={ state.isReading}
              onClick={() => uploaderAction.goBack()}
              className={`${backbuttonStyle} text-[#F1742E] border border-solid rounded-[4px] `}>
              Go Back
            </Button>
            <Button
              disabled={!state.isNextEnabled || state.isReading}
              onClick={() => {uploaderAction.next()
              state.choosenFiles.duplicateFiles.length = 0
              state.choosenFiles.invalidEXIFFiles.length = 0}}
              className={`${nextButtonStyle} bg-[#F1742E] text-white border border-solid rounded-[4px] hover:bg-[#F1742E] hover:text-white mr-[20px]`}>
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
              className={`${nextButtonStyle} bg-[#F1742E] text-white border border-solid rounded-[4px] hover:bg-[#F1742E] hover:text-white mr-[20px]`}>
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
              onClick={() => {
                uploaderAction.changeUploadinitiate(true)
                // uploaderAction.next()
              }}
              className={`${nextButtonStyle} bg-[#F1742E] text-white border border-solid rounded-[4px] hover:bg-[#F1742E] hover:text-white mr-[20px]`}>
              Upload
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
  <React.Fragment>
    <div style={containerStyle}>
      <div>
      {state.step === UploaderStep.Details && (
        <div style={textContainerStyle}>
          <p className="font-sans non-italic font-normal text-lg ml-[60px]">
            Contact us at{" "}
            <a href="mailto:support@constructn.ai" style={{ color: "#F1742E" }}>
              support@constructn.ai
            </a>{" "}
            if you need to add a new level
          </p>
        </div>
      )}
      {state.step === UploaderStep.ChooseFiles && state.choosenFiles.validFiles.length > 0 && (
    <div style={progressContainerStyle} className="flex justify-evenly  rounded-[10px] items-center ml-[20px] bg-[#FFECE2] p-2  text-base">
          {
            state.isReading === true &&
            <div className="w-[300px] ">
            <LinearProgress
              color="warning"
              variant="indeterminate"
            />
            </div>
          }
         {
            state.choosenFiles.validFiles.length > 0 && (<div className="flex justify-evenly ml-[10px]">
               <div style={imageCountStyle}>
            <span className="text-[#F1742E]">{state.choosenFiles.validFiles.length}</span> images
          </div>
          <div style={imageCountStyle}>
            Total size is <span className="text-[#F1742E]">{calculateTotalFileSize(state.choosenFiles.validFiles)} </span>
          </div>
          <div>
          {
            state.choosenFiles.duplicateFiles.length > 0 && <div style={duplicateCountStyle}>
              <span className="text-[#F1742E]">{state.choosenFiles.duplicateFiles.length}</span> duplicates have been skipped
            </div>
          }
          </div>
            </div>)
          }
         
      </div>
      )}
       </div>
      <div style={buttonContainerStyle}>
        {renderButtons()}
      </div>
    </div>
  </React.Fragment>)
};

export default UploaderFooter;
