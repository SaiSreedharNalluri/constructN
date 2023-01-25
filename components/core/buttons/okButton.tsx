import React from 'react';
interface IProps {
  disabled: boolean;
  buttonName: string;
  clickTheOkButton: () => void;
}

const OkButton: React.FC<IProps> = ({
  disabled,
  buttonName,
  clickTheOkButton,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className="p-2 w-full bg-gray-500 hover:bg-gray-400  rounded-md "
      onClick={clickTheOkButton}
    >
      {buttonName}
    </button>
  );
};

export default OkButton;
