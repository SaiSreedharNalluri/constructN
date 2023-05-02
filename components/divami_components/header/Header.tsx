import Box from "@mui/material/Box";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import constructnLogo from "../../../public/divami_icons/constructnLogo.svg";
import hamburgerMenu from "../../../public/divami_icons/hamburgerMenu.svg";
import profileImageHeader from "../../../public/divami_icons/profileImageHeader.svg";
import ImgProfile from "../../../public/divami_icons/ImgProfile.svg";

import Notification from "../../../public/divami_icons/Notification.svg";
import clip from "../../../public/divami_icons/clip.svg";
import defaultAvatar from "../../../public/divami_icons/defaultAvatar.svg";

import { useRouter } from "next/router";
import { getCookie, removeCookies } from "cookies-next";
import DesignRealitySwitch from "../../container/designRealitySwitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCog,
  faQuestion,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import {
  HeaderContainer,
  HeaderLeftPart,
  HeaderLogoImageContainer,
  HeaderRightPart,
  HeaderToggle,
  HeaderToggleButtonOne,
  HeaderProfileImageContainer,
  HeaderMenuImageContainer,
  HeaderNotificationImageContainer,
  ProfileImgIcon,
  ProfileImgSecIcon,
  ProfileImgIconDefault,
} from "./HeaderStyles";
import { ITools } from "../../../models/ITools";
import CustomBreadcrumbs from "../custom-breadcrumbs/CustomBreadcrumbs";
import headerLogSeparator from "../../..//public/divami_icons/headerLogSeparator.svg";
import { styled } from "@mui/system";

interface IProps {
  // showDesignRealitySwitch?:boolean;
  // isDesignView?:boolean;
}

export const DividerIcon = styled(Image)({
  cursor: "pointer",
  height: "20px",
  marginLeft: "15px",
  marginRight: "15px",
});

const Header: React.FC<any> = ({
  toolClicked,
  viewMode,
  showBreadcrumbs = false,
  breadCrumbData,
  handleBreadCrumbClick,
}) => {
  const router = useRouter();
  const headerRef: any = React.useRef();
  let [name, setName] = useState<string>("");
  let toolInstance: ITools = { toolName: "", toolAction: "" };
  const [rightNav, setRighttNav] = useState(false);
  const [isCompareDesign, setIsCompareDesign] = useState(false);
  const [isCompareReality, setIsCompareReality] = useState(false);
  const [iViewMode, setIViewMode] = useState(viewMode);
  const [isDesignSelected, setIsDesignSelected] = useState(
    iViewMode === "Reality" ? false : true
  );
  let [eMail, setEMail] = useState<string>("");
  let [avatar, setAvatar] = useState<string>("");
  const rightOverlayRef: any = useRef();
  const rightOverlayRefs: any = useRef();
  const [active, setActive] = useState();
  const [loading, setLoading] = useState<boolean>(false);

  const [userObjState, setUserObjState] = useState<any>(getCookie("user"));
  useEffect(() => {
    const userObj: any = getCookie("user");
    let user = null;
    if (userObjState) user = JSON.parse(userObjState);
    console.log(user, "mnfdss");

    if (user?.fullName) {
      setName(user.fullName);
    }
    if (user?.email) {
      setEMail(user.email);
    }
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
  }, [router.query,loading]);

  useEffect(() => {
    setIViewMode(viewMode);
    setIsDesignSelected(viewMode === "Reality" ? false : true);
    //   document.addEventListener('click', closeStructurePages);
    //   return () => {
    //     document.removeEventListener('click', closeStructurePages);
    //   };
  }, [viewMode]);
  
  useEffect(() => {
    const closePopup = (e: any) => {
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

  const onProfilePicClick = () => {
    if (!loading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  const rightMenuClickHandler = (e: any) => {
    setActive(e.currentTarget.id);
    setRighttNav(!rightNav);
    if (e.currentTarget.id === "Design") {
      toolInstance.toolName = "viewMode";
      toolInstance.toolAction = "Design";
      setIsDesignSelected(true);
    } else if (e.currentTarget.id === "Reality") {
      toolInstance.toolName = "viewMode";
      toolInstance.toolAction = "Reality";
      setIsDesignSelected(false);
    }
    // else if (e.currentTarget.id === "compareDesign") {
    //   toolInstance.toolName = "compareDesign";
    //   toolInstance.toolAction = isCompareDesign
    //     ? "closeCompare"
    //     : "showCompare";
    //   setIsCompareDesign(isCompareDesign ? false : true);
    //   setIsCompareReality(false);
    // } else if (e.currentTarget.id === "compareReality") {
    //   toolInstance.toolName = "compareReality";
    //   toolInstance.toolAction = isCompareReality
    //     ? "closeCompare"
    //     : "showCompare";
    //   setIsCompareReality(isCompareReality ? false : true);
    //   setIsCompareDesign(false);
    // }

    toolClicked(toolInstance);
  };

  return (
    <>
      <HeaderContainer ref={headerRef}>
        <div
          style={{
            height: "10px",
            width: "59px",
            background: "#FFFFFF",
            position: "absolute",
            top: "58px",
            zIndex: "9999999",
            //   opacity: "1",
            // width: "59px",
            // background: "#FFFFFF",
            // position: "absolute",
            // z-index: "9999999";
            // top: "58px";
            // opacity: "1";
          }}
        ></div>
        <HeaderLeftPart>
          <HeaderLogoImageContainer>
            <Image
              onClick={goToProjectsList}
              src={constructnLogo}
              alt="Constructn Logo"
              data-testid="constructn-logo"
            />
          </HeaderLogoImageContainer>
          {showBreadcrumbs && <DividerIcon src={headerLogSeparator} alt="" />}
          {showBreadcrumbs && (
            <CustomBreadcrumbs
              breadCrumbData={breadCrumbData}
              handleBreadCrumbClick={handleBreadCrumbClick}
            />
          )}
        </HeaderLeftPart>
        <HeaderRightPart>
          {toolClicked ? (
            <HeaderToggle>
              <HeaderToggleButtonOne
                onClick={rightMenuClickHandler}
                toggleStatus={isDesignSelected}
                id="Design"
                data-testid="design-button"
              >
                Design
              </HeaderToggleButtonOne>
              <HeaderToggleButtonOne
                onClick={rightMenuClickHandler}
                toggleStatus={!isDesignSelected}
                id="Reality"
                data-testid="reality-button"
              >
                Reality
              </HeaderToggleButtonOne>
            </HeaderToggle>
          ) : (
            <></>
          )}
          <HeaderProfileImageContainer>
            {/* <Image
              onClick={() => {
                if (!loading) {
                  setLoading(true);
                } else {
                  setLoading(false);
                }
              }}
              src={profileImageHeader}
              alt="Profile Image"
            /> */}
            {/* <Image
              onClick={() => {
                if (!loading) {
                  setLoading(true);
                } else {
                  setLoading(false);
                }
              }}
              src={ImgProfile}
              alt="Profile Image"
            /> */}
            {avatar ? (
              <ProfileImgIcon
                onClick={onProfilePicClick}
                src={avatar}
                alt="Profile Image Icon"
                width={34}
                height={34}
              />
            ) : (
              <ProfileImgIconDefault
                onClick={onProfilePicClick}
                src={defaultAvatar}
                alt="Profile Image Icon"
                width={34}
                height={34}
              />
            )}
          </HeaderProfileImageContainer>
          <HeaderNotificationImageContainer>
            <Image src={Notification} alt="Profile Image" />
          </HeaderNotificationImageContainer>
          <HeaderMenuImageContainer>
            <Image src={hamburgerMenu} alt="Menu" />
          </HeaderMenuImageContainer>
        </HeaderRightPart>

        {loading && (
          <div className="absolute top-14 right-0 z-50 bg-gray-800 rounded-lg shadow border">
            <ul className="text-white p-4 ">
              <li className="font-medium">
                <div className="flex flex-col items-center justify-center transform transition-colors duration-200">
                  <div className="w-11 h-11 mt-2 mr-2 mb-2 rounded-full overflow-hidden border-1 border-gray-900">
                    {/* <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> */}
                    {/* <Image
                      src={avatar || defaultAvatar}
                      alt=""
                      className={`w-full h-full cursor-pointer object-cover `}
                      title={name}
                      height={1920}
                      width={1080}
                      onClick={() => router.push(`/user-account`)}
                    /> */}

                    <ProfileImgSecIcon
                      onClick={() => router.push(`/user-account`)}
                      src={avatar || defaultAvatar}
                      alt="Profile Image Icon"
                      width={34}
                      height={34}
                    />
                  </div>
                  <div className="text-base font-bold">{name}</div>
                  <div className="text-xs italic font-thin">{eMail}</div>
                  <div
                    className="cursor-pointer font-bold"
                    onClick={() => router.push(`/user-account`)}
                  >
                    Manage Account
                  </div>
                </div>
              </li>
              <hr className="border-gray-700" />
              {/* <li className="font-medium cursor-pointer" onClick={() => router.push(`/user-account`)}>
                      <div className="flex items-center justify-center transform transition-colors duration-200">
                        <div className="mr-3">
                          <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        </div>
                        Account
                      </div>
                    </li> */}
              <li
                className="font-medium cursor-pointer"
                onClick={() => router.push(`/support`)}
              >
                <div className="flex items-center justify-center transform transition-colors duration-200 ">
                  <div className="mr-3">
                    <FontAwesomeIcon icon={faQuestion} />
                  </div>
                  Support
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
        {/* //! This is Open Profile Options */}
        {/* {loading && (
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
              <li className="font-medium cursor-pointer" onClick={userLogOut}>
                <div
                  className="flex items-center justify-center transform transition-colors duration-200 "
                  data-testid="logout-button"
                >
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
        )} */}
      </HeaderContainer>
    </>
  );
};

export default Header;
