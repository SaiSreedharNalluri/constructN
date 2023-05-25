import React from "react";
// import phoneImage from "../../../../../public/divami_icons/phoneImage.svg";
import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import hotspotImg from "../../../public/divami_icons/hotspotImg.svg";
import videoWalk from "../../../public/divami_icons/videoWalk.svg";
import lidarScan from "../../../public/divami_icons/lidarScan.svg";

import {
  ArrowIcon,
  PhoneImgCount,
  LidarScanCount,
  CaptureModeParent,
  HotspotImgCount,
  CountElem,
  SymbolContainer,
  VideoWalkCount,
} from "./CaptureModeStyles";

const CaptureMode = () => {
  return (
    <CaptureModeParent>
      <PhoneImgCount>
        <CountElem>
          <ArrowIcon src={phoneImage} alt={"close icon"} />
        </CountElem>
        <SymbolContainer>
          <CountElem>109</CountElem>
        </SymbolContainer>
      </PhoneImgCount>

      <HotspotImgCount>
        <CountElem>
          <ArrowIcon src={hotspotImg} alt={"close icon"} />
        </CountElem>
        <SymbolContainer>
          <CountElem>109</CountElem>
        </SymbolContainer>
      </HotspotImgCount>

      <VideoWalkCount>
        <CountElem>
          <ArrowIcon src={videoWalk} alt={"close icon"} />
        </CountElem>
        <SymbolContainer>
          <CountElem>109</CountElem>
        </SymbolContainer>
      </VideoWalkCount>

      <LidarScanCount>
        <CountElem>
          <ArrowIcon src={lidarScan} alt={"close icon"} />
        </CountElem>
        <SymbolContainer>
          <CountElem>109</CountElem>
        </SymbolContainer>
      </LidarScanCount>
    </CaptureModeParent>
  );
};

export default CaptureMode;
