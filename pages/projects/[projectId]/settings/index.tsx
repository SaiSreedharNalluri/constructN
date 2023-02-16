import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../../../components/divami_components/header/Header";
import Treelist from "../../../../components/container/treeList";
import {
  assignProjectUser,
  getProjectDetails,
  getProjectUsers,
  removeProjectUser,
  updateProjectCover,
  updateProjectInfo,
} from "../../../../services/project";
import { IProjectUsers } from "../../../../models/IProjects";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import authHeader from "../../../../services/auth-header";
import CollapsableMenu from "../../../../components/layout/collapsableMenu";
import "react-tabs/style/react-tabs.css";
import { ChildrenEntity } from "../../../../models/IStructure";
import { AxiosResponse } from "axios";
import { getStructureHierarchy } from "../../../../services/structure";
import ProjectInfo from "../../../../components/container/projectInfo";
import ProjectUserAdd from "../../../../components/container/projectUsersAdd";
import { toast } from "react-toastify";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
const Editproject: React.FC = () => {
  const router = useRouter();
  const [projectUsers, setProjectUsers] = useState<IProjectUsers[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  let [state, setState] = useState<ChildrenEntity[]>([]);
  const [selector,setSelector]=useState('');
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
          setSelector(response.data.result[0]._id)
        })
        .catch((error) => {
          console.log("error", error);
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
          toast.success(response?.message);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const updateProjectData = (projectInfo: any) => {
    if (
      projectInfo.latitude != undefined &&
      projectInfo.longitude != undefined
    ) {
      delete projectInfo.location;
      projectInfo.location = [projectInfo.latitude, projectInfo.longitude];
      delete projectInfo.latitude;
      delete projectInfo.longitude;
    }

    updateProjectInfo(projectInfo, router.query.projectId as string)
      .then((response) => {
        if (response.success === true) {
          toast.success("Project details updated sucessfully");
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const deassignProjectUser = (userInfo: string) => {
    removeProjectUser(userInfo, router.query.projectId as string)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const handleImageUPload = (e: any) => {
    const formData = new FormData();
    formData.append("file", e.file);
    updateProjectCover(formData, router.query.projectId as string)
      .then((response) => {
        console.log("response", response);
        if (response?.success === true) {
          toast.success("Project cover photo updated sucessfully");
          setProjectData(response.result);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  return (
    <div className="w-full h-screen  ">
      <div>
        <Header />
      </div>
      <div className="flex w-screen fixed">
        <div>
          {/* <CollapsableMenu onChangeData={() => { }} /> */}
          {/* <CollapsableMenu onChangeData={() => { }} />
          < */}
          <SidePanelMenu onChangeData={() => {}} />
        </div>
        <div className="w-full ">
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
              <TabPanel className="">
                {projectData && (
                  <ProjectInfo
                    handleImageUPload={handleImageUPload}
                    projectData={projectData}
                    updateProjectData={updateProjectData}
                  />
                )}
              </TabPanel>
              <TabPanel>
                <ProjectUserAdd
                  deassignProjectUser={deassignProjectUser}
                  projectUsers={projectUsers}
                  addProjectUser={addProjectUser}
                />
              </TabPanel>
              <TabPanel>
                <div className="flex ">
                  <div className="w-full lg:w-1/4 sm:w-1/3 2xl:w-1/5 calc-h50 overflow-y-auto  overflow-x-hidden bg-gray-200">
                    {state.length === 0 ? (
                      "No structures found for this project"
                    ) : (
                      <Treelist
                        treeList={state}
                        initialSelector={selector}
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
                  {/* <div className='ml-6  '>
                      <h1 className="">Project Details</h1>
                      <div className='flex flex-col'>
                        <div className='flex'>
                          <p>Id:</p>
                          {structureData?._id}
                        </div>
                        <div className='flex'>
                          <p>Name:</p>
                          <p> {structureData?.name}</p>
                        </div>


                        <span>Type:</span>
                        {structureData?.type}
                        <br />
                        <span>parent :</span>
                        {structureData?.parent}
                      </div>
                    </div> */}
                </div>
                {/* <table className='table-auto border-collapse border mt-4 border-slate-300 '>
                      <thead className="border border-solid border-gray-500">
                        <tr >
                          <th className="p-1 border border-solid border-gray-500">Structure Id </th>
                          <th className="p-1 border border-solid border-gray-500">Name</th>
                          <th className="p-1 border border-solid border-gray-500">Type</th>
                          <th className="p-1 border border-solid border-gray-500">Parent</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="even:bg-gray-300 odd:bg-white-100 border border-solid border-gray-500">
                          <td className="p-1 border border-solid border-gray-500">{structureData?._id}</td>
                          <td className="p-1 border border-solid border-gray-500">{structureData?.name}</td>
                          <td className="p-1 border border-solid border-gray-500">{structureData?.type}</td>
                          <td className="p-1 border border-solid border-gray-500">{structureData?.parent}</td>


                        </tr>
                      </tbody>
                    </table> */}
                {/* <div className='ml-6'>
                      <h1 className="">Project Details</h1>
                      <div className='flex flex-col'>
                        <div className='flex'>
                          <p>Id:</p>
                          {structureData?._id}
                        </div>
                        <div className='flex'>
                          <p>Name:</p>
                          <p> {structureData?.name}</p>
                        </div>


                        <span>Type:</span>
                        {structureData?.type}
                        <br />
                        <span>parent :</span>
                        {structureData?.parent}
                      </div>
                    </div> */}
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
