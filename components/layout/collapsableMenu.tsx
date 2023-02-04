import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faCog,
  faGreaterThan,
  faMap,
  faTachometerAltAverage,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import dashboard from "../../public/icons/dashboard.svg";
import viewer from "../../public/icons/leftPanelIcon2.svg";
import schedule from "../../public/icons/schedule.svg";
import settings from "../../public/icons/settings.svg";
import Image from 'next/image';
interface IProps {
  onChangeData: () => void;
}
const CollapsableMenu: React.FC<IProps> = ({ onChangeData }) => {
  const router = useRouter();
  const [active, setActive] = useState(router.pathname.split('/').pop());
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
      case 'schedule':
        router.push(`/projects/${router.query.projectId as string}/schedule`);
        break;
      case 'lineChart':
        router.push(`/projects/${router.query.projectId as string}/lineChart`);
        break;
      case 'settings':
        router.push(`/projects/${router.query.projectId as string}/settings`);
        break;
      case 'tasks':
        router.push(`/projects/${router.query.projectId as string}/tasks`);
        break;
      default:
        router.push(`/projects/${router.query.projectId as string}/structure`);
    }
    setActive(router.pathname.split('/').pop());
  };
  return (
    <div className=" w-11 h-screen text-center bg-gray-200 border border-gray-300">
      <div>
        <Image src={dashboard} alt="" id="dashboard" onClick={leftClickHandler} className={`w-1/2  text-4xl m-auto py-2 cursor-pointer  ${active === 'dashboard' ? 'selectedClass' : 'unSelectedClass'
          } `}></Image>
      </div>
      <div>
        <Image src={viewer} alt="" id="views" onClick={(e: any) => {
          if (active === 'structure') {
            onChangeData();
          } else {
            leftClickHandler(e);
          }
        }} className={`w-1/2  text-4xl m-auto py-2 cursor-pointer  ${active === 'views' ? 'selectedClass' : 'unSelectedClass'
          } `}></Image>
      </div>
      <div>
        <Image src={schedule} alt="" id="schedule" onClick={leftClickHandler} className={`w-1/2  text-4xl m-auto py-2 cursor-pointer  ${active === 'schedule' ? 'selectedClass' : 'unSelectedClass'
          } `}></Image>
      </div>
      <div>
        <Image src={settings} alt="" id="settings" onClick={leftClickHandler} className={`w-1/2  text-4xl m-auto py-2 cursor-pointer  ${active === 'settings' ? 'selectedClass' : 'unSelectedClass'
          } `}></Image>
      </div>
      {/* <div className="mt-2 border-t border-solid border-gray-400">
        <FontAwesomeIcon
          id="expand"
          className={` cursor-pointer text-xl w-full py-2  ${active === 'expand' ? 'selectedClass' : 'unSelectedClass'
            } `}
          icon={faGreaterThan}
          onClick={leftClickHandler}
        ></FontAwesomeIcon>
      </div> */}
    </div>
  );
};

export default CollapsableMenu;
