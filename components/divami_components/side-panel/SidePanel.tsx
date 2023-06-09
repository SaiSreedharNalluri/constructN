import { useRouter } from "next/router";
import React, { useState } from "react";
import dashboardProgress from "../../../public/divami_icons/dashboardProgress.svg";
import dashboardProgressHighlight from "../../../public/divami_icons/dashboardProgressHighlight.svg";

import issuesIcon from "../../../public/divami_icons/issuesIcon.svg";
import drawingInactive from "../../../public/divami_icons/drawingInactive.svg";
import IssuesHighlightedIcon from "../../../public/divami_icons/IssuesHighlightedIcon.svg";

import drawing from "../../../public/divami_icons/drawing.svg";
// import task from "../../../public/divami_icons/task.svg";
import tasks from "../../../public/divami_icons/tasks.svg";
import tasksHighlighted from "../../../public/divami_icons/tasksHighlighted.svg";
import branchHighlighted from "../../../public/divami_icons/branchHighlightedIcon.svg";
import userIcon from "../../../public/divami_icons/userIcon.svg";
import userHighlighted from "../../../public/divami_icons/userHighlighted.svg";

// tasksHighlighted
import branch from "../../../public/divami_icons/branch.svg";
import calendar from "../../../public/divami_icons/calendarIcon.svg";
import calendarHighlighted from "../../../public/divami_icons/calendarHighlightedIcon.svg";

import usersSelected from "../../../public/divami_icons/usersSelectionIcon.svg";
import usersUnselected from "../../../public/divami_icons/usersUnselectedIcon.svg";

import people from "../../../public/divami_icons/people.svg";
import peopleHighlighted from "../../../public/divami_icons/peopleHighlighted.svg";
import ScheduleIcon from "../../../public/divami_icons/ScheduleIcon.svg";
import ScheduleHighlight from "../../../public/divami_icons/ScheduleHighlight.svg";

import {
  HighlightedSytledImage,
  OvershowImg,
  SideMenuContainer,
  SideMenuOption,
  SideMenuOptionContainer,
  SideMenuOptionImageContainer,
  StyledImage,
  TooltipText,
} from "./SidePanelStyles";
import { Tooltip } from "@mui/material";
interface IProps {
  onChangeData: () => void;
}
const SidePanelMenu: React.FC<IProps> = ({ onChangeData }) => {
  const [config, setConfig] = React.useState([
    {
      id: "dashboard",
      icon: dashboardProgress,
      activeIcon: dashboardProgressHighlight,
      isActive: false,
      nextPage: "",
      toolTipMsg: "Dashboard & Reports",
    },
    {
      id: "structure",
      icon: drawing,
      activeIcon: drawingInactive,
      isActive: false,
      nextPage: "",
      toolTipMsg: "Drawings",
    },

    {
      id: "schedule",
      icon: calendar,
      activeIcon: calendarHighlighted,
      isActive: false,
      toolTipMsg: "Schedule",
    },
    {
      id: "usersList",
      icon: usersUnselected,
      activeIcon: usersSelected,
      isActive: false,
      toolTipMsg: "Users",
    },
    {
      id: "sections",
      icon: ScheduleIcon,
      activeIcon: ScheduleHighlight,
      isActive: false,
      toolTipMsg: "Sections",
    },

    {
      id: "settings",
      icon: people,
      isActive: false,
      activeIcon: peopleHighlighted,
      toolTipMsg: "Settings",
    },
  ]);

  // const handleClick = (id: any) => {
  //   setConfig((prevConfig) =>
  //     prevConfig.map((item) =>
  //       item.id === id
  //         ? { ...item, isActive: true }
  //         : { ...item, isActive: false }
  //     )
  //   );
  // };

  const router = useRouter();
  const [active, setActive] = useState(router.pathname.split("/").pop());

  // const currentUrl = window.location.href;
  // const urlString = currentUrl.split("/")[5];
  // console.log(currentUrl);

  const leftClickHandler = (e: any) => {
    switch (e.currentTarget.id) {
      case "dashboard":
        router.push(`/projects/${router.query.projectId as string}/dashboard`);

        break;
      case "views":

      case "structure":
        router.push(`/projects/${router.query.projectId as string}/structure`);

        break;
      case "issue":
        router.push(`/projects/${router.query.projectId as string}/issue`);
        break;
      case "schedule":
        router.push(`/projects/${router.query.projectId as string}/schedule`);
        break;
      case "lineChart":
        router.push(`/projects/${router.query.projectId as string}/lineChart`);
        break;
      case "settings":
        router.push(`/projects/${router.query.projectId as string}/settings`);
        break;
      case "tasks":
        router.push(`/projects/${router.query.projectId as string}/tasks`);
        break;
      case "sections":
        router.push(`/projects/${router.query.projectId as string}/sections`);
        break;

      case "usersList":
        router.push(`/projects/${router.query.projectId as string}/usersList`);
        break;
      default:
        router.push(`/projects/${router.query.projectId as string}/structure`);
    }
    setActive(router.pathname.split("/").pop());
  };

  return (
    <SideMenuContainer data-testid="const-custom-sidepanel">
      {config.map((item, index) => (
        <SideMenuOptionContainer key={index}>
          <SideMenuOption
          // onClick={() =>
          //   item.label === "settings" ? handleClick(item) : null
          // }
          // onClick={() => handleClick(item.id)}
          >
            <TooltipText title={item.toolTipMsg} placement="right">
              <SideMenuOptionImageContainer>
                {router.pathname.includes(item.id) ? (
                  <OvershowImg>
                    <HighlightedSytledImage
                      src={item.activeIcon}
                      alt={item.id}
                      id={item.id}
                      onClick={leftClickHandler}
                    />
                  </OvershowImg>
                ) : (
                  <StyledImage
                    src={item.icon}
                    alt={item.id}
                    id={item.id}
                    onClick={leftClickHandler}
                  />
                )}
              </SideMenuOptionImageContainer>
            </TooltipText>
          </SideMenuOption>
        </SideMenuOptionContainer>
      ))}
    </SideMenuContainer>
  );
};

export default SidePanelMenu;
