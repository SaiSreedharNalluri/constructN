import React from "react";

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

const Task = ({ rightMenuClickHandler }: any) => (
  <TaskBox>
    <TaskTitleDiv>Task: </TaskTitleDiv>

    <IssuesSectionPlusImg>
      <Image
        src={plusCircleIcon}
        width={12}
        height={12}
        alt="Arrow"
        id="task"
        onClick={rightMenuClickHandler}
      />{" "}
    </IssuesSectionPlusImg>

    <IssuesSectionFileImg>
      <Image
        src={fileTextIcon}
        width={12}
        height={12}
        alt="Arrow"
        id="task"
        onClick={rightMenuClickHandler}
      />{" "}
    </IssuesSectionFileImg>

    <IssuesSectionClipImg>
      <Image
        src={clipboardSecondIcon}
        width={12}
        height={12}
        alt="Arrow"
        id="task"
        onClick={rightMenuClickHandler}
      />{" "}
    </IssuesSectionClipImg>
  </TaskBox>
);

export default Task;
