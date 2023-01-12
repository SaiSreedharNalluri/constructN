import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import RightOverLay from '../container/RightOverLay';
import LeftOverLay from '../container/leftOverLay';
import { IStrature, ChildrenEntity } from '../../models/IStrature';
import NextImage from '../core/Image';
interface IProps {
  structures: IStrature[];
  getStructureData: (strature: ChildrenEntity) => void;
  getStractureHierarchy: (e: string) => void;
}
const CollapsableMenu: React.FC<IProps> = ({
  structures,
  getStructureData,
  getStractureHierarchy,
}) => {
  const [openNav, setOpenNav] = useState(false);
  const [oNav, setONav] = useState(false);

  const overlayRef: any = useRef();
  const overlayRefs: any = useRef();
  const openSearch = () => {
    if (!openNav) {
      overlayRef.current.style.width = '25%';
    } else {
      overlayRef.current.style.width = '0%';
    }
    setOpenNav(!openNav);
  };
  const rightNavCollapse = () => {
    if (!oNav) {
      overlayRefs.current.style.width = '3%';
      overlayRefs.current.style.height = '65%';
    } else {
      overlayRefs.current.style.width = '0%';
      overlayRefs.current.style.height = '0%';
    }
    setONav(!oNav);
  };
  return (
    <div className="h-full relative">
      <div className={` w-full relative`}>
        <NextImage
          src="https://techmoran.com/wp-content/uploads/2020/05/construction.jpg"
          className="h-91 w-screen"
        />
        <FontAwesomeIcon
          className={`absolute  ${
            !openNav && 'rotate-180'
          } text-2xl text-blue-300 top-2/4  ${
            openNav ? 'left-1/4' : ''
          } cursor-pointer border-none rounded ml-2 p-2 bg-gray-600 text-white`}
          onClick={openSearch}
          icon={faGreaterThan}
        />
        <FontAwesomeIcon
          className={`absolute  ${
            oNav && 'rotate-180'
          } text-2xl text-blue-300 top-2/4 ${
            oNav ? 'right-5' : 'right-0'
          }  cursor-pointer border-none rounded ml-2 p-2 bg-gray-600 text-white`}
          onClick={rightNavCollapse}
          icon={faGreaterThan}
        />
        <div
          ref={overlayRef}
          className={`h-full bg-black bg-opacity-60 w-0 absolute  z-10 top-0 -left-0 duration-300 overflow-x-hidden`}
        >
          <LeftOverLay
            getStractureHierarchy={getStractureHierarchy}
            getStructureData={getStructureData}
            structures={structures}
          />
        </div>
        <div
          ref={overlayRefs}
          id="bg-color"
          className={`absolute w-0  bg-black bg-opacity-60 top-1/4 rounded z-10 right-0 duration-300 overflow-x-hidden`}
        >
          <RightOverLay />
        </div>
      </div>
    </div>
  );
};

export default CollapsableMenu;
