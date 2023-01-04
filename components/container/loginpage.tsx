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
interface IProps {
  loading: boolean;
  buttonName: string;
  message: string;
  handleLogin: (e: { email: string; password: string }) => void;
}
const Loginpage: React.FC<IProps> = ({ message, loading, handleLogin }) => {
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
    <div className="flex  w-full   ">
      <div className="w-1/2   ">
        <NextImage
          src="https://techmoran.com/wp-content/uploads/2020/05/construction.jpg"
          className="h-screen w-screen"
        />
      </div>
      <div className=" w-1/2 bg-gray-200">
        <div className="ml-32 ">
          <div className="border border-solid border-gray-500 w-1/2 rounded-3xl mt-12 h-82 bg-gray-300">
            <h2 className="text-center mt-4">User Login</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              <Form className=" mt-4 ml-4 ">
                <div>
                  <InputText
                    type="email"
                    placeholderName="Email"
                    name="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="mt-4 flex flex-col">
                  <div>
                    <InputPassword
                      name="password"
                      type={isRevealPwd}
                      placeholderName="password"
                    />
                    <Image
                      height={1080}
                      width={1920}
                      className="h-7 w-8 ml-auto -mt-10 mr-5 "
                      alt=""
                      title={isRevealPwd ? 'Hide password' : 'Show password'}
                      src={isRevealPwd ? hidePwdImg : showPwdImg}
                      onClick={() => setIsRevealPwd((prevState) => !prevState)}
                    />
                  </div>
                  <div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger mt-3"
                    />
                  </div>
                </div>
                <div className=" ">
                  <InputCheckBox checkBoxName="Remember me"></InputCheckBox>
                </div>
                <div className="">
                  <SubmitButtons buttonName="Log In" disabled={loading} />
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
    </div>
  );
};

export default Loginpage;
