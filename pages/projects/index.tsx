import { useEffect, useRef, useState } from "react";
import Header from "../../components/divami_components/header/Header";
import {
  Content,
  ProjectsListContainer,
} from "../../components/divami_components/project-users-list/usersListStyles";
import { Drawer, InputAdornment, Menu, Tooltip,Button } from "@mui/material";
import {
  HeaderActions,
  HeaderImage,
  GridViewButton,
  ToggleButtonContainer,
  GridButton,
  HeaderLabel,
  ProjectsHeader,
  GridViewButtonRight,
  FilterIndicator,
} from "../../components/divami_components/project-users-list/ProjectUsersListStyles";
import {
  SearchAreaContainer,
  CustomSearchField,
  CloseIcon,
} from "../../components/divami_components/project-listing/SectionsStyles";
import { useRouter } from "next/router";
import SearchBoxIcon from "../../public/divami_icons/search.svg";
import Image from "next/image";
import CrossIcon from "../../public/divami_icons/crossIcon.svg";
import searchIcon from "../../public/divami_icons/search.svg";
import UserFilterIcon from "../../public/divami_icons/UserFilterIcon.svg";
import selectGridViewIcon from "../../public/divami_icons/gridViewicon.svg";
import updatedIcon from "../../public/divami_icons/updatedAtIcon.svg";
import sortIcon from "../../public/divami_icons/sortIcon.svg";
import listViewIcon from "../../public/divami_icons/listViewicon.svg";
import {
  CenteredErrorImage,
  NoResultText,
  ProjectCardsContainer,
} from "../../components/divami_components/project-listing/ProjectListingStyles";
import { ProjectListCardView } from "../../components/divami_components/project-listing/ProjectListCardView";
import { ProjectListFlatView } from "../../components/divami_components/project-listing/ProjectListFlatView";
import moment from "moment";
import {
  deleteProject,
  get2dProgressDetails,
  getProjects,
  getProjectsList,
  getProjectUsers,
  getUserRoles,
  removeProjectUser,
} from "../../services/project";
import unselectGridIcon from "../../public/divami_icons/unselectGridIcon.svg";
import selectListIcon from "../../public/divami_icons/selectListIcon.svg";
import CustomDrawer from "../../components/divami_components/custom-drawer/custom-drawer";
import ProjectListFilter from "../../components/divami_components/project-listing/ProjectListFilter";
import { CustomMenu } from "../../components/divami_components/custom-menu/CustomMenu";
import UpArrow from "../../public/divami_icons/upArrow.svg";
import DownArrow from "../../public/divami_icons/downArrow.svg";
import { AddUsersEmailOverlay } from "../../components/divami_components/add_users/AddUsersEmailOverlay";
import { AddUsersEmailPopup } from "../../components/divami_components/add_users/AddUsersEmailPopup";
import PopupComponent from "../../components/popupComponent/PopupComponent";
import ProjectConfig from "../../components/divami_components/project_config/ProjectConfig";
import projectHierIcon from "../../public/divami_icons/projectHierIcon.svg";
import {
  updateIssuePriorityList,
  updateIssueStatusList,
  updateTagList,
  updateTaskPriorityList,
  updateTaskStatusList,
} from "../../services/projectConfigApi";
import { CustomToast } from "../../components/divami_components/custom-toaster/CustomToast";
import Moment from "moment";
import CustomLoader from "../../components/divami_components/custom_loader/CustomLoader";
import React from "react";
import chatOpen from "../../public/divami_icons/newChatIcon.svg";
import chatClose from "../../public/divami_icons/chat_close.svg";

import { IntercomProvider, useIntercom } from 'react-use-intercom'

import { getCookie } from "cookies-next";
import { ShowErrorContainer } from "../../components/divami_components/project-listing/ProjectListingStyles";
import chatOpenHightlighted from "../../public/divami_icons/chatOpenHightlighted.svg"
import CustomLoggerClass from "../../components/divami_components/custom_logger/CustomLoggerClass";
import { useAppContext } from "../../state/appState/context";
import { IProjects } from "../../models/IProjects";
import { Mixpanel } from "../../components/analytics/mixpanel";
// import { Button} from "@material-ui/core";
export const truncateString = (text: string, maxLength: number) => {
  let truncatedText = text;

  if (text?.length > maxLength) {
    // const prefix = text.substring(0, maxLength - suffixLength);
    // const suffix = text.substring(text.length - suffixLength);
    const prefix = text.substring(0, maxLength);
    truncatedText = prefix + "...";
  }
  return truncatedText;
};

const Index: React.FC<any> = () => {
  const { state:appState, appContextAction } = useAppContext();
  const { appAction } = appContextAction;
  const breadCrumbsData = [{ label: "Manage Users" }];
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [projects, setProjects] = useState<any>([]);
  const router = useRouter();
  const [searchTableData, setSearchTableData] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showArchiveProject, setShowArchiveProject] = useState(false);
  const [form, setForm] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [responseData, setResponseData] = useState<any>([]);
  const [roles, setRoles] = useState<string[] | []>([]);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  const [options, setOptions] = useState<any>({
    listOfEntries: [
      {
        label: "",
        value: "",
      },
    ],
  });
  const [selectedOption, setSelectedOption] = useState("issuePriority");
  const [d2Details, setD2Details] = useState({});

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

  const [formValues, setFormValues]: any = useState({ priority: [] });
  const [showPopUp, setshowPopUp] = useState(false);

  const [taskFilterState, setTaskFilterState] = useState({});
  const [showButton, setShowbutton] = useState(false);
  const [projectId, setProjectId] = useState<any>("");
  const [showLoading, setShowLoading] = useState(true);
  const [configEnabled, setConfigEnabled] = useState(true);
  const [showWelcomMessage, setShowWelcomeMessage] = useState(false);
  let [eMail, setEMail] = useState<string>("");
  const [isChatHovered, setChatHovered] = useState(false);
  const chatIconRef:any = useRef(null);
  const customLogger = new CustomLoggerClass();
  const sortMenuOptions = [
    {
      label: "Sort by User",
      icon: UpArrow,
      method: "userAsc",
      onClick: () => {
        setSearchTableData(
          []
            .concat(searchTableData)
            .sort((a: any, b: any) => a.usersCount - b.usersCount)
        );
      },
    },
    {
      label: "Sort by User",
      icon: DownArrow,

      method: "userDesc",
      onClick: () => {
        setSearchTableData(
          []
            .concat(searchTableData)
            .sort((a: any, b: any) => b.usersCount - a.usersCount)
        );
      },
    },

    {
      label: "Sort by Last Updated",
      icon: UpArrow,
      method: "updatedAsc",
      onClick: () => {
        const sortedProjects = searchTableData
          .filter((project:any) => !isNaN(new Date(project.lastUpdated).valueOf()))
          .sort((a: any, b: any) => {
            return (
              new Date(a.lastUpdated).valueOf() - new Date(b.lastUpdated).valueOf()
            );
          });

        const invalidDateProjects =searchTableData .filter((project:any) =>
          isNaN(new Date(project.lastUpdated).valueOf())
        );

        setSearchTableData([...sortedProjects, ...invalidDateProjects]);
      },
    },
    {
      label: "Sort by Last Updated",
      icon: DownArrow,
      method: "updatedDesc",
      onClick: () => {
        const sortedProjects = searchTableData
          .filter((project:any) => !isNaN(new Date(project.lastUpdated).valueOf()))
          .sort((a: any, b: any) => {
            return (
              new Date(b.lastUpdated).valueOf() - new Date(a.lastUpdated).valueOf()
            );
          });

        const invalidDateProjects = searchTableData.filter((project:any) =>
          isNaN(new Date(project.lastUpdated).valueOf())
        );

        setSearchTableData([...sortedProjects, ...invalidDateProjects]);
      },
    },
  ];

  const projectActions = [
    {
      label: "View Project Summary",
      action: (id?: string) => {
        router.push({pathname:`/projects/[projectId]/sections`,
        query:{projectId:id}});
      },
    },
    {
      label: "Project Configuration",
      action: (id?: string) => {
        setshowPopUp(true);
        setProjectId(id);
      },
    },
    {
      label: "Project Details",
      action: (id?: string) => {
        router.push({pathname:`/projects/[projectId]/settings`,
        query:{projectId:id}});
      },
    },
    {
      label: "Manage Users",
      action: (id: string) => {
        router.push({pathname:`/projects/[projectId]/usersList`,
        query:{projectId:id}});
      },
    },
    {
      label: "Uploader",
      action: (id: string) => {
        router.push(`/projects/${id}/uploader`);
      },
    },
    {
      label: "Deassign Project",
      action: (id: string) => {
        setShowArchiveProject(true);
        setProjectId(id);
      },
    },
  ];
  const userObj: any = getCookie('user');
	const userId :any= JSON.parse(userObj || "{}");
  const handleSearchWindow = () => {
    setSearchTableData(projects);
    if (searchTerm === "") {
      setIsSearching(!isSearching);
    } else {
      setSearchTerm("");
    }
  };

  const handleFilter = (formState: any) => {
    setTaskFilterState({ ...formState, isFilterApplied: true });
    setSearchTableData(
      projects.filter(
        (each: any) =>{
     return (Moment(each.lastUpdated).isSameOrAfter(formState.startDate, 'day') ||
            !formState.startDate) &&
            (Moment(each.lastUpdated).isSameOrBefore(formState.dueDate, 'day') || 
            !formState.dueDate) &&
          (!formState.compareText ||
            (formState.compareText === "greaterThan"
              ? each.numberOfUsers > formState.numOfMem
              : formState.compareText === "lessThan"
              ? each.numberOfUsers < formState.numOfMem
              : each.numberOfUsers == formState.numOfMem))
          })
    );
  };
  const handleOpenChat = (e: any) => {
    e.stopPropagation()
    if(!isOpen){
    Mixpanel.track( {name: "chat_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"projects_list",event_action:"chat_clicked",user_id:userId._id})           
    openChat();
    }
    else
    closeChat();
  };
  function openChat(): void {
    // {
    //   eval(`globalThis.fcWidget.user.setEmail("${eMail}");`);
    // }
    // {
    //   eval(`globalThis.fcWidget.open()`);
    // }
    show();
  }
  function closeChat(): void {
    // {
    //   eval(`globalThis.fcWidget.close()`);
    // }
    hide();
  }

  const showEmailOverlay = (formState: any) => {
    setShowAddUser(false);
    setOpenDrawer(true);
    setForm(formState);
  };
  useEffect(() => {
    const handleOutsideClick :any= (event:any) => {
      if (chatIconRef.current && !chatIconRef.current.contains(event.target)) {
        closeChat();
      }
    };
  
    document.addEventListener('click', handleOutsideClick);  
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);
  
  useEffect(() => {
    if (router.isReady) {

      get2dProgressDetails().then((res)=>(setD2Details(res.data.result))).catch(()=>{ setD2Details({})});
      
      appAction.projectListViewLoaded();
      getProjectsList()
        .then(async (response) => {
          if (response?.data?.success === true) {
            console.log(response,"dataaaa");
            
    // Mixpanel.track( {name: "projects_list_page_loaded",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"projects_list",event_action:"projects_list_page_loaded",user_id:userId._id,projects_count:projects.length,layout:"grid"})           
    Mixpanel.track( {name: "projects_list_page_loaded",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"projects_list",event_action:"projects_list_page_loaded",user_id:userId._id,projects_count:response?.data?.result?.length,layout:"grid"})           

            if (response?.data?.result.length == 0) {
              setShowWelcomeMessage(true);
            }
            const projectsData = response?.data?.result.map((each: any) => {
              return {
                ...each,
                companyLogo: each.coverPhoto,
                projectName: each.name,
                userName: each.userName,
                numberOfUsers: each.usersCount,
                updatedAt: moment(each.lastUpdated).format("DD MMM YY"),
                lastUpdated: new Date(each.lastUpdated),
                capture360Count: each?.captures && each?.captures["360 Image"]
                  ? `${each?.captures["360 Image"]}`
                  : "0",
                captureVideoWalkCount: each?.captures && each?.captures["360 Video"]
                  ? `${each?.captures["360 Video"]}`
                  : "0",
                capturePhoneCount: each?.captures && each?.captures["Phone Image"]
                  ? `${each?.captures["Phone Image"]}`
                  : "0",
                captureLidarCount: each?.captures && each?.captures["LiDAR Scan"]
                  ? `${each?.captures["LiDAR Scan"]}`
                  : "0",
                captureDroneCount: each?.captures && each?.captures["Drone Image"]
                  ? `${each?.captures["Drone Image"]}`
                  : "0",
              };
            });
            const sortedProjects = projectsData.sort((a:any, b:any) => {
              const dateA = Date.parse(a.lastUpdated);
              const dateB = Date.parse(b.lastUpdated);
        
              if (isNaN(dateA) && isNaN(dateB)) {
                return 0; 
              } else if (isNaN(dateA)) {
                return 1; 
              } else if (isNaN(dateB)) {
                return -1; 
              } else {
                return dateB-dateA
              }
            })
            console.log(sortedProjects)
            setProjects(sortedProjects.sort((a: any, b: any) => a.status === 'Draft' || a.status === 'PendingApproval' ? -1 : 1));
          }
          setShowLoading(false);
        })
        .catch((error: any) => {
          console.log(error)
          setShowWelcomeMessage(true);
        });
      getUserRoles().then((res: any) => {
        const rolesData = res.result.map((each: any) => {
          return {
            label: each,
            value: each,
          };
        });
        setRoles(rolesData);
      });

      const userObj: any = getCookie("user");
      let user = null;
      if (userObj) user = JSON.parse(userObj);
      if (user?.email) setEMail(user.email);

      if(user)
      boot({alignment:"left",customLauncherSelector:"chatSupport",hideDefaultLauncher:true, horizontalPadding:60,name:user.firstName,email:user.email}); //boot intercom
    
    }

    return () => {
      shutdown();// shutdown intercom
  }
  }, [router.isReady]);

  useEffect(() => {
    setSearchTableData([]
      .concat(projects)
      .sort((a: any, b: any) => a.status === 'Draft' || a.status === 'PendingApproval' ? -1 : 1));
  }, [projects]);

  const onDeleteIssue = (status: any) => {
    setshowPopUp(false);
  };

  const containsRepeated = (a: [string]) => {
    const noDups = new Set(a);
    return a.length !== noDups.size;
  };

  // project configuration handlesubmit
  const handleSubmit = async () => {
    if (configEnabled) {
      setConfigEnabled(false);
      const containsEmptyString = formValues.priority.some(
        (item: any) => item.length === 0
      );

      if (containsEmptyString) {
        CustomToast("Field(s) cannot be empty","error");
        setConfigEnabled(true);
        return;
      }

      if (
        containsRepeated(formValues.priority.map((item: string) => item.trim()))
      ) {
        CustomToast("Duplicate Name(s) not allowed","error");
        setConfigEnabled(true);
        return;
      }

      try {
        // Call the appropriate API based on the selected option and pass the updated values
        if (selectedOption === "issuePriority") {
          // await updateIssuePriorityList(projectId, formValues.priority);
          await updateIssuePriorityList(projectId, {
            issuePriorityList: [
              ...formValues.priority.map((ele: string) => ele.trim()),
            ],
          });
          CustomToast("Options updated successfully","success");
          customLogger.logInfo("Issue Priority - Modify")
        } else if (selectedOption === "taskPriority") {
          await updateTaskPriorityList(projectId, {
            taskPriorityList: [
              ...formValues.priority.map((ele: string) => ele.trim()),
            ],
          });
          CustomToast("Options updated successfully","success");
          customLogger.logInfo("Task Priority - Modify")
        } else if (selectedOption === "issueStatus") {
          await updateIssueStatusList(projectId, {
            issueStatusList: [
              ...formValues.priority.map((ele: string) => ele.trim()),
            ],
          });
          CustomToast("Options updated successfully","success");
          customLogger.logInfo("Issue Status - Modify")
        } else if (selectedOption === "taskStatus") {
          await updateTaskStatusList(projectId, {
            taskStatusList: [
              ...formValues.priority.map((ele: string) => ele.trim()),
            ],
          });
          CustomToast("Options updated successfully","success");
          customLogger.logInfo("Task Status - Modify")
        } else if (selectedOption === "tag") {
          await updateTagList(projectId, {
            tagList: [...formValues.priority.map((ele: string) => ele.trim())],
          });
          CustomToast("Options updated successfully","success");
          customLogger.logInfo("Tags - Modify")
        }
        setConfigEnabled(true);
        setShowbutton(false);
      } catch (error: any) {
        if (error && error?.success === false) {
          if (error.message === "Forbidden Access") {
            CustomToast("You don't have access. Contact Admin.","error");
          } else {
            CustomToast("Project Config could not be updated","error");
          }
          setConfigEnabled(true);
        }
      }
    }
  };
  const deleteUser = (rowData: any) => {
    const email = rowData?.email?.toLocaleLowerCase();
    removeProjectUser(email, rowData.projectId as string)
      .then((response) => {
        if (response?.success === true) {
          CustomToast(response?.message,"success");
          //update current proj list

          projects.splice(
            projects.findIndex((prj: any) => {
              if (prj._id === projectId) return true;
            }),
            1
          );
          //setProjects([].concat(updateProjectsList))
          setSearchTableData([].concat(projects));
        }
      })
      .catch((error) => {
        if (error.success === false) {
          // toast.error(error?.message);
          CustomToast("You don't have access. Contact Admin.","error");
        }
      });
  };

  const handleChatHover = () => {
    setChatHovered(true);
  };

  const handleChatHoverEnd = () => {
    setChatHovered(false);
  };
  const onDelete = (projectId: string, role: string) => {
    if (role === "admin") {
      deleteProject(projectId)
        .then((res) => {
          const updatedProjects = searchTableData.filter(
            (project: any) => project._id !== projectId
          );
          setProjects(updatedProjects);
          setSearchTableData(updatedProjects);
          CustomToast(res.message, "success");
        })
        .catch((err) => {
          CustomToast(err, 'error');
        });
    } else {
      CustomToast("Only Admin can delete the project", "success");
    }
  };
  

 
  return (
    <div className=" w-full  h-full">
      <div className="w-full">
        {!isFullScreen && (
          <Header breadCrumbData={breadCrumbsData} hideSidePanel />
        )}
      </div>
      <div className={`${isGridView ? "grid-background" : ""}`}>
        <Content>
          <ProjectsListContainer>
            <ProjectsHeader>
              <HeaderLabel>Project(s) </HeaderLabel>
              <HeaderActions>
              <Button onClick={()=>{
    Mixpanel.track( {name: "create_new_project_clicked",project_id:"unknown",company_id:"unknown",screen_name:"onboarding_page",event_category:"create_new_project",event_action:"create_new_project_clicked",user_id:userId._id})
                router.push("project-onboarding")
                }} style={{backgroundColor:"#FF853E",marginRight:"22px",color:"white"}}>+ Create New Project</Button>
                {isSearching ? (
                  <SearchAreaContainer marginRight>
                    <CustomSearchField
                      placeholder="Search for Projects"
                      variant="outlined"
                      value={searchTerm}
                      autoFocus={true}
                      onChange={(e:any) => {
                        setSearchTerm(e.target.value);
                        setSearchTableData(
                          projects.filter((each: any) =>
                            each?.projectName
                              ?.toLowerCase()
                              ?.includes(e.target?.value?.toLowerCase())
                          )
                        );
                        setIsFilterApplied(false);
                        setTaskFilterState({});
                      }}
                      InputLabelProps={{ shrink: false }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={SearchBoxIcon} alt="" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="start">
                            <CloseIcon
                              onClick={() => {
                                handleSearchWindow();
    Mixpanel.track( {name: "search_closed",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"search_flow",event_action:"search_closed",user_id:userId._id})
                              }}
                              src={CrossIcon}
                              alt={"close icon"}
                              data-testid="search-close"
                            />
                          </InputAdornment>
                        ),
                      }}
                      // inputProps={{
                      //   autoFocus: true,
                      // }}
                    />
                  </SearchAreaContainer>
                ) : (
                  <Tooltip title={"Search"}>
                  <HeaderImage
                    src={searchIcon}
                    alt=""
                    width={24}
                    height={24}
                    onClick={() => {
                      setIsSearching(true);
    Mixpanel.track( {name: "search_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"search_flow",event_action:"search_clicked",user_id:userId._id})
                    }}
                  />
                  </Tooltip>
                )}
                {isGridView ? (
                   <Tooltip title={"Sort"}>
                  <div>
                 <CustomMenu
                    width={24}
                    height={24}
                    right="20px"
                    imageSrc={sortIcon}
                    menuOptions={sortMenuOptions}
                  />
                  </div>
                  </Tooltip>
                ) : (
                  <></>
                )}
                <Tooltip title={"Filter"}>
                <HeaderImage
                  src={UserFilterIcon}
                  alt=""
                  width={24}
                  height={24}
                  onClick={() => {
                    setOpenFilter(true);
    Mixpanel.track( {name: "filters_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"filters",event_action:"filters_clicked",user_id:userId._id})
                  }}
                />
                </Tooltip>
                {isFilterApplied ? <FilterIndicator /> : <></>}
                <ToggleButtonContainer id="view-options">
                  <Tooltip title={"Grid View"}>
                    <GridViewButton
                      onClick={() => {
                        setIsGridView(true);
            Mixpanel.track( {name: "grid_view_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"projects_list",event_action:"grid_view_clicked",user_id:userId._id,layout:"grid",projects_count:projects.length})
                      }}
                      toggleStatus={isGridView}
                      data-testid="design-button"
                    >
                      <GridButton
                        src={isGridView ? selectGridViewIcon : unselectGridIcon}
                        alt=""
                      />
                    </GridViewButton>
                  </Tooltip>

                  <Tooltip title={"List View"}>
                    <GridViewButtonRight
                      onClick={() => {
                        setIsGridView(false);
            Mixpanel.track( {name: "list_view_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"projects_list",event_action:"list_view_clicked",user_id:userId._id,layout:"list",projects_count:projects.length})
                      }}
                      toggleStatus={!isGridView}
                      data-testid="design-button"
                    >
                      <GridButton
                        src={isGridView ? listViewIcon : selectListIcon}
                        alt=""
                      />
                    </GridViewButtonRight>
                  </Tooltip>
                </ToggleButtonContainer>
              </HeaderActions>
            </ProjectsHeader>
           {showLoading ? (
            //<></>
              <CustomLoader />
            ) : showWelcomMessage ? (
            <ProjectCardsContainer>
              <div className="flex justify-center items-center calc-h146 mx-auto">
                <ShowErrorContainer>
                  <CenteredErrorImage src={projectHierIcon} alt="" />
                  <NoResultText>
                    No Project Has Been Assigned To You
                  </NoResultText>
                </ShowErrorContainer>
              </div>
             </ProjectCardsContainer>
            ) : isGridView ? (
              <ProjectListCardView
                projects={searchTableData}
                projectActions={projectActions}
                truncateString={truncateString}
                onDelete={onDelete}
                d2Details={d2Details}
                userId={userId}
              />
            ) : (
              <ProjectListFlatView
                projects={searchTableData}
                projectActions={projectActions}
                truncateString={truncateString}
                onDelete={onDelete}
                userId={userId}
              />
            )}
            {openFilter && (
              <CustomDrawer open variant="persistent">
                {       Mixpanel.track( {name: "filters_window_loaded",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"filters",event_action:"filters_window_loaded",user_id:userId._id})        }
                <ProjectListFilter
                  taskFilterState={taskFilterState}
                  onClose={() => {
                    setOpenFilter(false);
                    Mixpanel.track( {name: "filters_window_closed",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"filters",event_action:"filters_window_closed",user_id:userId._id})        
                  }}
                  handleOnApplyFilter={(formState: any) =>
                    handleFilter(formState)
                  }
                  setTaskFilterState={setTaskFilterState}
                  setIsFilterApplied={setIsFilterApplied}
                  setSearchTerm={setSearchTerm}
                  user={userId}
                />
              </CustomDrawer>
            )}
            {showPopUp && (
              <PopupComponent
                open={showPopUp}
                width={"585px"}
                // height={"360px"}
                paddingstyle={true}
                setShowPopUp={setshowPopUp}
                modalTitle={"Project Configuration"}
                modalContent={
                  <ProjectConfig
                    projectId={projectId}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    setShowbutton={setShowbutton}
                  />
                }
                // modalmessage={`Are you sure you want to delete this Issue "${selectedIssue?.type}(#${selectedIssue?._id})"?`}
                modalmessage={`Are you sure you want to delete this Issue ?`}
                primaryButtonLabel={"Update"}
                SecondaryButtonlabel={"Cancel"}
                callBackvalue={handleSubmit}
                projectId={projectId}
                showbutton={showButton}
                setShowbutton={setShowbutton}
                setSelectedOption={setSelectedOption}
              />
            )}
          </ProjectsListContainer>
        </Content>
      </div>

      {showAddUser || showArchiveProject ? (
        <PopupComponent
          open={showAddUser ? showAddUser : showArchiveProject}
          hideButtons
          setShowPopUp={showAddUser ? setShowAddUser : setShowArchiveProject}
          modalTitle={
            showAddUser ? "Add User(s) to the Project" : "Deassign Project"
          }
          modalContent={
            showAddUser ? (
              <AddUsersEmailPopup showEmailOverlay={showEmailOverlay} />
            ) : (
              ""
            )
          }
          modalmessage={
            showAddUser
              ? ""
              : "Are you sure you want to deassign yourself from this project?"
          }
          primaryButtonLabel={showAddUser ? "Yes" : "Yes"}
          SecondaryButtonlabel={showAddUser ? "No" : "No"}
          callBackvalue={
            showAddUser
              ? () => {}
              : () => {
                  deleteUser({ email: eMail, projectId: projectId });
                  setShowArchiveProject(false);
                }
          }
          width={"458px"}
          backdropwidth={true}
          showbutton={showAddUser ? false : true}
        />
      ) : (
        <></>
      )}
      <Drawer
        anchor={"right"}
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
      >
        <AddUsersEmailOverlay
          form={form}
          setOpenDrawer={setOpenDrawer}
          roles={roles}
          selectedProjectId={selectedProjectId}
        />
      </Drawer>
     
        <div ref={chatIconRef} id="chatSupport"
         className="group fixed bottom-[20px] left-2 z-10 cursor-pointer rounded-full bg-[#FF843F] p-2 "
         > 
         <Image
                    src={chatOpenHightlighted }
                    className="group-hover:opacity-100 opacity-70"
                    width={36}
                    height={36}
                    alt=""
                    onClick={handleOpenChat}
                  />
      </div>
      </div>

    
  );
};
export default Index;
