import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';
import { getStructure } from '../../../../services/structure';
import { ChildrenEntity, IStrature } from '../../../../models/IStrature';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import { getSnapshotsList } from '../../../../services/snapshot';
import { ISnapShort } from '../../../../models/ISnapShort';
import Pagination from '../../../../components/container/pagination';
import _ from 'lodash';
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
  if (loadsnap) {
    let strature: any = _.find(structures, { parent: null });
    getSnapshots(router.query.projectId as string, strature._id);
    setLoadSnap(false);
  }
  const getsnapShortDetails = (snapShotId: string) => {
    console.log('e', snapShotId);
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
        <div className="left-35 bottom-4 w-1/3 bg-gray-300 rounded absolute ">
          <Pagination
            snapShots={snapShots}
            getsnapShortDetails={getsnapShortDetails}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
