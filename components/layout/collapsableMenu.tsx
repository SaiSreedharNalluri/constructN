import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import LeftOverLay from '../container/leftOverLay';
import { ChildrenEntity } from '../../models/IStrature';
import MapLoading from '../container/mapLoading';
interface IProps {
  getStructureData: (strature: ChildrenEntity) => void;
  getStractureHierarchy: (e: string) => void;
}
const CollapsableMenu: React.FC<IProps> = ({
  getStructureData,
  getStractureHierarchy,
}) => {
  const [leftNav, setLeftNav] = useState(false);
  const leftOverlayRef: any = useRef();
  const leftNavCollapse = () => {
    if (!leftNav) {
      leftOverlayRef.current.style.width = '25%';
    } else {
      leftOverlayRef.current.style.width = '0%';
    }
    setLeftNav(!leftNav);
  };

  return (
    <div className="h-full relative ">
      <div className={` w-full relative`}>
        <MapLoading />
        <FontAwesomeIcon
          className={`absolute  ${
            !leftNav && 'rotate-180'
          } text-2xl text-blue-300 top-2/4  ${
            leftNav ? 'left-1/4' : ''
          } cursor-pointer border-none rounded ml-2 p-2 bg-gray-600 text-white`}
          onClick={leftNavCollapse}
          icon={faGreaterThan}
        ></FontAwesomeIcon>

        <div
          ref={leftOverlayRef}
          className={`h-full bg-white  w-0 absolute  z-10 top-0 -left-0 duration-300 overflow-x-hidden`}
        >
          <LeftOverLay
            getStractureHierarchy={getStractureHierarchy}
            getStructureData={getStructureData}
          ></LeftOverLay>
        </div>
      </div>
    </div>
  );
};

export default CollapsableMenu;
