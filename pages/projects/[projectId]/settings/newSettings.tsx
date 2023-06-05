


import React, { useEffect, useState } from 'react'
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from '../../../../components/divami_components/side-panel/SidePanel';
import { IProjects } from '../../../../models/IProjects';
import ProjectDetails from '../../../../components/container/projectDetails';
import { getProjectDetails } from '../../../../services/project';
import { useRouter } from "next/router";

interface IProps {
  projectData: IProjects;
}
const NewSettings:React.FC<IProps>=()=>{
  const router = useRouter();
  let [projectData, setProjectData] = useState<IProjects>();
useEffect(()=>{
if(router.isReady){
  getProjectDetails(router.query.projectId as string)
  .then((response) => {
    if (response?.data?.success === true) {
      setProjectData(response?.data?.result);
    }
  })
  .catch();
}
},[router.isReady, router.query.projectId])  
  return (
    <div>
      <div>
      <Header></Header>
      </div>
      <div className="flex w-full fixed" >
      <div>
        <SidePanelMenu onChangeData={() => {}} ></SidePanelMenu>
      </div>
      <div className="calc-w  calc-h overflow-y-auto ">
      <ProjectDetails projectData={projectData as IProjects}></ProjectDetails>
      </div>
      </div>
    </div>
  )
}


export default NewSettings