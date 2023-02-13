import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";

import { Select } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Image from "next/image";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
import Clip from "../../../public/divami_icons/clip.svg";
import Edit from "../../../public/divami_icons/edit.svg";
import Delete from "../../../public/divami_icons/delete.svg";
import Send from "../../../public/divami_icons/send.svg";
import { red } from "@mui/material/colors";
import CustomSelect from "../custom-select/CustomSelect";
import ActivityLog from "../task_detail/ActivityLog";
import Moment from "moment";
import CustomButton from "../../divami_components/custom-button/CustomButton";

// import SelectVariants from "../select-dropdown";
// import BasicSelect from "../temporary-select/TempSelect";
// import SelectVariants2 from "../temporary-select/TemSelect";

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
  overflow: scroll;
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
  bottom: 20px;
  background: white;
  width: 90%;
`;

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
  const { taskState, formHandler } = props;
  const [value, setValue] = React.useState(0);
  const [issueTypeConfig, setIssueTypeConfig] = useState("");
  const [formState, setFormState] = useState({ selectedValue: "" });
  const [progressEditState, setProgressEditState] = useState(false);
  const [assigneeEditState, setAssigneeEditState] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEditProgress = () => {
    console.log("EDIT trigger");
    setProgressEditState(!progressEditState);
  };

  const optionsConfig = {
    options: [
      {
        label: "In Progress",
        value: "inProgress",
        selected: false,
      },
      {
        label: "Blocked",
        value: "blocked",
        selected: false,
      },
      {
        label: "To-do",
        value: "todo",
        selected: false,
      },
      {
        label: "Completed",
        value: "completed",
        selected: false,
      },
    ],
  };

  const optionsConfigAssignees = {
    options: [
      {
        label: "In",
        value: "inProgress",
        selected: false,
      },
      {
        label: "Bcked",
        value: "blocked",
        selected: false,
      },
      {
        label: "To",
        value: "todo",
        selected: false,
      },
      {
        label: "Comp",
        value: "completed",
        selected: false,
      },
    ],
  };

  console.log(taskState?.TabOne.attachments, "IMPORTANT");

  const handleStateChange = () => {
    console.log("Update trigger");
    if (progressEditState) {
      setProgressEditState(!progressEditState);
    }
    if (assigneeEditState) {
      setAssigneeEditState(!assigneeEditState);
    }
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
            style={{ marginRight: "40px", paddingLeft: "0px" }}
          />
          <Tab label="Activity log" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TabOneDiv>
          <FirstHeaderDiv>
            <Image src={""} alt="" />
          </FirstHeaderDiv>
          <SecondBodyDiv>
            <SecondContPrior>
              <PriorityTitle>Priority</PriorityTitle>
              <PriorityStatus>{taskState.TabOne.priority}</PriorityStatus>
            </SecondContPrior>

            <SecondContCapt>
              <CaptureTitle>Captured on</CaptureTitle>
              <CaptureStatus>
                {" "}
                {Moment(taskState.TabOne.capturedOn).format("DD MMM YY")}
              </CaptureStatus>
            </SecondContCapt>
          </SecondBodyDiv>

          {progressEditState ? (
            <ProgressStateTrue>
              <ThirdContLeft>
                <ThirdContWatch>Watcher</ThirdContWatch>
                <ThirdContWatchName>
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
                  <FourthContProgType>
                    {taskState.TabOne.creator}{" "}
                    <PenIconImage src={Edit} alt={"close icon"} />
                  </FourthContProgType>
                </FourthContLeft>
              </FourthBodyDiv>
            </ProgressStateTrue>
          ) : (
            <ProgressStateFalse>
              <ThirdContLeft>
                <ThirdContWatch>Watcher</ThirdContWatch>
                <ThirdContWatchName>
                  {" "}
                  {taskState.TabOne.creator}
                </ThirdContWatchName>
              </ThirdContLeft>
              <ThirdContRight>
                <ThirdContProg>Progress</ThirdContProg>

                <ThirdContProgType>
                  {/* {DetailsObj?.TabOne[0]?.status[0]?.progress}{" "} */}
                  <div>In-Progress</div>
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
                config={optionsConfig}
                defaultValue={optionsConfig.options[0].value}
                id={""}
                sx={{ minWidth: 120 }}
                setFormConfig={""}
                isError={""}
                label=""
              />
            </ProgressCustomSelect>
          ) : (
            <>
              <FourthBodyDiv assigneeEditState={assigneeEditState}>
                <FourthContLeft>
                  <FourthContAssigned>Assigned to</FourthContAssigned>

                  <FourthContProgType>
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
            <>
              <AssigneeCustomSelect>
                <CustomSelect
                  config={optionsConfigAssignees}
                  defaultValue={optionsConfigAssignees.options[0].value}
                  id={""}
                  sx={{ minWidth: 120 }}
                  setFormConfig={""}
                  isError={""}
                  label=""
                />
              </AssigneeCustomSelect>
            </>
          )}

          <FormElementContainer>
            <CustomSelectContainer>
              {/* <SelectVariants options={DetailsObj.TabOne[0].options} /> */}
              {/* <BasicSelect options={DetailsObj.TabOne[0].options} /> */}
            </CustomSelectContainer>
          </FormElementContainer>

          <DescriptionDiv>
            <DescriptionTitle>RFI Question</DescriptionTitle>

            <DescriptionPara>{taskState.TabOne.description}</DescriptionPara>
          </DescriptionDiv>

          {taskState?.TabOne?.attachments?.length > 0 && (
            <>
              <AttachmentDiv>
                <AttachmentTitle>Attachments</AttachmentTitle>
                <AttachmentDescription>
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
  const { onClose, task, taskList } = props;

  console.log(taskList, "TASKLIST");
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
    // [
    //   {
    //     status: "Scan Updated",
    //     timeStamp: "15 Nov 22",
    //     profile: "Jake",
    //     comment: "sefsefsfsefsef",
    //     imageDetails: "",
    //     currentProgress: "30%",
    //   },
    //   {
    //     status: "Scan Updated",
    //     timeStamp: "15 Nov 22",
    //     profile: "Jake",
    //     comment: "",
    //     imageDetails: "",
    //     currentProgress: "60%",
    //   },
    //   {
    //     status: "Scan Updated",
    //     timeStamp: "15 Nov 22",
    //     profile: "Jake",
    //     comment: "",
    //     imageDetails: "efefsef",
    //     issueType: "",
    //     issueDescription: "",
    //     currentProgress: "45%",
    //   },
    // ],
  };

  // {
  //   "_id": "TSK441013",
  //   "title": "13_Floor_A3_Block_2023-02-22",
  //   "description": "Testing",
  //   "type": "Submittals",
  //   "status": "To Do",
  //   "priority": "High",
  //   "assignees": [
  //     {
  //       "_id": "USR141774",
  //       "firstName": "chaitanya",
  //       "lastName": "nk",
  //       "email": "chaitanya@constructn.ai",
  //       "fullName": "chaitanya nk"
  //     },
  //     {
  //       "_id": "USR370060",
  //       "firstName": "swathi",
  //       "lastName": "divami",
  //       "email": "swathi@divami.com",
  //       "fullName": "swathi divami"
  //     }
  //   ],
  //   "owner": "USR141774",
  //   "project": "PRJ201897",
  //   "structure": "STR147148",
  //   "snapshot": "SNP423738",
  //   "context": {
  //     "type": "Task",
  //     "camera": {
  //       "cameraPosition": {
  //         "x": 385386.30109044677,
  //         "y": 2049811.3252802067,
  //         "z": 136.70305645457873
  //       },
  //       "cameraTarget": {
  //         "x": 385386.3010910859,
  //         "y": 2049811.325279438,
  //         "z": 136.7030564753868
  //       },
  //       "pitch": 0.020809564434256474,
  //       "yaw": 3.83516197406291,
  //       "fov": 95
  //     },
  //     "tag": {
  //       "position": {
  //         "x": 962.8882860832214,
  //         "y": -60.782279617597965,
  //         "z": -273.1627955327798
  //       }
  //     },
  //     "image": {
  //       "position": [
  //         2.763091085886117,
  //         -9.664720562053844,
  //         0.703056475386802
  //       ]
  //     }
  //   },
  //   "progress": -1,
  //   "tags": [
  //     ""
  //   ],
  //   "createdAt": "2023-02-05T05:04:01.012Z",
  //   "updatedAt": "2023-02-10T07:31:19.167Z",
  //   "dueDate": "2023-02-12T00:00:00.000Z",
  //   "attachments": []
  // }

  const [taskState, setTaskState] = useState<any>(DetailsObj);

  console.log(task.assignees[0].fullName, "Task IMPORTANT");

  // useEffect(() => {
  //   let temp = taskState.map((each: any) => {
  //     console.log(each, "EACH");
  //   });
  // }, []);

  useEffect(() => {
    console.log(task, taskList, "Task IMPORTANT");
    // task.forEach((each: any) => {
    //   console.log(each, "Task IMPORTANTTWO");
    // });
    let tempObj = {
      options: task.options,
      priority: task.priority,
      capturedOn: task.createdAt,
      creator: task.owner,
      issueDescription: task.description,
      attachments: task.attachments,
      relatedTags: task.tags,
      assignees: task.assignees[0].fullName,
      id: task._id,
    };
    console.log(tempObj, "TEMP OBJ");
    setTaskState((prev: any) => {
      return {
        ...prev,
        TabOne: tempObj,
      };
    });
    console.log(taskState, "IMPORTANT TEMP");
  }, []);

  return (
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
            <EditIcon src={Edit} alt={"close icon"} />
            <DeleteIcon src={Delete} alt={"close icon"} />
          </RightTitleCont>
        </TitleContainer>
      </HeaderContainer>
      <BodyContainer>
        <BasicTabs taskState={taskState} />
      </BodyContainer>
    </CustomTaskDrawerContainer>
  );
};

export default CustomTaskDetailsDrawer;
