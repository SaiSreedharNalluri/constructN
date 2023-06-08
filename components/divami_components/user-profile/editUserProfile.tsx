
import * as Yup from 'yup';
import Header from "./header/Header";
import Image from "next/image";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";

import UploadedImagesList from "../../../public/divami_icons/UploadBulkIcon.svg";
import { useState } from "react";
import Footer from "./footer/Footer";
import { Formik, Form, Field, ErrorMessage } from 'formik';
const EditUserProfile=({userDetails,closeEditProfile,updateProfileInfo}:any)=>{
const initialValues: {
  firstName: string;
  lastName: string;
} = {
  firstName: userDetails?.firstName ? userDetails?.firstName : '',
  lastName: userDetails?.lastName ? userDetails?.lastName : '',
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
});
const [highlightedItem, setHighlightedItem] = useState("");
const handleItemClick = (itemName: string) => {
    setHighlightedItem(itemName);
  }
  
return(
  <div>
           <div>
        <Header editUser="editUser"  closeEditProject={closeEditProfile}></Header>
     
      <div className='flex flex-col items-center justify-center py-4'>
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
                    <p className='text-lg font-medium text-[#101F4C]'>{userDetails?.firstName + " "+userDetails?.lastName}</p>
      </div>
      </div>
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
                  <div className="flex  justify-center ">

                  </div>
                </Form>
      </Formik>
      <div className="  flex justify-center  px-4" >
       <div           className={`mx-1 relative rounded bg-white shadow-md ${
            highlightedItem === "uploadImage" ? "border   border-solid border-[#F1742E]" : ""
          }`}
          onClick={() => handleItemClick("uploadImage")}
>
             <Image src={UploadedImagesList} alt='' ></Image>
             {highlightedItem === "uploadImage" && (
            <div className="absolute top-0.5 right-0.5 bg-[#F1742E] p-1  rounded-full">
              <Image src={closeIcon} alt="Delete"  />
            </div>
          )}
                 </div>
       </div>
       <Footer save="Save" formHandler={closeEditProfile} formHandler2={closeEditProfile}></Footer>
  </div>
   
)


}
export default EditUserProfile