import React from 'react';
import Header from '../../../../components/container/header';
import { useRouter } from 'next/router';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import authHeader from '../../../../services/auth-header';
const Index: React.FC = () => {
  const router = useRouter();
  return (
    <React.Fragment>
      <div>
        <div>
          <Header />
          <div className="flex w-screen">
            <div>
              <CollapsableMenu onChangeData={() => {}} />
            </div>
            <div>
              <iframe
                className="w-95 h-91 overflow-x-hidden"
                src={`https://dev.internal.constructn.ai/reports?projectId=${
                  router.query.projectId as string
                }&token=${authHeader.getAuthToken()}`}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
