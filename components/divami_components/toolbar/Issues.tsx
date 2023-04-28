import React, { useEffect, useState } from "react";
// import { styled } from '@mui/material/styles'
import Image from "next/image";

import plusCircleIcon from "../../../public/divami_icons/plusCircleIcon.svg";
import fileTextIcon from "../../../public/divami_icons/fileTextIcon.svg";
import triWarnIcon from "../../../public/divami_icons/triWarnIcon.svg";
import clipboardSecondIcon from "../../../public/divami_icons/clipboardSecondIcon.svg";
import fileTextIssue from "../../../public/divami_icons/fileTextIssue.svg";

// import  IssueListing  from "../../divami_components/issue_listing/IssueList";
import { styled } from "@mui/system";
// import IssueList from "../issue_listing/IssueList";

import {
  IssueBox,
  IssuesSectionPlusImg,
  IssuesSectionFileImg,
  IssuesSectionClipImg,
  IssueTitle,
  CameraIcon,
} from "./ToolBarStyles";
import { Drawer, Tooltip } from "@mui/material";
import CreateIssue from "../create-issue/CreateIssue";
import CustomDrawer from "../custom-drawer/custom-drawer";
import {
  createIssue,
  createIssueWithAttachments,
} from "../../../services/issue";
import { toast } from "react-toastify";
import TaskList from "../task_list/TaskList";
import { ITools } from "../../../models/ITools";
import CustomIssueListDrawer from "../issue-listing/IssueList";
import { ISnapshot } from "../../../models/ISnapshot";
import { IStructure } from "../../../models/IStructure";
import CustomIssueDetailsDrawer from "../issue_detail/IssueDetail";
import html2canvas from "html2canvas";
import moment from "moment";

const StyledDrawer = styled(Drawer)`
  & .MuiPaper-root {
    width: 438px;
  }
`;

const ToasterIconMessage = styled("div")({});

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
  issuePriorityList,
  issueStatusList,
  issueTypesList,
  issueFilterState,
  closeIssueCreate,
  deleteTheIssue,
  openIssueDetails,
  closeIssueDetails,
  setIssueList,
  getIssues,
  handleOnIssueSort,
  issueSubmit,
  deleteTheAttachment,
  projectUsers,
}: any) => {
  const [openIssueList, setOpenIssueList] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [listOverlay, setListOverlay] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState<Blob>();

  const [openCreateIssue, setOpenCreateIssue] = useState(false);
  const [issueVisbility, setIssueVisibility] = useState(true);
  let toolInstance: ITools = { toolName: "issue", toolAction: "issueCreate" };
  const [myProject, setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  const [selectedIssue, setSelectedIssue] = useState({});
  let issueMenuInstance: ITools = { toolName: "issue", toolAction: "" };
  const [enableSubmit, setEnableSubmit] = useState(true);

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
  }, [currentProject, currentSnapshot, currentStructure, issueOpenDrawer]);

  const closeIssueList = () => {
    issueMenuInstance.toolAction = "issueViewClose";
    issueMenuClicked(issueMenuInstance);
  };
  const handleViewTaskList = () => {
    setOpenDrawer(true);
  };

  const handleCreateTask = (formData: any) => {
    if (enableSubmit) {
      clickTaskSubmit(formData);
    }
  };

  const clickTaskSubmit = async (values: any) => {
    const userIdList = values
      .find((item: any) => item.id == "assignedTo")
      ?.selectedName?.map((each: any) => {
        return each._id || each.value;
      });

    const formData = new FormData();
    let data: any = {};

    data.structure = currentStructure?._id;
    data.snapshot = currentSnapshot?._id;
    data.status = "To Do";
    data.owner = values?.owner;

    Object.keys(contextInfo).forEach((key) => {
      if (key !== "id") {
        data.context = { ...data.context, [key]: contextInfo[key] };
      }
    });

    data.tags = values.filter(
      (item: any) => item.id == "tag-suggestions"
    )[0]?.chipString;

    data.title = values.filter(
      (item: any) => item.id == "title"
    )[0]?.defaultValue;

    data.type = values.filter(
      (item: any) => item.id == "issueType"
    )[0]?.defaultValue;

    data.priority = values.filter(
      (item: any) => item.id == "issuePriority"
    )[0]?.defaultValue;
    data.description = values.filter(
      (item: any) => item.id == "description"
    )[0]?.defaultValue;

    (data.assignees = userIdList), formData.append("assignees", data.assignees);

    data.startDate = values
      .filter((item: any) => item.id === "dates")[0]
      ?.fields.filter((item: any) => item.id == "start-date")[0]?.defaultValue;
    data.startDate = moment(data.startDate).format("YYYY-MM-DD");
    data.dueDate = values
      .filter((item: any) => item.id === "dates")[0]
      ?.fields.filter((item: any) => item.id == "due-date")[0]?.defaultValue;
    data.dueDate = moment(data.dueDate).format("YYYY-MM-DD");
    data.attachments = values.filter(
      (item: any) => item.id === "file-upload"
    )[0].selectedFile;

    for (let i = 0; i < data.attachments?.length; i++) {
      if (data.attachments![i].size > 50 * 1024 * 1024) {
        toast.error("file size is too large. failed to create issue");
        return;
      }
      formData.append("attachments", data.attachments![i]);
    }
    data.screenshot = image;

    formData.append("screenshot", image as Blob, "imageName.png");
    delete data["screenshot"];
    delete data["attachments"];
    delete data["id"];
    formData.append("jreq", JSON.stringify(data));
    const projectId = values.filter((item: any) => item.projectId)[0].projectId;
    if (data.title && data.type && data.priority && data.description) {
      setEnableSubmit(false);
      createIssueWithAttachments(projectId as string, formData)
        .then((response) => {
          if (response.success === true) {
            toast.success(" Issue Created Successfully");
            setEnableSubmit(false);
            issueSubmitFn(response.result);
          } else {
            toast.error(`Something went wrong`);
            setEnableSubmit(true);
          }
        })
        .catch((error) => {
          if (error.message == "Forbidden Access") {
            toast(`You can't create an issue. Ask the Project Admin for help`);
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
    issueMenuInstance.toolAction = "issueCreateFail";
    issueMenuClicked(issueMenuInstance);
    closeIssueCreate();
  };

  useEffect(() => {
    if (openIssueDetails && contextInfo?.id) {
      const selectedObj = issuesList.find(
        (each: any) => each._id === contextInfo.id
      );
      setSelectedIssue(selectedObj);
    }
  }, [openIssueDetails, contextInfo?.id, issuesList]);

  const issueSubmitFn = (formdata: any) => {
    issueMenuInstance.toolAction = "issueCreateSuccess";
    issueMenuClicked(issueMenuInstance);
    closeIssueCreate();
    issueSubmit(formdata);
    setEnableSubmit(true);
  };
  const openIssueCreateFn = () => {
    issueMenuInstance.toolAction = "issueCreate";
    issueMenuClicked(issueMenuInstance);
  };

  const openIssueListFn = () => {
    issueMenuInstance.toolAction = "issueView";
    issueMenuClicked(issueMenuInstance);
  };

  const toggleIssueVisibility = () => {
    if (issueVisbility) issueMenuInstance.toolAction = "issueHide";
    else issueMenuInstance.toolAction = "issueShow";
    issueMenuClicked(issueMenuInstance);
    setIssueVisibility(!issueVisbility);
  };

  useEffect(() => {
    setOpenCreateIssue(issueOpenDrawer);
  }, [issueOpenDrawer]);

  return (
    <>
      {/* <DownloadTable /> */}
      {/* <PrintPage /> */}
      <IssueBox>
        <IssueTitle>Issues:</IssueTitle>

        <Tooltip title="Create Issue">
          <IssuesSectionPlusImg>
            <CameraIcon
              src={plusCircleIcon}
              alt="Arrow"
              onClick={() => {
                openIssueCreateFn();
              }}
              width={12}
              height={12}
            />
          </IssuesSectionPlusImg>
        </Tooltip>

        <Tooltip title="Issue List">
          <IssuesSectionFileImg>
            <CameraIcon
              src={fileTextIcon}
              width={12}
              height={12}
              alt="Arrow"
              onClick={() => {
                openIssueListFn();
                handleViewTaskList();
              }}
            />
          </IssuesSectionFileImg>
        </Tooltip>

        <Tooltip title={issueVisbility ? "Show Issues" : "Hide Issues"}>
          <IssuesSectionClipImg>
            {issueVisbility && (
              <CameraIcon
                width={12}
                height={12}
                src={fileTextIssue}
                alt="Arrow"
                onClick={() => {
                  toggleIssueVisibility();
                }}
              />
            )}

            {!issueVisbility && (
              <CameraIcon
                width={12}
                height={12}
                src={clipboardSecondIcon}
                alt="Arrow"
                onClick={() => {
                  toggleIssueVisibility();
                }}
              />
            )}
          </IssuesSectionClipImg>
        </Tooltip>
      </IssueBox>

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
            deleteTheIssue={deleteTheIssue}
            clickIssueEditSubmit={() => {}}
            issuePriorityList={issuePriorityList}
            issueStatusList={issueStatusList}
            currentStructure={currentStructure}
            currentSnapshot={currentSnapshot}
            contextInfo={contextInfo}
            currentProject={currentProject}
            issueTypesList={issueTypesList}
            issueFilterState={issueFilterState}
            getIssues={getIssues}
            handleOnIssueSort={handleOnIssueSort}
            deleteTheAttachment={deleteTheAttachment}
            openIssueCreateFn={openIssueCreateFn}
            issueMenuClicked={issueMenuClicked}
            projectUsers={projectUsers}
          />
        </Drawer>
      )}
      {openCreateIssue && (
        <CustomDrawer>
          <CreateIssue
            handleCreateTask={handleCreateTask}
            currentProject={myProject}
            currentSnapshot={currentSnapshot}
            currentStructure={currentStructure}
            contextInfo={contextInfo}
            closeIssueCreate={closeIssueCreate}
            issueStatusList={issueStatusList}
            onCancelCreate={onCancelCreate}
            deleteTheAttachment={deleteTheAttachment}
          />
        </CustomDrawer>
      )}

      {openIssueDetails && (
        <Drawer
          anchor={"right"}
          open={openIssueDetails}
          onClose={() => closeIssueDetails()}
        >
          <CustomIssueDetailsDrawer
            issue={selectedIssue}
            onClose={() => closeIssueDetails()}
            issueType={issueTypesList}
            issuePriority={issuePriorityList}
            issueStatus={issueStatusList}
            projectUsers={projectUsers}
            currentProject={currentProject}
            currentStructure={currentStructure}
            currentSnapshot={currentSnapshot}
            contextInfo={contextInfo}
            setIssueList={setIssueList}
            deleteTheAttachment={deleteTheAttachment}
            getIssues={getIssues}
            issuesList={issuesList}
          />
        </Drawer>
      )}
    </>
  );
};

export default Issues;
