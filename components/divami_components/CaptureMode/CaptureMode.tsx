import React from "react";
// import phoneImage from "../../../../../public/divami_icons/phoneImage.svg";
import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import {
  ArrowIcon,
  FirstDiv,
  ParentComp,
  SecondDiv,
  SpareDiv,
  SymbolMode,
} from "./CaptureModeStyles";

const CaptureMode = () => {
  return (
    <ParentComp>
      <FirstDiv>
        <SpareDiv>
          <ArrowIcon src={phoneImage} alt={"close icon"} />
        </SpareDiv>
        <SymbolMode>
          <SpareDiv>109</SpareDiv>
        </SymbolMode>
      </FirstDiv>

      <SecondDiv>
        <SpareDiv>
          <ArrowIcon src={phoneImage} alt={"close icon"} />
        </SpareDiv>
        <SymbolMode>
          <SpareDiv>109</SpareDiv>
        </SymbolMode>
      </SecondDiv>
    </ParentComp>
  );
};

export default CaptureMode;
