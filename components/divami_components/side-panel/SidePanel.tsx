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

// tasksHighlighted
import branch from "../../../public/divami_icons/branch.svg";
import calendar from "../../../public/divami_icons/calendarIcon.svg";
import calendarHighlighted from "../../../public/divami_icons/calendarHighlightedIcon.svg";

import people from "../../../public/divami_icons/people.svg";
import peopleHighlighted from "../../../public/divami_icons/peopleHighlighted.svg";

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
      icon: dashboardProgress,
      activeIcon: dashboardProgressHighlight,
      isActive: false,
      nextPage: "",
    },
    {
      id: "structure",

      icon: drawing,
      activeIcon: drawingInactive,
      isActive: false,
      nextPage: "",
    },
    {
      id: "issue",

      icon: issuesIcon,
      activeIcon: IssuesHighlightedIcon,
      isActive: false,
      nextPage: "",
    },
    {
      id: "tasks",
      icon: tasks,
      activeIcon: tasksHighlighted,
      isActive: false,
      nextPage: "",
    },
    {
      id: "schedule",

      icon: calendar,
      activeIcon: calendarHighlighted,
      isActive: false,
    },
    {
      id: "lineChart",

      icon: branch,
      activeIcon: branchHighlighted,
      isActive: false,
    },
    {
      id: "settings",

      icon: people,
      isActive: false,
      activeIcon: peopleHighlighted,
    },
  ]);

  // const handleClick = (item: any) => {
  //   setConfig((prev) =>
  //     prev.map((data) => {
  //       onChangeData();
  //       if (data?.label === item?.label) {
  //         return {
  //           ...data,
  //           isActive: item?.isActive ? false : true,
  //         };
  //       } else {
  //         return {
  //           ...data,
  //           isActive: false,
  //         };
  //       }
  //     })
  //   );
  // };

  const handleClick = (id: any) => {
    setConfig((prevConfig) =>
      prevConfig.map((item) =>
        item.id === id
          ? { ...item, isActive: true }
          : { ...item, isActive: false }
      )
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
          //   item.label === "settings" ? handleClick(item) : null
          // }
          // onClick={() => handleClick(item.id)}
          >
            <SideMenuOptionImageContainer>
              {router.pathname.includes(item.id) ? (
                <HighlightedSytledImage
                  src={item.activeIcon}
                  alt={item.id}
                  id={item.id}
                  onClick={leftClickHandler}
                />
              ) : (
                <StyledImage
                  src={item.icon}
                  alt={item.id}
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
