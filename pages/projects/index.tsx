import _ from "lodash";
import { GetServerSideProps } from "next";
import React from "react";
import Header from "../../components/divami_components/header/Header";
import ProjectsList from "../../components/container/projectsList";
import { IJobs } from "../../models/IJobs";
import { IProjects } from "../../models/IProjects";
import { getjobsInfo } from "../../services/jobs";
import { getProjects } from "../../services/project";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const resp: any = await getProjects(context);
  let tempData: IProjects[] = [];
  await Promise.all(
    resp.data.result.map(async (pData: IProjects) => {
      const jobResp: any = await getjobsInfo(pData._id, context);
      if (jobResp.data.result.length > 0) {
        pData.LastUpdatedOn = jobResp.data.result.sort(
          (a: IJobs, b: IJobs) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0].updatedAt;
      }
      tempData.push(pData);
    })
  );
  return {
    props: { projects: _.sortBy(tempData, "LastUpdatedOn") },
  };
};
interface IProps {
  projects: IProjects[];
}
const Projects: React.FC<IProps> = ({ projects }) => {
  return (
    <React.Fragment>
      <div className="flex-col">
        <div>
          <Header></Header>
        </div>
        <div className="bg-gray-100 w-screen ">
          <ProjectsList projects={projects} />
        </div>
      </div>
    </React.Fragment>
  );
};
export default Projects;
