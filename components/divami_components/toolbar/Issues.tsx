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
import CreateIssue from "../create-issue/CreateIssue";
import CustomDrawer from "../custom-drawer/custom-drawer";
import { createIssue } from "../../../services/issue";
import { toast } from "react-toastify";

const StyledDrawer = styled(Drawer)`
  & .MuiPaper-root {
    width: 438px;
  }
`;

const Issues = (props: any) => {
  const [openIssueList, setOpenIssueList] = useState(false);
  const [openCreateIssue, setOpenCreateIssue] = useState(false);
  // console.log(openIssueList, 'openIssueList')

  const handleCreateTask = (formData: any) => {
    console.log(formData, "form data at home");
    clickTaskSubmit(formData);
  };
  const clickTaskSubmit = (formData: any) => {
    let userIdList: any[] = [];
    const assignes = formData.filter((item: any) => item.id == "assignedTo")[0]
      ?.selectedName;
    if (assignes.length > 0) {
      assignes.map((user: any) => {
        userIdList.push(user.value);
      });
    }
    let data: any = {};
    data.structure = props.currentStructure?._id;
    data.title = `${props.currentStructure?.name}_${data.date} `;
    data.snapshot = props.currentSnapshot?._id;
    data.status = "To Do";
    data.context = props.contextInfo;
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
            onClick={() => {
              setOpenIssueList(true);
            }}
          />{" "}
        </IssuesSectionFileImg>

        <IssuesSectionClipImg>
          <Image
            src={clipboardSecondIcon}
            width={12}
            height={12}
            alt="Arrow"
            onClick={props.rightMenuClickHandler}
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
      {openCreateIssue && (
        <CustomDrawer open>
          <CreateIssue
            handleCreateTask={handleCreateTask}
            setOpenCreateTask={setOpenCreateIssue}
            currentProject={props.currentProject}
            currentSnapshot={props.currentSnapshot}
            currentStructure={props.currentStructure}
            contextInfo={props.contextInfo}
          />
        </CustomDrawer>
      )}
    </div>
  );
};

export default Issues;
