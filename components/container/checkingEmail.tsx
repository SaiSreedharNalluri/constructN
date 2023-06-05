import React, { useState } from "react";
import { Form, Formik, ErrorMessage } from "formik";
import NextImage from "../../components/core/Image";
import InputText from "../../components/core/Input/inputText";
import SubmitButtons from "../../components/core/buttons/submitButton";
import * as Yup from "yup";
import router from "next/router";
import OkButton from "../core/buttons/okButton";
interface IProps {
  loading: boolean;
  message: string;
  handleEmail: (e: object) => void;
}
const CheckingEmail: React.FC<IProps> = ({ handleEmail, message, loading }) => {
  const initialValues: {
    email: string;
  } = {
    email: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
  return (
    <div className=" w-full   ">
      <NextImage
        src="https://constructn-attachments.s3.ap-south-1.amazonaws.com/Login/login02.png"
        className="h-screen w-screen"
      />
      <div className=" absolute  2xl:w-1/5 xl:w-1/3 lg:w-1/4   md:w-2/4 px-4 sm:w-1/2 w-3/4  top-0 bg-opacity-50  h-full right-0 place-items-center  bg-gray-300 ">
        <div className="grid grid-cols-1 gap-2 border   my-50 border-solid place-content-center border-gray-500 rounded-3xl ">
          <h2 className="text-center  font-bold">Email</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleEmail}
          >
            <Form className=" grid grid-cols-1 gap-y-4 px-4">
              <div>
                <InputText type="email" placeholderName="Email" name="email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className=" text-red-600"
                />
              </div>

              <div className="py-5 grid grid-cols-1 gap-2">
                <SubmitButtons buttonName="Submit" disabled={loading} />
                <OkButton
                  buttonName="Go login page"
                  disabled={false}
                  clickTheOkButton={() => {
                    // router.push('/login');
                    router.push("/login");
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

export default CheckingEmail;
