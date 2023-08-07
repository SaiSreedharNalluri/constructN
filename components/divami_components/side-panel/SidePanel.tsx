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

import chatOpen from "../../../public/divami_icons/newChatIcon.svg";
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
  SideMenuChatImageContainer,
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
        openChat();
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
  const ChatOpenIcon:any = () => (
    <div
      style={{
        width: "25px",
        height: "25px",
        verticalAlign: "middle",
        overflow: "hidden",
        cursor:"pointer",
      }}
    >
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
<path  d="M919.192216 976.840649a42.620541 42.620541 0 0 1-21.919135-6.088649l-185.094919-110.675027A560.95827 560.95827 0 0 1 512 896.249081c-274.681081 0-498.162162-192.982486-498.162162-430.190703C13.837838 228.850162 237.318919 35.867676 512 35.867676S1010.162162 228.850162 1010.162162 466.058378c0 104.64173-42.952649 203.637622-121.66227 281.821406l70.379243 168.683243c7.195676 17.269622 2.601514 37.251459-11.374703 49.567135-8.025946 7.084973-18.127568 10.710486-28.312216 10.710487z m-203.277838-208.45319c7.610811 0 15.193946 2.048 21.919136 6.088649l91.108324 54.438054-31.494919-75.443892a43.699892 43.699892 0 0 1 11.623784-49.816216c74.170811-64.345946 115.020108-148.729081 115.020108-237.595676C924.090811 276.756757 739.217297 122.713946 512 122.713946S99.909189 276.756757 99.909189 466.058378c0 189.301622 184.873514 343.344432 412.090811 343.344433 65.785081 0 128.719568-12.647784 187.142919-37.583568 5.369081-2.297081 11.07027-3.431784 16.771459-3.431784zM260.953946 470.154378a56.32 56.32 0 0 1 56.347676-56.015567 56.347676 56.347676 0 0 1 55.794162 56.596757c0 31.135135-24.908108 56.430703-55.794162 56.569081A56.32 56.32 0 0 1 260.981622 471.316757v-1.134703z m186.478703 0c0 31.965405 25.710703 57.897514 57.399351 57.897514a57.648432 57.648432 0 0 0 57.371676-57.897514 57.648432 57.648432 0 0 0-57.371676-57.897513 57.648432 57.648432 0 0 0-57.399351 57.897513z m186.506378 0a56.32 56.32 0 0 1 56.347676-56.015567 56.347676 56.347676 0 0 1 55.794162 56.596757c0 31.135135-24.908108 56.430703-55.794162 56.569081a56.32 56.32 0 0 1-56.347676-56.015568v-1.134703z"   />
      </svg>
      </div>
); 

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
      {supportItemsConfig.map((item, index) => (
        <SideMenuOptionContainer className="fixed bottom-0" key={index}>
          <SideMenuOption
          // onClick={() =>
          //   item.label === "settings" ? handleClick(item) : null
          // }
          // onClick={() => handleClick(item.id)}
          >
            <TooltipText title={item.toolTipMsg} placement="right">
              <SideMenuChatImageContainer id="custom_fc_button">
                <div    id={item.id}
                    onClick={leftClickHandler}>
                <ChatOpenIcon 
              />
                </div>
             
              </SideMenuChatImageContainer>
            </TooltipText>
          </SideMenuOption>
        </SideMenuOptionContainer>
      ))}
    </SideMenuContainer>
  );
};

export default SidePanelMenu;