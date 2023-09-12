import { useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import { UsersListing } from "../../../../components/divami_components/usersList/UsersListing";
import {
  Content,
  SidePanelMenuContainer,
} from "../../../../components/divami_components/project-users-list/usersListStyles";

const Index: React.FC<any> = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className=" w-full  h-full">
      <div className="w-full">
        {!isFullScreen && (
          <Header
            showBreadcrumbs
            breadCrumbData={[]}
            fromUsersList
            showFirstElement={true}
          />
        )}

        {/* <Header breadCrumb={getBreadCrumbs()}></Header> */}
      </div>
      <Content>
        <SidePanelMenuContainer onChangeData={() => {}} />
        <UsersListing />
      </Content>
    </div>
  );
};
export default Index;
