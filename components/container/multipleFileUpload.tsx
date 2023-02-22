import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { createAttachment } from '../../services/attachments';
interface IProps {
  issueId: string;
  responseData: (formData: any) => void;
}

const MultipleFileUpload: React.FC<IProps> = ({ issueId, responseData }) => {
  const initialValues = {
    file: [],
  };
  const fileUploadSchema = Yup.object().shape({
    file: Yup.mixed().nullable().required('A file is required'),
  });
  const handleSubmit = (values: any, formikHelpers: FormikHelpers<any>) => {
    if (values.file.length === 0) {
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < values.file?.length; i++) {
      formData.append('file', values.file![i]);
    }
    createAttachment(issueId, formData).then((response) => {
      if (response.success === true) {
        toast.success('Attachments are added sucessfully');
        responseData(response.result);
        formikHelpers.resetForm({});
      }
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={fileUploadSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form>
          <input
            type="file"
            name="file"
            multiple
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFieldValue('file', event.target.files);
            }}
          />
          <ErrorMessage
            name="file"
            component="div"
            className="alert alert-danger"
          />
          <button
            type="submit"
            className="px-2 py-1  focus:outline-none bg-blue-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
          >
            Add Attachments
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default MultipleFileUpload;
