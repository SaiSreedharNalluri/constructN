import React, { useEffect, useState } from "react";
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
import { ISnapshot } from "../../../models/ISnapshot";
import { IStructure } from "../../../models/IStructure";

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
  currentStructure,
  currentSnapshot,
  closeFilterOverlay,
  contextInfo,
  issueLayer,
  currentProject,
  issueOpenDrawer,
}: any) => {
  const [openIssueList, setOpenIssueList] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [listOverlay, setListOverlay] = useState(false);
  const [createOverlay, setCreateOverlay] = useState(false);
  const [openCreateIssue, setOpenCreateIssue] = useState(false);
  const [issueVisbility, setIssueVisibility] = useState(
    issueLayer === undefined ? false : issueLayer
  );
  let toolInstance: ITools = { toolName: "issue", toolAction: "issueCreate" };
  const [myProject, setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  let issueMenuInstance: ITools = { toolName: "issue", toolAction: "" };
  useEffect(() => {
    setMyProject(currentProject);
    setMyStructure(currentStructure);
    setMySnapshot(currentSnapshot);
  }, [currentProject, currentSnapshot, currentStructure]);
  const closeIssueList = () => {
    //setListOverlay(false);
    issueMenuInstance.toolAction = "issueViewClose";
    issueMenuClicked(issueMenuInstance);
  };
  const handleViewTaskList = () => {
    // console.log("teskssksk trigg");
    setOpenDrawer(true);
  };

  const handleCreateTask = (formData: any) => {
    console.log(formData, "form data at home");
    clickTaskSubmit(formData);
  };
  const clickTaskSubmit = (formData: any) => {
    let userIdList: any[] = [];
    const assignes = formData.filter((item: any) => item.id == "assignedTo")[0]
      ?.selectedName;
    userIdList.push(assignes.value);
    // if (assignes && assignes.length > 0) {
    //   assignes.map((user: any) => {
    //     userIdList.push(user.value);
    //   });
    // }
    let data: any = {};
    data.structure = currentStructure?._id;
    data.snapshot = currentSnapshot?._id;
    data.status = "To Do";
    data.owner = formData.owner;
    console.log(contextInfo, "contexxt");
    Object.keys(contextInfo).forEach((key) => {
      if (key !== "id") {
        data.context = { ...data.context, [key]: contextInfo[key] };
      }
    });

    console.log(data.context, "datraocmte", contextInfo);
    data.title = formData.filter(
      (item: any) => item.id == "title"
    )[0]?.defaultValue;
    data.type = formData.filter(
      (item: any) => item.id == "issueType"
    )[0]?.defaultValue;
    data.priority = formData.filter(
      (item: any) => item.id == "issuePriority"
    )[0]?.defaultValue;
    (data.description = formData.filter(
      (item: any) => item.id == "description"
    )[0]?.defaultValue),
      (data.assignees = userIdList),
      (data.tags =
        (formData.length
          ? formData
              .filter((item: any) => item.id == "tag-suggestions")[0]
              ?.chipString?.join(";")
          : []) || []),
      (data.startDate = formData
        .filter((item: any) => item.id === "dates")[0]
        ?.fields.filter(
          (item: any) => item.id == "start-date"
        )[0]?.defaultValue);
    data.dueDate = formData
      .filter((item: any) => item.id === "dates")[0]
      ?.fields.filter((item: any) => item.id == "due-date")[0]?.defaultValue;
    data.attachments = formData
      .filter((item: any) => item.id === "file-upload")[0]
      .selectedFile.map((eachSelectedFile: any) => {
        // let reader = new FileReader();
        // let fileUrl: any = '';
        // reader.readAsDataURL(eachSelectedFile)
        // reader.onload = () => {
        //   console.log("CHECK RESULT FILE", reader.result);
        //   fileUrl = reader.result ? reader.result : '';
        // };
        // reader.onerror = function (error) {
        //   console.log('Error: ', error);
        // }
        return {
          name: eachSelectedFile.name,
          url: eachSelectedFile.name,
          entity: "image",
        };
      });
    const projectId = formData.filter((item: any) => item.projectId)[0]
      .projectId;
    console.log("formData", data);
    createIssue(projectId as string, data)
      .then((response) => {
        if (response.success === true) {
          toast.success("Issue added sucessfully");
          // handleTaskSubmit(formData);
          console.log(formData);
          issueSubmit(response.result);
          toolInstance.toolAction = "issueCreateSuccess";
          // issueToolClicked(toolInstance);
          // resetForm();
        } else {
          toolInstance.toolAction = "issueCreateFail";
          // issueToolClicked(toolInstance);
        }
      })
      .catch((error) => {
        toolInstance.toolAction = "issueCreateFail";
        // issueToolClicked(toolInstance);
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const handleViewList = () => {
    // setOpenIssueList()
  };

  const issueSubmit = (formdata: any) => {
    issuesList.push(formdata);
    issueMenuInstance.toolAction = "issueCreated";
    setCreateOverlay(false);
    issueMenuClicked(issueMenuInstance);
  };
  const openIssueCreateFn = () => {
    //setCreateOverlay(true);
    issueMenuInstance.toolAction = "issueCreate";
    issueMenuClicked(issueMenuInstance);
  };
  const closeIssueCreate = () => {
    issueMenuInstance.toolAction = "issueCreateClose";
    setCreateOverlay(false);
    issueMenuClicked(issueMenuInstance);
  };
  const openIssueListFn = () => {
    //setListOverlay(true);
    console.log("coming herer");
    issueMenuInstance.toolAction = "issueView";
    issueMenuClicked(issueMenuInstance);
  };
  const closeIssueListFn = () => {
    //setListOverlay(false);
    issueMenuInstance.toolAction = "issueViewClose";
    issueMenuClicked(issueMenuInstance);
  };
  const toggleIssueVisibility = () => {
    setIssueVisibility(!issueVisbility);
    if (issueVisbility) issueMenuInstance.toolAction = "issueHide";
    else issueMenuInstance.toolAction = "issueShow";
    issueMenuClicked(issueMenuInstance);
  };

  useEffect(() => {
    setOpenCreateIssue(issueOpenDrawer);
  }, [issueOpenDrawer]);
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
              openIssueCreateFn();
              // setOpenCreateIssue(true);
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
              openIssueListFn();
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
            // onClick={rightMenuClickHandler}
            onClick={toggleIssueVisibility}
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
            currentSnapshot={currentSnapshot}
            currentStructure={currentStructure}
            contextInfo={contextInfo}
          />
        </CustomDrawer>
      )}
    </div>
  );
};

export default Issues;
