import React from "react";
// import phoneImage from "../../../../../public/divami_icons/phoneImage.svg";
import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import hotspotImg from "../../../public/divami_icons/hotspotImg.svg";
import videoWalk from "../../../public/divami_icons/videoWalk.svg";
import lidarScan from "../../../public/divami_icons/lidarScan.svg";

import {
  ArrowIcon,
  FirstDiv,
  FourthDiv,
  ParentComp,
  SecondDiv,
  SpareDiv,
  SymbolMode,
  ThirdDiv,
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
          <ArrowIcon src={hotspotImg} alt={"close icon"} />
        </SpareDiv>
        <SymbolMode>
          <SpareDiv>109</SpareDiv>
        </SymbolMode>
      </SecondDiv>

      <ThirdDiv>
        <SpareDiv>
          <ArrowIcon src={videoWalk} alt={"close icon"} />
        </SpareDiv>
        <SymbolMode>
          <SpareDiv>109</SpareDiv>
        </SymbolMode>
      </ThirdDiv>

      <FourthDiv>
        <SpareDiv>
          <ArrowIcon src={lidarScan} alt={"close icon"} />
        </SpareDiv>
        <SymbolMode>
          <SpareDiv>109</SpareDiv>
        </SymbolMode>
      </FourthDiv>
    </ParentComp>
  );
};

export default CaptureMode;
