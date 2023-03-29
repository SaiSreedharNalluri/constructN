import React, { useEffect, useState } from "react";
// import styles from '../toolbar/toolbar.module.css'
import Image from "next/image";
import eyeOffIcon from "../../../public/public/divami_icons/eyeOffIcon.svg";
import groupSpotIcon from "../../../public/divami_icons/groupSpotIcon.svg";
import hotspotCircleIcon from "../../../public/divami_icons/hotspotCircleIcon.svg";
import hideCompare from "../../../public/divami_icons/hideCompare.svg";
import designCompare from "../../../public/divami_icons/designCompare.svg";
import realityCompare from "../../../public/divami_icons/realityCompare.svg";
import hideCompareLight from "../../../public/divami_icons/hideCompareLight.svg";
import designCompareLight from "../../../public/divami_icons/designCompareLight.svg";
import realityCompareLight from "../../../public/divami_icons/realityCompareLight.svg";
import Tooltip from "@mui/material/Tooltip";

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
import { styled } from "@mui/system";

const CompareView = ({
  rightMenuClickHandler,
  active,
  designMap,
  selectedType = "",
  setActive,
}: any) => {
  useEffect(() => {
    setActive("hideCompare");
  }, [selectedType]);
  return (
    <CompareViewBox>
      <CompareViewTitleDiv>Compare Views:</CompareViewTitleDiv>
      <CompareContainer>
        <Tooltip title="Hide Compare">
          <CompareIcon
            id="hideCompare"
            onClick={rightMenuClickHandler}
            active={active}
          >
            <Image
              src={active === "hideCompare" ? hideCompare : hideCompareLight}
              width={18}
              height={18}
              alt="Arrow"
            />{" "}
          </CompareIcon>
        </Tooltip>
        {designMap && selectedType !== "orthoPhoto" ? (
          <Tooltip title="Compare Design">
            <DesignCompareViewIcon
              id="compareDesign"
              onClick={(e: any) => {
                rightMenuClickHandler(e);
              }}
              active={active}
            >
              <Image
                src={
                  active === "compareDesign"
                    ? designCompare
                    : designCompareLight
                }
                width={18}
                height={18}
                alt="Arrow"
              />{" "}
            </DesignCompareViewIcon>
          </Tooltip>
        ) : (
          <></>
        )}
        <Tooltip title="Compare Reality">
          <RealityCompareViewIcon
            id="compareReality"
            onClick={rightMenuClickHandler}
            active={active}
          >
            <Image
              src={
                active === "compareReality"
                  ? realityCompare
                  : realityCompareLight
              }
              width={14}
              height={18}
              alt="Arrow"
            />{" "}
          </RealityCompareViewIcon>
        </Tooltip>
      </CompareContainer>
      {/* <HotspotGroupIcon>
        <Image src={groupSpotIcon} width={12} height={12} alt="Arrow" />{" "}
      </HotspotGroupIcon> */}
    </CompareViewBox>
  );
};

export default CompareView;
