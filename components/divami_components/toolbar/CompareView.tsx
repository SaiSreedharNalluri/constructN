import React, { useState } from "react";
// import styles from '../toolbar/toolbar.module.css'
import Image from "next/image";
import eyeOffIcon from "../../../public/public/divami_icons/eyeOffIcon.svg";
import groupSpotIcon from "../../../public/divami_icons/groupSpotIcon.svg";
import hotspotCircleIcon from "../../../public/divami_icons/hotspotCircleIcon.svg";
import hideCompare from "../../../public/divami_icons/hideCompare.svg";
import designCompare from "../../../public/divami_icons/designCompare.svg";
import realityCompare from "../../../public/divami_icons/realityCompare.svg";

import {
  HotspotBox,
  HotspotTitleDiv,
  HotspotSectionFileTextImg,
  HotspotCircleDiv,
  HotspotGroupIcon,
  CompareViewBox,
  CompareViewTitleDiv,
  DesignCompareViewIcon,
  RealityCompareViewIcon,
  CompareContainer,
  CompareIcon,
} from "./ToolBarStyles";

const CompareView = ({ rightMenuClickHandler, active }: any) => {
  return (
    <CompareViewBox>
      <CompareViewTitleDiv>Compare Views:</CompareViewTitleDiv>
      <CompareContainer>
        <CompareIcon
          id="hideCompare"
          onClick={rightMenuClickHandler}
          active={active}
        >
          <Image src={hideCompare} width={18} height={18} alt="Arrow" />{" "}
        </CompareIcon>
        <DesignCompareViewIcon
          id="compareDesign"
          onClick={(e) => {
            rightMenuClickHandler(e);
          }}
          active={active}
        >
          <Image src={designCompare} width={18} height={18} alt="Arrow" />{" "}
        </DesignCompareViewIcon>

        <RealityCompareViewIcon
          id="compareReality"
          onClick={rightMenuClickHandler}
          active={active}
        >
          <Image src={realityCompare} width={14} height={18} alt="Arrow" />{" "}
        </RealityCompareViewIcon>
      </CompareContainer>
      <HotspotGroupIcon>
        <Image src={groupSpotIcon} width={12} height={12} alt="Arrow" />{" "}
      </HotspotGroupIcon>
    </CompareViewBox>
  );
};

export default CompareView;
