import Image from 'next/image';
import moment from 'moment';
import { IUser } from '../../models/IUser';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import ChangeIcon from '../../components/container/changeIcon';
import React from 'react';
import * as Yup from 'yup';
interface IProps {
  userDetails: IUser;
  handleImageUPload: (e: any) => void;
  updateProfileInfo: (updatedInfo: any) => void;
}
const UserProfile: React.FC<IProps> = ({
  userDetails,
  handleImageUPload,
  updateProfileInfo,
}) => {
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
  return (
    <React.Fragment>
      <div>
        {userDetails && (
          <div>
            <div>
              <div className="px-10">
                <div>
                  <h1 className="font-semibold text-xl">User Profile</h1>
                </div>
                <div className="flex mt-4">
                  <div className="w-36 4 h-36  rounded-full overflow-hidden  border border-solid border-gray-900">
                    <Image
                      src={
                        userDetails?.avatar
                          ? userDetails?.avatar
                          : 'https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/defaults/user_icon_def_01.png'
                      }
                      alt=""
                      width={720}
                      height={720}
                      className="  w-full h-full cursor-pointer "
                    />
                  </div>
                  <div className="ml-2 flex flex-col justify-center ">
                    <ChangeIcon handleImageUPload={handleImageUPload} />
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
                        className="alert alert-danger text-red-600"
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
                        className="alert alert-danger text-red-600"
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
                        className="alert alert-danger text-red-600"
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
                        className="alert alert-danger text-red-600"
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
    </React.Fragment>
  );
};
export default UserProfile;
