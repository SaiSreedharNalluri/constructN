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
import CreateIssue from "../create-issue/CreateIssue";
import CustomDrawer from "../custom-drawer/custom-drawer";
import { createIssue } from "../../../services/issue";
import { toast } from "react-toastify";
import TaskList from "../task_list/TaskList";
import { ITools } from "../../../models/ITools";
import CustomIssueListDrawer from "../issue-listing/IssueList";

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
  contextInfo,
}: any) => {
  const [openIssueList, setOpenIssueList] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [listOverlay, setListOverlay] = useState(false);
  const [createOverlay, setCreateOverlay] = useState(false);
  const [openCreateIssue, setOpenCreateIssue] = useState(false);
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

  const handleCreateTask = (formData: any) => {
    console.log(formData, "form data at home");
    clickTaskSubmit(formData);
  };
  const clickTaskSubmit = (formData: any) => {
    let userIdList: any[] = [];
    const assignes = formData.filter((item: any) => item.id == "assignedTo")[0]
      ?.selectedName;
    if (assignes && assignes.length > 0) {
      assignes.map((user: any) => {
        userIdList.push(user.value);
      });
    }
    let data: any = {};
    data.structure = myStructure?._id;
    data.title = `${myStructure?.name}_${data.date} `;
    data.snapshot = mySnapshot?._id;
    data.status = "To Do";
    data.context = contextInfo;
    (data.type = formData.filter(
      (item: any) => item.id == "issueType"
    )[0]?.defaultValue),
      (data.priority = formData.filter(
        (item: any) => item.id == "issuePriority"
      )[0]?.defaultValue),
      (data.description = formData.filter(
        (item: any) => item.id == "description"
      )[0]?.defaultValue),
      (data.assignees = userIdList),
      (data.tags =
        formData.filter((item: any) => item.id == "tag-suggestions")[0]
          ?.chipString || []),
      (data.startDate = formData.filter(
        (item: any) => item.id == "start-date"
      )[0]?.defaultValue);
    data.dueDate = formData.filter(
      (item: any) => item.id == "due-date"
    )[0]?.defaultValue;
    const projectId = formData.filter((item: any) => item.projectId)[0]
      .projectId;
    console.log("formData", data);
    createIssue(projectId as string, data)
      .then((response) => {
        if (response.success === true) {
          toast.success("Issue added sucessfully");
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
            // onClick={rightMenuClickHandler}
            onClick={() => {
              setOpenCreateIssue(true);
            }}
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
      {openCreateIssue && (
        <CustomDrawer open>
          <CreateIssue
            handleCreateTask={handleCreateTask}
            setOpenCreateTask={setOpenCreateIssue}
            currentProject={myProject}
            currentSnapshot={mySnapshot}
            currentStructure={myStructure}
            contextInfo={contextInfo}
          />
        </CustomDrawer>
      )}
    </div>
  );
};

export default Issues;
