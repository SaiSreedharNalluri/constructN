import React from "react";
// import { styled } from '@mui/material/styles'
import Image from "next/image";

import plusCircleIcon from "../../../public/divami_icons/plusCircleIcon.svg";
import fileTextIcon from "../../../public/divami_icons/fileTextIcon.svg";
import triWarnIcon from "../../../public/divami_icons/triWarnIcon.svg";
import clipboardSecondIcon from "../../../public/divami_icons/clipboardSecondIcon.svg";
import {
  IssueBox,
  IssuesSectionPlusImg,
  IssuesSectionFileImg,
  IssuesSectionClipImg,
} from "./ToolBarStyles";

const Issues = ({ rightMenuClickHandler }: any) => {
  return (
    <IssueBox>
      <div>Issues:</div>

      <IssuesSectionPlusImg>
        <Image
          src={plusCircleIcon}
          width={12}
          height={12}
          alt="Arrow"
          id="issue"
          onClick={rightMenuClickHandler}
        />{" "}
      </IssuesSectionPlusImg>

      <IssuesSectionFileImg>
        <Image
          src={fileTextIcon}
          width={12}
          height={12}
          alt="Arrow"
          id="issue"
          onClick={rightMenuClickHandler}
        />{" "}
      </IssuesSectionFileImg>

      <IssuesSectionClipImg>
        <Image
          src={clipboardSecondIcon}
          width={12}
          height={12}
          alt="Arrow"
          id="issue"
          onClick={rightMenuClickHandler}
        />{" "}
      </IssuesSectionClipImg>
    </IssueBox>
  );
  // <div className={styles.thirdBox}>

  // </div>
};

export default Issues;
