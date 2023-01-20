import React from 'react';
import Header from '../../../../components/container/header';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
const Index: React.FC = () => {
  return (
    <React.Fragment>
      <div className="h-screen">
        <div>
          <Header />
          <div className='fixed'>
            <CollapsableMenu onChangeData={() => { }} />
          </div>

        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
