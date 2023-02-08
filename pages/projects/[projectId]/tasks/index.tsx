import React from 'react';
import Header from '../../../../components/divami_components/header/Header';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
const Index: React.FC = () => {
  return (
    <React.Fragment>
      <div className="h-screen">
        <div>
          <Header />
          <CollapsableMenu onChangeData={() => {}} />
        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
