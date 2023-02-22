import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../../components/container/header';
import { ChildrenEntity, IStructure } from '../../../../models/IStructure';
import CollapsableMenu from '../../../../components/layout/collapsableMenu';
import { getProjectDetails } from '../../../../services/project';
import { ISnapshot } from '../../../../models/ISnapshot';
import _ from 'lodash';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LeftOverLay from '../../../../components/container/leftOverLay';
import MapLoading from '../../../../components/container/mapLoading';
import authHeader from '../../../../services/auth-header';
import GenericViewer from '../../../../components/container/GenericViewer';
import RightFloatingMenu from '../../../../components/container/rightFloatingMenu/rightFloatingMenu';
import { IToolResponse, ITools } from '../../../../models/ITools';
import { getStructureList } from '../../../../services/structure';
import { IActiveRealityMap } from '../../../../models/IReality';
import { IDesignMap } from '../../../../models/IDesign';
import {
  deleteIssue,
  editIssue,
  getIssuesList,
  getIssuesPriority,
  getIssuesStatus,
  getIssuesTypes,
} from '../../../../services/issue';
import { getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import { getTasksList } from '../../../../services/task';
import { Issue } from '../../../../models/Issue';
import { ITasks } from '../../../../models/Itask';
import IssueCreate from '../../../../components/container/rightFloatingMenu/issueMenu/issueCreate';
import TaskCreate from '../../../../components/container/rightFloatingMenu/taskMenu/taskCreate';
import IssueList from '../../../../components/container/rightFloatingMenu/issueMenu/issueList';
import { it } from 'node:test';
import Moment from 'moment';
import { deleteAttachment } from '../../../../services/attachments';
import { log } from 'node:console';
import html2canvas from 'html2canvas';
import ProjectInfo from '../../../../components/container/projectInfo';
import { IProjects } from '../../../../models/IProjects';

interface IProps {}
const Index: React.FC<IProps> = () => {
  const router = useRouter();
  const [currentViewMode, setViewMode] = useState('Design'); //Design/ Reality
  const [currentProjectId, setActiveProjectId] = useState('');
  const [structuresList, setStructuresList] = useState<IStructure[]>([]);
  const [project,setProject]= useState<IProjects>();
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
  const [issuePriorityList, setIssuePriorityList] = useState<[string]>(['']);
  const [issueStatusList, setIssueStatusList] = useState<[string]>(['']);
  const [issueFilterList, setIssueFilterList] = useState<Issue[]>([]);
  const [taskFilterList, setTaskFilterList] = useState<ITasks[]>([]);
  const [openCreateIssue, setOpenCreateIssue] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openIssueView, setOpenIssueView] = useState(false);
  const [currentContext, setCurrentContext] = useState<IToolResponse>({
    type: 'Task',
  });

  const closeIssueCreate = () => {
    setOpenCreateIssue(false);
  };
  const issueSubmit = (formdata: Issue) => {
    issuesList.push(formdata);
    setIssueList(structuredClone(issuesList));
    // let myTool : ITools ={toolName:'issue',toolAction:'issueCreated'};
    // toolClicked(myTool);
    setOpenCreateIssue(false);
  };

  const closeTaskCreate = () => {
    setOpenCreateTask(false);
  };
  const closeIssueList = () => {
    setOpenIssueView(false);
  };

  const taskSubmit = (formdata: any) => {
    tasksList.push(formdata);
    let myTool: ITools = { toolName: 'task', toolAction: 'taskCreated' };
    toolClicked(myTool);
    setOpenCreateTask(false);
  };

  useEffect(() => {
    if (router.isReady) {
      getIssuesPriority(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setIssuePriorityList(response.result);
          }
        })
        .catch((error) => {
          toast.error('failed to load data');
        });
      getIssuesStatus(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setIssueStatusList(response.result);
          }
        })
        .catch((error) => {
          toast.error('failed to load data');
        });
      getProjectDetails(router.query.projectId as string)
        .then((response) => {
          setProjectUtm(response?.data?.result?.utm);
          setActiveProjectId(router.query.projectId as string);
          setProject(response.data.result);
        })
        .catch((error) => {
          toast.error('failed to load data');
        });
      getStructureList(router.query.projectId as string)
        .then((response) => {
          setStructuresList(response.data.result);

          if (response.data.result.length > 0) {
            if (router.query.structId !== undefined) {
              let structs: IStructure[] = response.data.result;
              setStructure(
                structs.find((e) => {
                  console.log('finding structure: ', e._id);
                  if (e._id === router.query.structId) {
                    return e;
                  }
                })
              );
            } else setStructure(response.data.result[0]);
          }
        })
        .catch((error) => {
          toast.error('failed to load data');
        });
      const userObj: any = getCookie('user');
      let user = null;
      if (userObj) user = JSON.parse(userObj);
      if (user?._id) {
        SetLoggedInUserId(user._id);
      }
      const handler = document.addEventListener('click', closeStructurePage);
      return () => {
        document.removeEventListener('click', closeStructurePage);
      };
    }
  }, [router.isReady, router.query.projectId]);

  const getStructureData = (structure: ChildrenEntity) => {
    setStructure(getCurrentStructureFromStructureList(structure));
    getIssues(structure._id);
    getTasks(structure._id);
  };

  const getCurrentStructureFromStructureList = (structure: ChildrenEntity) => {
    //console.log('Loaded structures: ', structuresList);
    let currentStructure = structuresList.find((e) => {
      //console.log('finding structure: ', e._id);
      if (e._id === structure._id) {
        return e;
      }
    });
    console.log('Selected structure: ', currentStructure?.name);
    return currentStructure;
  };

  const updateRealityMap = (realityMap: IActiveRealityMap) => {
    setActiveRealityMap(realityMap);
    if (currentViewLayers.length > 0) {
      currentViewLayers.length = 0;
    }
    Object.keys(realityMap).map((key) => {
      currentViewLayers.push(key);
    });
    console.log('change triggered', realityMap);
  };

  const updatedSnapshot = (snapshot: ISnapshot) => {
    setSnapshot(snapshot);
  };

  const updateDesignMap = (designMap: IDesignMap) => {
    setDesignMap(designMap);
    console.log('change triggered', designMap);
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
              tasksList={tasksList}
              issuesList={issuesList}
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
  const closeStructurePage = (e: any) => {
    if (
      rightrefContainer.current &&
      !rightrefContainer.current.contains(e.target) &&
      leftOverlayRef.current &&
      !leftOverlayRef.current.contains(e.target) &&
      leftRefContainer.current &&
      !leftRefContainer.current.contains(e.target)
    ) {
      setLeftNav(false);
    }
  };

  const rightNavCollapse = () => {
    setRightNav(!rightNav);
  };

  const onChangeData = () => {
    if (leftNav) {
      setLeftNav(false);
    } else {
      setLeftNav(true);
    }
  };

  const toolClicked = (toolInstance: ITools) => {
    let newLayers = structuredClone(currentViewLayers);
    switch (toolInstance.toolName) {
      case 'viewType':
        setViewType(toolInstance.toolAction);
        //setClickedTool(toolInstance);
        break;
      case 'viewMode':
        setViewMode(toolInstance.toolAction);
        break;
      case 'issue':
        switch (toolInstance.toolAction) {
          case 'issueView':
            //console.log('trying to open issue View');
            setOpenIssueView(true);
            break;
          case 'issueCreate':
          //setOpenCreateIssue(true);
          case 'issueCreateSuccess':
          case 'issueCreateFail':
          case 'issueSelect':
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
          case 'taskCreateSuccess':
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
      case 'compareReality':
      case 'compareDesign':
        setClickedTool(toolInstance);
        //console.log(toolInstance);
        break;
      default:
        break;
    }
  };

  const toolResponse = (data: ITools) => {
    console.log('Got tool REsponse->', data);
    switch (data.toolName) {
      case 'viewMode':
        setViewMode(data.toolAction);
        break;
      case 'viewType':
        setViewType(data.toolAction);
      case 'Issue':
        if (data.toolAction === 'createIssue') {
          console.log('Open issue Menu');
          
        //   html2canvas(document.getElementById('TheView')||document.body).then(function(canvas) {
        //     //window.open('','_blank')?.document.body.appendChild(canvas);
        //     //canvas.toDataURL('image/png');
            
        // });
          if (data.response != undefined) setCurrentContext(data.response);
          setOpenCreateIssue(true);
        } else if (data.toolAction === 'selectIssue') {
          console.log('issue selected: ', data.response?.id);
          // issue detail view open logic comes here
        }
        break;
      case 'Task':
        if (data.toolAction === 'createTask') {
          console.log('Open task Menu');
          if (data.response != undefined) setCurrentContext(data.response);
          setOpenCreateTask(true);
        } else if (data.toolAction === 'selectTask') {
          console.log('task selected: ', data.response?.id);
          // task detail view open logic comes here
        }
        break;
      default:
        break;
    }
  };
  const getIssues = (structureId: string) => {
    getIssuesList(router.query.projectId as string, structureId)
      .then((response) => {
        setIssueList(response.result);
        setIssueFilterList(response.result);
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const getIssuesPriorityList = (projId: string) => {
    return getIssuesPriority(router.query.projectId as string)
      .then((response) => {
        return response.result;
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
        setTasksList(response.result);
        setTaskFilterList(response.result);
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const handleOnIssueSort = (sortMethod: string) => {
    switch (sortMethod) {
      case 'Last Updated':
        setIssueFilterList(issuesList);
        setIssueFilterList(
          issueFilterList.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) {
              return 1;
            } else if (b.updatedAt > a.updatedAt) {
              return -1;
            }
            return 0;
          })
        );
        setIssueList(issueFilterList);
        break;
      case 'First Updated':
        setIssueFilterList(issuesList);
        setIssueFilterList(
          issueFilterList.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) {
              return -1;
            } else if (b.updatedAt > a.updatedAt) {
              return 1;
            }
            return 0;
          })
        );
        setIssueList(issueFilterList);
        break;
      case 'Asc DueDate':
        setIssueFilterList(issuesList);
        setIssueFilterList(
          issueFilterList.sort((a, b) => {
            if (a.dueDate > b.dueDate) {
              return 1;
            } else if (b.dueDate > a.dueDate) {
              return -1;
            }
            return 0;
          })
        );
        setIssueList(issueFilterList);
        break;
      case 'Dsc DueDate':
        setIssueFilterList(issuesList);
        setIssueFilterList(
          issueFilterList.sort((a, b) => {
            if (a.dueDate > b.dueDate) {
              return -1;
            } else if (b.dueDate > a.dueDate) {
              return 1;
            }
            return 0;
          })
        );
        setIssueList(issueFilterList);
        break;
      case 'Asc Priority':
        setIssueFilterList(issuesList);
        setIssueFilterList(
          issueFilterList.sort((a, b) => {
            if (
              issuePriorityList?.indexOf(a.priority) >
              issuePriorityList?.indexOf(b.priority)
            ) {
              return 1;
            } else if (
              issuePriorityList?.indexOf(b.priority) >
              issuePriorityList?.indexOf(a.priority)
            ) {
              return -1;
            }
            return 0;
          })
        );
        setIssueList(issueFilterList);
        break;
      case 'Dsc Priority':
        setIssueFilterList(issuesList);
        setIssueFilterList(
          issueFilterList.sort((a, b) => {
            if (
              issuePriorityList?.indexOf(a.priority) >
              issuePriorityList?.indexOf(b.priority)
            ) {
              return -1;
            } else if (
              issuePriorityList?.indexOf(b.priority) >
              issuePriorityList?.indexOf(a.priority)
            ) {
              return 1;
            }
            return 0;
          })
        );
        setIssueList(issueFilterList);
        break;
      default:
        console.log('Not Sorted');
        break;
    }
  };
  const handleOnIssueFilter = (formData: any) => {
    const result = issueFilterList.filter(
      (item: Issue) =>
        (formData.issueTypeData.includes(item.type) ||
          formData.issueTypeData.length == 0) &&
        (formData?.issuePriorityData?.includes(item.priority) ||
          formData?.issuePriorityData?.length == 0) &&
        (formData?.issueStatusData?.includes(item.status) ||
          formData?.issueStatusData.length == 0) &&
        (formData?.assigneesData?.some((ass: any) =>
          item.assignees.some((it: any) => ass.value === it._id)
        ) ||
          formData?.assigneesData?.length == 0) &&
        (Moment(item.dueDate).format('YYYY-MM-DD') >= formData.fromDate ||
          formData.fromDate == '') &&
        (Moment(item.dueDate).format('YYYY-MM-DD') <= formData.toDate ||
          formData.toDate == '')
    );
    setIssueList(result);
  };
  const closeFilterOverlay = () => {
    setIssueList(issueFilterList);
  };
  const handleOnTaskFilter = (formData: any) => {
    const result = taskFilterList.filter(
      (item: ITasks) =>
        formData.taskType.includes(item.type) &&
        formData?.taskPriority?.includes(item.priority) &&
        formData?.taskStatus?.includes(item.status) &&
        item.assignees.filter(
          (userInfo: any) => userInfo._id === formData.assignees
        )
    );
    setTasksList(result);
  };
  const closeTaskFilterOverlay = () => {
    setTasksList(taskFilterList);
  };
  const deleteTheIssue = (issueObj: any) => {
    deleteIssue(router.query.projectId as string, issueObj._id)
      .then((response) => {
        if (response.success === true) {
          toast.success(response.message);
          _.remove(issueFilterList, { _id: issueObj._id });
          setIssueList(issueFilterList);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const clickIssueEditSubmit = (editObj: any, issueObj: any) => {
    editIssue(
      router.query.projectId as string,
      editObj,
      issueObj?._id as string
    )
      .then((response) => {
        if (response.success === true) {
          toast.success('issue information updated successfully');
          const index = issueFilterList.findIndex(
            (obj: Issue) => obj._id === response.result._id
          );
          issueFilterList.splice(index, 1, response.result);
          setIssueList(issueFilterList);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const responseAttachmentData = (data: any) => {
    issueFilterList.map((issueObj) => {
      if (issueObj._id === data[0]?.entity) {
        data.map((dataObj: any) => {
          issueObj.attachments.push(dataObj);
        });
      }
    });
    setIssueList(issueFilterList);
  };
  const deleteTheAttachment = (attachmentId: string) => {
    deleteAttachment(attachmentId)
      .then((response) => {
        if (response.success === true) {
          toast.success(response.message);
          issueFilterList.map((issueObj) => {
            const index = issueObj.attachments.findIndex(
              (obj) => obj._id === attachmentId
            );
            issueObj.attachments.splice(index, 1);
          });
          setIssueList(issueFilterList);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const getBreadCrumbs =()=>{
    //let structTemp :IStructure = structure;
    // let outputSting : string = structure?.name || '';
     if(structure===undefined)
     {
      return('');
     }
    return (' | '+project?.name+' / '+structure?.name);
  }
  return (
    <div className=" w-full  h-full">
      <div className="w-full">
        <Header breadCrumb={getBreadCrumbs()}></Header>
      </div>
      <div className="flex ">
        <div ref={leftOverlayRef}>
          <CollapsableMenu onChangeData={onChangeData}></CollapsableMenu>
        </div>
        <div>
          {
            <div
              ref={leftRefContainer}
              className={` ${
                leftNav ? 'visible' : 'hidden'
              } calc-h absolute z-10 top-10 bg-gray-200 border border-gray-300 overflow-y-auto`}
            >
              <div>
                <LeftOverLay
                  getStructureData={getStructureData}
                  getStructure={(structureData) => {
                    if (structure === undefined) {
                      setStructure(
                        getCurrentStructureFromStructureList(structureData)
                      );
                      // setStructure(structureData);
                      getIssues(structureData._id);
                      getTasks(structureData._id);
                    }
                  }}
                ></LeftOverLay>
              </div>
            </div>
          }
        </div>
        <div id="viewer">{renderSwitch(viewerTypeState)}</div>
        {/* <div>
            <FontAwesomeIcon
              className={`absolute  ${
                rightNav && 'rotate-180'
              } text-2xl text-blue-300  ${
                rightNav ? 'right-9' : 'right-0'
              }  top-1/2 cursor-pointer border-none rounded z-10 p-1 bg-gray-400 text-white`}
              onClick={rightNavCollapse}
              icon={faGreaterThan}
            ></FontAwesomeIcon>
          </div> */}

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
        {structure && snapshot && designMap && activeRealityMap && (
          <div ref={rightrefContainer}>
            <FontAwesomeIcon
              className={`fixed  ${
                rightNav && 'rotate-180'
              } text-lg text-blue-300  ${
                rightNav ? 'right-9' : 'right-0'
              }  top-46  cursor-pointer border rounded  p-1 bg-gray-400 z-10 text-white`}
              onClick={rightNavCollapse}
              icon={faLessThan}
            ></FontAwesomeIcon>
            <div
              ref={rightOverlayRef}
              id="bg-color"
              className={`fixed  w-9 border border-gray-300   ${
                rightNav ? 'visible' : 'hidden'
              }  bg-gray-200 top-40  rounded  right-0  duration-300 z-10 overflow-y-hidden`}
            >
              <RightFloatingMenu
                issuesList={issuesList}
                tasksList={tasksList}
                toolClicked={toolClicked}
                viewMode={currentViewMode}
                handleOnFilter={handleOnIssueFilter}
                currentProject={currentProjectId}
                currentStructure={structure}
                currentSnapshot={snapshot}
                currentTypesList={designMap}
                currentLayersList={activeRealityMap}
                currentViewType ={currentViewType}
                closeFilterOverlay={closeFilterOverlay}
                closeTaskFilterOverlay={closeTaskFilterOverlay}
                handleOnTaskFilter={handleOnTaskFilter}
              ></RightFloatingMenu>
              <IssueCreate
                issueToolClicked={toolClicked}
                handleIssueSubmit={issueSubmit}
                visibility={openCreateIssue}
                closeOverlay={closeIssueCreate}
                currentProject={currentProjectId}
                currentStructure={structure}
                currentSnapshot={snapshot}
                contextInfo={currentContext}
              ></IssueCreate>

              <TaskCreate
                handleTaskSubmit={taskSubmit}
                visibility={openCreateTask}
                closeOverlay={closeTaskCreate}
                currentProject={currentProjectId}
                currentStructure={structure}
                currentSnapshot={snapshot}
                contextInfo={currentContext}
              ></TaskCreate>
              <IssueList
                closeFilterOverlay={closeFilterOverlay}
                issueToolClicked={toolClicked}
                issuesList={issuesList}
                visibility={openIssueView}
                closeOverlay={closeIssueList}
                handleOnFilter={handleOnIssueFilter}
                handleOnSort={handleOnIssueSort}
                deleteTheIssue={deleteTheIssue}
                clickIssueEditSubmit={clickIssueEditSubmit}
                responseAttachmentData={responseAttachmentData}
                deleteTheAttachment={deleteTheAttachment}
              ></IssueList>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Index;
