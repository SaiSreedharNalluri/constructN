import React from 'react';
interface IProps {
  disabled: boolean;
  buttonName: string;
}

const OkButton: React.FC<IProps> = ({ disabled, buttonName }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className="p-2 w-full bg-gray-500 hover:bg-gray-400  rounded-md "
    >
      {buttonName}
    </button>
  );
};

export default OkButton;
