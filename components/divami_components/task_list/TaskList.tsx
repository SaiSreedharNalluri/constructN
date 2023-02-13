import { Box, Drawer } from "@mui/material";
import React, { useState, useEffect } from "react";
// ../styles/Home.module.css
import Image from "next/image";
// import dividerIcon from "../../../public/images/dividerIcon.svg";
// import filterFunnelIcon from "../../../public/images/filterFunnelIcon.svg";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import Download from "../../../public/divami_icons/download.svg";
import FilterInActive from "../../../public/divami_icons/filterInactive.svg";
import Search from "../../../public/divami_icons/search.svg";
import UpArrow from "../../../public/divami_icons/upArrow.svg";
import Divider from "../../../public/divami_icons/divider.svg";
import DownArrow from "../../../public/divami_icons/downArrow.svg";
import {
  ArrowUpIcon,
  BodyContainer,
  BodyContTitle,
  BodyInfo,
  CloseIcon,
  DownloadIcon,
  DueDate,
  DueDateDiv,
  FirstHeader,
  FunnelIcon,
  HeaderContainer,
  HorizontalLine,
  MiniHeaderContainer,
  MiniSymbolsContainer,
  SearchGlassIcon,
  SecondHeader,
  TaskListContainer,
  ThirdHeader,
  TitleContainer,
  LoadMoreContainer,
  LoadMoreButton,
  ArrowUpContainer,
  DividerIcon,
  ArrowDownIcon,
} from "./TaskListStyles";
import RFIList from "../../../public/divami_icons/rfiList.svg";
import SubmittalList from "../../../public/divami_icons/submittalList.svg";
import TransmittalList from "../../../public/divami_icons/transmittalList.svg";
import router from "next/router";
import { getProjectUsers } from "../../../services/project";
import {
  getTasksTypes,
  getTasksPriority,
  getTaskStatus,
} from "../../../services/task";
import TaskList from "../../container/rightFloatingMenu/taskMenu/taskList";
import Moment from "moment";
import TaskFilterCommon from "../task-filter-common/TaskFilterCommon";
import { ITasks } from "../../../models/Itask";
import CustomTaskDetailsDrawer from "../task_detail/TaskDetail";

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

  const handleViewTaskList = () => {
    // console.log("teskssksk trigg");
    setOpenDrawer(true);
  };

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
      };
      tempTaskDataState.push(tempTask);
    });
    setTaskListDataState(tempTaskDataState);
  }, []);

  //   {
  //     "success": true,
  //     "result": {
  //         "title": "13_Floor_A3_Block_2023-02-22",
  //         "type": "Submittals",
  //         "status": "To Do",
  //         "priority": "High",
  //         "assignees": [
  //             {
  //                 "_id": "USR370060",
  //                 "firstName": "swathi",
  //                 "lastName": "divami",
  //                 "email": "swathi@divami.com",
  //                 "fullName": "swathi divami"
  //             }
  //         ],
  //         "addressedBy": "string",
  //         "owner": "USR370060",
  //         "project": "PRJ201897",
  //         "structure": "STR147148",
  //         "snapshot": "string",
  //         "screenshot": "string",
  //         "attachments": [
  //             {
  //                 "name": "string",
  //                 "url": "string",
  //                 "entity": "string",
  //                 "createdAt": "2023-02-13T05:59:22.356Z",
  //                 "updatedAt": "2023-02-13T05:59:22.356Z",
  //                 "_id": "ATT962357"
  //             }
  //         ],
  //         "progress": -1,
  //         "startDate": "2023-02-11T05:04:01.012Z",
  //         "dueDate": "2023-02-05T05:04:01.012Z",
  //         "tags": [],
  //         "createdAt": "2023-02-13T05:59:22.357Z",
  //         "updatedAt": "2023-02-13T05:59:22.357Z",
  //         "_id": "ISS962357",
  //         "__v": 0
  //     }
  // }

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

  const handleDatesSort = () => {
    const sortedDatesData = [...taskListDataState].sort((a: any, b: any) => {
      if (dateSortState === "ascending") {
        setDateSortState("descending");
        return a.due_date - b.due_date;
      } else {
        setDateSortState("ascending");
        return b.due_date - a.due_date;
      }
    });
    setTaskListDataState(sortedDatesData);
  };

  const handleViewTask = (task: any) => {
    tasksList.forEach((item: any) => {
      if (task.id === item._id) {
        setViewTask(item);
      }
    });
    setOpenTaskDetail(true);
  };

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
          <SearchGlassIcon src={Search} alt={"close icon"} />
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
        </MiniSymbolsContainer>
      </MiniHeaderContainer>

      <BodyContainer>
        <Box sx={{ marginTop: "15px" }}>
          {taskListDataState.map((val: any) => {
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
            taskList={tasksList}
            task={viewTask}
            onClose={() => setOpenTaskDetail((prev: any) => !prev)}
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
            // closeTaskFilterOverlay={closeTaskFilterOverlay}
            // handleOnTaskFilter={handleOnTaskFilter}
            onClose={() => setOpenDrawer((prev: any) => !prev)}
          />
        </Drawer>
      )}
    </TaskListContainer>
  );
};

export default CustomTaskListDrawer;
