import React from 'react';
import { IProjects } from '../../models/IProjects';
import Moment from 'moment';
import { useRouter } from 'next/router';
import NextImage from '../core/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
interface IProps {
  projects: IProjects[];
}
let ProjectsList: React.FC<IProps> = ({ projects }) => {
  const router = useRouter();
  const goToProject = (projectId: string) => {
    router.push(`projects/${projectId}/structure`);
  };
  return (
    <div className="h-93 overflow-y-scroll grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 p-2 ">
      {projects.map((pData) => {
        return (
          <div key={pData._id}>
            <div className=" border p-2 border-gray-900 border-solid h-11/12  mt-6 rounded-2xl m-4 text-center  bg-white">
              <div onClick={() => goToProject(pData._id)}>
                <NextImage
                  className="h-16 mt-8 cursor-pointer w-11/12 m-auto hover:border border-gray-500 border-solid"
                  src={pData.coverPhoto}
                />
              </div>
              <div>
                <div className="font-bold mt-4">
                  <p className="h-4">{pData.name}</p>
                </div>
                <p className="mt-6">last capture:</p>
                {pData.LastUpdatedOn ? (
                  <h4 className="mt-2">
                    {Moment(pData.LastUpdatedOn).format('MMM Do YYYY')}
                  </h4>
                ) : (
                  <div className='mt-2'>
                    <p> N/A</p>
                  </div>
                )}
                <div className="mt-4 text-gray-400">
                  <FontAwesomeIcon size="2x" icon={faPen}></FontAwesomeIcon>
                  <FontAwesomeIcon
                    style={{ marginLeft: '20px' }}
                    size="2x"
                    icon={faUserPlus}
                  ></FontAwesomeIcon>
                  <FontAwesomeIcon
                    style={{ marginLeft: '20px' }}
                    size="2x"
                    icon={faListUl}
                  ></FontAwesomeIcon>
                  <FontAwesomeIcon
                    style={{ marginLeft: '20px' }}
                    size="2x"
                    icon={faTrash}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ProjectsList;
