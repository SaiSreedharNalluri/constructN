import React, { useEffect, useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import NewGenViewer from "../../../../components/container/NewGenViewer";
import { IGenData } from "../../../../models/IGenData";
const StructPage: React.FC = () => {
    const [initData,setInintData] = useState<IGenData>();
    
  return (
    <React.Fragment>
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>
        <div className="flex flex-row left-0">
          {/* <CollapsableMenu onChangeData={() => {}} /> */}
          <div><SidePanelMenu onChangeData={() => {}} /></div>
          {/* <div><NewGenViewer data={initData}/> </div> */}
        </div>
        
      </div>
    </React.Fragment>
  );
};
export default StructPage;