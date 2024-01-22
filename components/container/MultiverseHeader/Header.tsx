import Box from "@mui/material/Box";
import { Badge } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
//import constructnLogo from "../../../public/divami_icons/constructnLogo.svg";
import constructnLogo from "../../../public/divami_icons/logo-yellow.svg";
import hamburgerMenu from "../../../public/divami_icons/hamburgerMenu.svg";
import helpIcon from "../../../public/divami_icons/Help.svg";
import profileImageHeader from "../../../public/divami_icons/profileImageHeader.svg";
import ImgProfile from "../../../public/divami_icons/ImgProfile.svg";

import Notification from "../../../public/divami_icons/Notification.svg";
import clip from "../../../public/divami_icons/clip.svg";
import defaultAvatar from "../../../public/divami_icons/defaultAvatar.svg";

import { useRouter } from "next/router";
import { getCookie, removeCookies, setCookie } from "cookies-next";
import DesignRealitySwitch from "../../container/designRealitySwitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  uploadIcon from '../../../public/divami_icons/uploadIcon.svg'
import {
  faQuestion,
  faRightFromBracket,
  faSignOut,
  faLifeRing,
  faTicket,
  faInfoCircle,
  faClone,
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
  ProjectSelectorContainer,
  HeaderSupportImageContainer,
  HeaderUploaderImageContainer,
} from "./HeaderStyles";
import { IToolbarAction, ITools } from "../../../models/ITools";
import CustomBreadcrumbs from "../../divami_components/custom-breadcrumbs/CustomBreadcrumbs";
import headerLogSeparator from "../../..//public/divami_icons/headerLogSeparator.svg";
import { styled } from "@mui/system";
import UserNotification from "../../container/userNotification";
import { IUserNotification } from "../../../models/IUserNotification";
import {
  clearUserNotificationsCount,
  getAllUserNotifications,
  updateUserNotifications,
} from "../../../services/userNotifications";
import CustomDrawer from "../../divami_components/custom-drawer/custom-drawer";
import Notifications from "../../divami_components/notifications/Notifications";
import UserProfile from "../../divami_components/user-profile/UserProfile";
import CustomSelect from "../../divami_components/custom-select/CustomSelect";
import { getProjectDetails, getProjectsList } from "../../../services/project";
import PopupComponent from "../../popupComponent/PopupComponent";
import { TooltipText } from "../../divami_components/side-panel/SidePanelStyles"; 
import Link from "next/link";
import { Circle, Rectangle } from "@mui/icons-material";
import { json } from "stream/consumers";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast"; 
import { getUserProfile } from "../../../services/userAuth";
import { truncate } from "fs/promises";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import * as Sentry from "@sentry/nextjs";
import { hasCommonElement } from "../../../services/axiosInstance";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { UploaderStep } from "../../../state/uploaderState/state";
import { WebWorkerManager } from "../../../utils/webWorkerManager";
import { getStructureHierarchy, getStructureList } from "../../../services/structure";
import { boolean } from "yup";
import { IBaseResponse } from "../../../models/IBaseResponse";
import { IProjects } from "../../../models/IProjects";
import { ChildrenEntity, IStructure } from "../../../models/IStructure";
import { ProjectData, ProjectLocalStorageKey } from "../../../state/appState/state";
import { useAppContext } from "../../../state/appState/context";
import UploaderProjects from "../../divami_components/uploader_details/uploaderProjects";
import { IJobs } from "../../../models/IJobs";
import { ProjectCounts } from "../../../models/IUtils";
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
  isDesignAvailable = false,
  isRealityAvailable = false,
}) => {
  const customLogger = new CustomLoggerClass();
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
  const [openUploader, setOpenUploader] = useState(false);
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);
  const [menuloading, setMenuLoading] = useState<boolean>(false);
  const [supportMenu, setSupportMenu] = useState<boolean>(false);
  const [userObjState, setUserObjState] = useState<any>(getCookie("user"));
  const [openProfile, setOpenProfile] = useState(false);
  const [projectName, setProjectName] = useState('')
  const [notificationCount, setNotificationCount] = useState(0);
  const [uploaderCount, setUploaderCount] = useState(0);
  const { state: uploaderState } = useUploaderContext();
  const { state: appState, appContextAction } = useAppContext();
  const [projectUplObj,setProjectUplObj] = useState<ProjectCounts>({})
  const { appAction } = appContextAction;
  useEffect(() => {
    if (router.isReady && router?.query?.projectId) {
      let projectId = router?.query?.projectId as string
      var projectDataListString = localStorage.getItem(ProjectLocalStorageKey.ProjectDataListKey)
      var projectDataList: ProjectData[] | undefined = projectDataListString ? JSON.parse(projectDataListString) as ProjectData[] : undefined
      if(appState.currentProjectData && appState.currentProjectData.project._id === projectId) {
        //no need to update
        return
      }

      let projectDataInAppState = appState.projectDataList.find((projectData) => { return projectData.project._id === projectId})
      let projectDataInLocalStorage = projectDataList && projectDataList.find((projectData) => { return projectData.project._id === projectId})
      if(projectDataInAppState) {
        appAction.setCurrentProjectData(projectDataInAppState)
      } else if(projectDataInLocalStorage) {
        appAction.appendProjectData(projectDataInLocalStorage)
      } else {
        let response = getProjectData(projectId);
        response.then((projectData) => {
          if(projectData) {
            if (!projectDataList) {
              projectDataList = [projectData]
            } else {
              projectDataList.push(projectData)
            }
            localStorage.setItem(ProjectLocalStorageKey.ProjectDataListKey, JSON.stringify(projectDataList))
            appAction.appendProjectData(projectData)
          }
        }).catch((error) => {
          if (error.response.status === 403) {
            CustomToast("Permisson Denied, Contact Admin", "error");
            router.push("/projects?reason=AccessDenied");
          }
        })
      }
    }
  }, [router.isReady, router?.query?.projectId])

  useEffect(() => {
    if (router.isReady && router?.query?.projectId) {
      const projectInfo: any = getCookie('projectData') as string;
      if (projectInfo === undefined || projectInfo === null || projectInfo === 1) {
        ProjectInfo([])
      }
      else {
        if (JSON.parse(projectInfo)?.find((each: any) => each._id === router?.query?.projectId)?._id != router?.query?.projectId) {
          ProjectInfo(JSON.parse(projectInfo))
        } else {
          setProjectName(JSON.parse(projectInfo)?.find((each: any) => each._id === router?.query?.projectId)?.name)
        }
      }
    }
  }, [router.isReady, router?.query?.projectId, projectName])
  const ProjectInfo = (projectInfo: any) => {
    getProjectDetails(router?.query?.projectId as string).then((response) => {
      console.log(response?.data?.result?.company?.name, "res");
      if (response?.data?.result) {
        projectInfo.push({ _id: router?.query?.projectId, name: response?.data?.result?.name, timeZone: response?.data?.result?.timeZone, dashboardURL: response?.data?.result?.metaDetails?.dashboardURL, reportURL: response?.data?.result?.metaDetails?.reportURL })
        Sentry.setTag("ProjectName", response?.data?.result?.name);
        Sentry.setTag("ProjectId", response?.data?.result?._id);
        Sentry.setTag("CompanyName", response?.data?.result?.company?.name);
        setCookie('projectData', JSON.stringify(projectInfo));
        setProjectName(response?.data?.result?.name)
      }
    }).catch((error) => {
      if (error.response.status === 403) {
        // CustomToast("Permisson Denied, Contact Admin", "error");
        // router.push("/projects?reason=AccessDenied");
      }
    });
  }
  useEffect(() => {
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
    // if (router.isReady && router.query.projectId) {
    //   setProjectId(router.query.projectId);
    // }
    //getUserNotifications();

  }, [router.isReady]);
  useEffect(() => {
    getUserProfile().then((response) => {
      if (response?.success === true) {
        setNotificationCount(response?.result?.unReadNotifications)
      }
    })
  }, [router.isReady]);
  useEffect(() => {
    setIViewMode(viewMode);
    console.log("tyring to change mode",viewMode);
    
    setIsDesignSelected(viewMode === "Reality" ? false : true);
    //   document.addEventListener('click', closeStructurePages);
    //   return () => {
    //     document.removeEventListener('click', closeStructurePages);
    //   };
  }, [viewMode]);

  const getProjectData = async (projectId: string): Promise<ProjectData | undefined> => {
    let responseArr = await Promise.all([
      getProjectDetails(projectId),
      getStructureList(projectId),
      getStructureHierarchy(projectId)
    ])

    let isSuccess = responseArr.reduce<boolean>((isSuccess, response): boolean => {
      let data = response.data as IBaseResponse<any>
      return isSuccess && data.success
    }, true)

    if (isSuccess) {
      let project = (responseArr[0].data as IBaseResponse<IProjects>).result
      let structureList = (responseArr[1].data as IBaseResponse<IStructure[]>).result
      let structureHierarchy = (responseArr[2].data as IBaseResponse<ChildrenEntity[]>).result

      let projectData: ProjectData = {
        project: project,
        structureList: structureList,
        hierarchy: structureHierarchy
      }
      return projectData
    } else {
      return undefined
    }
  }

  const userLogOut = () => {
    customLogger.logActivity("null");
    Sentry.setTag("ProjectName", null);
    Sentry.setTag("CompanyName", null);
    Sentry.setTag("ProjectId", null);
    removeCookies("user");
    removeCookies('projectData');
    removeCookies('isProjectTimeZone');
    localStorage.removeItem('uploaededData')
    // router.push("/login");
    router.push("/login");
  };

  const goToProjectsList = () => {
    if (hasCommonElement(['uploader'], router.asPath?.split("/")) === true && uploaderState.step !== UploaderStep.Upload) {
      setIsShowPopUp(true)
    }
    else {
      router.push("/projects");
    }
    customLogger.logInfo("Projects Page");
  };

  const onProfilePicClick = () => {
    if (!openProfile) {
      setOpenProfile(true);
      setMenuLoading(false);
      setSupportMenu(false);
      setOpenNotication(false);
      customLogger.logInfo("Header - User Profile")
    } else {
      setOpenProfile(false);
    }
  };
  const rightMenuClickHandler = (e: any) => {
    setActive(e.currentTarget.id);
    setRighttNav(!rightNav);
    if (e.currentTarget.id === "Design" && isDesignAvailable) {
      let DesignInstance: IToolbarAction = { data: "Design",type:"setViewMode"};
      toolClicked(DesignInstance);
      setIsDesignSelected(true);
      customLogger.logInfo("Design Toggle")
      // customLogger.logActivity(eMail,"email")
    } else if (e.currentTarget.id === "Reality" && isRealityAvailable) {
      let DesignInstance: IToolbarAction = { data: "Reality",type:"setViewMode"};
      toolClicked(DesignInstance);
      setIsDesignSelected(false);
      customLogger.logInfo("Reality Toggle")
      // customLogger.logActivity(eMail,"email")
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

   
  };

  //const [defaultValue, setDefaultValue] = useState(2);
  const [filterValue, setFilterValue] = useState("All");
  const [showPopUp, setshowPopUp] = useState(false);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  // useEffect(() => {
  //   getUserNotifications();
  //   getProjectsList()
  //     .then(async (response) => {
  //       if (response?.data?.success === true) {
  //         // setProjects(response.data.result);
  //         const rolesData = response.data.result.map((each: any) => {
  //           return {
  //             label: each.name,
  //             value: each._id,
  //             selected: false,
  //           };
  //         });

  //         // setConfig([response.data.result]);

  //         setProjects(rolesData);

  //         // setCurrentProject()
  //       }
  //     })
  //     .catch((error) => {});
  // }, []);
  const getUserNotifications = (
    // condition = defaultValue,
    eventEmitter = filterValue
  ) => {
    if (eventEmitter === "All") {
      eventEmitter = "";
    }
    getAllUserNotifications(currentPage, eventEmitter)
      .then((response) => {
        if (notifications.length > 0 && currentPage > 1) {
          setNotifications(notifications.concat(response.notifications));
          setTotalNotifications(response.totalUserNotifications);
        } else {
          setNotifications(response.notifications);
          setTotalNotifications(response.totalUserNotifications);
        }
      })
      .catch((error) => { });
  };

  const handleOptionChange = (event: any) => {
    setNotifications(notifications.splice(0, notifications.length));
    getUserNotifications(event.target.value);
    //setDefaultValue(event.target.value);
    setCurrentPage(1);
    setFilterValue("All");
  };
  const loadMoreData = () => {
    if (currentPage < totalNotifications / 10) {
      setCurrentPage(currentPage + 1);
    }
  };
  // useEffect(() => {
  //   getUserNotifications(defaultValue);
  // }, [currentPage, defaultValue]);
  const updateNotifications = (notificationId: string) => {
    updateUserNotifications([notificationId]).then((response) => {
      if (response.success === true) {
        setNotifications(notifications.splice(0, notifications.length));
        getUserNotifications();
        setCurrentPage(1);
      }
    });
  };
  const filterNotificationData = (filterData: any) => {
    setFilterValue(filterData);
    setCurrentPage(1);
  };
  useEffect(() => {
    getUserNotifications(filterValue);
  }, [filterValue, currentPage]);
  const handleNotificationClose = () => {
    setOpenNotication(false);
  };
  const handleProfileClose = () => {
    setOpenProfile(false);
  };
  const handleUploaderClose =()=>{
    setOpenUploader(false)
  }
  const clearNotificationsCount = () => {
    clearUserNotificationsCount().then((response) => {
      if (response?.success === true) {
        setNotificationCount(0)
      }
      console.log(response);
    }).catch((error) => { });
  }
  const [url,setUrl]=useState('')
  let WorkerManager = WebWorkerManager.getInstance()
  const workerExists = Object.keys(WorkerManager.getWorker()).length > 0;
   const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    
    if (
      (workerExists && [UploaderStep.Upload, UploaderStep.Details].includes(uploaderState.step)) ||
      workerExists ||
      [UploaderStep.ChooseFiles, UploaderStep.Review, UploaderStep.ChooseGCPs].includes(uploaderState.step)
    ) {
 
       event.preventDefault();
       event.returnValue = true;
     }
   };
   const popStateHandler = () => {
    if (
      (workerExists && [UploaderStep.Upload, UploaderStep.Details].includes(uploaderState.step)) ||
      workerExists ||
      [UploaderStep.ChooseFiles, UploaderStep.Review, UploaderStep.ChooseGCPs].includes(uploaderState.step)
    )  {
       setIsShowPopUp(true)
       history.pushState(null, '', url);
     }
   }
   useEffect(()=>{
   setUrl(window.location.href)
   },[typeof window != undefined,router,router.isReady])
 
   useEffect(() => {
     window.addEventListener("beforeunload", beforeUnloadHandler);
     history.pushState(null, '', document.URL);
     window.addEventListener('popstate', popStateHandler)
     return (() => {
       window.removeEventListener("beforeunload", beforeUnloadHandler);
       window.removeEventListener('popstate', popStateHandler)
     })
   }, [url,uploaderState.step])

  useEffect(() => {
    // Calculate project counts when the component mounts or when the originalArray changes
    const calculateProjectCounts = () => {
      const counts:any = {};
      appState.inProgressPendingUploads.forEach(jobInfo => {
        const projectId = jobInfo.project as string;

        if (!counts[projectId]) {
          counts[projectId] = 1;
        } else {
          counts[projectId]++;
        }
      });

      setProjectUplObj(counts);
    };
    calculateProjectCounts();
    }, [appState.inProgressPendingUploads]);
  useEffect(()=>{
    if(Object?.keys(projectUplObj).length>0)
    {
      setUploaderCount(Object.keys(projectUplObj).length)
    }
    else{
      setUploaderCount(0)
    }
  },[projectUplObj])
  
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

              background: "#ffffff",
              position: "absolute",
              top: "58px",
              zIndex: "1000",
              opacity: "1",
              //clipPath:  'polygon(66% 27%, 81% 35%, 100% 30%, 100% 100%, 0 100%, 0 0, 57% 0, 56% 11%)',
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
              breadCrumbData={breadCrumbData.length > 0 ? breadCrumbData : [{ name: projectName }]}
              handleBreadCrumbClick={
                handleBreadCrumbClick ? handleBreadCrumbClick : () => { }
              }
              showFirstElement={showFirstElement}
            />
          )}
        </HeaderLeftPart>
        <HeaderRightPart>
          {/* {projectId ? (
            <ProjectSelectorContainer>
              <CustomSelect
                config={{
                  options: projects?.length ? projects : [],
                  defaultValue: projectId ? projectId : "",
                  textAlign:"right",
                  maxWidth:"220px",
                }}
                hideBorder
                width={"unset"}
                id=""
                sx={{ minWidth: 120 }}
                setFormConfig={() => {}}
                isError={false}
                label=""
                onChangeHandler={(e: any) => {
                  const selectedProjectId = e.target.value;
                  const currentRoute = router.route;

                  //  router.push(
                  //    `/projects/${router.query.projectId as string}/sections`
                  //  );

                  const dynamicRoute = currentRoute.replace(
                    "[projectId]",
                    selectedProjectId as string
                  );

                  window.location.href = dynamicRoute;
                }}
              />
            </ProjectSelectorContainer>
          ) : (
            ""
          )} */}
        
          {(toolClicked && (isDesignAvailable || isRealityAvailable)) ? (
            <TooltipText title={!isDesignAvailable ? "No Design" : !isRealityAvailable ? "No Reality" : "Switch Mode"}>
              <HeaderToggle>
                <HeaderToggleButtonOne
                  onClick={rightMenuClickHandler}
                  toggleStatus={isDesignSelected}
                  isAvailable={isDesignAvailable}
                  id="Design"
                  dataTestid="design-button"
                  isLeftCorner={true}
                >
                  Design
                </HeaderToggleButtonOne>
                <HeaderToggleButtonOne
                  onClick={rightMenuClickHandler}
                  toggleStatus={!isDesignSelected}
                  isAvailable={isRealityAvailable}
                  id="Reality"
                  dataTestid="reality-button"

                >
                  Reality
                </HeaderToggleButtonOne>
              </HeaderToggle>
            </TooltipText>
          ) : (
            <></>
          )}
         <HeaderUploaderImageContainer>
            <TooltipText title="Uploader" onClick={() => {
              if (openUploader) {
                setOpenUploader(false);
                customLogger.logInfo("Notifications Hide")
              } else {
                customLogger.logInfo("Notifications Show")
                setOpenUploader(true);
                setOpenNotication(false);
                setMenuLoading(false);
                setSupportMenu(false);
                setOpenProfile(false);
                clearNotificationsCount();
              }
            }}>
              <div className="hover:bg-[#E7E7E7] p-[7px] rounded-full" >
                <Badge badgeContent={uploaderCount} color="warning">
                  <Image
                    src={uploadIcon}
                    alt="Uploader Icon"
                    width={30}
                    height={30}
                  />
                </Badge>
              </div>
            </TooltipText>

            {openUploader && (
              <div>
                 <CustomDrawer paddingStyle={true} variant="persistent">
                 <div><UploaderProjects handleUploaderClose={handleUploaderClose} projectUplObj={projectUplObj}/></div>
                </CustomDrawer>
              </div>
            )}
          </HeaderUploaderImageContainer>
          <HeaderProfileImageContainer>
            {avatar ? (
              <TooltipText title="My Profile">
                <div className="hover:bg-[#E7E7E7] p-[4px] rounded-full">
                  <ProfileImgIcon
                    onClick={onProfilePicClick}
                    src={avatar}
                    alt="Profile Image Icon"
                    width={34}
                    height={34}
                  />
                </div>
              </TooltipText>
            ) : (
              <TooltipText title="My Profile">
                <div className="hover:bg-[#E7E7E7] p-[4px] rounded-full">
                  <ProfileImgIconDefault
                    onClick={onProfilePicClick}
                    src={defaultAvatar}
                    alt="Profile Image Icon"
                    width={34}
                    height={34}
                  />
                </div>
              </TooltipText>
            )}
            {openProfile ? (
              <CustomDrawer paddingStyle={true} variant="persistent">
                <div>
                  <UserProfile
                    handleProfileClose={handleProfileClose}
                  ></UserProfile>
                </div>
              </CustomDrawer>
            ) : (
              ""
            )}
          </HeaderProfileImageContainer>
          <HeaderSupportImageContainer>
            <TooltipText title="Support">
              <div className="rounded-full p-1 hover:bg-[#E7E7E7]">
                <Link href="https://help.constructn.ai/en/" target="_blank" passHref>
                  <Image
                    height="30"
                    src={helpIcon}
                    alt="Support"
                    onClick={() => {
                      if (!supportMenu) {
                        customLogger.logInfo("Header - Support")
                        setSupportMenu(true);
                        setMenuLoading(false);
                        setOpenNotication(false);
                        setOpenProfile(false);
                      } else {
                        setSupportMenu(false);
                      }
                    }}
                  />

                </Link>
              </div>
            </TooltipText>
          </HeaderSupportImageContainer>

          <HeaderNotificationImageContainer>
            <TooltipText title="Notifications" onClick={() => {
              if (openNotification) {
                setOpenNotication(false);
                customLogger.logInfo("Notifications Hide")
              } else {
                customLogger.logInfo("Notifications Show")
                setOpenNotication(true);
                setOpenUploader(false);
                setMenuLoading(false);
                setSupportMenu(false);
                setOpenProfile(false);
                clearNotificationsCount();
              }
            }}>
              <div className="hover:bg-[#E7E7E7] p-[7px] rounded-full" >
                <Badge badgeContent={notificationCount} color="warning">
                  <Image
                    src={Notification}
                    alt="Profile Image"
                  />
                </Badge>
              </div>
            </TooltipText>

            {/* {openNotification && (
              <div>
                <NotificationDrawer variant="persistent">
                  <div>
                    <Notifications
                      notifications={notifications}
                      loadMoreData={loadMoreData}
                      updateNotifications={updateNotifications}
                      filterValue={filterValue}
                      filterNotificationData={filterNotificationData}
                      handleNotificationClose={handleNotificationClose}
                    ></Notifications>
                  </div>

                  <div></div>
                </NotificationDrawer>
              </div>
            )} */}
            {openNotification && (
              <div>
                <CustomDrawer onClose={handleNotificationClose}>
                  <div>
                    <Notifications
                      notifications={notifications}
                      loadMoreData={loadMoreData}
                      updateNotifications={updateNotifications}
                      filterValue={filterValue}
                      filterNotificationData={filterNotificationData}
                      handleNotificationClose={handleNotificationClose}
                    ></Notifications>
                  </div>

                  <div></div>
                </CustomDrawer>
              </div>
            )}
          </HeaderNotificationImageContainer>
          <HeaderMenuImageContainer>
            <TooltipText title="Menu">
              <div className="rounded-full p-1 hover:bg-[#E7E7E7]">
                <Image
                  src={hamburgerMenu}
                  alt="Menu"
                  onClick={() => {
                    if (!menuloading) {
                      customLogger.logInfo("Signout")
                      setMenuLoading(true);
                      setOpenNotication(false);
                      setSupportMenu(false);
                      setOpenProfile(false);
                    } else {
                      setMenuLoading(false);
                    }
                  }}
                />
              </div>
            </TooltipText>
          </HeaderMenuImageContainer>
        </HeaderRightPart>

        {menuloading && (
          <div className="absolute top-[64px]  shadow-md right-0 bg-gray-50   z-10  border mx-0.5">
            <div
              className="flex items-center  cursor-pointer p-2  w-[150px]  text-[#101F4C] leading-5  hover:bg-gray-100  py-1 font-normal text-sm "
              onClick={() => {
                setshowPopUp(true);
              }}
            >
              <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon>
              <p className="logout-button px-4 py-1">Sign out</p>
            </div>

            {showPopUp && (
              <PopupComponent
                open={showPopUp}
                setShowPopUp={setshowPopUp}
                modalTitle={"Sign Out"}
                modalmessage={`Are you sure you want to 'Sign Out'?`}
                primaryButtonLabel={"Yes"}
                SecondaryButtonlabel={"No"}
                callBackvalue={userLogOut}
              />
            )}
          </div>
        )}


        {/* {supportMenu && (
          <div className="absolute top-[64px]  shadow-md right-[97px] bg-gray-50   z-[1500]  border mx-0.5">
            <Link href="https://constructnai.freshdesk.com/support/home" passHref target="_blank">
              <div
                className="flex items-center  cursor-pointer p-2  w-[175px]  text-[#101F4C] leading-5  hover:bg-gray-100  py-1 font-normal text-sm "
                onClick={() => {
                  //setshowPopUp(true);
                  //router.push("https://constructnai.freshdesk.com/support/home")
                }}
              >
                <FontAwesomeIcon icon={faLifeRing}></FontAwesomeIcon>
                <p className="logout-button px-4 py-1">Support</p>
              </div>
            </Link>

            <Link href="https://constructnai.freshdesk.com/support/solutions" passHref target="_blank">
              <div
                className="flex items-center  cursor-pointer p-2  w-[175px]  text-[#101F4C] leading-5  hover:bg-gray-100  py-1 font-normal text-sm "
                onClick={() => {
                  //setshowPopUp(true);
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                <p className="logout-button px-4 py-1">Knowledge Base</p>
              </div>
            </Link>

            <Link href="https://constructnai.freshdesk.com/support/tickets" passHref target="_blank">
              <div
                className="flex items-center  cursor-pointer p-2  w-[175px]  text-[#101F4C] leading-5  hover:bg-gray-100  py-1 font-normal text-sm "
                onClick={() => {
                  //setshowPopUp(true);
                }}
              >
                <FontAwesomeIcon icon={faClone}></FontAwesomeIcon>
                <p className="logout-button px-4 py-1">View Tickets</p>
              </div>
            </Link>

            <Link href="https://constructnai.freshdesk.com/support/tickets/new" passHref target="_blank">
              
              <div
                className="flex items-center  cursor-pointer p-2  w-[175px]  text-[#101F4C] leading-5  hover:bg-gray-100  py-1 font-normal text-sm "
                onClick={() => {
                  //setshowPopUp(true);
                }}
              >
                <FontAwesomeIcon icon={faTicket}></FontAwesomeIcon>
                <p className="logout-button px-4 py-1">Raise Ticket</p>
              </div>
              
            </Link>

            {/* {showPopUp && (
              <PopupComponent
                open={showPopUp}
                setShowPopUp={setshowPopUp}
                modalTitle={"Cancel"}
                modalmessage={`Are you sure you want to Sign out? `}
                primaryButtonLabel={"Yes"}
                SecondaryButtonlabel={"No"}
                callBackvalue={userLogOut}
              />
            )} */}
        {/* </div> */}
        {/* )} } */}
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
      {
        isShowPopUp && (<PopupComponent
          open={isShowPopUp}
          setShowPopUp={setIsShowPopUp}
          modalTitle={"Alert"}
          modalmessage={`You have unsaved changes. Navigating away from this page will result in the loss of your current edits. Are you sure you want to proceed and lose your changes?`}
          primaryButtonLabel={"Confirm"}
          SecondaryButtonlabel={"Cancel"}
          callBackvalue={() => {
            router.push("/projects");
          }}
        />)
      }
    </>
  );
};

export default Header;
