import React, { useState } from "react";
// import { styled } from '@mui/material/styles'
import Image from "next/image";

import plusCircleIcon from "../../../public/divami_icons/plusCircleIcon.svg";
import fileTextIcon from "../../../public/divami_icons/fileTextIcon.svg";
import triWarnIcon from "../../../public/divami_icons/triWarnIcon.svg";
import clipboardSecondIcon from "../../../public/divami_icons/clipboardSecondIcon.svg";
import { IssueListing } from "../../divami_components/issue_list/IssueList";
import { styled } from "@mui/system";

import {
  IssueBox,
  IssuesSectionPlusImg,
  IssuesSectionFileImg,
  IssuesSectionClipImg,
} from "./ToolBarStyles";
import { Drawer } from "@mui/material";

const StyledDrawer = styled(Drawer)`
  & .MuiPaper-root {
    width: 438px;
  }
`;

const Issues = ({ rightMenuClickHandler }: any) => {
  const [openIssueList, setOpenIssueList] = useState(false);
  // console.log(openIssueList, 'openIssueList')

  const handleViewList = () => {
    // setOpenIssueList()
  };
  return (
    <div>
      <IssueBox>
        <div>Issues:</div>

        <IssuesSectionPlusImg>
          <Image
            src={plusCircleIcon}
            width={12}
            height={12}
            alt="Arrow"
            onClick={() => {
              setOpenIssueList(true);
            }}
          />{" "}
        </IssuesSectionPlusImg>

        <IssuesSectionFileImg>
          <Image
            src={fileTextIcon}
            width={12}
            height={12}
            alt="Arrow"
            onClick={rightMenuClickHandler}
          />{" "}
        </IssuesSectionFileImg>

        <IssuesSectionClipImg>
          <Image
            src={clipboardSecondIcon}
            width={12}
            height={12}
            alt="Arrow"
            onClick={rightMenuClickHandler}
          />{" "}
        </IssuesSectionClipImg>
      </IssueBox>

      {openIssueList && (
        <StyledDrawer
          anchor={"right"}
          open={openIssueList}
          onClose={() => setOpenIssueList((prev: any) => !prev)}
        >
          <IssueListing />
        </StyledDrawer>
      )}
    </div>
  );
};

export default Issues;
