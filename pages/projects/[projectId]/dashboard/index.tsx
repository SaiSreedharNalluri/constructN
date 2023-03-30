import React, { useEffect, useState } from 'react';
import Header from '../../../../components/divami_components/header/Header';
import { useRouter } from 'next/router';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SidePanelMenu from '../../../../components/divami_components/side-panel/SidePanel';
import { getdashBoardUrls } from '../../../../services/s3Service';
const Index: React.FC = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [loadData, setLoadData] = useState(false);
  const [urlObj, setUrlObj] = useState<{
    dashboard_url: string;
    report_url: string;
  }>();
  useEffect(() => {
    if (router.isReady) {
      getdashBoardUrls(router.query.projectId as string)
        .then((response) => {
          setUrlObj(response);
        })
        .catch((error) => {
          setLoadData(true);
        });
    }
  }, [router.isReady, router.query.projectId]);

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
                    <Tab>Dash Board</Tab>
                    <Tab>Reports</Tab>
                  </TabList>
                  <TabPanel>
                    {!loadData ? (
                      <div>
                        {urlObj?.dashboard_url.split('.').pop() === 'apdf' ? (
                          <div className=" absolute  top-1/2 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300  ">
                            <h1>
                              Click the below button to download your report in
                              pdf format
                            </h1>
                            <button
                              onClick={() => {
                                window.open(urlObj.dashboard_url);
                              }}
                              className="p-2 bg-orange-500 hover:bg-orange-400  rounded-md text-white "
                            >
                              Download
                            </button>
                          </div>
                        ) : (
                          <iframe
                            className="w-95 h-80"
                            src={urlObj?.dashboard_url}
                          />
                        )}
                      </div>
                    ) : (
                      <h1 className=" absolute  top-1/2 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300 text-orange-400 ">
                        There is no data avalible to load the dashboard
                      </h1>
                    )}
                  </TabPanel>
                  <TabPanel>
                    {!loadData ? (
                      <div>
                        {urlObj?.report_url.split('.').pop() === 'pdf' ? (
                          <div className=" absolute  top-1/2 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300  ">
                            <h1>
                              Click the below button to download your report in
                              pdf format
                            </h1>
                            <button
                              onClick={() => {
                                window.open(urlObj.report_url);
                              }}
                              className="p-2 bg-orange-500 hover:bg-orange-400  rounded-md text-white "
                            >
                              Download
                            </button>
                          </div>
                        ) : (
                          <iframe
                            className="w-95 h-93"
                            src={urlObj?.report_url}
                          />
                        )}
                      </div>
                    ) : (
                      <h1 className=" absolute  top-1/2 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300 text-orange-400 ">
                        There is no data avalible to load the report
                      </h1>
                    )}
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
