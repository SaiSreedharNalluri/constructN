import { ISnapShort } from '../../models/ISnapShort';
import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
// import RightOverlayPanel from './rightOverlayPanel';

const Pagination: React.FC = () => {
  const [rightNav, setRighttNav] = React.useState(false);
  const rightOverlayRef: any = useRef();
  const rightNavCollapse = () => {
    if (!rightNav) {
      rightOverlayRef.current.style.width = '25%';
      rightOverlayRef.current.style.height = '100%';
    } else {
      rightOverlayRef.current.style.width = '0%';
    }
    setRighttNav(!rightNav);
  };

  return (
    <React.Fragment>
      <div className="flex justify-around rounded-lg bg-gray-200">
        <div className="flex " onClick={rightNavCollapse}>
          <div className='  py-2 px-1  ' >
            <span>&laquo;</span>
          </div>
          <div className=' flex items-center mr-1'>
            <p>{"10 - 1 - 2023"}</p>
          </div>
          <div className="   rounded pl-2 pt-3">
            <input
              type="radio"
              name="bordered-radio"
              className="w-3 h-4 cursor-pointer"
            />
            <input
              type="radio"
              name="bordered-radio"
              className="w-3 h-4 ml-2  cursor-pointer"
            />
            <input
              type="radio"
              name="bordered-radio"
              className="w-3 h-4 ml-2  cursor-pointer"
            />
            <input
              type="radio"
              name="bordered-radio"
              className="w-3 h-4 ml-2  cursor-pointer"
            />
            <input
              type="radio"
              name="bordered-radio"
              className="w-3 h-4 ml-2  cursor-pointer"
            />
            <input
              type="radio"
              name="bordered-radio"
              className="w-3 h-4 ml-2  cursor-pointer"
            />
            <input
              type="radio"
              name="bordered-radio"
              className="w-3 h-4 ml-2  cursor-pointer"
            />
            <input
              type="radio"
              name="bordered-radio"
              className="w-3 h-4 ml-2  cursor-pointer"
            />
            <input
              type="radio"
              name="bordered-radio"
              className="w-3 h-4 ml-2  cursor-pointer"
            />
            <input
              type="radio"
              name="bordered-radio"
              className="w-3 h-4 ml-2  cursor-pointer"
            />
          </div>

        </div>


        <div className='flex items-center ml-1 '>
          <p>{"11 - 1 - 2023"}  </p>
        </div>
        <div className=' flex items-center ml-1 ' >
          <span>&raquo;</span>
        </div>
      </div>


    </React.Fragment >
  );
};

export default Pagination;
