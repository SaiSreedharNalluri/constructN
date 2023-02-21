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
  ArrowDownIcon,
  ArrowUpIcon,
  BodyContainer,
  BodyContTitle,
  BodyInfo,
  CloseIcon,
  CustomSearchField,
  DividerIcon,
  DownloadIcon,
  DueDate,
  DueDateDiv,
  FirstHeader,
  FunnelIcon,
  HeaderContainer,
  HorizontalLine,
  MessageDiv,
  MiniHeaderContainer,
  MiniSymbolsContainer,
  SearchAreaContainer,
  SearchGlassIcon,
  SecondHeader,
  TaskListContainer,
  ThirdHeader,
  TitleContainer,
} from "./TaskListStyles";
import _ from "lodash";
import { CSVLink } from "react-csv";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";

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
  } = props;

  const [taskType, setTaskType] = useState<[string]>();
  const [taskPriority, setTaskPriority] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState([]);
  const [taskStatus, setTaskStatus] = useState<[string]>();
  const [taskListDataState, setTaskListDataState] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [viewTask, setViewTask] = useState({});
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [searchingOn, setSearchingOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTaskList, setFilteredTaskList] = useState(taskListDataState);
  const [taskList, setTaskList] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    setTaskList(tasksList);
  }, [tasksList]);

  useEffect(() => {
    console.log("filteredTaskList1", filteredTaskList);
    setFilteredTaskList(tasksList);
    console.log("filteredTaskList2", filteredTaskList);
  }, [tasksList]);

  const handleViewTaskList = () => {
    // console.log("teskssksk trigg");
    setOpenDrawer(true);
  };
  console.log(taskList, "tasklist");
  useEffect(() => {
    handleDatesSort();
    let tempTaskDataState: any = [];
    tasksList?.map((task: any) => {
      let tempTask = {
        id: task._id,
        type: task.type,
        priority: task.priority,
        assignee: task.assignees[0].firstName,
        due_date: task.dueDate,
        tags: task.tags,
      };
      tempTaskDataState.push(tempTask);
    });
    setTaskListDataState(tempTaskDataState);
  }, [tasksList]);

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

  console.log(taskType, taskPriority, taskStatus, projectUsers, "IMPORTANTT");

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

  const handleDatesSort = () => {
    console.log(filteredTaskList, "filteredTaskList");
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
    console.log(sorted, "sorted");
    setFilteredTaskList(sorted);
  };

  const sortDateOrdering = () => {
    let sorted;
    if (sortOrder === "asc") {
      sorted = filteredTaskList.sort((a: any, b: any) => {
        return (
          new Date(a.due_date ? a.due_date : new Date()).valueOf() -
          new Date(b.due_date ? b.due_date : new Date()).valueOf()
        );
      });
      setSortOrder("desc");
    } else {
      sorted = filteredTaskList.sort((a: any, b: any) => {
        return (
          new Date(b.due_date ? b.due_date : new Date()).valueOf() -
          new Date(a.due_date ? a.due_date : new Date()).valueOf()
        );
      });
      setSortOrder("asc");
    }
    console.log("sorted", sorted);
    setFilteredTaskList(sorted);
  };

  const handleViewTask = (task: any) => {
    tasksList.forEach((item: any) => {
      if (task.id === item._id) {
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
    const filteredData = taskListDataState?.filter((eachTask: any) => {
      const taskName = eachTask?.type?.toLowerCase();
      return taskName.includes(searchTerm.toLowerCase());
    });
    setFilteredTaskList([...filteredData]);
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
    setFilteredTaskList(taskListDataState);
  }, [taskListDataState]);

  useEffect(() => {
    console.log(filteredTaskList, "filteredTaskList");
  }, [filteredTaskList]);

  return (
    <TaskListContainer>
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
              <FunnelIcon
                src={FilterInActive}
                alt="Arrow"
                onClick={() => {
                  handleViewTaskList();
                }}
              />
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
              <MessageDiv>
                <p>No task matches the search</p>
              </MessageDiv>
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
              <MessageDiv>
                <p>No task matches the search</p>
              </MessageDiv>
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
    </TaskListContainer>
  );
};

export default CustomTaskListDrawer;
