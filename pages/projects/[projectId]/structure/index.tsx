import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';
import { ChildrenEntity } from '../../../../models/IStructure';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import { getSnapshotsList } from '../../../../services/snapshot';
import { ISnapshot } from '../../../../models/ISnapshot';
import _ from 'lodash';
import DatePicker from '../../../../components/container/datePicker';
import Pagination from '../../../../components/container/pagination';
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RightOverLay from '../../../../components/container/RightOverLay';
import LeftOverLay from '../../../../components/container/leftOverLay';
import MapLoading from '../../../../components/container/mapLoading';
interface IProps {}

const Index: React.FC<IProps> = () => {
  const router = useRouter();
  const [structurId, setStructurId] = useState('');
  const [snapshotId, setSnapShotId] = useState('');
  const leftOverlayRef: any = useRef();
  const [leftNav, setLeftNav] = useState(false);
  const [snapshots, setSnapshots] = useState<ISnapshot[]>([]);
  const [bottomNav, setBottomNav] = useState(false);
  const BottomOverlayRef: any = useRef();
  const rightOverlayRef: any = useRef();
  const leftRefContainer: any = useRef();
  const rightrefContainer: any = useRef();
  const bottomRefContainer: any = useRef();
  const [viewerTypeState, setViewType] = useState('map');
  const [rightNav, setRightNav] = useState(false);

  const getStructureData = (structure: ChildrenEntity) => {
    getSnapshots(router.query.projectId as string, structure._id);
    setStructurId(structure._id);
  };
  const getSnapshots = (projectId: string, structurId: string) => {
    getSnapshotsList(projectId, structurId)
      .then((response) => {
        setSnapshots(response?.data?.result?.mSnapshots);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const activeClass = (e: any) => {
    setViewType(e.currentTarget.id);
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
  const closeStructurePage = (e: any) => {
    if (
      !leftRefContainer.current.contains(e.target) &&
      !bottomRefContainer.current.contains(e.target) &&
      !rightrefContainer.current.contains(e.target)
    ) {
      setLeftNav(false);
    }
  };
  const closeStructurePages = (e: any) => {
    if (
      !leftRefContainer.current.contains(e.target) &&
      !bottomRefContainer.current.contains(e.target) &&
      !rightrefContainer.current.contains(e.target)
    ) {
      setRightNav(false);
    }
  };
  useEffect(() => {
    const handler = document.addEventListener('click', closeStructurePages);
    return () => {
      document.removeEventListener('click', closeStructurePages);
    };
  }, []);
  useEffect(() => {
    const handler = document.addEventListener('click', closeStructurePage);
    return () => {
      document.removeEventListener('click', closeStructurePage);
    };
  }, []);
  const getSnapshotInfo = (snapshotData: ISnapshot) => {
    setSnapShotId(snapshotData._id);
  };

  return (
    <React.Fragment>
      <div className="h-screen ">
        <Header />
        <div className="absolute" ref={leftRefContainer}>
          <div className="flex">
            <div>
              <CollapsableMenu onChangeData={onChangeData} />
            </div>
            <div className="flex" id="viewer">
              <div id="map">
                {' '}
                {viewerTypeState === 'map' ? <MapLoading></MapLoading> : ''}
              </div>
              <div id="forge">
                {' '}
                {viewerTypeState === 'forge' ? <p>Forge</p> : ''}
              </div>
              <div id="potree">
                {viewerTypeState === 'potree' ? <p>potree</p> : ''}
              </div>
            </div>
          </div>
          <div
            ref={leftOverlayRef}
            className={`h-91 bg-gray-200 w-0 absolute   ${
              leftNav ? 'left-10' : 'left-10  '
            }   top-0  duration-300 overflow-x-hidden`}
          >
            <LeftOverLay getStructureData={getStructureData}></LeftOverLay>
          </div>
        </div>
        <div ref={bottomRefContainer}>
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
            className="w-0  absolute left-35 bottom-1  overflow-x-hidden z-10"
          >
            <div className="flex ">
              <div className=" bg-gray-200 rounded">
                <Pagination
                  snapshots={snapshots}
                  getSnapshotInfo={getSnapshotInfo}
                />
              </div>
              <div>
                <DatePicker></DatePicker>
              </div>
            </div>
          </div>
        </div>
        <div ref={rightrefContainer}>
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
      </div>
    </React.Fragment>
  );
};
export default Index;
