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
            let temp: IProjects[] = [];
            await Promise.all(
              response.data.result.map(async (pData: IProjects) => {
                const jobResp: any = await getjobsInfo(pData._id);
                if (jobResp.data.result.length > 0) {
                  pData.LastUpdatedOn = jobResp.data.result.sort(
                    (a: IJobs, b: IJobs) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )[0].updatedAt;
                }
                if (pData.LastUpdatedOn) {
                  tempData.push(pData);
                } else {
                  temp.push(pData);
                }
              })
            );
            tempData = tempData.sort(
              (a: any, b: any) =>
                new Date(b.LastUpdatedOn).getTime() -
                new Date(a.LastUpdatedOn).getTime()
            );
            setProjects(tempData.concat(temp));
            setLoading(true);
          }
        })
        .catch((error) => {});
    }
  }, [router.isReady]);
  console.log('projects', projects);
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
