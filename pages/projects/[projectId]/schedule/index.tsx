import React, { useEffect, useState } from 'react';
import Header from '../../../../components/divami_components/header/Header';
import { useRouter } from 'next/router';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SidePanelMenu from '../../../../components/divami_components/side-panel/SidePanel';
import { MyComponent } from '../../../../utils/ganttView';
import ScheduleView from '../../../../components/container/scheduleView';
import treeData from '../../../../project-plan-hierarchy.json';
const Index: React.FC = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  useEffect(() => {
    if (typeof window !== undefined && tabIndex === 1) {
      MyComponent();
    }
  }, [tabIndex]);
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
                <TabList>
                  <Tab>Schedule View</Tab>
                  <Tab>Gantt View</Tab>
                </TabList>
                <TabPanel>
                  <div className="overflow-auto h-93">
                    <ScheduleView treeData={treeData} />
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="overflow-auto  h-93 w-96">
                    <div id="GanttChartDIV"></div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
