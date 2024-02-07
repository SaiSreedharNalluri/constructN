import React, { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { UploaderPopups, UploaderStep } from "../../../state/uploaderState/state";
import { backbuttonStyle, nextButtonStyle } from "./uploaderStyles";
import { calculateTotalFileSize } from "../../../utils/utils";
import  Warning  from "../../../public/divami_icons/Warning_Icon.svg";
import PopupComponent from "../../popupComponent/PopupComponent";

const UploaderFooter: React.FC<any> = ({ }) => {
  const { state, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const containerStyle: React.CSSProperties = {
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
  const imageCountStyle: React.CSSProperties = {
    marginRight: "1rem",
  };

  const duplicateCountStyle: React.CSSProperties = {
    marginRight: "1rem",
  };

  const renderButtons = () => {
    const discardButton = (
      <Button
        variant="text"
        onClick={() => {
          uploaderAction.setIsShowPopup({
            isShowPopup: true, 
            popupType: UploaderPopups.discard, 
          })
        }}
      >
        <p className="text-[#F1742E]">Discard</p>
      </Button>
    );
    switch (state.step) {
      case UploaderStep.Details:
        return (
          <>
          {discardButton}
            {/* <Button 
            disabled={state.step === UploaderStep.Details}
            onClick={() => uploaderAction.goBack()} 
            className={`${backbuttonStyle} text-[#F1742E] border border-solid rounded-[4px]`}>
            Go Back
          </Button> */}
            <Button
              disabled={!state.isNextEnabled}
              onClick={() => uploaderAction.next()}
              className={`   ${state.isNextEnabled ? "bg-[#F1742E]" : " bg-gray-400"} text-white hover:bg-[#F1742E]  rounded-[4px] mr-[20px]`}>

              <p className="text-white"> Continue</p>
            </Button>
          </>
        );
      case UploaderStep.ChooseFiles:
        return (
          <>
          {
            state.isReading === false && discardButton
          }
            <Button
              disabled={state.isReading}
              onClick={() => uploaderAction.goBack()}
              className={`${backbuttonStyle} text-[#F1742E] border border-solid rounded-[4px] `}>
              Go Back
            </Button>
            <Button
              disabled={!state.isNextEnabled || state.isReading}
              onClick={() => {
                uploaderAction.next()
              }}
              className={` ${state.isNextEnabled && !state.isReading ? "bg-[#F1742E]" : " bg-gray-400"}  text-white rounded-[4px] hover:bg-[#F1742E] hover:text-white mr-[20px]`}>
              <p className="text-white">   Confirm Images</p>
            </Button>
          </>
        );
      case UploaderStep.ChooseGCPs:
        return (
          <>
         {discardButton}
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
              className={` ${state.isNextEnabled ? "bg-[#F1742E]" : " bg-gray-400"}  text-white rounded-[4px] hover:bg-[#F1742E] hover:text-white mr-[20px]`}>
              <p className="text-white">Continue</p>
            </Button>
          </>
        );
      case UploaderStep.Review:
        return (
          <>
           {discardButton}
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
  const getDuplicateAndInvalidText = () => {
    let duplicateStr =
      state.choosenFiles.duplicateFiles.length > 0
        ? (
          <span>
          <span className="text-[#F1742E] mr-[2px]">
            {state.choosenFiles.duplicateFiles.length} 
          </span>
          duplicate
          </span>
        )
        : '';
    let invalidStr =
      state.choosenFiles.invalidEXIFFiles.length > 0
        ?  (
        <span>
          <span className="text-[#F1742E] mr-[2px]">
            {state.choosenFiles.invalidEXIFFiles.length} 
          </span>
          invalid
          </span>
        )
        : '';
       let finalString
    return (
      <div>
      {duplicateStr != '' || invalidStr !='' ?(<div>
        {duplicateStr} {invalidStr} file(s) have been skipped
      </div>):''}
      </div>
    );
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
            <div className="flex justify-evenly  rounded-[10px] items-center ml-[20px] bg-[#FFECE2] p-2  text-base">
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
                   <div style={duplicateCountStyle}>
                        {getDuplicateAndInvalidText()}
                      </div>
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
