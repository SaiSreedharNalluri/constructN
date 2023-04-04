import { styled } from "@mui/system";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Moment from "moment";

// import CustomLabel from '../../Common/custom-label/CustomLabel'
// import FormWrapper from '../../Common/form-wrapper/FormWrapper'
import {
  DATE_PICKER_DATA,
  FILE_UPLOAD_CONFIG,
  MORE_ABOUT_ISSUE,
  SEARCH_CONFIG,
  TAG_CONFIG,
  TASK_FORM_CONFIG,
  TYPES_OF_ISSUES,
} from "./Constants";
import FormWrapper from "../../form-wrapper/FormWrapper";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import {
  getTasksPriority,
  getTasksTypes,
  getTaskStatus,
} from "../../../../services/task";
import { getProjectUsers } from "../../../../services/project";
import UploadedImagesList from "../../uploaded-images-list/UploadedImagesList";

const BodyContainer = styled(Box)({
  paddingLeft: "20px",
  paddingRight: "20px",
  color: "#888888",
  overflowY: "auto",
  height: "calc(100% - 132px)",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  // overflow: 'scroll',
});

const FormElementContainer = styled(Box)({
  marginTop: "20px",
});

const FormElementContainerForLastChild = styled(FormElementContainer)({
  paddingBottom: "40px",
});

const DatePickersContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
});
const DatePickerContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const Body = ({
  handleFormData,
  editData,
  validate,
  setIsValidate,
  tagsList,
  setCanBeDisabled,
}: any) => {
  console.log(editData, "editData");
  const [formState, setFormState] = useState({ selectedValue: "" });
  const [formConfig, setFormConfig] = useState(TASK_FORM_CONFIG);
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskPriorities, setTaskPriorities] = useState([]);
  const [taskStatusList, setTaskStatusList] = useState([]);

  const [projectUsers, setProjectUsers] = useState([]);
  const [loggedInUserId, SetLoggedInUserId] = useState(null);
  const [formData, setFormData] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const tempFormData = formConfig.map((item: any) => {
      if (item.id === "tag-suggestions") {
        return {
          ...item,
          chipSuggestions: tagsList,
        };
      }
      return item;
    });
    setFormConfig(tempFormData);
  }, [tagsList]);

  useEffect(() => {
    if (router.isReady) {
      getTasksTypes(router.query.projectId as string).then((response: any) => {
        if (response.success === true) {
          // response.result.push('Please select the task type');
          setTaskTypes(response.result);
          console.log(taskTypes);
        }
      });
      getTasksPriority(router.query.projectId as string).then(
        (response: any) => {
          if (response.success === true) {
            // response.result.push('Please select the task priority');
            setTaskPriorities(response.result);
            console.log(taskPriorities);
          }
        }
      );
      getTaskStatus(router.query.projectId as string).then((response: any) => {
        if (response.success === true) {
          // response.result.push('Please select the task priority');
          setTaskStatusList(response.result);
          console.log(taskPriorities);
        }
      });
      getProjectUsers(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setProjectUsers(response.result);
            console.log(projectUsers);
          }
        })
        .catch();
    }
    const userObj: any = getCookie("user");
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?._id) {
      SetLoggedInUserId(user._id);
    }
  }, [router.isReady, router.query.projectId]);

  useEffect(() => {
    if (projectUsers.length && taskPriorities.length && taskTypes.length) {
      console.log(editData, "editdata", formConfig, "formconfig");
      if (editData) {
        setFormConfig((prev: any) => {
          let newFormConfig = prev.map((item: any) => {
            if (item.id === "title") {
              return {
                ...item,
                defaultValue: editData.title || "",
              };
            }
            if (item.id === "tasks") {
              console.log("ssdsditem", item);

              return {
                ...item,
                options: taskTypes?.map((eachItem: any) => {
                  return {
                    // ...eachItem,
                    label: eachItem,
                    value: eachItem,
                    selected: false,
                  };
                }),
                defaultValue: editData.type,
                isReadOnly: true,
              };
            }
            if (item.id === "description") {
              return {
                ...item,
                defaultValue: editData.description,
              };
            }
            if (item.id === "taskPriority") {
              return {
                ...item,
                options: taskPriorities?.map((eachItem: any) => {
                  return {
                    // ...eachItem,
                    label: eachItem,
                    value: eachItem,
                    selected: false,
                  };
                }),
                defaultValue: editData.priority,
              };
            }
            if (item.id === "assignedTo") {
              return {
                ...item,
                listOfEntries: projectUsers?.map((eachUser: any) => {
                  return {
                    ...eachUser,
                    label: eachUser?.user?.fullName,
                    value: eachUser?.user?._id,
                  };
                }),
                selectedName: editData.assignees?.length
                  ? editData.assignees
                  : undefined,
              };
            }
            if (item.id === "dates") {
              return {
                ...item,
                fields: item.fields.map((each: any) => {
                  if (each.id == "start-date") {
                    return {
                      ...each,
                      defaultValue: editData?.startDate ?? null,
                    };
                  } else {
                    return {
                      ...each,
                      defaultValue: editData?.dueDate ?? null,
                    };
                  }
                }),
              };
            }
            if (item.id === "tag-suggestions") {
              return {
                ...item,
                defaultValue: editData.tags,
                chipString: editData.tags,
              };
            }
            if (item.id === "file-upload") {
              return {
                ...item,
                selectedFile: editData.attachments,
              };
            }
            return item;
          });
          if (
            newFormConfig.findIndex((item: any) => item.id === "taskStatus") ==
            -1
          ) {
            newFormConfig.splice(2, 0, {
              id: "taskStatus",
              type: "select",
              defaultValue: editData?.status || "To Do",
              placeHolder: "Select task status",
              label: "Task Status",
              isLarge: false,
              isError: false,
              isReq: true,
              isflex: false,
              formLabel: "Select task status",
              options: taskStatusList.map((item: any) => {
                return {
                  ...item,
                  label: item,
                  value: item,
                  selected: item === editData?.status,
                };
              }),
            });
          }

          return newFormConfig;
        });
      } else {
        setFormConfig((prev: any) => {
          return prev.map((item: any) => {
            if (item.id === "tasks") {
              console.log("ssdsditem", item);
              return {
                ...item,
                options: taskTypes?.map((eachItem: any) => {
                  return {
                    // ...eachItem,
                    label: eachItem,
                    value: eachItem,
                    selected: false,
                  };
                }),
                defaultValue: item?.options[0]?.label || "Transmittals",
              };
            }
            if (item.id === "taskPriority") {
              const hasLowValue = item?.options.some(
                (cont: any) => cont.value === "Low"
              );
              console.log("hasLowValue", hasLowValue);
              return {
                ...item,
                options: taskPriorities?.map((eachItem: any) => {
                  return {
                    // ...eachItem,
                    label: eachItem,
                    value: eachItem,
                    selected: false,
                  };
                }),
                defaultValue: hasLowValue ? "Low" : item?.options[0]?.label,
              };
            }
            if (item.id === "assignedTo") {
              return {
                ...item,
                listOfEntries: projectUsers?.map((eachUser: any) => {
                  return {
                    ...eachUser,
                    label: eachUser?.user?.fullName,
                    value: eachUser?.user?._id,
                  };
                }),
              };
            }
            if (item.id === "dates") {
              return {
                ...item,
                fields: item.fields.map((each: any) => {
                  if (each.id == "start-date") {
                    return {
                      ...each,
                      defaultValue: Moment(new Date()).format("MM/DD/YYYY"),
                    };
                  } else {
                    return {
                      ...each,
                      defaultValue: Moment(new Date()).format("MM/DD/YYYY"),
                    };
                  }
                }),
              };
            }
            return item;
          });
        });
      }
    }
  }, [projectUsers, taskPriorities, taskTypes]);

  useEffect(() => {
    console.log(formConfig, "formconfig in effect");
    let updatedFormData = [
      ...formConfig,
      { owner: loggedInUserId },
      { projectId: router.query.projectId },
    ];
    setFormData(updatedFormData);
    handleFormData(updatedFormData);
    let count = 0;
    formConfig.forEach((item: any) => {
      if (item.isError) {
        count++;
      }
    });
    if (count === 0) {
      setCanBeDisabled(true);
    }
  }, [formConfig]);

  useEffect(() => {
    console.log("chii string", formConfig[6].chipString);
  }, [formConfig[6].chipString]);

  return (
    <BodyContainer>
      <FormElementContainer>
        <FormWrapper
          config={formConfig}
          setFormConfig={setFormConfig}
          formState={formState}
          setFormState={setFormState}
          setIsValidate={setIsValidate}
          validate={validate}
          setCanBeDisabled={setCanBeDisabled}
        />
        <UploadedImagesList formData={formData} />
      </FormElementContainer>
      {/* <Box sx={{ marginTop: '15px' }}>
        <CustomLabel label={'Select the Type of Task'} />
        <FormWrapper
          config={issueTypeConfig}
          setFormConfig={setIssueTypeConfig}
          formState={formState}
          setFormState={setFormState}
        />
      </Box>
      <FormElementContainer>
        <CustomLabel label={'Tell us more about this Task'} />
        <FormWrapper
          config={issueDescription}
          setFormConfig={setIssueDescription}
        />
      </FormElementContainer>
      <FormElementContainer>
        <CustomLabel label={'Select Task Priority'} />
        <FormWrapper
          config={issueTypeConfig}
          setFormConfig={setIssueTypeConfig}
          formState={formState}
          setFormState={setFormState}
        />
      </FormElementContainer>
      <FormElementContainer>
        <CustomLabel label={'Assigned To'} />
        <FormWrapper config={searchConfig} setFormConfig={setSearchConfig} />
      </FormElementContainer>
      <FormElementContainer>
        <DatePickersContainer>
          <DatePickerContainer>
            <CustomLabel label={'Start Date'} />
            <FormWrapper
              config={datePickerData}
              setFormConfig={setDatePickerData}
            />
          </DatePickerContainer>
          <div>
            <CustomLabel label={'Due Date'} />
            <FormWrapper
              config={datePickerData}
              setFormConfig={setDatePickerData}
            />
          </div>
        </DatePickersContainer>
      </FormElementContainer>
      <FormElementContainer>
        <CustomLabel label={'Enter Some Suggested Tags'} />
        <FormWrapper config={tagConfig} setFormConfig={setTagConfig} />
      </FormElementContainer>
      <FormElementContainerForLastChild>
        <FormWrapper config={fileConfig} setFormConfig={setFileConfig} />
      </FormElementContainerForLastChild> */}
    </BodyContainer>
  );
};

export default Body;
