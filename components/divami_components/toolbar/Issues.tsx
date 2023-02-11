import React, { useState } from "react";
// import { styled } from '@mui/material/styles'
import Image from "next/image";

import plusCircleIcon from "../../../public/divami_icons/plusCircleIcon.svg";
import fileTextIcon from "../../../public/divami_icons/fileTextIcon.svg";
import triWarnIcon from "../../../public/divami_icons/triWarnIcon.svg";
import clipboardSecondIcon from "../../../public/divami_icons/clipboardSecondIcon.svg";
// import  IssueListing  from "../../divami_components/issue_listing/IssueList";
import { styled } from "@mui/system";
// import IssueList from "../issue_listing/IssueList";

import {
  IssueBox,
  IssuesSectionPlusImg,
  IssuesSectionFileImg,
  IssuesSectionClipImg,
} from "./ToolBarStyles";
import { Drawer } from "@mui/material";
import CustomIssueListDrawer from "../issue-listing/IssueList";
import TaskList from "../task_list/TaskList";
import { ITools } from "../../../models/ITools";
import FilterCommon from "../filter-common/filterCommon";

const StyledDrawer = styled(Drawer)`
  & .MuiPaper-root {
    width: 438px;
  }
`;

const Issues = ({
  rightMenuClickHandler,
  issuesList,
  issueMenuClicked,
  handleOnFilter,
  myProject,
  myStructure,
  mySnapshot,
  closeFilterOverlay,
}: any) => {
  const [openIssueList, setOpenIssueList] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [listOverlay, setListOverlay] = useState(false);
  const [createOverlay, setCreateOverlay] = useState(false);
  // const [issueVisbility, setIssueVisibility] = useState(
  //   issueLayer === undefined ? false : issueLayer
  // );
  let issueMenuInstance: ITools = { toolName: "issue", toolAction: "" };

  const closeIssueList = () => {
    //setListOverlay(false);
    issueMenuInstance.toolAction = "issueViewClose";
    issueMenuClicked(issueMenuInstance);
  };
  const handleViewTaskList = () => {
    // console.log("teskssksk trigg");
    setOpenDrawer(true);
  };

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
            onClick={rightMenuClickHandler}
          />{" "}
        </IssuesSectionPlusImg>

        <IssuesSectionFileImg>
          <Image
            src={fileTextIcon}
            width={12}
            height={12}
            alt="Arrow"
            // onClick={() => {
            //   setOpenIssueList(true);
            // }}
            onClick={() => {
              handleViewTaskList();
            }}
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

      {/* {openIssueList && (
        <StyledDrawer
          anchor={"right"}
          open={openIssueList}
          onClose={() => setOpenIssueList((prev: any) => !prev)}
        >
          <IssueListing />
          
        </StyledDrawer>
      )} */}

      {openDrawer && (
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => setOpenDrawer((prev: any) => !prev)}
        >
          <CustomIssueListDrawer
            closeFilterOverlay={closeFilterOverlay}
            issuesList={issuesList}
            visibility={listOverlay}
            closeOverlay={closeIssueList}
            handleOnFilter={handleOnFilter}
            onClose={() => setOpenDrawer((prev: any) => !prev)}
            handleOnSort={() => {}}
            deleteTheIssue={() => {}}
            clickIssueEditSubmit={() => {}}
          />
          {/* <FilterCommon/> */}
        </Drawer>
      )}
    </div>
  );
};

export default Issues;
