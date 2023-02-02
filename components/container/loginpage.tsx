import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, ErrorMessage } from 'formik';
import showPwdImg from '../../public/icons/show-password.svg';
import hidePwdImg from '../../public/icons/hide-password.svg';
import SubmitButtons from '../core/buttons/submitButton';
import InputPassword from '../core/Input/inputPassword';
import InputText from '../core/Input/inputText';
import InputCheckBox from '../core/Input/inputCheckBox';
import NextImage from '../core/Image';
import Image from 'next/image';
import OkButton from '../core/buttons/okButton';
import { useRouter } from 'next/router';
interface IProps {
  loading: boolean;
  buttonName: string;
  message: string;
  handleLogin: (e: { email: string; password: string }) => void;
}
const Loginpage: React.FC<IProps> = ({ message, loading, handleLogin }) => {
  const router = useRouter();
  const initialValues: {
    email: string;
    password: string;
  } = {
    email: '',
    password: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please Enter The Email !'),
    password: Yup.string().required('Please Enter The Password!'),
  });
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  return (
    <div className=" w-full   ">
      <NextImage
        src="https://constructn-attachments.s3.ap-south-1.amazonaws.com/Login/login02.png"
        className="h-screen w-screen"
      />

      <div className=" absolute  2xl:w-1/5 xl:w-1/4 lg:w-1/4    md:w-2/4 px-4 sm:w-1/2   top-0 bg-opacity-50  h-full right-0 place-items-center  bg-gray-300 ">
        <div className="grid grid-cols-1 gap-2 border   my-50 border-solid place-content-center border-gray-500 rounded-3xl ">
          <h2 className="text-center text-xl">User Login</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            <Form className=" grid grid-cols-1 gap-y-4 px-4">
              <div>
                <InputText type="email" placeholderName="Email" name="email" />
                <ErrorMessage name="email" component="div" className="" />
              </div>
              <div className="relative">
                <InputPassword
                  name="password"
                  type={isRevealPwd}
                  placeholderName="password"
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
                  className="alert alert-danger"
                />
              </div>

              <div className=" ">
                <InputCheckBox checkBoxName="Remember me"></InputCheckBox>
              </div>
              <div className="py-5 grid grid-cols-1 gap-2">
                <SubmitButtons buttonName="Log In" disabled={loading} />
                <OkButton
                  buttonName="Register"
                  disabled={false}
                  clickTheOkButton={() => {
                    router.push('/register');
                  }}
                />
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
  );
};

export default Loginpage;
