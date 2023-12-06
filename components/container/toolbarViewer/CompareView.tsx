import React, { useEffect, useImperativeHandle, useState, Ref, forwardRef } from "react";
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
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
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
import { IToolbarAction } from "../../../models/ITools";
export type designToolHandle = {
  handleDesignRef: (designInstance: any) => void;
}

const CompareView = ({
  rightMenuClickHandler,
  active,
  designMap,
  selectedType = "",
  setActive,
  issueMenuClicked
}: any, ref: Ref<designToolHandle>) => {
  const customLogger = new CustomLoggerClass();
  const [isDesignAvailable, setDesignAvailable] = useState(false)
  // useEffect(() => {
  //   setActive("hideCompare");
  // }, [selectedType]);
  const designAvailableUpdate = (e: boolean) => {
    setDesignAvailable(e)
  }

  useImperativeHandle(ref, () => {
    return {
      handleDesignRef(designs: any) {
        if (designs?.designs.length >= 1) {
          designAvailableUpdate(true)
        }

      }
    }
  })
  return (
    <CompareViewBox>
      <CompareViewTitleDiv>Compare Views:</CompareViewTitleDiv>
      <CompareContainer>
        <Tooltip title="Hide Compare">
          <CompareIcon
            id="hideCompare"
            onClick={(e: any) => {
              let IssuetoolInstance: IToolbarAction = { type: "setCompareMode", data: "noCompare" }
              issueMenuClicked(IssuetoolInstance)
              customLogger.logInfo("ToolBar - No Compare");
              // rightMenuClickHandler(e)
            }}
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
        {/* {!designMap && selectedType !== "orthoPhoto" ? ( */}
        <Tooltip title={isDesignAvailable ? "Compare Design" : "No Design"}>
          <DesignCompareViewIcon
            id="compareDesign"
            onClick={(e: any) => {
              if (isDesignAvailable)
              {
              let IssuetoolInstance: IToolbarAction = { type: "setCompareMode", data: "compareDesign" }
              issueMenuClicked(IssuetoolInstance)
                customLogger.logInfo("ToolBar - Compare Design");
              // rightMenuClickHandler(e);
              }
            }}
            isDesignAvailable={isDesignAvailable}
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
        {/* ) : ( */}
        {/* <></> */}
        {/* )} */}
        <Tooltip title="Compare Reality">
          <RealityCompareViewIcon
            id="compareReality"
            onClick={(e: any) => { 
              let IssuetoolInstance: IToolbarAction = { type:"setCompareMode", data:"compareReality"}
              issueMenuClicked(IssuetoolInstance)
              customLogger.logInfo("ToolBar - Compare Reality"); 
              // rightMenuClickHandler(e) 
            }}
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

export default forwardRef(CompareView);
