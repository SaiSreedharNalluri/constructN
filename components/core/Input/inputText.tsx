import React from 'react';
import { Field } from 'formik';
interface IProps {
  type: string;
  placeholderName: string;
  name: string;
}

const InputText: React.FC<IProps> = ({ type, placeholderName, name }) => {
  return (
    <Field
      name={name}
      type={type}
      className=" w-11/12 p-3 rounded"
      placeholder={placeholderName}
    ></Field>
  );
};

export default InputText;
