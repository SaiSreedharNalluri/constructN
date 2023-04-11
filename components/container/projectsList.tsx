import React from "react";
import { IProjects } from "../../models/IProjects";
import Moment from "moment";
import { useRouter } from "next/router";
import NextImage from "../core/Image";
import { Mixpanel } from '../analytics/mixpanel';
interface IProps {
  projects: IProjects[];
}
let ProjectsList: React.FC<IProps> = ({ projects }) => {
  const router = useRouter();
  
  Mixpanel.track('projects_list_page_open')
  return (
    <div className="h-full calc-h overflow-y-auto grid  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 p-2 ">
      {projects &&
        projects.map((pData) => {
          return (
            <div key={pData._id}>
              <div className="m-auto  border p-2 border-gray-900 border-solid h-11/12 w-11/12 mt-6 rounded-2xl  text-center  bg-white">
                <div
                  onClick={() => {
                    window.localStorage.setItem("nodeData", "");
                    window.localStorage.setItem("expandedNodes", "");
                    Mixpanel.track('projects_list_page_close')
                    router.push(`projects/${pData._id}/structure`);
                  }}
                >
                  <NextImage
                    className="h-7 mt-8 cursor-pointer w-1/2 m-auto hover:border border-gray-500 border-solid"
                    src={
                      pData.coverPhoto
                        ? pData.coverPhoto
                        : 'https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/defaults/projectCoverPhoto.webp'
                    }
                  />
                </div>
                <div>
                  <div className="font-bold mt-4">
                    <p className="h-4">{pData.name}</p>
                  </div>
                  <p className="mt-6">last capture:</p>
                  {pData.LastUpdatedOn ? (
                    <h4 className="mt-2">
                      {Moment(pData.LastUpdatedOn).format("MMM Do YYYY")}
                    </h4>
                  ) : (
                    <div className="mt-2">
                      <p> N/A</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default ProjectsList;
