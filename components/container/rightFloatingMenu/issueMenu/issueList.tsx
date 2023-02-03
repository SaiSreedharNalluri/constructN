import {
  faArrowLeft,
  faEdit,
  faTrash,
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
interface IProps {
  closeOverlay: () => void;
  issuesList: Issue[];
  visibility: boolean;
  handleOnFilter: (formData: object) => void;
  closeFilterOverlay: () => void;
  deleteTheIssue: (issueObj: object) => void;
}
const IssueList: React.FC<IProps> = ({
  visibility,
  closeOverlay,
  issuesList,
  handleOnFilter,
  closeFilterOverlay,
  deleteTheIssue,
}) => {
  const router = useRouter();
  const [issueType, setIssueType] = useState<[string]>();
  const [myVisibility, setMyVisibility] = useState(visibility);
  const [issuePriority, setIssuePriority] = useState<[string]>();
  const [issueStatus, setIssueStatus] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [issueViewMode, setIssueViewMode] = useState('list'); //list, filter, detail
  const [issueObj, setIssueObj] = useState<Issue>();
  const [open, setOpen] = useState(false);
  let usersList = [
    { _id: '', name: 'please select the assignee for the issue' },
  ];
  const initialValues: {
    issueType: Array<string>;
    issuePriority: Array<string>;
    issueStatus: Array<string>;
    assignees: string;
  } = {
    issueType: [],
    issuePriority: [],
    issueStatus: [],
    assignees: '',
  };
  const getOwnerName = (userId: string) => {
    const user: any = projectUsers.find(
      (userObj: any) => userObj.user._id === userId
    );
    return user?.user.firstName ? user?.user.firstName : '';
  };
  useEffect(() => {
    setMyVisibility(visibility);
  }, [visibility]);
  const renderIssueView = (viewParam: string) => {
    switch (viewParam) {
      case 'filter':
        return (
          <div>
            <div className="flex justify-between border-b border-black border-solid">
              <div>
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
                {({ errors, touched }) => (
                  <Form className=" grid grid-cols-1 gap-y-2 px-4">
                    <div>
                      <h5 className="text-gray-500">Issue Type</h5>
                    </div>
                    {issueType &&
                      issueType.map((option) => (
                        <div key={option}>
                          <Field
                            type="checkbox"
                            name="issueType"
                            id={option}
                            value={option}
                          />

                          <label htmlFor={option}>{option}</label>
                        </div>
                      ))}
                    <ErrorMessage
                      name="issueType"
                      component="div"
                      className="alert alert-danger"
                    />
                    <div>
                      <h5 className="text-gray-500">Issue Priority</h5>
                    </div>
                    {issuePriority &&
                      issuePriority.map((option) => (
                        <div key={option}>
                          <Field
                            type="checkbox"
                            name="issuePriority"
                            id={option}
                            value={option}
                          />
                          <label htmlFor={option}>{option}</label>
                        </div>
                      ))}
                    <ErrorMessage
                      name="issuePriority"
                      component="div"
                      className="alert alert-danger"
                    />
                    <div>
                      <h5 className="text-gray-500">Issue Status</h5>
                    </div>
                    {issueStatus &&
                      issueStatus.map((option) => (
                        <div key={option}>
                          <Field
                            type="checkbox"
                            name="issueStatus"
                            id={option}
                            value={option}
                          />
                          <label htmlFor={option}>{option}</label>
                        </div>
                      ))}
                    <ErrorMessage
                      name="issueStatus"
                      component="div"
                      className="alert alert-danger"
                    />
                    <div>
                      <div>
                        <h5 className="text-gray-500">Assigned To</h5>
                      </div>
                      <div>
                        <Field
                          as="select"
                          name="assignees"
                          id="assignees"
                          className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                        >
                          {usersList &&
                            usersList.map((option: any) => (
                              <option key={option?._id} value={option?._id}>
                                {option?.name}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name="assignees"
                          component="div"
                          className="alert alert-danger"
                        />
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
      case 'detail':
        return (
          <div>
            <div className="h-8 bg-gray-100 w-full  flex justify-between px-2">
              <div className=" flex ">
                <FontAwesomeIcon
                  icon={faArrowLeftLong}
                  className="mt-2"
                  onClick={() => setIssueViewMode('list')}
                ></FontAwesomeIcon>
                <p className="ml-2 mt-1  font-semibold">{issueObj?.title}</p>
              </div>
              <div className="flex">
                <div>
                  <FontAwesomeIcon icon={faPen} className="mt-2 pr-2" />
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="mt-2"
                    onClick={() => {
                      setOpen(true);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="overflow-y-auto px-4 ">
              <div className="">
                <p>Details</p>
                <Image
                  alt=""
                  width={1080}
                  height={1080}
                  className="w-10/12 h-24"
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8QEBAPDw0NDw8QDxASEA8NDQ8NDQ8QFRIWFhUSFRUYHSggGBolGxUVITEhJSk3Li4uFx8zODMtNyg5OisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIALcBEwMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAAAAQIHA//EACQQAQEAAAYBBQEBAQAAAAAAAAABAhExQVHRwSFhgbHhcfGR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO2KyoKUiAVMQmIEuhCpL9AS6mXoF8ANM1QWEKbfILhWeE5AVYi0E2BADdC0CItNwQhSgQE6BSJsoKIUFTNWQUQBvtZogBwW+palASrUxARnP6arO0BZqi0lAIQwgsE3UFWszRrMCX1WoArOKLUAtIlXMElOyJQCqkBUIQDYpQCrukLuCosQAAGoABsJVgIkJqUC6psqAHsAKF6AKACqnC5gpUKBUxKyCwhdQBKAFpDJYCXyAAUAJ0ACoUoEGbagPRcSQAOkpegPJCgJDgu39W7AgAEUiAQigLCIsoKRF5BFRAIqFBZEWJAF4SqCZHakBBUAFQAqpAZzFyAaSbrUAL5LoAZ+vwnJACKEAuyTwsSQBcQAUIAFAFKRAWpVpACJwALUigUCAFIQBCryCUgAFPwBMwyAaSrUgCRUAz8E7IAqZgAFAWJV6AOxFvpQTPVYiwBUAWT1qFAFiKCLSAByUA2KACQoAQpkCoAEozQG0ugYgQ5W7IBhSLEm4KAAKAIQBdwhAAqQGkMygU8ByBkpACRLuQm4KFL5AEKAh+GwKkCAqBAayEAVOl90/AKzPDU7ZAVD3BSkhhBaJVoIACkTCTX4AKTUBf1Ck1BZUwzQaAEACmFAUIgLunQlBUWpQKqVQC6CgmQoBS7QIBkzKpQSk0CAv+KigipCAQmnwAJVhQCAUEUl9P8AhNgMKooEBOAWboFAzJ4TFsUDY/CEAiUAVUpAWESqBn7CgJapUxAbCsgELosAzIcLAOSa0wm4JkXlYngCnaphAmvwcC3QEk+yKQE6XysTPUEupQyAySrnokBakKAbpRb5ASHJNQO1CfYKU3+FBqDIAZEAEWICUui8pAXD2QUCz6ilAEWlBOCL+EgJycNGQIQqgkST0/tWmLgEot8ICZBSglUupQTJLy0mQIpwe4C8JWr0BCQyUGc6LkAQoAXYAEEAWNACRVASL5AE5/uTVAAwgCZLdgAsRQESgBUyACnPuAJkdAAUAW7gAoALQAf/2Q=="
                ></Image>
              </div>
              <div className="flex">
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="mt-2"
                ></FontAwesomeIcon>
                <p className="ml-2">{issueObj?.status}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2   grid-rows-2 w-10/12 mt-2">
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
                    {Moment(issueObj?.createdAt).format('MMM Do YYYY')}
                  </p>
                </div>

                <div className="flex">
                  <FontAwesomeIcon
                    className="mt-1"
                    icon={faUser}
                  ></FontAwesomeIcon>
                  <p className="ml-1"></p>
                  {issueObj?.assignees[0].firstName}
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
              <div className=" mt-2 ">
                <h6 className="underline ">Issue Description</h6>
                <p className=" break-words  whitespace-pre-wrap">
                  {issueObj?.description}
                </p>
              </div>
              <div>
                <h6 className="underline mt-3">Attachments</h6>
                <input className="border border-solid border-gray-400 rounded p-1 w-10/12"></input>
              </div>
              <div className=" mt-2 ">
                <h6 className="underline ">Related Tags</h6>
                <div className="grid grid-cols-3 gap-2  mt-2">
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
            <div className="absolute bottom-0  border-t border-solid border-black w-full">
              <input
                type="text"
                className="flex w-full  rounded focus:outline-none focus:border-indigo-300 pl-4  h-10"
                placeholder="Add Comment"
              />
              <div className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400">
                <FontAwesomeIcon
                  icon={faPaperclip}
                  className="mr-2"
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                  icon={faSmile}
                  className="mr-2"
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="mr-6"
                ></FontAwesomeIcon>
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
                className=" mr-2 right-0 rounded-full border border-black"
              ></FontAwesomeIcon>
            </div>
            <div>
              <div>
                <div className="flex justify-between text-gray-800">
                  <div>
                    <FontAwesomeIcon icon={faSearch} />
                  </div>

                  <div className="mr-3">
                    <FontAwesomeIcon
                      icon={faFilter}
                      onClick={() => {
                        setIssueViewMode('filter');
                      }}
                    />
                    <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1">
                {issuesList.length >= 1
                  ? issuesList.map((issueInfo: Issue) => {
                      return (
                        <div
                          className="h-full mt-2 w-full"
                          key={issueInfo._id}
                          onClick={() => {
                            setIssueViewMode('detail');
                            setIssueObj(issueInfo);
                          }}
                        >
                          <div className=" h-1/12 w-11/12  m-auto ">
                            <div className=" m-auto ">
                              <div className=" bg-white border border-solid border-gray-400 rounded">
                                <div className="flex mt-2">
                                  <div>
                                    <FontAwesomeIcon
                                      className="text-3xl text-gray-400"
                                      icon={faShieldAlt}
                                    ></FontAwesomeIcon>
                                  </div>
                                  <div className="flex-col ml-2 text-gray-600">
                                    <div>
                                      <h5>{issueInfo.title}</h5>
                                    </div>
                                    <div className="flex">
                                      <p className="mr-1">{issueInfo.status}</p>
                                      |
                                      <p className="ml-1">
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
                                      {issueInfo.assignees[0].firstName}
                                    </p>
                                    <FontAwesomeIcon
                                      icon={faCalendar}
                                      className="text-gray-500 ml-2"
                                    />
                                    <p className="text-gray-500 -mt-1 ml-1">
                                      {Moment(issueInfo.createdAt).format(
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
    assignees: Yup.string().required('please select the issue assignee'),
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
    });
  }, [router.isReady, router.query.projectId]);
  const closeIssueView = () => {
    closeOverlay();
  };
  const handleOnFilterEvent = (formData: object) => {
    handleOnFilter(formData);
    setIssueViewMode('list');
  };
  const closeFilterView = () => {
    closeOverlay();
    setIssueViewMode('list');
  };
  if (projectUsers?.length > 0) {
    projectUsers.map((projectUser: any) => {
      usersList.push({
        _id: projectUser?.user?._id,
        name: projectUser?.user?.fullName,
      });
    });
  }
  const handleDeleteItem = () => {
    deleteTheIssue(issueObj as Issue);
    setOpen(false);
    setTimeout(() => {
      setIssueViewMode('list');
    }, 2000);
  };
  return (
    <div>
      <div
        className={`fixed calc-h ${myVisibility ? 'w-1/4' : 'w-0'}  
          top-10  bg-gray-200 right-0 z-10 overflow-x-hidden`}
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
          <h1>Delete conformation for issue</h1>
          <p>Are you sure you want to delete this item?</p>
          <button onClick={handleDeleteItem}>Confirm</button>
          <button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default IssueList;
