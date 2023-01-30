import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { getTasksTypes, getTasksPriority } from '../../../../services/task';
import { ErrorMessage, Field, Form, Formik } from 'formik';
interface IProps {
  closeOverlay: () => void;
  visibility: boolean;
  handleTaskSubmit: (formObj: object) => void;
}
const TaskCreate: React.FC<IProps> = ({
  closeOverlay,
  visibility,
  handleTaskSubmit,
}) => {
  const router = useRouter();
  const [taskType, setTaskType] = useState<[string]>();
  const [taskPriority, setTaskPriority] = useState<[string]>();
  const [tast, setTask] = useState<[string]>();
  useEffect(() => {
    if (router.isReady) {
      getTasksTypes(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          response.result.push('Please select the task type');
          setTaskType(response.result);
        }
      });
      getTasksPriority(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          response.result.push('Please select the task priority');
          setTaskPriority(response.result);
        }
      });
    }
  }, [router.isReady, router.query.projectId]);

  const closeTaskCreate = () => {
    closeOverlay();
  };
  const initialValues: {
    type: string;
    priority: string;
    description: string;
    assignees: string;
    tags: string;
    date: string;
  } = {
    type: 'Please select the task type',
    priority: 'Please select the task priority',
    description: '',
    assignees: '',
    tags: '',
    date: '',
  };
  const validationSchema = Yup.object().shape({
    type: Yup.string(),
    priority: Yup.string(),
    description: Yup.string(),
    assignees: Yup.string(),
    tags: Yup.string(),
    date: Yup.string(),
  });
  return (
    <div
      className={`fixed ${
        visibility ? ' calc-h' : 'w-0'
      } top-10  bg-gray-200 right-0 z-10 overflow-x-hidden`}
    >
      <div>
        <div className="flex h-8 justify-between border-b border-black border-solid">
          <div>
            <h1>Create Task</h1>
          </div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={closeTaskCreate}
              className="hover:white cursor-pointer mr-2 "
            ></FontAwesomeIcon>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleTaskSubmit}
        >
          {({ errors, touched }) => (
            <Form className=" grid grid-cols-1 gap-y-2 px-4">
              <div>
                <h1 className="text-gray-500">Select the Type of Task</h1>
                <Field
                  as="select"
                  name="type"
                  id="type"
                  className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                >
                  {taskType &&
                    taskType.map((option: any) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </Field>
                {errors.type && touched.type ? <div>{errors.type}</div> : null}
              </div>
              <div>
                <div>
                  <h5 className="text-gray-500">
                    Tell us more about this Task.
                  </h5>
                </div>
                <div>
                  <Field
                    component="textarea"
                    className="block w-full text-sm border border-solid border-gray-600 rounded"
                    name="description"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-gray-500">Select Issue Priority</h1>
                <Field
                  as="select"
                  name="priority"
                  id="priority"
                  className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                >
                  {taskPriority &&
                    taskPriority.map((option: any) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </Field>
                {errors.priority && touched.priority ? (
                  <div>{errors.priority}</div>
                ) : null}
              </div>
              <div>
                <div>
                  <h5 className="text-gray-500">Assigned To</h5>
                </div>
                <div>
                  <Field
                    className="rounded p-0.5 border border-solid border-gray-600 w-full"
                    type="text"
                    placeholder="Assigned To"
                    name="assignees"
                  />
                  <ErrorMessage
                    name="name"
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
                    className=" w-full text-sm border border-solid border-gray-600 rounded p-2"
                  />
                  <ErrorMessage
                    name="name"
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
                  <Field
                    component="textarea"
                    className="block w-full border border-solid border-gray-600 text-sm  rounded  "
                    name="tags"
                  />
                  <ErrorMessage
                    name="name"
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
                  Add Task
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TaskCreate;
