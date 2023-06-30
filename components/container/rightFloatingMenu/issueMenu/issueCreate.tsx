import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import {
  createIssueWithAttachments,
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
import { Issue } from "../../../../models/Issue";
import html2canvas from "html2canvas";
import { CustomToast } from "../../../divami_components/custom-toaster/CustomToast";
interface IProps {
  issueToolClicked: (a: ITools) => void;
  closeOverlay: () => void;
  visibility: boolean;
  handleIssueSubmit: (formData: Issue) => void;
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
  const [image, setImage] = useState<Blob>();
  let toolInstance: ITools = { toolName: "issue", toolAction: "issueCreate" };

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
    html2canvas(document.getElementById("TheView") || document.body).then(
      function (canvas) {
        canvas.toBlob((blob) => {
          setImage(blob as Blob);
        }, "image/png");
      }
    );
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
    attachments: object[];
    screenshot: string;
  }
  const clickIssueSubmit = (
    values: FormValues,
    {
      resetForm,
    }: {
      resetForm: (nextValues?: Partial<FormValues>) => void;
    }
  ) => {
    const formData = new FormData();
    let assignees = values.assignees;
    let tags = values.tags;
    let attachment = values.attachments;
    let userIdList: any[] = [];
    if (values.assignees.length > 0) {
      values.assignees.map((user: any) => {
        userIdList.push(user.value);
      });
      values.assignees = userIdList;
    }
    let tagList: any[] = [];
    if (values.tags.length > 0) {
      values.tags.map((tag: any) => {
        tagList.push(tag.value);
      });
      values.tags = tagList;
    }
    values.structure = myStructure?._id;
    values.title = `${myStructure?.name}_${values.dueDate} `;
    values.snapshot = `${mySnapshot?._id || ""}`;
    values.owner = loggedInUserId;
    values.status = "To Do";
    values.context = myContext;

    let jreq: any = values;
    for (let i = 0; i < jreq.attachments?.length; i++) {
      if (jreq.attachments![i].size > 50 * 1024 * 1024) {
        CustomToast("file size is to large. failed to create issue","error");
        values.assignees = assignees;
        values.tags = tags;
        values.attachments = attachment;
        return;
      }
      formData.append("attachments", jreq.attachments![i]);
    }
    formData.append("screenshot", image as Blob, "imageName.png");
    delete jreq["screenshot"];
    delete jreq["attachments"];
    delete jreq["id"];
    formData.append("jreq", JSON.stringify(jreq));
    createIssueWithAttachments(router.query.projectId as string, formData)
      .then((response) => {
        if (response.success === true) {
          CustomToast("Issue is added sucessfully","success");
          handleIssueSubmit(response.result);
          toolInstance.toolAction = "issueCreateSuccess";
          issueToolClicked(toolInstance);
          resetForm();
          const fileInput = document.getElementById(
            "file-upload"
          ) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = "";
          }
        } else {
          toolInstance.toolAction = "issueCreateFail";
          issueToolClicked(toolInstance);
        }
      })
      .catch((error) => {
        values.assignees = assignees;
        values.tags = tags;
        values.attachments = attachment;
        toolInstance.toolAction = "issueCreateFail";
        issueToolClicked(toolInstance);
        if (error.success === false) {
          CustomToast(error?.message,"error");
        } else {
        CustomToast("some thing went to worng, failed to create the issue","error");
        }
      });
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
    attachments: object[];
    screenshot: string;
  } = {
    type: "",
    priority: "",
    description: "",
    assignees: [],
    tags: [],
    dueDate: new Date().toISOString().slice(0, 10),
    context: myContext,
    structure: "",
    title: "",
    status: "",
    owner: "",
    snapshot: "",
    attachments: [],
    screenshot: "",
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
    file: Yup.mixed().nullable(),
    screenshot: Yup.mixed().nullable(),
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
                  <option value="" disabled>
                    Select a Type
                  </option>
                  {issueType &&
                    issueType.map((option: any, i) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
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
                  <option value="" disabled>
                    Select a Priority
                  </option>
                  {issuePriority &&
                    issuePriority.map((option: any, i) => (
                      <option key={option} value={option}>
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
              <div>
                <div>
                  <h5 className="text-gray-500">Attachments</h5>
                </div>
                <div>
                  <input
                    id="file-upload"
                    type="file"
                    name="attachments"
                    multiple
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("attachments", event.target.files);
                    }}
                  />
                  <div className="flex">
                    <h1>Note:-</h1>
                    <p>The attachment file size should be less than 50mb </p>
                  </div>

                  <ErrorMessage
                    name="attachments"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
              </div>
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
    </div>
  );
};

export default IssueCreate;
