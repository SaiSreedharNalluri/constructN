import React, { useEffect, useState } from "react";

import Drawer from "@mui/material/Drawer";
import Image from "next/image";

import styles from "../toolbar/toolbar.module.css";

import plusCircleIcon from "../../../public/divami_icons/plusCircleIcon.svg";
import fileTextIcon from "../../../public/divami_icons/fileTextIcon.svg";
import triWarnIcon from "../../../public/divami_icons/triWarnIcon.svg";
import clipboardIcon from "../../../public/divami_icons/clipboardIcon.svg";
import clipboardSecondIcon from "../../../public/divami_icons/clipboardSecondIcon.svg";
import clipboardTask from "../../../public/divami_icons/clipboardTask.svg";
import taskToogleIcon from "../../../public/divami_icons/taskToogleIcon.svg";

import {
  TaskBox,
  TaskTitleDiv,
  IssuesSectionPlusImg,
  IssuesSectionFileImg,
  IssuesSectionClipImg,
  TaskTitle,
  CameraIcon,
} from "./ToolBarStyles";
import TaskList from "../taskListing/TaskList"
import CreateTask from "../../divami_components/create-task/CreateTask";
import CustomDrawer from "../../divami_components/custom-drawer/custom-drawer";
import { createTask, createTaskWithAttachments } from "../../../services/task";
import { ITools } from "../../../models/ITools";
import CustomTaskDetailsDrawer from "../taskDetails/TaskDetail";
import Tooltip from "@mui/material/Tooltip";
import html2canvas from "html2canvas";
import moment from "moment";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";
import plusCircleIconHighlighted from "../../../public/divami_icons/plusCircleIconHighlighted.svg";
import { setTheFormatedDate } from "../../../utils/ViewerDataUtils";
import { getTimeInProjectTimezone } from "../../../utils/utils";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import { MqttConnector } from "../../../utils/MqttConnector";

const Task = ({
  rightMenuClickHandler,
  tasksList,
  setTasksList,
  currentProject,
  currentSnapshot,
  currentStructure,
  currentLayersList,
  currentTypesList,
  closeTaskFilterOverlay,
  handleOnTaskFilter,
  contextInfo,
  taskOpenDrawer,
  taskLayer,
  taskMenuClicked,
  deleteTheTask,
  taskFilterState,
  closeTaskCreate,
  openTaskDetails,
  closeTaskDetails,
  getTasks,
  setHighlightCreateIcon,
  handleOnTasksSort,
  taskSubmit,
  deleteTheAttachment,
  projectUsers,
  taskStatusList,
  taskPriorityList,
  setShowTaskMarkups,
  showTaskMarkups,
  setHighlightCreateTaskIcon,
  highlightCreateTaskIcon,
  isReality,

}: any) => {
  const customLogger = new CustomLoggerClass();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rightNav, setRighttNav] = useState(false);
  const [myProject, setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState(currentStructure);
  const [mySnapshot, setMySnapshot] = useState(currentSnapshot);
  const [myTypesList, setMyTypesList] = useState(currentTypesList);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [image, setImage] = useState<Blob>();
  const [showImage, setShowImage] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [isLoading, setLoading] = useState(false)
  const [showHideTask, setshowHideTask] = useState(false)
  let taskMenuInstance: ITools = { toolName: "task", toolAction: "" };
  const [conn, setConn] = useState<MqttConnector>(MqttConnector.getConnection());

  useEffect(() => {
    setMyProject(currentProject);
    setMyStructure(currentStructure);
    setMySnapshot(currentSnapshot);
    html2canvas(
      document.getElementById("forgeViewer_1") ||
      document.getElementById("potreeViewer_1") ||
      document.body
    ).then(function (canvas) {
      canvas.toBlob((blob) => {
        setImage(blob as Blob);
      }, "image/png");
    });
  }, [currentProject, currentSnapshot, currentStructure, taskOpenDrawer]);
  const handleViewTaskList = () => {
    customLogger.logInfo("ToolBar - View Task")
    setOpenDrawer(true);
    setHighlightCreateTaskIcon(false);
    setHighlightCreateIcon(false)
  };
  const handleCreateTask = (formData: any) => {
    if (enableSubmit) {
      clickTaskSubmit(formData);
    }
  };
  const clickTaskSubmit = (formData: any) => {
    setEnableSubmit(false);
    let data: any = {};
    const userIdList = formData
      .find((item: any) => item.id == "assignedTo")
      ?.selectedName?.map((each: any) => {
        return each._id || each.value;
      });
    data.structure = currentStructure?._id;
    data.snapshot = currentSnapshot?._id;
    data.status = "To Do";
    data.context = contextInfo;
    Object.keys(contextInfo).forEach((key) => {
      if (key !== "id") {
        data.context = { ...data.context, [key]: contextInfo[key] };
      }
    });
    data.title = formData.filter(
      (item: any) => item.id == "create_title"
    )[0]?.defaultValue;

    data.tags = formData.filter(
      (item: any) => item.id == "tag-suggestions"
    )[0]?.chipString;

    data.type = formData.filter(
      (item: any) => item.id == "tasks"
    )[0]?.defaultValue;
    (data.priority = formData.filter(
      (item: any) => item.id == "taskPriority"
    )[0]?.defaultValue),
      (data.description = formData.filter(
        (item: any) => item.id == "description"
      )[0]?.defaultValue),
      (data.assignees = userIdList),
      (data.startDate = formData
        .filter((item: any) => item.id === "dates")[0]
        ?.fields.filter(
          (item: any) => item.id == "start-date"
        )[0]?.defaultValue);

    // data.startDate = moment(data.startDate).format("YYYY-MM-DD");
    let startDate = new Date(data.startDate)
    startDate.setHours(0, 0, 0, 0);
    data.startDate = `${getTimeInProjectTimezone(startDate).utc().format()}`;

    data.dueDate = formData
      .filter((item: any) => item.id === "dates")[0]
      ?.fields.filter((item: any) => item.id == "due-date")[0]?.defaultValue;
    // data.dueDate = moment(data.dueDate).format("YYYY-MM-DD");
    let dueDate: Date = new Date(data.dueDate);
    dueDate.setHours(23, 59, 0, 0);
    data.dueDate = `${getTimeInProjectTimezone(dueDate).utc().format()}`;

    data.attachments = formData.filter(
      (item: any) => item.id === "file-upload"
    )[0].selectedFile;
    // ?.map((eachSelectedFile: any) => {
    //   // let reader = new FileReader();
    //   // let fileUrl: any = '';
    //   // reader.readAsDataURL(eachSelectedFile)
    //   // reader.onload = () => {
    //   //   console.log("CHECK RESULT FILE", reader.result);
    //   //   fileUrl = reader.result ? reader.result : '';
    //   // };
    //   // reader.onerror = function (error) {
    //   //   console.log('Error: ', error);
    //   // }
    //   return {
    //     name: eachSelectedFile.name,
    //     url: eachSelectedFile.name,
    //     entity: "image",
    //   };
    // });
    const formDataObj = new FormData();

    for (let i = 0; i < data.attachments?.length; i++) {
      if (data.attachments![i].size > 50 * 1024 * 1024) {
        CustomToast("Please upload file(s) <50 MB", "error");
        return;
      }
      formDataObj.append("attachments", data.attachments![i]);
    }
    // data.screenshot = image;

    formDataObj.append("screenshot", image as Blob, "imageName.png");
    delete data["screenshot"];
    delete data["attachments"];
    delete data["id"];
    formDataObj.append("jreq", JSON.stringify(data));
    const projectId = formData.filter((item: any) => item.projectId)[0]
      .projectId;
    if (data.title && data.type && data.priority) {
      createTaskWithAttachments(projectId as string, formDataObj)
        .then((response) => {
          if (response.success === true) {
            CustomToast("Task created sucessfully", "success");

            setEnableSubmit(true);
            taskSubmitFn(response.result);
          } else {
            CustomToast(`Something went wrong`, "error");
            setEnableSubmit(true);
          }
          setLoading(false)
        })
        .catch((error) => {
          if (error.status === 403) {
            CustomToast(`You don't have permission. Contact Admin.`, "error");
          } else if (error.status === 415) {
            CustomToast(error?.data?.message, "error");
          } else {
            CustomToast(`Something went wrong`, "error");
          }
          setLoading(false)
          setEnableSubmit(true);
        });
    } else {
      setEnableSubmit(true);
    }
  };

  const onCancelCreate = () => {
    taskMenuInstance.toolAction = "taskCreateFail";
    // setOpenCreateTask(false);
    taskMenuClicked(taskMenuInstance);
    closeTaskCreate();
  };

  useEffect(() => {
    if (openTaskDetails && contextInfo?.id) {
      const selectedObj = tasksList.find(
        (each: any) => each._id === contextInfo.id
      );
      setSelectedTask(selectedObj);
    }
  }, [openTaskDetails, contextInfo?.id, tasksList]);
  const taskSubmitFn = (formdata: any) => {
    // tasksList.push(formdata);
    taskMenuInstance.toolAction = "taskCreateSuccess";
    taskMenuInstance.response = { ...formdata.context, id: formdata._id };
    // setCreateOverlay(false);
    taskMenuClicked(taskMenuInstance);
    closeTaskCreate();
    taskSubmit(formdata);
    setEnableSubmit(true);
  };
  const openTaskCreateFn = () => {
    //setCreateOverlay(true);
    taskMenuInstance.toolAction = "taskCreate";
    customLogger.logInfo("ToolBar - Create Task")
    taskMenuClicked(taskMenuInstance);
    setHighlightCreateTaskIcon(true)
    setHighlightCreateIcon(false)
  };
  const closeTaskCreateFn = () => {
    taskMenuInstance.toolAction = "taskCreateClose";
    // setCreateOverlay(false);
    taskMenuClicked(taskMenuInstance);
  };
  const openTaskListFn = () => {
    // setListOverlay(true);
    taskMenuInstance.toolAction = "taskView";
    taskMenuClicked(taskMenuInstance);
  };
  const closeTaskListFn = () => {
    // setListOverlay(false);
    taskMenuInstance.toolAction = "taskViewClose";
    taskMenuClicked(taskMenuInstance);
  };
  const toggleTaskVisibility = () => {
    setshowHideTask(!showHideTask);
    if (showHideTask) {
      taskMenuInstance.toolAction = "taskHide";
      taskMenuClicked(taskMenuInstance);
      customLogger.logInfo("ToolBar - Hide Task")
    }
    else{ taskMenuInstance.toolAction = "taskShow";
    customLogger.logInfo("ToolBar - Show Task")
    // setshowHideTask(!showHideTask)
    taskMenuClicked(taskMenuInstance);
    setHighlightCreateTaskIcon(false)
    setHighlightCreateIcon(false)
  }
  };

  const handleToggle = () => {
    setShowImage(!showImage);
  };

  useEffect(() => {
    setOpenCreateTask(taskOpenDrawer);
  }, [taskOpenDrawer]);
  return (
    <TaskBox
      isCompareAvailable={isReality}
      onKeyDown={(e: any) => {
        const arrowKeys = ["ArrowUp", "ArrowDown", 'ArrowRight', 'ArrowLeft'];
        if (arrowKeys.includes(e.key)) {
          e.stopPropagation();
        }
      }}>
      <TaskTitle>Task: </TaskTitle>

      <Tooltip title="Create Task">
        <IssuesSectionPlusImg
          onClick={() => {
            openTaskCreateFn();
            // setOpenCreateTask(true);
          }} className={highlightCreateTaskIcon ? "bg-[#F1742E] hover:bg-[#F1742E]" : ""}>
          <CameraIcon
            src={highlightCreateTaskIcon ? plusCircleIconHighlighted : plusCircleIcon}
            // onClick={props.rightMenuClickHandler}
            width={12}
            height={12}
            alt="Arrow"
          />
        </IssuesSectionPlusImg>
      </Tooltip>

      <Tooltip title="Task List">
        <IssuesSectionFileImg
          onClick={() => {
            handleViewTaskList();
          }}>
          <CameraIcon
            src={fileTextIcon}
            width={12}
            height={12}
            alt="Arrow"
          />
        </IssuesSectionFileImg>
      </Tooltip>

      <Tooltip title={showHideTask ? "Show Tasks" : "Hide Tasks"}>
        <IssuesSectionClipImg
          onClick={() => {
            toggleTaskVisibility();

          }}>
          {showHideTask && (
            <CameraIcon
              width={12}
              height={12}
              src={taskToogleIcon}
              alt="Arrow"
            />
          )}

          {!showHideTask && (
            <CameraIcon
              width={12}
              height={12}
              src={clipboardTask}
              alt="Arrow"
            />
          )}
        </IssuesSectionClipImg>
      </Tooltip>
      {openDrawer && (
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => {
            setTasksList([
              ...tasksList.sort((a: any, b: any) => {
                return (
                  new Date(b.createdAt).valueOf() -
                  new Date(a.createdAt).valueOf()
                );
              }),
            ]);

            setOpenDrawer((prev: any) => !prev);
          }}
        >
          <TaskList
            tasksList={tasksList}
            taskMenuClicked={taskMenuClicked}
            currentProject={myProject}
            currentStructure={myStructure}
            currentSnapshot={mySnapshot}
            contextInfo={contextInfo}
            closeTaskFilterOverlay={closeTaskFilterOverlay}
            handleOnTaskFilter={handleOnTaskFilter}
            onClose={() => setOpenDrawer((prev: any) => !prev)}
            deleteTheTask={deleteTheTask}
            taskFilterState={taskFilterState}
            getTasks={getTasks}
            handleOnTasksSort={handleOnTasksSort}
            deleteTheAttachment={deleteTheAttachment}
            openTaskCreateFn={openTaskCreateFn}
            projectUsers={projectUsers}
            taskType={currentTypesList}
            taskPriority={taskPriorityList}
            taskStatus={taskStatusList}
          />
        </Drawer>
      )}
      {openCreateTask && (
        <CustomDrawer open>
          <CreateTask
            handleCreateTask={handleCreateTask}
            currentProject={currentProject}
            currentSnapshot={currentSnapshot}
            currentStructure={currentStructure}
            contextInfo={contextInfo}
            closeTaskCreate={closeTaskCreate}
            onCancelCreate={onCancelCreate}
            deleteTheAttachment={deleteTheAttachment}
            setLoading={setLoading}
            isLoading={isLoading}
          />
        </CustomDrawer>
      )}
      {openTaskDetails && (
        <Drawer
          anchor={"right"}
          open={openTaskDetails}
          onClose={() => closeTaskDetails()}
        >
          <CustomTaskDetailsDrawer
            task={selectedTask}
            onClose={() => closeTaskDetails()}
            taskType={currentTypesList}
            deleteTheTask={deleteTheTask}
            currentProject={currentProject}
            currentSnapshot={currentSnapshot}
            currentStructure={currentStructure}
            contextInfo={contextInfo}
            projectUsers={projectUsers}
            deleteTheAttachment={deleteTheAttachment}
            getTasks={getTasks}
            taskPriority={taskPriorityList}
            taskStatus={taskStatusList}
          />
        </Drawer>
      )}
    </TaskBox>
  );
};

export default Task;
