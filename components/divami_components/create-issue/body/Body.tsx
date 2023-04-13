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
  ISSUE_FORM_CONFIG,
  TYPES_OF_ISSUES,
} from "./Constants";
import FormWrapper from "../../form-wrapper/FormWrapper";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { getProjectUsers } from "../../../../services/project";
import { getIssuesPriority, getIssuesTypes } from "../../../../services/issue";
import { IProjectUsers } from "../../../../models/IProjects";
import { ISnapshot } from "../../../../models/ISnapshot";
import { IStructure } from "../../../../models/IStructure";
import { IToolResponse } from "../../../../models/ITools";
import UploadedImagesList from "../../uploaded-images-list/UploadedImagesList";

import Moment from "moment";

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
  issueStatusList,
  setCanBeDisabled,
  deleteTheAttachment,
}: any) => {
  const [formState, setFormState] = useState({ selectedValue: "" });
  const [formConfig, setFormConfig] = useState(ISSUE_FORM_CONFIG);
  const [issueTypes, setIssueTypes] = useState([]);
  const [issuePriorities, setIssuePriorities] = useState([]);
  const [formData, setFormData] = useState<any>([]);
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[] | null>(null);
  const [loggedInUserId, SetLoggedInUserId] = useState("");
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
      getIssuesTypes(router.query.projectId as string).then((response: any) => {
        if (response.success === true) {
          // response.result.push("Please select the issue type");
          setIssueTypes(response.result);
        }
      });
      getIssuesPriority(router.query.projectId as string).then(
        (response: any) => {
          if (response.success === true) {
            // response.result.push("Please select the issue priority");
            setIssuePriorities(response.result);
          }
        }
      );
      getProjectUsers(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setProjectUsers(response.result);
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
    if (projectUsers?.length && issuePriorities?.length && issueTypes?.length) {
      if (editData) {
        setFormConfig((prev: any) => {
          let newFormConfig = prev.map((item: any) => {
            if (item.id === "title") {
              return {
                ...item,
                defaultValue: editData.title || "",
              };
            }
            if (item.id === "tag-suggestions") {
              return {
                ...item,
                tags: editData.tags,
                chipString: editData.tags,
              };
            }
            if (item.id === "issueType") {
              return {
                ...item,
                options: issueTypes?.map((eachItem: any) => {
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
            if (item.id === "issuePriority") {
              return {
                ...item,
                options: issuePriorities?.map((eachItem: any) => {
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
                      defaultValue: editData.startDate ?? null,
                    };
                  } else {
                    return {
                      ...each,
                      defaultValue: editData.dueDate ?? null,
                    };
                  }
                }),
              };
            }
            if (item.id === "tag-suggestions") {
              return {
                ...item,
                defaultValue: editData.tags,
              };
            }
            if (item.id === "file-upload") {
              return {
                ...item,
                // defaultValue: editData.attachments,
                selectedFile: editData.attachments,
              };
            }
            if (item.id === "tag-suggestions") {
              return {
                ...item,
                defaultValue: editData.chipString,
              };
            }
            return item;
          });
          if (
            newFormConfig.findIndex((item: any) => item.id === "issueStatus") ==
            -1
          ) {
            newFormConfig.splice(2, 0, {
              id: "issueStatus",
              type: "select",
              defaultValue: editData?.status || "To Do",
              placeHolder: "Select issue status",
              label: "Issue Status",
              isLarge: false,
              isError: false,
              isReq: true,
              isflex: false,
              formLabel: "Select issue status",
              options: issueStatusList.map((item: any) => {
                return {
                  ...item,
                  label: item,
                  value: item,
                  selected: item === editData?.status,
                };
              }),
            });
          }

          // newFormConfig = [...newFormConfig];
          return newFormConfig;
        });
      } else {
        setFormConfig((prev: any) => {
          return prev.map((item: any) => {
            if (item.id === "issueType") {
              return {
                ...item,

                options: issueTypes?.map((eachItem: any) => {
                  return {
                    label: eachItem,
                    value: eachItem,
                    selected: false,
                  };
                }),
                defaultValue: issueTypes?.length ? issueTypes[0] : "",
              };
            }
            if (item.id === "issuePriority") {
              const hasLowValue = issuePriorities.some(
                (cont: any) => cont === "Low"
              );
              let val: string = issuePriorities[0];
              if (hasLowValue) {
                val =
                  issuePriorities.find((cont: any) => cont === "Low") ||
                  issuePriorities[0];
              }

              return {
                ...item,
                options: issuePriorities?.map((eachItem: any) => {
                  return {
                    label: eachItem,
                    value: eachItem,
                    selected: false,
                  };
                }),
                defaultValue: val,
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
  }, [projectUsers, issuePriorities, issueTypes]);

  useEffect(() => {
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
    // if (count === 0) {
    //   setCanBeDisabled(true);
    // }
  }, [formConfig]);

  return (
    <BodyContainer>
      <FormElementContainer>
        <FormWrapper
          config={formConfig}
          setFormConfig={setFormConfig}
          formState={formState}
          setFormState={setFormState}
          validate={validate}
          setIsValidate={setIsValidate}
          setCanBeDisabled={setCanBeDisabled}
        />
        <UploadedImagesList
          formData={formData}
          deleteTheAttachment={deleteTheAttachment}
          formConfig={formConfig}
          setFormData={setFormData}
        />
      </FormElementContainer>
    </BodyContainer>
  );
};

export default Body;
