import React from "react";
// import phoneImage from "../../../../../public/divami_icons/phoneImage.svg";
import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import hotspotImg from "../../../public/divami_icons/hotspotImg.svg";
import videoWalk from "../../../public/divami_icons/videoWalk.svg";
import lidarScan from "../../../public/divami_icons/lidarScan.svg";

import {
  ArrowIcon,
  CaptureModeFirstChild,
  CaptureModeFourthChild,
  CaptureModeParent,
  CaptureModeSecondChild,
  BlockElem,
  SymbolContainer,
  CaptureModeThirdChild,
} from "./CaptureModeStyles";

const CaptureMode = () => {
  return (
    <CaptureModeParent>
      <CaptureModeFirstChild>
        <BlockElem>
          <ArrowIcon src={phoneImage} alt={"close icon"} />
        </BlockElem>
        <SymbolContainer>
          <BlockElem>109</BlockElem>
        </SymbolContainer>
      </CaptureModeFirstChild>

      <CaptureModeSecondChild>
        <BlockElem>
          <ArrowIcon src={hotspotImg} alt={"close icon"} />
        </BlockElem>
        <SymbolContainer>
          <BlockElem>109</BlockElem>
        </SymbolContainer>
      </CaptureModeSecondChild>

      <CaptureModeThirdChild>
        <BlockElem>
          <ArrowIcon src={videoWalk} alt={"close icon"} />
        </BlockElem>
        <SymbolContainer>
          <BlockElem>109</BlockElem>
        </SymbolContainer>
      </CaptureModeThirdChild>

      <CaptureModeFourthChild>
        <BlockElem>
          <ArrowIcon src={lidarScan} alt={"close icon"} />
        </BlockElem>
        <SymbolContainer>
          <BlockElem>109</BlockElem>
        </SymbolContainer>
      </CaptureModeFourthChild>
    </CaptureModeParent>
  );
};

export default CaptureMode;
