import React, { useEffect, useState } from "react";
// import styles from '../toolbar/toolbar.module.css'
import Image from "next/image";
import eyeOffIcon from "../../../public/public/divami_icons/eyeOffIcon.svg";
import groupSpotIcon from "../../../public/divami_icons/groupSpotIcon.svg";
import hotspotCircleIcon from "../../../public/divami_icons/hotspotCircleIcon.svg";
import plusCircleIcon from "../../../public/divami_icons/plusCircleIcon.svg";
import fileTextIcon from "../../../public/divami_icons/fileTextIcon.svg";

import {
  HotspotBox,
  HotspotTitleDiv,
  HotspotSectionFileTextImg,
  HotspotCircleDiv,
  HotspotGroupIcon,
  GroupIcon,
  CameraIcon,
  // hotspotMenuClicked,
} from "./ToolBarStyles";
import { Drawer, Tooltip } from "@mui/material";
import CustomHotspotListDrawer from "../../divami_components/hotspot-listing/HotspotList";
import { ITools } from "../../../models/ITools";

const Hotspot = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  let hotspotMenuInstance: ITools = { toolName: "hotspot", toolAction: "" };

  const handleViewTaskList = () => {
    // console.log("teskssksk trigg");
    setOpenDrawer(true);
  };

  const openHotspotCreateFn = () => {
    hotspotMenuInstance.toolAction = "issueCreate";
    // hotspotMenuClicked(hotspotMenuInstance);
  };

  return (
    <>
      <HotspotBox>
        <HotspotTitleDiv>Hotspot:</HotspotTitleDiv>
        <Tooltip title="Create Issue">
          <HotspotSectionFileTextImg>
            <CameraIcon
              src={plusCircleIcon}
              alt="Arrow"
              onClick={() => {
                openHotspotCreateFn();
              }}
              onTouchEnd={() => {
                openHotspotCreateFn();
              }}
              width={12}
              height={12}
            />
          </HotspotSectionFileTextImg>
        </Tooltip>
        <Tooltip title="Hotspot List">
          <HotspotSectionFileTextImg>
            {/* <Image src={fileTextIcon} width={12} height={12} alt="Arrow" />{" "} */}
            <CameraIcon
              src={fileTextIcon}
              alt="Arrow"
              onClick={() => {
                // openIssueListFn();
                handleViewTaskList();
              }}
              onTouchEnd={() => {
                // openIssueListFn();
                handleViewTaskList();
              }}
              width={12}
              height={12}
            />
          </HotspotSectionFileTextImg>
        </Tooltip>
        <HotspotCircleDiv>
          <CameraIcon
            src={hotspotCircleIcon}
            alt="Arrow"
            // onClick={rightMenuClickHandler}

            width={12}
            height={12}
          />
          {/* <Image src={hotspotCircleIcon} width={12} height={12} alt="Arrow" />{" "} */}
        </HotspotCircleDiv>

        {/* <HotspotGroupIcon>
          <GroupIcon src={groupSpotIcon} alt="Arrow" />
          <Image src={groupSpotIcon} width={12} height={12} alt="Arrow" />{" "}
        </HotspotGroupIcon> */}
      </HotspotBox>

      {openDrawer && (
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => setOpenDrawer((prev: any) => !prev)}
        >
          <CustomHotspotListDrawer
            onClose={() => setOpenDrawer((prev: any) => !prev)}
          />
          {/* <FilterCommon/> */}
        </Drawer>
      )}
    </>
  );
};

export default Hotspot;
