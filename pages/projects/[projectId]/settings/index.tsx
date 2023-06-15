import React from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import { IProjects } from "../../../../models/IProjects";
import ProjectDetails from "../../../../components/container/projectDetails";

interface IProps {
  projectData: IProjects;
}
const Index: React.FC<IProps> = () => {
  return (
    <div>
      <div>
        <Header></Header>
      </div>
      <div className="flex w-full fixed">
        <div>
          <SidePanelMenu onChangeData={() => {}}></SidePanelMenu>
        </div>
        <div className="calc-w  calc-h overflow-y-auto ">
          <ProjectDetails />
        </div>
      </div>
    </div>
  );
};

export default Index;
