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
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

    // <div className="h-screen relative">
    //   <div className={` w-full relative `}>
    //     <img src="https://constructn-attachments.s3.ap-south-1.amazonaws.com/Login/login02.png" className="h-screen w-screen" />
    //     <div className={`absolute  right-0  inset-y-1/2 w-1/4  `} >
    //       <div className="border border-solid border-gray-500  rounded-3xl  h-82 ">
    //         <h2 className="text-center mt-4">User Login</h2>
    //         <Formik
    //           initialValues={initialValues}
    //           validationSchema={validationSchema}
    //           onSubmit={handleLogin}
    //         >
    //           <Form className=" mt-4 ml-4 ">
    //             <div>
    //               <InputText
    //                 type="email"
    //                 placeholderName="Email"
    //                 name="email"
    //               />
    //               <ErrorMessage
    //                 name="email"
    //                 component="div"
    //                 className="alert alert-danger"
    //               />
    //             </div>
    //             <div className=" mt-4">
    //               <div>
    //                 <InputPassword
    //                   name="password"
    //                   type={isRevealPwd}
    //                   placeholderName="password"
    //                 />
    //                 <div className='w-11/12 justify-end flex  relative'>
    //                   <Image
    //                     className="h-7 w-8  absolute bottom-1 "
    //                     alt=""
    //                     title={isRevealPwd ? 'Hide password' : 'Show password'}
    //                     src={isRevealPwd ? hidePwdImg : showPwdImg}
    //                     onClick={() => setIsRevealPwd((prevState) => !prevState)}
    //                   />
    //                 </div>

    //               </div>
    //               <div>
    //                 <ErrorMessage
    //                   name="password"
    //                   component="div"
    //                   className="alert alert-danger mt-3"
    //                 />
    //               </div>
    //             </div>
    //             <div className=" ">
    //               <InputCheckBox checkBoxName="Remember me"></InputCheckBox>
    //             </div>
    //             <div className="">
    //               <SubmitButtons buttonName="Log In" disabled={loading} />
    //             </div>
    //             {message && (
    //               <div className="form-group">
    //                 <div className="alert alert-danger" role="alert">
    //                   {message}
    //                 </div>
    //               </div>
    //             )}
    //           </Form>
    //         </Formik>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    // <div className='w-full h-screen flex ' >
    //   <div className='bg-constructn-image flex-1 bg-center bg-no-repeat bg-cover'>

    //     <div className="  border border-solid bg-gray-300 border-gray-500    rounded-2xl   ">
    //       {/* <h2 className="text-center mt-4">User Login</h2>
    //       <Formik
    //         initialValues={initialValues}
    //         validationSchema={validationSchema}
    //         onSubmit={handleLogin}
    //       >
    //         <Form className=" mt-4 ml-4 ">
    //           <div>
    //             <InputText
    //               type="email"
    //               placeholderName="Email"
    //               name="email"
    //             />
    //             <ErrorMessage
    //               name="email"
    //               component="div"
    //               className="alert alert-danger"
    //             />
    //           </div>
    //           <div className=" mt-4">
    //             <div>
    //               <InputPassword
    //                 name="password"
    //                 type={isRevealPwd}
    //                 placeholderName="password"
    //               />
    //               <div className='w-11/12 justify-end flex  relative'>
    //                 <Image
    //                   className="h-7 w-8  absolute bottom-1 "
    //                   alt=""
    //                   title={isRevealPwd ? 'Hide password' : 'Show password'}
    //                   src={isRevealPwd ? hidePwdImg : showPwdImg}
    //                   onClick={() => setIsRevealPwd((prevState) => !prevState)}
    //                 />
    //               </div>

    //             </div>
    //             <div>
    //               <ErrorMessage
    //                 name="password"
    //                 component="div"
    //                 className="alert alert-danger mt-3"
    //               />
    //             </div>
    //           </div>
    //           <div className=" ">
    //             <InputCheckBox checkBoxName="Remember me"></InputCheckBox>
    //           </div>
    //           <div className="">
    //             <SubmitButtons buttonName="Log In" disabled={loading} />
    //           </div>
    //           {message && (
    //             <div className="form-group">
    //               <div className="alert alert-danger" role="alert">
    //                 {message}
    //               </div>
    //             </div>
    //           )}
    //         </Form>
    //       </Formik> */}
    //       {/* <div className='h-full w-screen bg-black'> */}

    //       {/* </div> */}
    //     </div>
    //   </div>
    // </div >
    <div className=' h-screen  bg-cover bg-center flex justify-end items-center   w-screen  bg-no-repeat  bg-constructn-image '>
      <div className='mr-10   h-11/12 w-1/4 '>
        <div className=" ">
          <div className='border border-solid  py-10 bg-gray-500 '>
            <h2 className="text-center">User Login</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              <Form className=" ml-4 ">
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
                <div className=" mt-4">
                  <div>
                    <InputPassword
                      name="password"
                      type={isRevealPwd}
                      placeholderName="password"
                    />
                    <div className='w-11/12 justify-end flex  relative'>
                      <Image
                        className="h-7 w-8  absolute bottom-1 "
                        alt=""
                        title={isRevealPwd ? 'Hide password' : 'Show password'}
                        src={isRevealPwd ? hidePwdImg : showPwdImg}
                        onClick={() => setIsRevealPwd((prevState) => !prevState)}
                      />
                    </div>

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
