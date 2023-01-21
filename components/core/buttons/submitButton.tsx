import React from 'react';
interface IProps {
  disabled: boolean;
  buttonName: string;
}

const SubmitButton: React.FC<IProps> = ({ disabled, buttonName }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="p-2 w-11/12 mt-4 bg-gray-500 hover:bg-gray-300  rounded-md "
    >
      {disabled && <span className="spinner-border spinner-border-sm"></span>}
      {buttonName}
    </button>
  );
};

export default SubmitButton;
