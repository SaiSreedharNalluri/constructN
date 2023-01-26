import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import router from 'next/router';
import Treelist from '../../../../components/container/treeList';
import {
  getProjectDetails,
  getProjectUsers,
} from '../../../../services/project';
import { IProjects, IProjectUsers } from '../../../../models/IProjects';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import authHeader from '../../../../services/auth-header';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import 'react-tabs/style/react-tabs.css';
import { ChildrenEntity } from '../../../../models/IStructure';
import { AxiosResponse } from 'axios';
import { getStructureHierarchy } from '../../../../services/structure';
const Editproject: React.FC = () => {
  const router = useRouter();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  let [state, setState] = useState<ChildrenEntity[]>([]);
  let [structureData, setStructureData] = useState<ChildrenEntity>();
  let [projectData, setProjectData] = useState<IProjects>();
  useEffect(() => {
    if (router.isReady) {
      getProjectUsers(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setProjectUsers(response.result);
          }
        })
        .catch();
      getStructureHierarchy(router.query.projectId as string)
        .then((response: AxiosResponse<any>) => {
          setState([...response.data.result]);
          setStructureData(response.data.result[0]);
        })
        .catch((error) => {
          console.log('error', error);
        });
      getProjectDetails(router.query.projectId as string)
        .then((response) => {
          if (response?.data?.success === true) {
            setProjectData(response?.data?.result);
          }
        })
        .catch();
    }
  }, [router.isReady, router.query.projectId]);

  return (
    <div className="w-full h-screen">
      <div className="">
        <Header />
      </div>
      <div className="flex w-screen fixed">
        <div>
          <CollapsableMenu onChangeData={() => {}} />
        </div>
        <div className="w-screen">
          <Tabs
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}
          >
            <Tabs>
              <TabList>
                <Tab>Project Info</Tab>
                <Tab>User Info</Tab>
                <Tab>Project Structure</Tab>
                <Tab>Type Configration</Tab>
              </TabList>
              <TabPanel>
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
                    <label className=" text-sm font-bold mb-2">
                      Project Name
                    </label>
                    <input
                      className=" border border-solid border-gray-500 rounded w-full py-2 px-2"
                      type="text"
                      placeholder="projectName"
                      name="projectName"
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
                    <label className="text-sm font-bold mb-2">
                      Location (lat,long){' '}
                    </label>
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
              </TabPanel>
              <TabPanel>
                <div className="w-full  grid grid-cols-1  gap-y-4 px-4 py-4">
                  <h1>Add Users</h1>

                  <div>
                    <input
                      placeholder="email "
                      className="w-8/12 rounded border px-2 py-1.5 border-solid border-gray-500"
                    ></input>
                  </div>
                  <div>
                    <select className="border border-solid border-gray-500 w-8/12 px-2 py-1.5 rounded">
                      <option></option>
                      <option>admin</option>
                      <option>collaborator</option>
                      <option>viewer</option>
                    </select>
                  </div>
                  <div className="flex  justify-center w-8/12 ">
                    <button className="bg-gray-500 rounded hover:bg-gray-300 text-white  py-1 px-2  ">
                      Add User
                    </button>
                  </div>
                  <div className="h-20 overflow-y-auto w-8/12 ">
                    <div className="flex justify-between mr-2">
                      {projectUsers &&
                        projectUsers.map((pUserData: any) => {
                          return (
                            <div key={pUserData.user._id}>
                              <p>{pUserData.user.fullName} </p>
                            </div>
                          );
                        })}

                      <div>
                        <FontAwesomeIcon
                          className="ml-2 text-gray-600 cursor-pointer"
                          icon={faTrash}
                        ></FontAwesomeIcon>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="flex">
                  <div className="w-2/5  bg-gray-200">
                    {state.length === 0 ? (
                      'no structures found for this project'
                    ) : (
                      <Treelist
                        treeList={state}
                        getStructureData={(structure: ChildrenEntity) => {
                          setStructureData(structure);
                        }}
                      />
                    )}
                  </div>
                  <div className="ml-6">
                    <h1 className="">Project Details</h1>
                    <div>
                      <span>Id:</span>
                      {structureData?._id}
                      <br />
                      <span>Name:</span>
                      {structureData?.name}
                      <br />
                      <span>Type:</span>
                      {structureData?.type}
                      <br />
                      <span>parent :</span>
                      {structureData?.parent}
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <iframe
                  className="w-95 h-93  "
                  src={`https://dev.internal.constructn.ai/reports?projectId=${
                    router.query.projectId as string
                  }&token=${authHeader.getAuthToken()}`}
                />
              </TabPanel>
            </Tabs>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Editproject;
