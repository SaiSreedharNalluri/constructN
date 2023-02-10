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

const Task = ({
  rightMenuClickHandler,
  tasksList,
  toolClicked,
  currentProject,
  currentSnapshot,
  currentStructure,
  currentLayersList,
  currentTypesList,
  closeTaskFilterOverlay,
  handleOnTaskFilter,
}: any) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rightNav, setRighttNav] = useState(false);
  const [myProject, setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState(currentStructure);
  const [mySnapshot, setMySnapshot] = useState(currentSnapshot);
  const [myTypesList, setMyTypesList] = useState(currentTypesList);

  const taskMenuClicked = (localTool: any) => {
    toolClicked(localTool);
    if (
      localTool.toolAction === "taskCreateClose" ||
      localTool.toolAction === "taskViewClose"
    )
      setRighttNav(!rightNav);
  };

  const handleViewTaskList = () => {
    setOpenDrawer(true);
  };
  return (
    <TaskBox>
      <TaskTitleDiv>Task: </TaskTitleDiv>

      <IssuesSectionPlusImg>
        <Image
          src={plusCircleIcon}
          onClick={rightMenuClickHandler}
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
        <Image
          src={clipboardSecondIcon}
          width={12}
          height={12}
          onClick={rightMenuClickHandler}
          alt="Arrow"
        />{" "}
      </IssuesSectionClipImg>
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
            closeTaskFilterOverlay={closeTaskFilterOverlay}
            handleOnTaskFilter={handleOnTaskFilter}
            onClose={() => setOpenDrawer((prev: any) => !prev)}
          />
        </Drawer>
      )}
    </TaskBox>
  );
};

export default Task;
