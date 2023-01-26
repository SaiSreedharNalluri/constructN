import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';
import Treelist from '../../../../components/container/treeList';
import {
  assignProjectUser,
  getProjectDetails,
  getProjectUsers,
} from '../../../../services/project';
import { IProjectUsers } from '../../../../models/IProjects';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import authHeader from '../../../../services/auth-header';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import 'react-tabs/style/react-tabs.css';
import { ChildrenEntity } from '../../../../models/IStructure';
import { AxiosResponse } from 'axios';
import { getStructureHierarchy } from '../../../../services/structure';
import ProjectInfo from '../../../../components/container/projectInfo';
import ProjectUserAdd from '../../../../components/container/projectUsersAdd';
import { toast } from 'react-toastify';
const Editproject: React.FC = () => {
  const router = useRouter();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  let [state, setState] = useState<ChildrenEntity[]>([]);
  let [structureData, setStructureData] = useState<ChildrenEntity>();
  let [projectData, setProjectData] = useState<any>();
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
  const addProjectUser = (userInfo: object) => {
    assignProjectUser(userInfo, router.query.projectId as string)
      .then((response) => {
        if (response?.success === true) {
          toast.error(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
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
                <ProjectInfo projectData={projectData} />
              </TabPanel>
              <TabPanel>
                <ProjectUserAdd
                  projectUsers={projectUsers}
                  addProjectUser={addProjectUser}
                />
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
