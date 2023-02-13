import { useRouter } from "next/router";
import React, { useState } from "react";
import dashboardProgress from "../../../public/divami_icons/dashboardProgress.svg";
import issueHighlighted from "../../../public/divami_icons/issueHighlighted.svg";

import issuesIcon from "../../../public/divami_icons/issuesIcon.svg";
import drawingInactive from "../../../public/divami_icons/drawingInactive.svg";
import drawing from "../../../public/divami_icons/drawing.svg";
// import task from "../../../public/divami_icons/task.svg";
import tasks from "../../../public/divami_icons/tasks.svg";
import branch from "../../../public/divami_icons/branch.svg";
import calendar from "../../../public/divami_icons/calendar.svg";
import people from "../../../public/divami_icons/people.svg";
import { useLocation } from "react-router-dom";

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
      isActive: false,
      nextPage: "",
    },
    {
      id: "issues",

      label: "issues",
      icon: issuesIcon,
      activeIcon: issueHighlighted,
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
        onChangeData();
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

  // const currentUrl = window.location.href;
  // const urlString = currentUrl.split("/")[5];
  console.log("urlString",router);
  // console.log(currentUrl);

  const leftClickHandler = (e: any) => {

    console.log("e", e.currentTarget.id);
    switch (e.currentTarget.id) {
      case "dashboard":
        router.push(`/projects/${router.query.projectId as string}/dashboard`);
        break;
      case "views":
      case "drawing":
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
          // onClick={() =>
          //   item.label === "drawing" ? handleClick(item) : null
          // }
          >
            <SideMenuOptionImageContainer>
               {router.pathname.includes(item.id) ? (
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
            </SideMenuOptionImageContainer>
          </SideMenuOption>
        </SideMenuOptionContainer>
      ))}
    </SideMenuContainer>
  );
};

export default SidePanelMenu;
