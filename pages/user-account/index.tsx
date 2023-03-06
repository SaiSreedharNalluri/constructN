import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import * as Yup from 'yup';
import Header from '../../components/container/header';
import {
  updateProfileAvatar,
  updateUserProfile,
} from '../../services/userAuth';
import Image from 'next/image';
import moment from 'moment';
import { toast } from 'react-toastify';
import { getCookie } from 'cookies-next';
import { IUser } from '../../models/IUser';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import ChangeIcon from '../../components/container/changeIcon';
const Index: React.FC = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<IUser>();
  useEffect(() => {
    if (router.isReady) {
      const userObj: any = getCookie('user');
      let user = null;
      if (userObj) user = JSON.parse(userObj);
      setUserDetails(user);
    }
  }, []);
  if (userDetails) {
  }
  const initialValues: {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
  } = {
    firstName: userDetails?.firstName ? userDetails?.firstName : '',
    lastName: userDetails?.lastName ? userDetails?.lastName : '',
    email: userDetails?.email ? userDetails?.email : '',
    dob: moment(userDetails?.dob).format('YYYY-MM-DD'),
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
    dob: Yup.string(),
  });
  const handleUploadClick = (e: any) => {
    const formData = new FormData();
    formData.append('file', e.file);
    updateProfileAvatar(formData).then((response) => {
      if (response.success === true) {
        toast.success('user profile pic updated successfully');
        setUserDetails(response?.result);
        const fileInput = document.getElementById(
          'file-upload'
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    });
  };
  const updateProfileInfo = (updateInfo: {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
  }) => {
    updateUserProfile(updateInfo)
      .then((response) => {
        if (response?.success === true) {
          setUserDetails(response?.result);
          toast.success('user profile updated successfully');
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  return (
    <div>
      <div>
        <Header />
      </div>
      <div>
        {userDetails && (
          <div className="calc-h overflow-y-auto">
            <div>
              <div className="px-10">
                <div>
                  <h1 className="font-semibold text-xl">User Information</h1>
                </div>
                <div className="flex mt-4">
                  <div className="w-36 4 h-36  rounded-full overflow-hidden  border border-solid border-gray-900">
                    <Image
                      src={userDetails?.avatar as string}
                      alt=""
                      width={720}
                      height={720}
                      className="  w-full h-full cursor-pointer "
                    />
                  </div>
                  <div className="ml-2 flex flex-col justify-center ">
                    <ChangeIcon handleImageUPload={handleUploadClick} />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-10 py-4">
              <h1 className="font-semibold text-xl text-gray-400">
                Personal Details
              </h1>
            </div>
            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={updateProfileInfo}
              >
                <Form>
                  <div className="grid grid-cols-1">
                    <div className=" gap-10 px-10 py-2">
                      <label htmlFor="" className="inputImp">
                        Firstname
                      </label>
                      <Field
                        className=" w-full border border-gray-600 focus:outline-none  text-sm   no-underline   rounded  p-2"
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="alert alert-danger"
                      />
                    </div>
                    <div className="gap-10 px-10 py-2">
                      <label htmlFor="" className="inputImp">
                        Lastname
                      </label>
                      <Field
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        className="border border-gray-600 focus:outline-none  text-sm  w-full rounded  p-2"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="alert alert-danger"
                      />
                    </div>
                    <div className=" gap-10 px-10  py-2">
                      <label htmlFor="" className="">
                        Email
                      </label>
                      <Field
                        type="email"
                        disabled
                        placeholder="Email"
                        name="email"
                        className="border cursor-not-allowed  border-gray-600 focus:outline-none  text-sm  w-full rounded  p-2"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="alert alert-danger"
                      />
                    </div>
                    <div className=" gap-10 px-10 py-2">
                      <label htmlFor="">Dob</label>
                      <Field
                        type="date"
                        placeholder="Dob"
                        name="dob"
                        className="border  border-gray-600 focus:outline-none p-2 text-sm  w-full rounded  "
                      />
                      <ErrorMessage
                        name="date"
                        component="div"
                        className="alert alert-danger"
                      />
                    </div>
                  </div>
                  <div className="flex  justify-center ">
                    <button
                      type="submit"
                      className="px-2 py-1 mt-2 bg-red-500 hover:bg-red-800  rounded text-gray-200 font-semibold "
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
