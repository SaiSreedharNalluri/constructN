import React, { useState } from 'react';
import Header from '../../../../components/divami_components/header/Header';
import { useRouter } from 'next/router';
import authHeader from '../../../../services/auth-header';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SidePanelMenu from '../../../../components/divami_components/side-panel/SidePanel';
import ScheduleView from '../../../../components/container/scheduleView';
import treeData from '../../../../project-plan-hierarchy.json';
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
              <SidePanelMenu onChangeData={() => {}} />
            </div>
            <div>
              <Tabs
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
                style={{ marginLeft: '1px' }}
              >
                <Tabs>
                  <TabList>
                    <Tab>Schedule View</Tab>
                    <Tab>Gantt View</Tab>
                  </TabList>

                  <TabPanel>
                    <iframe
                      className="w-95 h-93"
                      src={`https://dev.internal.constructn.ai/project-plan?projectId=${
                        router.query.projectId as string
                      }&token=${authHeader.getAuthToken()}`}
                    />
                  </TabPanel>
                  <TabPanel>
                    {/* <iframe
                      className="w-95 h-93"
                      src={`https://dev.internal.constructn.ai/gantt?projectId=${
                        router.query.projectId as string
                      }&token=${authHeader.getAuthToken()}`}
                    /> */}
                    <div className="overflow-auto h-93">
                      <ScheduleView treeData={treeData} />
                    </div>
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
