import React, { useEffect, useState } from "react";
// import { styled } from '@mui/material/styles'
import Image from "next/image";

import plusCircleIcon from "../../../public/divami_icons/plusCircleIcon.svg";
import plusCircleIconHighlighted from "../../../public/divami_icons/plusCircleIconHighlighted.svg";
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
import CreateIssue from "../../divami_components/create-issue/CreateIssue";
import CustomDrawer from "../../divami_components/custom-drawer/custom-drawer";
import {
  createIssue,
  createIssueWithAttachments,
} from "../../../services/issue";
import TaskList from "../rightFloatingMenu/taskMenu/taskList";
import { ITools } from "../../../models/ITools";
import CustomIssueListDrawer from "../../divami_components/issue-listing/IssueList";
import { ISnapshot } from "../../../models/ISnapshot";
import { IStructure } from "../../../models/IStructure";
import CustomIssueDetailsDrawer from "../../divami_components/issue_detail/IssueDetail";
import html2canvas from "html2canvas";
import moment from "moment";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";
import { getTimeInProjectTimezone } from "../../../utils/utils";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import { MqttConnector } from "../../../utils/MqttConnector";
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
  setIssueFilterState,
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
  issueLoader,
  setIssueLoader,
  setShowIssueMarkups,
  showIssueMarkups,
  setHighlightCreateIcon,
  highlightCreateIcon,
  setHighlightCreateTaskIcon,
  initData
}: any) => {
  const customLogger = new CustomLoggerClass();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [listOverlay, setListOverlay] = useState(false);
  const [image, setImage] = useState<Blob>();

  const [openCreateIssue, setOpenCreateIssue] = useState(false);
  const [showHideIssue,setShowHideIssue] = useState(false)
  // const [issueVisbility, setIssueVisibility] = useState(showIssueMarkups);
  const [myProject, setMyProject] = useState(currentProject);
  const [selectedIssue, setSelectedIssue] = useState({});
  let issueMenuInstance: ITools = { toolName: "issue", toolAction: "" };
  const [enableSubmit, setEnableSubmit] = useState(true);
  const[isLoading,setLoading]=useState(false)
  const [conn, setConn] = useState<MqttConnector>(MqttConnector.getConnection());
  useEffect(() => {
    setMyProject(currentProject);
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
    setEnableSubmit(false);
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
      (item: any) => item.id == "create_title"
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
  
    let startDate = new Date(data.startDate)
    startDate.setHours(0,0,0,0);
    // console.log("TimezoneTest: startDate ", moment(startDate).format("yyyy-MM-DD HH:mm"), moment.tz(moment(startDate).format("yyyy-MM-DD HH:mm"), "America/Chicago").utc().format());
    data.startDate = `${getTimeInProjectTimezone(startDate).utc().format()}`;

    data.dueDate = values
      .filter((item: any) => item.id === "dates")[0]
      ?.fields.filter((item: any) => item.id == "due-date")[0]?.defaultValue;
    let dueDate: Date = new Date(data.dueDate);
    dueDate.setHours(23,59,0,0);
    // console.log("TimezoneTest: dueDate ", moment(dueDate).format("yyyy-MM-DD HH:mm"), moment.tz(moment(dueDate).format("yyyy-MM-DD HH:mm"), "America/Chicago").utc().format());
    data.dueDate = `${getTimeInProjectTimezone(dueDate).utc().format()}`;

    data.attachments = values.filter(
      (item: any) => item.id === "file-upload"
    )[0].selectedFile;

    for (let i = 0; i < data.attachments?.length; i++) {
      if (data.attachments![i].size > 50 * 1024 * 1024) {
        CustomToast("Please upload file(s) <50 MB","error");
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
    if (data.title && data.type && data.priority) {
      createIssueWithAttachments(projectId as string, formData)
        .then((response) => {
          if (response.success === true) {
            CustomToast(" Issue created successfully","success");
            setEnableSubmit(true);
            issueSubmitFn(response.result);
          } else {
            CustomToast(`Something went wrong`,"error");
            setEnableSubmit(true);
          }
          setLoading(false)
        })
        .catch((error) => 
        {
          if (error.status ===  403) {
            CustomToast(`You don't have permission. Contact Admin.`,"error");
          } else if(error.status === 415)
          {
            CustomToast(error?.data?.message,"error");
          }else {
            CustomToast(`Something went wrong`,"error");   
          }
          setLoading(false)
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
    issueMenuInstance.response = { ...formdata.context, id: formdata._id };
    issueMenuClicked(issueMenuInstance);
    closeIssueCreate();
    issueSubmit(formdata);
    setEnableSubmit(true);
  };
  const openIssueCreateFn = () => {
    issueMenuInstance.toolAction = "issueCreate";
    customLogger.logInfo("ToolBar - Create Issue")
    issueMenuClicked(issueMenuInstance);
      setHighlightCreateIcon(true) 
      setHighlightCreateTaskIcon(false)
  };
  console.log(isLoading,"issue");
  
  // const openIssueListFn = () => {
  //   issueMenuInstance.toolAction = "issueView";
  //   customLogger.logInfo("ToolBar - View Issue")
  //   issueMenuClicked(issueMenuInstance);
  //   setHighlightCreateIcon(false)
  //   setHighlightCreateTaskIcon(false)
  // };

  const toggleIssueVisibility = () => {
    if (showHideIssue) {
      issueMenuInstance.toolAction = "issueHide";
      customLogger.logInfo("ToolBar - Hide Issue")
    }
    if (showHideIssue) {issueMenuInstance.toolAction = "issueHide";
    conn?.publishMessage("abc", '{"type":"showIssue","data":" "}')}
    
    else {issueMenuInstance.toolAction = "issueShow";
    conn?.publishMessage("abc", '{"type":"hideIssue","data":" "}')}
    customLogger.logInfo("ToolBar - Show Issue")
    // issueMenuClicked(issueMenuInstance);
     setShowHideIssue(!showHideIssue);
    // setHighlightCreateIcon(false)
    // setHighlightCreateTaskIcon(false)

  };

  useEffect(() => {
    setOpenCreateIssue(issueOpenDrawer);
  }, [issueOpenDrawer]);

  return (
  
      <IssueBox onKeyDown={(e: any) => {
        const arrowKeys = ["ArrowUp", "ArrowDown",'ArrowRight','ArrowLeft'];
        if (arrowKeys.includes(e.key)) {
         e.stopPropagation();
       }
      }}>
        <IssueTitle>Issues:</IssueTitle>

        <Tooltip title="Create Issue">
          <IssuesSectionPlusImg 
           onClick={() => {
                openIssueCreateFn(); 
              }} className={highlightCreateIcon?"  bg-[#F1742E] hover:bg-[#F1742E] ":""}>
            <CameraIcon
              src={highlightCreateIcon?plusCircleIconHighlighted:plusCircleIcon}
              alt="Arrow"
              width={12}
              height={12}
            />
          </IssuesSectionPlusImg>
        </Tooltip>

        <Tooltip title="Issue List">
          <IssuesSectionFileImg 
           onClick={() => {
                // openIssueListFn();
                // handleViewTaskList();
                // conn?.publishMessage("abc", '{"type":"showIssue","data":" "}')
              }}>
            <CameraIcon
              src={fileTextIcon}
              width={12}
              height={12}
              alt="Arrow"
            />
          </IssuesSectionFileImg>
        </Tooltip>

        <Tooltip title={showHideIssue ? "Show Issues" : "Hide Issues"}>
          <IssuesSectionClipImg  onClick={() => {
                  toggleIssueVisibility();
                  
                }}>
            {showHideIssue && (
              <CameraIcon
                width={12}
                height={12}
                src={fileTextIssue}
                alt="Arrow"
              />
            )}

            {!showHideIssue && (
              <CameraIcon
                width={12}
                height={12}
                src={clipboardSecondIcon}
                alt="Arrow"
              />
            )}
          </IssuesSectionClipImg>
        </Tooltip>
        {openDrawer && (
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => {
            setIssueList([
              ...issuesList.sort((a: any, b: any) => {
                return (
                  new Date(b.createdAt).valueOf() -
                  new Date(a.createdAt).valueOf()
                );
              }),
            ]);
            setOpenDrawer((prev: any) => !prev);
          }}
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
            setIssueFilterState={setIssueFilterState}
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
            setLoading={setLoading}
            isLoading={isLoading}
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
            deleteTheIssue={deleteTheIssue}
            issueLoader={issueLoader}
            setIssueLoader={setIssueLoader}
          />
        </Drawer>
      )}
      </IssueBox>

   
   
  );
};

export default Issues;
