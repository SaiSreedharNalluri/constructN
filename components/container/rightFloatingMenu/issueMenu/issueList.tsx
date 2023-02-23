import {
  faTimes,
  faSearch,
  faFilter,
  faDownload,
  faShieldAlt,
  faUser,
  faCalendar,
  faArrowLeftLong,
  faFlag,
  faPaperclip,
  faPaperPlane,
  faPen,
  faSmile,
  faSpinner,
  faTrashCan,
  faSort,
  faArrowDownAZ,
  faArrowUpAZ,
  faArrowDown19,
  faArrowUp91,
  faFile,
  faFilePdf,
  faFileText,
  faFileAudio,
  faFileImage,
  faFileExcel,
  faFileCsv,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Issue } from '../../../../models/Issue';
import Moment from 'moment';
import { IProjectUsers } from '../../../../models/IProjects';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/router';
import {
  getIssuesTypes,
  getIssuesPriority,
  getIssuesStatus,
} from '../../../../services/issue';
import { getProjectUsers } from '../../../../services/project';
import * as Yup from 'yup';
import Image from 'next/image';
import { Modal } from 'react-responsive-modal';
import ReactSelect from 'react-select';
import { CSVLink } from 'react-csv';
import _ from 'lodash';
import { getTagsList } from '../../../../services/tags';
import { IContext, ITools } from '../../../../models/ITools';
import MultipleFileUpload from '../../multipleFileUpload';
import NextImage from '../../../core/Image';
import Comments from '../comments/comments';
interface IProps {
  issueToolClicked: (a: ITools) => void;
  closeOverlay: () => void;
  issuesList: Issue[];
  visibility: boolean;
  handleOnFilter: (formData: object) => void;
  handleOnSort: (sortMethod: string) => void;
  closeFilterOverlay: () => void;
  deleteTheIssue: (issueObj: object) => void;
  clickIssueEditSubmit: (editObj: object, issueObj: object) => void;
  responseAttachmentData: (formData: any) => void;
  deleteTheAttachment: (attachmentId: string) => void;
}
const IssueList: React.FC<IProps> = ({
  issueToolClicked,
  visibility,
  closeOverlay,
  issuesList,
  handleOnFilter,
  handleOnSort,
  closeFilterOverlay,
  deleteTheIssue,
  clickIssueEditSubmit,
  responseAttachmentData,
  deleteTheAttachment,
}) => {
  const router = useRouter();
  const [isOpenSort, setIsOpenSort] = useState(false);
  const [issueType, setIssueType] = useState<[string]>();
  const [myVisibility, setMyVisibility] = useState(visibility);
  const [issuePriority, setIssuePriority] = useState<[string]>();
  const [issueStatus, setIssueStatus] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [issueViewMode, setIssueViewMode] = useState('list'); //list, filter, detail
  const [issueObj, setIssueObj] = useState<Issue>();
  const [open, setOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [attachmentId, setAttachmentId] = useState('');
  const [deletionType, setDeletionType] = useState('issueDelete'); //issueDelete,attachmentDelete
  const [tagList, setTagList] = useState<[string]>(['']);
  const [previewType, setPreviewType] = useState(''); //image,file,video;
  let toolInstance: ITools = { toolName: 'issue', toolAction: 'issueSelect' };
  const [url, setUrl] = useState('');
  interface user {
    label: string;
    value: string;
  }
  let usersList: user[] = [];
  let defaultList: user[] = [];
  let defaultTagList: user[] = [];
  if (issueObj) {
    issueObj.assignees.map((user) => {
      defaultList.push({
        label: user.firstName,
        value: user._id,
      });
    });
    issueObj.tags.map((tag) => {
      defaultTagList.push({
        label: tag,
        value: tag,
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
  const getFileIcon = (fileName: string) => {
    let extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'txt':
        return <FontAwesomeIcon icon={faFileText} className="mr-2" />;
      case 'pdf':
        return <FontAwesomeIcon icon={faFilePdf} className="mr-2" />;
      case 'mp3':
      case 'mp4':
        return <FontAwesomeIcon icon={faFileAudio} className="mr-2" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FontAwesomeIcon icon={faFileImage} className="mr-2 w-5 h-5" />;
      case 'xls':
      case 'xlsx':
        return <FontAwesomeIcon icon={faFileExcel} className="mr-2 w-5 h-5" />;
      case 'doc':
      case 'docx':
        return <FontAwesomeIcon icon={faFileExcel} className="mr-2 w-5 h-5" />;
      default:
        return <FontAwesomeIcon icon={faFile} className="mr-2" />;
    }
  };
  const getFileType = (attachment: any) => {
    let extension = attachment.name.split('.').pop()?.toLowerCase();
    setOpenPreview(true);
    switch (extension) {
      case 'pdf':
        setPreviewType('file');
        setUrl(
          'https://docs.google.com/viewer?url=' +
            attachment.url +
            '&embedded=true'
        );
        break;
      case 'mp3':
      case 'mp4':
        setUrl(attachment.url);
        setPreviewType('video');
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
        setUrl(attachment.url);
        setPreviewType('image');
        break;
      case 'doc':
      case 'docx':
        setPreviewType('file');
        setUrl(
          `https://view.officeapps.live.com/op/embed.aspx?src=${attachment.url}`
        );
        break;
      case 'xls':
      case 'xlsx':
        setPreviewType('file');
        setUrl(
          `https://view.officeapps.live.com/op/embed.aspx?src=${attachment.url}`
        );
        break;
      default:
        setUrl(attachment.url);
    }
  };
  const getDownladableIssueList = (issL = issuesList) => {
    let myL = issL.map((iss) => {
      let a = iss.assignees.map((a) => {
        return a.firstName;
      });
      let x = _.omit(iss, 'progress', 'context');
      let y = _.update(x, 'assignees', (ass) => {
        let n = ass.map((o: { firstName: any }) => {
          return o.firstName;
        });
        return n;
      });
      return y;
    });
    return myL;
  };
  const initialValues: {
    issueTypeData: Array<string>;
    issuePriorityData: Array<string>;
    issueStatusData: Array<string>;
    assigneesData: object[];
    fromDate: string;
    toDate: string;
  } = {
    issueTypeData: [], //(issueType ===undefined)?[]:issueType ,
    issuePriorityData: [], // (issuePriority ===undefined)?[]:issuePriority ,
    issueStatusData: [], //(issueStatus ===undefined)?[]:issueStatus ,
    assigneesData: [],
    fromDate: '',
    toDate: '',
  };
  const getOwnerName = (userId: string) => {
    const user: any = projectUsers.find(
      (userObj: any) => userObj.user._id === userId
    );
    return user?.user.firstName ? user?.user.firstName : '';
  };
  const initialEditValues: {
    type: string;
    status: string;
    priority: string;
    description: string;
    assignees: object[];
    tags: object[];
    date: string;
  } = {
    type: issueObj?.type ? issueObj.type : '',
    status: issueObj?.status ? issueObj.status : '',
    priority: issueObj?.priority
      ? issueObj.priority
      : 'Please select the issue priority',
    description: issueObj?.description ? issueObj?.description : '',
    assignees: defaultList,
    tags: defaultTagList,
    date: Moment(issueObj?.dueDate).format('YYYY-MM-DD'),
  };
  const validationEditSchema = Yup.object().shape({
    type: Yup.string(),
    priority: Yup.string(),
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
    date: Yup.string(),
  });
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
    }
    getIssuesStatus(router.query.projectId as string).then((response) => {
      if (response.success === true) {
        setIssueStatus(response.result);
      }
      setMyVisibility(visibility);
    });
    getTagsList(router.query.projectId as string)
      .then((response) => {
        if (response.success === true) {
          setTagList(response.result[0]?.tagList);
        }
      })
      .catch();
  }, [router.isReady, router.query.projectId, visibility]);
  if (projectUsers.length > 0) {
    projectUsers.map((projectUser: any) => {
      usersList.push({
        label: projectUser?.user?.fullName,
        value: projectUser?.user?._id,
      });
    });
  }
  const responseData = (formData: any) => {
    responseAttachmentData(formData);
    setIssueViewMode('list');
  };
  const clickIssueHandleEditSubmit = (editObj: any) => {
    let userIdList: any[] = [];
    let editTagList: any[] = [];
    if (editObj.assignees.length > 0) {
      editObj.assignees.map((user: any) => {
        userIdList.push(user.value);
      });
      editObj.assignees = userIdList;
    }
    if (editObj.tags.length > 0) {
      editObj.tags.map((tag: any) => {
        editTagList.push(tag.value);
      });
      editObj.tags = editTagList;
    }
    clickIssueEditSubmit(editObj, issueObj as Issue);
    setTimeout(() => {
      setIssueViewMode('list');
    }, 2000);
  };
  const renderIssueView = (viewParam: string) => {
    switch (viewParam) {
      case 'filter':
        return (
          <div>
            <div className="flex justify-between border-b border-black border-solid">
              <div className="flex gap-2">
                <FontAwesomeIcon
                  icon={faArrowLeftLong}
                  className="mt-2"
                  onClick={() => {
                    setIssueViewMode('list'), closeFilterOverlay();
                  }}
                ></FontAwesomeIcon>

                <h1>Issue Filters</h1>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faTimes}
                  onClick={closeFilterView}
                  className=" mr-2 mt-3  rounded-full border border-black"
                ></FontAwesomeIcon>
              </div>
            </div>
            {IssueList.length >= 1 ? (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleOnFilterEvent}
              >
                {({ values, setFieldValue }) => (
                  <Form className=" grid grid-cols-1 gap-y-2 px-4">
                    <div>
                      <h5 className="text-gray-500">Issue Type</h5>
                    </div>
                    <div className="grid grid-cols-2">
                      {issueType &&
                        issueType.map((option) => (
                          <div key={option}>
                            <Field
                              type="checkbox"
                              name="issueTypeData"
                              id={option}
                              value={option}
                            />
                            <label htmlFor={option}>{option}</label>
                          </div>
                        ))}
                    </div>
                    <ErrorMessage
                      name="issueTypeData"
                      component="div"
                      className="alert alert-danger"
                    />
                    <div>
                      <h5 className="text-gray-500">Issue Priority</h5>
                    </div>
                    <div className="grid grid-cols-3">
                      {issuePriority &&
                        issuePriority.map((option) => (
                          <div className="" key={option}>
                            <Field
                              type="checkbox"
                              name="issuePriorityData"
                              id={option}
                              value={option}
                            />
                            <label htmlFor={option}>{option}</label>
                          </div>
                        ))}
                    </div>
                    <ErrorMessage
                      name="issuePriorityData"
                      component="div"
                      className="alert alert-danger"
                    />
                    <div>
                      <h5 className="text-gray-500">Issue Status</h5>
                    </div>
                    <div className="grid grid-cols-2">
                      {issueStatus &&
                        issueStatus.map((option) => (
                          <div key={option}>
                            <Field
                              type="checkbox"
                              name="issueStatusData"
                              id={option}
                              value={option}
                            />
                            <label htmlFor={option}>{option}</label>
                          </div>
                        ))}
                    </div>
                    <ErrorMessage
                      name="issueStatusData"
                      component="div"
                      className="alert alert-danger"
                    />
                    <div>
                      <div>
                        <h5 className="text-gray-500">Assigned To</h5>
                      </div>
                      <div>
                        <ReactSelect
                          name="assigneesData"
                          options={usersList}
                          isMulti
                          placeholder="Select the assignees "
                          value={values.assigneesData}
                          onChange={(value) =>
                            setFieldValue('assigneesData', value)
                          }
                          className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                        />
                        <ErrorMessage
                          name="assigneesData"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>
                      <div className="p-2">
                        <div className="flex">
                          <div className="w-1/2 text-gray-500 ">From Date</div>
                          <div className="w-1/2 text-gray-500 ">To Date</div>
                        </div>
                        <div className="flex bg-white p-1 rounded   border border-solid border-gray-600">
                          <div className="w-1/2 text-gray-500 border-r border-solid border-gray-300">
                            <Field
                              type="date"
                              name="fromDate"
                              className="block w-full text-sm border border-solid border-gray-600 rounded p-2"
                            />
                            <ErrorMessage
                              name="fromDate"
                              component="div"
                              className="alert alert-danger"
                            />
                          </div>
                          <div className="w-1/2 text-gray-500 ml-2">
                            <Field
                              type="date"
                              name="toDate"
                              className="block w-full text-sm border border-solid border-gray-600 rounded p-2"
                            />
                            <ErrorMessage
                              name="toDate"
                              component="div"
                              className="alert alert-danger"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="p-1.5 mt-2 bg-gray-500  rounded-md"
                    >
                      Apply
                    </button>
                    <button
                      type="reset"
                      className="p-1.5 mt-2 bg-gray-500  rounded-md"
                      onClick={() => {
                        setIssueViewMode('list');
                        closeFilterOverlay();
                      }}
                    >
                      Cancel
                    </button>
                  </Form>
                )}
              </Formik>
            ) : (
              'There is no data available to filter the issue list'
            )}
          </div>
        );
        break;
      case 'edit':
        return (
          <div>
            <div className="flex h-8 justify-between border-b border-black border-solid">
              <div>
                <h1>Edit Issue</h1>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faTimes}
                  onClick={() => {
                    setIssueViewMode('detail');
                  }}
                  className="hover:white cursor-pointer mr-2 "
                ></FontAwesomeIcon>
              </div>
            </div>
            <Formik
              initialValues={initialEditValues}
              validationSchema={validationEditSchema}
              onSubmit={clickIssueHandleEditSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form
                  className=" grid grid-cols-1 gap-y-2 px-4 overflow-y-auto calc-h72"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
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
                      {issueType &&
                        issueType.map((option: any) => (
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
                  <div className="mt-2 ">
                    <h1 className="text-gray-500">Select the Issue Status</h1>
                    <Field
                      as="select"
                      name="status"
                      id="status"
                      className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                    >
                      {issueStatus &&
                        issueStatus.map((option: any) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="status"
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
                    <h1 className="text-gray-500">
                      Select Priority of the Issue
                    </h1>
                    <Field
                      as="select"
                      name="priority"
                      id="priority"
                      className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                    >
                      {issuePriority &&
                        issuePriority.map((option: any) => (
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
                        isMulti
                        placeholder="Select the assignees "
                        value={values.assignees}
                        onChange={(value) => setFieldValue('assignees', value)}
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
                        name="date"
                        className="block w-full text-sm border border-solid border-gray-600 rounded p-2"
                      />
                      <ErrorMessage
                        name="date"
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
                        onChange={(value) => setFieldValue('tags', value)}
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
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="p-1.5 mt-2 bg-gray-500  rounded-md "
                    >
                      Update Issue
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        );
        break;
      case 'detail':
        return (
          <div>
            <div className="h-8 bg-gray-100 w-full   flex justify-between px-2">
              <div className=" flex ">
                <FontAwesomeIcon
                  icon={faArrowLeftLong}
                  className="mt-2 cursor-pointer"
                  onClick={() => setIssueViewMode('list')}
                ></FontAwesomeIcon>
                <p className="ml-2 mt-1  font-semibold">
                  {issueObj?.type} Issue
                </p>
              </div>
              <div className="flex ">
                <div>
                  <FontAwesomeIcon
                    icon={faPen}
                    className="mt-2 cursor-pointer pr-2"
                    onClick={() => setIssueViewMode('edit')}
                  />
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="mt-2 cursor-pointer"
                    onClick={() => {
                      setOpen(true);
                      setDeletionType('issueDelete');
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="overflow-y-auto calc-h112 px-4 ">
              <div>
                <div className="">
                  <p>Details</p>
                  <Image
                    alt=""
                    width={1080}
                    height={1080}
                    className="w-10/12 h-24"
                    src={issueObj?.screenshot as string}
                  />
                  <p className="mt-2">{issueObj?.title}</p>
                </div>
                <div>
                  <div className="flex mt-2">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="mt-1 "
                    ></FontAwesomeIcon>
                    <p className="ml-2">{issueObj?.status}</p>
                  </div>
                  <div className="flex">
                    <FontAwesomeIcon
                      className="mt-1"
                      icon={faFlag}
                    ></FontAwesomeIcon>
                    <p className="ml-1">{issueObj?.priority}</p>
                  </div>
                  <div className="flex">
                    <FontAwesomeIcon
                      className="mt-1"
                      icon={faCalendar}
                    ></FontAwesomeIcon>
                    <p className="ml-1">
                      {Moment(issueObj?.dueDate).format('MMM Do YYYY')}
                    </p>
                  </div>
                  <div className="flex">
                    <FontAwesomeIcon
                      className="mt-1"
                      icon={faUser}
                    ></FontAwesomeIcon>
                    <p className="ml-1">
                      {getOwnerName(issueObj?.owner as string)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-2   grid-rows-2  mt-2">
                  <div className="flex">
                    <FontAwesomeIcon
                      className="mt-1"
                      icon={faUser}
                    ></FontAwesomeIcon>
                    <p className="ml-1"></p>
                    {issueObj?.assignees.map((a: any) => a.firstName).join(',')}
                  </div>
                </div>
                <div className=" mt-2 ">
                  <h6 className="underline ">Issue Description</h6>
                  <p className=" break-words  whitespace-pre-wrap">
                    {issueObj?.description}
                  </p>
                </div>
                <div>
                  <h6 className="underline mt-3">Attachments</h6>
                  <MultipleFileUpload
                    issueId={issueObj?._id as string}
                    responseData={responseData}
                  />
                </div>
                <div>
                  {issueObj?.attachments.map((attachment) => {
                    return (
                      <div key={attachment._id}>
                        {getFileIcon(attachment.name)}
                        <a
                          onClick={() => {
                            getFileType(attachment);
                          }}
                        >
                          {attachment.name}
                        </a>
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="mt-2 cursor-pointer pl-5"
                          onClick={() => {
                            setOpen(true);
                            setDeletionType('attachmentDelete');
                            setAttachmentId(attachment._id);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className=" mt-2 ">
                  <h6 className="underline ">Related Tags</h6>
                  <div className="grid grid-cols-3 gap-2 text-center  mt-2">
                    {issueObj?.tags.map((tagData) => {
                      return (
                        <div
                          className="bg-gray-500 rounded-xl w-full px-0.5 py-1"
                          key={tagData}
                        >
                          {tagData}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="w-full mt-5">
                <div>
                  <Comments entityId={issueObj?._id as string} />
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'list':
      default:
        return (
          <div className="grid grid-cols-1">
            <div className="flex justify-between border-b border-black border-solid">
              <h1>Issue List</h1>
              <FontAwesomeIcon
                icon={faTimes}
                onClick={() => {
                  setMyVisibility(false);
                  closeOverlay();
                }}
                className=" mr-2  cursor-pointer rounded-full border border-black"
              ></FontAwesomeIcon>
            </div>
            <div className="overflow-y-auto calc-h64">
              <div>
                <div className="flex justify-between text-gray-800">
                  <div>
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-3 p-1 gap-1">
                    <div>
                      <FontAwesomeIcon
                        icon={faFilter}
                        onClick={() => {
                          setIssueViewMode('filter');
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faSort}
                        onClick={() => {
                          isOpenSort
                            ? setIsOpenSort(false)
                            : setIsOpenSort(true);
                        }}
                        className="cursor-pointer"
                      />
                      {isOpenSort && (
                        <div className="absolute  right-0 z-10 bg-gray-100 rounded-lg shadow border">
                          <ul className="text-black p-4 ">
                            <li
                              className="font-medium cursor-pointer"
                              onClick={() => {
                                setIsOpenSort(false);
                                handleOnSort('Last Updated');
                              }}
                            >
                              <div className="flex items-center justify-center transform transition-colors duration-200">
                                <div className="mr-3">
                                  <FontAwesomeIcon
                                    icon={faArrowUpAZ}
                                  ></FontAwesomeIcon>
                                </div>
                                Last Updated
                              </div>
                            </li>
                            <li
                              className="font-medium cursor-pointer"
                              onClick={() => {
                                setIsOpenSort(false);
                                handleOnSort('First Updated');
                              }}
                            >
                              <div className="flex items-center justify-center transform transition-colors duration-200 ">
                                <div className="mr-3">
                                  <FontAwesomeIcon
                                    icon={faArrowDownAZ}
                                  ></FontAwesomeIcon>
                                </div>
                                First Updated
                              </div>
                            </li>
                            <hr className="border-gray-700" />
                            <li
                              className="font-medium cursor-pointer"
                              onClick={() => {
                                setIsOpenSort(false);
                                handleOnSort('Asc DueDate');
                              }}
                            >
                              <div className="flex items-center justify-center transform transition-colors duration-200 ">
                                <div className="mr-3">
                                  <FontAwesomeIcon
                                    icon={faArrowDown19}
                                  ></FontAwesomeIcon>
                                </div>
                                First DueDate
                              </div>
                            </li>
                            <li
                              className="font-medium cursor-pointer"
                              onClick={() => {
                                setIsOpenSort(false);
                                handleOnSort('Dsc DueDate');
                              }}
                            >
                              <div className="flex items-center justify-center transform transition-colors duration-200 ">
                                <div className="mr-3">
                                  <FontAwesomeIcon
                                    icon={faArrowUp91}
                                  ></FontAwesomeIcon>
                                </div>
                                Last DueDate
                              </div>
                            </li>
                            <hr className="border-gray-700" />
                            <li
                              className="font-medium cursor-pointer"
                              onClick={() => {
                                setIsOpenSort(false);
                                handleOnSort('Asc Priority');
                              }}
                            >
                              <div className="flex items-center justify-center transform transition-colors duration-200 ">
                                <div className="mr-3">
                                  <FontAwesomeIcon
                                    icon={faArrowDown19}
                                  ></FontAwesomeIcon>
                                </div>
                                Asc Priority
                              </div>
                            </li>
                            <li
                              className="font-medium cursor-pointer"
                              onClick={() => {
                                setIsOpenSort(false);
                                handleOnSort('Dsc Priority');
                              }}
                            >
                              <div className="flex items-center justify-center transform transition-colors duration-200 ">
                                <div className="mr-3">
                                  <FontAwesomeIcon
                                    icon={faArrowUp91}
                                  ></FontAwesomeIcon>
                                </div>
                                Dsc Priority
                              </div>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <div>
                      <CSVLink
                        data={getDownladableIssueList(issuesList)}
                        filename={'my-issues.csv'}
                        className="text-black btn btn-primary fill-black fa fa-Download "
                        target="_blank"
                      >
                        <FontAwesomeIcon
                          className=" fill-black text-black"
                          icon={faDownload}
                        ></FontAwesomeIcon>
                      </CSVLink>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 ">
                {issuesList.length >= 1
                  ? issuesList.map((issueInfo: Issue) => {
                      return (
                        <div
                          className="h-full mt-2 w-full "
                          key={issueInfo._id}
                          onClick={() => {
                            setIssueViewMode('detail');
                            let issueContext: IContext = issueInfo.context
                              ? issueInfo.context
                              : { type: 'Issue' };
                            issueContext.id = issueInfo._id;
                            toolInstance.response = issueContext;
                            issueToolClicked(toolInstance);
                            setIssueObj(issueInfo);
                          }}
                        >
                          <div className="h-1/3 w-11/12  m-auto ">
                            <div className="m-auto ">
                              <div className=" bg-white cursor-pointer border border-solid border-gray-500 rounded">
                                <div className="grid grid-cols-4 grid-flow-row-dense gap-x-0">
                                  <div>
                                    <FontAwesomeIcon
                                      className="fa-3x p-1 text-gray-500"
                                      icon={faShieldAlt}
                                    ></FontAwesomeIcon>
                                  </div>
                                  <div className="col-span-3 p-1 text-gray-600">
                                    <div>
                                      <p className="text-base">
                                        {issueInfo.type} (#
                                        {issueInfo?._id?.substring(3)})
                                      </p>
                                    </div>
                                    <div className="flex gap-3">
                                      <p className="text-sm">
                                        {issueInfo.status}
                                      </p>
                                      |
                                      <p className="text-sm">
                                        {issueInfo.priority}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex mt-2 ml-3">
                                  <div className="flex">
                                    <FontAwesomeIcon
                                      icon={faUser}
                                      className="text-gray-500 "
                                    ></FontAwesomeIcon>
                                    <p className="text-gray-500 -mt-1 ml-1">
                                      {issueInfo.assignees[0]?.firstName}
                                    </p>
                                    <FontAwesomeIcon
                                      icon={faCalendar}
                                      className="text-gray-500 ml-2"
                                    />
                                    <p className="text-gray-500 -mt-1 ml-1">
                                      {Moment(issueInfo.dueDate).format(
                                        'MMM Do YYYY'
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : 'there is no data avaliable'}
              </div>
            </div>
          </div>
        );
        break;
    }
  };
  const validationSchema = Yup.object().shape({
    issueType: Yup.array().min(1),
    issuePriority: Yup.array().min(1),
    issueStatus: Yup.array().min(1),
    assignees: Yup.array().of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    ),
    fromDate: Yup.string(),
    toDate: Yup.string(),
  });

  const handleOnFilterEvent = (formData: object) => {
    handleOnFilter(formData);
    setIssueViewMode('list');
  };
  const closeFilterView = () => {
    closeOverlay();
    setIssueViewMode('list');
  };
  const handleDeleteItem = () => {
    if (deletionType === 'issueDelete') {
      deleteTheIssue(issueObj as Issue);
    } else if (deletionType === 'attachmentDelete') {
      deleteTheAttachment(attachmentId);
    }
    setOpen(false);
    setTimeout(() => {
      setIssueViewMode('list');
    }, 2000);
  };
  const loadPreviewData = (url: string) => {
    switch (previewType) {
      case 'image':
        return <NextImage src={url} className="h-fit w-fit" />;
      case 'file':
        return <iframe src={url} width={800} height={800}></iframe>;
      case 'video':
        return (
          <video autoPlay controls>
            <source src={url} type="video/mp4" />
          </video>
        );
      default:
        return <iframe src={url} width={800} height={800}></iframe>;
    }
  };
  return (
    <div>
      <div
        className={`fixed calc-h ${myVisibility ? '  lg:w-1/4' : 'w-0'}  
          top-10  bg-gray-200 right-0 z-10 overflow-x-hidden overflow-y-hidden`}
      >
        <div className="">{renderIssueView(issueViewMode)}</div>
      </div>
      <div>
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <h1 className=" font-bold">Delete confirmation</h1>
          <p className="mt-2">Are you sure you want to delete this item?</p>
          <div className="grid grid-cols-2 gap-x-4 mt-4">
            <button
              onClick={() => {
                setOpen(false);
              }}
              className="px-2 py-1  focus:outline-none bg-gray-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
            >
              Cancel
            </button>
            <button
              className="px-2 py-1 bg-red-500 hover:bg-red-800  rounded text-gray-200 font-semibold "
              onClick={handleDeleteItem}
            >
              Confirm
            </button>
          </div>
        </Modal>
      </div>
      <div>
        <Modal
          open={openPreview}
          onClose={() => {
            setOpenPreview(false);
          }}
        >
          <div>{loadPreviewData(url)}</div>
        </Modal>
      </div>
    </div>
  );
};
export default IssueList;
