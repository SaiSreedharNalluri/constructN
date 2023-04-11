import React, { useEffect, useState } from 'react';
import Header from '../../components/divami_components/header/Header';
import ProjectsList from '../../components/container/projectsList';
import { IProjects } from '../../models/IProjects';
import { getProjects } from '../../services/project';
import { useRouter } from 'next/router';
import { getjobsInfo } from '../../services/jobs';
import { IJobs } from '../../models/IJobs';
import _ from 'lodash';

const Projects: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<IProjects[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (router.isReady) {
      getProjects()
        .then(async (response) => {
          if (response?.data?.success === true) {
            let tempData: IProjects[] = [];
            await Promise.all(
              response.data.result.map(async (pData: IProjects) => {
                const jobResp: any = await getjobsInfo(pData._id);
                if (jobResp.data.result.length > 0) {
                  pData.LastUpdatedOn = jobResp.data.result.sort(
                    (a: IJobs, b: IJobs) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )[0].updatedAt;
                }
                tempData.push(pData);
              })
            );
            setProjects(_.sortBy(tempData, 'LastUpdatedOn'));
            setLoading(true);
          }
        })
        .catch((error) => {});
    }
  }, [router.isReady]);
  return (
    <React.Fragment>
      <div className="flex-col">
        <div>
          <Header></Header>
        </div>
        <div className="bg-gray-100 w-screen ">
          <ProjectsList projects={projects} loading={loading} />
        </div>
      </div>
    </React.Fragment>
  );
};
export default Projects;
