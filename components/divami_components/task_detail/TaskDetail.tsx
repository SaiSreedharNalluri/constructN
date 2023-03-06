import {
  Autocomplete,
  Box,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { styled } from "@mui/system";
import _ from "lodash";
import Moment from "moment";
import Image from "next/image";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
import Clip from "../../../public/divami_icons/clip.svg";
import Delete from "../../../public/divami_icons/delete.svg";
import Edit from "../../../public/divami_icons/edit.svg";
import Send from "../../../public/divami_icons/send.svg";
import {
  createAttachment,
  deleteAttachment,
} from "../../../services/attachments";
import {
  getTasksList,
  updateAttachments,
  updateTask,
} from "../../../services/task";
import CustomButton from "../../divami_components/custom-button/CustomButton";
import PopupComponent from "../../popupComponent/PopupComponent";
import { TASK_FORM_CONFIG } from "../create-task/body/Constants";
import CreateTask from "../create-task/CreateTask";
import CustomDrawer from "../custom-drawer/custom-drawer";
import CustomSelect from "../custom-select/CustomSelect";
import ActivityLog from "../task_detail/ActivityLog";
import {
  AddCommentButtonContainer,
  AddCommentContainer,
  AddCommentContainerSecond,
  ArrowIcon,
  AssignEditSearchContainer,
  AttachButton,
  AttachedImageDiv,
  AttachedImageIcon,
  AttachedImageTitle,
  AttachHorizontal,
  AttachmentDescription,
  AttachmentDiv,
  AttachmentTitle,
  BodyContainer,
  CaptureStatus,
  CaptureTitle,
  CustomTaskDrawerContainer,
  DeleteIcon,
  DescriptionDiv,
  DescriptionPara,
  DescriptionTitle,
  EditIcon,
  FirstHeaderDiv,
  FourthBodyDiv,
  FourthContAssigned,
  FourthContLeft,
  FourthContProgType,
  HeaderContainer,
  ImageErrorIcon,
  LeftTitleCont,
  MoreText,
  PenIconImage,
  PriorityStatus,
  PriorityTitle,
  ProgressCustomSelect,
  ProgressEditStateButtonsContainer,
  ProgressStateFalse,
  ProgressStateTrue,
  RelatedDiv,
  RelatedSingleButton,
  RelatedTagsButton,
  RelatedTagTitle,
  RightTitleCont,
  SecondBodyDiv,
  SecondContCapt,
  SecondContPrior,
  SecondContPriorParal,
  SendButton,
  SpanTile,
  StyledInput,
  TabOneDiv,
  ThirdContProg,
  ThirdContProgType,
  ThirdContRight,
  ThirdContWatch,
  ThirdContWatchName,
  TitleContainer,
} from "./TaskDetailStyles";
import { createComment } from "../../../services/comments";

// const BodyContainer = styled(Box)`
//   height: calc(100vh - 134px);
//   //   border: 2px solid black;
//   // overflow: scroll;
// `;
interface ContainerProps {
  footerState: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = styled(TabPanel)`
  padding: none;
`;

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function BasicTabs(props: any) {
  const {
    taskState,
    onClose,
    taskType,
    taskPriority,
    taskStatus,
    projectUsers,
    taskUpdate,
    deleteTheAttachment,
  } = props;

  const [value, setValue] = React.useState(0);
  const [issueTypeConfig, setIssueTypeConfig] = useState("");
  const [formState, setFormState] = useState({
    selectedValue: "",
    selectedProgress: null,
    selectedUser: taskState?.assignessList || taskState?.TabOne?.assignessList,
  });
  const [progressEditState, setProgressEditState] = useState(false);
  const [assigneeEditState, setAssigneeEditState] = useState(false);
  const [progressOptionsState, setProgressOptionsState] = useState<any>([{}]);
  const [assigneeOptionsState, setAssigneeOptionsState] = useState([]);
  const [formConfig, setFormConfig] = useState(TASK_FORM_CONFIG);
  const [searchTerm, setSearchTerm] = useState("");
  const [list, setList] = useState<any>();
  const [comments, setComments] = useState("");
  const [backendComments, setBackendComments] = useState<any>([]);

  useEffect(() => {
    let temp = taskStatus?.map((task: any) => {
      return {
        label: task,
        value: task,
      };
    });
    setProgressOptionsState((prevState: any) => {
      return [
        {
          id: "taskPriority",
          type: "select",
          defaultValue: "",
          placeHolder: "Select",
          label: "Material (Optional)",
          isLarge: false,
          isError: false,
          isReq: false,
          isflex: false,
          options: temp,
        },
      ];
    });
    let tempUsers = projectUsers.map((each: any) => {
      return {
        ...each,
        label: each.user?.fullName,
      };
    });
    setAssigneeOptionsState(tempUsers);
  }, []);

  useEffect(() => {
    setFormState({
      ...formState,
      selectedUser:
        taskState?.assignessList || taskState?.TabOne?.assignessList,
    });
  }, [taskState]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEditProgress = () => {
    setProgressEditState(!progressEditState);
  };
  const handleClose = () => {
    setProgressEditState(false);
    setAssigneeEditState(false);
  };
  const handleStateChange = () => {
    if (progressEditState) {
      setProgressEditState(!progressEditState);
    }
    if (assigneeEditState) {
      setAssigneeEditState(!assigneeEditState);
    }
    const optState = {
      ...formState,
      selectedProgress: progressOptionsState[0].defaultValue,
    };
    taskUpdate(optState);
  };

  const handleEditAssigne = () => {
    setAssigneeEditState(!assigneeEditState);
  };

  const addComment = (text: string, entityId: string) => {
    console.log("text", text, "enttit", entityId);
    if (text !== "") {
      console.log("text", text, "enttit", entityId);
      createComment(router.query.projectId as string, {
        comment: text,
        entity: entityId,
      }).then((response) => {
        if (response.success === true) {
          toast("Comment is added sucessfully");
          setBackendComments([...backendComments, response.result]);
        }
      });
      setComments("");
    }

    //
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "#D9D9D9", color: "black" }}>
        <Tabs
          TabIndicatorProps={{
            style: { background: "#FF843F", height: "3px" },
          }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            "& .MuiTabs-scroller": {
              padding: "0px 20px",
            },
            "& .MuiBox-root": {
              border: "1px solid red",
            },
            "& .MuiTabs-flexContainer": {
              paddingTop: "20px",
              paddingLeft: "0",
            },

            "& .Mui-selected": {
              paddingTop: "0px",
              paddingLeft: "0",
              paddingBottom: "0",
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "capitalize",
            },

            "& .MuiTab-root": {
              minWidth: "0px",
              paddingTop: "0px",
              paddingLeft: "0",
              paddingBottom: "0",
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "capitalize",
              minHeight: "0",
            },

            "& .MuiTabs-indicator": {
              background: "blue",
              width: "45px !important",
            },
          }}
        >
          {/* MuiTab-root.Mui-selected */}
          <Tab
            label="Details"
            {...a11yProps(0)}
            style={{
              marginRight: "40px",
              paddingLeft: "0px",
              color: "#101F4C",
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontSize: "14px",
              fontWeight: "400",
            }}
          />
          <Tab
            label="Activity log"
            {...a11yProps(1)}
            style={{ paddingRight: "0px" }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TabOneDiv>
          <FirstHeaderDiv>
            <div></div>
            <Image
              src={
                taskState.TabOne.screenshot ? taskState.TabOne.screenshot : ""
              }
              alt=""
              width={400}
              height={400}
            />
          </FirstHeaderDiv>
          <SecondBodyDiv>
            <SecondContPrior>
              <PriorityTitle>Title</PriorityTitle>
              <PriorityStatus style={{ color: "#101F4B" }}>
                {taskState.TabOne.title}
              </PriorityStatus>
            </SecondContPrior>

            <SecondContPriorParal>
              <PriorityTitle>Priority</PriorityTitle>
              <PriorityStatus style={{ color: "#101F4B" }}>
                {taskState.TabOne.priority}
              </PriorityStatus>
            </SecondContPriorParal>
          </SecondBodyDiv>

          <SecondBodyDiv>
            <SecondContCapt>
              <CaptureTitle>Captured on</CaptureTitle>
              <CaptureStatus style={{ color: "#101F4B" }}>
                {" "}
                {Moment(taskState.TabOne.capturedOn).format("DD MMM YY")}
              </CaptureStatus>
            </SecondContCapt>

            <SecondContPriorParal>
              <ThirdContWatch>Watcher</ThirdContWatch>
              <ThirdContWatchName style={{ color: "#101F4B" }}>
                {" "}
                {taskState.TabOne.creator}
              </ThirdContWatchName>
            </SecondContPriorParal>
          </SecondBodyDiv>

          {progressEditState ? (
            <ProgressStateTrue>
              {" "}
              <FourthBodyDiv
                assigneeEditState={assigneeEditState}
                style={{ marginTop: "0px", color: "#101F4B" }}
              >
                <FourthContLeft>
                  <FourthContAssigned>Assigned to</FourthContAssigned>
                  <FourthContProgType style={{ color: "#101F4B" }}>
                    {taskState?.TabOne?.assignees}{" "}
                    <MoreText>{taskState?.TabOne?.moreText}</MoreText>
                    {taskState?.TabOne?.assignees ? (
                      <PenIconImage
                        onClick={() => {
                          handleEditAssigne();
                        }}
                        src={Edit}
                        alt={"close icon"}
                      />
                    ) : (
                      <></>
                    )}
                  </FourthContProgType>
                </FourthContLeft>
              </FourthBodyDiv>
            </ProgressStateTrue>
          ) : (
            <ProgressStateFalse>
              {" "}
              <ThirdContRight>
                <ThirdContProg>Progress</ThirdContProg>

                <ThirdContProgType style={{ color: "#101F4B" }}>
                  {taskState.TabOne.status}
                  {taskState.TabOne.status ? (
                    <PenIconImage
                      onClick={() => {
                        handleEditProgress();
                      }}
                      src={Edit}
                      alt={"close icon"}
                    />
                  ) : (
                    <></>
                  )}
                </ThirdContProgType>
              </ThirdContRight>
              <FourthBodyDiv
                assigneeEditState={assigneeEditState}
                style={{
                  marginTop: "0px",
                  color: "#101F4B",
                  marginLeft: "auto",
                }}
              >
                <FourthContLeft>
                  <FourthContAssigned>Assigned to</FourthContAssigned>
                  <FourthContProgType style={{ color: "#101F4B" }}>
                    {taskState?.TabOne?.assignees}{" "}
                    <MoreText>{taskState?.TabOne?.moreText}</MoreText>
                    {taskState?.TabOne?.assignees ? (
                      <PenIconImage
                        onClick={() => {
                          handleEditAssigne();
                        }}
                        src={Edit}
                        alt={"close icon"}
                      />
                    ) : (
                      <></>
                    )}
                  </FourthContProgType>
                </FourthContLeft>
              </FourthBodyDiv>
            </ProgressStateFalse>
          )}

          {progressEditState ? (
            <ProgressCustomSelect>
              <CustomSelect
                config={progressOptionsState[0]}
                data={{
                  ...progressOptionsState[0],
                  defaultValue: taskState.TabOne.status,
                }}
                id={"taskPriority"}
                sx={{ minWidth: 120 }}
                setFormConfig={setProgressOptionsState}
                isError={""}
                label=""
              />
            </ProgressCustomSelect>
          ) : (
            ""
          )}
          {assigneeEditState && (
            <AssignEditSearchContainer>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={projectUsers.map((each: any) => {
                  return {
                    ...each,
                    label: each.user?.fullName,
                  };
                })}
                // sx={{ minWidth: 120 }}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="" />}
                onChange={(event, value: any) => {
                  console.log(value);
                  setFormState({ ...formState, selectedUser: value });
                }}
                value={formState.selectedUser}
                multiple={true}
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <SearchIcon />
                //     </InputAdornment>
                //   ),
                // }}
              />
            </AssignEditSearchContainer>
          )}

          {/* <FormElementContainer>
            <CustomSelectContainer>
              <SelectVariants options={DetailsObj.TabOne[0].options} />
              <BasicSelect options={DetailsObj.TabOne[0].options} />
            </CustomSelectContainer>
          </FormElementContainer> */}

          <DescriptionDiv>
            <DescriptionTitle>RFI Question</DescriptionTitle>

            <DescriptionPara>
              {taskState.TabOne.issueDescription}
            </DescriptionPara>
          </DescriptionDiv>

          {taskState?.TabOne?.attachments?.length > 0 && (
            <>
              <AttachmentDiv className={`attachmentsSection`}>
                <AttachmentTitle>Attachments</AttachmentTitle>
                <AttachmentDescription style={{ color: "#101F4B" }}>
                  {/* {console.log(taskState?.TabOne.attachments)} */}
                  {taskState?.TabOne.attachments?.map(
                    (a: any, index: number) => {
                      return (
                        <>
                          <AttachedImageDiv className={`detailsImageDiv`}>
                            {/* <AttachedImageTitle>{a?.name}</AttachedImageTitle> */}
                            <AttachedImageTitle>{a?.name}</AttachedImageTitle>

                            <AttachedImageIcon>
                              <Image src={""} alt="" />
                            </AttachedImageIcon>
                            <DeleteIcon
                              src={Delete}
                              alt={"delete icon"}
                              onClick={() => {
                                deleteTheAttachment(a?._id, "task");
                              }}
                              className={`deleteIcon`}
                            />
                          </AttachedImageDiv>
                          <AttachHorizontal></AttachHorizontal>
                        </>
                      );
                    }
                  )}
                </AttachmentDescription>
              </AttachmentDiv>
            </>
          )}
          <RelatedDiv>
            <RelatedTagTitle>Related Tags</RelatedTagTitle>
            <RelatedTagsButton>
              {/* {console.log("taskState12", taskState)} */}
              {taskState?.TabOne.tags?.map((item: any) => {
                return (
                  <>
                    <RelatedSingleButton>{item}</RelatedSingleButton>
                  </>
                );
              })}
            </RelatedTagsButton>
          </RelatedDiv>
          {progressEditState || assigneeEditState ? (
            <AddCommentContainer containerType="float">
              <ProgressEditStateButtonsContainer>
                <CustomButton
                  type="outlined"
                  label="Cancel"
                  formHandler={() => {
                    handleClose();
                  }}
                />
                <CustomButton
                  type="contained"
                  label="Update"
                  formHandler={() => {
                    handleStateChange();
                  }}
                />
              </ProgressEditStateButtonsContainer>
            </AddCommentContainer>
          ) : (
            <>
              <AddCommentContainerSecond>
                {/* <AddCommentInput placeholder="Add Comment"></AddCommentInput> */}
                {/* {console.log("commenting", comments)} */}
                <StyledInput
                  id="standard-basic"
                  variant="standard"
                  placeholder="Add Comment"
                  value={comments}
                  onChange={(e) => {
                    setComments(e.target.value);
                  }}
                  // error={!comments}
                  // helperText={!comments ? "Required" : ""}
                />
                <AddCommentButtonContainer>
                  <AttachButton>
                    <ImageErrorIcon src={Clip} alt="" />
                    {/* <Image src={Clip} alt="" />{" "} */}
                  </AttachButton>
                  <SendButton
                    onClick={() => {
                      addComment(comments, taskState.TabOne.id);
                    }}
                  >
                    <ImageErrorIcon src={Send} alt="" />
                    {/* <Image src={Send} alt="" />{" "} */}
                  </SendButton>
                </AddCommentButtonContainer>
              </AddCommentContainerSecond>
            </>
          )}
        </TabOneDiv>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ActivityLog ActivityLog={taskState.TabTwo} />
      </CustomTabPanel>
    </Box>
  );
}

const CustomTaskDetailsDrawer = (props: any) => {
  const {
    onClose,
    task,
    taskList,
    taskType,
    taskPriority,
    taskStatus,
    projectUsers,
    deleteTheTask,
    currentProject,
    currentSnapshot,
    currentStructure,
    contextInfo,
    closeTaskCreate,
    getTasks,
    deleteTheAttachment,
  } = props;
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [footerState, SetFooterState] = useState(false);
  const [selectedTask, setSelectedTask] = useState(task);
  useEffect(() => {
    setSelectedTask(task);
  }, [task]);
  const DetailsObj = {
    TabOne: {
      options: [
        { value: "option1", label: "In-Progress", icon: "" },
        { value: "option2", label: "Completed", icon: "" },
      ],

      priority: "High",
      date: "15 Dec'22",
      userName: [
        { value: "option1", label: "Aron Schutte", icon: "" },
        { value: "option2", label: "Alex Brandon", icon: "" },
      ],
      creator: "Aron Schutte",

      issueDescription:
        "The Pipe seems bent which can cause issues later once it will be used by the residents of the flat.",

      attachedImages: [
        { icon: "", alt: "Image 1" },
        { icon: "", alt: "Image 2" },
      ],

      relatedTags: ["Interior Issues", "Pipeline", "Future Damage"],
    },
    TabTwo: [
      {
        status: "RFI Updated",
        timeStamp: "15 Nov 22",
        profile: "Jake",
        comment:
          "Lorem Ipsum is simply dummy text of the printing and type setting industry.",
        imageDetails: "Blalalalal.jpg",
      },
      {
        status: "Comment Added",
        timeStamp: "15 Nov 22",
        profile: "Jake",
        comment:
          "Lorem Ipsum is simply dummy text of the printing and type setting industry.",
        imageDetails: "",
      },
      {
        status: "RFI Raised",
        timeStamp: "15 Nov 22",
        profile: "Jake",
        comment: "",
        imageDetails: "",
        issueType: "Interior Issue",
        issueDescription: "Pipelines",
      },
    ],
  };

  const [taskState, setTaskState] = useState<any>(DetailsObj);
  const [showPopUp, setshowPopUp] = useState(false);

  useEffect(() => {
    let tempObj = {
      options: selectedTask.options,
      priority: selectedTask.priority,
      sequenceNumber: selectedTask.sequenceNumber,

      capturedOn: selectedTask.createdAt,
      creator: selectedTask?.owner?.fullName,
      issueDescription: selectedTask.description,
      screenshot: selectedTask?.screenshot as string,
      attachments: selectedTask.attachments,
      relatedTags: selectedTask.tags,
      assignees: selectedTask.assignees?.length
        ? `${selectedTask.assignees[0].fullName}`
        : "",
      assigneeName: selectedTask.assignees?.length
        ? selectedTask.assignees[0].fullName
        : "",
      assignessList: selectedTask.assignees?.length
        ? selectedTask.assignees?.map((item: any) => {
            return { ...item, label: item.fullName };
          })
        : [],
      moreText:
        selectedTask.assignees?.length > 1
          ? `+${selectedTask.assignees?.length - 1} more`
          : "",
      id: selectedTask._id,
      status: selectedTask.status,
    };
    setTaskState((prev: any) => {
      return {
        ...prev,
        TabOne: tempObj,
      };
    });
  }, [selectedTask]);

  const onDeleteTask = () => {
    setshowPopUp(false);
    deleteTheTask(selectedTask, onClose);
  };

  const handleCreateTask = (formData: any) => {
    console.log(formData, "form data at home");
    clickTaskSubmit(formData);
  };

  const saveEditDetails = async (data: any, projectId: string) => {
    if (data.title && data.type && data.priority) {
      updateTask(projectId, data, selectedTask._id)
        .then((response) => {
          if (response.success === true) {
            toast("Task updated sucessfully");
            getTasks(currentStructure._id);
          } else {
            toast.error("Error updating the task");
          }
          setOpenCreateTask(false);
        })
        .catch((error) => {
          if (error.success === false) {
            toast.error(error?.message);
          }
          setOpenCreateTask(false);
        });
    }
  };
  const clickTaskSubmit = (formData: any) => {
    let data: any = {};
    // let userIdList: any[] = [];
    // const assignes = formData.filter((item: any) => item.id == "assignedTo")[0]
    //   ?.selectedName;
    // if (assignes && assignes.length > 0) {
    //   assignes.map((user: any) => {
    //     userIdList?.push(user.value);
    //   });
    // }
    // if (assignes?.value) {
    //   userIdList.push(assignes.value);
    // }
    const userIdList = formData
      .find((item: any) => item.id == "assignedTo")
      ?.selectedName?.map((each: any) => {
        return each.value || each._id;
      });
    data.structure = currentStructure?._id;
    data.snapshot = currentSnapshot?._id;
    data.status = formData.filter(
      (item: any) => item.id == "taskStatus"
    )[0]?.defaultValue;
    data.title = formData.filter(
      (item: any) => item.id == "title"
    )[0]?.defaultValue;

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
      (data.tags =
        (formData.length
          ? formData
              .filter((item: any) => item.id == "tag-suggestions")[0]
              ?.chipString?.join(";")
          : []) || []),
      (data.startdate = formData
        .filter((item: any) => item.id === "dates")[0]
        ?.fields.filter(
          (item: any) => item.id == "start-date"
        )[0]?.defaultValue);
    data.duedate = formData
      .filter((item: any) => item.id === "dates")[0]
      ?.fields.filter((item: any) => item.id == "due-date")[0]?.defaultValue;

    const projectId = formData.filter((item: any) => item.projectId)[0]
      .projectId;

    const fileformdata = new FormData();
    const filesArr = formData.filter(
      (item: any) => item.id === "file-upload"
    )[0]?.selectedFile;

    const arr =
      filesArr?.length &&
      filesArr.map((each: any) => {
        if (!each._id) {
          fileformdata.append("file", each);
        }

        return {
          ...each,
        };
      });
    if (filesArr?.length) {
      createAttachment(task._id, fileformdata)
        .then((response) => {
          if (response.success === true) {
            toast("Attachments uploaded sucessfully");
          } else {
            toast.error("Error uploading attachments");
          }
          saveEditDetails(data, projectId);
        })
        .catch((error) => {
          if (error.success === false) {
            toast.error(error?.message);
          }
          saveEditDetails(data, projectId);
        });
    }
  };
  const taskUpdate = (data: any) => {
    const issueData = _.cloneDeep(selectedTask);
    issueData.assignees = data.selectedUser.map((user: any) => {
      return user._id || user.user._id;
    });
    data.selectedProgress ? (issueData.status = data.selectedProgress) : null;
    const projectId = router.query.projectId;
    updateTask(projectId as string, issueData, selectedTask._id)
      .then((response) => {
        if (response.success === true) {
          toast("Task updated sucessfully");
          getTasks(currentStructure._id);
        } else {
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  // const deleteTheAttachment = (attachmentId: string) => {
  //   deleteAttachment(attachmentId)
  //     .then((response) => {
  //       if (response.success === true) {
  //         toast(response.message);
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(error.message);
  //     });
  // };
  return (
    <>
      <CustomTaskDrawerContainer>
        <HeaderContainer>
          <TitleContainer>
            <LeftTitleCont>
              <ArrowIcon
                onClick={() => {
                  onClose(true);
                }}
                src={BackArrow}
                alt={"close icon"}
              />
              <SpanTile>
                {selectedTask?.type} (#{selectedTask?.sequenceNumber})
              </SpanTile>
            </LeftTitleCont>
            <RightTitleCont>
              <EditIcon
                src={Edit}
                alt={"close icon"}
                onClick={() => {
                  setOpenCreateTask(true);
                }}
              />
              <DeleteIcon
                src={Delete}
                alt={"close icon"}
                onClick={() => {
                  setshowPopUp(true);
                }}
              />
            </RightTitleCont>
          </TitleContainer>
        </HeaderContainer>
        <BodyContainer footerState={footerState}>
          <BasicTabs
            taskType={taskType}
            taskPriority={taskPriority}
            taskStatus={taskStatus}
            projectUsers={projectUsers}
            taskState={taskState}
            deleteTheAttachment={deleteTheAttachment}
            onClose={onClose}
            taskUpdate={taskUpdate}
          />
        </BodyContainer>
      </CustomTaskDrawerContainer>
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Delete Task"}
          modalmessage={`Are you sure you want to delete this Task "${selectedTask.type}(#${selectedTask._id})"?`}
          primaryButtonLabel={"Delete"}
          SecondaryButtonlabel={"Cancel"}
          callBackvalue={onDeleteTask}
        />
      )}
      {openCreateTask && (
        <CustomDrawer open>
          <CreateTask
            handleCreateTask={handleCreateTask}
            setOpenCreateTask={setOpenCreateTask}
            currentProject={currentProject}
            currentSnapshot={currentSnapshot}
            currentStructure={currentStructure}
            contextInfo={contextInfo}
            editData={selectedTask}
            closeTaskCreate={() => {
              setOpenCreateTask(false);
            }}
          />
        </CustomDrawer>
      )}
    </>
  );
};

export default CustomTaskDetailsDrawer;
