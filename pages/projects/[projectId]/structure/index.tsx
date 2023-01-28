import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';
import { ChildrenEntity, IStructure } from '../../../../models/IStructure';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import { getSnapshotsList } from '../../../../services/snapshot';
import { getProjectDetails } from '../../../../services/project';
import { ISnapshot } from '../../../../models/ISnapshot';
import _ from 'lodash';
import Pagination from '../../../../components/container/pagination';
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LeftOverLay from '../../../../components/container/leftOverLay';
import MapLoading from '../../../../components/container/mapLoading';
import authHeader from '../../../../services/auth-header';
import GenericViewer from '../../../../components/container/GenericViewer';
import RightFloatingMenu from '../../../../components/container/rightFloatingMenu/rightFloatingMenu';
import { ITools } from '../../../../models/ITools';
import { getStructureList } from '../../../../services/structure';
import { IActiveRealityMap } from '../../../../models/IReality';
import { IDesignMap } from '../../../../models/IDesign';
import { createIssue, getIssuesList } from '../../../../services/issue';
import { getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import { createTask, getTasksList } from '../../../../services/task';
import { Issue } from '../../../../models/Issue';
import { ITasks } from '../../../../models/Itask';

interface IProps {}
const Index: React.FC<IProps> = () => {
  const router = useRouter();
  const [currentViewMode, setViewMode] = useState('Design'); //Design/ Reality
  const [currentProjectId, setActiveProjectId] = useState('');
  const [structuresList, setStructuresList] = useState<IStructure[]>([]);
  const [structure, setStructure] = useState<IStructure>();
  const [snapshot, setSnapshot] = useState<ISnapshot>();
  const [designMap, setDesignMap] = useState<IDesignMap>();
  const [activeRealityMap, setActiveRealityMap] = useState<IActiveRealityMap>();
  const [projectutm, setProjectUtm] = useState('');
  const leftOverlayRef: any = useRef();
  const [leftNav, setLeftNav] = useState(false);
  const rightOverlayRef: any = useRef();
  const leftRefContainer: any = useRef();
  const rightrefContainer: any = useRef();
  const [viewerTypeState, setViewerType] = useState('forge');
  const [rightNav, setRightNav] = useState(false);
  const [currentViewType, setViewType] = useState(''); //plan,elevational,xsectional,bim
  const [currentViewLayers, setViewLayers] = useState<string[]>([]); //360Image, 360Video, phoneImage, droneImage
  const [clickedTool, setClickedTool] = useState<ITools>();
  const [loggedInUserId, SetLoggedInUserId] = useState('');
  const [issuesList, setIssueList] = useState<Issue[]>([]);
  const [tasksList, setTasksList] = useState<ITasks[]>([]);
  useEffect(() => {
    if (router.isReady) {
      getProjectDetails(router.query.projectId as string)
        .then((response) => {
          setProjectUtm(response?.data?.result?.utm);
          setActiveProjectId(router.query.projectId as string);
        })
        .catch((error) => {
          toast.error('failed to load data');
        });
      getStructureList(router.query.projectId as string)
        .then((response) => {
          setStructuresList(response.data.result);
        })
        .catch((error) => {
          toast.error('failed to load data');
        });
    }
    const userObj: any = getCookie('user');
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?._id) {
      SetLoggedInUserId(user._id);
    }
  }, [router.isReady, router.query.projectId]);

  const getStructureData = (structure: ChildrenEntity) => {
    setStructure(getCurrentStructureFromStructureList(structure));
    getIssues(structure._id);
    getTasks(structure._id);
  };

  const getCurrentStructureFromStructureList = (structure: ChildrenEntity) => {
    let currentStructure = structuresList.find((e) => {
      if (e._id === structure._id) {
        return e;
      }
    });
    console.log('Selected structure: ', currentStructure?.name);
    return currentStructure;
  };

  const updateRealityMap = (realityMap: IActiveRealityMap) => {
    setActiveRealityMap(realityMap);
  };

  const updatedSnapshot = (snapshot: ISnapshot) => {
    setSnapshot(snapshot);
  };

  const updateDesignMap = (designMap: IDesignMap) => {
    setDesignMap(designMap);
  };

  const activeClass = (e: any) => {
    setViewerType(e.currentTarget.id);
  };
  const renderSwitch = (param: string) => {
    switch (param) {
      case 'potree':
        return <MapLoading></MapLoading>;

      case 'forge':
        return (
          structure && (
            <GenericViewer
              toolRes={toolResponse}
              tools={clickedTool}
              structure={structure}
              updateSnapshot={updatedSnapshot}
              updateRealityMap={updateRealityMap}
              updateDesignMap={updateDesignMap}
              viewMode={currentViewMode}
              viewType={currentViewType}
              viewLayers={currentViewLayers}
            ></GenericViewer>
          )
        );
      case 'map':
        return (
          snapshot &&
          structure && (
            <div className="overflow-x-hidden overflow-y-hidden">
              <iframe
                className="overflow-x-hidden h-96 w-screen"
                src={`https://dev.internal.constructn.ai/2d?structure=${
                  structure?._id
                }&snapshot1=${snapshot?._id}&zone_utm=${projectutm}&project=${
                  currentProjectId as string
                }&token=${authHeader.getAuthToken()}`}
              />
            </div>
          )
        );

      default:
        break;
    }
  };
  const rightNavCollapse = () => {
    setRightNav(!rightNav);
  };
  useEffect(() => {
    if (leftNav) {
      leftOverlayRef.current.style.width = '18vw';
    } else {
      leftOverlayRef.current.style.width = '0%';
    }
  }, [leftNav]);
  const onChangeData = () => {
    if (leftNav) {
      setLeftNav(false);
    } else {
      setLeftNav(true);
    }
  };

  const toolClicked = (toolInstance: ITools) => {
    let newLayers = currentViewLayers;

    switch (toolInstance.toolName) {
      case 'viewType':
        setViewType(toolInstance.toolAction);
        break;
      case 'viewMode':
        setViewMode(toolInstance.toolAction);
        break;
      case 'issue':
        switch (toolInstance.toolAction) {
          case 'issueView':
            //todo
            break;
          case 'issueCreate':
          case 'issueShow':
          case 'issueHide':
            setClickedTool(toolInstance);
            break;
        }

        break;
      case 'progress':
        switch (toolInstance.toolAction) {
          case 'progressView':
            //todo
            break;
          case 'progressCreate':
          case 'progressShow':
          case 'progressHide':
            setClickedTool(toolInstance);
            break;
        }
        break;
      case 'task':
        switch (toolInstance.toolAction) {
          case 'taskView':
            //todo
            break;
          case 'taskCreate':
          case 'taskShow':
          case 'taskHide':
            setClickedTool(toolInstance);
            break;
        }

        break;
      case 'addViewLayer':
        newLayers.push(toolInstance.toolAction);
        setViewLayers(newLayers);
        console.log(currentViewLayers);
        break;
      case 'removeViewLayer':
        newLayers.splice(newLayers.indexOf(toolInstance.toolAction), 1);
        setViewLayers(newLayers);
        console.log(currentViewLayers);
        break;
      default:
        break;
    }
  };

  const toolResponse = (data: string) => {
    console.log('Data->', data);
  };
  const handleIssueSubmit = (formData: any) => {
    formData.structure = structure?._id;
    formData.title = `${structure?.name}_${formData.date} `;
    formData.snapshot = snapshot?._id;
    formData.owner = loggedInUserId;
    formData.status = 'To Do';
    createIssue(router.query.projectId as string, formData)
      .then((response) => {
        if (response.success === true) {
          toast.success('Issue is added sucessfully');
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const handleTaskSubmit = (formData: any) => {
    formData.structure = structure?._id;
    formData.title = `${structure?.name}_${formData.date} `;
    formData.snapshot = snapshot?._id;
    formData.owner = loggedInUserId;
    formData.status = 'To Do';
    createTask(router.query.projectId as string, formData)
      .then((response) => {
        if (response.success === true) {
          toast.success('Task is added sucessfully');
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const getIssues = (structureId: string) => {
    getIssuesList(router.query.projectId as string, structureId)
      .then((response) => {
        setTasksList(response.result);
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const getTasks = (structureId: string) => {
    getTasksList(router.query.projectId as string, structureId)
      .then((response) => {
        setIssueList(response.result);
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  return (
    <React.Fragment>
      <div className="">
        <Header />
        <div className="fixed" ref={leftRefContainer}>
          <div className="flex">
            <div className="flex">
              <CollapsableMenu onChangeData={onChangeData} />
            </div>
            <div className="flex w-screen  " id="viewer">
              {renderSwitch(viewerTypeState)}
            </div>
          </div>
          <div
            ref={leftOverlayRef}
            className={`h-screen bg-gray-200 w-0 absolute z-10  ${
              leftNav ? 'left-10' : 'left-10  '
            }   top-0  duration-300 overflow-x-hidden`}
          >
            <LeftOverLay
              getStructureData={getStructureData}
              getStructure={(structureData) => {
                if (structure === undefined) {
                  setStructure(
                    getCurrentStructureFromStructureList(structureData)
                  );
                  getIssues(structureData._id);
                  getTasks(structureData._id);
                }
              }}
            ></LeftOverLay>
          </div>
          <div>
            <FontAwesomeIcon
              className={`absolute  ${
                rightNav && 'rotate-180'
              } text-2xl text-blue-300  ${
                rightNav ? 'right-9' : 'right-0'
              }  top-1/2 cursor-pointer border-none rounded  p-1 bg-gray-400 text-white`}
              onClick={rightNavCollapse}
              icon={faGreaterThan}
            ></FontAwesomeIcon>
          </div>
        </div>
        {/* <div ref={bottomRefContainer}>
          {viewerTypeState != 'map' ? (
            <p
              className={`left-48  bg-gray-300 rounded absolute duration-300 cursor-pointer ${
                bottomNav ? 'bottom-11' : 'bottom-2'
              } `}
              onClick={bottomOverLay}
            >
              10-01-2022
            </p>
          ) : (
            ''
          )}
          <div
            ref={BottomOverlayRef}
            className="w-0  absolute left-1/2 bottom-1  overflow-x-hidden z-10"
          >
            <div className="flex ">
              <div className=" bg-gray-200 rounded">
                <Pagination
                  snapshots={snapshots}
                  getSnapshotInfo={getSnapshotInfo}
                />
              </div>
             </div>
          </div>
        </div> */}

        <div ref={rightrefContainer} className="relative  ">
          <FontAwesomeIcon
            className={`fixed  ${
              rightNav && 'rotate-180'
            } text-2xl text-blue-300  ${
              rightNav ? 'right-34' : 'right-0'
            }  top-46  cursor-pointer border-none rounded  p-1 bg-gray-400 text-white`}
            onClick={rightNavCollapse}
            icon={faGreaterThan}
          ></FontAwesomeIcon>
          <div
            ref={rightOverlayRef}
            id="bg-color"
            className={`fixed  lg:w-3 2xl:w-1   ${
              rightNav ? 'visible' : 'hidden'
            }  bg-gray-200 top-40   rounded  lg:right-0  duration-300 overflow-x-hidden`}
          >
            <RightFloatingMenu
              issuesList={issuesList}
              tasksList={tasksList}
              handleIssueSubmit={handleIssueSubmit}
              handleTaskSubmit={handleTaskSubmit}
              toolClicked={toolClicked}
              viewMode={currentViewMode}
            ></RightFloatingMenu>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Index;
