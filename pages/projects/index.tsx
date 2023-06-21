import { ProjectListing } from "../../components/divami_components/project-listing/ProjectListing";
import { useEffect, useState } from "react";
import Header from "../../components/divami_components/header/Header";
import {
  Content,
  ProjectsListContainer,
} from "../../components/divami_components/project-users-list/usersListStyles";
import { Drawer, InputAdornment, Menu } from "@mui/material";
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
import { ProjectCardsContainer } from "../../components/divami_components/project-listing/ProjectListingStyles";
import { ProjectListCardView } from "../../components/divami_components/project-listing/ProjectListCardView";
import { ProjectListFlatView } from "../../components/divami_components/project-listing/ProjectListFlatView";
import moment from "moment";
import {
  getProjectsList,
  getProjectUsers,
  getUserRoles,
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
import {
  updateIssuePriorityList,
  updateIssueStatusList,
  updateTagList,
  updateTaskPriorityList,
  updateTaskStatusList,
} from "../../services/projectConfigApi";
import { toast } from "react-toastify";
import Moment from "moment";
import CustomLoader from "../../components/divami_components/custom_loader/CustomLoader";
import React from "react";
import chatOpen from "../../public/divami_icons/chat_open.svg";
import chatClose from "../../public/divami_icons/chat_close.svg";
const Index: React.FC<any> = () => {
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

  const [formValues, setFormValues]: any = useState({ priority: [] });
  const [showPopUp, setshowPopUp] = useState(false);

  const [taskFilterState, setTaskFilterState] = useState({});
  const [showButton, setShowbutton] = useState(false);
  const [projectId, setProjectId] = useState<any>("");
  const [showLoading, setShowLoading] = useState(true);
  let [eMail, setEMail] = useState<string>("");

  const sortMenuOptions = [
    {
      label: "Sort by User",
      icon: UpArrow,
      method: "userAsc",
      onClick: () => {
        setSearchTableData(
          []
            .concat(projects)
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
            .concat(projects)
            .sort((a: any, b: any) => b.usersCount - a.usersCount)
        );
      },
    },

    {
      label: "Sort by Last Updated",
      icon: UpArrow,
      method: "updatedAsc",
      onClick: () => {
        setSearchTableData(
          []
            .concat(projects)
            .sort(
              (a: any, b: any) =>
                Number(new Date(a.lastUpdated)) -
                Number(new Date(b.lastUpdated))
            )
        );
      },
    },
    {
      label: "Sort by Last Updated",
      icon: DownArrow,
      method: "updatedDesc",
      onClick: () => {
        setSearchTableData(
          []
            .concat(projects)
            .sort(
              (a: any, b: any) =>
                Number(new Date(b.lastUpdated)) -
                Number(new Date(a.lastUpdated))
            )
        );
      },
    },
  ];

  const projectActions = [
    {
      label: "View Project Summary",
      action: (id?: string) => {
        router.push(`/projects/${id}/sections`);
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
        router.push(`/projects/${id}/settings`);
      },
    },
    {
      label: "Manage Users",
      action: (id: string) => {
        router.push(`/projects/${id}/usersList`);
      },
    },
    {
      label: "Deassign Project",
      action: () => {
        setShowArchiveProject(true);
      },
    },
  ];

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
        (each: any) =>
          (Moment(each.updatedAt).isSameOrAfter(formState.startDate) || //.format("YYYY-MM-DD") >= formState.startDate ||
            !formState.startDate) &&
          (Moment(each.updatedAt).isSameOrBefore(formState.dueDate) ||//.format("YYYY-MM-DD") <= formState.dueDate ||
            !formState.dueDate) &&
          (!formState.compareText ||
            (formState.compareText === "greaterThan"
              ? each.numberOfUsers > formState.numOfMem
              : formState.compareText === "lessThan"
              ? each.numberOfUsers < formState.numOfMem
              : each.numberOfUsers == formState.numOfMem))
      )
    );
  };

  const handleOpenChat = (e: any) => {
        openChat();
        setChatStatus(!isChatActive);
  
  }
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

  const showEmailOverlay = (formState: any) => {
    setShowAddUser(false);
    setOpenDrawer(true);
    setForm(formState);
  };

  useEffect(() => {
    if (router.isReady) {
      getProjectsList()
        .then(async (response) => {
          if (response?.data?.success === true) {
            const projectsData = response?.data?.result.map((each: any) => {
              return {
                ...each,
                companyLogo: each.coverPhoto,
                projectName: each.name,
                userName: each.userName,
                numberOfUsers: each.usersCount,
                updatedAt: moment(each.lastUpdated).format("DD MMM YY"),
                lastUpdated: new Date(each.lastUpdated),
                capture360Count: each?.captures["360 Image"]
                  ? `${each?.captures["360 Image"]}`
                  : "0",
                captureVideoWalkCount: each?.captures["360 Video"]
                  ? `${each?.captures["360 Video"]}`
                  : "0",
                capturePhoneCount: each?.captures["Phone Image"]
                  ? `${each?.captures["Phone Image"]}`
                  : "0",
                captureLidarCount: each?.captures["LiDAR Scan"]
                  ? `${each?.captures["LiDAR Scan"]}`
                  : "0",
                captureDroneCount: each?.captures["Drone Image"]
                  ? `${each?.captures["Drone Image"]}`
                  : "0",
              };
            });

            setProjects(projectsData);
          }
          setShowLoading(false);
        })
        .catch((error) => {});
      getUserRoles().then((res: any) => {
        const rolesData = res.result.map((each: any) => {
          return {
            label: each,
            value: each,
          };
        });
        setRoles(rolesData);
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    setSearchTableData(projects);
  }, [projects]);

  const onDeleteIssue = (status: any) => {
    setshowPopUp(false);
  };

  const handleSubmit = async () => {
    const containsEmptyString = formValues.priority.some(
      (item: any) => item.length === 0
    );

    if (containsEmptyString) {
      toast.error("Fields cannot be empty");
      return;
    }
    try {
      // Call the appropriate API based on the selected option and pass the updated values
      if (selectedOption === "issuePriority") {
        // await updateIssuePriorityList(projectId, formValues.priority);
        await updateIssuePriorityList(projectId, {
          issuePriorityList: [...formValues.priority],
        });
        toast.success("Issue priority list updated successfully");
      } else if (selectedOption === "taskPriority") {
        await updateTaskPriorityList(projectId, {
          taskPriorityList: [...formValues.priority],
        });
        toast.success("Task priority list updated successfully");
      } else if (selectedOption === "issueStatus") {
        await updateIssueStatusList(projectId, {
          issueStatusList: [...formValues.priority],
        });
        toast.success("Issue status list updated successfully");
      } else if (selectedOption === "taskStatus") {
        await updateTaskStatusList(projectId, {
          taskStatusList: [...formValues.priority],
        });
        toast.success("Task status list updated successfully");
      } else if (selectedOption === "tag") {
        await updateTagList(projectId, {
          tagList: [...formValues.priority],
        });
        toast.success("Tag list updated successfully");
      }
      setShowbutton(false);
      // setSubmittedValues(formValues);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const [isChatActive,setChatStatus] = React.useState(false);
  const [supportItemsConfig, setSupportItemsConfig] = React.useState([
    {
      id:"chatSupport",
      icon:chatOpen,
      isActive:false,
      activeIcon:chatClose,
      toolTipMsg:"Chat Support",
    },
  ]);
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
                {isSearching ? (
                  <SearchAreaContainer marginRight>
                    <CustomSearchField
                      placeholder="Search"
                      variant="outlined"
                      value={searchTerm}
                      onChange={(e) => {
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
                              }}
                              src={CrossIcon}
                              alt={"close icon"}
                              data-testid="search-close"
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </SearchAreaContainer>
                ) : (
                  <HeaderImage
                    src={searchIcon}
                    alt=""
                    width={24}
                    height={24}
                    onClick={() => {
                      setIsSearching(true);
                    }}
                  />
                )}
                {isGridView ? (
                  <CustomMenu
                    width={24}
                    height={24}
                    right="20px"
                    imageSrc={sortIcon}
                    menuOptions={sortMenuOptions}
                  />
                ) : (
                  <></>
                )}
                <HeaderImage
                  src={UserFilterIcon}
                  alt=""
                  width={24}
                  height={24}
                  onClick={() => {
                    setOpenFilter(true);
                  }}
                />
                {isFilterApplied ? <FilterIndicator /> : <></>}
                <ToggleButtonContainer>
                  <GridViewButton
                    onClick={() => {
                      setIsGridView(true);
                    }}
                    toggleStatus={isGridView}
                    data-testid="design-button"
                  >
                    <GridButton
                      src={isGridView ? selectGridViewIcon : unselectGridIcon}
                      alt=""
                    />
                  </GridViewButton>
                  <GridViewButtonRight
                    onClick={() => {
                      setIsGridView(false);
                    }}
                    toggleStatus={!isGridView}
                    data-testid="design-button"
                  >
                    <GridButton
                      src={isGridView ? listViewIcon : selectListIcon}
                      alt=""
                    />
                  </GridViewButtonRight>
                </ToggleButtonContainer>
              </HeaderActions>
            </ProjectsHeader>
            <div className="fixed bottom-0 left-2 z-10 cursor-pointer"> 
            {isChatActive ? (
                 
                 <Image
                   
                   src={chatOpen}
                   width={60}
                   height={60}
                   alt=""
                   onClick={handleOpenChat}
                 />
              
             ) : (
               <Image
                 src={chatOpen}
                 width={60}
                 height={60}
                 alt=""
                 onClick={handleOpenChat}
               />
             )}
            </div>

   
            {showLoading ? (
              <CustomLoader />
            ) : isGridView ? (
              <ProjectListCardView
                projects={searchTableData}
                projectActions={projectActions}
              />
            ) : (
              <ProjectListFlatView
                projects={searchTableData}
                projectActions={projectActions}
              />
            )}
            {openFilter && (
              <CustomDrawer open variant="persistent">
                <ProjectListFilter
                  taskFilterState={taskFilterState}
                  onClose={() => {
                    setOpenFilter(false);
                  }}
                  handleOnApplyFilter={(formState: any) =>
                    handleFilter(formState)
                  }
                  setTaskFilterState={setTaskFilterState}
                  setIsFilterApplied={setIsFilterApplied}
                  setSearchTerm={setSearchTerm}
                />
              </CustomDrawer>
            )}
            {showPopUp && (
              <PopupComponent
                open={showPopUp}
                width={"585px"}
                // height={"360px"}
                paddingStyle={true}
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
                showButton={showButton}
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
            showAddUser ? "Add users to the project" : "Deassign Project"
          }
          modalContent={
            showAddUser ? (
              <AddUsersEmailPopup showEmailOverlay={showEmailOverlay} />
            ) : (
              ""
            )
          }
          modalmessage={
            showAddUser ? "" : "Are you sure you want to deassign yourself from this project?"
          }
          primaryButtonLabel={showAddUser ? "Yes" : "Yes"}
          SecondaryButtonlabel={showAddUser ? "No" : "No"}
          callBackvalue={
            showAddUser
              ? () => {}
              : () => {
                  setShowArchiveProject(false);
                }
          }
          width={"458px"}
          backdropWidth={true}
          showButton={showAddUser ? false : true}
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
      
    </div>
  );
};
export default Index;
