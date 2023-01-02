import React from 'react';
import { Field } from 'formik';
interface IProps {
  type: boolean;
  placeholderName: string;
  name: string;
}

const InputPassword: React.FC<IProps> = ({ type, placeholderName, name }) => {
  return (
    <Field
      name={name}
      type={type ? 'text' : 'password'}
      className=" border border-border-yellow border-solid   w-11/12 p-3 rounded hover:border-yellow-500"
      placeholder={placeholderName}
    ></Field>
  );
};

export default InputPassword;
