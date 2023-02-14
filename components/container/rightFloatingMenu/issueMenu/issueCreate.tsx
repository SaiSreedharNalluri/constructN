import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import {
  createIssue,
  getIssuesPriority,
  getIssuesTypes,
} from "../../../../services/issue";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getProjectUsers } from "../../../../services/project";
import { IProjectUsers } from "../../../../models/IProjects";
import { toast } from "react-toastify";
import { ISnapshot } from "../../../../models/ISnapshot";
import { IStructure } from "../../../../models/IStructure";
import { getCookie } from "cookies-next";
import { IToolResponse, ITools } from "../../../../models/ITools";
import ReactSelect from "react-select";
import { getTagsList } from "../../../../services/tags";
import { CustomToaster } from "../../../divami_components/custom-toaster/CustomToaster";
interface IProps {
  issueToolClicked: (a: ITools) => void;
  closeOverlay: () => void;
  visibility: boolean;
  handleIssueSubmit: (formData: object) => void;
  currentStructure: IStructure;
  currentSnapshot: ISnapshot;
  currentProject: string;
  contextInfo: IToolResponse;
}

const IssueCreate: React.FC<IProps> = ({
  issueToolClicked,
  closeOverlay,
  visibility,
  handleIssueSubmit,
  currentProject,
  currentSnapshot,
  currentStructure,
  contextInfo,
}) => {
  const router = useRouter();
  const [myVisbility, setMyVisibility] = useState(visibility);
  const [myContext, setMyContext] = useState<IToolResponse>(contextInfo);
  const [issueType, setIssueType] = useState<[string]>();
  const [issuePriority, setIssuePriority] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [myProject, setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  const [loggedInUserId, SetLoggedInUserId] = useState("");
  const [tagList, setTagList] = useState<[string]>([""]);
  let toolInstance: ITools = { toolName: "issue", toolAction: "issueCreate" };
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (router.isReady) {
      getIssuesTypes(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setIssueType(response.result);
        }
      });
      getIssuesPriority(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setIssuePriority(response.result);
        }
      });
      getProjectUsers(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setProjectUsers(response.result);
          }
        })
        .catch();
      getTagsList(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setTagList(response.result[0]?.tagList);
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
    setMyProject(currentProject);
    setMyStructure(currentStructure);
    setMySnapshot(currentSnapshot);
    setMyVisibility(visibility);
    setMyContext(contextInfo);
  }, [
    contextInfo,
    currentProject,
    currentSnapshot,
    currentStructure,
    router.isReady,
    router.query.projectId,
    visibility,
  ]);

  const closeIssueCreate = () => {
    toolInstance.toolAction = "issueCreateFail";
    issueToolClicked(toolInstance);
    closeOverlay();
  };
  interface FormValues {
    type: string;
    priority: string;
    description: string;
    assignees: object[];
    tags: object[];
    dueDate: string;
    structure: string;
    context: IToolResponse;
    title: string;
    snapshot: string;
    owner: string;
    status: string;
    file: object[];
  }
  const clickIssueSubmit = (
    formData: FormValues,
    { resetForm }: { resetForm: (nextValues?: Partial<FormValues>) => void }
  ) => {
    let userIdList: any[] = [];
    if (formData.assignees.length > 0) {
      formData.assignees.map((user: any) => {
        userIdList.push(user.value);
      });
      formData.assignees = userIdList;
    }
    let tagList: any[] = [];
    if (formData.tags.length > 0) {
      formData.tags.map((tag: any) => {
        tagList.push(tag.value);
      });
      formData.tags = tagList;
    }
    formData.structure = myStructure?._id;
    formData.title = `${myStructure?.name}_${formData.dueDate} `;
    formData.snapshot = mySnapshot?._id;
    formData.owner = loggedInUserId;
    formData.status = "To Do";
    formData.context = myContext;
    console.log("issue create button");
    createIssue(router.query.projectId as string, formData)
      .then((response) => {
        if (response.success === true) {
          setSuccessMessage("Issue is added sucessfully");
          toast.success("Issue is added sucessfully");
          handleIssueSubmit(response.result);
          toolInstance.toolAction = "issueCreateSuccess";
          issueToolClicked(toolInstance);
          resetForm();
        } else {
          toolInstance.toolAction = "issueCreateFail";
          issueToolClicked(toolInstance);
        }
      })
      .catch((error) => {
        toolInstance.toolAction = "issueCreateFail";
        issueToolClicked(toolInstance);
        if (error.success === false) {
          toast.error(error?.message);
        }
      });

    // if (values.assignees.length > 0) {
    //   values.assignees.map((user: any) => {
    //     userIdList.push(user.value);
    //   });
    //   values.assignees = userIdList;
    // }
    // if (values.file.length > 0) {
    //   const formData = new FormData();
    //   formData.append('type', values.type);
    //   formData.append('title', values.title);
    //   formData.append('structure', values.structure);
    //   formData.append('snapshot', values.snapshot);
    //   formData.append('priority', values.priority);
    //   formData.append('owner', values.owner);
    //   formData.append('dueDate', values.dueDate);
    //   formData.append('description', values.description);
    // } else {
    //   values.structure = myStructure?._id;
    //   values.title = `${myStructure?.name}_${values.dueDate} `;
    //   values.snapshot = mySnapshot?._id;
    //   values.owner = loggedInUserId;
    //   values.status = 'To Do';
    //   values.context = myContext;
    //   createIssue(router.query.projectId as string, values)
    //     .then((response) => {
    //       if (response.success === true) {
    //         toast.success('Issue is added sucessfully');
    //         handleIssueSubmit(values);
    //         resetForm();
    //       }
    //     })
    //     .catch((error) => {
    //       if (error.success === false) {
    //         toast.error(error?.message);
    //       }
    //     });
    // }
  };
  const initialValues: {
    type: string;
    priority: string;
    description: string;
    assignees: object[];
    tags: object[];
    dueDate: string;
    context: IToolResponse;
    structure: string;
    title: string;
    snapshot: string;
    owner: string;
    status: string;
    file: object[];
  } = {
    type: "",
    priority: "",
    description: "",
    assignees: [],
    tags: [],
    dueDate: "",
    context: myContext,
    structure: "",
    title: "",
    status: "",
    owner: "",
    snapshot: "",
    file: [],
  };

  const validationSchema = Yup.object().shape({
    type: Yup.string().required("please select the issue type"),
    priority: Yup.string().required("please select the issue priority"),
    description: Yup.string(),
    assignees: Yup.array().of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    ),
    tags: Yup.array().of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    ),
    dueDate: Yup.string(),
    files: Yup.array().of(Yup.mixed()).min(1, "At least one file is required"),
  });
  interface user {
    label: string;
    value: string;
  }
  let usersList: user[] = [];
  if (projectUsers.length > 0) {
    projectUsers.map((projectUser: any) => {
      usersList.push({
        label: projectUser?.user?.fullName,
        value: projectUser?.user?._id,
      });
    });
  }
  let tagsList: user[] = [];
  if (tagList?.length > 0) {
    tagList.map((tag) => {
      tagsList.push({
        label: tag,
        value: tag,
      });
    });
  }
  return (
    <div
      className={`fixed calc-h top-10 ${
        myVisbility ? "w-1/4 " : " w-0"
      }  bg-gray-200 right-0 z-10 overflow-x-hidden`}
    >
      <div>
        <div className="flex h-8 justify-between border-b border-black border-solid">
          <div>
            <h1>Create Issue</h1>
          </div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={closeIssueCreate}
              className="hover:white cursor-pointer mr-2 "
            ></FontAwesomeIcon>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={clickIssueSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form
              className=" grid grid-cols-1 gap-y-2 px-4"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                }
              }}
            >
              <div className="mt-2 ">
                <h1 className="text-gray-500">Select the Type of Issue</h1>
                <Field
                  as="select"
                  name="type"
                  id="type"
                  className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                >
                  <option value="" disabled selected>
                    Select a Type
                  </option>
                  {/* <select name='type' id='type' className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"> */}
                  {issueType &&
                    issueType.map((option: any, i) => (
                      <option
                        key={option}
                        value={option}
                        selected={i == 0 ? true : false}
                      >
                        {option}
                      </option>
                    ))}
                  {/* </select> */}
                </Field>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="alert alert-danger"
                />
              </div>
              <div>
                <div>
                  <h5 className="text-gray-500">Issue description.</h5>
                </div>
                <div>
                  <Field
                    component="textarea"
                    className="block w-full text-sm border border-solid border-gray-600 rounded-lg"
                    name="description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-gray-500">Select Priority of the Issue</h1>
                <Field
                  as="select"
                  name="priority"
                  id="priority"
                  className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                >
                  <option value="" disabled selected>
                    Select a Priority
                  </option>
                  {issuePriority &&
                    issuePriority.map((option: any, i) => (
                      <option
                        key={option}
                        value={option}
                        selected={i == 0 ? true : false}
                      >
                        {option}
                      </option>
                    ))}
                </Field>
                <ErrorMessage
                  name="priority"
                  component="div"
                  className="alert alert-danger"
                />
              </div>
              <div>
                <div>
                  <h5 className="text-gray-500">Assigned To</h5>
                </div>
                <div>
                  <ReactSelect
                    name="assignees"
                    options={usersList}
                    value={values.assignees}
                    onChange={(value) => setFieldValue("assignees", value)}
                    isMulti
                    placeholder="Select the assignees "
                    className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                  />
                  <ErrorMessage
                    name="assignees"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
              </div>
              <div>
                <div>
                  <div className=" text-gray-500 ">Date</div>
                  <Field
                    type="date"
                    name="dueDate"
                    className="block w-full text-sm border border-solid border-gray-600 rounded p-2"
                  />
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
              </div>
              <div>
                <div>
                  <h5 className="text-gray-500">Tags</h5>
                </div>
                <div>
                  <ReactSelect
                    name="tags"
                    options={tagsList as object[]}
                    value={values.tags}
                    onChange={(value) => setFieldValue("tags", value)}
                    isMulti
                    placeholder="Select the tags "
                    className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                  />
                  <ErrorMessage
                    name="tags"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
              </div>
              {/* <div>
                <div>
                  <h5 className="text-gray-500">Attachments</h5>
                </div>
                <div>
                  <input
                    type="file"
                    multiple
                    name="file"
                    onChange={(event) => {
                      console.log('dscdksn', event);
                      setFieldValue('file', event.currentTarget.files);
                    }}
                  />
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
              </div> */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="p-1.5 mt-2 bg-gray-500  rounded-md "
                >
                  Add Issue
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <CustomToaster successMessage={successMessage} />
    </div>
  );
};

export default IssueCreate;
