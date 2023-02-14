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
  MiniHeaderContainer,
  MiniSymbolsContainer,
  SearchAreaContainer,
  SearchGlassIcon,
  SecondHeader,
  TaskListContainer,
  ThirdHeader,
  TitleContainer,
} from "./TaskListStyles";

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
    closeTaskFilterOverlay,
    handleOnTaskFilter,
    taskFilterState,
  } = props;

  const [taskType, setTaskType] = useState<[string]>();
  const [taskPriority, setTaskPriority] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState([]);
  const [taskStatus, setTaskStatus] = useState<[string]>();
  const [dateSortState, setDateSortState] = useState("ascending");
  const [taskListDataState, setTaskListDataState] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [viewTask, setViewTask] = useState({});
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [searchingOn, setSearchingOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTaskList, setFilteredTaskList] = useState(taskListDataState);
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    setTaskList(tasksList);
  }, []);
  const handleViewTaskList = () => {
    // console.log("teskssksk trigg");
    setOpenDrawer(true);
  };

  useEffect(() => {
    handleDatesSort();
    let tempTaskDataState: any = [];
    taskList?.map((task: any) => {
      let tempTask = {
        id: task._id,
        type: task.type,
        priority: task.priority,
        assignee: task.assignees[0].firstName,
        due_date: task.dueDate,
      };
      tempTaskDataState.push(tempTask);
    });
    setTaskListDataState(tempTaskDataState);
  }, []);

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

  const handleDatesSort = () => {
    const sortedDatesData = [...taskListDataState].sort((a: any, b: any) => {
      if (dateSortState === "ascending") {
        setDateSortState("descending");
        return a.dueDate - b.dueDate;
      } else {
        setDateSortState("ascending");
        return b.dueDate - a.dueDate;
      }
    });
    console.log(sortedDatesData);
    setTaskListDataState(sortedDatesData);
  };

  const handleViewTask = (task: any) => {
    taskList.forEach((item: any) => {
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
    const filteredData = taskListDataState?.filter((eachTask) => {
      const taskName = eachTask.type.toLowerCase();
      return taskName.includes(searchTerm.toLowerCase());
    });
    setFilteredTaskList([...filteredData]);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    setFilteredTaskList(taskListDataState);
  }, [taskListDataState]);

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
                      <SearchIcon />
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
              {dateSortState === "ascending" ? (
                <>
                  <ArrowUpIcon
                    onClick={() => {
                      handleDatesSort();
                    }}
                    src={UpArrow}
                    alt="Arrow"
                  />
                </>
              ) : (
                <>
                  <ArrowDownIcon
                    onClick={() => {
                      handleDatesSort();
                    }}
                    src={DownArrow}
                    alt="Arrow"
                  />
                </>
              )}
              <DueDate>Due Date</DueDate>
              <DownloadIcon src={Download} alt="Arrow" />
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
        <Box sx={{ marginTop: "15px" }}>
          {filteredTaskList.map((val: any) => {
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
          })}
        </Box>
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
            taskList={taskList}
            task={viewTask}
            onClose={() => setOpenTaskDetail((prev: any) => !prev)}
            taskType={taskType}
            taskPriority={taskPriority}
            taskStatus={taskStatus}
            projectUsers={projectUsers}
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
            tasksList={taskList}
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
