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
  faQuestion,
  faRightFromBracket,
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
import UserNotification from "../../container/userNotification";
import { IUserNotification } from "../../../models/IUserNotification";
import {
  getAllUserNotifications,
  updateUserNotifications,
} from "../../../services/userNotifications";
import CustomDrawer from "../custom-drawer/custom-drawer";
import Notifications from "../notifications/Notifications";
import UserProfile from "../user-profile/UserProfile";
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
  hideSidePanel,
  fromUsersList,
  showFirstElement,
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
  const [openNotification, setOpenNotication] = useState(false);
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [userObjState, setUserObjState] = useState<any>(getCookie("user"));
  const [openProfile, setOpenProfile] = useState(false);
  useEffect(() => {
    const userObj: any = getCookie("user");
    let user = null;
    if (userObjState) user = JSON.parse(userObjState);

    if (user?.fullName) {
      setName(user.fullName);
    }
    if (user?.email) {
      setEMail(user.email);
    }
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
    getUserNotifications();
  }, [router.query.projectId]);

  useEffect(() => {
    setIViewMode(viewMode);
    setIsDesignSelected(viewMode === "Reality" ? false : true);
    //   document.addEventListener('click', closeStructurePages);
    //   return () => {
    //     document.removeEventListener('click', closeStructurePages);
    //   };
  }, [viewMode]);

  const userLogOut = () => {
    removeCookies("user");
    // router.push("/login");
    router.push("/login");
  };
  const goToProjectsList = () => {
    router.push("/projects");
  };

  const onProfilePicClick = () => {
    if (!openProfile) {
      setOpenProfile(true);
    } else {
      setOpenProfile(false);
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

  const [defaultValue, setDefaultValue] = useState(2);
  const [filterValue, setFilterValue] = useState("All");
  useEffect(() => {
    if (router.isReady) {
      getUserNotifications();
    }
  }, []);
  const getUserNotifications = (
    condition = defaultValue,
    eventEmitter = filterValue
  ) => {
    if (eventEmitter === "All") {
      eventEmitter = "";
    }
    getAllUserNotifications(condition, currentPage, eventEmitter)
      .then((response) => {
        if (notifications.length > 0 && currentPage > 1) {
          setNotifications(notifications.concat(response.result));
          setTotalNotifications(response.totalUserNotifications);
        } else {
          setNotifications(response.result);
          setTotalNotifications(response.totalUserNotifications);
        }
      })
      .catch((error) => {});
  };

  const handleOptionChange = (event: any) => {
    setNotifications(notifications.splice(0, notifications.length));
    getUserNotifications(event.target.value);
    setDefaultValue(event.target.value);
    setCurrentPage(1);
    setFilterValue("All");
  };
  const loadMoreData = () => {
    if (currentPage < totalNotifications / 10) {
      setCurrentPage(currentPage + 1);
    }
  };
  useEffect(() => {
    getUserNotifications(defaultValue);
  }, [currentPage, defaultValue]);
  const updateNotifications = (notificationId: string) => {
    updateUserNotifications([notificationId]).then((response) => {
      if (response.success === true) {
        setNotifications(notifications.splice(0, notifications.length));
        getUserNotifications(defaultValue);
        setCurrentPage(1);
      }
    });
  };
  const filterNotificationData = (filterData: any) => {
    setFilterValue(filterData);
    setCurrentPage(1);
  };
  useEffect(() => {
    getUserNotifications(defaultValue, filterValue);
  }, [filterValue]);
  const handleNotificationClose = () => {
    setOpenNotication(false);
  };
  const handleProfileClose = () => {
    setOpenProfile(false);
  };
  return (
    <>
      <HeaderContainer ref={headerRef}>
        {!hideSidePanel && (
          <div
            style={{
              height: fromUsersList ? "8px" : "10px",
              width: fromUsersList ? "56px" : "59px",
              // height: "10px",
              // width: "59px",
              // background: "#FFFFFF",
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
        )}
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
              handleBreadCrumbClick={
                handleBreadCrumbClick ? handleBreadCrumbClick : () => {}
              }
              showFirstElement={showFirstElement}
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
            {openProfile ? (
              <CustomDrawer>
                <UserProfile
                  handleProfileClose={handleProfileClose}
                ></UserProfile>
              </CustomDrawer>
            ) : (
              ""
            )}
          </HeaderProfileImageContainer>
          <HeaderNotificationImageContainer>
            <Image
              src={Notification}
              alt="Profile Image"
              onClick={() => {
                if (openNotification) {
                  setOpenNotication(false);
                } else {
                  setOpenNotication(true);
                }
              }}
            />

            {openNotification && (
              <div>
                <CustomDrawer>
                  <Notifications
                    notifications={notifications}
                    loadMoreData={loadMoreData}
                    updateNotifications={updateNotifications}
                    filterValue={filterValue}
                    filterNotificationData={filterNotificationData}
                    handleNotificationClose={handleNotificationClose}
                  ></Notifications>
                  <div></div>
                </CustomDrawer>
              </div>
            )}
          </HeaderNotificationImageContainer>
          <HeaderMenuImageContainer>
            <Image src={hamburgerMenu} alt="Menu" />
          </HeaderMenuImageContainer>
        </HeaderRightPart>

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
