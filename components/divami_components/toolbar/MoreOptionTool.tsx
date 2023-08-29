import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";

// import styles from '../toolbar/toolbar.module.css'
import Image from "next/image";
import {
  CreateOptionTask,
  CreateTaskDiv,
  HorizontalLineOpt,
  MoreOptionBox,
  MoreOptionContainer,
  OptionCameraIcon,
  OptionHotspotContainer,
  OptionListContainer,
  OptionSectionPlusImg,
  OptionTaskContainer,
  StyledOptionMenu,
  SwitchDiv,
  SwitchText,
  TaskHeader,
  TaskListDiv,
  TaskMarkupDiv,
  TaskOptionContainer,
} from "./ToolBarStyles";
import moreOptionCont from "../../../public/divami_icons/moreOptionCont.svg";
import { Menu, Switch } from "@mui/material";
import plusCircleIcon from "../../../public/divami_icons/plusCircleIcon.svg";
import fileTextIcon from "../../../public/divami_icons/fileTextIcon.svg";
import clipboardSecondIcon from "../../../public/divami_icons/clipboardSecondIcon.svg";
import markupTask from "../../../public/divami_icons/markupTask.svg";
import hotspotCircleIcon from "../../../public/divami_icons/hotspotCircleIcon.svg";
import taskToogleIcon from "../../../public/divami_icons/taskToogleIcon.svg";
import clipboardTask from "../../../public/divami_icons/clipboardTask.svg";
// Task List Imports

import TaskList from "../task_list/TaskList";
import CreateTask from "../create-task/CreateTask";
import CustomDrawer from "../custom-drawer/custom-drawer";
import { createTask, createTaskWithAttachments } from "../../../services/task";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";
import { ITools } from "../../../models/ITools";
import CustomTaskDetailsDrawer from "../task_detail/TaskDetail";
import Tooltip from "@mui/material/Tooltip";
import html2canvas from "html2canvas";
import moment from "moment";
import { setTheFormatedDate } from "../../../utils/ViewerDataUtils";
// Task List Imports
const MoreOptionTool = ({
  rightMenuClickHandler,
  tasksList,
  currentProject,
  currentSnapshot,
  currentStructure,
  currentLayersList,
  currentTypesList,
  closeTaskFilterOverlay,
  handleOnTaskFilter,
  contextInfo,
  taskOpenDrawer,
  taskLayer,
  taskMenuClicked,
  deleteTheTask,
  taskFilterState,
  closeTaskCreate,
  openTaskDetails,
  closeTaskDetails,
  getTasks,
  handleOnTasksSort,
  taskSubmit,
  deleteTheAttachment,
  projectUsers,
  taskStatusList,
  taskPriorityList,
}: any) => {
  // Task List code
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rightNav, setRighttNav] = useState(false);
  const [myProject, setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState(currentStructure);
  const [mySnapshot, setMySnapshot] = useState(currentSnapshot);
  const [myTypesList, setMyTypesList] = useState(currentTypesList);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [image, setImage] = useState<Blob>();
  const [showImage, setShowImage] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [taskVisbility, setTaskVisibility] = useState(true);

  let taskMenuInstance: ITools = { toolName: "task", toolAction: "" };

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
  }, [currentProject, currentSnapshot, currentStructure, taskOpenDrawer]);
  const handleViewTaskList = () => {
    setOpenDrawer(true);
  };
  const handleCreateTask = (formData: any) => {
    if (enableSubmit) {
      clickTaskSubmit(formData);
    }
  };
  const clickTaskSubmit = (formData: any) => {
    let data: any = {};
    const userIdList = formData
      .find((item: any) => item.id == "assignedTo")
      ?.selectedName?.map((each: any) => {
        return each._id || each.value;
      });
    data.structure = currentStructure?._id;
    data.snapshot = currentSnapshot?._id;
    data.status = "To Do";
    data.context = contextInfo;
    Object.keys(contextInfo).forEach((key) => {
      if (key !== "id") {
        data.context = { ...data.context, [key]: contextInfo[key] };
      }
    });
    data.title = formData.filter(
      (item: any) => item.id == "title"
    )[0]?.defaultValue;

    data.tags = formData.filter(
      (item: any) => item.id == "tag-suggestions"
    )[0]?.chipString;

    data.type = formData.filter(
      (item: any) => item.id == "tasks"
    )[0]?.defaultValue;
    (data.priority = formData.filter(
      (item: any) => item.id == "taskPriority"
    )[0]?.defaultValue),
      (data.description = formData.filter(
        (item: any) => item.id == "description"
      )[0]?.defaultValue),
      (data.assignees = userIdList),
      (data.startDate = formData
        .filter((item: any) => item.id === "dates")[0]
        ?.fields.filter(
          (item: any) => item.id == "start-date"
        )[0]?.defaultValue);
    data.startDate = setTheFormatedDate(data.startDate);
    data.dueDate = formData
      .filter((item: any) => item.id === "dates")[0]
      ?.fields.filter((item: any) => item.id == "due-date")[0]?.defaultValue;
    data.dueDate = setTheFormatedDate(data.dueDate);
    data.attachments = formData.filter(
      (item: any) => item.id === "file-upload"
    )[0].selectedFile;
    // ?.map((eachSelectedFile: any) => {
    //   // let reader = new FileReader();
    //   // let fileUrl: any = '';
    //   // reader.readAsDataURL(eachSelectedFile)
    //   // reader.onload = () => {
    //   //   console.log("CHECK RESULT FILE", reader.result);
    //   //   fileUrl = reader.result ? reader.result : '';
    //   // };
    //   // reader.onerror = function (error) {
    //   //   console.log('Error: ', error);
    //   // }
    //   return {
    //     name: eachSelectedFile.name,
    //     url: eachSelectedFile.name,
    //     entity: "image",
    //   };
    // });
    const formDataObj = new FormData();

    for (let i = 0; i < data.attachments?.length; i++) {
      if (data.attachments![i].size > 50 * 1024 * 1024) {
        CustomToast("Please upload file(s) <50 MB","error");
        return;
      }
      formDataObj.append("attachments", data.attachments![i]);
    }
    // data.screenshot = image;

    formDataObj.append("screenshot", image as Blob, "imageName.png");
    delete data["screenshot"];
    delete data["attachments"];
    delete data["id"];
    formDataObj.append("jreq", JSON.stringify(data));
    const projectId = formData.filter((item: any) => item.projectId)[0]
      .projectId;
    if (data.title && data.type && data.priority) {
      setEnableSubmit(false);

      createTaskWithAttachments(projectId as string, formDataObj)
        .then((response) => {
          if (response.success === true) {
            CustomToast("Task created successfully","success");

            setEnableSubmit(false);
            taskSubmitFn(response.result);
          } else {
            CustomToast(`Something went wrong`,"error");
            setEnableSubmit(true);
          }
        })
        .catch((error) => {
          if (error.message == "Forbidden Access") {
            CustomToast(`You don't have permission. Contact Admin.`,"message");
          } else {
            CustomToast(`Something went wrong`,"error");
          }
          setEnableSubmit(true);
        });
    } else {
      setEnableSubmit(true);
    }
  };

  const onCancelCreate = () => {
    taskMenuInstance.toolAction = "taskCreateFail";
    // setOpenCreateTask(false);
    taskMenuClicked(taskMenuInstance);
    closeTaskCreate();
  };

  useEffect(() => {
    if (openTaskDetails && contextInfo?.id) {
      const selectedObj = tasksList.find(
        (each: any) => each._id === contextInfo.id
      );
      setSelectedTask(selectedObj);
    }
  }, [openTaskDetails, contextInfo?.id, tasksList]);
  const taskSubmitFn = (formdata: any) => {
    // tasksList.push(formdata);
    taskMenuInstance.toolAction = "taskCreateSuccess";
    // setCreateOverlay(false);
    taskMenuClicked(taskMenuInstance);
    closeTaskCreate();
    taskSubmit(formdata);
    setEnableSubmit(true);
  };
  const openTaskCreateFn = () => {
    console.log("Hello ji");
    //setCreateOverlay(true);
    taskMenuInstance.toolAction = "taskCreate";
    taskMenuClicked(taskMenuInstance);
  };
  const closeTaskCreateFn = () => {
    taskMenuInstance.toolAction = "taskCreateClose";
    // setCreateOverlay(false);
    taskMenuClicked(taskMenuInstance);
  };
  const openTaskListFn = () => {
    // setListOverlay(true);
    taskMenuInstance.toolAction = "taskView";
    taskMenuClicked(taskMenuInstance);
  };
  const closeTaskListFn = () => {
    // setListOverlay(false);
    taskMenuInstance.toolAction = "taskViewClose";
    taskMenuClicked(taskMenuInstance);
  };
  const toggleTaskVisibility = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setTaskVisibility(!taskVisbility);

    if (taskVisbility) taskMenuInstance.toolAction = "taskHide";
    else taskMenuInstance.toolAction = "taskShow";
    taskMenuClicked(taskMenuInstance);
  };

  const handleToggle = () => {
    setShowImage(!showImage);
  };

  useEffect(() => {
    setOpenCreateTask(taskOpenDrawer);
  }, [taskOpenDrawer]);
  // Task List code
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSortMenuClose = () => {
    setIsSortMenuOpen(false);
    setAnchorEl(null);
  };

  // switch button code
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  // switch button code
  return (
    <MoreOptionBox>
      <MoreOptionContainer>
        <Image
          src={moreOptionCont}
          width={18}
          height={18}
          alt="Arrow"
          onClick={(e) => {
            setIsSortMenuOpen((prev) => !prev);
            handleSortClick(e);
          }}
        />{" "}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={isSortMenuOpen}
          onClose={handleSortMenuClose}
          onClick={handleSortMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <StyledOptionMenu>
            <OptionListContainer>
              <OptionTaskContainer>
                <TaskHeader>Task</TaskHeader>
                <TaskOptionContainer>
                  <CreateTaskDiv
                    onClick={() => {
                      openTaskCreateFn();
                    }}
                  >
                    <OptionSectionPlusImg>
                      <OptionCameraIcon
                        src={plusCircleIcon}
                        alt="Arrow"

                        // width={24}
                        // height={24}
                      />
                    </OptionSectionPlusImg>

                    <CreateOptionTask>Create Task</CreateOptionTask>
                  </CreateTaskDiv>
                  <HorizontalLineOpt></HorizontalLineOpt>

                  <TaskListDiv>
                    <OptionSectionPlusImg>
                      <OptionCameraIcon
                        src={fileTextIcon}
                        alt="Arrow"
                        onClick={() => {
                          handleViewTaskList();
                        }}
                        // width={24}
                        // height={24}
                      />
                    </OptionSectionPlusImg>

                    <CreateOptionTask>Task List</CreateOptionTask>
                  </TaskListDiv>
                  <HorizontalLineOpt></HorizontalLineOpt>
                  <TaskMarkupDiv>
                    <OptionSectionPlusImg>
                      {taskVisbility && (
                        <OptionCameraIcon
                          src={taskToogleIcon}
                          alt="Arrow"
                          width={18}
                          height={18}
                        />
                      )}

                      {!taskVisbility && (
                        <OptionCameraIcon
                          src={clipboardTask}
                          alt="Arrow"
                          width={18}
                          height={18}
                        />
                      )}
                    </OptionSectionPlusImg>

                    <CreateOptionTask>Task Markups</CreateOptionTask>

                    <SwitchDiv>
                      <SwitchText>Show</SwitchText>
                      <Switch
                        checked={checked}
                        onChange={toggleTaskVisibility}
                        size="small"
                        sx={{
                          "&.MuiSwitch-root .MuiSwitch-switchBase": {
                            color: "#36415D",
                          },

                          "&.MuiSwitch-root .Mui-checked": {
                            color: "#36415D",
                          },
                        }}
                      />
                    </SwitchDiv>
                  </TaskMarkupDiv>
                </TaskOptionContainer>
              </OptionTaskContainer>

              <OptionHotspotContainer>
                <TaskHeader>Hotspot</TaskHeader>
                <TaskOptionContainer>
                  <TaskListDiv>
                    <OptionSectionPlusImg>
                      <OptionCameraIcon
                        src={fileTextIcon}
                        alt="Arrow"
                        onClick={() => {
                          //   openIssueCreateFn();
                        }}
                        // width={24}
                        // height={24}
                      />
                    </OptionSectionPlusImg>

                    <CreateOptionTask>Hotspot List</CreateOptionTask>
                  </TaskListDiv>
                  <HorizontalLineOpt></HorizontalLineOpt>
                  <TaskMarkupDiv>
                    <OptionSectionPlusImg>
                      <OptionCameraIcon
                        src={hotspotCircleIcon}
                        alt="Arrow"
                        onClick={() => {
                          //   openIssueCreateFn();
                        }}
                        width={18}
                        height={18}
                      />
                    </OptionSectionPlusImg>

                    <CreateOptionTask>Hotspot Markups</CreateOptionTask>

                    <SwitchDiv>
                      <SwitchText>Show</SwitchText>
                      <Switch
                        defaultChecked
                        size="small"
                        sx={{
                          "&.MuiSwitch-root .MuiSwitch-switchBase": {
                            color: "#36415D",
                          },

                          "&.MuiSwitch-root .Mui-checked": {
                            color: "#36415D",
                          },
                        }}
                      />
                    </SwitchDiv>
                  </TaskMarkupDiv>
                </TaskOptionContainer>
              </OptionHotspotContainer>
            </OptionListContainer>
          </StyledOptionMenu>
        </Menu>
      </MoreOptionContainer>
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
            contextInfo={contextInfo}
            closeTaskFilterOverlay={closeTaskFilterOverlay}
            handleOnTaskFilter={handleOnTaskFilter}
            onClose={() => setOpenDrawer((prev: any) => !prev)}
            deleteTheTask={deleteTheTask}
            taskFilterState={taskFilterState}
            getTasks={getTasks}
            handleOnTasksSort={handleOnTasksSort}
            deleteTheAttachment={deleteTheAttachment}
            openTaskCreateFn={openTaskCreateFn}
            projectUsers={projectUsers}
            taskType={currentTypesList}
            taskPriority={taskPriorityList}
            taskStatus={taskStatusList}
          />
        </Drawer>
      )}
      {openCreateTask && (
        <CustomDrawer open>
          <CreateTask
            handleCreateTask={handleCreateTask}
            currentProject={currentProject}
            currentSnapshot={currentSnapshot}
            currentStructure={currentStructure}
            contextInfo={contextInfo}
            closeTaskCreate={closeTaskCreate}
            onCancelCreate={onCancelCreate}
            deleteTheAttachment={deleteTheAttachment}
          />
        </CustomDrawer>
      )}
      {openTaskDetails && (
        <Drawer
          anchor={"right"}
          open={openTaskDetails}
          onClose={() => closeTaskDetails()}
        >
          <CustomTaskDetailsDrawer
            task={selectedTask}
            onClose={() => closeTaskDetails()}
            taskType={currentTypesList}
            deleteTheTask={deleteTheTask}
            currentProject={currentProject}
            currentSnapshot={currentSnapshot}
            currentStructure={currentStructure}
            contextInfo={contextInfo}
            projectUsers={projectUsers}
            deleteTheAttachment={deleteTheAttachment}
            getTasks={getTasks}
            taskPriority={taskPriorityList}
            taskStatus={taskStatusList}
          />
        </Drawer>
      )}
    </MoreOptionBox>
  );
};

export default MoreOptionTool;
