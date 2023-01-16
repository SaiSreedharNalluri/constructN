import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAreaChart,
  faCalendar,
  faExclamationCircle,
  faGreaterThan,
  faLineChart,
  faMap,
  faTachometer,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import RightOverLay from '../container/rightOverLay';
import LeftOverLay from '../container/leftOverLay';
import { ChildrenEntity } from '../../models/IStrature';
import { useRouter } from 'next/router';

interface IProps {
  getStructureData: (strature: ChildrenEntity) => void;
  getStractureHierarchy: (e: string) => void;
}
const CollapsableMenu: React.FC<IProps> = ({
  getStructureData,
  getStractureHierarchy,
}) => {
  const router = useRouter();
  const [rightNav, setRightNav] = useState(false);

  const [active, setActive] = useState('');
  const rightOverlayRef: any = useRef();
  const [leftNav, setLeftNav] = useState(false);
  const leftOverlayRef: any = useRef();
  const leftIconsContainerRef: any = useRef();
  const leftNavCollapse = (e: any) => {
    setLeftNav(!leftNav);
    leftClickHandler(e);
  };
  useEffect(() => {
    if (leftNav) {
      leftOverlayRef.current.style.width = '18vw';
    } else {
      leftOverlayRef.current.style.width = '0%';
    }
  }, [leftNav]);

  const rightNavCollapse = () => {
    if (!rightNav) {
      rightOverlayRef.current.style.width = '3%';
      rightOverlayRef.current.style.height = '40%';
    } else {
      rightOverlayRef.current.style.width = '0%';
      rightOverlayRef.current.style.height = '0%';
    }
    setRightNav(!rightNav);
  };
  const leftClickHandler = (e: any) => {
    switch (e.currentTarget.id) {
      case 'dashboard':
        router.push(`/projects/${router.query.projectId as string}/dashboard`);
        break;
      case 'views':
        router.push(`/projects/${router.query.projectId as string}/structure`);
        break;
      case 'issues':
        router.push(`/projects/${router.query.projectId as string}/issue`);
        break;
      case 'reports':
        router.push(`/projects/${router.query.projectId as string}/report`);
        break;
      case 'schedule':
        router.push(`/projects/${router.query.projectId as string}/schedule`);
        break;
      case 'linechart':
        // code block
        break;
      case 'users':
        router.push(`/projects/${router.query.projectId as string}/schedule`);
        break;
      case 'tasks':
        router.push(`/projects/${router.query.projectId as string}/tasks`);
        break;
      default:
      // code block
    }
    if (e.currentTarget.id === 'dashboard') setActive(e.currentTarget.id);
  };

  return (
    <div>
      <div
        className="absolute left-0 z-10 w-10 h-91 text-center bg-gray-300"
        ref={leftIconsContainerRef}
      >
        <div>
          <FontAwesomeIcon
            id="dashboard"
            className={` w-full py-2  cursor-pointer ${
              active === 'dashboard' ? 'selectedClass' : 'unSelectedClass'
            }`}
            onClick={leftClickHandler}
            icon={faTachometer}
          ></FontAwesomeIcon>
        </div>
        <div>
          <FontAwesomeIcon
            id="views"
            className={` w-full py-2 cursor-pointer ${
              active === 'views' ? 'selectedClass' : 'unSelectedClass'
            }`}
            onClick={leftNavCollapse}
            icon={faMap}
          ></FontAwesomeIcon>
        </div>
        <div
          ref={leftOverlayRef}
          className={`h-full bg-gray-200 w-0 absolute   ${
            leftNav ? 'left-10' : 'left-10  '
          }   top-0   duration-300 overflow-x-hidden`}
        >
          <LeftOverLay
            getStractureHierarchy={getStractureHierarchy}
            getStructureData={getStructureData}
          ></LeftOverLay>
        </div>
        <div>
          <FontAwesomeIcon
            id="issues"
            className={`${
              leftNav ? 'left-0' : 'left-0  '
            } w-full py-2  cursor-pointer ${
              active === 'issues' ? 'selectedClass' : 'unSelectedClass'
            }`}
            onClick={leftClickHandler}
            icon={faExclamationCircle}
          ></FontAwesomeIcon>
        </div>

        <div>
          <FontAwesomeIcon
            id="reports"
            className={` cursor-pointer w-full py-2  ${
              active === 'reports' ? 'selectedClass' : 'unSelectedClass'
            }`}
            onClick={leftClickHandler}
            icon={faAreaChart}
          ></FontAwesomeIcon>
        </div>
        <div>
          <FontAwesomeIcon
            id="schedule"
            className={` cursor-pointer w-full py-2  ${
              active === 'schedule' ? 'selectedClass' : 'unSelectedClass'
            }`}
            icon={faCalendar}
            onClick={leftClickHandler}
          ></FontAwesomeIcon>
        </div>
        <div>
          <FontAwesomeIcon
            id="linechart"
            className={` cursor-pointer w-full py-2  ${
              active === 'linechart' ? 'selectedClass' : 'unSelectedClass'
            }`}
            icon={faLineChart}
            onClick={leftClickHandler}
          ></FontAwesomeIcon>
        </div>
        <div>
          <FontAwesomeIcon
            id="users"
            className={`cursor-pointer w-full py-2  ${
              active === 'users' ? 'selectedClass' : 'unSelectedClass'
            } `}
            icon={faUsers}
            onClick={leftClickHandler}
          ></FontAwesomeIcon>
        </div>
        <div className="mt-2 border-t border-solid border-gray-400">
          <FontAwesomeIcon
            id="expand"
            className={` cursor-pointer w-full py-2  ${
              active === 'expand' ? 'selectedClass' : 'unSelectedClass'
            } `}
            icon={faGreaterThan}
            onClick={leftClickHandler}
          ></FontAwesomeIcon>
        </div>
      </div>
      <FontAwesomeIcon
        className={`absolute  ${
          rightNav && 'rotate-180'
        } text-2xl text-blue-300 top-2/4 ${
          rightNav ? 'right-5' : 'right-0'
        }  cursor-pointer border-none rounded ml-2 p-2 bg-gray-600 text-white`}
        onClick={rightNavCollapse}
        icon={faGreaterThan}
      ></FontAwesomeIcon>
      <div
        ref={rightOverlayRef}
        id="bg-color"
        className={`absolute w-0  ${
          rightNav ? 'visible' : 'hidden'
        }  bg-gray-400 top-35 rounded z-10 right-0 duration-300 overflow-x-hidden`}
      >
        <RightOverLay></RightOverLay>
      </div>
    </div>
  );
};

export default CollapsableMenu;
