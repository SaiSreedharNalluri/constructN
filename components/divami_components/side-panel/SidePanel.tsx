import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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

import chatOpen from "../../../public/divami_icons/chat_open.svg";
import chatClose from "../../../public/divami_icons/chat_close.svg";

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
import projectDetails from "../../../public/divami_icons/projectDetails.svg";
import projectDetailsHighlighted from "../../../public/divami_icons/projectDetailsHighlighted.svg";

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
import { getCookie } from "cookies-next";
interface IProps {
  onChangeData: () => void;
}
const SidePanelMenu: React.FC<IProps> = ({ onChangeData }) => {
  let [eMail, setEMail] = useState<string>("");
  const [isChatActive, setChatStatus] = React.useState(false);
  const router = useRouter();
  const [config, setConfig] = React.useState([
    {
      id: "dashboard",
      icon: dashboardProgress,
      activeIcon: dashboardProgressHighlight,
      isActive: false,
      nextPage: "",
      toolTipMsg: "Dashboards & Reports",
    },
    {
      id: "sections",
      icon: ScheduleIcon,
      activeIcon: ScheduleHighlight,
      isActive: router.pathname.includes("structure"),
      toolTipMsg: "Views",
    },

    // {
    //   id: "structure",
    //   icon: drawing,
    //   activeIcon: drawingInactive,
    //   isActive: false,
    //   nextPage: "",
    //   toolTipMsg: "Drawings",
    // },

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
    // {
    //   id: "settings",
    //   icon: people,
    //   isActive: false,
    //   activeIcon: peopleHighlighted,
    //   toolTipMsg: "Project Details",
    // },

    {
      id: "settings",
      icon: projectDetails,
      isActive: false,
      activeIcon: projectDetailsHighlighted,
      toolTipMsg: "Project Details",
    },
    // {
    //   id:"chatSupport",
    //   icon:chatOpen,
    //   isActive:false,
    //   activeIcon:chatClose,
    //   toolTipMsg:"Chat Support",
    // },
  ]);
  const [supportItemsConfig, setSupportItemsConfig] = React.useState([
    {
      id: "chatSupport",
      icon: chatOpen,
      isActive: false,
      activeIcon: chatClose,
      toolTipMsg: "Chat Support",
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


  const [active, setActive] = useState(router.pathname.split("/").pop());

  // const currentUrl = window.location.href;
  // const urlString = currentUrl.split("/")[5];
  // console.log(currentUrl);

  useEffect(() => {
    const userObj: any = getCookie("user");
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.email) setEMail(user.email);
  }, [router.isReady]);

  const leftClickHandler = (e: any) => {
    switch (e.currentTarget.id) {
      case "dashboard":
        router.push(`/projects/${router.query.projectId as string}/dashboard`);

        break;
      case "views":

      // case "structure":
      //   router.push(`/projects/${router.query.projectId as string}/structure`);

      //   break;
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
      case "chatSupport":
        //add open Chat code
        //isChatActive?closeChat():openChat();
        openChat();
        setChatStatus(!isChatActive);
        break;
      default:
        router.push(`/projects/${router.query.projectId as string}/structure`);
    }
    setActive(router.pathname.split("/").pop());
  };
  function openChat(): void {
    {
      eval(`globalThis.fcWidget.user.setEmail("${eMail}");`);
    }
    {
      eval(`globalThis.fcWidget.open()`);
    }
  }
  function closeChat(): void {
    {
      eval(`globalThis.fcWidget.close()`);
    }
  }

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
                {router.pathname.includes(item.id) || item.isActive ? (
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
      {/* {supportItemsConfig.map((item, index) => (
        <SideMenuOptionContainer className="fixed bottom-0" key={index}>
          <SideMenuOption
          // onClick={() =>
          //   item.label === "settings" ? handleClick(item) : null
          // }
          // onClick={() => handleClick(item.id)}
          >
            <TooltipText title={item.toolTipMsg} placement="right">
              {/* <SideMenuOptionSupportImageContainer> <StyledImage
                    src={item.icon}
                    alt={item.id}
                    id={item.id}
                    onClick={leftClickHandler}
                  /></SideMenuOptionSupportImageContainer> */}
              {/* <SideMenuOptionImageContainer id="custom_fc_button">
                {isChatActive ? (
                  <StyledImage
                    // src={item.activeIcon}
                    src={item.icon}
                    width={40}
                    height={40}
                    alt={item.id}
                    id={item.id}
                    onClick={leftClickHandler}
                  />
                ) : (
                  <StyledImage
                    src={item.icon}
                    width={40}
                    height={40}
                    alt={item.id}
                    id={item.id}
                    onClick={leftClickHandler}
                  />
                )}
              </SideMenuOptionImageContainer> */}
            {/* </TooltipText>
          </SideMenuOption>
        </SideMenuOptionContainer> */}
      {/* ))} */} 
    </SideMenuContainer>
  );
};

export default SidePanelMenu;
