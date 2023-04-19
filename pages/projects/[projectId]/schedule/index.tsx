import React, { useEffect, useState } from 'react';
import Header from '../../../../components/divami_components/header/Header';
import { useRouter } from 'next/router';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import SidePanelMenu from '../../../../components/divami_components/side-panel/SidePanel';
import { getGanttView } from '../../../../utils/ganttView';
import ScheduleView from '../../../../components/container/scheduleView';
import {
  getGanttViewData,
  getScheduleViewData,
} from '../../../../services/project';
const Index: React.FC = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [treeData, setTreeData] = useState<any>();
  const [ganttData, setGanttData] = useState<any>();
  useEffect(() => {
    if (router.isReady) {
      getScheduleViewData(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setTreeData(response.result);
          }
        })
        .catch();
      getGanttViewData(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setGanttData(response.result);
          }
        })
        .catch();
    }
  }, [router.isReady, router.query.projectId]);
  useEffect(() => {
    if (
      typeof window !== undefined &&
      tabIndex === 1 &&
      ganttData?.length > 0
    ) {
      getGanttView(ganttData);
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
                    {treeData && (
                      <ScheduleView treeData={treeData} key={treeData} />
                    )}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="overflow-auto  h-93 w-96">
                    {ganttData?.length > 0 ? (
                      <div id="GanttChartDIV"></div>
                    ) : (
                      <h1 className=" absolute  top-1/2 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300 text-orange-400 ">
                        There is no data avalible to load the ganttview
                      </h1>
                    )}
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
