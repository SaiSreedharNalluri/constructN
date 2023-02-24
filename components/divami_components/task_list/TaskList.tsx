import { Box, Drawer, InputAdornment } from "@mui/material";
import { useEffect, useRef, useState } from "react";
// ../styles/Home.module.css
import Image from "next/image";
// import dividerIcon from "../../../public/images/dividerIcon.svg";
// import filterFunnelIcon from "../../../public/images/filterFunnelIcon.svg";
import SearchIcon from "@mui/icons-material/Search";
import Moment from "moment";
import router from "next/router";
import { ITasks } from "../../../models/Itask";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import Divider from "../../../public/divami_icons/divider.svg";
import DownArrow from "../../../public/divami_icons/downArrow.svg";
import Download from "../../../public/divami_icons/download.svg";
import FilterInActive from "../../../public/divami_icons/filterInactive.svg";
import RFIList from "../../../public/divami_icons/rfiList.svg";
import Search from "../../../public/divami_icons/search.svg";
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
  CustomSearchField,
  DividerIcon,
  DownloadIcon,
  DueDate,
  DueDateDiv,
  ErrorImageDiv,
  FilterIcon,
  FirstHeader,
  FunnelIcon,
  HeaderContainer,
  HorizontalLine,
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
  TaskListContainer,
  ThirdHeader,
  TitleContainer,
} from "./TaskListStyles";
import _ from "lodash";
import { CSVLink } from "react-csv";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import AppliedFilterIcon from "../../../public/divami_icons/appliedFilter.svg";
import listingErrorIcon from "../../../public/divami_icons/listingErrorIcon.svg";
import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";

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
  const [filteredTaskList, setFilteredTaskList] = useState(taskList);
  const [sortOrder, setSortOrder] = useState("asc");

  const [errorShow, setErrorShow] = useState<any>(tasksList);

  useEffect(() => {
    setTaskList(tasksList);
  }, [tasksList]);

  useEffect(() => {
    setFilteredTaskList(taskList);
  }, [taskList]);

  const handleViewTaskList = () => {
    // console.log("teskssksk trigg");
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

  const getDownloadableTaskList = (issuesList = filteredTaskList) => {
    let modifiedList = issuesList.map((issue: any) => {
      let firstNames = issue.assignee
        ?.split(" ")
        .map((name: string) => name.trim());
      return _.omit({ ...issue, assignee: firstNames }, [
        "progress",
        "context",
      ]);
    });
    return modifiedList;
  };

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
    filteredTaskList.forEach((item: any) => {
      if (task._id === item._id) {
        setViewTask(item);
      }
    });
    setOpenTaskDetail(true);
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
        return taskName.includes(searchTerm.toLowerCase());
      });
      setFilteredTaskList([...filteredData]);
    } else {
      setFilteredTaskList(taskList);
    }
  };
  useEffect(() => {
    if (router.isReady) {
      getProjectUsers(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setProjectUsers(response.result);
            console.log(projectUsers);
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
              />
            </TitleContainer>
          </HeaderContainer>

          <MiniHeaderContainer>
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
                    alt={"close icon"}
                    onClick={() => setSearchingOn((prev) => !prev)}
                  />
                  <DividerIcon src={Divider} alt="" />
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
                  {sortOrder === "asc" ? (
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
                  <DueDate>Due Date</DueDate>

                  <SecondDividerIcon src={Divider} alt="" />

                  <FunnelIcon
                    src={FilterInActive}
                    alt="Arrow"
                    onClick={() => {
                      handleViewTaskList();
                    }}
                  />

                  <CSVLink
                    data={getDownloadableTaskList(filteredTaskList)}
                    filename={"my-tasks.csv"}
                    className="text-black btn btn-primary fill-black fa fa-Download "
                    target="_blank"
                  >
                    {/* <FontAwesomeIcon
                  className=" fill-black text-black"
                  icon={faDownload}
                ></FontAwesomeIcon> */}
                    <DownloadIcon src={Download} alt="Arrow" />
                  </CSVLink>
                </>
              )}
            </MiniSymbolsContainer>
          </MiniHeaderContainer>

          <BodyContainer>
            {searchingOn ? (
              <Box sx={{ marginTop: "10px" }}>
                {filteredTaskList.length > 0 ? (
                  filteredTaskList.map((val: any) => {
                    return (
                      <>
                        <BodyInfo
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
                              {val.type} (#{val.id})
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
              </Box>
            ) : (
              <Box>
                {filteredTaskList.length > 0 ? (
                  filteredTaskList.map((val: any) => {
                    return (
                      <>
                        <BodyInfo
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
                              {val.type} (#{val.id})
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
              </Box>
            )}
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
          <RaiseButtonDiv>Raise Task</RaiseButtonDiv>

          <ContentError>
            Check out
            <ContentErrorSpan> How to raise a Task?</ContentErrorSpan>
          </ContentError>
        </ErrorImageDiv>
      )}
    </TaskListContainer>
  );
};

export default CustomTaskListDrawer;
