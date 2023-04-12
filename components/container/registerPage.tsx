import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, ErrorMessage } from 'formik';
import showPwdImg from '../../public/icons/show-password.svg';
import hidePwdImg from '../../public/icons/hide-password.svg';
import SubmitButtons from '../core/buttons/submitButton';
import InputPassword from '../core/Input/inputPassword';
import InputText from '../core/Input/inputText';
import NextImage from '../core/Image';
import Image from 'next/image';
import router from 'next/router';
interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface IProps {
  loading: boolean;
  handleRegister: (
    e: FormValues,
    {
      resetForm,
    }: {
      resetForm: (nextValues?: Partial<FormValues>) => void;
    }
  ) => void;
}
const Loginpage: React.FC<IProps> = ({ loading, handleRegister }) => {
  const initialValues: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  } = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First name is required')
      .matches(/[a-zA-Z]/, 'Atleast one letter is reqired')
      .matches(/^[^0-9]+$/, 'Number is not allowed'),
    lastName: Yup.string()
      .required('Last name is required')
      .matches(/[a-zA-Z]/, 'Atleast one letter is reqired')
      .matches(/^([^0-9]*)$/, 'Number is not allowed'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
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
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const [isCRevealPwd, setIsCRevealPwd] = useState(false);
  const [active, setActive] = useState('');
  const h = (e: any) => {
    setIsRevealPwd(!isRevealPwd);
    setActive(e.target.id);
  };

  return (
    <div className=" w-full  ">
      <NextImage
        src="https://constructn-attachments.s3.ap-south-1.amazonaws.com/Login/login02.png"
        className="h-screen w-screen"
      />

      <div className=" absolute w-3/4 top-0 bg-opacity-50 px-5 h-full 2xl:w-1/4 xl:w-1/3 lg:w-2/5 md:w-1/2 sm:w-1/2 right-0   place-items-center bg-gray-300 ">
        <div className="grid grid-cols-1 gap-4 border my-20   border-solid place-content-center border-gray-500 rounded-3xl ">
          <h2 className="text-center text-xl font-bold">Register</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            <Form className=" grid grid-cols-1 gap-y-2 px-4">
              <div>
                <InputText
                  type="text"
                  placeholderName="First Name"
                  name="firstName"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="alert alert-danger text-red-600"
                />
              </div>
              <div>
                <InputText
                  type="text"
                  placeholderName="Last Name"
                  name="lastName"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="alert alert-danger  text-red-600"
                />
              </div>
              <div>
                <InputText type="email" placeholderName="Email" name="email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="alert alert-danger  text-red-600"
                />
              </div>
              <div className="relative">
                <InputPassword
                  name="password"
                  type={isRevealPwd}
                  placeholderName="Password"
                />
                <div className="absolute p-3 inset-y-0 right-0">
                  <Image
                    alt=""
                    title={isRevealPwd ? 'Hide password' : 'Show password'}
                    src={isRevealPwd ? hidePwdImg : showPwdImg}
                    onClick={() => setIsRevealPwd((prevState) => !prevState)}
                  />
                </div>
                <ErrorMessage
                  name="password"
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
                  className={`${
                    active === 'confirm password'
                  } absolute p-3 inset-y-0 right-0`}
                  id="confirm password"
                >
                  <Image
                    alt=""
                    title={isCRevealPwd ? 'Hide password' : 'Show password'}
                    src={isCRevealPwd ? hidePwdImg : showPwdImg}
                    onClick={() => setIsCRevealPwd((prevState) => !prevState)}
                  />
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="alert alert-danger text-red-600"
                />
              </div>
              <div className="py-2 grid grid-cols-1 gap-2">
                <SubmitButtons buttonName="Register" disabled={loading} />
              </div>
            </Form>
          </Formik>
          <button onClick={() => router.push('/login')}>Back To Login</button>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
