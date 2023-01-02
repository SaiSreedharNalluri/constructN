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
      className=" border border-border-yellow border-solid   w-11/12 p-3 rounded hover:border-yellow-500"
      placeholder={placeholderName}
    ></Field>
  );
};

export default InputText;
