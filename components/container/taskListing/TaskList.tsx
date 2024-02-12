import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useRef, useState } from "react";
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
import sortUp from "../../../public/divami_icons/sortUp.svg";

import { getProjectUsers } from "../../../services/project";
import {
  getTasksPriority,
  getTaskStatus,
  getTasksTypes,
} from "../../../services/task";
import TaskFilterCommon from "../taskFilter/TaskFilterCommon"

import CustomTaskDetailsDrawer from "../taskDetails/TaskDetail";
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
  FilterIndication,
  FunnelIcon,
  DueDateHeader,
  TicketName,
  ProgressChild,
  SmallDivider,
  PriorityChild,
  AssigneeList,
  Watcher,
  TopButton,
} from "./TaskListStyles";

import {
  Box,
  Divider,
  Drawer,
  InputAdornment,
  ListItemIcon,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";
import listingErrorIcon from "../../../public/divami_icons/listingErrorIcon.svg";
import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";
import { IToolbarAction, ITools } from "../../../models/ITools";
import { downloadMenuOptions} from "../../divami_components/issue-listing/Constants";
import closeWithCircle from "../../../public/divami_icons/closeWithCircle.svg";
import smallDivider from "../../../public/divami_icons/smallDivider.svg";
import Task from "../../../public/divami_icons/Task.svg";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";
import { setTheFormatedDate } from "../../../utils/ViewerDataUtils";
import { getDownladableList } from "../../divami_components/issue-listing/Constants";

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
  taskContext:any;
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
    projectUsers,
    taskPriority,
    taskStatus,
    taskContext,
    initData,
    toolClicked
  } = props;
  const [taskType, setTaskType] = useState<[string]>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [viewTask, setViewTask] = useState<any>({});
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [searchingOn, setSearchingOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskList, setTaskList] = useState<any>([]);
  const [filteredTaskList, setFilteredTaskList] = useState(
    taskList.slice(0, 10)
  );
  const [sortOrder, setSortOrder] = useState("asc");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [remainingTasks, setRemainingtasks] = useState(taskList?.length);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let taskMenuInstance: IToolbarAction = { data: "", type: "selectTask" };
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [downloadList, setDownloadList] = useState(taskList);
  const sortMenuOptions = [
    {
      label: "Status  (A - Z)",
      icon: null,
      method: "status_asc",
    },
    {
      label: "Status   (Z - A)",
      icon: null,
      method: "status_desc",
    },

    {
      label: "Priority (A - Z)",
      icon: null,
      method: "Asc Priority",
    },
    {
      label: "Priority (Z - A)",
      icon: null,
      method: "Dsc Priority",
    },
    {
      label: "Due Date",
      icon: UpArrow,
      method: "Dsc DueDate",
    },
    {
      label: "Due Date",
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
    setRemainingtasks(taskList?.length > 10 ? taskList.length : 0);
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

  const handleSortMenuClick = (sortMethod: string) =>{
  let handleOnTaskSort: IToolbarAction = { type: "sortTask", data:sortMethod };
  toolClicked(handleOnTaskSort)
  }
  const handleViewTaskList = () => {
    setOpenDrawer(true);
  };

  const handleClose = () => {
    onClose(true);
    setTaskList(
      [...tasksList.sort((a: any, b: any) => {
        return (
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
        );
      })]
    );
  };

  useEffect(() => {
    if (router.isReady) {
      getTasksTypes(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskType(response.result);
        }
      });
    }
  }, []);

  const sortDateOrdering = () => {
    let sorted;
    if (sortOrder === "asc") {
      sorted = filteredTaskList.sort((a: any, b: any) => {
        return new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf();
      });
      setSortOrder("desc");
    } else {
      sorted = filteredTaskList.sort((a: any, b: any) => {
        return new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf();
      });
      setSortOrder("asc");
    }
    setFilteredTaskList(sorted);
  };

  const handleViewTask = (task: any) => {
    console.log("handletask",task);
    
    initData?.currentTaskList.forEach((item: any) => {
      if (task._id === item._id) {
        setViewTask(item);
        // taskContext(task)
      }
    });
    setOpenTaskDetail(true);
    taskMenuInstance.type = "selectTask";
    taskMenuInstance.data = task;
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
      setRemainingtasks(filteredData.length > 10 ? filteredData.length : 0);
      setFilteredTaskList([...filteredData.slice(0, 10)]);
    } else {
      setFilteredTaskList(taskList.slice(0, 10));
      setRemainingtasks(taskList.length > 10 ? taskList.length : 0);
    }
  };

  const handleLoadMore = () => {
    const noOfTasksLoaded = filteredTaskList.length;

    if (searchTerm.length > 0) {
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
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    if (viewTask?._id) {
      taskList.forEach((item: any) => {
        if (viewTask._id === item._id) {
          setViewTask(item);
        }
      });
    }
  }, [taskList]);
  const taskContRef = useRef<any>(null);
  const scrollTop = () => {
 
    if (taskContRef.current) {
      taskContRef.current.scrollTop = 0;
    }
  };

  return (
    <>
      {errorShow?.length > 0 || taskFilterState.numberOfFilters>=1 ? (
        <TaskListContainer>
          <HeaderContainer>
            <TitleContainer>
              <span>Task List</span>
              <div className="rounded-full p-1 hover:bg-[#E7E7E7]">
              <CloseIcon
                onClick={() => {
                  handleClose();
                }}
                src={closeWithCircle}
                alt={"close icon"}
                data-testid="close-icon"
              />
              </div>
            </TitleContainer>
          </HeaderContainer>

          <MiniHeaderContainer searchingOn={searchingOn}>
            <MiniSymbolsContainer>
              {searchingOn ? (
                <SearchAreaContainer>
                  <CustomSearchField
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontFamily: "Open Sans",
                        color: "#101F4C",
                        fontWeight: "400",
                        "&::placeholder": {
                          color: "#787878",

                          fontFamily: "Open Sans",
                          fontSize: "14px",
                          lineHeight: "20px",
                          fontWeight: "400",
                        },
                      },
                    }}
                    placeholder="Search"
                    variant="outlined"
                    autoFocus={true}
                    value={searchTerm}
                    onChange={(e:any) => {
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
                            isSmall={true}
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
                  {taskFilterState?.isFilterApplied ? (
                    <AppliedFilter>
                      {taskFilterState?.numberOfFilters} Filters{" "}
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
                      onClick={(e:any) => {
                        setIsSortMenuOpen((prev) => !prev);
                        handleSortClick(e);
                      }}
                      // data-testid="sort"
                    />
                  </Tooltip>

                  {/* <DueDateHeader>Due Date</DueDateHeader> */}

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

                  {!taskFilterState?.isFilterApplied ? (
                    <IconContainer
                      src={FilterInActive}
                      alt="Arrow"
                      onClick={() => {
                        handleViewTaskList();
                      }}
                      data-testid="filter"
                    />
                  ) : null} 
                  {/* <FunnelIcon
                    src={FilterInActive}
                    alt="Arrow"
                    onClick={() => {
                      handleViewTaskList();
                    }}
                    data-testid="filter"
                  /> */}
                  {taskFilterState?.isFilterApplied && taskFilterState?.numberOfFilters ? (
                    <FilterIndication />
                  ) : null}
                  {/* <Tooltip title="Download Menu">
                    <DownloadIcon
                      src={Download}
                      alt="Arrow"
                      onClick={(e:any) => {
                        setIsDownloadMenuOpen((prev) => !prev);
                        handleSortClick(e);
                      }}
                    />
                  </Tooltip>  */}
                  <CSVLink
                    data={getDownladableList(taskList)}
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

          <BodyContainer ref={taskContRef}>
            <CustomBox searchingOn={searchingOn}>
              {filteredTaskList?.length > 0 ? (
                filteredTaskList?.map((val: any) => {
                  return (
                    <>
                      <BodyInfo
                        data-testid="item-body"
                        onClick={() => {
                          handleViewTask(val);
                        }}
                      >
                        <FirstHeader>
                          <TicketName>
                            {" "}
                            {val?.type} (#{val?.sequenceNumber})
                          </TicketName>
                        </FirstHeader>
                        <SecondHeader>
                          <ProgressChild>{val?.status}</ProgressChild>

                          <SmallDivider src={smallDivider} alt="progress" />

                          <PriorityChild>
                            {val?.priority} Priority{" "}
                          </PriorityChild>
                        </SecondHeader>
                        <ThirdHeader>
                          <ProgressChild>
                            {" "}
                            Due by {setTheFormatedDate(val.dueDate)}
                          </ProgressChild>

                          <SmallDivider src={smallDivider} alt="progress" />

                          <PriorityChild>
                            {" "}
                            {val?.assignees[0]?.firstName
                              .charAt(0)
                              .toUpperCase()}
                            {val?.assignees[0]?.firstName.slice(1)}{" "}
                            {val?.assignees[0]?.lastName
                              .charAt(0)
                              .toUpperCase()}
                            {val?.assignees[0]?.lastName.slice(1)}
                          </PriorityChild>
                          <LightTooltip
                            arrow
                            title={
                              <AssigneeList>
                                {val?.assignees?.map(
                                  (assignName: any, index: number) => {
                                    if (index != 0) {
                                      return (
                                        <>
                                          {index !== val?.assignees?.length - 1
                                            ? assignName?.firstName +
                                              " " +
                                              assignName.lastName +
                                              " | "
                                            : assignName?.firstName +
                                              " " +
                                              assignName.lastName}
                                        </>
                                      );
                                    }
                                  }
                                )}
                              </AssigneeList>
                            }
                          >
                            <Watcher>
                              {val?.assignees.length - 1 > 0
                                ? `+${val?.assignees.length - 1}`
                                : ""}
                            </Watcher>
                          </LightTooltip>
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
              <div className="flex justify-between px-1">
              {remainingTasks > 1 && filteredTaskList?.length > 1 ? (
                <LoadMoreText
                  onClick={() => {
                    handleLoadMore();
                  }}
                >
                  Load More
                </LoadMoreText>
              ) : null}
              <div></div>
              {filteredTaskList?.length >= 10 &&
                            <TopButton onClick={scrollTop}>
                            Top
                          </TopButton>
              }

              </div>
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
                onClose={() => {setOpenTaskDetail((prev: any) => !prev)
                let typeChangeToolAction: IToolbarAction = { type: "closeTaskDrawer", data: "" };
                toolClicked(typeChangeToolAction);
                  
                }
                }
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
                setTaskList={setTaskList}
                initData={initData}
                toolClicked={toolClicked}
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
                taskMenuClicked={taskMenuClicked}
                // currentProject={myProject}
                // currentStructure={myStructure}
                // currentSnapshot={mySnapshot}
                closeTaskFilterOverlay={closeTaskFilterOverlay}
                handleOnFilter={handleOnTaskFilter}
                onClose={() => setOpenDrawer((prev: any) => !prev)}
                taskFilterState={taskFilterState}
                toolClicked={toolClicked}
              />
            </Drawer>
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
                  className="custom-styled-menu"
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
              {downloadMenuOptions.map((option:any) => (
                <>
                  <StyledMenu
                    key={option.label}
                    // onClick={() => handleDownloadMenuClick()}
                    data-testid="download-menu-item"
                  >
                    {option.label === "Download as CSV" ? (''
                      // <CSVLink
                      // data={getDownladableList(downloadList)}
                      //   filename={"tasks.csv"}
                      //   className="text-black btn btn-primary fill-black fa fa-Download "
                      //   target="_blank"
                      //   data-testid="download"
                      //   onClick={() => handleDownloadClose()}
                      // >
                      //   <MenuOptionLabel>{option.label}</MenuOptionLabel>
                      // </CSVLink>
                    ) : (''
                      // <DownloadTable
                      //   data={getDownladableList(downloadList)}
                      //   label={option.label}
                      //   filename="tasks.pdf"
                      //   onClick={() => handleDownloadClose()}
                      // />
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
      ) : (
        <TaskListContainer>
           <HeaderContainer>
            <TitleContainer>
              <span></span>
              <div className="rounded-full p-1 hover:bg-[#E7E7E7]">
              <CloseIcon
                onClick={() => {
                  handleClose();
                }}
                src={closeWithCircle}
                alt={"close icon"}
                data-testid="close-icon"
              />
              </div>
            </TitleContainer>
          </HeaderContainer>
          <ErrorImageDiv>
            <ImageErrorIcon src={listingErrorIcon} alt="Error Image" />
            <MessageDivShowErr>
              No Task has been raised yet. Get a headstart by raising one.
            </MessageDivShowErr>
            <RaiseButtonDiv
              onClick={() => {
                onClose();
                openTaskCreateFn();
                CustomToast(
                  "Click on the map where you want to 'Create Task'"
                ,"success");
              }}
            >
              Raise Task
            </RaiseButtonDiv>

            <ContentError>
              Check out
              <ContentErrorSpan> How to raise a Task?</ContentErrorSpan>
            </ContentError>
          </ErrorImageDiv>
        </TaskListContainer>
      )}
    </>
  );
};

export default CustomTaskListDrawer;
export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    // color: "rgba(0, 0, 0, 0.87)",
    fontSize: 11,
    // position: "absolute",
    right: 30,
    borderRadius: "4px",
    top: 2,
    // width: "308px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    height: "10px !important",
    left: "30px !important",
    marginBottom: "0px",
    "&:before": {
      background: "#FFFFFF",
      border: "1px solid #D9D9D9",
    },

    //  color: 'red',
  },
}));


