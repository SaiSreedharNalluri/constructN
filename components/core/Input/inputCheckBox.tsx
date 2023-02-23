import React from 'react';
interface IProps {
  checkBoxName: string;
}
const InputCheckBox: React.FC<IProps> = ({ checkBoxName }) => {
  return (
    <React.Fragment>
      <input type="checkbox" className=" text-gray-500  " />
      <p className="inline-block text-gray-500 min-w-fit  ml-2">
        {checkBoxName}
      </p>
    </React.Fragment>
  );
};
export default InputCheckBox;