import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
// ../styles/Home.module.css
import Image from "next/image";
// import dividerIcon from "../../../public/images/dividerIcon.svg";
// import filterFunnelIcon from "../../../public/images/filterFunnelIcon.svg";
import _ from "lodash";
import Moment from "moment";
import router from "next/router";
import { CSVLink } from "react-csv";
import { ITasks } from "../../../models/Itask";
import AppliedFilterIcon from "../../../public/divami_icons/appliedFilter.svg";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import DividerSvg from "../../../public/divami_icons/divider.svg";
import DownArrow from "../../../public/divami_icons/downArrow.svg";
import Download from "../../../public/divami_icons/download.svg";
import FilterInActive from "../../../public/divami_icons/filterInactive.svg";
import RFIList from "../../../public/divami_icons/rfiList.svg";
import {
  default as Search,
  default as SearchBoxIcon,
} from "../../../public/divami_icons/search.svg";
import sort from "../../../public/divami_icons/sort.svg";
import SubmittalList from "../../../public/divami_icons/submittalList.svg";
import TransmittalList from "../../../public/divami_icons/transmittalList.svg";
import UpArrow from "../../../public/divami_icons/upArrow.svg";
import { getProjectUsers } from "../../../services/project";
import {
  getTasksPriority,
  getTaskStatus,
  getTasksTypes,
} from "../../../services/task";
import TaskFilterCommon from "../task-filter-common/TaskFilterCommon";
import CustomTaskDetailsDrawer from "../task_detail/TaskDetail";
import {
  AppliedFilter,
  ArrowDownIcon,
  ArrowUpIcon,
  BodyContainer,
  BodyContTitle,
  BodyInfo,
  CloseIcon,
  ContentError,
  ContentErrorSpan,
  CustomBox,
  CustomSearchField,
  DividerIcon,
  DownloadIcon,
  DueDate,
  DueDateDiv,
  ErrorImageDiv,
  FilterIcon,
  FirstHeader,
  HeaderContainer,
  HorizontalLine,
  IconContainer,
  ImageErrorIcon,
  MessageDiv,
  MessageDivShowErr,
  MiniHeaderContainer,
  MiniSymbolsContainer,
  NoMatchDiv,
  RaiseButtonDiv,
  SearchAreaContainer,
  SearchGlassIcon,
  SecondDividerIcon,
  SecondHeader,
  StyledMenu,
  TaskListContainer,
  ThirdHeader,
  TitleContainer,
  LoadMoreText,
} from "./TaskListStyles";
import {
  Box,
  Divider,
  Drawer,
  InputAdornment,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import listingErrorIcon from "../../../public/divami_icons/listingErrorIcon.svg";
import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";
import { toast } from "react-toastify";
import { ITools } from "../../../models/ITools";
import {
  downloadMenuOptions,
  getDownladableList,
} from "../issue-listing/Constants";
import { DownloadTable } from "../toolbar/DownloadTable";
import { MenuOptionLabel } from "../issue-listing/IssueListStyles";

interface IProps {
  closeOverlay: () => void;
  tasksList: ITasks[];
  visibility: boolean;
  handleOnFilter: (formData: object) => void;
  handleOnSort: (sortMethod: string) => void;
  closeFilterOverlay: () => void;
  deleteTheIssue: (issueObj: object) => void;
  clickIssueEditSubmit: (editObj: object, issueObj: object) => void;
  onClose: any;
  taskFilterState: any;
  deleteTheAttachment?: any;
}

const CustomTaskListDrawer = (props: any) => {
  const {
    onClose,
    tasksList,
    taskMenuClicked,
    currentProject,
    currentStructure,
    currentSnapshot,
    contextInfo,
    closeTaskFilterOverlay,
    handleOnTaskFilter,
    deleteTheTask,
    taskFilterState,
    getTasks,
    handleOnTasksSort,
    deleteTheAttachment,
    openTaskCreateFn,
  } = props;
  const [taskType, setTaskType] = useState<[string]>();
  const [taskPriority, setTaskPriority] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState([]);
  const [taskStatus, setTaskStatus] = useState<[string]>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [viewTask, setViewTask] = useState<any>({});
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [searchingOn, setSearchingOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [filteredTaskList, setFilteredTaskList] = useState(
    taskList.slice(0, 10)
  );
  const [sortOrder, setSortOrder] = useState("asc");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [remainingTasks, setRemainingtasks] = useState(taskList?.length);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let taskMenuInstance: ITools = { toolName: "task", toolAction: "" };
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [downloadList, setDownloadList] = useState(taskList);

  const sortMenuOptions = [
    {
      label: "Status ( To Do - Completed)",
      icon: null,
      method: "status_asc",
    },
    {
      label: "Status ( Completed - To Do)",
      icon: null,
      method: "status_desc",
    },

    {
      label: "Priotity ( High - Low)",
      icon: null,
      method: "Dsc Priority",
    },
    {
      label: "Priotity ( Low - High)",
      icon: null,
      method: "Asc Priority",
    },
    {
      label: "Due Date ",
      icon: UpArrow,
      method: "Dsc DueDate",
    },
    {
      label: "Due Date ",
      icon: DownArrow,
      method: "Asc DueDate",
    },
  ];
  const [errorShow, setErrorShow] = useState<any>(tasksList);

  useEffect(() => {
    setTaskList(tasksList);
    setDownloadList(tasksList);
  }, [tasksList]);

  useEffect(() => {
    setFilteredTaskList(taskList.slice(0, 10));
  }, [taskList]);

  useEffect(() => {
    setRemainingtasks(taskList?.length);
  }, [taskList]);

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setIsSortMenuOpen(false);
    setAnchorEl(null);
  };

  const handleDownloadClose = () => {
    setIsDownloadMenuOpen(false);
    setAnchorEl(null);
  };

  const handleSortMenuClick = (sortMethod: string) =>
    handleOnTasksSort(sortMethod);

  const handleViewTaskList = () => {
    setOpenDrawer(true);
  };

  const handleClose = () => {
    onClose(true);
  };

  useEffect(() => {
    if (router.isReady) {
      getTasksTypes(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskType(response.result);
        }
      });
      getTasksPriority(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskPriority(response.result);
        }
      });
      getProjectUsers(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setProjectUsers(response.result);
          }
        })
        .catch();
      getTaskStatus(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskStatus(response.result);
        }
      });
    }
  }, []);

  // const sortDateOrdering = () => {
  //   let sorted;
  //   if (sortOrder === "asc") {
  //     sorted = filteredTaskList.sort((a: any, b: any) => {
  //       return new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf();
  //     });
  //     setSortOrder("desc");
  //   } else {
  //     sorted = filteredTaskList.sort((a: any, b: any) => {
  //       return new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf();
  //     });
  //     setSortOrder("asc");
  //   }
  //   setFilteredTaskList(sorted);
  // };

  const handleViewTask = (task: any) => {
    filteredTaskList.forEach((item: any) => {
      if (task._id === item._id) {
        setViewTask(item);
      }
    });
    setOpenTaskDetail(true);
    taskMenuInstance.toolAction = "taskSelect";
    taskMenuInstance.response = { ...task.context, id: task._id };
    taskMenuClicked(taskMenuInstance);
  };

  const handleSearchWindow = () => {
    if (searchTerm === "") {
      setSearchingOn(!searchingOn);
    } else {
      setSearchTerm("");
    }
  };

  const handleSearch = () => {
    if (searchTerm) {
      const filteredData = taskList?.filter((eachTask: any) => {
        const taskName = eachTask?.type?.toLowerCase();
        const sequenceNumber = eachTask?.sequenceNumber.toString();
        return (
          taskName.includes(searchTerm.toLowerCase()) ||
          sequenceNumber.includes(searchTerm.toLowerCase())
        );
      });
      setDownloadList(filteredData);

      setFilteredTaskList([...filteredData.slice(0, 10)]);
    } else {
      setFilteredTaskList(taskList.slice(0, 10));
    }
  };

  const handleLoadMore = () => {
    const noOfTasksLoaded = filteredTaskList.length;

    if (searchTerm) {
      const filteredData = taskList?.filter((eachTask: any) => {
        const taskName = eachTask?.type?.toLowerCase();
        const sequenceNumber = eachTask?.sequenceNumber.toString();
        return (
          taskName.includes(searchTerm.toLowerCase()) ||
          sequenceNumber.includes(searchTerm.toLowerCase())
        );
      });
      setRemainingtasks(filteredData?.length - (noOfTasksLoaded + 10));
      setFilteredTaskList([...filteredData.slice(0, noOfTasksLoaded + 10)]);
    } else {
      setFilteredTaskList(taskList.slice(0, noOfTasksLoaded + 10));
      setRemainingtasks(taskList?.length - (noOfTasksLoaded + 10));
    }
  };

  useEffect(() => {
    if (router.isReady) {
      getProjectUsers(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setProjectUsers(response.result);
          }
        })
        .catch();
    }
  }, [router.isReady, router.query.projectId]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    if (viewTask?._id) {
      filteredTaskList.forEach((item: any) => {
        if (viewTask._id === item._id) {
          setViewTask(item);
        }
      });
    }
  }, [filteredTaskList]);

  return (
    <TaskListContainer>
      {errorShow.length > 0 ? (
        <>
          <HeaderContainer>
            <TitleContainer>
              <span>Task List</span>
              <CloseIcon
                onClick={() => {
                  handleClose();
                }}
                src={CrossIcon}
                alt={"close icon"}
                data-testid="close-icon"
              />
            </TitleContainer>
          </HeaderContainer>

          <MiniHeaderContainer searchingOn={searchingOn}>
            <MiniSymbolsContainer>
              {searchingOn ? (
                <SearchAreaContainer>
                  <CustomSearchField
                    placeholder="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
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
                <>
                  <SearchGlassIcon
                    src={Search}
                    data-testid="search-icon"
                    alt={"close icon"}
                    onClick={() => setSearchingOn((prev) => !prev)}
                  />
                  <DividerIcon src={DividerSvg} alt="" />
                  {taskFilterState.isFilterApplied ? (
                    <AppliedFilter>
                      {taskFilterState.numberOfFilters} Filters{" "}
                      <FilterIcon
                        src={AppliedFilterIcon}
                        alt="Arrow"
                        onClick={() => {
                          handleViewTaskList();
                        }}
                      />
                    </AppliedFilter>
                  ) : null}
                  <Tooltip title="Sort Menu">
                    <IconContainer
                      src={sort}
                      alt="Arrow"
                      onClick={(e) => {
                        setIsSortMenuOpen((prev) => !prev);
                        handleSortClick(e);
                      }}
                      data-testid="sort"
                    />
                  </Tooltip>
                  {/* {sortOrder === "asc" ? (
                    <>
                      <ArrowUpIcon
                        onClick={() => {
                          sortDateOrdering();
                        }}
                        src={UpArrow}
                        alt="Arrow"
                      />
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon
                        onClick={() => {
                          sortDateOrdering();
                        }}
                        src={DownArrow}
                        alt="Arrow"
                      />
                    </>
                  )}
                  <DueDate>Due Date</DueDate> */}

                  <SecondDividerIcon src={DividerSvg} alt="" />

                  {!taskFilterState.isFilterApplied ? (
                    <IconContainer
                      src={FilterInActive}
                      alt="Arrow"
                      onClick={() => {
                        handleViewTaskList();
                      }}
                      data-testid="filter"
                    />
                  ) : null}
                  {/* <Tooltip title="Download Menu">
                    <DownloadIcon
                      src={Download}
                      alt="Arrow"
                      onClick={(e) => {
                        setIsDownloadMenuOpen((prev) => !prev);
                        handleSortClick(e);
                      }}
                    />
                  </Tooltip> */}
                  <CSVLink
                    data={getDownladableList(filteredTaskList)}
                    filename={"my-tasks.csv"}
                    className="text-black btn btn-primary fill-black fa fa-Download "
                    target="_blank"
                    data-testid="download"
                  >
                    <DownloadIcon src={Download} alt="Arrow" />
                  </CSVLink>
                </>
              )}
            </MiniSymbolsContainer>
          </MiniHeaderContainer>

          <BodyContainer>
            <CustomBox searchingOn={searchingOn}>
              {filteredTaskList.length > 0 ? (
                filteredTaskList.map((val: any) => {
                  return (
                    <>
                      <BodyInfo
                        data-testid="item-body"
                        onClick={() => {
                          handleViewTask(val);
                        }}
                      >
                        <FirstHeader>
                          <Image
                            src={
                              val.type === "RFI"
                                ? RFIList
                                : val.type === "Transmittals"
                                ? TransmittalList
                                : val.type === "Submittals"
                                ? SubmittalList
                                : val.type === "Transmittals"
                                ? TransmittalList
                                : val.type === "Transmittals"
                                ? TransmittalList
                                : ""
                            }
                            alt="Arr"
                          />
                          <BodyContTitle>
                            {val.type} (#{val.sequenceNumber})
                          </BodyContTitle>
                        </FirstHeader>
                        <SecondHeader>
                          <div>{val.priority} Priority</div>
                        </SecondHeader>
                        <ThirdHeader>
                          <div>{val.assignee}</div>
                          <DueDateDiv>
                            Due by {Moment(val.due_date).format("DD MMM 'YY")}
                          </DueDateDiv>
                        </ThirdHeader>
                      </BodyInfo>
                      <HorizontalLine></HorizontalLine>
                    </>
                  );
                })
              ) : (
                // <MessageDiv>
                //   <p>No task matches the search</p>
                // </MessageDiv>
                <NoMatchDiv>
                  <ImageErrorIcon src={projectHierIcon} alt="Error Image" />
                  <MessageDivShowErr>No result found</MessageDivShowErr>
                </NoMatchDiv>
              )}
              {remainingTasks > 0 ? (
                <LoadMoreText
                  onClick={() => {
                    handleLoadMore();
                  }}
                >
                  Load More
                </LoadMoreText>
              ) : null}
            </CustomBox>
          </BodyContainer>
          {/* <LoadMoreContainer>
        <LoadMoreButton>Load More</LoadMoreButton>
      </LoadMoreContainer> */}
          {openTaskDetail && (
            <Drawer
              anchor={"right"}
              open={openTaskDetail}
              onClose={() => setOpenTaskDetail((prev: any) => !prev)}
            >
              <CustomTaskDetailsDrawer
                taskList={tasksList}
                task={viewTask}
                onClose={() => setOpenTaskDetail((prev: any) => !prev)}
                taskType={taskType}
                taskPriority={taskPriority}
                taskStatus={taskStatus}
                projectUsers={projectUsers}
                deleteTheTask={deleteTheTask}
                currentProject={currentProject}
                currentStructure={currentStructure}
                currentSnapshot={currentSnapshot}
                contextInfo={contextInfo}
                getTasks={getTasks}
                deleteTheAttachment={deleteTheAttachment}
              />
            </Drawer>
          )}

          {openDrawer && (
            <Drawer
              anchor={"right"}
              open={openDrawer}
              onClose={() => setOpenDrawer((prev: any) => !prev)}
            >
              <TaskFilterCommon
                tasksList={tasksList}
                // taskMenuClicked={taskMenuClicked}
                // currentProject={myProject}
                // currentStructure={myStructure}
                // currentSnapshot={mySnapshot}
                closeTaskFilterOverlay={closeTaskFilterOverlay}
                handleOnFilter={handleOnTaskFilter}
                onClose={() => setOpenDrawer((prev: any) => !prev)}
                taskFilterState={taskFilterState}
              />
            </Drawer>
          )}
        </>
      ) : (
        <ErrorImageDiv>
          <ImageErrorIcon src={listingErrorIcon} alt="Error Image" />
          <MessageDivShowErr>
            No Task has been raised yet. Get a headstart by raising one.
          </MessageDivShowErr>
          <RaiseButtonDiv
            onClick={() => {
              onClose();
              openTaskCreateFn();
              toast("Click on the map where you want to create a task");
            }}
          >
            Raise Task
          </RaiseButtonDiv>

          <ContentError>
            Check out
            <ContentErrorSpan> How to raise a Task?</ContentErrorSpan>
          </ContentError>
        </ErrorImageDiv>
      )}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isSortMenuOpen}
        onClose={handleSortMenuClose}
        onClick={handleSortMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {sortMenuOptions.map((option) => (
          <>
            <StyledMenu
              data-testid="sort-menu-item"
              key={option.label}
              onClick={() => {
                handleSortMenuClick(option.method);
              }}
            >
              {option.label}
              {option.icon && (
                <ListItemIcon>
                  <IconContainer src={option.icon} alt={option.label} />
                </ListItemIcon>
              )}
            </StyledMenu>
          </>
        ))}
      </Menu>
      {isDownloadMenuOpen ? (
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={isDownloadMenuOpen}
          onClose={handleDownloadClose}
          onClick={handleDownloadClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {downloadMenuOptions.map((option) => (
            <>
              <StyledMenu
                key={option.label}
                // onClick={() => handleDownloadMenuClick()}
                data-testid="download-menu-item"
              >
                {option.label === "Download as CSV" ? (
                  <CSVLink
                    data={getDownladableList(downloadList)}
                    filename={"tasks.csv"}
                    className="text-black btn btn-primary fill-black fa fa-Download "
                    target="_blank"
                    data-testid="download"
                    onClick={() => handleDownloadClose()}
                  >
                    <MenuOptionLabel>{option.label}</MenuOptionLabel>
                  </CSVLink>
                ) : (
                  <DownloadTable
                    data={getDownladableList(downloadList)}
                    label={option.label}
                    filename="tasks.pdf"
                    onClick={() => handleDownloadClose()}
                  />
                )}

                {/* {option.icon && (
                    <ListItemIcon>
                      <IconContainer src={option.icon} alt={option.label} />
                    </ListItemIcon>
                  )} */}
              </StyledMenu>
            </>
          ))}
        </Menu>
      ) : (
        <></>
      )}
    </TaskListContainer>
  );
};

export default CustomTaskListDrawer;
