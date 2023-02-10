import Box from "@mui/material/Box";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import constructnLogo from "../../../public/divami_icons/constructnLogo.svg";
import hamburgerMenu from "../../../public/divami_icons/hamburgerMenu.svg";
import profileImageHeader from "../../../public/divami_icons/profileImageHeader.svg";
import Notification from "../../../public/divami_icons/notification.svg";
import { useRouter } from "next/router";
import { getCookie, removeCookies } from "cookies-next";
import DesignRealitySwitch from "../../container/designRealitySwitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCog,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import {
  HeaderContainer,
  HeaderLeftPart,
  HeaderLogoImageContainer,
  HeaderRightPart,
  HeaderToggle,
  HeaderToggleButtonTwo,
  HeaderToggleButtonOne,
  HeaderProfileImageContainer,
  HeaderMenuImageContainer,
  HeaderNotificationImageContainer,
} from "./HeaderStyles";
import { ITools } from "../../../models/ITools";

interface IProps {
  // showDesignRealitySwitch?:boolean;
  // isDesignView?:boolean;
}

const Header: React.FC<any> = ({ toolClicked, viewMode }) => {
  const [isDesignSelected, setIsDesignSelected] = useState(true);

  const router = useRouter();
  const headerRef: any = React.useRef();
  let [name, setName] = useState<string>("");
  let toolInstance: ITools = { toolName: "", toolAction: "" };
  const [rightNav, setRighttNav] = useState(false);
  const [isCompareDesign, setIsCompareDesign] = useState(false);
  const [isCompareReality, setIsCompareReality] = useState(false);
  const [iViewMode, setIViewMode] = useState(viewMode);
  const rightOverlayRef: any = useRef();
  const rightOverlayRefs: any = useRef();
  const [active, setActive] = useState();
  useEffect(() => {
    const userObj: any = getCookie("user");
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.fullName) {
      setName(user.fullName);
    }
  }, [router.query.projectId]);
  useEffect(() => {
    setIViewMode(viewMode);
    //   document.addEventListener('click', closeStructurePages);
    //   return () => {
    //     document.removeEventListener('click', closeStructurePages);
    //   };
  }, [viewMode]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const closePopup = (e: any) => {
      //console.log(headerRef.current.contains(e.target));
      if (!headerRef?.current?.contains(e.target)) {
        setLoading(false);
      }
    };
    document.addEventListener("click", closePopup);
    return () => {
      document.removeEventListener("click", closePopup);
    };
  }, []);
  const userLogOut = () => {
    removeCookies("user");
    router.push("/login");
  };
  const goToProjectsList = () => {
    router.push("/projects");
  };

  const rightMenuClickHandler = (e: any) => {
    setActive(e.currentTarget.id);
    setIsDesignSelected((prev: any) => !prev);
    setRighttNav(!rightNav);
    if (e.currentTarget.id === "Reality") {
      toolInstance.toolName = "viewMode";
      toolInstance.toolAction = "Design";
    } else if (e.currentTarget.id === "Design") {
      toolInstance.toolName = "viewMode";
      toolInstance.toolAction = "Reality";
    } else if (e.currentTarget.id === "compareDesign") {
      //console.log("CAptured....");
      toolInstance.toolName = "compareDesign";
      toolInstance.toolAction = isCompareDesign
        ? "closeCompare"
        : "showCompare";
      setIsCompareDesign(isCompareDesign ? false : true);
      setIsCompareReality(false);
    } else if (e.currentTarget.id === "compareReality") {
      //console.log("CAptured....");
      toolInstance.toolName = "compareReality";
      toolInstance.toolAction = isCompareReality
        ? "closeCompare"
        : "showCompare";
      setIsCompareReality(isCompareReality ? false : true);
      setIsCompareDesign(false);
    }

    toolClicked(toolInstance);
  };

  console.log(isDesignSelected, "isdesignsele");
  return (
    <>
      <HeaderContainer ref={headerRef}>
        <HeaderLeftPart>
          <HeaderLogoImageContainer>
            <Image
              onClick={goToProjectsList}
              src={constructnLogo}
              alt="Constructn Logo"
            />
          </HeaderLogoImageContainer>
        </HeaderLeftPart>
        <HeaderRightPart>
          {toolClicked ? (
            <HeaderToggle>
              <HeaderToggleButtonOne
                onClick={rightMenuClickHandler}
                toggleStatus={isDesignSelected}
                id="Design"
              >
                Design
              </HeaderToggleButtonOne>
              <HeaderToggleButtonOne
                onClick={rightMenuClickHandler}
                toggleStatus={!isDesignSelected}
                id="Reality"
              >
                Reality
              </HeaderToggleButtonOne>
            </HeaderToggle>
          ) : (
            <></>
          )}
          <HeaderProfileImageContainer>
            <Image
              onClick={() => {
                if (!loading) {
                  setLoading(true);
                } else {
                  setLoading(false);
                }
              }}
              src={profileImageHeader}
              alt="Profile Image"
            />
          </HeaderProfileImageContainer>
          <HeaderNotificationImageContainer>
            <Image src={Notification} alt="Profile Image" />
          </HeaderNotificationImageContainer>
          <HeaderMenuImageContainer>
            <Image src={hamburgerMenu} alt="Menu" />
          </HeaderMenuImageContainer>
        </HeaderRightPart>
        {/* //! This is Open Profile Options */}
        {loading && (
          <div className="absolute top-10 right-0 z-50 bg-gray-800 rounded-lg shadow border">
            <ul className="text-white p-4 ">
              <li className="font-medium cursor-pointer">
                <div className="flex items-center justify-center transform transition-colors duration-200">
                  <div className="mr-3">
                    <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                  </div>
                  Account
                </div>
              </li>
              <li className="font-medium cursor-pointer">
                <div className="flex items-center justify-center transform transition-colors duration-200 ">
                  <div className="mr-3">
                    <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
                  </div>
                  Settings
                </div>
              </li>
              <hr className="border-gray-700" />
              <li
                className="font-medium cursor-pointer"
                onClick={() => userLogOut()}
              >
                <div className="flex items-center justify-center transform transition-colors duration-200 ">
                  <div className="mr-3 ">
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                    ></FontAwesomeIcon>
                  </div>
                  Logout
                </div>
              </li>
            </ul>
          </div>
        )}
      </HeaderContainer>
    </>
  );
};

export default Header;
