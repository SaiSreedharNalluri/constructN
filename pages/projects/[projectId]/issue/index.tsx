import React from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
const Index: React.FC = () => {
  return (
    <React.Fragment>
      <div className="h-screen">
        <div>
          <Header />
          {/* <CollapsableMenu onChangeData={() => {}} /> */}
          <SidePanelMenu onChangeData={() => {}} />
        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
