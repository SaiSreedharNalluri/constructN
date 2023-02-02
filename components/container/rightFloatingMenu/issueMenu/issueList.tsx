import {
  faTimes,
  faSearch,
  faFilter,
  faDownload,
  faShieldAlt,
  faUser,
  faCalendar,
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
interface IProps {
  closeOverlay: () => void;
  issuesList: Issue[];
  visibility: boolean;
  handleOnFilter: (formData: object) => void;
  closeFilterOverlay: () => void;
}
const IssueList: React.FC<IProps> = ({
  visibility,
  closeOverlay,
  issuesList,
  handleOnFilter,
  closeFilterOverlay,
}) => {
  const router = useRouter();
  const [issueType, setIssueType] = useState<[string]>();
  const [issuePriority, setIssuePriority] = useState<[string]>();
  const [issueStatus, setIssueStatus] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [fileterView, setFileterView] = useState(false);
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
    setFileterView(false);
  };
  const closeFilterView = () => {
    closeFilterOverlay();
    setFileterView(false);
  };
  if (projectUsers?.length > 0) {
    projectUsers.map((projectUser: any) => {
      usersList.push({
        _id: projectUser?.user?._id,
        name: projectUser?.user?.fullName,
      });
    });
  }
  return (
    <div
      className={`fixed ${
        visibility ? 'w-1/4 calc-h' : 'w-0'
      }  top-10     bg-gray-200 right-0 z-10 overflow-x-hidden`}
    >
      <div className="overflow-y-auto ">
        <div className="flex justify-between border-b border-black border-solid">
          <div>
            <h1>{!fileterView ? 'Issue List' : 'Issue Filters'}</h1>
          </div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => {
                if (fileterView === false) {
                  closeIssueView();
                } else {
                  closeFilterView();
                }
              }}
              className=" mr-2  rounded-full border border-black"
            ></FontAwesomeIcon>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
          </div>
          <div className="flex justify-between text-gray-800">
            <div className="mr-2">
              <FontAwesomeIcon
                icon={faFilter}
                onClick={() => {
                  if (!fileterView) {
                    setFileterView(true);
                  } else {
                    setFileterView(false);
                  }
                }}
              />
            </div>
            <div className="mr-2">
              <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
            </div>
          </div>
        </div>
        {!fileterView ? (
          <div>
            {issuesList.length >= 1
              ? issuesList.map((issueInfo: Issue) => {
                  return (
                    <div className="h-full mt-2 w-full" key={issueInfo._id}>
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
                                  <p className="mr-1">{issueInfo.status}</p>|
                                  <p className="ml-1">{issueInfo.priority}</p>
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
        ) : (
          <div>
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
                      onClick={closeFilterView}
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
        )}
      </div>
    </div>
  );
};

export default IssueList;
