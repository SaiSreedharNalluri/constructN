import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark, faBars } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import Structure from '../container/structure';
import { ChildrenEntity } from '../../models/IStrature';
interface IProps {
  getStructureData: (stratureId: ChildrenEntity) => void;
}
const SideMenu: React.FC<IProps> = ({ getStructureData }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-full w-full">
      {!open ? (
        <FontAwesomeIcon
          className="h-6 w-6 cursor-pointer"
          icon={faBars}
          onClick={() => {
            setOpen(true);
          }}
        />
      ) : (
        <div className="w-full">
          <div className="flex justify-between">
            <h1 className=" text-xl text-gray-500 font-bold">Structure List</h1>
            <FontAwesomeIcon
              className="mt-2 cursor-pointer"
              icon={faRectangleXmark}
              onClick={() => {
                setOpen(false);
              }}
            />
          </div>
          <div className="overflow-y-scroll h-87 w-52 scrollbar  ">
            <Structure getStructureData={getStructureData} />
          </div>
        </div>
      )}
    </div>
  );
};
export default SideMenu;
