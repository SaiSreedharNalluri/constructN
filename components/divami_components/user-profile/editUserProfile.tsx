import * as Yup from "yup";
import Header from "./header/Header";
import Image from "next/image";
import { styled } from "@mui/system";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
import editIcon from "../../../public/divami_icons/edit.svg";
import UploadedImagesList from "../../../public/divami_icons/UploadBulkIcon.svg";
import { useState } from "react";
import Footer from "./footer/Footer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ChangeIcon from "../../container/changeIcon";
const CloseIcon = styled(Image)({
  cursor: "pointer",
  width: "12px",
  height: "12px",
});
const EditUserProfile = ({
  userDetails,
  closeEditProfile,
  updateProfileInfo,
  handleImageUPload,
}: any) => {
  const initialValues: {
    firstName: string;
    lastName: string;
  } = {
    firstName: userDetails?.firstName ? userDetails?.firstName : "",
    lastName: userDetails?.lastName ? userDetails?.lastName : "",
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required")
      .matches(/[a-zA-Z]/, "Atleast one letter is reqired")
      .matches(/^[^0-9]+$/, "Number is not allowed"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(/[a-zA-Z]/, "Atleast one letter is reqired")
      .matches(/^([^0-9]*)$/, "Number is not allowed"),
  });
  const [show, setShow] = useState(true);
  return (
    <div>
      <div>
        <Header editUser="editUser" closeEditProject={closeEditProfile} />
        <div className="calc-h191  overflow-y-auto">
          {show ? (
            <div className="flex relative rounded-full flex-col items-center justify-center py-4">
              <Image
                src={
                  userDetails?.avatar
                    ? userDetails?.avatar
                    : `${process.env.NEXT_PUBLIC_CONSTRUCTN_ATTACHMENTS_S3}/defaults/user_icon_def_01.png`
                }
                alt=""
                width={65}
                height={65}
                className="rounded-full border "
              />
              <div className="relative bg-[#F1742E] rounded-full bottom-4 left-4">
                <Image
                  src={editIcon}
                  onClick={() => {
                    setShow(false);
                  }}
                  alt=""
                  width={25}
                  height={25}
                  className="p-1 cursor-pointer "
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <p className="text-lg font-medium text-[#101F4C]">
                {userDetails?.firstName + " " + userDetails?.lastName}
              </p>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={updateProfileInfo}
              >
                <Form>
                  <div className="grid grid-cols-2">
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
                  </div>
                  <Footer save="Save" formHandler={closeEditProfile} />               
                </Form>
              </Formik>
            </div>
          ) : (
            <div>
              <div className="right-0 absolute p-1 mr-3">
                <CloseIcon
                  onClick={() => {
                    setShow(true);
                  }}
                  src={closeIcon}
                  alt={"close icon"}
                />
              </div>

              <div className="flex flex-col items-center justify-center py-4">
                <Image
                  src={
                    userDetails?.avatar
                      ? userDetails?.avatar
                      : `${process.env.NEXT_PUBLIC_CONSTRUCTN_ATTACHMENTS_S3}/defaults/user_icon_def_01.png`
                  }
                  alt=""
                  width={65}
                  height={65}
                  className="rounded-full border "
                />
                <p className="text-lg font-medium text-[#101F4C]">
                  {userDetails?.firstName + " " + userDetails?.lastName}
                </p>
                <ChangeIcon handleImageUPload={handleImageUPload} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default EditUserProfile;