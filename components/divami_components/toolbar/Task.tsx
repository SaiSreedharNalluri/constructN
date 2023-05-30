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
import TaskList from "../task_list/TaskList";
import CreateTask from "../create-task/CreateTask";
import CustomDrawer from "../custom-drawer/custom-drawer";
import { createTask, createTaskWithAttachments } from "../../../services/task";
import { toast } from "react-toastify";
import { ITools } from "../../../models/ITools";
import CustomTaskDetailsDrawer from "../task_detail/TaskDetail";
import Tooltip from "@mui/material/Tooltip";
import html2canvas from "html2canvas";
import moment from "moment";

const Task = ({
  rightMenuClickHandler,
  tasksList,
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
  handleOnTasksSort,
  taskSubmit,
  deleteTheAttachment,
  projectUsers,
  taskStatusList,
  taskPriorityList,
}: any) => {
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
  const [taskVisbility, setTaskVisibility] = useState(true);

  let taskMenuInstance: ITools = { toolName: "task", toolAction: "" };

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
    setOpenDrawer(true);
  };
  const handleCreateTask = (formData: any) => {
    if (enableSubmit) {
      clickTaskSubmit(formData);
    }
  };
  const clickTaskSubmit = (formData: any) => {
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
      (item: any) => item.id == "title"
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
    data.startDate = `${moment(data.startDate).toISOString()}`;

    data.dueDate = formData
      .filter((item: any) => item.id === "dates")[0]
      ?.fields.filter((item: any) => item.id == "due-date")[0]?.defaultValue;
    // data.dueDate = moment(data.dueDate).format("YYYY-MM-DD");
    data.dueDate = `${moment(data.dueDate).toISOString()}`;

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
        toast.error("file size is too large. failed to create issue");
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
      setEnableSubmit(false);

      createTaskWithAttachments(projectId as string, formDataObj)
        .then((response) => {
          if (response.success === true) {
            toast.success("Task Created sucessfully");

            setEnableSubmit(false);
            taskSubmitFn(response.result);
          } else {
            toast.error(`Something went wrong`);
            setEnableSubmit(true);
          }
        })
        .catch((error) => {
          if (error.message == "Forbidden Access") {
            toast(`You can't create a task. Ask the Project Admin for help`);
          } else {
            toast.error(`Something went wrong`);
          }
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
    console.log("contextinfo", contextInfo, tasksList);
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
    console.log("boss");
    //setCreateOverlay(true);
    taskMenuInstance.toolAction = "taskCreate";
    taskMenuClicked(taskMenuInstance);
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
    setTaskVisibility(!taskVisbility);
    if (taskVisbility) taskMenuInstance.toolAction = "taskHide";
    else taskMenuInstance.toolAction = "taskShow";
    taskMenuClicked(taskMenuInstance);
  };

  const handleToggle = () => {
    setShowImage(!showImage);
  };

  useEffect(() => {
    setOpenCreateTask(taskOpenDrawer);
  }, [taskOpenDrawer]);
  return (
    <TaskBox>
      <TaskTitle>Task: </TaskTitle>

      <Tooltip title="Create Task">
        <IssuesSectionPlusImg>
          <CameraIcon
            onClick={() => {
              openTaskCreateFn();

              // setOpenCreateTask(true);
            }}
            src={plusCircleIcon}
            // onClick={props.rightMenuClickHandler}
            width={12}
            height={12}
            alt="Arrow"
          />
        </IssuesSectionPlusImg>
      </Tooltip>

      <Tooltip title="Task List">
        <IssuesSectionFileImg>
          <CameraIcon
            onClick={() => {
              handleViewTaskList();
            }}
            src={fileTextIcon}
            width={12}
            height={12}
            alt="Arrow"
          />
        </IssuesSectionFileImg>
      </Tooltip>

      <Tooltip title={taskVisbility ? "Show Tasks" : "Hide Tasks"}>
        <IssuesSectionClipImg>
          {taskVisbility && (
            <CameraIcon
              width={12}
              height={12}
              src={taskToogleIcon}
              alt="Arrow"
              onClick={() => {
                toggleTaskVisibility();
              }}
            />
          )}

          {!taskVisbility && (
            <CameraIcon
              width={12}
              height={12}
              src={clipboardTask}
              alt="Arrow"
              onClick={() => {
                toggleTaskVisibility();
              }}
            />
          )}
        </IssuesSectionClipImg>
      </Tooltip>
      {openDrawer && (
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => setOpenDrawer((prev: any) => !prev)}
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
