import React from 'react';
const ProjectDetails: React.FC = () => {
  return (
    <React.Fragment>
      <div className='flex h-91 overflow-y-scroll'>
        <div className='bg-black w-1/4 h-91'>
          <div className='h-2/6 bg-gray-800'></div>
        </div>
        <div className='  w-2/3'>

          <div className='bg-red-200 h-5/6'></div>
          <div className='bg-red-900 h-5/6'></div>

        </div>
        <div className='bg-blue-400 w-1/12'></div>
      </div>
    </React.Fragment>
  );
};
export default ProjectDetails;
