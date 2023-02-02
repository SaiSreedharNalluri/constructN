import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { createIssue, getIssuesPriority, getIssuesTypes } from '../../../../services/issue';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getProjectUsers } from '../../../../services/project';
import { IProjectUsers } from '../../../../models/IProjects';
import { toast } from 'react-toastify';
import { ISnapshot } from '../../../../models/ISnapshot';
import { IStructure } from '../../../../models/IStructure';
import { getCookie } from 'cookies-next';
import { IToolResponse } from '../../../../models/ITools';
interface IProps {
  closeOverlay: () => void;
  visibility: boolean;
  handleIssueSubmit: (formData: object) => void;
  currentStructure:IStructure;
  currentSnapshot:ISnapshot;
  currentProject:string;
  contextInfo:IToolResponse;
}

const IssueCreate: React.FC<IProps> = ({
  closeOverlay,
  visibility,
  handleIssueSubmit,
  currentProject,
  currentSnapshot,
  currentStructure,
  contextInfo,
}) => {
  const router = useRouter();
  const [myVisbility,setMyVisibility]=useState(visibility);
  const [myContext,setMyContext] = useState<IToolResponse>(contextInfo);
  const [issueType, setIssueType] = useState<[string]>();
  const [issuePriority, setIssuePriority] = useState<[string]>();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  let usersList = [
    { _id: '', name: 'please select the assignee for the issue' },
  ];
  const [myProject,setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  const [loggedInUserId,SetLoggedInUserId] = useState('');

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
      getProjectUsers(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setProjectUsers(response.result);
          }
        })
        .catch();
    }
  const userObj: any = getCookie('user');
  let user = null;
  if (userObj) user = JSON.parse(userObj);
  if (user?._id) {
    SetLoggedInUserId(user._id);
  }
  }, [router.isReady, router.query.projectId]);

  useEffect(
    ()=>{

      setMyProject(currentProject);
      setMyStructure(currentStructure);
      setMySnapshot(currentSnapshot);
   
    },
    [currentProject,currentSnapshot,currentStructure]
  );
  useEffect(()=>{
    setMyVisibility(visibility);
    console.log("finally My Visibility is ",visibility);
  },[visibility]);

  useEffect(()=>{
    setMyContext(contextInfo);
    console.log("Updated Context ",contextInfo);
  },[contextInfo]);

  const closeIssueCreate = () => {
    closeOverlay();
  };
  const clickIssueSubmit = (formData: any) => {
    formData.structure = myStructure?._id;
    formData.title = `${myStructure?.name}_${formData.date} `;
    formData.snapshot = mySnapshot?._id;
    formData.owner = loggedInUserId;
    formData.status = 'To Do';
    formData.context = myContext;
    createIssue(router.query.projectId as string, formData)
      .then((response) => {
        if (response.success === true) {
          toast.success('Issue is added sucessfully');
          handleIssueSubmit(formData);
          console.log(formData);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };

  const initialValues: {
    type: string;
    priority: string;
    description: string;
    assignees: string;
    tags: string;
    date: string;
    context: IToolResponse;
  } = {
    type: 'Please select the issue type',
    priority: 'Please select the issue priority',
    description: '',
    assignees: 'Please select the issue assignee',
    tags: '',
    date: '',
    context:myContext,
  };
  const validationSchema = Yup.object().shape({
    type: Yup.string(),
    priority: Yup.string(),
    description: Yup.string(),
    assignees: Yup.string(),
    tags: Yup.string(),
    date: Yup.string(),
  });
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
      className={`fixed calc-h top-10 ${
        myVisbility ? 'w-1/4 ' : ' w-0'
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
          {({ errors, touched }) => (
            <Form className=" grid grid-cols-1 gap-y-2 px-4">
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
                {errors.type && touched.type ? <div>{errors.type}</div> : null}
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
                    name="name"
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
                  {errors.priority && touched.priority ? (
                    <div>{errors.priority}</div>
                  ) : null}
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
