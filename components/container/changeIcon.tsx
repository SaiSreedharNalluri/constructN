import React from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const UNSUPPORTED_FORMATS = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
  "application/msword","application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "video/*",
  "application/vnd.ms-excel",
  "application/msword", 
  "text/plain"
];

interface IProps {
  handleImageUPload: (e: object) => void;
}

const ChangeIcon: React.FC<IProps> = ({ handleImageUPload }) => {
  const validationSchema = Yup.object().shape({
    file: Yup.mixed()
      .nullable()
      .required("A file is required")
      .test(
        "format",
        "upload file",
        (value) =>
          !value ||
          (value && (SUPPORTED_FORMATS.includes(value.type) || UNSUPPORTED_FORMATS.includes(value.type)))
      ),
  });

  return (
    <React.Fragment>
      <Formik
        initialValues={{ file: "" }}
        validationSchema={validationSchema}
        onSubmit={handleImageUPload}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="flex w-full mt-2">
              <div className="w-full">
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    console.log("dvhildns;", e.target.files![0]);
                    setFieldValue("file", e.target.files![0]);
                  }}
                />
                <button
                  type="submit"
                  className="px-2 py-1  focus:outline-none bg-gray-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
                >
                  Upload
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};
export default ChangeIcon;
