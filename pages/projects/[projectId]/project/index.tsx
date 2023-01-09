import { GetServerSideProps } from 'next';
import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';
import ProjectDetails from '../../../../components/container/projectDetails';
import { getStructure } from '../../../../services/structure';
import { ChildrenEntity, IStrature } from '../../../../models/IStrature';
import Structure from '../../../../components/container/structure';
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
          <div>
            <select
              className="focus:outline-none"
              onChange={(e) => {
                getStractureHierarchy(e.target.value);
              }}
            >
              {structures &&
                structures.map((stractureData: any) => {
                  return (
                    <option
                      key={stractureData._id}
                      value={stractureData._id}
                      selected={stractureData.parent === null}
                    >
                      {stractureData.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="w-1/5">
            <Structure getStructureData={getStructureData}></Structure>
          </div>
          <ProjectDetails />
        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
