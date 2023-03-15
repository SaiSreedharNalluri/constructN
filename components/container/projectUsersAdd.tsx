import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { IProjectUsers } from '../../models/IProjects';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { role, roleData } from '../../utils/constants';
import { getCookie } from 'cookies-next';
import { Modal } from 'react-responsive-modal';
import Image from 'next/image';
import router from 'next/router';
import { toast } from 'react-toastify';
import { assignProjectUser } from '../../services/project';
interface IProps {
  projectUsers: IProjectUsers[];
  setProjectUsers: React.Dispatch<React.SetStateAction<IProjectUsers[]>>;
  deassignProjectUser: (e: string) => void;
  updateUserRole: (e: { email: 'string'; role: 'string' }) => void;
}
const ProjectUserAdd: React.FC<IProps> = ({
  projectUsers,
  setProjectUsers,
  deassignProjectUser,
  updateUserRole,
}) => {
  const [open, setOpen] = useState(false);
  const [loggedInUserId, SetLoggedInUserId] = useState('');
  const [email, setEmail] = useState('');
  const [selectRole, setSelectRole] = useState<any>();
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
  const addProjectUser = (
    userInfo: { email: string; role: string },
    { resetForm }: FormikHelpers<{ email: string; role: string }>
  ) => {
    assignProjectUser(userInfo, router.query.projectId as string)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
          resetForm();
          setProjectUsers(response?.result);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  return (
    <React.Fragment>
      <div>
        <h1 className="font-bold px-4">Add Users</h1>
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
                  id="email"
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
              <div className="ml-2">
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
      </div>
      <div className="w-full h-full">
        <div className="  px-4 ">
          <div>
            <div className=" py-2 ">
              <div className="w-full shadow overflow-x-auto  border-b border-gray-200">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200  text-gray-500 uppercase ">
                      <th className="px-6 py-3 text-left font-medium">Name</th>
                      <th className="px-6 py-3 text-left font-medium">Role</th>
                      <th className="px-6 py-3 text-left font-medium">
                        Delete
                      </th>
                      <th className="px-6 py-3 text-left font-medium">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectUsers &&
                      projectUsers.map((pUserData: any) => {
                        return (
                          <tr key={pUserData._id}>
                            <td className="px-6  border-b border-gray-200">
                              <div className="flex  text-gray-900">
                                <div className="w-6 h-6 mt-2 mr-2 mb-2 rounded-full overflow-hidden border-1 dark:border-white border-gray-900">
                                  <Image
                                    src={
                                      pUserData.user.avatar
                                        ? pUserData.user.avatar
                                        : 'https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/defaults/user_icon_def_01.png'
                                    }
                                    alt=""
                                    className={`w-full h-full cursor-pointer object-cover `}
                                    height={1920}
                                    width={1080}
                                  />
                                </div>
                                <div className="mt-2">
                                  {pUserData.user.fullName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6  border-b border-gray-200">
                              <div className="flex items-center">
                                <select
                                  disabled
                                  id={pUserData.user._id}
                                  className="bg-gray-50 border p-1 border-gray-300 text-gray-900 text-sm rounded"
                                  defaultValue={pUserData.role}
                                  onChange={(e: any) => {
                                    updateUserRole({
                                      email: pUserData.user.email,
                                      role: e.target.value,
                                    });
                                    const fileInput = document.getElementById(
                                      pUserData.user._id
                                    ) as HTMLInputElement;
                                    if (fileInput) {
                                      fileInput.disabled = true;
                                    }
                                    setSelectRole(undefined);
                                  }}
                                >
                                  {roleData.map((option: any) => (
                                    <option key={option.id} value={option.id}>
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                            <td className="px-6   border-b border-gray-200">
                              <div className=" text-gray-900">
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
                            </td>
                            <td className="px-6   border-b border-gray-200">
                              <div className=" text-gray-900">
                                {projectUsers.length > 1 &&
                                  loggedInUserId != pUserData.user._id && (
                                    <FontAwesomeIcon
                                      className="ml-2 text-gray-600 cursor-pointer"
                                      icon={faPen}
                                      onClick={() => {
                                        if (selectRole) {
                                          const fileInput =
                                            document.getElementById(
                                              selectRole.user._id
                                            ) as HTMLInputElement;
                                          if (fileInput) {
                                            fileInput.disabled = true;
                                            setSelectRole(undefined);
                                          }
                                          setSelectRole(pUserData);
                                        } else {
                                          setSelectRole(pUserData);
                                        }
                                        const fileInput =
                                          document.getElementById(
                                            pUserData.user._id
                                          ) as HTMLInputElement;
                                        if (fileInput) {
                                          fileInput.disabled = false;
                                        }
                                      }}
                                    />
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
    </React.Fragment>
  );
};

export default ProjectUserAdd;
