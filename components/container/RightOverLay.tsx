import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Issue from './issue';
import Tasks from './tasks';
import {
  faBullseye,
  faDatabase,
  faExclamationCircle,
  faSitemap,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';
import HotSpots from './hotSpots';
import Layers from './layers';
const RightOverLay: React.FC = () => {
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

  const rightClickHandler = (e: any) => {
    setActive(e.currentTarget.id);
    setRighttNav(!rightNav);
  };
  return (
    <div className="flex-col m-auto relative " ref={rightOverlayRefs}>
      <div ref={rightOverlayRef}>
        <div className="mt-3 ">
          <FontAwesomeIcon
            id="a"
            className={` w-full py-2  cursor-pointer ${active === 'a' ? 'selectedClass' : 'unSelectedClass'
              }`}
            onClick={rightClickHandler}
            icon={faSitemap}
          ></FontAwesomeIcon>
        </div>
        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faDatabase}
            id="b"
            className={` w-full py-2  cursor-pointer ${active === 'b' ? 'selectedClass' : 'unSelectedClass'
              }`}
            onClick={rightClickHandler}
          ></FontAwesomeIcon>
          {active === 'b' ? (
            <div className={`fixed w-24   ${rightNav ? 'right-9' : 'hidden'}`}>
              <div
                className={`border ml-1 border-solid bg-slate-300 p-1.5 rounded -mt-8 `}
              >
                <Layers></Layers>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            id="c"
            className={` w-full py-2  cursor-pointer ${active === 'c' ? 'selectedClass' : 'unSelectedClass'
              }`}
            onClick={rightClickHandler}
          ></FontAwesomeIcon>
          {active === 'c' ? (
            <div
              className={`fixed w-24 right-16 ${rightNav ? 'right-16' : 'hidden'
                }`}
            >
              <Issue></Issue>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faBullseye}
            id="d"
            className={` w-full py-2  z-10 cursor-pointer ${active === 'd' ? 'selectedClass' : 'unSelectedClass'
              }`}
            onClick={rightClickHandler}
          ></FontAwesomeIcon>
          {active === 'd' ? (
            <div
              className={`fixed w-24 bottom-37 ml-1.5  ${rightNav ? 'right-9' : 'hidden'
                }`}
            >
              <Tasks></Tasks>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faTasks}
            id="e"
            className={` w-full py-2  cursor-pointer ${active === 'e' ? 'selectedClass' : 'unSelectedClass'
              } `}
            onClick={rightClickHandler}
          ></FontAwesomeIcon>
          {active === 'e' ? (
            <div
              className={`fixed w-10 bottom-31 ${rightNav ? 'right-9' : 'hidden'
                }`}
            >
              <div className={`  rounded `}>
                <div>
                  <HotSpots></HotSpots>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default RightOverLay;
