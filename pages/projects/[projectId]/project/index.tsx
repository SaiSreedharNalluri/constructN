import { GetServerSideProps } from 'next';
import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';

import { getStructure } from '../../../../services/structure';
import { ChildrenEntity, IStrature } from '../../../../models/IStrature';
import Structure from '../../../../components/container/structure';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
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
  const getStractureHierarchy = (e: any) => {
    //console.log('vjhdkvnds', e.target.value);
  };
  const getStructureData = (strature: ChildrenEntity) => {
    console.log('stracture', strature);
  };
  return (
    <React.Fragment>
      <div className="h-screen">
        <div>
          <Header />



          <CollapsableMenu getStractureHierarchy={getStractureHierarchy} getStructureData={getStructureData} structures={structures}></CollapsableMenu>

        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
