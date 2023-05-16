import {
  Autocomplete,
  Box,
  Menu,
  Select,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/system";
import _ from "lodash";
import Moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
import Clip from "../../../public/divami_icons/clip.svg";
import Delete from "../../../public/divami_icons/delete.svg";
import Edit from "../../../public/divami_icons/edit.svg";
import Send from "../../../public/divami_icons/send.svg";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
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
import {
  AddCommentButtonContainer,
  AddCommentContainer,
  AddCommentContainerSecond,
  ArrowIcon,
  AssignEditSearchContainer,
  AssignedLabel,
  AssigneeList,
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
  ExtraLabel,
  FirstHeaderDiv,
  FourthBodyDiv,
  FourthContAssigned,
  FourthContLeft,
  FourthContProgType,
  HeaderContainer,
  ImageErrorIcon,
  LeftTitleCont,
  ValueContainer,
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
  SecondAssigneeList,
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
  CloseIcon,
  MoreTextDiv,
  ParentFourthContMoreText,
  FourthContMoreText,
} from "./TaskDetailStyles";
import { createComment, getCommentsList } from "../../../services/comments";
import ActivityLog from "./ActivityLog";
import { ActivityLogContainer } from "../issue_detail/IssueDetailStyles";
import moment from "moment";
import { showImagePreview } from "../../../utils/IssueTaskUtils";

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

interface Task {
  _id: string;
  // Include other properties if needed
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
    setTaskState,
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
  const router = useRouter();

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [attachmentPopup, setAttachmentPopup] = useState(false);

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
    if (text !== "") {
      createComment(router.query.projectId as string, {
        comment: text,
        entity: entityId,
      }).then((response) => {
        if (response.success === true) {
          toast.success("Comment is added sucessfully");
          setBackendComments([...backendComments, response.result]);
        }
      });
      setComments("");
    }
  };

  const getComments = async (entityId: any) => {
    getCommentsList(router.query.projectId as string, entityId)
      .then((response) => {
        if (response.success === true) {
          setBackendComments(response.result);
        }
      })
      .catch((error) => {
        toast.error("failed to load the data");
      });
  };
  useEffect(() => {
    if (taskState?.TabOne?.id) {
      getComments(taskState?.TabOne?.id);
    }
  }, [taskState]);

  const handleSortMenuClose = () => {
    setIsSortMenuOpen(false);
    setAnchorEl(null);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "#D9D9D9", color: "black" }}>
        <Tabs
          TabIndicatorProps={{
            style: { background: "#F1742E", height: "3px" },
          }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            "& .MuiTabs-scroller": {
              // padding: "0px 20px",
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
              color: "#101F4C",
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
              width: value ? "80px !important" : "47px !important",
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
          {/* <Tab
            label="Activity log"
            {...a11yProps(1)}
            style={{
              paddingRight: "0px",
              color: "#101F4C",
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontSize: "14px",
              fontWeight: "400",
            }}
          /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TabOneDiv>
          <FirstHeaderDiv>
            <div></div>
            <Image
              src={
                taskState?.TabOne?.screenshot
                  ? taskState?.TabOne?.screenshot
                  : ""
              }
              alt=""
              width={400}
              height={400}
            />
          </FirstHeaderDiv>
          <SecondBodyDiv>
            <SecondContPrior>
              <PriorityTitle>Type</PriorityTitle>
              <PriorityStatus
                style={{ color: "#101F4B" }}
                data-testid="task-title"
              >
                {taskState?.TabOne?.type}
              </PriorityStatus>
            </SecondContPrior>
          </SecondBodyDiv>

          <SecondBodyDiv>
            <SecondContPriorParal>
              <PriorityTitle>Priority</PriorityTitle>
              <PriorityStatus
                style={{ color: "#101F4B" }}
                data-testid="task-priority"
              >
                {taskState?.TabOne?.priority}
              </PriorityStatus>
            </SecondContPriorParal>
          </SecondBodyDiv>

          <SecondBodyDiv>
            <SecondContCapt>
              <CaptureTitle>Captured on</CaptureTitle>
              <CaptureStatus
                style={{ color: "#101F4B" }}
                data-testid="task-captured"
              >
                {" "}
                {Moment(taskState?.TabOne?.capturedOn).format("DD MMM YYYY")}
              </CaptureStatus>
            </SecondContCapt>
          </SecondBodyDiv>

          <SecondBodyDiv>
            <SecondContPriorParal>
              <ThirdContWatch>Watcher</ThirdContWatch>
              <ThirdContWatchName style={{ color: "#101F4B" }}>
                {" "}
                {taskState?.TabOne?.creator}
              </ThirdContWatchName>
            </SecondContPriorParal>
          </SecondBodyDiv>

          <SecondBodyDiv>
            <ThirdContRight>
              <ThirdContProg data-testid="progres-label">
                Progress
              </ThirdContProg>

              <ThirdContProgType
                style={{ color: "#101F4B" }}
                data-testid="task-progress"
              >
                {taskState?.TabOne?.status}
                {taskState?.TabOne?.status ? (
                  <PenIconImage
                    onClick={() => {
                      handleEditProgress();
                    }}
                    src={Edit}
                    alt={"close icon"}
                    data-testid="issue-progress-edit"
                  />
                ) : (
                  <></>
                )}
              </ThirdContProgType>
            </ThirdContRight>
          </SecondBodyDiv>
          {progressEditState ? (
            <ProgressCustomSelect data-testid="progress-options">
              {/* <ExtraLabel>Progress</ExtraLabel> */}

              <CustomSelect
                config={progressOptionsState[0]}
                data={{
                  ...progressOptionsState[0],
                  defaultValue: taskState?.TabOne?.status,
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

          <SecondBodyDiv>
            <FourthContLeft>
              <FourthContAssigned data-testid="assigned-to-label">
                Assigned to
              </FourthContAssigned>
              <MoreTextDiv>
                {" "}
                <ParentFourthContMoreText>
                  <FourthContProgType style={{ color: "#101F4B" }}>
                    {taskState?.TabOne?.assignees}{" "}
                    {taskState?.TabOne?.assignees ? (
                      <PenIconImage
                        data-testid="assignees-edit"
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
                </ParentFourthContMoreText>
                <FourthContMoreText>
                  <LightTooltip
                    arrow
                    title={
                      <SecondAssigneeList>
                        {taskState?.TabOne?.assignessList?.map(
                          (assignName: any, index: number) => {
                            if (index !== 0) {
                              return (
                                <>
                                  {index !==
                                  taskState?.TabOne?.assignessList.length - 1
                                    ? assignName?.firstName +
                                      " " +
                                      assignName?.lastName +
                                      " | "
                                    : assignName?.firstName +
                                      " " +
                                      assignName.lastName}
                                </>
                              );
                            }
                          }
                        )}
                      </SecondAssigneeList>
                    }
                  >
                    <MoreText>{taskState?.TabOne?.moreText}</MoreText>
                  </LightTooltip>
                </FourthContMoreText>
              </MoreTextDiv>
            </FourthContLeft>
          </SecondBodyDiv>

          {/* {progressEditState ? (
            <ProgressStateTrue>
              {" "}
              <FourthBodyDiv
                assigneeEditState={assigneeEditState}
                style={{ marginTop: "0px", color: "#101F4B" }}
              >
                <FourthContLeft>
                  <FourthContAssigned data-testid="assigned-to-label">
                    Assigned to
                  </FourthContAssigned>
                  <FourthContProgType style={{ color: "#101F4B" }}>
                    {taskState?.TabOne?.assignees}{" "}
                    <DarkToolTip
                      arrow
                      title={
                        <SecondAssigneeList>
                          {taskState?.TabOne?.assignessList?.map(
                            (assignName: any, index: number) => {
                              if (index !== 0) {
                                return (
                                  <>
                                    {index !==
                                    taskState?.TabOne?.assignessList.length - 1
                                      ? assignName?.firstName +
                                        " " +
                                        assignName?.lastName +
                                        " | "
                                      : assignName?.firstName +
                                        " " +
                                        assignName.lastName}
                                  </>
                                );
                              }
                            }
                          )}
                        </SecondAssigneeList>
                      }
                    >
                      <MoreText>{taskState?.TabOne?.moreText}</MoreText>
                    </DarkToolTip>
                    {taskState?.TabOne?.assignees ? (
                      <PenIconImage
                        data-testid="assignees-edit"
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
                <ThirdContProg data-testid="progres-label">
                  Status
                </ThirdContProg>

                <ThirdContProgType
                  style={{ color: "#101F4B" }}
                  data-testid="task-progress"
                >
                  {taskState?.TabOne?.status}
                  {taskState?.TabOne?.status ? (
                    <PenIconImage
                      onClick={() => {
                        handleEditProgress();
                      }}
                      src={Edit}
                      alt={"close icon"}
                      data-testid="issue-progress-edit"
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
                  <FourthContAssigned data-testid="assigned-to-label">
                    Assigned to
                  </FourthContAssigned>
                  <FourthContProgType style={{ color: "#101F4B" }}>
                    {taskState?.TabOne?.assignees}{" "}
                    <LightTooltip
                      arrow
                      title={
                        <AssigneeList>
                          {taskState?.TabOne?.assignessList?.map(
                            (assignName: any, index: number) => {
                              if (index !== 0) {
                                return (
                                  <>
                                    {index !==
                                    taskState?.TabOne?.assignessList.length - 1
                                      ? assignName?.firstName +
                                        " " +
                                        assignName?.lastName +
                                        " | "
                                      : assignName?.firstName +
                                        " " +
                                        assignName.lastName}
                                  </>
                                );
                              }
                            }
                          )}
                        </AssigneeList>
                      }
                    >
                      <MoreText>{taskState?.TabOne?.moreText}</MoreText>
                    </LightTooltip>
                    {taskState?.TabOne?.assignees ? (
                      <PenIconImage
                        onClick={() => {
                          handleEditAssigne();
                        }}
                        src={Edit}
                        alt={"close icon"}
                        data-testid="assignees-edit"
                      />
                    ) : (
                      <></>
                    )}
                  </FourthContProgType>
                </FourthContLeft>
              </FourthBodyDiv>
            </ProgressStateFalse>
          )} */}

          {assigneeEditState && (
            <AssignEditSearchContainer>
              {/* <AssignedLabel>Assigned to</AssignedLabel> */}

              <Autocomplete
                data-testid="assignee-options"
                disablePortal
                id="combo-box-demo"
                options={projectUsers.map((each: any) => {
                  return {
                    ...each,
                    label: each.user?.fullName,
                  };
                })}
                sx={{
                  width: 300,
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #F1742E !important",
                  },
                }}
                renderTags={() => null}
                // defaultValue={formState.selectedUser[0]?.user?.fullName}
                renderInput={(params) => <TextField {...params} />}
                onChange={(event, value: any) => {
                  const newSelectedUser = value
                    ? value.filter(
                        (selected: any, index: number, array: any[]) => {
                          // Remove duplicate values based on label property
                          return (
                            array.findIndex(
                              (elem: any) => elem.label === selected.label
                            ) === index
                          );
                        }
                      )
                    : [];
                  setFormState({
                    ...formState,
                    selectedUser: newSelectedUser,
                  });
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
              <ValueContainer>
                {formState.selectedUser.map((v: any) =>
                  v?.label ? (
                    <Chip
                      key={v?.label}
                      label={v?.label}
                      variant="outlined"
                      style={{ marginTop: "10px" }}
                      deleteIcon={
                        <CloseIcon
                          src={closeIcon}
                          alt=""
                          style={{ marginLeft: "5px", marginRight: "12px" }}
                        />
                      }
                      onDelete={() => {
                        const newSelectedUser = formState.selectedUser.filter(
                          (selected: any) => selected?.label !== v?.label
                        );
                        setFormState({
                          ...formState,
                          selectedUser: newSelectedUser,
                        });
                      }}
                    />
                  ) : null
                )}
              </ValueContainer>
            </AssignEditSearchContainer>
          )}

          {progressEditState ? (
            <ProgressStateTrue>
              {" "}
              <FourthBodyDiv
                assigneeEditState={assigneeEditState}
                style={{
                  marginTop: "0px",
                  color: "#101F4B",
                }}
              >
                <FourthContLeft></FourthContLeft>
              </FourthBodyDiv>
            </ProgressStateTrue>
          ) : (
            ""
          )}

          {/* <FormElementContainer>
            <CustomSelectContainer>
              <SelectVariants options={DetailsObj.TabOne[0].options} />
              <BasicSelect options={DetailsObj.TabOne[0].options} />
            </CustomSelectContainer>
          </FormElementContainer> */}

          {taskState?.TabOne?.issueDescription?.length > 0 ? (
            <DescriptionDiv>
              <DescriptionTitle>Description</DescriptionTitle>

              <DescriptionPara>
                {taskState?.TabOne?.issueDescription}
              </DescriptionPara>
            </DescriptionDiv>
          ) : (
            ""
          )}

          {taskState?.TabOne?.attachments?.length > 0 && (
            <>
              <AttachmentDiv className={`attachmentsSection`}>
                <AttachmentTitle>Attachments</AttachmentTitle>
                <AttachmentDescription>
                  {/* {console.log(taskState?.TabOne.attachments)} */}
                  {taskState?.TabOne.attachments?.map(
                    (a: any, index: number) => {
                      return (
                        <>
                          <AttachedImageDiv className={`detailsImageDiv`}>
                            {/* <AttachedImageTitle>{a?.name}</AttachedImageTitle> */}
                            <AttachedImageTitle
                              onClick={() => {
                                showImagePreview(a);
                              }}
                            >
                              {a?.name}
                            </AttachedImageTitle>

                            <AttachedImageIcon>
                              <Image src={""} alt="" />
                            </AttachedImageIcon>
                            <DeleteIcon
                              src={Delete}
                              alt={"delete icon"}
                              onClick={() => {
                                setAttachmentPopup(true);
                                // deleteTheAttachment(a?._id, "task");
                                // setTaskState((prev: any) => {
                                //   const updatedTabOne = {
                                //     ...prev.TabOne,
                                //     attachments: prev.TabOne.attachments.filter(
                                //       (attachment: any) =>
                                //         attachment._id !== a?._id
                                //     ),
                                //   };
                                //   return {
                                //     ...prev,
                                //     TabOne: updatedTabOne,
                                //   };
                                // });
                              }}
                              className={`deleteIcon`}
                            />

                            {attachmentPopup && (
                              <PopupComponent
                                open={attachmentPopup}
                                setShowPopUp={setAttachmentPopup}
                                modalTitle={"Delete Attachment"}
                                // modalmessage={`Are you sure you want to delete this Task "${selectedTask?.type}(#${selectedTask?._id})"?`}
                                modalmessage={`Are you sure you want to delete this attachment "${a?._id} "?`}
                                primaryButtonLabel={"Delete"}
                                SecondaryButtonlabel={"Cancel"}
                                callBackvalue={() => {
                                  setAttachmentPopup(false);
                                  deleteTheAttachment(a?._id, "task");
                                  setTaskState((prev: any) => {
                                    const updatedTabOne = {
                                      ...prev.TabOne,
                                      attachments:
                                        prev.TabOne.attachments.filter(
                                          (attachment: any) =>
                                            attachment._id !== a?._id
                                        ),
                                    };
                                    return {
                                      ...prev,
                                      TabOne: updatedTabOne,
                                    };
                                  });
                                }}
                              />
                            )}
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

          {taskState?.TabOne?.tags?.length > 0 ? (
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
          ) : (
            ""
          )}

          {progressEditState || assigneeEditState ? (
            <AddCommentContainer containerType="float">
              <ProgressEditStateButtonsContainer>
                <CustomButton
                  type="outlined"
                  label="Cancel"
                  formHandler={() => {
                    handleClose();
                  }}
                  dataTestId={"issue-edit-cancel"}
                />
                <CustomButton
                  type="contained"
                  label="Update"
                  formHandler={() => {
                    handleStateChange();
                  }}
                  dataTestId={"issue-edit-save"}
                />
              </ProgressEditStateButtonsContainer>
            </AddCommentContainer>
          ) : (
            <ActivityLogContainer>
              <ActivityLog
                ActivityLog={taskState.TabTwo}
                comments={backendComments}
                getComments={getComments}
              />
              {backendComments?.length ? (
                <></>
              ) : (
                <>
                  <AddCommentContainerSecond>
                    <StyledInput
                      id="standard-basic"
                      variant="standard"
                      placeholder="Add Comment"
                      value={comments}
                      onChange={(e) => {
                        setComments(e.target.value);
                      }}
                      data-testid="issue-comment-input"
                      onKeyDown={(e: any) => {
                        if (e.key == "Enter") {
                          addComment(e.target?.value, taskState?.TabOne?.id);
                        } else if (
                          e.key === "ArrowRight" ||
                          e.key === "ArrowLeft"
                        ) {
                          e.stopPropagation();
                        }
                      }}
                    />
                    <AddCommentButtonContainer>
                      <SendButton
                        onClick={() => {
                          addComment(comments, taskState?.TabOne?.id);
                        }}
                        data-testid="issue-comment-send-button"
                      >
                        <ImageErrorIcon src={Send} alt="" />
                      </SendButton>
                    </AddCommentButtonContainer>
                  </AddCommentContainerSecond>
                </>
              )}
            </ActivityLogContainer>
          )}
        </TabOneDiv>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ActivityLog
          ActivityLog={taskState.TabTwo}
          comments={backendComments}
          getComments={getComments}
        />
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
    setTaskList,
  } = props;
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [footerState, SetFooterState] = useState(false);
  const [selectedTask, setSelectedTask] = useState(task);
  const router = useRouter();
  const [backendComments, setBackendComments] = useState<any>([]);
  const [file, setFile] = useState<File>();

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
      ...selectedTask,
      title: selectedTask?.title,
      options: selectedTask?.options,
      priority: selectedTask?.priority,
      sequenceNumber: selectedTask?.sequenceNumber,

      capturedOn: selectedTask?.createdAt,
      creator: selectedTask?.owner?.fullName,
      issueDescription: selectedTask?.description,
      screenshot: selectedTask?.screenshot as string,
      attachments: selectedTask?.attachments,
      relatedTags: selectedTask?.tags,
      assignees: selectedTask?.assignees?.length
        ? `${selectedTask?.assignees[0].fullName}`
        : "",
      assigneeName: selectedTask?.assignees?.length
        ? selectedTask?.assignees[0].fullName
        : "",
      assignessList: selectedTask?.assignees?.length
        ? selectedTask?.assignees?.map((item: any) => {
            return { ...item, label: item.fullName };
          })
        : [],
      moreText:
        selectedTask?.assignees?.length > 1
          ? `+${selectedTask?.assignees?.length - 1} more`
          : "",
      id: selectedTask?._id,
      status: selectedTask?.status,
    };
    setTaskState((prev: any) => {
      return {
        ...prev,
        TabOne: tempObj,
      };
    });
  }, [selectedTask]);

  const deletetaskById = (taskList: Task[], selectedTask: Task) => {
    const selectedTaskId = selectedTask?._id;
    const updatedTaskList = taskList.filter(
      (task) => task._id !== selectedTaskId
    );
    return updatedTaskList;
  };
  const onDeleteTask = () => {
    setshowPopUp(false);
    deleteTheTask(selectedTask, onClose);
    if (setTaskList) {
      const updatedTaskList = deletetaskById(taskList, selectedTask);
      setTaskList(updatedTaskList);
    }
  };

  const handleCreateTask = (formData: any) => {
    clickTaskSubmit(formData);
  };

  const saveEditDetails = async (data: any, projectId: string) => {
    if (data.title && data.type && data.priority) {
      updateTask(projectId, data, selectedTask?._id)
        .then((response) => {
          if (response.success === true) {
            toast.success("Task updated sucessfully");
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
      (data.startDate = formData
        .filter((item: any) => item.id === "dates")[0]
        ?.fields.filter(
          (item: any) => item.id == "start-date"
        )[0]?.defaultValue);
    data.startDate = data.startDate
      ? moment(data.startDate).format("YYYY-MM-DD")
      : "";

    data.dueDate = formData
      .filter((item: any) => item.id === "dates")[0]
      ?.fields.filter((item: any) => item.id == "due-date")[0]?.defaultValue;
    data.dueDate = data.dueDate
      ? moment(data.dueDate).format("YYYY-MM-DD")
      : "";

    if (!data.startDate) {
      data = _.omit(data, "startDate");
    }
    if (!data.dueDate) {
      data = _.omit(data, "dueDate");
    }

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
            toast.success("Attachments uploaded sucessfully");
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
    } else {
      saveEditDetails(data, projectId);
    }
  };
  const taskUpdate = (data: any) => {
    // const issueData = _.cloneDeep(selectedTask);
    let issueData: any = {};

    issueData.assignees = data.selectedUser.map((user: any) => {
      return user._id || user.user._id;
    });
    data.selectedProgress ? (issueData.status = data.selectedProgress) : null;
    const projectId = router.query.projectId;

    // issueData.startDate = moment(issueData.startDate).format("YYYY-MM-DD");
    // issueData.dueDate = moment(issueData.dueDate).format("YYYY-MM-DD");
    updateTask(projectId as string, issueData, selectedTask?._id)
      .then((response) => {
        if (response.success === true) {
          toast.success("Task updated sucessfully");
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
                data-testid="back-arrow"
              />
              <SpanTile data-testid="task-detail-header">
                {selectedTask?.title} (#{selectedTask?.sequenceNumber})
              </SpanTile>
            </LeftTitleCont>
            <RightTitleCont>
              <EditIcon
                src={Edit}
                alt={"close icon"}
                onClick={() => {
                  setOpenCreateTask(true);
                }}
                data-testid="edit-icon"
              />
              <DeleteIcon
                src={Delete}
                alt={"close icon"}
                onClick={() => {
                  setshowPopUp(true);
                }}
                data-testid="delete-icon"
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
            setTaskState={setTaskState}
          />
        </BodyContainer>
      </CustomTaskDrawerContainer>
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Delete Task"}
          // modalmessage={`Are you sure you want to delete this Task "${selectedTask?.type}(#${selectedTask?._id})"?`}
          modalmessage={`Are you sure you want to delete this Task "${selectedTask?.title} (#${selectedTask?._id})"?`}
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
            deleteTheAttachment={deleteTheAttachment}
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

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    // color: "rgba(0, 0, 0, 0.87)",
    fontSize: 11,
    // position: "absolute",
    right: 30,
    borderRadius: "4px",
    top: 2,
    // width: "308px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    height: "10px !important",
    left: "10px !important",
    marginBottom: "0px",
    "&:before": {
      background: "#FFFFFF",
      border: "1px solid #D9D9D9",
    },

    //  color: 'red',
  },
}));

const DarkToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    // color: "rgba(0, 0, 0, 0.87)",
    fontSize: 11,
    // position: "absolute",
    right: 30,
    borderRadius: "4px",
    top: 2,
    // width: "308px",
  },

  "& .MuiTooltip-tooltip": {
    background: "transparent !important",
  },
  [`& .${tooltipClasses.arrow}`]: {
    height: "12px !important",
    left: "4px !important",
    marginBottom: "0px",
    "&:before": {
      background: "#FFFFFF",
      border: "1px solid #D9D9D9",
    },

    //  color: 'red',
  },
}));
