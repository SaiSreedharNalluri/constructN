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
import {
  CenteredErrorImage,
  NoResultText,
  ProjectCardsContainer,
} from "../../components/divami_components/project-listing/ProjectListingStyles";
import { ProjectListCardView } from "../../components/divami_components/project-listing/ProjectListCardView";
import { ProjectListFlatView } from "../../components/divami_components/project-listing/ProjectListFlatView";
import moment from "moment";
import {
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
import { Tooltip } from "@material-ui/core";

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

import { getCookie } from "cookies-next";
import { ShowErrorContainer } from "../../components/divami_components/project-listing/ProjectListingStyles";

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
  const [configEnabled, setConfigEnabled] = useState(true);
  const [showWelcomMessage, setShowWelcomeMessage] = useState(false);
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
        setSearchTableData([
          ...projects.sort((a: any, b: any) => {
            return (
              new Date(a.updatedAt).valueOf() - new Date(b.updatedAt).valueOf()
            );
          }),
        ]);
      },
    },
    {
      label: "Sort by Last Updated",
      icon: DownArrow,
      method: "updatedDesc",
      onClick: () => {
        setSearchTableData([
          ...projects.sort((a: any, b: any) => {
            return (
              new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
            );
          }),
        ]);
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
      action: (id: string) => {
        setShowArchiveProject(true);
        setProjectId(id);
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
          (Moment(each.updatedAt).isSameOrBefore(formState.dueDate) || //.format("YYYY-MM-DD") <= formState.dueDate ||
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
    e.stopPropagation()
    openChat();
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
        .catch((error) => {
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
    }
  }, [router.isReady]);

  useEffect(() => {
    setSearchTableData(projects);
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
        } else if (selectedOption === "taskPriority") {
          await updateTaskPriorityList(projectId, {
            taskPriorityList: [
              ...formValues.priority.map((ele: string) => ele.trim()),
            ],
          });
          CustomToast("Options updated successfully","success");
        } else if (selectedOption === "issueStatus") {
          await updateIssueStatusList(projectId, {
            issueStatusList: [
              ...formValues.priority.map((ele: string) => ele.trim()),
            ],
          });
          CustomToast("Options updated successfully","success");
        } else if (selectedOption === "taskStatus") {
          await updateTaskStatusList(projectId, {
            taskStatusList: [
              ...formValues.priority.map((ele: string) => ele.trim()),
            ],
          });
          CustomToast("Options updated successfully","success");
        } else if (selectedOption === "tag") {
          await updateTagList(projectId, {
            tagList: [...formValues.priority.map((ele: string) => ele.trim())],
          });
          CustomToast("Options updated successfully","success");
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
  const ChatOpenIcon:any = () => (
    <div
      style={{
        width: "30px",
        height: "30px",
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
                      autoFocus={true}
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
                      // inputProps={{
                      //   autoFocus: true,
                      // }}
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
                <ToggleButtonContainer id="view-options">
                  <Tooltip title={"Grid View"}>
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
                  </Tooltip>

                  <Tooltip title={"List View"}>
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
                  </Tooltip>
                </ToggleButtonContainer>
              </HeaderActions>
            </ProjectsHeader>
           {showLoading ? (
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
              />
            ) : (
              <ProjectListFlatView
                projects={searchTableData}
                projectActions={projectActions}
                truncateString={truncateString}
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
      <div className="fixed bottom-0 left-2 z-10 cursor-pointer rounded-full bg-[#FF843F] p-2">
        <div   onClick={handleOpenChat} className=" fill-[#515151] hover:fill-white">
          <ChatOpenIcon></ChatOpenIcon>
      </div>
      </div>
    </div>
    
  );
};
export default Index;
