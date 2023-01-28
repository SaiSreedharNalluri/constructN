import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { getIssuesPriority, getIssuesTypes } from '../../../../services/issue';
import { Formik, Form, Field, ErrorMessage } from 'formik';
interface IProps {
  closeOverlay: () => void;
  visibility: boolean;
  handleIssueSubmit: (formData: object) => void;
}

const IssueCreate: React.FC<IProps> = ({
  closeOverlay,
  visibility,
  handleIssueSubmit,
}) => {
  const router = useRouter();
  const [issueType, setIssueType] = useState<[string]>();
  const [issuePriority, setIssuePriority] = useState<[string]>();
  useEffect(() => {
    if (router.isReady) {
      getIssuesTypes(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          response.result.push('Please select the issue type');
          setIssueType(response.result);
        }
      });
      getIssuesPriority(router.query.projectId as string).then((response) => {
        if (response.success === true) {
          response.result.push('Please select the issue priority');
          setIssuePriority(response.result);
        }
      });
    }
  }, [router.isReady, router.query.projectId]);
  const closeIssueCreate = () => {
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
    type: 'Please select the issue type',
    priority: 'Please select the issue priority',
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
      className={`fixed top-10 ${
        visibility ? 'w-/14 h-screen' : 'w-0'
      }  bg-gray-200 right-0 border border-solid border-black z-10 overflow-x-hidden`}
    >
      <div>
        <div className="flex  h-8 justify-between border-b border-black border-solid">
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
          onSubmit={handleIssueSubmit}
        >
          {({ errors, touched }) => (
            <Form className=" grid grid-cols-1 gap-y-2 px-4">
              <div className="mt-2 ml-6 ">
                <h1 className="text-gray-500">Select the Type of Issue</h1>
                <Field
                  as="select"
                  name="type"
                  id="type"
                  className="border border-solid border-gray-500 w-8/12 px-2 py-1.5 rounded"
                >
                  {issueType &&
                    issueType.map((option: any) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </Field>
                {errors.type && touched.type ? <div>{errors.type}</div> : null}
              </div>
              <div className="ml-6 mt-1">
                <div>
                  <h5 className="text-gray-500">Issue description.</h5>
                </div>
                <div>
                  <Field
                    component="textarea"
                    className="block w-10/12 text-sm border border-solid border-gray-600 rounded-lg"
                    name="description"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
              </div>
              <div className="mt-1 ml-6 ">
                <h1 className="text-gray-500">Select Priority of the Issue</h1>
                <Field
                  as="select"
                  name="priority"
                  id="priority"
                  className="border border-solid border-gray-500 w-8/12 px-2 py-1.5 rounded"
                >
                  {issuePriority &&
                    issuePriority.map((option: any) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </Field>
                {errors.priority && touched.priority ? (
                  <div>{errors.priority}</div>
                ) : null}
              </div>
              <div className="ml-6 mt-1">
                <div>
                  <h5 className="text-gray-500">Assigned To</h5>
                </div>
                <div>
                  <Field
                    className="rounded p-0.5 border border-solid border-gray-600 w-10/12"
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
              <div className=" mt-1 ml-6">
                <div className="flex w-10/12">
                  <div className="w-1/2 text-gray-500 ">Date</div>
                  <Field
                    type="date"
                    name="date"
                    className="block w-11/12 text-sm border border-solid border-gray-600 rounded-lg"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
              </div>
              <div className="ml-6 mt-1">
                <div>
                  <h5 className="text-gray-500">Tags</h5>
                </div>
                <div>
                  <Field
                    component="textarea"
                    className="block w-10/12 border border-solid border-gray-600 text-sm  rounded-lg  "
                    name="tags"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
              </div>
              <div className="w-10/12 ml-6">
                <button
                  type="submit"
                  className="p-2 w-11/12 mt-2 bg-gray-500  rounded-md "
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
