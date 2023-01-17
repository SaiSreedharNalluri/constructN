import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';
import { ChildrenEntity } from '../../../../models/IStrature';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import { getSnapshotsList } from '../../../../services/snapshot';
import { ISnapShort } from '../../../../models/ISnapShort';
import _ from 'lodash';
import DatePicker from '../../../../components/container/datePicker';
import Pagination from '../../../../components/container/pagination';
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RightOverLay from '../../../../components/container/rightOverLay';
import LeftOverLay from '../../../../components/container/leftOverLay';
interface IProps {}

const Index: React.FC<IProps> = () => {
  const router = useRouter();
  const leftOverlayRef: any = useRef();
  const [leftNav, setLeftNav] = useState(true);
  const [snapShots, setSnapShots] = useState<ISnapShort[]>([]);
  const [bottomNav, setBottomNav] = useState(false);
  const BottomOverlayRef: any = useRef();
  const rightOverlayRef: any = useRef();
  const [rightNav, setRightNav] = useState(false);
  const getStractureHierarchy = (e: any) => {};
  const getStructureData = (strature: ChildrenEntity) => {
    getSnapshots(router.query.projectId as string, strature._id);
  };
  const getSnapshots = (projectId: string, structurId: string) => {
    getSnapshotsList(projectId, structurId)
      .then((response) => {
        setSnapShots(response?.data?.result?.mSnapshots);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const bottomOverLay = () => {
    if (!bottomNav) {
      BottomOverlayRef.current.style.width = '45%';
    } else {
      BottomOverlayRef.current.style.width = '0%';
    }
    setBottomNav(!bottomNav);
  };
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
  useEffect(() => {
    if (leftNav) {
      leftOverlayRef.current.style.width = '18vw';
    } else {
      leftOverlayRef.current.style.width = '0%';
    }
  }, [leftNav]);
  const onChangeData = () => {
    if (leftNav) {
      setLeftNav(false);
    } else {
      setLeftNav(true);
    }
  };
  return (
    <React.Fragment>
      <div className="h-screen">
        <div>
          <Header />
          <CollapsableMenu onChangeData={onChangeData} />
          <div
            ref={leftOverlayRef}
            className={`h-full bg-gray-200 w-0 absolute   ${
              leftNav ? 'left-10' : 'left-10  '
            }   top-9   duration-300 overflow-x-hidden`}
          >
            <LeftOverLay
              getStractureHierarchy={getStractureHierarchy}
              getStructureData={getStructureData}
            ></LeftOverLay>
          </div>
        </div>
        <p
          className={`left-48  bg-gray-300 rounded absolute duration-300 cursor-pointer ${
            bottomNav ? 'bottom-11' : 'bottom-0'
          } `}
          onClick={bottomOverLay}
        >
          10-01-2022
        </p>

        <div
          ref={BottomOverlayRef}
          className="w-0  rounded absolute left-35 bottom-1  overflow-x-hidden z-10"
        >
          <div className="flex ">
            <div className=" bg-white">
              <Pagination snapShots={snapShots} />
            </div>
            <div>
              <DatePicker></DatePicker>
            </div>
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
    </React.Fragment>
  );
};
export default Index;
