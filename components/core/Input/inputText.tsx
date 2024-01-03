import React from 'react';
import { Field } from 'formik';
interface IProps {
  type: string;
  placeholderName: string;
  name: string;
  onBlur?:(e: React.ChangeEvent<HTMLInputElement>) => void;
  label?:string;
}

const InputText: React.FC<IProps> = ({ type, placeholderName, name,onBlur,label }) => {
  return (
    <Field
      name={name}
      type={type}
      className=" w-full p-3 rounded"
      placeholder={placeholderName}
      onBlur={onBlur}
      label={label}
    ></Field>
  );
};

export default InputText;
