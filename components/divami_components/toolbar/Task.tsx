import React, { useState } from "react";

import Drawer from "@mui/material/Drawer";
import Image from "next/image";

import styles from "../toolbar/toolbar.module.css";

import plusCircleIcon from "../../../public/divami_icons/plusCircleIcon.svg";
import fileTextIcon from "../../../public/divami_icons/fileTextIcon.svg";
import triWarnIcon from "../../../public/divami_icons/triWarnIcon.svg";
import clipboardIcon from "../../../public/divami_icons/clipboardIcon.svg";
import clipboardSecondIcon from "../../../public/divami_icons/clipboardSecondIcon.svg";
import {
  TaskBox,
  TaskTitleDiv,
  IssuesSectionPlusImg,
  IssuesSectionFileImg,
  IssuesSectionClipImg,
} from "./ToolBarStyles";
import TaskList from "../task_list/TaskList";
import CreateTask from "../create-task/CreateTask";
import CustomDrawer from "../custom-drawer/custom-drawer";
import { createTask } from "../../../services/task";
import { toast } from "react-toastify";

const Task = (props: any) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);

  const handleViewTaskList = () => {
    console.log("teskssksk trigg");
    setOpenDrawer(true);
  };
  const handleCreateTask = (formData: any) => {
    console.log(formData, "form data at home");
    clickTaskSubmit(formData);
  };
  const clickTaskSubmit = (formData: any) => {
    let data: any = {};
    data.structure = props.currentStructure?._id;
    data.title = `${props.currentStructure?.name}_${data.date} `;
    data.snapshot = props.currentSnapshot?._id;
    data.status = "To Do";
    data.context = props.contextInfo;
    (data.type = formData.filter(
      (item: any) => item.id == "tasks"
    )[0]?.defaultValue),
      (data.priority = formData.filter(
        (item: any) => item.id == "taskPriority"
      )[0]?.defaultValue),
      (data.description = formData.filter(
        (item: any) => item.id == "description"
      )[0]?.defaultValue),
      (data.assignees = formData.filter(
        (item: any) => item.id == "assignedTo"
      )[0]?.selectedName),
      (data.tags = (
        formData.filter((item: any) => item.id == "tag-suggestions")[0]
          ?.chipString || []
      ).toString()),
      (data.startdate = formData.filter(
        (item: any) => item.id == "start-date"
      )[0]?.defaultValue);
    data.duedate = formData.filter(
      (item: any) => item.id == "due-date"
    )[0]?.defaultValue;
    const projectId = formData.filter((item: any) => item.projectId)[0]
      .projectId;
    console.log("formData", data);
    createTask(projectId as string, data)
      .then((response) => {
        if (response.success === true) {
          toast.success("Task added sucessfully");
          // handleTaskSubmit(formData);
          console.log(formData);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  return (
    <TaskBox>
      <TaskTitleDiv>Task: </TaskTitleDiv>

      <IssuesSectionPlusImg>
        <Image
          onClick={() => {
            setOpenCreateTask(true);
          }}
          src={plusCircleIcon}
          width={12}
          height={12}
          alt="Arrow"
        />{" "}
      </IssuesSectionPlusImg>

      <IssuesSectionFileImg>
        <Image
          onClick={() => {
            handleViewTaskList();
          }}
          src={fileTextIcon}
          width={12}
          height={12}
          alt="Arrow"
        />{" "}
      </IssuesSectionFileImg>

      <IssuesSectionClipImg>
        <Image src={clipboardSecondIcon} width={12} height={12} alt="Arrow" />{" "}
      </IssuesSectionClipImg>
      {openDrawer && (
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => setOpenDrawer((prev: any) => !prev)}
        >
          <TaskList />
        </Drawer>
      )}
      {openCreateTask && (
        <CustomDrawer open>
          <CreateTask
            handleCreateTask={handleCreateTask}
            setOpenCreateTask={setOpenCreateTask}
            currentProject={props.currentProject}
            currentSnapshot={props.currentSnapshot}
            currentStructure={props.currentStructure}
            contextInfo={props.contextInfo}
          />
        </CustomDrawer>
      )}
    </TaskBox>
  );
};

export default Task;
