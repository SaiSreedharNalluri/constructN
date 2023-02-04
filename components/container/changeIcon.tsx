import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
interface IProps {
  handleImageUPload: (e: object) => void;
}

const ChangeIcon: React.FC<IProps> = ({ handleImageUPload }) => {
  const validationSchema = Yup.object().shape({
    file: Yup.mixed()
      .nullable()
      .required('A file is required')
      .test(
        'Fichier taille',
        'upload file',
        (value) => !value || (value && value.size <= 1024 * 1024)
      )
      .test(
        'format',
        'upload file',
        (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
      ),
  });

  return (
    <React.Fragment>
      <Formik
        initialValues={{ file: null }}
        validationSchema={validationSchema}
        onSubmit={handleImageUPload}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className='flex w-full'>
              <div className='w-1/2'>
                <input
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('file', e.target.files![0]);
                  }}
                />
                <button type="submit" className='mt-2'>Upload</button>
              </div>

            </div>

          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};
export default ChangeIcon;
