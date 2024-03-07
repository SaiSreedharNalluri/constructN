import { styled } from "@mui/system";
import { Box,Tooltip } from "@mui/material";
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
import FormWrapper from "../../../divami_components/form-wrapper/FormWrapper";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { getProjectUsers } from "../../../../services/project";
import { getIssuesPriority, getIssuesStatus, getIssuesTypes } from "../../../../services/issue";
import { IProjectUsers } from "../../../../models/IProjects";
import { ISnapshot } from "../../../../models/ISnapshot";
import { IStructure } from "../../../../models/IStructure";
import { IToolResponse } from "../../../../models/ITools";
import UploadedImagesList from "../../../divami_components/uploaded-images-list/UploadedImagesList";
import Moment from "moment";
import { setTheFormatedDate } from "../../../../utils/ViewerDataUtils";
import { CustomToast } from "../../../divami_components/custom-toaster/CustomToast";
import { useApiDataContext } from "../../../../state/projectConfig/projectConfigContext";
import userCount from "../../../../public/divami_icons/AddUserIcon.svg";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
  setCanBeDisabled,
  deleteTheAttachment,
  formData,
  setFormData
}: any) => {
  const { initialTypes,initialPriority,initialStatus,initialProjectUsersList,issueTagsList } = useApiDataContext();
  
  const [formState, setFormState] = useState({ selectedValue: "" });
  const [formConfig, setFormConfig] = useState(ISSUE_FORM_CONFIG);
  const [issueTypes, setIssueTypes] = useState(initialTypes);
  const [issuePriorities, setIssuePriorities] = useState(initialPriority);
  const [projectUsersList, setProjectUsers] = useState<IProjectUsers[]>(initialProjectUsersList);
  const [loggedInUserId, SetLoggedInUserId] = useState("");
  const [issueStatusLists, setIssueStatusList] = useState<[string]>(initialStatus);
  const [tagsList,setTagList] = useState([])
  const [newValue,newValues] = useState([])
  const router = useRouter();
  useEffect(()=>{
    const tempFormData = formConfig.map((item: any) => {
      if (item.id === "tag-suggestions") {
        return {
          ...item,
          chipString: newValue,
        };
      }
      return item;
    });
    setFormConfig(tempFormData);
  },[newValue])
  
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
      // getIssuesTypes(router.query.projectId as string).then((response: any) => {
      //   if (response.success === true) {
      //     setIssueTypes(response.result);
      //   }
      // });
      // getIssuesPriority(router.query.projectId as string).then(
      //   (response: any) => {
      //     if (response.success === true) {
      //       setIssuePriorities(response.result);
      //     }
      //   }
      // );
      // getIssuesStatus(router.query.projectId as string)
      // .then((response: any) => {
      //   if (response.success === true) {
      //     setIssueStatusList(response.result);
      //     console.log("status response",response.result);
          
      //   }
      // })
      // .catch((error: any) => {
      //   CustomToast("failed to load data", "error");
      // });
      // getProjectUsers(router.query.projectId as string)
      //   .then((response: any) => {
      //     if (response.success === true) {
      //       setProjectUsers(response.result);
      //     }
      //   })
      //   .catch();
    }
    const userObj: any = getCookie("user");
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?._id) {
      SetLoggedInUserId(user._id);
    }
    issueTagsList?.forEach((item:any)=>{
    setTagList(item?.tagList)
    })
  }, [router.isReady, router.query.projectId]);
  useEffect(() => {
    if (projectUsersList?.length && issuePriorities.length && issueTypes.length) {
      if (editData) {
        setFormConfig((prev: any) => {
          let newFormConfig = prev.map((item: any) => {
            if (item.id === "create_title") {
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
                listOfEntries: projectUsersList?.map((eachUser: any) => {
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
                  if (each.id == "start-date" && editData) {
                    return {
                      ...each,
                      formLabel:<div>
                      Start Date
                      <Tooltip title='Expected / Actual start date of the issue'>
                      <InfoOutlinedIcon className="ml-2 text-sm"></InfoOutlinedIcon>
                      </Tooltip>
                    </div>,
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
              options: issueStatusLists?.map((item: any) => {
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
                defaultValue: item?.options[0]?.label || "Safety",
              };
            }
            if (item.id === "issuePriority") {
              const hasLowValue = item?.options.some(
                (cont: any) => cont.value === "Low"
              );

              return {
                ...item,
                options: issuePriorities?.map((eachItem: any) => {
                  return {
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
                listOfEntries: projectUsersList?.map((eachUser: any) => {
                  return {
                    ...eachUser,
                    label: eachUser?.user?.fullName,
                    value: eachUser?.user?._id,
                  };
                }),
              };
            }
            if (item.id === "dates" && editData === undefined) {
              return {
                ...item,
                fields: item.fields.map((each: any) => {
                  if (each.id == "start-date" && editData === undefined) {
                    return {
                      ...each,
                      formLabel:<div>
                        Expected Start Date
                        <Tooltip title='Expected start date for the assigned user on this issue'>
                        <InfoOutlinedIcon className="ml-2 text-sm"></InfoOutlinedIcon>
                        </Tooltip>
                      </div>,
                      defaultValue: setTheFormatedDate(new Date()),
                    };
                  } else if(each.id == "due-date" && editData === undefined) {
                    return {
                      ...each,
                      formLabel:<div>
                        Due Date
                      </div>,
                      defaultValue: setTheFormatedDate(new Date()),
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
  }, [projectUsersList, issuePriorities, issueTypes]);

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
          newValues={newValues}
        />
        <UploadedImagesList
          formData={formData}
          deleteTheAttachment={deleteTheAttachment}
          formConfig={formConfig}
          setFormData={setFormData}
          setFormConfig={setFormConfig}
        />
        <div className="my-[10px]">*Mandatory fields</div>
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
