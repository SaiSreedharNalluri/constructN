import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faBug,
  faCircleInfo,
  faEyeSlash,
  faGripHorizontal,
  faTasks,
  faTimes,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faSearchMinus } from '@fortawesome/free-solid-svg-icons';
import { faSearchPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faGreaterThan, faAngleDown } from '@fortawesome/free-solid-svg-icons';
// import RightOverlayPanel from './rightOverlayPanel';
const RightOverLay: React.FC = () => {
  const [rightNav, setRighttNav] = useState(false);
  const rightOverlayRef: any = useRef();
  const [active, setActive] = useState();
  const rightNavCollapse = (e: any) => {
    if (!rightNav) {
      rightOverlayRef.current.style.width = '8%';
    } else {
      rightOverlayRef.current.style.width = '0%';
    }
    setRighttNav(!rightNav);
    rightClickHandler(e);
  };
  const rightClickHandler = (e: any) => {
    setActive(e.currentTarget.id);
  };
  return (
    <div className="flex-col m-auto relative ">
      <div
        ref={rightOverlayRef}
        className={`fixed w-0  bottom-1/4 right-10 z-10 mb-16 overflow-x-hidden`}
      >
        <div className={`border-y border-solid bg-slate-500 p-2 rounded `}>
          <div className="flex justify-between  ">
            <FontAwesomeIcon
              icon={faTasks}
              className="hover:white cursor-pointer ml-2 "
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faBug}
              className="hover:white cursor-pointer ml-2 "
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faEyeSlash}
              className="hover:white cursor-pointer ml-2 "
            ></FontAwesomeIcon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightOverLay;
