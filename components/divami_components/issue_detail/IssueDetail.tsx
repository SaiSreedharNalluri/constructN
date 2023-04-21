import {
  Autocomplete,
  Box,
  Drawer,
  TextField,
  ListItemIcon,
  Menu,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Select } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Moment from "moment";
import Image from "next/image";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
import Clip from "../../../public/divami_icons/clip.svg";
import Delete from "../../../public/divami_icons/delete.svg";
import Edit from "../../../public/divami_icons/edit.svg";
import Send from "../../../public/divami_icons/send.svg";
import vectorTool from "../../../public/divami_icons/vectorTool.svg";

import CustomButton from "../custom-button/CustomButton";
import CustomSelect from "../custom-select/CustomSelect";
import { toast } from "react-toastify";
import CustomDrawer from "../custom-drawer/custom-drawer";
import CreateIssue from "../create-issue/CreateIssue";
import { ISSUE_FORM_CONFIG } from "../create-issue/body/Constants";
import PopupComponent from "../../popupComponent/PopupComponent";
import { editIssue } from "../../../services/issue";
import router, { useRouter } from "next/router";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
import _ from "lodash";
import {
  createAttachment,
  deleteAttachment,
} from "../../../services/attachments";
import {
  ArrowIcon,
  AssignEditSearchContainer,
  AttachedImageDiv,
  AttachedImageIcon,
  AttachedImageTitle,
  AttachHorizontal,
  AttachmentDescription,
  AttachmentDiv,
  AttachmentTitle,
  CaptureStatus,
  CaptureTitle,
  CustomSelectContainer,
  CustomTaskDrawerContainer,
  DeleteIcon,
  DescriptionDiv,
  DescriptionPara,
  DescriptionTitle,
  EditIcon,
  FirstHeaderDiv,
  FormElementContainer,
  FourthContAssigned,
  FourthContLeft,
  FourthContProgType,
  HeaderContainer,
  LeftTitleCont,
  MoreText,
  PenIconImage,
  PriorityStatus,
  PriorityTitle,
  ProgressEditStateButtonsContainer,
  RelatedDiv,
  RelatedSingleButton,
  RelatedTagsButton,
  RelatedTagTitle,
  RightTitleCont,
  SecondBodyDiv,
  SecondContCapt,
  SecondContPrior,
  SecondContPriorParal,
  SpanTile,
  TabOneDiv,
  ThirdContProg,
  ThirdContProgType,
  ThirdContRight,
  ThirdContWatch,
  ThirdContWatchName,
  TitleContainer,
  BodyContainer,
  ProgressStateTrue,
  FourthBodyDiv,
  ProgressStateFalse,
  ProgressCustomSelect,
  AddCommentContainer,
  AddCommentContainerSecond,
  AddCommentButtonContainer,
  AttachButton,
  ImageErrorIcon,
  SendButton,
  StyledInput,
  ActivityLogContainer,
  StyledMenu,
  IconContainer,
  AssigneeList,
  SecondAssigneeList,
  ExtraLabel,
  AssignedLabel,
  ValueContainer,
  CloseIcon,
} from "./IssueDetailStyles";
import { createComment, getCommentsList } from "../../../services/comments";
import ActivityLog from "../task_detail/ActivityLog";
import Chip from "@mui/material/Chip";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Issue {
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
    formHandler,
    taskType,
    taskPriority,
    taskStatus,
    projectUsers,
    issueUpdate,
    deleteTheAttachment,
    handleFooter,
    setTaskState,
  } = props;

  const [value, setValue] = React.useState(0);
  const [issueTypeConfig, setIssueTypeConfig] = useState("");
  const [formState, setFormState] = useState({
    selectedValue: "",
    selectedProgress: null,
    selectedUser:
      taskState?.assignessList || taskState?.TabOne?.assignessList || [],
  });
  const [progressEditState, setProgressEditState] = useState(false);
  const [assigneeEditState, setAssigneeEditState] = useState(false);
  const [progressOptionsState, setProgressOptionsState] = useState<any>([{}]);
  const [assigneeOptionsState, setAssigneeOptionsState] = useState([]);
  const [formConfig, setFormConfig] = useState(ISSUE_FORM_CONFIG);
  const [searchTerm, setSearchTerm] = useState("");
  const [list, setList] = useState<any>();
  const [comments, setComments] = useState("");
  const [backendComments, setBackendComments] = useState<any>([]);
  const [file, setFile] = useState<File>();

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const router = useRouter();

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
          id: "issuePriority",
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
        label: each.user.fullName,
      };
    });
    setAssigneeOptionsState(tempUsers);
    setFormState({
      ...formState,
      selectedUser: taskState?.TabOne?.assignessList,
    });
  }, []);

  useEffect(() => {
    setFormState({
      ...formState,
      selectedUser: taskState?.TabOne?.assignessList,
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
    issueUpdate(optState);
  };

  const handleEditAssigne = () => {
    setAssigneeEditState(!assigneeEditState);
  };

  useEffect(() => {
    if (progressEditState || assigneeEditState) handleFooter(true);
    else handleFooter(false);
  }, [progressEditState, assigneeEditState]);

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
    //
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSortMenuClose = () => {
    setIsSortMenuOpen(false);
    setAnchorEl(null);
  };

  const sortMenuOptions = [
    {
      label: "Status ( To Do - Completed)",
      icon: null,
      method: "status_asc",
    },
    {
      label: "Status ( Completed - To Do)",
      icon: null,
      method: "status_desc",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "#D9D9D9", color: "black" }}>
        <Tabs
          TabIndicatorProps={{
            style: { background: "#FF843F", height: "3px", color: "black" },
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
            {taskState?.TabOne?.screenshot && (
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
            )}
          </FirstHeaderDiv>
          <SecondBodyDiv>
            <SecondContPrior>
              <PriorityTitle>Type</PriorityTitle>
              <PriorityStatus
                style={{ color: "#101F4B" }}
                data-testid="issue-title"
              >
                {taskState?.TabOne?.type}
              </PriorityStatus>
            </SecondContPrior>

            <SecondContPriorParal>
              <PriorityTitle>Priority</PriorityTitle>
              <PriorityStatus
                style={{ color: "#101F4B" }}
                data-testid="issue-priority"
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
                data-testid="issue-captured"
              >
                {" "}
                {Moment(taskState?.TabOne?.capturedOn).format("DD MMM YYYY")}
              </CaptureStatus>
            </SecondContCapt>

            <SecondContPriorParal>
              <ThirdContWatch>Watcher</ThirdContWatch>
              <ThirdContWatchName
                style={{ color: "#101F4B" }}
                data-testid="issue-watcher"
              >
                {" "}
                {taskState?.TabOne?.creator}
              </ThirdContWatchName>
            </SecondContPriorParal>
          </SecondBodyDiv>

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
                <FourthContLeft>
                  <FourthContAssigned>Assigned to</FourthContAssigned>
                  <FourthContProgType
                    style={{ color: "#101F4B" }}
                    data-testid="issue-assignees"
                  >
                    {taskState?.TabOne?.assignees}
                    <DarkToolTip
                      arrow
                      title={
                        <SecondAssigneeList>
                          {taskState?.TabOne?.assignessList?.map(
                            (assignName: any, index: number) => {
                              return (
                                <>
                                  {index !==
                                  taskState?.TabOne?.assignessList.length - 1
                                    ? assignName?.firstName
                                        .charAt(0)
                                        .toUpperCase() +
                                      assignName?.firstName.slice(1) +
                                      " " +
                                      assignName.lastName
                                        .charAt(0)
                                        .toUpperCase() +
                                      assignName?.lastName.slice(1) +
                                      " | "
                                    : assignName?.firstName
                                        .charAt(0)
                                        .toUpperCase() +
                                      assignName?.firstName.slice(1) +
                                      " " +
                                      assignName.lastName
                                        .charAt(0)
                                        .toUpperCase() +
                                      assignName?.lastName.slice(1)}
                                </>
                              );
                            }
                          )}
                        </SecondAssigneeList>
                      }
                    >
                      <MoreText>{taskState?.TabOne?.moreText}</MoreText>
                    </DarkToolTip>
                    {taskState?.TabOne?.assignees ? (
                      <PenIconImage
                        onClick={handleEditAssigne}
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
                  Progress
                </ThirdContProg>

                <ThirdContProgType
                  style={{ color: "#101F4B" }}
                  data-testid="issue-progress"
                >
                  {taskState?.TabOne?.status}
                  {taskState?.TabOne?.status ? (
                    <PenIconImage
                      onClick={handleEditProgress}
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

                  <FourthContProgType
                    style={{ color: "#101F4B" }}
                    data-testid="issue-assignees"
                  >
                    {taskState?.TabOne?.assignees}
                    <LightTooltip
                      arrow
                      title={
                        <AssigneeList>
                          {taskState?.TabOne?.assignessList?.map(
                            (assignName: any, index: number) => {
                              return (
                                <>
                                  {index !==
                                  taskState?.TabOne?.assignessList.length - 1
                                    ? assignName?.firstName
                                        .charAt(0)
                                        .toUpperCase() +
                                      assignName?.firstName.slice(1) +
                                      " " +
                                      assignName.lastName
                                        .charAt(0)
                                        .toUpperCase() +
                                      assignName?.lastName.slice(1) +
                                      " | "
                                    : assignName?.firstName
                                        .charAt(0)
                                        .toUpperCase() +
                                      assignName?.firstName.slice(1) +
                                      " " +
                                      assignName.lastName
                                        .charAt(0)
                                        .toUpperCase() +
                                      assignName?.lastName.slice(1)}
                                </>
                              );
                            }
                          )}
                        </AssigneeList>
                      }
                    >
                      <MoreText>{taskState?.TabOne?.moreText}</MoreText>
                    </LightTooltip>

                    {taskState?.TabOne?.assignees ? (
                      <PenIconImage
                        onClick={handleEditAssigne}
                        src={Edit}
                        alt={"close icon"}
                        data-testid="issue-assignees-edit"
                      />
                    ) : (
                      <></>
                    )}
                  </FourthContProgType>
                </FourthContLeft>
              </FourthBodyDiv>
            </ProgressStateFalse>
          )}

          {progressEditState && (
            <ProgressCustomSelect data-testid="progress-options">
              <ExtraLabel>Progress</ExtraLabel>
              <CustomSelect
                config={progressOptionsState[0]}
                data={{
                  ...progressOptionsState[0],
                  defaultValue: taskState?.TabOne?.status,
                }}
                // defaultValue={progressOptionsState?.options[0].value}
                id={"issuePriority"}
                sx={{ minWidth: 120 }}
                setFormConfig={setProgressOptionsState}
                isError={""}
                label=""
                data-testid="progress-options"
              />
            </ProgressCustomSelect>
          )}
          {assigneeEditState && (
            <AssignEditSearchContainer>
              <AssignedLabel>Assigned to</AssignedLabel>
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
                    border: "1px solid #ff843f !important",
                  },
                }}
                renderTags={() => null}
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

          <FormElementContainer>
            <CustomSelectContainer>
              {/* <SelectVariants options={DetailsObj.TabOne[0].options} /> */}
              {/* <BasicSelect options={DetailsObj.TabOne[0].options} /> */}
            </CustomSelectContainer>
          </FormElementContainer>

          {taskState?.TabOne?.issueDescription?.length > 0 ? (
            <DescriptionDiv>
              <DescriptionTitle>Issue Description</DescriptionTitle>

              <DescriptionPara data-testid="issue-description">
                {taskState?.TabOne?.issueDescription}
              </DescriptionPara>
            </DescriptionDiv>
          ) : (
            ""
          )}

          {taskState?.TabOne?.attachments?.length > 0 && (
            <>
              <AttachmentDiv className={`attachmentsSection`}>
                <AttachmentTitle data-testid="issue-attachments-label">
                  Attachments
                </AttachmentTitle>
                <AttachmentDescription>
                  {/* {console.log(taskState?.TabOne.attachments)} */}
                  {taskState?.TabOne.attachments?.map(
                    (a: any, index: number) => {
                      return (
                        <>
                          <AttachedImageDiv className={`detailsImageDiv`}>
                            {/* <AttachedImageTitle>{a?.name}</AttachedImageTitle> */}
                            <AttachedImageTitle>{a?.name}</AttachedImageTitle>

                            {/* <AttachedImageIcon>
                              <Image src={""} alt="" />
                            </AttachedImageIcon> */}
                            <DeleteIcon
                              src={Delete}
                              alt={"delete icon"}
                              onClick={() => {
                                deleteTheAttachment(a?._id, "issue");
                                setTaskState((prev: any) => {
                                  const updatedTabOne = {
                                    ...prev.TabOne,
                                    attachments: prev.TabOne.attachments.filter(
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
                              className={`deleteIcon`}
                              data-testid="delete-attachment"
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
          {taskState?.TabOne?.tags?.length > 0 ? (
            <RelatedDiv>
              <RelatedTagTitle>Related Tags</RelatedTagTitle>
              <RelatedTagsButton>
                {taskState?.TabOne.tags?.map((item: any) => {
                  return (
                    <>
                      <RelatedSingleButton data-testid="chip-button">
                        {item}
                      </RelatedSingleButton>
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
                  formHandler={handleClose}
                  dataTestId={"issue-edit-cancel"}
                />
                <CustomButton
                  type="contained"
                  label="Update"
                  formHandler={handleStateChange}
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
                    />
                    <AddCommentButtonContainer>
                      {/* <AttachButton>
                    <ImageErrorIcon src={Clip} alt="" />
                    <input type="file" onChange={handleFileChange} />
                  </AttachButton> */}
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
      {/* <>
        <AddCommentContainerSecond>
          <StyledInput
            id="standard-basic"
            variant="standard"
            placeholder="Add Comment"
            value={comments}
            onChange={(e) => {
              setComments(e.target.value);
            }}
          />
          <AddCommentButtonContainer>
            <AttachButton>
              <ImageErrorIcon src={Clip} alt="" />
              <input type="file" onChange={handleFileChange} />
            </AttachButton>
            <SendButton
              onClick={() => {
                addComment(comments, taskState?.TabOne?.id);
              }}
            >
              <ImageErrorIcon src={Send} alt="" />
            </SendButton>
          </AddCommentButtonContainer>
        </AddCommentContainerSecond>
      </> */}
    </Box>
  );
}

const CustomIssueDetailsDrawer = (props: any) => {
  const {
    onClose,
    issue,
    issuesList,
    issueType,
    issuePriority,
    issueStatus,
    projectUsers,
    currentProject,
    currentSnapshot,
    currentStructure,
    contextInfo,
    deleteTheIssue,
    setIssueList,
    getIssues,
    deleteTheAttachment,
  } = props;
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [showPopUp, setshowPopUp] = useState(false);
  const [footerState, SetFooterState] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(issue);
  const router = useRouter();
  useEffect(() => {
    setSelectedIssue(issue);
  }, [issue]);

  const deleteIssueById = (issuesList: Issue[], selectedIssue: Issue) => {
    const selectedIssueId = selectedIssue._id;
    const updatedIssuesList = issuesList.filter(
      (issue) => issue._id !== selectedIssueId
    );
    return updatedIssuesList;
  };

  const onDeleteIssue = (status: any) => {
    setshowPopUp(false);
    if (deleteTheIssue) deleteTheIssue(selectedIssue, onClose);
    const updatedIssuesList = deleteIssueById(issuesList, selectedIssue);
    setIssueList(updatedIssuesList);
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

  // console.log("taskState22", taskState);

  useEffect(() => {
    let tempObj = {
      ...selectedIssue,
      options: selectedIssue?.options,
      priority: selectedIssue?.priority,
      capturedOn: selectedIssue?.createdAt,
      creator: selectedIssue?.owner?.fullName,
      issueDescription: selectedIssue?.description,
      screenshot: selectedIssue?.screenshot as string,
      attachments: selectedIssue?.attachments,
      assignees: selectedIssue.assignees?.length
        ? `${selectedIssue.assignees[0].fullName}`
        : "",
      assigneeName: selectedIssue.assignees?.length
        ? selectedIssue.assignees[0].fullName
        : "",
      assignessList: selectedIssue.assignees?.length
        ? selectedIssue.assignees?.map((item: any) => {
            return { ...item, label: item.fullName };
          })
        : [],
      moreText:
        selectedIssue.assignees?.length > 1
          ? `+${selectedIssue.assignees?.length - 1} more`
          : "",
      relatedTags: selectedIssue?.tags,
      id: selectedIssue?._id,
      tags: selectedIssue?.tags,
      status: selectedIssue?.status,
      title: selectedIssue?.title,
    };
    setTaskState((prev: any) => {
      return {
        ...prev,
        TabOne: tempObj,
      };
    });
  }, [selectedIssue]);

  const taskSubmit = (formData: any) => {
    // const updatedList = issuesList.map((item: any) => {
    //   if (item._id == formData._id){
    //     return formData;
    //   }else{
    //     return {
    //       ...item
    //     }
    //   }
    // })
    // issuesList.push(formdata);
    // issueMenuInstance.toolAction = "issueCreated";
    // setCreateOverlay(false);
    // issueMenuClicked(issueMenuInstance);
  };
  const handleCreateTask = (formData: any) => {
    clickTaskSubmit(formData);
  };

  const saveEditDetails = async (data: any, projectId: string) => {
    if (data.title && data.type && data.priority && data.description) {
      editIssue(projectId, data, selectedIssue._id)
        .then((response) => {
          if (response.success === true) {
            toast.success("Issue updated sucessfully");
            getIssues(currentStructure._id);
          } else {
            toast.error("Error updating the issue");
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
    const userIdList = formData
      .find((item: any) => item.id == "assignedTo")
      ?.selectedName?.map((each: any) => {
        return each._id || each.value;
      });
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
    // const userIdList = formData
    //   .find((item: any) => item.id == "assignedTo")
    //   ?.map((each: any) => {
    //     return each.value;
    //   });

    data.structure = currentStructure?._id;
    data.snapshot = currentSnapshot?._id;
    data.status = formData.filter(
      (item: any) => item.id == "issueStatus"
    )[0]?.defaultValue;
    // data.context = contextInfo;
    // Object.keys(contextInfo).forEach((key) => {
    //   if (key !== "id") {
    //     data.context = { ...data.context, [key]: contextInfo[key] };
    //   }
    // });
    data.title = formData.filter(
      (item: any) => item.id == "title"
    )[0]?.defaultValue;

    data.type = formData.filter(
      (item: any) => item.id == "issueType"
    )[0]?.defaultValue;
    (data.priority = formData.filter(
      (item: any) => item.id == "issuePriority"
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
    // console.log("njdsfjk");
    if (filesArr?.length) {
      createAttachment(issue._id, fileformdata)
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
  const issueUpdate = (data: any) => {
    const issueData = _.cloneDeep(selectedIssue);
    issueData.assignees = data.selectedUser.map((user: any) => {
      return user._id || user.user._id;
    });
    data.selectedProgress ? (issueData.status = data.selectedProgress) : null;
    const projectId = router.query.projectId;
    editIssue(projectId as string, issueData, selectedIssue._id)
      .then((response) => {
        if (response.success === true) {
          toast.success("Issue updated sucessfully");
          getIssues(currentStructure._id);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
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
              <SpanTile data-testid="issue-detail-header">
                {selectedIssue?.title} (#{selectedIssue?.sequenceNumber})
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
                data-testid="delete-icon"
                onClick={() => {
                  setshowPopUp(true);
                }}
              />
            </RightTitleCont>
          </TitleContainer>
        </HeaderContainer>

        <BodyContainer footerState={footerState}>
          <BasicTabs
            taskType={issueType}
            taskPriority={issuePriority}
            taskStatus={issueStatus}
            projectUsers={projectUsers}
            taskState={taskState}
            issueUpdate={issueUpdate}
            deleteTheAttachment={deleteTheAttachment}
            handleFooter={SetFooterState}
            setTaskState={setTaskState}
          />
        </BodyContainer>
      </CustomTaskDrawerContainer>

      {openCreateTask && (
        <CustomDrawer open>
          <CreateIssue
            handleCreateTask={handleCreateTask}
            setOpenCreateTask={setOpenCreateTask}
            currentProject={currentProject}
            currentSnapshot={currentSnapshot}
            currentStructure={currentStructure}
            contextInfo={contextInfo}
            editData={selectedIssue}
            closeIssueCreate={() => {
              setOpenCreateTask(false);
            }}
            issueStatusList={issueStatus}
            deleteTheAttachment={deleteTheAttachment}
          />
        </CustomDrawer>
      )}
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Delete Issue"}
          // modalmessage={`Are you sure you want to delete this Issue "${selectedIssue.type}(#${selectedIssue._id})"?`}
          modalmessage={`Are you sure you want to delete this Issue "${selectedIssue.title} (#${selectedIssue._id})"?`}
          primaryButtonLabel={"Delete"}
          SecondaryButtonlabel={"Cancel"}
          callBackvalue={onDeleteIssue}
        />
      )}
    </>
  );
};

export default CustomIssueDetailsDrawer;

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
    left: "38px !important",
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
