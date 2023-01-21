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
interface IProps {}
const Index: React.FC<IProps> = () => {
  const router = useRouter();
  const [currentProjectId, setActiveProjectId] = useState('');
  const [structureObj, setStructureObj] = useState<ChildrenEntity>();
  const [snapshotObj, setSnapShotObj] = useState<ISnapshot>();
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
    setStructureObj(structure);
  };

  const getSnapshots = (projectId: string, structurId: string) => {
    getSnapshotsList(projectId, structurId)
      .then((response) => {
        let snapResult: ISnapshot[] = response?.data?.result?.mSnapshots?.sort(
          (a: ISnapshot, b: ISnapshot) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setSnapShotObj(snapResult[0]);
        setSnapshots(snapResult);
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
          <div className="w-screen h-screen bg-blue-500 overflow-x-hidden overflow-y-hidden">
            forge
          </div>
        );

      case 'map':
        return (
          snapshotObj &&
          structureObj && (
            <div className="overflow-x-hidden overflow-y-hidden">
              <iframe
                className="overflow-x-hidden h-96 w-screen"
                src={`https://dev.internal.constructn.ai/2d?structure=${
                  structureObj?._id
                }&snapshot1=${
                  snapshotObj?._id
                }&zone_utm=${projectutm}&project=${
                  currentProjectId as string
                }&token=${authHeader.getAuthToken()}`}
              />
            </div>
          )
        );

      default:
        break;
    }
  };
  const rightNavCollapse = () => {
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
    setSnapShotObj(snapshotData);
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
            <div className="flex " id="viewer">
              {renderSwitch(viewerTypeState)}
            </div>
          </div>
          <div
            ref={leftOverlayRef}
            className={`h-96 bg-gray-200 w-0 absolute   ${
              leftNav ? 'left-10' : 'left-10  '
            }   top-0  duration-300 overflow-x-hidden`}
          >
            <LeftOverLay
              getStructureData={getStructureData}
              getStructure={(structureData) => {
                if (structureObj === undefined) {
                  getSnapshots(
                    router.query.projectId as string,
                    structureData._id
                  );
                  setStructureObj(structureData);
                }
              }}
            ></LeftOverLay>
          </div>
        </div>
        <div ref={bottomRefContainer}>
          {viewerTypeState != 'map' ? (
            <p
              className={`left-48  bg-gray-300 rounded absolute duration-300 cursor-pointer ${
                bottomNav ? 'bottom-11' : 'bottom-0'
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
            className="w-0  absolute left-1/2 bottom-1  overflow-x-hidden z-10"
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

        <div ref={rightrefContainer} className="relative  ">
          <FontAwesomeIcon
            className={`fixed  ${
              rightNav && 'rotate-180'
            } text-2xl text-blue-300  ${
              rightNav ? 'right-34' : 'right-0'
            }  top-46  cursor-pointer border-none rounded  p-1 bg-gray-400 text-white`}
            onClick={rightNavCollapse}
            icon={faGreaterThan}
          ></FontAwesomeIcon>
          <div
            ref={rightOverlayRef}
            id="bg-color"
            className={`fixed  lg:w-3 2xl:w-1   ${
              rightNav ? 'visible' : 'hidden'
            }  bg-gray-200 top-40   rounded  lg:right-0  duration-300 overflow-x-hidden`}
          >
            <RightOverLay></RightOverLay>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
