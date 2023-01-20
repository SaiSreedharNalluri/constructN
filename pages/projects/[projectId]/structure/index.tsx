import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';
import { ChildrenEntity } from '../../../../models/IStructure';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import { getSnapshotsList } from '../../../../services/snapshot';
import { getProjectDetails } from '../../../../services/project';
import { ISnapshot } from '../../../../models/ISnapshot';
import _ from 'lodash';
import DatePicker from '../../../../components/container/datePicker';
import Pagination from '../../../../components/container/pagination';
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RightOverLay from '../../../../components/container/RightOverLay';
import LeftOverLay from '../../../../components/container/leftOverLay';
import MapLoading from '../../../../components/container/mapLoading';
import authHeader from '../../../../services/auth-header';
interface IProps { }
const Index: React.FC<IProps> = () => {
  const router = useRouter();
  const [currentProjectId, setActiveProjectId] = useState('');
  const [structurId, setStructurId] = useState('');
  const [snapshotId, setSnapShotId] = useState('');
  const [projectutm, setProjectUtm] = useState('');
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
  useEffect(() => {
    if (router.isReady) {
      getProjectDetails(router.query.projectId as string).then((response) => {
        setProjectUtm(response?.data?.result?.utm);
        setActiveProjectId(router.query.projectId as string);
      });
    }
  }, [router.isReady, router.query.projectId]);

  const getStructureData = (structure: ChildrenEntity) => {
    getSnapshots(router.query.projectId as string, structure._id);
    setStructurId(structure._id);
  };

  const getSnapshots = (projectId: string, structurId: string) => {
    getSnapshotsList(projectId, structurId)
      .then((response) => {
        if (snapshotId === '') {
          setSnapShotId(response?.data?.result?.mSnapshots[0]._id);
        }
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
  const renderSwitch = (param: string) => {
    switch (param) {
      case 'potree':
        return <MapLoading></MapLoading>;

      case 'forge':
        return (
          <div className=" w-screen bg-black overflow-x-hidden overflow-y-hidden">
            forge
          </div>
        );

      case 'map':
        return (
          <div className="overflow-x-hidden overflow-y-hidden">
            <iframe
              className="overflow-x-hidden h-96 w-screen"
              src={`https://dev.internal.constructn.ai/2d?structure=${structurId}&snapshot1=${snapshotId}&zone_utm=${projectutm}&project=${currentProjectId as string
                }&token=${authHeader.getAuthToken()}`}
            />
          </div>
        );

      default:
        break;
    }
  };
  const rightNavCollapse = () => {
    if (!rightNav) {
      rightOverlayRef.current.style.width = '3%';
      rightOverlayRef.current.style.height = '35%';
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

  const getSnapshotInfo = (snapshotData: ISnapshot) => {
    setSnapShotId(snapshotData._id);
  };
  return (
    <React.Fragment>
      <div className="">
        <Header />
        <div className="fixed" ref={leftRefContainer}>
          <div className="flex">
            <div className="flex">
              <CollapsableMenu onChangeData={onChangeData} />
            </div>
            <div className="flex w-97" id="viewer">
              {renderSwitch(viewerTypeState)}
            </div>
          </div>
          <div
            ref={leftOverlayRef}
            className={`h-96 bg-gray-200 w-0 absolute   ${leftNav ? 'left-10' : 'left-10  '
              }   top-0  duration-300 overflow-x-hidden`}
          >
            <LeftOverLay
              getStructureData={getStructureData}
              getStructure={(strId) => {
                if (structurId === '') {
                  setStructurId(strId);
                }
              }}
            ></LeftOverLay>
          </div>
        </div>
        <div ref={bottomRefContainer}>
          {viewerTypeState != 'map' ? (
            <p
              className={`left-48  bg-gray-300 rounded absolute duration-300 cursor-pointer ${bottomNav ? 'bottom-11' : 'bottom-0'
                } `}
              onClick={bottomOverLay}
            >
              10-01-2022
            </p>
          ) : (
            ''
          )}
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
            className={`absolute  ${rightNav && 'rotate-180'
              } text-2xl text-blue-300 top-2/4 ${rightNav ? 'right-5' : 'right-0'
              }  cursor-pointer border-none rounded ml-2 p-1 bg-gray-400 text-white`}
            onClick={rightNavCollapse}
            icon={faGreaterThan}
          ></FontAwesomeIcon>
          <div
            ref={rightOverlayRef}
            id="bg-color"
            className={`fixed w-0  ${rightNav ? 'visible' : 'hidden'
              }  bg-gray-300 top-35 rounded z-10 right-0 duration-300 overflow-x-hidden`}
          >
            <RightOverLay></RightOverLay>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;