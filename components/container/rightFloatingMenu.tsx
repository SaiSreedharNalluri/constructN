import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faBullseye,
  faDatabase,
  faExclamationCircle,
  faSitemap,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';

interface IProps {
  toolClicked:(a:string)=>void;
}

const RightFloatingMenu: React.FC <IProps>= ({toolClicked}) => {
  const [rightNav, setRighttNav] = useState(false);
  const rightOverlayRef: any = useRef();
  const rightOverlayRefs: any = useRef();
  const [active, setActive] = useState();
  const closeStructurePages = (e: any) => {
    if (!rightOverlayRefs.current.contains(e.target)) {
      setRighttNav(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', closeStructurePages);
    return () => {
      document.removeEventListener('click', closeStructurePages);
    };
  }, []);

  const rightMenuClickHandler = (e: any) => {
    setActive(e.currentTarget.id);
    setRighttNav(!rightNav);
    toolClicked(e.currentTarget.id);
  };

 
  return (
    <div ref={rightOverlayRefs}>
      <div ref={rightOverlayRef} className="flex-col ">
        <div className="justify-around">
          <FontAwesomeIcon
            id="type"
            className={` w-full py-2  cursor-pointer ${active === 'a' ? 'selectedClass' : 'unSelectedClass'
              }`}
            onClick={rightMenuClickHandler}
            icon={faSitemap}
          ></FontAwesomeIcon>
          <div className="my-2 border-2 border-solid border-gray-500"></div>
        </div>
        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faDatabase}
            id="layer"
            className={` w-full py-2  cursor-pointer ${active === 'b' ? 'selectedClass' : 'unSelectedClass'
              }`}
              onClick={
                rightMenuClickHandler
              }
          ></FontAwesomeIcon>
          {/* {active === 'b' ? (
            <div className={`fixed w-24   ${rightNav ? 'right-9' : 'hidden'}`}>
              <div
                className={`border  border-solid bg-slate-300 p-1.5 rounded -mt-8 `}
              >
               
              </div>
            </div>
          ) : (
            ''
          )} */}
        </div>
        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            id="issue"
            className={` w-full py-2  cursor-pointer ${active === 'c' ? 'selectedClass' : 'unSelectedClass'
              }`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === 'c' ? (
            <div
              className={`fixed w-24  ${rightNav ? 'right-9' : 'hidden'
                }`}
            >
            </div>
          ) : (
            ''
          )}
        </div>
        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faBullseye}
            id="task"
            className={` w-full py-2  z-10 cursor-pointer ${active === 'd' ? 'selectedClass' : 'unSelectedClass'
              }`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === 'd' ? (
            <div
              className={`fixed w-24 ml-1.5  ${rightNav ? 'right-9' : 'hidden'
                }`}
            >
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="  cursor-pointer">
          <FontAwesomeIcon
            icon={faTasks}
            id="progress"
            className={` w-full py-2  cursor-pointer ${active === 'e' ? 'selectedClass' : 'unSelectedClass'
              } `}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === 'e' ? (
            <div
              className={`fixed w-22  ${rightNav ? 'right-9' : 'hidden'
                }`}
            >
              <div
                className={`border  border-solid bg-slate-300 p-1 rounded -mt-8 `}
              >
              
              </div>

            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div >
  );
};

export default RightFloatingMenu;
