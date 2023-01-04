import { GetServerSideProps } from 'next';
import React from 'react';
import { IJobs } from '../../../../models/IJobs';
import { getjobsInfo } from '../../../../services/jobs';
import { useRouter } from 'next/router';
import _ from 'lodash';
import Header from '../../../../components/container/header';
import ProjectDetails from '../../../../components/container/projectDetails';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jobResp: any = await getjobsInfo(
    context.query.projectId as string,
    context
  );
  return {
    props: { jobs: jobResp.data.result },
  };
};

interface IProps {
  jobs: IJobs[];
}

const Index: React.FC<IProps> = ({ jobs }) => {
  const router = useRouter();

  return (
    <React.Fragment>
      <div className="h-screen">
        <div>
          <Header />
          <ProjectDetails></ProjectDetails>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
