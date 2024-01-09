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
import CustomMiniLoader from "../custom_loader/CustomMiniLoader";
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
  FourthContMoreText,
  ParentFourthContMoreText,
  MoreTextDiv,
  DueDateTitle,
  SecondContDueDate,
  ThirdContDueDate,
  ProcoreLogo,
  
} from "./IssueDetailStyles";
import "jspdf-autotable";
import { createComment, getCommentsList } from "../../../services/comments";
import ActivityLog from "../task_detail/ActivityLog";
import Chip from "@mui/material/Chip";
import moment from "moment";
import { CustomToast } from "../custom-toaster/CustomToast";
import AttachmentPreview from "../attachmentPreview";
import { setTheFormatedDate } from "../../../utils/ViewerDataUtils";
import Download from "../../../public/divami_icons/download.svg";
import { truncateString } from "../../../pages/projects";
import procore from "../../../public/divami_icons/procore.svg";
import ProcoreLink from "../../container/procore/procoreLinks";
import jsPDF from "jspdf";

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
  const[isAdding,setIsAdding]=useState(false)
  const router = useRouter();
  const [showPreview,setShowPreview]=useState(false)
  const[attachment,setAttachment]=useState<{
    name: string;
    url: string;
    entity: string;
    _id: string;
}>()
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
        label: each?.user?.fullName,
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
          if(isAdding)
          {
            const fileInput = document.getElementById(
              "issueDetailsWindow"
            ) as HTMLInputElement;
            if (fileInput) {
              setTimeout(()=>{
                fileInput.scrollTo (0,fileInput.scrollHeight);
              },100)
              
            }
          }
        }
      })
      .catch((error) => {
        CustomToast("Failed to load data. Please refresh the page.","error");
      });
  };

  useEffect(() => {
    if (taskState?.TabOne?.id) {
      getComments(taskState?.TabOne?.id);
    }
  }, [taskState,isAdding]);

  const addComment = (text: string, entityId: string) => {
    if (text !== "") {
      createComment(router.query.projectId as string, {
        comment: text,
        entity: entityId,
      }).then((response) => {
        if (response.success === true) {
          setIsAdding(true)
          getComments(entityId);
          CustomToast("Comment added successfully","success");
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
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "#D9D9D9", color: "black" }}>
        <Tabs
          TabIndicatorProps={{
            style: { background: "#F1742E", height: "3px", color: "black" },
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
          </SecondBodyDiv>
          <SecondBodyDiv>
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
                {setTheFormatedDate(taskState?.TabOne?.capturedOn)}
              </CaptureStatus>
            </SecondContCapt>
          </SecondBodyDiv>

          <SecondBodyDiv>
            <SecondContPriorParal>
              <ThirdContWatch>Created By</ThirdContWatch>
              <ThirdContWatchName
                style={{ color: "#101F4B" }}
                data-testid="issue-watcher"
              >
                {" "}
                {taskState?.TabOne?.creator}
              </ThirdContWatchName>
            </SecondContPriorParal>
          </SecondBodyDiv>
          <SecondBodyDiv>
            <SecondContDueDate>
              <DueDateTitle>Due date</DueDateTitle>
              <ThirdContDueDate
                style={{ color: "#101F4B" }}
                data-testid="issue-duedate"
              >
                {" "}
                {setTheFormatedDate(taskState?.TabOne?.dueDate)}
              </ThirdContDueDate>
            </SecondContDueDate>
          </SecondBodyDiv>
          <SecondBodyDiv>
            <ThirdContRight>
              <ThirdContProg data-testid="progres-label">Status</ThirdContProg>

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
          </SecondBodyDiv>
          {progressEditState && (
            <ProgressCustomSelect data-testid="progress-options">
              {/* <ExtraLabel>Progress</ExtraLabel> */}
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

          <SecondBodyDiv>
            <FourthContLeft>
              <FourthContAssigned>Assigned to</FourthContAssigned>
              <MoreTextDiv>
                <ParentFourthContMoreText>
                  <FourthContProgType
                    style={{ color: "#101F4B" }}
                    data-testid="issue-assignees"
                  >
                    {taskState?.TabOne?.assignees}
                  </FourthContProgType>
                  {taskState?.TabOne?.assignees ? (
                    <PenIconImage
                      onClick={handleEditAssigne}
                      src={Edit}
                      alt={"close icon"}
                    />
                  ) : (
                    ""
                  )}
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
                                      assignName.lastName +
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
          {/* <ParentFourthContMoreText>
          
          </ParentFourthContMoreText> */}
          {assigneeEditState && (
            <AssignEditSearchContainer>
              {/* <AssignedLabel>Assigned to</AssignedLabel> */}
              <Autocomplete
                data-testid="assignee-options"
                disablePortal
                id="combo-box-demo"
                disableClearable
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
                          style={{
                            marginLeft: "5px",
                            marginRight: "12px",
                          }}
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

          <FormElementContainer>
            <CustomSelectContainer>
              {/* <SelectVariants options={DetailsObj.TabOne[0].options} /> */}
              {/* <BasicSelect options={DetailsObj.TabOne[0].options} /> */}
            </CustomSelectContainer>
          </FormElementContainer>

          {taskState?.TabOne?.issueDescription?.length > 0 ? (
            <DescriptionDiv>
              <DescriptionTitle>Description</DescriptionTitle>

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
                  {taskState?.TabOne.attachments?.map(
                    (a: any, index: number) => {
                      return (
                        <AttachedImageDiv key={a._id}className={`detailsImageDiv`}>
                          <div className="w-[50%]">
                          <Tooltip title={a?.name?.length > 20 ? a?.name : ""}>
                          <AttachedImageTitle onClick={() => {
                              setShowPreview(true)
                               setAttachment(a)
                              }}
                            >
                              {truncateString(a?.name,20)}
                              
                            </AttachedImageTitle>
                         </Tooltip>
                        </div>
                        <div>
                        <Image src={Download} 
                        className={`cursor-pointer`}
                        alt="Arrow" 
                         onClick={()=>{
                         window.open(a.url, "_blank");
                        }}/>
                        </div>
                        <DeleteIcon
                              src={Delete}
                              alt={"delete icon"}
                              onClick={() => {
                                setAttachmentPopup(true);
                               }}
                        /> {attachmentPopup && (
                              <PopupComponent
                                open={attachmentPopup}
                                setShowPopUp={setAttachmentPopup}
                                modalTitle={"Delete Attachment"}
                                modalmessage={`Are you sure you want to delete this attachment "${a?._id} "?`}
                                primaryButtonLabel={"Delete"}
                                SecondaryButtonlabel={"Cancel"}
                                callBackvalue={() => {
                                  setAttachmentPopup(false);
                                  deleteTheAttachment(a?._id, "issue");
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
                      );
                    }
                  )}
                   { 
                    showPreview&&(
                            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-10">
                              <AttachmentPreview attachment={attachment} setShowPreview={setShowPreview}></AttachmentPreview>
                            </div>)
                           
                    }
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
                setIsAdding={setIsAdding}
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
          setIsAdding={setIsAdding}
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
    issueLoader,
    setIssueLoader,
  } = props;
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [showPopUp, setshowPopUp] = useState(false);
  const [footerState, SetFooterState] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(issue);
  const[isLoading,setLoading]=useState(false);
  const [procorePopup,setProcorePopup]= useState<boolean>(false)
  const [newRFI,setnewLinkRFI] = useState<boolean>(false);
  const [taskDetail,setTaskDetail] = useState<boolean>(true)
  const router = useRouter();
  useEffect(() => {
    setSelectedIssue(issue);
  }, [issue]);

  const deleteIssueById = (issuesList: Issue[], selectedIssue: Issue) => {
    const selectedIssueId = selectedIssue?._id;
    const updatedIssuesList = issuesList.filter(
      (issue) => issue._id !== selectedIssueId
    );
    return updatedIssuesList;
  };

  const onDeleteCallback = () => {
    onClose();
    if (setIssueList) {
      const updatedIssuesList = deleteIssueById(issuesList, selectedIssue);

      setIssueList(updatedIssuesList);
    }
  };

  const onDeleteIssue = (status: any) => {
    setshowPopUp(false);
    if (deleteTheIssue) deleteTheIssue(selectedIssue, onDeleteCallback);

    const deleteTheAttachment = (attachmentId: string) => {
      deleteAttachment(attachmentId)
        .then((response) => {
          if (response.success === true) {
            toast(response.message);
          }
        })
        .catch((error) => {
          CustomToast(error.message,"error");
        });
    };
  };

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
      assignees: selectedIssue?.assignees?.length
        ? `${selectedIssue?.assignees[0].fullName}`
        : "",
      assigneeName: selectedIssue?.assignees?.length
        ? selectedIssue?.assignees[0].fullName
        : "",
      assignessList: selectedIssue?.assignees?.length
        ? selectedIssue?.assignees?.map((item: any) => {
            return { ...item, label: item.fullName };
          })
        : [],
      moreText:
        selectedIssue?.assignees?.length > 1
          ? `+${selectedIssue?.assignees?.length - 1} more`
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

  const handleCreateTask = (formData: any) => {
    clickTaskSubmit(formData);
  };

  const saveEditDetails = async (data: any, projectId: string) => {
    if (data.title && data.type && data.priority) {
      editIssue(projectId, data, selectedIssue?._id)
        .then((response) => {
          if (response.success === true) {
            CustomToast("Issue updated successfully","success");
            getIssues(currentStructure._id);
            setLoading(true)
          } else {
            CustomToast("Error updating the Issue","error");
          }
          setLoading(false)
          setOpenCreateTask(false);
        })
        .catch((error) => {
          if (error.success === false) {
            CustomToast(error?.message,"error");
          }
          setLoading(false)
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

    data.structure = currentStructure?._id;
    data.snapshot = currentSnapshot?._id;
    data.status = formData.filter(
      (item: any) => item.id == "issueStatus"
    )[0]?.defaultValue;

    data.title = formData.filter(
      (item: any) => item.id == "create_title"
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
              ?.chipString
          : []) || []),
      (data.startDate = formData
        .filter((item: any) => item.id === "dates")[0]
        ?.fields.filter(
          (item: any) => item.id == "start-date"
        )[0]?.defaultValue);
    data.startDate = `${moment(data.startDate).toISOString()}`;

    data.dueDate = formData
      .filter((item: any) => item.id === "dates")[0]
      ?.fields.filter((item: any) => item.id == "due-date")[0]?.defaultValue;
    data.dueDate = `${moment(data.dueDate).toISOString()}`;

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
      createAttachment(issue._id, fileformdata)
        .then((response) => {
          if (!response.success) {
            CustomToast("Error uploading attachments","error");
          }
          saveEditDetails(data, projectId);
        })
        .catch((error) => {
          if (error.success === false) {
            setLoading(false)
            CustomToast(error?.message, "error", 3000);
          }
        });
    } else {
      saveEditDetails(data, projectId);
    }
  };
  const issueUpdate = (data: any) => {
    let issueData: any = {};
    issueData.assignees = data.selectedUser.map((user: any) => {
      return user._id || user.user._id;
    });

    data.selectedProgress ? (issueData.status = data.selectedProgress) : null;
    const projectId = router.query.projectId;
    editIssue(projectId as string, issueData, selectedIssue?._id)
      .then((response) => {
        if (response.success === true) {
          CustomToast("Issue updated successfully","success");
          getIssues(currentStructure._id);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          CustomToast(error?.message,"error");
        }
      });
  };
  const [gen,setGen]=useState<any>(undefined)
  const handleProcoreLinks = () =>{
   const generatePDF= convertObjectToPdf()
   setGen(generatePDF);
    setProcorePopup(true)
    setTaskDetail(false)
  }

  const  handleCloseProcore=()=>{
    setProcorePopup(false)
    setTaskDetail(true);
  }
  const convertObjectToPdf = () => {
    // Sample object data
    const data: any = selectedIssue;
  
    // Create a new jsPDF instance
    const pdf = new jsPDF();
  
    // Set font size and style
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
  
    // Define table headers
    const headers = ["Key", "Value"];
  
    // Initialize table data array
    const tableData = [];
  
    // Iterate over object properties and push key-value pairs to tableData
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Check if the current property is "assignees"
        if (key === "assignees") {
          // Extract names from assignees array and concatenate
          const assigneeNames = data[key].map((assignee: any) => `${assignee.firstName} ${assignee.lastName}`).join(", ");
          tableData.push([key, assigneeNames]);
        } else {
          // For other properties, push key-value pairs to tableData
          tableData.push([key, data[key]]);
        }
        if (key === "screenshot") {
          
          // Handle screenshot separately and add it as an image
          const screenshotUrl = data[key];
          const imgWidth = 80; // Adjust as needed
          const imgHeight = 60; // Adjust as needed
          pdf.addImage(screenshotUrl, "PNG", 100, 200, imgWidth, imgHeight);
          tableData.push(["Screenshot", ""]);
        }
      }
    }
  
    // Set table column widths and autoTable options
    const columnWidths = [50, 140];
  
    // Add table headers and data to PDF using jspdf-autotable
    (pdf as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      margin: { top: 20 },
      columnStyles: { 0: { cellWidth: columnWidths[0] } },
    });
      
    // Save the PDF
    
    return pdf;
    pdf.save("object_data.pdf");
  };
  

  return (
    <>
   
      {procorePopup && <ProcoreLink gen={gen} handleCloseProcore={handleCloseProcore}></ProcoreLink>}
      {taskDetail && 
      <CustomTaskDrawerContainer issueLoader={issueLoader}>
        <HeaderContainer>
          <TitleContainer>
            <LeftTitleCont>
              <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] ">
                <ArrowIcon
                  onClick={() => {
                    onClose(true);
                  }}
                  src={BackArrow}
                  alt={"close icon"}
                  data-testid="back-arrow"
                />
                
              </div>
     
              <DarkToolTip
                title={
                  <SecondAssigneeList>
                    {selectedIssue?.title}
                  </SecondAssigneeList>
                }
              >
                <SpanTile data-testid="issue-detail-header">
                  {selectedIssue?.title
                    ? selectedIssue?.title?.length >= 20
                      ? `${selectedIssue?.title.substring(0, 16)}...`
                      : `${selectedIssue?.title}`
                    : ""}
                  (#{selectedIssue?.sequenceNumber})
                </SpanTile>
              </DarkToolTip>
            </LeftTitleCont>
            <RightTitleCont>
            <div className="p-[6px] hover:bg-[#E7E7E7]">
            <ProcoreLogo src={procore} alt="logo" onClick={handleProcoreLinks}/>
              </div>
              <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] mr-[10px]">
                <EditIcon
                  src={Edit}
                  alt={"close icon"}
                  onClick={() => {
                    setOpenCreateTask(true);
                  }}
                  data-testid="edit-icon"
                />
              </div>
              <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] mr-[10px]">
                <DeleteIcon
                  src={Delete}
                  alt={"close icon"}
                  data-testid="delete-icon"
                  onClick={() => {
                    setshowPopUp(true);
                  }}
                />
              </div>
            </RightTitleCont>
          </TitleContainer>
        </HeaderContainer>
        {issueLoader ? (
          <div className="mini-loader-parent">
            <CustomMiniLoader></CustomMiniLoader>
          </div>
        ) : (
          <>
            <BodyContainer footerState={footerState} id="issueDetailsWindow">
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
          </>
        )}
        
      </CustomTaskDrawerContainer>
    
}


      {openCreateTask && (
        <CustomDrawer open variant="temporary">
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
            setLoading={setLoading}
            isLoading={isLoading}
          />
        </CustomDrawer>
      )}
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Delete Issue"}
          modalmessage={`Are you sure you want to delete this Issue "${selectedIssue?.title} (#${selectedIssue?.sequenceNumber})"?`}
          primaryButtonLabel={"Delete"}
          SecondaryButtonlabel={"Cancel"}
          callBackvalue={onDeleteIssue}
        />
      )}
      {/* {showImagePreviewPopup && (
        <PopupComponent
          open={showImagePreviewPopup}
          setShowPopUp={setShowImagePreviewPopup}
          modalTitle={"Preview"}
          // modalmessage={`Are you sure you want to delete this Issue "${selectedIssue?.type}(#${selectedIssue?._id})"?`}
          modalmessage={`Are you sure you want to delete this Issue "${selectedIssue?.title} (#${selectedIssue?._id})"?`}
          primaryButtonLabel={"Delete"}
          SecondaryButtonlabel={"Cancel"}
          callBackvalue={onDeleteIssue}
        />
      )} */}
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
    right: 5,
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
