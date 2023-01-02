import React from 'react';
import { IProjects } from '../../models/IProjects';
import Moment from 'moment';
import { useRouter } from 'next/router';
import NextImage from '../core/Image';
interface IProps {
  projects: IProjects[];
}
let ProjectsList: React.FC<IProps> = ({ projects }) => {
  const router = useRouter();
  const goToJobsPage = (projectId: string, pName: string) => {
    router.push(`projects/${projectId}/project?name=${pName}`);
  };

  return (
    <div>
      <div className="h-91 overflow-y-scroll px-2 py-2 ">
        {projects.map((pData) => {
          return (
            <div
              className="flex  even:bg-white odd:bg-white mb-3"
              key={pData._id}
            >
              <div className="flex items-center flex-col w-1/12 h-1/6">
                <h4 className="text-gray-500">{pData._id} </h4>
                <NextImage src={pData.coverPhoto} className="w-20" />
              </div>
              <div className="flex items-center flex-col w-3/12  ">
                <div>
                  <h3 className="text-gray-500 ">Project Name</h3>
                </div>
                <div>
                  <h4 className="mt-2">{pData.name}</h4>
                </div>
              </div>
              <div className="flex items-center   flex-col w-2/12">
                <div>
                  <h3 className="text-gray-500">Updated Date</h3>
                </div>
                <div className="flex flex-col ">
                  {pData.LastUpdatedOn ? (
                    <h4 className="mt-2">
                      {Moment(pData.LastUpdatedOn).format('MMM Do YYYY, h:mma')}
                    </h4>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div className="flex items-center  flex-col w-2/12">
                <div>
                  <h5 className="text-gray-500">Jobs</h5>
                </div>
                <div className="flex  items-start flex-col">
                  <h2>Jobs Open:{pData.jobsOpened}</h2>
                  <h2>Jobs in Progress:0</h2>
                  <h2>Jobs Completed:0</h2>
                </div>
              </div>
              <div className="flex items-center  flex-col w-2/12">
                <h6 className="text-gray-500">Job Management</h6>
                <div className="mt-2">
                  {pData.LastUpdatedOn ? (
                    <button
                      className="bg-custom-yellow hover:bg-border-yellow shadow shadow-gray-800 p-0.5 rounded border border-solid border-gray-500 "
                      onClick={() => {
                        goToJobsPage(pData._id, pData.name);
                      }}
                    >
                      Job Management
                    </button>
                  ) : (
                    <button
                      className="bg-custom-yellow  shadow-gray-800 p-0.5 border border-solid border-gray-500 rounded opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Job Management
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center flex-col w-2/12">
                <h6 className="text-gray-500">Snapshot Details</h6>
                <div className="mt-2">
                  {pData.LastUpdatedOn ? (
                    <button className="bg-custom-yellow hover:bg-border-yellow shadow shadow-gray-800 p-0.5 rounded border border-solid border-gray-500 ">
                      Snapshot Details
                    </button>
                  ) : (
                    <button
                      className="bg-custom-yellow  shadow-gray-800 p-0.5 border border-solid border-gray-500 rounded opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Snapshot Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ProjectsList;
