import { GetServerSideProps } from 'next';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';
import { getStructure } from '../../../../services/structure';
import { ChildrenEntity, IStrature } from '../../../../models/IStrature';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import { getSnapshotsList } from '../../../../services/snapshot';
import { ISnapShort } from '../../../../models/ISnapShort';
import Pagination from '../../../../components/container/pagination';
import _ from 'lodash';
import DatePicker from '../../../../components/container/datePicker';
export const getServerSideProps: GetServerSideProps = async (context) => {
  const stractureResp: any = await getStructure(
    context.query.projectId as string,
    context
  );
  return {
    props: { structures: stractureResp.data.result },
  };
};

interface IProps {
  structures: IStrature[];
}

const Index: React.FC<IProps> = ({ structures }) => {
  const router = useRouter();
  const [snapShots, setSnapShots] = useState<ISnapShort[]>([]);
  const [loadsnap, setLoadSnap] = useState(true);
  const [bottomNav, setBottomNav] = useState(false);
  const BottomOverlayRef: any = useRef();
  const getStractureHierarchy = (e: any) => { };
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
  if (loadsnap) {
    let strature: any = _.find(structures, { parent: null });
    getSnapshots(router.query.projectId as string, strature._id);
    setLoadSnap(false);
  }
  const getsnapShortDetails = (snapShotId: string) => {
    console.log('e', snapShotId);
  };
  const bottomOverLay = () => {
    if (!bottomNav) {
      BottomOverlayRef.current.style.width = '45%';
    } else {
      BottomOverlayRef.current.style.width = '0%';
    }
    setBottomNav(!bottomNav);
  };
  return (
    <React.Fragment>
      <div className="h-screen">
        <div>
          <Header />
          <CollapsableMenu
            getStractureHierarchy={getStractureHierarchy}
            getStructureData={getStructureData}
            structures={structures}
          />
        </div>
        {/* <p
          className={`left-48  bg-gray-300 rounded absolute duration-300 cursor-pointer ${bottomNav ? 'bottom-11' : 'bottom-0'
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
            <div className="w-3/4 bg-white">
              <Pagination
                getsnapShortDetails={getsnapShortDetails}
                snapShots={snapShots}
              />
            </div>
            <div>
              <DatePicker></DatePicker>
            </div>
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
};
export default Index;
