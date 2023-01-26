import React, { useState } from 'react';
import Image from 'next/image';
import { IProjects } from '../../models/IProjects';
interface IProps {
  projectData: IProjects;
}
const ProjectInfo: React.FC<IProps> = ({ projectData }) => {
  // const [name, setName] = useState(projectData.name);
  return (
    <React.Fragment>
      <div className="inset-x-1/2 grid grid-cols-2 place-content-center gap-8 px-4">
        <div className="col-span-2">
          <Image
            alt=""
            className=" w-11/12    border border-solid border-black  cursor-pointer"
            width={1080}
            height={1080}
            src="https://constructn-projects.s3.ap-south-1.amazonaws.com/PRJ257057/coverPhoto.png"
          />
        </div>
        <div>
          <label className=" text-sm font-bold mb-2">Project Name</label>
          <input
            className=" border border-solid border-gray-500 rounded w-full py-2 px-2"
            type="text"
            placeholder="projectName"
            name="name"
          />
        </div>
        <div>
          <div className=" font-bold">
            <h1>Project type</h1>
          </div>
          <div>
            <select className="border border-solid border-gray-500 w-full p-2  rounded">
              <option></option>
              <option>Residential</option>
              <option>Pipeline</option>
              <option>Road</option>
              <option>Solar</option>
            </select>
          </div>
        </div>

        <div className="col-span-2">
          <label className="text-sm  font-bold mb-2">
            Project Description{' '}
          </label>
          <input
            className="border border-solid border-gray-500 rounded py-2 px-2 w-full text-gray-500"
            placeholder="Type here..."
          />
        </div>
        <div>
          <label className="text-sm font-bold mb-2">Location (lat,long) </label>
          <input className=" border border-solid border-gray-500 rounded py-2 px-2 w-full" />
        </div>
        <div>
          <label className="text-sm font-bold mb-2">Zone </label>
          <input
            className="border border-solid border-gray-500 rounded py-2 px-2 w-full text-gray-500"
            placeholder="Type here..."
          />
        </div>

        <div className="flex col-span-2 justify-center ">
          <button className="bg-gray-500 rounded hover:bg-gray-300 text-white font-bold py-1 px-2 w-3/12 ">
            Save
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ProjectInfo;
