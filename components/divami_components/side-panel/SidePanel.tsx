import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import dashboardProgress from "../../../public/divami_icons/dashboardProgress.svg";
import dashboardProgressHighlight from "../../../public/divami_icons/dashboardProgressHighlight.svg";
import {useIntercom} from "react-use-intercom"

import drawing from "../../../public/divami_icons/drawing.svg";
// import task from "../../../public/divami_icons/task.svg";
import tasks from "../../../public/divami_icons/tasks.svg";
import tasksHighlighted from "../../../public/divami_icons/tasksHighlighted.svg";
import branchHighlighted from "../../../public/divami_icons/branchHighlightedIcon.svg";
import userIcon from "../../../public/divami_icons/userIcon.svg";
import userHighlighted from "../../../public/divami_icons/userHighlighted.svg";

import chatOpen from "../../../public/divami_icons/newChatIconSidePanel.svg";
import chatOpenHightlighted from "../../../public/divami_icons/chatOpenHightlighted.svg";
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
import { format } from 'date-fns';
import moment from 'moment-timezone';
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
  const [isChatHovered, setChatHovered] = useState(false);

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
  const [currentTime, setCurrentTime] = useState<any>();
  const [timeZoneName, setTimeZoneName] = useState('');
  const chatIconRef:any = useRef(null);
  // const currentUrl = window.location.href;
  // const urlString = currentUrl.split("/")[5];
  // console.log(currentUrl);

  const {
    boot,
    shutdown,
    hardShutdown,
    update,
    hide,
    show,
    isOpen,
    showMessages,
    showNewMessage,
    getVisitorId,
    startTour,
    trackEvent,
    showArticle,
    startSurvey,
    showSpace
  } = useIntercom();

  useEffect(() => {
    const userObj: any = getCookie("user");
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.email) setEMail(user.email);

    boot({alignment:"left",hideDefaultLauncher:true,horizontalPadding:60,email:user.email,name:user.firstName});//boot intercom

    return () => {
      shutdown();// shutdown intercom
    };
    
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
      case "timeZone":
        router.push(`/projects/${router.query.projectId as string}/settings`);
        break;
      default:
        router.push(`/projects/${router.query.projectId as string}/structure`);
    }
    setActive(router.pathname.split("/").pop());
  };
  function openChat(): void {
    // {
    //   eval(`globalThis.fcWidget.user.setEmail("${eMail}");`);
    // }
    // {
    //   eval(`globalThis.fcWidget.open()`);
    // }
    //console.log(isOpen,"isOpen");
    
    if(isOpen)
    {
      hide();
    }
    else{
      show();
    }
    
  }
  function closeChat(): void {
    // {
    //   eval(`globalThis.fcWidget.close()`);
    // }
    hide();
  }

  const handleChatHover = () => {
    setChatHovered(true);
  };

  const handleChatHoverEnd = () => {
    setChatHovered(false);
  };
  useEffect(() => {
    const handleOutsideClick :any= (event:any) => {
      if (chatIconRef.current && !chatIconRef.current.contains(event.target)) {
        closeChat();
        hide();
      }
    };
      document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);
  
 

  useEffect(() => {
    const interval = setInterval(() => {
     // localStorage.setItem('isProjectTimeZone',JSON.stringify(true))
    if(JSON.parse(localStorage.getItem('isProjectTimeZone') as string)){
      let timeZone= 'America/New_York'
      setCurrentTime(moment().tz(timeZone).format('h:mm a'));
      setTimeZoneName(moment.tz(timeZone).format("z"))
    }else{
      setCurrentTime(moment().format('h:mm a'));
      setTimeZoneName(moment.tz(moment.tz.guess()).format("z"))
    }
    }, 1000); 
    return () => clearInterval(interval); 
  }, []);
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
              <SideMenuOptionImageContainer id={item.id} onClick={leftClickHandler} >
                {router.pathname.includes(item.id) || item.isActive ? (
                  <OvershowImg>
                    <HighlightedSytledImage
                      src={item.activeIcon}
                      alt={item.id}
                    />
                  </OvershowImg>
                ) : (
                  <StyledImage
                    src={item.icon}
                    alt={item.id}          
                  />
                )}
              </SideMenuOptionImageContainer>
            </TooltipText>
          </SideMenuOption>
        </SideMenuOptionContainer>
      ))}
      {supportItemsConfig.map((item, index) => (
        <SideMenuOptionContainer ref={chatIconRef}  className="fixed bottom-0" key={index}>
          <SideMenuOption
          // onClick={() =>
          //   item.label === "settings" ? handleClick(item) : null
          // }
          // onClick={() => handleClick(item.id)}
          >
            <TooltipText title={item.toolTipMsg} placement="right">        
                <SideMenuChatImageContainer  id={item.id}
                    onClick={leftClickHandler} onMouseEnter={handleChatHover}
                onMouseLeave={handleChatHoverEnd}>
                 {isChatHovered ? (
                  <StyledImage
                    src={chatOpenHightlighted}
                    width={25}
                    height={25}
                    alt={item.id}
                                    
                  />
                ) : (
                  <StyledImage
                    src={item.icon}
                    width={25}
                    height={25}
                    alt={item.id}
                  />
                )}
                </SideMenuChatImageContainer>
      
            </TooltipText>
          </SideMenuOption>
        </SideMenuOptionContainer>
      ))}
         {/* <div  className=" text-[12px] fixed bottom-1 text-center text-[#787878]">
            <TooltipText title="Change time zone" placement="right">
            //  <div id="timeZone" className="py-1 px-[2px] hover:border border-[#FF843F] border-solid rounded-sm cursor-pointer" onClick={leftClickHandler}>{formattedTime}</div> 
              <div id="timeZone" className="py-[6px]  px-[2px] hover:bg-[#FF843F] rounded-sm  cursor-pointer hover:text-white " onClick={leftClickHandler}>
              <div >{currentTime}</div>
            <div className="">({timeZoneName})</div>
              </div>
            </TooltipText>
          </div> */}
    </SideMenuContainer>
  );
};

export default SidePanelMenu;