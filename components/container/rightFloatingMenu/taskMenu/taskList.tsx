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
import { ITasks } from '../../../../models/Itask';
import Moment from 'moment';
import { IProjectUsers } from '../../../../models/IProjects';
import router from 'next/router';
import { getProjectUsers } from '../../../../services/project';
import {
  getTasksTypes,
  getTasksPriority,
  getTaskStatus,
} from '../../../../services/task';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import IssueList from '../issueMenu/issueList';
interface IProps {
  closeOverlay: () => void;
  visibility: boolean;
  tasksList: ITasks[];
  handleOnFilter: (formData: object) => void;
  closeFilterOverlay: () => void;
}
const TaskList: React.FC<IProps> = ({
  visibility,
  closeOverlay,
  tasksList,
  handleOnFilter,
  closeFilterOverlay,
}) => {
  const [taskType, setTaskType] = useState<[string]>();
  const [taskPriority, setTaskPriority] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [taskStatus, setTaskStatus] = useState<[string]>();
  const [fileterView, setFileterView] = useState(false);
  const initialValues: {
    taskType: Array<string>;
    taskPriority: Array<string>;
    taskStatus: Array<string>;
    assignees: string;
  } = {
    taskType: [],
    taskPriority: [],
    taskStatus: [],
    assignees: '',
  };
  const validationSchema = Yup.object().shape({
    taskType: Yup.array().min(1),
    taskPriority: Yup.array().min(1),
    taskStatus: Yup.array().min(1),
    assignees: Yup.string().required('please select the issue assignee'),
  });
  const closeTaskView = () => {
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
  let usersList = [
    { _id: '', name: 'please select the assignee for the issue' },
  ];
  useEffect(() => {
    if (router.isReady) {
      getTasksTypes(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskType(response.result);
        }
      });
      getTasksPriority(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskPriority(response.result);
        }
      });
      getProjectUsers(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setProjectUsers(response.result);
          }
        })
        .catch();
      getTaskStatus(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          setTaskStatus(response.result);
        }
      });
    }
  }, []);
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
      } top-10     bg-gray-200 right-0 z-10 overflow-x-hidden`}
    >
      <div className=" overflow-y-auto ">
        <div className="flex justify-between border-b border-black border-solid">
          <div>
            <h1>{!fileterView ? 'Task List' : 'Filters'}</h1>
          </div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => {
                if (fileterView === false) {
                  closeTaskView();
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
              ></FontAwesomeIcon>
            </div>
            <div className="mr-2">
              {' '}
              <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>{' '}
            </div>
          </div>
        </div>
        {!fileterView ? (
          <div>
            {tasksList.length >= 1
              ? tasksList.map((taskInfo: ITasks) => {
                  return (
                    <div className="h-full mt-2 w-full" key={taskInfo._id}>
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
                                  <h5>{taskInfo.title}</h5>
                                </div>
                                <div className="flex">
                                  <p className="mr-1">{taskInfo.status}</p>|
                                  <p className="ml-1">{taskInfo.priority}</p>
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
                                  {taskInfo.assignees[0].firstName}
                                </p>
                                <FontAwesomeIcon
                                  icon={faCalendar}
                                  className="text-gray-500 ml-2"
                                />
                                <p className="text-gray-500 -mt-1 ml-1">
                                  {Moment(taskInfo.createdAt).format(
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
                      <h5 className="text-gray-500">Task Type</h5>
                    </div>
                    {taskType &&
                      taskType.map((option) => (
                        <div key={option}>
                          <Field
                            type="checkbox"
                            name="taskType"
                            id={option}
                            value={option}
                          />
                          <label htmlFor={option}>{option}</label>
                        </div>
                      ))}
                    <ErrorMessage
                      name="taskType"
                      component="div"
                      className="alert alert-danger"
                    />
                    <div>
                      <h5 className="text-gray-500">Task Priority</h5>
                    </div>
                    {taskPriority &&
                      taskPriority.map((option) => (
                        <div key={option}>
                          <Field
                            type="checkbox"
                            name="taskPriority"
                            id={option}
                            value={option}
                          />
                          <label htmlFor={option}>{option}</label>
                        </div>
                      ))}
                    <ErrorMessage
                      name="taskPriority"
                      component="div"
                      className="alert alert-danger"
                    />
                    <div>
                      <h5 className="text-gray-500">Task Status</h5>
                    </div>
                    {taskStatus &&
                      taskStatus.map((option) => (
                        <div key={option}>
                          <Field
                            type="checkbox"
                            name="taskStatus"
                            id={option}
                            value={option}
                          />
                          <label htmlFor={option}>{option}</label>
                        </div>
                      ))}
                    <ErrorMessage
                      name="taskStatus"
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
              'There is no data available to filter the task list'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
