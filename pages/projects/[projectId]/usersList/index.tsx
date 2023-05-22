import { useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import { UsersListing } from "../../../../components/divami_components/usersList/UsersListing";
import { Content } from "./usersListStyles";

const Index: React.FC<any> = () => {
  const breadCrumbsData = [{ label: "Manage Users" }];
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className=" w-full  h-full">
      <div className="w-full">
        {!isFullScreen && (
          <Header showBreadcrumbs breadCrumbData={breadCrumbsData} />
        )}

        {/* <Header breadCrumb={getBreadCrumbs()}></Header> */}
      </div>
      <Content>
        <SidePanelMenu onChangeData={() => {}} />
        <UsersListing />
      </Content>
    </div>
  );
};
export default Index;
