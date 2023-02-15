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
import { updateAttachments, updateTask } from "../../../services/task";
import CustomButton from "../../divami_components/custom-button/CustomButton";
import PopupComponent from "../../popupComponent/PopupComponent";
import { TASK_FORM_CONFIG } from "../create-task/body/Constants";
import CreateTask from "../create-task/CreateTask";
import CustomDrawer from "../custom-drawer/custom-drawer";
import CustomSelect from "../custom-select/CustomSelect";
import ActivityLog from "../task_detail/ActivityLog";

const HeaderContainer = styled(Box)`
  background-color: white;
  height: 51px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
`;

const TitleContainer = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`;

const CloseIcon = styled(Image)`
  cursor: pointer;
`;
const ArrowIcon = styled(Image)`
  cursor: pointer;
  //   margin-right: 10px;
`;

const EditIcon = styled(Image)`
  cursor: pointer;
  margin-right: 20px;
`;

const DeleteIcon = styled(Image)`
  cursor: pointer;
  //   margin-right: 10px;
`;

const LeftTitleCont = styled("div")`
  display: flex;
  //   margin-top: 10px;
`;

const RightTitleCont = styled("div")`
  display: flex;

  //   margin-top: 10px;
`;

const SpanTile = styled("span")`
  //   color: #787878;

  margin-left: 10px;
`;
const BodyContainer = styled(Box)`
  height: calc(100vh - 134px);
  //   border: 2px solid black;
  // overflow: scroll;
`;
const CustomTabPanel = styled(TabPanel)`
  padding: none;
`;
const TabOneDiv = styled("div")`
  //   border: 2px solid pink;
  //   padding:30px;
`;

const FirstHeaderDiv = styled("div")`
  border: 1px solid #d9d9d9;
  display: flex;
  height: 150px;
  border-radius: 4px;
`;

const SecondBodyDiv = styled("div")`
  display: flex;
  margin-top: 25px;
`;

const PriorityTitle = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

const PriorityStatus = styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const SecondContPrior = styled("div")`
  width: 186px;
`;

const SecondContCapt = styled("div")`
  width: 186px;
`;

const CaptureTitle = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

const CaptureStatus = styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const ThirdContWatch = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

const ThirdContWatchName = styled("div")``;

const ThirdContProg = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

const ThirdContProgType = styled("div")`
  display: flex;
  align-items: center;
`;

const ThirdBodyDiv = styled("div")`
  display: flex;
  margin-top: 25px;
`;

const ThirdContLeft = styled("div")`
  margin-right: 100px;
`;

const ThirdContRight = styled("div")`
  flex: 1;
`;

const PenIconImage = styled(Image)`
  cursor: pointer;
  margin-left: 9px;
`;
const FourthBodyDiv = styled("div")((props: any) => ({
  display: props.assigneeEditState ? "none" : "flex",
  marginTop: "25px",
})) as any;

const FourthContLeft = styled("div")``;

const FourthContAssigned = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

const FourthContProgType = styled("div")`
  display: flex;
`;

const FormElementContainer = styled(Box)`
  margin-top: 30px;
`;

const DescriptionDiv = styled("div")`
  margin-top: 30px;
`;

const DescriptionTitle = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

const DescriptionPara = styled("div")``;

const AttachmentDiv = styled("div")`
  margin-top: 30px;
`;

const AttachmentTitle = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

const AttachmentDescription = styled("div")`
  margin-top: 10px;
  margin-bottom: 15px;
`;

const AttachedImageDiv = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AttachedImageTitle = styled("div")``;

const AttachedImageIcon = styled("div")``;

const AttachHorizontal = styled("div")`
  border-bottom: 1px solid #d9d9d9;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const RelatedDiv = styled("div")`
  margin: 25px 0px;
`;

const RelatedTagTitle = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

const RelatedTagsButton = styled("div")`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const RelatedSingleButton = styled("div")`
  border: 1px solid black;
  padding: 8px 22px;
  border-radius: 40px;
  height: 32px;
  white-space: nowrap;
  font-size: 12px;
  margin-right: 10px;
`;

const StyledLabel = styled(Typography)`
  font-weight: 400;
  line-height: 20px;
  font-size: 14px;
  margin-bottom: 8px;
`;

const CustomTaskDrawerContainer = styled("div")`
  width: 438px;
`;

const ProgressEditStateButtonsContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  bottom: 0;
  position: absolute;
  // bottom: 20px;
  bottom: -75px;

  background: white;
  width: 90%;
`;

const AssignEditSearchContainer = styled("div")({
  height: "40px",
  marginTop: "20px",
  "& .MuiAutocomplete-root": {
    height: "100%",
    width: "100%",
  },
  "& .MuiFormControl-root.MuiFormControl-fullWidth.MuiTextField-root.css-wb57ya-MuiFormControl-root-MuiTextField-root":
    {
      height: "100%",
      width: "100%",
    },
  "& .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-fullWidth.MuiInputBase-formControl.MuiInputBase-adornedEnd.MuiAutocomplete-inputRoot.css-154xyx0-MuiInputBase-root-MuiOutlinedInput-root":
    {
      height: "100%",
      width: "100%",
    },
  "& .MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input": {
    marginTop: "-8px",
  },
  "& .MuiAutocomplete-root fieldset": {
    borderColor: "#36415D !important",
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomSelectContainer = styled("div")`
  width: 398px;
`;

const StyledSelect = styled(Select)`
  width: 100%;
  height: 40px;
  outline: 0px;
  border: 1px solid #36415d;
  border-radius: 4px;
  & .MuiOutlinedInput-notchedOutline {
    border: 0;
    offset: 0;
  }
`;

const AddCommentContainer = styled("div")({
  borderTop: "1px solid #D9D9D9",
  height: "50px",
  display: "flex",
  position: "absolute",
  bottom: "0",
  background: "white",
  marginLeft: "-24px",
  width: "100%",
});

const AddCommentInput = styled("input")({
  width: "100%",
  paddingLeft: "10px",
});

const AddCommentButtonContainer = styled("div")({
  display: "flex",
});

const AttachButton = styled("button")({
  width: "48px",
  display: "flex",
  justifyContent: "center",
  height: "60%",
  borderRight: "1px solid #D9D9D9",
  marginTop: "auto",
  marginBottom: "auto",
});

const SendButton = styled("button")({
  width: "48px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const ProgressStateFalse = styled("div")({
  display: "flex",
  marginTop: "20px",
});

const ProgressStateTrue = styled("div")({
  display: "flex",
  marginTop: "20px",
});

const ProgressCustomSelect = styled("div")({
  marginTop: "20px",
});

const AssigneeCustomSelect = styled("div")({
  marginTop: "20px",
});

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
    taskUpdate,
  } = props;

  const [value, setValue] = React.useState(0);
  const [issueTypeConfig, setIssueTypeConfig] = useState("");
  const [formState, setFormState] = useState({
    selectedValue: "",
    selectedProgress: null,
    selectedUser: null,
  });
  const [progressEditState, setProgressEditState] = useState(false);
  const [assigneeEditState, setAssigneeEditState] = useState(false);
  const [progressOptionsState, setProgressOptionsState] = useState<any>([{}]);
  const [assigneeOptionsState, setAssigneeOptionsState] = useState([]);
  const [formConfig, setFormConfig] = useState(TASK_FORM_CONFIG);
  const [searchTerm, setSearchTerm] = useState("");
  const [list, setList] = useState<any>();

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
        label: each.user.fullName,
      };
    });
    setAssigneeOptionsState(tempUsers);
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEditProgress = () => {
    setProgressEditState(!progressEditState);
  };

  const handleStateChange = () => {
    if (progressEditState) {
      setProgressEditState(!progressEditState);
    }
    if (assigneeEditState) {
      setAssigneeEditState(!assigneeEditState);
    }
    taskUpdate({
      ...formState,
      selectedProgress: progressOptionsState[0].defaultValue,
    });
  };

  const handleEditAssigne = () => {
    setAssigneeEditState(!assigneeEditState);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "#D9D9D9", color: "black" }}>
        <Tabs
          TabIndicatorProps={{ style: { background: "orange", height: "3px" } }}
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
            "& .MuiTab-root .css-19kzrtu": {
              padding: "0px",
            },
            "& .css-19kzrtu": {
              padding: "0p !important",
              background: "red",
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
              color: "#101F4B",
            }}
          />
          <Tab label="Activity log" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TabOneDiv>
          <FirstHeaderDiv>
            <Image
              src={
                taskState.TabOne.attachments
                  ? taskState.TabOne.attachments[0]?.url
                  : ""
              }
              alt=""
              width={400}
              height={400}
            />
          </FirstHeaderDiv>
          <SecondBodyDiv>
            <SecondContPrior>
              <PriorityTitle>Priority</PriorityTitle>
              <PriorityStatus style={{ color: "#101F4B" }}>
                {taskState.TabOne.priority}
              </PriorityStatus>
            </SecondContPrior>

            <SecondContCapt>
              <CaptureTitle>Captured on</CaptureTitle>
              <CaptureStatus style={{ color: "#101F4B" }}>
                {" "}
                {Moment(taskState.TabOne.capturedOn).format("DD MMM YY")}
              </CaptureStatus>
            </SecondContCapt>
          </SecondBodyDiv>

          {progressEditState ? (
            <ProgressStateTrue>
              <ThirdContLeft>
                <ThirdContWatch>Watcher</ThirdContWatch>
                <ThirdContWatchName style={{ color: "#101F4B" }}>
                  {" "}
                  {taskState.TabOne.creator}
                </ThirdContWatchName>
              </ThirdContLeft>
              <FourthBodyDiv
                assigneeEditState={assigneeEditState}
                style={{ marginTop: "0px" }}
              >
                <FourthContLeft>
                  <FourthContAssigned>Assigned to</FourthContAssigned>
                  <FourthContProgType style={{ color: "#101F4B" }}>
                    {taskState.TabOne.assignees}{" "}
                    <PenIconImage
                      onClick={() => {
                        handleEditAssigne();
                      }}
                      src={Edit}
                      alt={"close icon"}
                    />
                  </FourthContProgType>
                </FourthContLeft>
              </FourthBodyDiv>
            </ProgressStateTrue>
          ) : (
            <ProgressStateFalse>
              <ThirdContLeft>
                <ThirdContWatch>Watcher</ThirdContWatch>
                <ThirdContWatchName style={{ color: "#101F4B" }}>
                  {" "}
                  {taskState.TabOne.creator}
                </ThirdContWatchName>
              </ThirdContLeft>
              <ThirdContRight>
                <ThirdContProg>Progress</ThirdContProg>

                <ThirdContProgType style={{ color: "#101F4B" }}>
                  {taskState.TabOne.status}

                  <PenIconImage
                    onClick={() => {
                      handleEditProgress();
                    }}
                    src={Edit}
                    alt={"close icon"}
                  />
                </ThirdContProgType>
              </ThirdContRight>
            </ProgressStateFalse>
          )}
          {progressEditState ? (
            <ProgressCustomSelect>
              <CustomSelect
                onChange={(event: any, value: any) => console.log(value)}
                config={progressOptionsState[0]}
                // defaultValue={progressOptionsState?.options[0].value}
                id={"taskPriority"}
                sx={{ minWidth: 120 }}
                setFormConfig={setProgressOptionsState}
                isError={""}
                label=""
              />
            </ProgressCustomSelect>
          ) : (
            <>
              <FourthBodyDiv assigneeEditState={assigneeEditState}>
                <FourthContLeft>
                  <FourthContAssigned>Assigned to</FourthContAssigned>

                  <FourthContProgType style={{ color: "#101F4B" }}>
                    {taskState?.TabOne.assignees}{" "}
                    <PenIconImage
                      onClick={() => {
                        handleEditAssigne();
                      }}
                      src={Edit}
                      alt={"close icon"}
                    />
                  </FourthContProgType>
                </FourthContLeft>
              </FourthBodyDiv>
            </>
          )}
          {assigneeEditState && (
            <AssignEditSearchContainer>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={assigneeOptionsState}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="" />}
                onChange={(event, value) => {
                  console.log(value);
                  setFormState({ ...formState, selectedUser: value });
                }}
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

          <FormElementContainer>
            <CustomSelectContainer>
              {/* <SelectVariants options={DetailsObj.TabOne[0].options} /> */}
              {/* <BasicSelect options={DetailsObj.TabOne[0].options} /> */}
            </CustomSelectContainer>
          </FormElementContainer>

          <DescriptionDiv>
            <DescriptionTitle>RFI Question</DescriptionTitle>

            <DescriptionPara style={{ color: "#101F4B" }}>
              {taskState.TabOne.issueDescription}
            </DescriptionPara>
          </DescriptionDiv>

          {taskState?.TabOne?.attachments?.length > 0 && (
            <>
              <AttachmentDiv>
                <AttachmentTitle>Attachments</AttachmentTitle>
                <AttachmentDescription style={{ color: "#101F4B" }}>
                  {taskState?.TabOne.attachments?.map(
                    (a: any, index: number) => {
                      return (
                        <>
                          <AttachedImageDiv>
                            <AttachedImageTitle>{a?.name}</AttachedImageTitle>
                            <AttachedImageIcon>
                              <Image src={""} alt="" />
                            </AttachedImageIcon>
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
              {taskState?.relatedTags?.map((item: any) => {
                return (
                  <>
                    <RelatedSingleButton>{item?.tagName}</RelatedSingleButton>
                  </>
                );
              })}
            </RelatedTagsButton>
          </RelatedDiv>
          {progressEditState || assigneeEditState ? (
            <>
              <ProgressEditStateButtonsContainer>
                <CustomButton
                  type="outlined"
                  label="Cancel"
                  formHandler={formHandler}
                />
                <CustomButton
                  type="contained"
                  label="Update"
                  formHandler={() => {
                    handleStateChange();
                  }}
                />
              </ProgressEditStateButtonsContainer>
            </>
          ) : (
            <>
              <AddCommentContainer>
                <AddCommentInput placeholder="Add Comment"></AddCommentInput>
                <AddCommentButtonContainer>
                  <AttachButton>
                    <Image src={Clip} alt="" />{" "}
                  </AttachButton>
                  <SendButton>
                    <Image src={Send} alt="" />{" "}
                  </SendButton>
                </AddCommentButtonContainer>
              </AddCommentContainer>
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
  } = props;
  const [openCreateTask, setOpenCreateTask] = useState(false);

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
      options: task.options,
      priority: task.priority,
      capturedOn: task.createdAt,
      creator: task.owner,
      issueDescription: task.description,
      attachments: task.attachments,
      relatedTags: task.tags,
      assignees: task.assignees?.length ? task.assignees[0].fullName : "",
      id: task._id,
      status: task.status,
    };
    setTaskState((prev: any) => {
      return {
        ...prev,
        TabOne: tempObj,
      };
    });
  }, []);

  const onDeleteTask = () => {
    setshowPopUp(false);
    deleteTheTask(task);
  };

  const handleCreateTask = (formData: any) => {
    console.log(formData, "form data at home");
    clickTaskSubmit(formData);
  };
  const clickTaskSubmit = (formData: any) => {
    let data: any = {};
    let userIdList: any[] = [];
    const assignes = formData.filter((item: any) => item.id == "assignedTo")[0]
      ?.selectedName;
    if (assignes && assignes.length > 0) {
      assignes.map((user: any) => {
        userIdList?.push(user.value);
      });
    }
    if (assignes?.value) {
      userIdList.push(assignes.value);
    }
    data.structure = currentStructure?._id;
    data.snapshot = currentSnapshot?._id;
    data.status = "To Do";
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
    data.attachments = formData.filter(
      (item: any) => item.id === "file-upload"
    )[0]?.selectedFile;
    console.log("dfsdfsdokkkk", fileformdata, filesArr);
    // const uploadUrl = filesArr[0];
    // const obj = {
    //   file: [uploadUrl],
    // };
    // const uploadUrl = URL.createObjectURL(filesArr[0]);
    if (filesArr?.length) {
      const arr = filesArr.map((each: any) => {
        // fileformdata.append("file", each.name);
        fileformdata.append("file", each);
        return {
          ...each,
        };
      });
      console.log("formData", fileformdata);

      updateAttachments(fileformdata, task._id)
        .then((response) => {
          if (response.success === true) {
            toast.success("Task added sucessfully");
            // handleTaskSubmit(formData);
            // taskSubmit(response.result);
            // toolInstance.toolAction = "taskCreateSuccess";

            // console.log(formData);
          } else {
            // toolInstance.toolAction = "taskCreateFail";
            // issueToolClicked(toolInstance);
          }
        })
        .catch((error) => {
          // toolInstance.toolAction = "taskCreateFail";

          if (error.success === false) {
            toast.error(error?.message);
          }
        });
    }
    if (data.title && data.type && data.priority) {
      updateTask(projectId as string, data, task._id)
        .then((response) => {
          if (response.success === true) {
            toast.success("Task added sucessfully");
            // handleTaskSubmit(formData);
            // taskSubmit(response.result);
            // toolInstance.toolAction = "taskCreateSuccess";

            // console.log(formData);
          } else {
            // toolInstance.toolAction = "taskCreateFail";
            // issueToolClicked(toolInstance);
          }
          setOpenCreateTask(false);
        })
        .catch((error) => {
          // toolInstance.toolAction = "taskCreateFail";

          if (error.success === false) {
            toast.error(error?.message);
          }
          setOpenCreateTask(false);
        });
    }
  };
  const taskUpdate = (data: any) => {
    console.log(task);
    const issueData = _.cloneDeep(task);
    data.selectedUser?.user
      ? (issueData.assignees = [data.selectedUser.user])
      : null;
    data.selectedProgress ? (issueData.priority = data.selectedProgress) : null;
    const projectId = router.query.projectId;
    updateTask(projectId as string, issueData, task._id)
      .then((response) => {
        if (response.success === true) {
          toast.success("Issue updated sucessfully");
        } else {
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
              />
              <SpanTile>
                {task.type} (#{task._id})
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
        <BodyContainer>
          <BasicTabs
            taskType={taskType}
            taskPriority={taskPriority}
            taskStatus={taskStatus}
            projectUsers={projectUsers}
            taskState={taskState}
          />
        </BodyContainer>
      </CustomTaskDrawerContainer>
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Delete Task"}
          modalmessage={`Are you sure you want to delete this Task "${task.type}(#${task._id})"?`}
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
            editData={task}
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
