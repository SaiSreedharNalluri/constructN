import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { IProjectUsers } from '../../models/IProjects';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { role } from '../../utils/constants';
import { getCookie } from 'cookies-next';
import { Modal } from 'react-responsive-modal';
interface IProps {
  projectUsers: IProjectUsers[];
  addProjectUser: (e: object) => void;
  deassignProjectUser: (e: string) => void;
}
const ProjectUserAdd: React.FC<IProps> = ({
  projectUsers,
  addProjectUser,
  deassignProjectUser,
}) => {
  const [open, setOpen] = useState(false);
  const [loggedInUserId, SetLoggedInUserId] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    const userObj: any = getCookie('user');
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?._id) {
      SetLoggedInUserId(user._id);
    }
  }, []);

  const initialValues: {
    email: string;
    role: string;
  } = {
    email: '',
    role: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    role: Yup.string().required('Please select the role'),
  });
  const handleDeleteItem = () => {
    deassignProjectUser(email);
    setOpen(false);
  };
  return (
    <React.Fragment>
      <div className="w-full  grid grid-cols-1  gap-y-4 px-4 py-4">
        <h1 className='font-bold px-4'>Add Users</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={addProjectUser}
        >
          {({ errors, touched }) => (
            <Form className=" grid grid-cols-3 gap-2 px-4">

              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="email "
                  className="w-full rounded border px-2 py-1.5 border-solid border-gray-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="alert alert-danger"
                />
              </div>
              <div>
                <Field
                  as="select"
                  name="role"
                  id="role"
                  className="border border-solid border-gray-500 w-full px-2 py-1.5 rounded"
                >
                  {role.map((option: any) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Field>
                {errors.role && touched.role ? <div>{errors.role}</div> : null}
              </div>
              <div className='ml-2' >
                <button
                  className="bg-gray-500 rounded hover:bg-gray-300 text-white  py-1.5 px-2 "
                  type="submit"
                >
                  Add User
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="h-20 overflow-y-auto w-8/12 px-4 ">
          {projectUsers &&
            projectUsers.map((pUserData: any) => {
              return (
                <div className="flex justify-between mr-2" key={pUserData._id}>
                  <p>{pUserData.user.fullName} </p>
                  <div>
                    {projectUsers.length > 1 &&
                      loggedInUserId != pUserData.user._id && (
                        <FontAwesomeIcon
                          className="ml-2 text-gray-600 cursor-pointer"
                          icon={faTrash}
                          onClick={() => {
                            setEmail(pUserData.user.email);
                            setOpen(true);
                          }}
                        />
                      )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div>
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <h1>Delete Project User Conformation</h1>
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
    </React.Fragment>
  );
};

export default ProjectUserAdd;
