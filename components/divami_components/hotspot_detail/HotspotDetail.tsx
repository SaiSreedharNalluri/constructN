import {
  ArrowIcon,
  BodyContainer,
  CustomHotspotDrawerContainer,
  HeaderContainer,
  LeftTitleCont,
  SpanTile,
  TitleContainer,
} from "./HotspotDetailStyles";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
import React, { useEffect, useState } from "react";
import { BasicTabs } from "./TabsDetail";

const CustomHotspotDetailsDrawer = (props: any) => {
  const { onClose } = props;
  const [footerState, SetFooterState] = useState(false);
  return (
    <>
      <CustomHotspotDrawerContainer>
        <HeaderContainer>
          <TitleContainer>
            <LeftTitleCont>
              {" "}
              <ArrowIcon
                onClick={() => {
                  onClose(true);
                }}
                onTouchEnd={() => {
                  onClose(true);
                }}
                src={BackArrow}
                alt={"close icon"}
              />
              <SpanTile>
                {/* {selectedIssue?.type} (#{selectedIssue?.sequenceNumber}) */}
                Progress Hotspot
              </SpanTile>
            </LeftTitleCont>
            {/* hello */}
          </TitleContainer>
        </HeaderContainer>
        <BodyContainer footerState={footerState}>
          <BasicTabs />
        </BodyContainer>
      </CustomHotspotDrawerContainer>
    </>
  );
};

export default CustomHotspotDetailsDrawer;
