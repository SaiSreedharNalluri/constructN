import React, { useState } from 'react';
import Header from '../../../../components/container/header';
import { useRouter } from 'next/router';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import authHeader from '../../../../services/auth-header';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
const Index: React.FC = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <React.Fragment>
      <div>
        <div>
          <Header />
          <div className="flex w-screen fixed">
            <div>
              <CollapsableMenu onChangeData={() => {}} />
            </div>
            <div>
              <Tabs
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
              >
                <Tabs>
                  <TabList>
                    <Tab>Dash Board</Tab>
                    <Tab>Reports</Tab>
                  </TabList>

                  <TabPanel>
                    <iframe
                      className="w-95 h-93"
                      src={`https://dev.internal.constructn.ai/task-dashboard?projectId=${
                        router.query.projectId as string
                      }&token=${authHeader.getAuthToken()}`}
                    />
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
      </div>
    </React.Fragment>
  );
};
export default Index;