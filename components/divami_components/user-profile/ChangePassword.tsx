import React, { useState } from 'react';
import { Formik, Form, ErrorMessage, FormikHelpers, Field } from 'formik';
import showPasswordImage from '../../../public/icons/show-password.svg';
import hidePasswordImage from '../../../public/icons/hide-password.svg';
import Image from 'next/image';
import * as Yup from 'yup';
import InputPassword from '../../../components/core/Input/inputPassword';
import { changePassword } from '../../../services/userAuth';
import { toast } from 'react-toastify';
import Header from "./header/Header";
const ChangePassword = ({closeDrawer}:any) => {
  const initialValues = {
    currentPassword: '',
    new_password: '',
    confirmPassword: '',
  };
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    new_password: Yup.string()
      .required('New password is required')
      .min(8, 'Minimum 8 characters required')
      .max(14, 'Maximum 14 characters exceeded')
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
  const [show, setShow] = useState(true);
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
          setShow(true);
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
    <div className=''>
      {show && (
        <div>
          
            <div className="px-4">
      <Header id="ChangePassword" closeEditProject={closeDrawer} />
      </div>
          
            <div className='calc-h159 overflow-y-auto'>
            <div>
                <p className='text-[#101F4C]  px-4 py-1'>Use the instructions to make your password strong </p>
            </div>
            <div className='flex px-4 py-1' >
           <div>
           <div className='h-2 w-2 mt-1.5 m-1 rounded-full bg-black'>
          
          </div>
           </div>
                 <p className='ml-2'> Between 08 to 14 character</p>    
            </div>
            <div className='flex px-4 py-1'>
           <div>
           <div className='h-2 w-2 mt-1.5 m-1 rounded-full bg-black'>
          
          </div>
           </div>
                 <p className='ml-2'> An uppercase character</p>    
            </div>
            <div className='flex px-4 py-1'>
           <div className='h-2 w-2 mt-1.5 m-1 rounded-full bg-black'>
          
           </div>
                 <p className='ml-2'> A lowercase character</p>    
            </div>
            <div className='flex px-4 py-1'>
           <div className='h-2 w-2 mt-1.5 m-1 rounded-full bg-black'>
          
           </div>
                 <p className='ml-2'> A number</p>    
            </div>
            <div className='flex px-4 py-1'>
           <div className='h-2 w-2 mt-1.5 m-1 rounded-full bg-black'>
          
           </div>
                 <p className='ml-2'> A special character</p>    
            </div>
            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={changeUserPassword}
              >
                <Form className=" grid grid-cols-1 gap-y-2 px-4">
                  <div className="relative ">
                    <div className='text-[#101f4C] py-2'>Current password</div>
                    <Field
                      name="currentPassword"
                      type={revealPwd?"text":"password"}
                      placeholder="Current Password"
                      className='w-full p-3 rounded border border-[black] outline-[#F1742E]'
                    />
                    <div className="absolute p-3 inset-y-[34px] right-0">
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
                      className="alert alert-danger text-[#f1742e]"
                    />
                  </div>
                  <div className="relative">
                  <div className='text-[#101f4C] py-2'>New password</div>
                    <Field
                      name="new_password"
                      type={isRevealPwd?"text":"password"}
                      placeholder="New Password"
                      className='w-full p-3 rounded border border-[black] outline-[#F1742E]'
                    />
                    <div className="absolute p-3 inset-y-[34px] right-0">
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
                      className="alert alert-danger  text-[#f1742e]"
                    />
                  </div>

                  <div className="relative">
                  <div className='text-[#101f4C] py-2'>Confirm new password</div>
                    <Field
                      name="confirmPassword"
                      type={isCRevealPwd?"text":"password"}
                      placeholder="Confirm Password"
                      className='w-full p-3 rounded border border-[black] outline-[#F1742E]'
                    />
                    <div
                      className="absolute p-3 inset-y-[34px] right-0"
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
                      className="alert alert-danger text-[#f1742e]"
                    />
                  </div>
                  <div className="absolute bottom-0 flex justify-between w-11/12 py-2 ">
                     <button
                      onClick={closeDrawer}
                      className=" w-full mx-4 bg-white border hover:bg-white hover:border-[#f1742e] border-[#f1742e] text-base leading-4 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className=" w-full mx-4 p-2 bg-[#f1742e] font-normal text-base leading-4 text-[#ffffff] hover:bg-[#f1742e]  rounded-md"
                    >
                      Confirm
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


