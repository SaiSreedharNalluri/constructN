import React from 'react';
interface IProps {
  disabled: boolean;
  buttonName: string;
}

const CancelButton: React.FC<IProps> = ({ disabled, buttonName }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className="p-2 w-11/12 mt-4 bg-custom-yellow hover:bg-yellow-500  rounded-md "
    >
      {buttonName}
    </button>
  );
};

export default CancelButton;
