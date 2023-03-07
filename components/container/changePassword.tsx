import React, { useState } from 'react';
import { Formik, Form, ErrorMessage, FormikHelpers } from 'formik';
import showPasswordImage from '../../public/icons/show-password.svg';
import hidePasswordImage from '../../public/icons/hide-password.svg';
import Image from 'next/image';
import * as Yup from 'yup';
import SubmitButton from '../core/buttons/submitButton';
import InputPassword from '../core/Input/inputPassword';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { changePassword } from '../../services/userAuth';
import { toast } from 'react-toastify';

const ChangePassword: React.FC = () => {
  const initialValues = {
    currentPassword: '',
    new_password: '',
    confirmPassword: '',
  };
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    new_password: Yup.string()
      .required('New Password is required')
      .min(8, 'Minimum 8 characters required')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [revealPwd, setRevealPwd] = useState(false);
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const [isCRevealPwd, setIsCRevealPwd] = useState(false);
  const [active, setActive] = useState('');
  const h = (e: any) => {
    setIsRevealPwd(!isRevealPwd);
    setActive(e.target.id);
  };

  const changeUserPassword = (
    values: {
      currentPassword: string;
      new_password: string;
      confirmPassword: string;
    },
    {
      resetForm,
    }: FormikHelpers<{
      currentPassword: string;
      new_password: string;
      confirmPassword: string;
    }>
  ) => {
    changePassword({
      password: values.currentPassword,
      new_password: values.new_password,
    })
      .then((response) => {
        if (response.success === true) {
          setShow(false);
          toast.success('user password changed successfully');
          resetForm();
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error.message);
        } else {
          toast.error('failed to changed the password');
        }
      });
  };
  return (
    <div>
      <div className="mt-3 flex">
        <h1 className="font-bold">ChangePassword</h1>
        <button
          className="ml-2 p-2 w-1/12 bg-blue-500 hover:bg-gray-400  rounded-md"
          onClick={() => {
            setShow(true);
          }}
        >
          change
        </button>
      </div>
      {show && (
        <div className="w-full">
          <div className=" absolute w-full top-0 bg-opacity-50 px-5 h-full 2xl:w-full xl:w-1/3 lg:w-1/4 md:w-1/2 sm:w-1/2   place-items-center ">
            <div className="grid grid-cols-1 gap-4 border my-48   border-solid place-content-center border-gray-500 rounded-3xl ">
              <div className="flex flex-grow ">
                <h2 className="ml-10 text-xl font-bold">Change Password</h2>
                <FontAwesomeIcon
                  icon={faTimes}
                  onClick={() => {
                    setShow(false);
                  }}
                  className="hover:white cursor-pointer w-10 h-10 "
                />
              </div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={changeUserPassword}
              >
                <Form className=" grid grid-cols-1 gap-y-2 px-4">
                  <div className="relative">
                    <InputPassword
                      name="currentPassword"
                      type={revealPwd}
                      placeholderName="Current Password"
                    />
                    <div className="absolute p-3 inset-y-0 right-0">
                      <Image
                        alt=""
                        title={revealPwd ? 'Hide password' : 'Show password'}
                        src={revealPwd ? hidePasswordImage : showPasswordImage}
                        onClick={() => setRevealPwd((prevState) => !prevState)}
                      />
                    </div>
                    <ErrorMessage
                      name="currentPassword"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="relative">
                    <InputPassword
                      name="new_password"
                      type={isRevealPwd}
                      placeholderName="New Password"
                    />
                    <div className="absolute p-3 inset-y-0 right-0">
                      <Image
                        alt=""
                        title={isRevealPwd ? 'Hide password' : 'Show password'}
                        src={
                          isRevealPwd ? hidePasswordImage : showPasswordImage
                        }
                        onClick={() =>
                          setIsRevealPwd((prevState) => !prevState)
                        }
                      />
                    </div>
                    <ErrorMessage
                      name="new_password"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="relative">
                    <InputPassword
                      name="confirmPassword"
                      type={isCRevealPwd}
                      placeholderName="Confirm Password"
                    />
                    <div
                      className={`${
                        active === 'confirm password'
                      } absolute p-3 inset-y-0 right-0`}
                      id="confirm password"
                    >
                      <Image
                        alt=""
                        title={isCRevealPwd ? 'Hide password' : 'Show password'}
                        src={
                          isCRevealPwd ? hidePasswordImage : showPasswordImage
                        }
                        onClick={() =>
                          setIsCRevealPwd((prevState) => !prevState)
                        }
                      />
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="py-2 grid grid-cols-1 gap-2">
                    <SubmitButton buttonName="Confirm" disabled={loading} />
                  </div>
                  {message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {message}
                      </div>
                    </div>
                  )}
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChangePassword;
