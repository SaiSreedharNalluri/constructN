import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAreaChart,
  faCalendarDays,
  faGreaterThan,
  faMap,
  faTachometerAltAverage,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

interface IProps {
  onChangeData: () => void;
}
const CollapsableMenu: React.FC<IProps> = ({ onChangeData }) => {
  const router = useRouter();
  const [active, setActive] = useState(router.pathname.split("/").pop());
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
      case 'lineChart':
        router.push(`/projects/${router.query.projectId as string}/lineChart`);
        break;
      case 'users':
        router.push(`/projects/${router.query.projectId as string}/users`);
        break;
      case 'tasks':
        router.push(`/projects/${router.query.projectId as string}/tasks`);
        break;
      default:
        router.push(`/projects/${router.query.projectId as string}/structure`);
    }
    setActive(router.pathname.split("/").pop());
  };
  return (
    <div className="w-11 h-96 text-center bg-gray-200">
      <div>
        <FontAwesomeIcon
          id="dashboard"
          className={` w-full text-xl  py-2 cursor-pointer ${active === 'dashboard' ? 'selectedClass' : 'unSelectedClass'
            }`}
          onClick={leftClickHandler}
          icon={faTachometerAltAverage}
        ></FontAwesomeIcon>
      </div>
      <div>
        <FontAwesomeIcon
          id="views"
          className={` w-full text-xl py-2 cursor-pointer ${active === 'structure' ? 'selectedClass' : 'unSelectedClass'
            }`}
          onClick={(e: any) => {
            leftClickHandler(e);
            onChangeData();
          }}
          icon={faMap}
        ></FontAwesomeIcon>
      </div>
      {/* <div>
        <FontAwesomeIcon
          id="issues"
          className={`w-full text-xl py-2 cursor-pointer ${active === 'issues' ? 'selectedClass' : 'unSelectedClass'
            }`}
          onClick={leftClickHandler}
          icon={faExclamationCircle}
        ></FontAwesomeIcon>
      </div> */}

      <div>
        <FontAwesomeIcon
          id="reports"
          className={` cursor-pointer text-xl w-full py-2  ${active === 'report' ? 'selectedClass' : 'unSelectedClass'
            }`}
          onClick={leftClickHandler}
          icon={faAreaChart}
        ></FontAwesomeIcon>
      </div>
      <div>
        <FontAwesomeIcon
          id="schedule"
          className={` cursor-pointer text-xl w-full py-2  ${active === 'schedule' ? 'selectedClass' : 'unSelectedClass'
            }`}
          icon={faCalendarDays}
          onClick={leftClickHandler}
        ></FontAwesomeIcon>
      </div>
      {/* <div>
        <FontAwesomeIcon
          id="linechart"
          className={` cursor-pointer text-xl w-full py-2  ${active === 'linechart' ? 'selectedClass' : 'unSelectedClass'
            }`}
          icon={faLineChart}
          onClick={leftClickHandler}
        ></FontAwesomeIcon>
      </div> */}
      <div>
        <FontAwesomeIcon
          id="users"
          className={`cursor-pointer text-xl w-full py-2  ${active === 'users' ? 'selectedClass' : 'unSelectedClass'
            } `}
          icon={faUsers}
          onClick={leftClickHandler}
        ></FontAwesomeIcon>
      </div>
      <div className="mt-2 border-t border-solid border-gray-400">
        <FontAwesomeIcon
          id="expand"
          className={` cursor-pointer text-xl w-full py-2  ${active === 'expand' ? 'selectedClass' : 'unSelectedClass'
            } `}
          icon={faGreaterThan}
          onClick={leftClickHandler}
        ></FontAwesomeIcon>
      </div>
    </div>
  );
};

export default CollapsableMenu;