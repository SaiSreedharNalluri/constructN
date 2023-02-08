import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBarsStaggered,
  faBreadSlice,
  faCalendarDays,
  faCog,
  faGreaterThan,
  faMap,
  faTachometerAltAverage,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import dashboard from "../../public/icons/dashboard.svg";
import viewer from "../../public/icons/leftPanelIcon2.svg";
import schedule from "../../public/icons/schedule.svg";
import settings from "../../public/icons/settings.svg";
import Image from "next/image";
import dashboardProgress from "../../../public/divami_icons/dashboardProgress.svg";
import issuesIcon from "../../../public/divami_icons/issuesIcon.svg";
import taskIcon from "../../../public/divami_icons/taskIcon.svg";

import drawingInactive from "../../../public/divami_icons/drawingInactive.svg";

import drawing from "../../../public/divami_icons/drawing.svg";
// import task from "../../../public/divami_icons/task.svg";

import issues from "../../../public/divami_icons/issues.svg";

import tasks from "../../../public/divami_icons/tasks.svg";

import branch from "../../../public/divami_icons/branch.svg";
import people from "../../../public/divami_icons/people.svg";
import calendar from "../../../public/divami_icons/calendar.svg";

import {
    HighlightedSytledImage,
  SideMenuContainer,
  SideMenuOption,
  SideMenuOptionContainer,
  SideMenuOptionImageContainer,
  StyledImage,
} from "./SidePanelStyles";
interface IProps {
    onChangeData: () => void;
}
const SidePanelMenu: React.FC<IProps> = ({ onChangeData }) => {
  const [config, setConfig] = React.useState([
    {
      id: "dashboard",
      label: "dashboardProgress",
      icon: dashboardProgress,
      activeIcon: dashboardProgress,
      isActive: false,
      nextPage: "",
    },
    {
      id: "drawing",

      label: "drawing",
      icon: drawingInactive,
      activeIcon: drawing,
      isActive: true,
      nextPage: "",
    },
    {
      id: "issues",

      label: "issues",
      icon: issuesIcon,
      activeIcon: issuesIcon,
      isActive: false,
      nextPage: "",
    },
    {
      id: "structure",
      label: "tasks",
      icon: tasks,
      activeIcon: tasks,
      isActive: false,
      nextPage: "",
    },
    {
      id: "schedule",

      label: "calendar",
      icon: calendar,
      activeIcon: calendar,
      isActive: false,
    },
    {
      id: "branch",

      label: "branch",
      icon: branch,
      activeIcon: branch,
      isActive: false,
    },
    {
      id: "settings",

      label: "settings",
      icon: people,
      isActive: false,
      activeIcon: people,
    },
  ]);

  const handleClick = (item: any) => {
    setConfig((prev) =>
      prev.map((data) => {
        if (data?.label === item?.label) {
          return {
            ...data,
            isActive: item?.isActive ? false : true,
          };
        } else {
          return {
            ...data,
            isActive: false,
          };
        }
      })
    );
  };

  const router = useRouter();
  const [active, setActive] = useState(router.pathname.split("/").pop());

  const leftClickHandler = (e: any) => {
    console.log("e", e.currentTarget.id);
    switch (e.currentTarget.id) {
      case "dashboard":
        router.push(`/projects/${router.query.projectId as string}/dashboard`);
        break;
      case "views":
        router.push(`/projects/${router.query.projectId as string}/structure`);
        break;
      case "issues":
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
      default:
        router.push(`/projects/${router.query.projectId as string}/structure`);
    }
    setActive(router.pathname.split("/").pop());
  };

  return (
    <SideMenuContainer>
      {config.map((item, index) => (
        <SideMenuOptionContainer key={index}>
          <SideMenuOption
            onClick={() =>
              item.label === "drawing" ? handleClick(item) : null
            }
          >
            <SideMenuOptionImageContainer>
              {item.isActive ? (
                <HighlightedSytledImage
                  src={item.activeIcon}
                  alt={item.label}
                  id={item.id}
                  onClick={leftClickHandler}
                />
              ) : (
                <StyledImage
                  src={item.icon}
                  alt={item.label}
                  id={item.id}
                  onClick={leftClickHandler}
                />
              )}
              {/* <StyledImage
                onClick={leftClickHandler}
                src={item.icon}
                alt={item.label}
                id={item.id}
              /> */}
            </SideMenuOptionImageContainer>
          </SideMenuOption>
        </SideMenuOptionContainer>
      ))}
    </SideMenuContainer>
  );
};

export default SidePanelMenu;
