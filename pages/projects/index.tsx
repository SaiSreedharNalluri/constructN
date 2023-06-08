import { ProjectListing } from "../../components/divami_components/project-listing/ProjectListing";
import { useEffect, useState } from "react";
import Header from "../../components/divami_components/header/Header";
import {
  Content,
  ProjectsListContainer,
} from "../../components/divami_components/project-users-list/usersListStyles";
import { InputAdornment, Menu } from "@mui/material";
import {
  HeaderActions,
  HeaderImage,
  GridViewButton,
  ToggleButtonContainer,
  GridButton,
  HeaderLabel,
  ProjectsHeader,
  GridViewButtonRight,
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
import { getProjectsList } from "../../services/project";
import unselectGridIcon from "../../public/divami_icons/unselectGridIcon.svg";
import selectListIcon from "../../public/divami_icons/selectListIcon.svg";
import CustomDrawer from "../../components/divami_components/custom-drawer/custom-drawer";
import ProjectListFilter from "../../components/divami_components/project-listing/ProjectListFilter";
import { CustomMenu } from "../../components/divami_components/custom-menu/CustomMenu";
import UpArrow from "../../public/divami_icons/upArrow.svg";
import DownArrow from "../../public/divami_icons/downArrow.svg";
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
  const [selectedOption, setSelectedOption] = useState("Issue Priority");

  const [formValues, setFormValues]: any = useState({ priority: [] });
  const [showPopUp, setshowPopUp] = useState(false);

  const [taskFilterState, setTaskFilterState] = useState({
    isFilterApplied: false,
    filterData: {},
    numberOfFilters: 0,
  });

  const [projectId, setProjectId] = useState<any>("");

  const handleSearchWindow = () => {
    setSearchTableData(projects);
    if (searchTerm === "") {
      setIsSearching(!isSearching);
    } else {
      setSearchTerm("");
    }
  };

  const sortMenuOptions = [
    {
      label: "Sort by User",
      icon: UpArrow,
      method: "userAsc",
      onClick: () => {
        // const sortedData = projects.sort((a, b) => {
        //   if (Number(a.usersCount) < Number(b.usersCount)) {
        //     return -1;
        //   } else if (Number(a.usersCount) < Number(b.usersCount)) {
        //     return 1;
        //   } else {
        //     return 0;
        //   }
        // });
        // const sortedData = projects.sort((a, b) => a.usersCount - b.usersCount);
        // console.log(sortedData, "Fsdfd");
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

  const [projectActions, setProjectActions] = useState([
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
      action: () => {},
    },
    {
      label: "Add Users",
      action: () => {
        router.push(`/projects/PRJ201897/usersList`);
      },
    },
    {
      label: "Archive Project",
      action: () => {},
    },
  ]);

  useEffect(() => {
    console.log("projectsData", projects);
  }, [projects]);
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
        })
        .catch((error) => {});
    }
  }, [router.isReady]);

  useEffect(() => {
    setSearchTableData(projects);
  }, [projects]);

  const onDeleteIssue = (status: any) => {
    setshowPopUp(false);
  };

  const handleSubmit = async () => {
    console.log("formaaaa", formValues);

    const containsEmptyString = formValues.priority.some(
      (item: any) => item.length === 0
    );

    if (containsEmptyString) {
      toast.error("Fields cannot be empty");
      console.log("The array contains empty strings.");
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

      // setSubmittedValues(formValues);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className=" w-full  h-full">
      <div className="w-full">
        {!isFullScreen && (
          <Header breadCrumbData={breadCrumbsData} hideSidePanel />
        )}
      </div>
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
                          each?.projectName?.includes(e.target?.value)
                        )
                      );
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
                  // setOpenFilter(true);
                }}
              />
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
          {isGridView ? (
            <ProjectListCardView
              projects={searchTableData}
              projectActions={projectActions}
            />
          ) : (
            <></>
            // <ProjectListFlatView
            //   projects={searchTableData}
            //   projectActions={projectActions}
            // />
          )}
          {openFilter && (
            <CustomDrawer open>
              <ProjectListFilter
                setTaskFilterState={setTaskFilterState}
                taskFilterState={taskFilterState}
                onClose={() => {
                  setOpenFilter(false);
                }}
              />
            </CustomDrawer>
          )}
          {showPopUp && (
            <PopupComponent
              open={showPopUp}
              setShowPopUp={setshowPopUp}
              modalTitle={"Project Configuration"}
              modalContent={
                <ProjectConfig
                  projectId={projectId}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  formValues={formValues}
                  setFormValues={setFormValues}
                />
              }
              // modalmessage={`Are you sure you want to delete this Issue "${selectedIssue?.type}(#${selectedIssue?._id})"?`}
              modalmessage={`Are you sure you want to delete this Issue ?`}
              primaryButtonLabel={"Update"}
              SecondaryButtonlabel={"Cancel"}
              callBackvalue={handleSubmit}
              projectId={projectId}
            />
          )}
        </ProjectsListContainer>
      </Content>
    </div>
  );
};
export default Index;
