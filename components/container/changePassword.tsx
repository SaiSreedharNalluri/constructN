import React, { useState } from 'react';
import { Formik, Form, ErrorMessage, FormikHelpers } from 'formik';
import showPasswordImage from '../../public/icons/show-password.svg';
import hidePasswordImage from '../../public/icons/hide-password.svg';
import Image from 'next/image';
import * as Yup from 'yup';
import InputPassword from '../core/Input/inputPassword';
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
      .required('Password is required')
      .min(8, 'Minimum 8 characters required')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w\s]/, 'Password requires a symbol')
      .matches(
        /^[^\s].*[^\s]$/,
        'Spaces are not allowed at the beginning, end of the password'
      ),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
  });
  const [show, setShow] = useState(false);
  const [revealPwd, setRevealPwd] = useState(false);
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const [isCRevealPwd, setIsCRevealPwd] = useState(false);
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
          className="ml-2 p-2 w-1/12 bg-gray-500 hover:bg-gray-400   rounded-md"
          onClick={() => {
            setShow(true);
          }}
        >
          change
        </button>
      </div>
      {show && (
        <div>
          <div>
            <div>
              <h2 className="text-center text-xl font-bold">Change Password</h2>
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
                      className="alert alert-danger text-red-600"
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
                      className="alert alert-danger  text-red-600"
                    />
                  </div>

                  <div className="relative">
                    <InputPassword
                      name="confirmPassword"
                      type={isCRevealPwd}
                      placeholderName="Confirm Password"
                    />
                    <div
                      className="absolute p-3 inset-y-0 right-0"
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
                    <button
                      type="submit"
                      className="p-2 w-full bg-gray-500 hover:bg-gray-400  rounded-md"
                    >
                      Confirm
                    </button>
                    <button
                      type="submit"
                      onClick={() => {
                        setShow(false);
                      }}
                      className="p-2 w-full bg-gray-500 hover:bg-gray-400  rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
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
