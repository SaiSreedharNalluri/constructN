import { styled } from "@mui/system";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
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
import { getTasksPriority, getTasksTypes } from "../../../../services/task";
import { getProjectUsers } from "../../../../services/project";

const BodyContainer = styled(Box)({
  // height: 'calc(100vh - 134px)',
  paddingLeft: "20px",
  paddingRight: "20px",
  // overflow: 'scroll',
});

const FormElementContainer = styled(Box)({
  marginTop: "30px",
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

const Body = ({ handleFormData }: any) => {
  const [formState, setFormState] = useState({ selectedValue: "" });
  const [formConfig, setFormConfig] = useState(TASK_FORM_CONFIG);
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskPriorities, setTaskPriorities] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [loggedInUserId, SetLoggedInUserId] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      getTasksTypes(router.query.projectId as string).then((response: any) => {
        if (response.success === true) {
          response.result.push("Please select the task type");
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
      setFormConfig((prev: any) => {
        return prev.map((item: any) => {
          if (item.id === "tasks") {
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
          return item;
        });
      });
    }
  }, [projectUsers, taskPriorities, taskTypes]);
  useEffect(() => {
    handleFormData([
      ...formConfig,
      { owner: loggedInUserId },
      { projectId: router.query.projectId },
    ]);
  }, [formConfig]);
  return (
    <BodyContainer>
      <FormElementContainer>
        <FormWrapper
          config={formConfig}
          setFormConfig={setFormConfig}
          formState={formState}
          setFormState={setFormState}
        />
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
