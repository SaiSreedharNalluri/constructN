import { Badge, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import constructnLogo from "../../../public/divami_icons/logo-yellow.svg";
import hamburgerMenu from "../../../public/divami_icons/hamburgerMenu.svg";
import helpIcon from "../../../public/divami_icons/Help.svg";
import Notification from "../../../public/divami_icons/Notification.svg";
import defaultAvatar from "../../../public/divami_icons/defaultAvatar.svg";
import { useRouter } from "next/router";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  uploadIcon from '../../../public/divami_icons/uploadIcon.svg'
import {faSignOut} from "@fortawesome/free-solid-svg-icons";

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
  HeaderSupportImageContainer,
  HeaderUploaderImageContainer,
} from "./HeaderStyles";
import { ITools } from "../../../models/ITools";
import CustomBreadcrumbs from "../custom-breadcrumbs/CustomBreadcrumbs";
import headerLogSeparator from "../../..//public/divami_icons/headerLogSeparator.svg";
import { styled } from "@mui/system";
import { IUserNotification } from "../../../models/IUserNotification";
import {
  clearUserNotificationsCount,
  getAllUserNotifications,
  updateUserNotifications,
} from "../../../services/userNotifications";
import CustomDrawer from "../custom-drawer/custom-drawer";
import Notifications from "../notifications/Notifications";
import UserProfile from "../user-profile/UserProfile";
import { getProjectDetails } from "../../../services/project";
import PopupComponent from "../../popupComponent/PopupComponent";
import { TooltipText } from "../side-panel/SidePanelStyles";
import Link from "next/link";
import { CustomToast } from "../custom-toaster/CustomToast";
import { getUserProfile } from "../../../services/userAuth";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import * as Sentry from "@sentry/nextjs";
import { hasCommonElement } from "../../../services/axiosInstance";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { UploaderStep } from "../../../state/uploaderState/state";
import { WebWorkerManager } from "../../../utils/webWorkerManager";
import { getStructureHierarchy, getStructureList } from "../../../services/structure";
import { IBaseResponse } from "../../../models/IBaseResponse";
import { IProjects } from "../../../models/IProjects";
import { ChildrenEntity, IStructure } from "../../../models/IStructure";
import { ProjectData, ProjectLocalStorageKey } from "../../../state/appState/state";
import { useAppContext } from "../../../state/appState/context";
import UploaderProjects from "../uploader_details/uploaderProjects";
import { ProjectCounts } from "../../../models/IUtils";
import { IJobs } from "../../../models/IJobs";
import { Mixpanel } from "../../analytics/mixpanel";
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
  let toolInstance: ITools = { toolName: "", toolAction: "" };
  const [rightNav, setRighttNav] = useState(false);
  const [iViewMode, setIViewMode] = useState(viewMode);
  const [isDesignSelected, setIsDesignSelected] = useState(
    iViewMode === "Reality" ? false : true
  );
  let [avatar, setAvatar] = useState<string>("");
  const [openNotification, setOpenNotication] = useState(false);
  const [openUploader, setOpenUploader] = useState(false);
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);
  const [supportMenu, setSupportMenu] = useState<boolean>(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [projectName, setProjectName] = useState('')
  const [notificationCount, setNotificationCount] = useState(0);
  const [uploaderCount, setUploaderCount] = useState(0);
  const { state: uploaderState } = useUploaderContext();
  const { state: appState, appContextAction } = useAppContext();
  const [projectUplObj,setProjectUplObj] = useState<ProjectCounts>({})
  const { appAction } = appContextAction;
  let [userId, setUserId] = useState<string>("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let WorkerManager = WebWorkerManager.getInstance()
  const workerExists = Object.keys(WorkerManager.getWorker()).length > 0;
  useEffect(() => {
    if (router.isReady && router?.query?.projectId) {
      let projectId = router?.query?.projectId as string
      // var projectDataListString = localStorage.getItem(ProjectLocalStorageKey.ProjectDataListKey)
      // var projectDataList: ProjectData[] | undefined = projectDataListString ? JSON.parse(projectDataListString) as ProjectData[] : undefined
      if(appState.currentProjectData && appState.currentProjectData.project._id === projectId) {
        //no need to update
        return
      }

      let projectDataInAppState = appState.projectDataList.find((projectData) => { return projectData.project._id === projectId})
      // let projectDataInLocalStorage = projectDataList && projectDataList.find((projectData) => { return projectData.project._id === projectId})
      if(projectDataInAppState) {
        appAction.setCurrentProjectData(projectDataInAppState)
      // } else if(projectDataInLocalStorage) {
      //   appAction.appendProjectData(projectDataInLocalStorage)
      } else {
        let response = getProjectData(projectId);
        response.then((projectData) => {
          if(projectData) {
            // if (!projectDataList) {
            //   projectDataList = [projectData]
            // } else {
            //   projectDataList.push(projectData)
            // }
            // localStorage.setItem(ProjectLocalStorageKey.ProjectDataListKey, JSON.stringify(projectDataList))
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
    const userCookie = getCookie("user");
    if(userCookie !== undefined) {
      let user = JSON.parse(userCookie as string)
      if (user?.avatar) {
        setAvatar(user.avatar);
      }
      else if(user?._id){
        setUserId(user?._id)
      }
    }
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
    setIsDesignSelected(viewMode === "Reality" ? false : true);
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
    Mixpanel.track( {name: "signout_successful",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"signout",event_action:"signout_successful",user_id:userId})
    Sentry.setTag("ProjectName", null);
    Sentry.setTag("CompanyName", null);
    Sentry.setTag("ProjectId", null);
    deleteCookie("user");
    deleteCookie('projectData');
    deleteCookie('isProjectTimeZone');
    localStorage.removeItem('uploaededData')
    localStorage.removeItem('InProgressPendingUploads')
    // router.push("/login");
    router.push("/login");
  };

  const goToProjectsList = (event:React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    if (
      (workerExists && [UploaderStep.Upload, UploaderStep.Details].includes(uploaderState.step)) ||
      workerExists ||
      [UploaderStep.ChooseFiles, UploaderStep.Review, UploaderStep.ChooseGCPs].includes(uploaderState.step)
    ) {
     setIsShowPopUp(true)
     return
    }
    else {
      router.push("/projects");
    }
    customLogger.logInfo("Projects Page");
  };

  const onProfilePicClick = () => {
    if (!openProfile) {
      setOpenProfile(true);
      setAnchorEl(null)
      setSupportMenu(false);
      setOpenNotication(false);
      customLogger.logInfo("Header - User Profile")
    Mixpanel.track( {name: "profile_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"profile",event_action:"profile_clicked",user_id:userId})
    } else {
      setOpenProfile(false);
    }
  };
  const rightMenuClickHandler = (e: any) => {
    setRighttNav(!rightNav);
    if (e.currentTarget.id === "Design" && isDesignAvailable) {
      toolInstance.toolName = "viewMode";
      toolInstance.toolAction = "Design";
      setIsDesignSelected(true);
      customLogger.logInfo("Design Toggle")
      // customLogger.logActivity(eMail,"email")
    } else if (e.currentTarget.id === "Reality" && isRealityAvailable) {
      toolInstance.toolName = "viewMode";
      toolInstance.toolAction = "Reality";
      setIsDesignSelected(false);
      customLogger.logInfo("Reality Toggle")
      // customLogger.logActivity(eMail,"email")
    }
    toolClicked(toolInstance);
  };
  const [filterValue, setFilterValue] = useState("All");
  const [showPopUp, setshowPopUp] = useState(false);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
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
  const loadMoreData = () => {
    if (currentPage < totalNotifications / 10) {
      setCurrentPage(currentPage + 1);
    }
  };
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
    Mixpanel.track( {name: "notifications_window_closed",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"notifications",event_action:"notifications_window_closed",user_id:userId,notifications_count:notificationCount})
  };
  const handleProfileClose = () => {
    setOpenProfile(false);
    Mixpanel.track( {name: "profile_window_closed",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"profile",event_action:"profile_window_closed",user_id:userId}) 
  };
  const handleUploaderClose =()=>{
    setOpenUploader(false)
    Mixpanel.track( {name: "uploader_notification_window_closed",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"uploader_notifications",event_action:"uploader_notification_window_closed",user_id:userId,notifications_count:uploaderCount})
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
  const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    if (
      (workerExists && [UploaderStep.Upload, UploaderStep.Details].includes(uploaderState.step)) ||
      workerExists ||
      [UploaderStep.ChooseFiles, UploaderStep.Review, UploaderStep.ChooseGCPs].includes(uploaderState.step)
    ) {
      event.preventDefault();
      localStorage.removeItem('InProgressPendingUploads')
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
   }, [url,uploaderState.step,workerExists])
   useEffect(() => {
    window.addEventListener("visibilitychange", ()=>{
      calculateProjectCounts()
    });
    return (() => {
      window.removeEventListener("visibilitychange", ()=>{});
    })
  }, [])
  useEffect(() => {
  calculateProjectCounts();
  }, [appState.inProgressPendingUploads]);
  const calculateProjectCounts = () => {
    const counts:ProjectCounts = {};
    let uploadingcount:number  = 0;
    let  inProgressPendingUploads = localStorage.getItem('InProgressPendingUploads');
    if(inProgressPendingUploads!=null && inProgressPendingUploads!= undefined)
        {
         JSON.parse(inProgressPendingUploads)&&JSON.parse(inProgressPendingUploads).forEach((jobInfo:IJobs) => {
            const projectId = jobInfo.project as string;

            if (!counts[projectId]) {
              counts[projectId] = 1;
              uploadingcount++;
            } else {
              counts[projectId]++;
              uploadingcount++;
            }
          });
        }
        else{
          if (appState.inProgressPendingUploads.length > 0) {
            appState.inProgressPendingUploads.forEach((jobInfo) => {
              const projectId = jobInfo.project as string;
    
              if (!counts[projectId]) {
                counts[projectId] = 1;
                uploadingcount++;
              } else {
                counts[projectId]++;
                uploadingcount++;
              }
            });
          }
        }

    setProjectUplObj(counts);
    setUploaderCount(uploadingcount);
  };
  return (
    <>
      <HeaderContainer ref={headerRef} >
        {!hideSidePanel && (
          <div
            style={{
              height: fromUsersList ? "8px" : "10px",
              width: fromUsersList ? "56px" : "59px",
              background: "#ffffff",
              position: "absolute",
              top: "58px",
              zIndex: "1000",
              opacity: "1",
            }}
          ></div>
        )}
        <HeaderLeftPart>
          <HeaderLogoImageContainer>
          <Link href="/projects" onClick={(event)=>{goToProjectsList(event)}}>
            <Image
              src={constructnLogo}
              alt="Constructn Logo"
              data-testid="constructn-logo"
            />
            </Link>
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
            <TooltipText title="Uploads In Progress" onClick={() => {
              if (openUploader) {
                setOpenUploader(false);
                customLogger.logInfo("Uploader Hide")
              } else {
                customLogger.logInfo("Uploader Show")
                setOpenUploader(true);
                setOpenNotication(false);
                setAnchorEl(null)
                setSupportMenu(false);
                setOpenProfile(false);
                Mixpanel.track( {name: "uploader_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"uploader_notifications",event_action:"uploader_clicked",user_id:userId,notifications_count:uploaderCount})
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
                 <CustomDrawer onClose={handleUploaderClose}>
             { Mixpanel.track( {name: "uploader_notification_window_loaded",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"uploader_notifications",event_action:"uploader_notification_window_loaded",user_id:userId,notifications_count:uploaderCount})}
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
              <CustomDrawer onClose={handleProfileClose}>
             { Mixpanel.track( {name: "profile_window_loaded",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"profile",event_action:"profile_window_loaded",user_id:userId})}
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
                        setAnchorEl(null)
                        setOpenNotication(false);
                        setOpenProfile(false);
    Mixpanel.track( {name: "support_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"support",event_action:"support_clicked",user_id:userId})
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
                setAnchorEl(null)
                setSupportMenu(false);
                setOpenProfile(false);
    Mixpanel.track( {name: "notifications_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"notifications",event_action:"notifications_clicked",user_id:userId,notifications_count:notificationCount})
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

            {openNotification && (
              <div>
                <CustomDrawer onClose={handleNotificationClose}>
    {Mixpanel.track( {name: "notifications_window_loaded",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"notifications",event_action:"notifications_window_loaded",user_id:userId,notifications_count:notificationCount})}
                  
                  <div>
                    <Notifications
                      notifications={notifications}
                      loadMoreData={loadMoreData}
                      updateNotifications={updateNotifications}
                      filterValue={filterValue}
                      filterNotificationData={filterNotificationData}
                      handleNotificationClose={handleNotificationClose}
                      userId={userId}
                      notificationCount={notificationCount}
                    ></Notifications>
                  </div>

                  <div></div>
                </CustomDrawer>
              </div>
            )}
          </HeaderNotificationImageContainer>
          <HeaderMenuImageContainer onClick={(event) => {
                    if (anchorEl === null) {
                      setOpenNotication(false);
                      setAnchorEl(event.currentTarget);
                      setSupportMenu(false);
                      setOpenProfile(false);
    Mixpanel.track( {name: "hamberger_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"signout",event_action:"hamberger_clicked",user_id:userId})                     
                    } else {
                      setAnchorEl(null);
                    }
                  }}>
            <TooltipText title="Menu">
              <div className="rounded-full p-1">
                <Image
                  src={hamburgerMenu}
                  alt="Menu"
                  
                />
              </div>
              </TooltipText>
              <Menu
                className="mt-[20px]"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={()=>{
                      setAnchorEl(null);
                    }}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
          >
          <MenuItem onClick={() => {
            Mixpanel.track( {name: "signout_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"signout",event_action:"signout_clicked",user_id:userId})
            setshowPopUp(true),setAnchorEl(null)
}} className="px-[20px] py-0 hover:bg-white">
          <FontAwesomeIcon icon={faSignOut} className="mr-[10px] "/>Sign out</MenuItem>
          </Menu>
           </HeaderMenuImageContainer>
          
        </HeaderRightPart>
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
    </>
  );
};

export default Header;
