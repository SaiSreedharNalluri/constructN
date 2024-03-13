import { styled } from "@mui/system";
import { AxiosResponse } from "axios";
import { getCookie } from "cookies-next";
import _ from "lodash";
import Moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState, Suspense, memo} from "react";
import { CustomToast } from "../../../../../components/divami_components/custom-toaster/CustomToast"
import GenericViewer from "../../../../../components/container/GenericViewer";
import LeftOverLay from "../../../../../components/container/leftOverLay";
import MapLoading from "../../../../../components/container/mapLoading";
import Header from "../../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../../components/divami_components/side-panel/SidePanel";
import ToolBarMenuWrapper from "../../../../../components/container/toolbarViewer/ToolBarMenuWrapper";
import { IDesignMap } from "../../../../../models/IDesign";
import { IProjects } from "../../../../../models/IProjects";
import { IActiveRealityMap } from "../../../../../models/IReality";
import { ISnapshot } from "../../../../../models/ISnapshot";
import { Issue } from "../../../../../models/Issue";
import { ChildrenEntity, IStructure } from "../../../../../models/IStructure";
import { ITasks } from "../../../../../models/Itask";
import { IContext, IToolResponse, IToolbarAction, ITools } from "../../../../../models/ITools";
import ChevronLeftIcon from "../../../../../public/divami_icons/chevronLeft.svg";
import ChevronRightIcon from "../../../../../public/divami_icons/chevronRight.svg";
import { deleteAttachment } from "../../../../../services/attachments";
import authHeader from "../../../../../services/auth-header";
import CollapsableMenu from "../../../../../components/layout/collapsableMenu";
import {
  getProjectDetails,
  getProjectUsers,
} from "../../../../../services/project";
import {
  getStructureHierarchy,
  getStructureList,
} from "../../../../../services/structure";
import {
  deleteIssue,
  editIssue,
  getIssueTags,
  getIssuesList,
  getIssuesPriority,
  getIssuesStatus,
  getIssuesTypes,
} from "../../../../../services/issue";
import {
  deleteTask,
  getTasksList,
  getTasksPriority,
  getTaskStatus,
  getTasksTypes,
  getTaskTags,
} from "../../../../../services/task";
import enterfullscreenIcon from "../../../../../public/divami_icons/enterfullscreen.svg";
import exitfullscreenIcon from "../../../../../public/divami_icons/exitfullscreen.svg";
import { IUser } from "../../../../../models/IUser";
import {
  useSearchParams,
} from 'react-router-dom';
import { setTheFormatedDate } from "../../../../../utils/ViewerDataUtils";
import { getSectionsList } from "../../../../../services/sections";
import CustomLoggerClass from "../../../../../components/divami_components/custom_logger/CustomLoggerClass";
import { getGenViewerData } from "../../../../../services/genviewer";
import { IGenData } from "../../../../../models/IGenData";
import { MqttConnector, OnMessageCallbak } from "../../../../../utils/MqttConnector";
import IssueList from "../../../../../components/container/rightFloatingMenu/issueMenu/issueList";
import { responsiveFontSizes } from "@mui/material";
import CustomLoader from "../../../../../components/divami_components/custom_loader/CustomLoader";
import {ApiDataContextProvider} from "../../../../../state/projectConfig/projectConfigContext";
import { useAppContext } from "../../../../../state/appState/context";
import { MULTIVERSE } from "../../../../../config/config";
interface IProps { }
const Iframe = memo(React.lazy(() => import('../../../../../components/container/Iframe2')));
const OpenMenuButton = styled("div")(({ onClick, isFullScreen }: any) => ({
  position: "fixed",
  border: "1px solid #C4C4C4",
  height: "32px",
  width: "107px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  alignItems: "center",
  transform: "rotate(270deg)",
  left: isFullScreen ? "-40px" : "22px",
  bottom: "38px",
  cursor: "pointer",
  background: "#ffffff",
  fontFamily: "Open Sans",
  "&:hover": {
    background: "#EEEEEE",
  },
})) as any;

const OpenFullScreenButton = styled("div")(
  ({ onClick, isFullScreen }: any) => ({
    position: "fixed",
    right: "6px",
    bottom: "6px",
    cursor: "pointer",
  })
);

const CloseMenuButton = styled("div")(({ isFullScreen }: any) => ({
  height: "38px",
  width: "31px",
  // border: "1px solid #BDBDBD",
  position: "fixed",
  bottom: "0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  zIndex: "99",
  backgroundColor: "#fffff !important",
  background: "rgb(255, 255, 255)",
  border: "1px solid rgb(189, 189, 189)",
  boxShadow: "rgb(200 200 200 / 10%) 5px 4px 8px",
  transform: "matrix(-1, 0, 0, 1, 0, 0)",
  marginLeft: isFullScreen ? 0 : "58px",
})) as any;

const SidePanelContainer = styled("div")(({ onClick, isFullScreen }: any) => ({
  position: "absolute",
  left: 0,
  zIndex: 1,
  background: "white",
}));

const LeftOverLayContainer = styled("div")(({ isFullScreen }: any) => ({
  marginLeft: "58px",
  zIndex: 0,
}));
export type toolBarHandle = {
  selectToolRef: (handleMenuInstance: any) => void;
  RouterIssueRef: (handleMenuInstance: any) => void;
  issueFilterState:(handleMenuInstance:any)=>void;
  taskFilterState:(taskFilterState:any)=>void;
  projectUsersAndStatus:(projectUsers:any,issueStatusList:any,tasksStatusList:any)=>void;
};
type multiverseViewerStatusTypes = "NotAvailable" | "Waiting" | "Connected";

const Index: React.FC<IProps> = () => {
  const customLogger = new CustomLoggerClass();
  const ref = React.useRef<toolBarHandle>(null);
  const router = useRouter();
  let [currentViewMode, setViewMode] = useState("Design"); //Design/ Reality
  const [currentProjectId, setActiveProjectId] = useState("");
  const [structuresList, setStructuresList] = useState<IStructure[]>([]);
  const [project, setProject] = useState<IProjects>();
  // const [projectUsers, setProjectUsers] = useState<IProjects>();
  const [showIssueMarkups, setShowIssueMarkups] = useState(true);
  const [showTaskMarkups, setShowTaskMarkups] = useState(true);
  const [isRealityAvailable, setRealityAvailable] = useState(false);
  const [isDesignAvailable, setDesignAvailable] = useState(false);

  const [structure, setStructure] = useState<IStructure>();
  const [snapshot, setSnapshot] = useState<ISnapshot>();
  const [designMap, setDesignMap] = useState<any>();
  const [cDesignMap, setcDesignMap] = useState<any>();
  const [activeRealityMap, setActiveRealityMap] = useState<IActiveRealityMap>();
  const [designAndRealityMaps, setDesignAndRealityMaps] = useState<any>({});
  const [projectutm, setProjectUtm] = useState("");
  const leftOverlayRef: any = useRef();
  const [leftNav, setLeftNav] = useState(false);
  const rightOverlayRef: any = useRef();
  const leftRefContainer: any = useRef();
  const rightrefContainer: any = useRef();
  const [viewerTypeState, setViewerType] = useState("forge");
  const [rightNav, setRightNav] = useState(false);
  const [viewTypes, setViewTypes] = useState<string[]>([]);
  const [currentViewType, setViewType] = useState(""); //plan,elevational,xsectional,bim
  const [currentViewLayers, setViewLayers] = useState<string[]>([]); //360Image, 360Video, phoneImage, droneImage
  const [clickedTool, setClickedTool] = useState<ITools>();
  const [toolUpdate, setToolUpdate] = useState<IToolbarAction>();
  const [loggedInUserId, SetLoggedInUserId] = useState("");
  const [isList, setIsList] = useState<any>([]);
  const [issuesList, setIssueList] = useState<Issue[]>([]);
  const [tasksList, setTasksList] = useState<ITasks[]>([]);
  const [tasList, setTasList] = useState<any>([]);
  const [screenshot, setScreenShot] = useState<any>();
  // const [issuePriorityList, setIssuePriorityList] = useState<[string]>([""]);
  const [tasksPriotityList, setTasksPriorityList] = useState<[string]>([""]);
  // const [issueStatusList, setIssueStatusList] = useState<[string]>([""]);
  const [tasksStatusList, setTasksStatusList] = useState<[string]>([""]);
  // const [issueTypesList, setIssueTypesList] = useState<[string]>([""]);
  const [layersUpdated, setLayersUpdated] = useState(false);

  const [issueFilterList, setIssueFilterList] = useState<Issue[]>([]);
  const [taskFilterList, setTaskFilterList] = useState<ITasks[]>([]);
  const [openCreateIssue, setOpenCreateIssue] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openIssueView, setOpenIssueView] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState("");
  const [selectedReality, setSelectedReality] = useState("");

  const [currentContext, setCurrentContext] = useState<IToolbarAction>();
  const [hierarchy, setHierarchy] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [openIssueDetails, setOpenIssueDetails] = useState(false);
  const [openTaskDetails, setOpenTaskDetails] = useState(false);
  const [breadCrumbsData, setBreadCrumbsData] = useState<any>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [issueLoader, setIssueLoader] = useState(false);
  const [highlightCreateIcon, setHighlightCreateIcon] = useState(false);
  const [highlightCreateTaskIcon, setHighlightCreateTaskIcon] = useState(false);

  const [conn, setConn] = useState<MqttConnector>(MqttConnector.getConnection());
  const [initData, setInintData] = useState<IGenData>();
  const [multiverseIsReady, setMultiverseIsReady] = useState(false);
  const [mViewerStatus, setMViewerStatus] = useState<multiverseViewerStatusTypes>("NotAvailable");

  let handleMenuInstance: IToolbarAction = { data: "", type: "selectIssue" };
  let isSupportUser = useRef(false);
 
  const [issueTypesList, setIssueTypesList] = useState<any>(null);
  const [issuePriorityList, setIssuePriorityList] = useState<any>(null);
  const [issueStatusList, setIssueStatusList] = useState<any>(null);
  const [projectUsers, setProjectUsers] = useState<any>(null);
  const [taskTypesList, setTaskTypesList] = useState<any>(null);
  const [taskPriorityList, setTaskPriorityList] = useState<any>(null);
  const [taskStatusList, setTaskStatusList] = useState<any>(null);
  const [issueTagStatus, setIssueTagStatus] = useState<string[]>([]);
  const [TaskTagStatus, setTaskTagStatus] = useState<[string]>();

  //const [searchParams,setSearchParams] = useSearchParams();
  // useEffect(() => {
  //   setBreadCrumbsData((prev: any) => prev.splice(0, 1, project));
  // }, [project]);

  const { state: appState, appContextAction } = useAppContext();
  const isObjectEmpty = (objectName: any) => {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  };
  const handleNodeSelection = (nodeIds: any) => {
    setSelected(nodeIds);
  };
  const handleNodeExpand = (data: any) => {
    setExpanded(data);
    window.localStorage.setItem("expandedNodes", JSON.stringify(data));
  };
  const [taskFilterState, setTaskFilterState] = useState({
    isFilterApplied: false,
    filterData: {},
    numberOfFilters: 0,
  });
  const [issueFilterState, setIssueFilterState] = useState({
    isFilterApplied: false,
    filterData: {},
    numberOfFilters: 0,
  });

  // const closeIssueCreate = () => {
  //   setOpenCreateIssue(false);
  //   setHighlightCreateIcon(false);
  //   conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"createFailIssue","data":" "}');

  // };
  // const issueSubmit = (formdata: Issue) => {
  //   issuesList.push(formdata);
  //   // if (structure) {
  //   //   getIssues(structure._id);
  //   // }

  //   setIssueList(structuredClone(issuesList));
  //   setIssueFilterList(structuredClone(issuesList));
  //   // let myTool : ITools ={toolName:'issue',toolAction:'issueCreated'};
  //   // toolClicked(myTool);
  //   closeIssueCreate();
  // };

  // const closeTaskCreate = () => {
  //   setOpenCreateTask(false);
  //   setHighlightCreateTaskIcon(false)
  // };
  // const closeIssueList = () => {
  //   setOpenIssueView(false);
  // };

  // const closeTaskDetails = () => {
  //   setOpenTaskDetails(false);

  //   //router.replace(`/projects/${router?.query?.projectId}/structure?structId=${router?.query?.structId}`)   

  // };
  // const closeIssueDetails = () => {
  //   setOpenIssueDetails(false);
  //   // delete router.query.iss
  //   //router.replace(`/projects/${router?.query?.projectId}/structure?structId=${router?.query?.structId}`)
  //   // router.push(router);
  // };

  // const taskSubmit = (formdata: any) => {
  //   tasksList.push(formdata);
  //   let myTool: ITools = { toolName: "task", toolAction: "taskCreated" };
  //   setTasksList(structuredClone(tasksList));
  //   setTaskFilterList(structuredClone(tasksList));
  //   // if (structure) {
  //   //   getTasks(structure._id);
  //   // }
  //   // toolClicked(myTool);
  //   closeTaskCreate();
  // };

  useEffect(() => {
    if (router.isReady && router.query?.projectId) {
      getIssuesPriority(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setIssuePriorityList(response.result);
          }
        })
        .catch((error: any) => {
          CustomToast("failed to load data", "error");
        });

      getTasksPriority(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setTaskPriorityList(response.result);
          }
        })
        .catch((error: any) => {
          CustomToast("failed to load data", "error");
        });

      getIssuesStatus(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setIssueStatusList(response.result);
          }
        })
        .catch((error: any) => {
          CustomToast("failed to load data", "error");
        });
      getTaskStatus(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setTaskStatusList(response.result);
          }
        })
        .catch((error: any) => {
          CustomToast("failed to load data", "error");
        });
      getIssuesTypes(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setIssueTypesList(response.result);
          }
        })
        .catch((error: any) => {
          CustomToast("failed to load data", "error");
        });

        getTasksTypes(router.query.projectId as string).then((response: any) => {
          if (response.success === true) {
            // response.result.push('Please select the task type');
            setTaskTypesList(response.result);
          }
        });
      getIssueTags(router.query.projectId as string).then((response) => {
          if (response.success === true) {
            let newArr = [...response.result[0].tagList]
            setIssueTagStatus(response.result);
           
          }
        });
        getTaskTags(router.query.projectId as string).then((response) => {
          if (response.success === true) {
            let newArr = [...response.result[0].tagList]
            setTaskTagStatus(response.result[0].tagList);
           
          }
        });
      getProjectDetails(router.query.projectId as string)
        .then((response: any) => {
          setProjectUtm(response?.data?.result?.utm);
          setActiveProjectId(router.query.projectId as string);
          setProject(response.data.result);
        })
        .catch((error: any) => {
          CustomToast("failed to load data", "error");
        });
      getStructureList(router.query.projectId as string)
        .then((response: any) => {
          const list = response.data.result;
          setStructuresList(list);
          let nodeData = localStorage.getItem("nodeData")
            ? JSON.parse(window.localStorage.getItem("nodeData") || "")
            : "";

          if (list.length > 0) {
            let structs: IStructure[] = list;

            if (router.query.structureId !== undefined) {
              setStructure(
                structs.find((e) => {
                  if (e._id === router.query.structureId) {
                    return e;
                  }
                })
              );

              // setDefaultBreadcrumb()
            } else if (nodeData.project === router.query.projectId) {
              const selNode = structs.find((e) => {
                if (e._id === nodeData?._id) {
                  return e;
                }
              });
              if (selNode) {
                setStructure(selNode);
                const nodes = getStructureIds(selNode, list);
                window.localStorage.setItem(
                  "expandedNodes",
                  JSON.stringify(nodes)
                );
                setExpanded(nodes);
              }
            } else {
              let index = response.data.result.findIndex(
                (structData: IStructure) => {
                  return (
                    structData.designs !== undefined &&
                    structData.designs.length > 0
                  );
                }
              );

              if (index > 0) {
                setStructure(response.data.result[index]);

                const nodes = getStructureIds(
                  response.data.result[index],
                  list
                );
                window.localStorage.setItem(
                  "expandedNodes",
                  JSON.stringify(nodes)
                );

                setExpanded(nodes);
              } else {
                setStructure(response.data.result[0]);
                const nodes = getStructureIds(response.data.result[0], list);
                window.localStorage.setItem(
                  "expandedNodes",
                  JSON.stringify(nodes)
                );

                setExpanded(nodes);
              }
            }
          }
        })
        .catch((error: any) => {
          CustomToast("failed to load data", "error");
        });

      getProjectUsers(router.query.projectId as string)
        .then((response: any) => {
          if (response.success === true) {
            setProjectUsers(response.result);           
          }
        })
        .catch();

      const userObj: any = getCookie("user");
      let user: IUser;
      if (userObj) {
        user = JSON.parse(userObj);
        if (user?._id) {
          isSupportUser.current = user?.isSupportUser;
          SetLoggedInUserId(user._id);
        }
      }
      if (router.query.type !== null) {
        switch (router.query.type) {
          case 'Plan Drawings':
          case 'BIM':
          case 'pointCloud':

          case 'orthoPhoto':
            setViewType(router.query.type as string);
        }

      }

      return () => {
        document.removeEventListener("click", closeStructurePage);
      };
    }
  }, [router.isReady, router.query.projectId]);

  const getNodeDataById = (id: string, list?: any) => {
    if (list?.length) {
      return list.find((e: any) => {
        if (e._id === id) {
          return e;
        }
      });
    } else {
      return structuresList.find((e) => {
        if (e._id === id) {
          return e;
        }
      });
    }
  };

  const getStructureIds = (structure: any, list: any) => {
    const dataB: any[] = [];
    const getBreadCrumbs = (NodeData: any) => {
      dataB.unshift(NodeData?._id);

      const struct = NodeData.parent
        ? getNodeDataById(NodeData.parent, list)
        : null;
      if (struct) {
        getBreadCrumbs(struct);
      }
    };
    getBreadCrumbs(structure);
    return dataB;
  };

  const getBreadCrumbsData = (structure: any) => {
    const dataB: any[] = [];
    const getBreadCrumbs = (NodeData: any) => {
      dataB.unshift(NodeData);
      const struct = NodeData.parent ? getNodeDataById(NodeData.parent) : null;
      if (struct) {
        getBreadCrumbs(struct);
      }
    };
    getBreadCrumbs(structure);
    return dataB;
  };

  const getStructureData = (structure: ChildrenEntity) => {
    setStructure(getCurrentStructureFromStructureList(structure));
    // getIssues(structure._id);
    // getTasks(structure._id);
  };
  useEffect(() => { 
    if (structure && project) {
      setBreadCrumbsData((prev: any) => [
        project,
        ...getBreadCrumbsData(structure),
      ]);
      // getIssues(structure._id);
      // getTasks(structure._id);
    } else if (project) {
      setBreadCrumbsData((prev: any) => prev.splice(0, 1, project));
    }
    if (router.isReady && structure) {
      //router.query.structId = structure?._id;
      router.query.structureId = structure?._id as string;

      router.push({pathname:router.pathname,query:{...router.query,structureId:structure._id as string}})
    }
  }, [structure, project]);

  const getCurrentStructureFromStructureList = (structure: ChildrenEntity) => {
    let currentStructure = structuresList.find((e) => {
      if (e._id === structure._id) {
        return e;
      }
    });
    return currentStructure;
  };

  // const updateRealityMap = (realityMap: IActiveRealityMap) => {
  //   setActiveRealityMap(realityMap);
  //   if (currentViewLayers.length > 0) {
  //     currentViewLayers.length = 0;
  //   }
  //   Object.keys(realityMap).map((key) => {
  //     currentViewLayers.push(key);
  //   });
  //   Object.values(realityMap).map((val: any) => {
  //     val.realities?.forEach((reality: any) => {
  //       reality.realityType?.forEach((rType: any) => {
  //         if (viewTypes.findIndex((typ) => typ === rType) == -1) {
  //           viewTypes.push(rType);
  //         }
  //       });
  //     });
  //   });
  //   setViewTypes(structuredClone(viewTypes));
  //   //console.log("MyViewTypeList-->r",viewTypes);
  // };
  useEffect(() => {
    if (router.query.iss !== null) {

      let sel_iss: Issue | undefined = issuesList.find((t) => t._id === router.query.iss)
      if (sel_iss) {
        // setClickedTool({ toolAction: 'issueSelect', toolName: 'issue', response: sel_iss });
        // setCurrentContext({ ...sel_iss?.context, id: router.query.iss as string });
        setOpenIssueDetails(true);
      }
    }
    else if (router.query.tsk !== null) {
      let sel_tsk: ITasks | undefined = tasksList.find((t) => t._id === router.query.tsk)
      if (sel_tsk) {
        // setClickedTool({ toolAction: 'taskSelect', toolName: 'task', response: sel_tsk });
        // setCurrentContext({ ...sel_tsk?.context, id: router.query.tsk as string });
        setOpenTaskDetails(true);
      }
    }


  }, [snapshot]);

  // const updateDesignMap = (designMap: IDesignMap) => {


  //   setDesignMap(designMap);
  //   setViewTypes([]);

  //   Object.keys(designMap).forEach((key) => {
  //     if (viewTypes.findIndex((k) => k === key) === -1) {
  //       setViewTypes((prevViewTypes) => [...prevViewTypes, key]);
  //     }
  //   });
  // };

  // const activeClass = (e: any) => {
  //   setViewerType(e.currentTarget.id);
  // };
  // const renderSwitch = (param: string) => {
  //   switch (param) {
  //     case "potree":
  //       return <MapLoading></MapLoading>;

  //     case "plan Drawings":
  //       // setGenData()
  //       break;
  //       return (
  //         structure && (
  //           ''
  //         )
  //       );
  //     case "BIM":
  //       // setGenData();
  //       break;
  //       return (
  //         snapshot &&
  //         structure && (
  //           <div className="overflow-x-hidden overflow-y-hidden">

  //           </div>
  //         )
  //       );

  //     default:
  //       break;
  //   }
  // };
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

  // const rightNavCollapse = () => {
  //   setRightNav(!rightNav);
  // };

  const onChangeData = () => {
    if (leftNav) {
      setLeftNav(false);
    } else {
      setLeftNav(true);
    }
  };

  const toolClicked = (toolInstance: IToolbarAction) => {
    const Win = (document.getElementById("IframeId") as HTMLIFrameElement)?.contentWindow;
    console.log("toolInstrance", toolInstance)
    // let newLayers = _.cloneDeep(currentViewLayers);
    switch (toolInstance.type) {
      case "setViewType":
        router.query.type = toolInstance.data as string;
        router.push(router);
        switch (toolInstance.data) {
          case "Plan Drawings":
            Win?.postMessage(`{"type": "setViewType", "data": "Plan Drawings"}`, 'http://localhost:3001');
            // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), `{"type": "setViewType", "data": "Plan Drawings"}`);
            break;
          case "BIM":
            Win?.postMessage(`{"type": "setViewType", "data": "BIM"}`, 'http://localhost:3001');
            // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), `{"type": "setViewType", "data": "BIM"}`);
            break;
          case "pointCloud":
            Win?.postMessage(`{"type": "setViewType", "data": "pointCloud"}`, 'http://localhost:3001');
            // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), `{"type": "setViewType", "data": "pointCloud"}`);
            break;
          case "orthoPhoto":
            Win?.postMessage(`{"type": "setViewType", "data": "orthophoto"}`, 'http://localhost:3001');
            // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), `{"type": "setViewType", "data": "orthoPhoto"}`);
            break;
        }
        break;

      case "setStructure":
        //conn.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"setStructure","data":'+JSON.stringify(response.result)+'}')

        break;

      case "setCompareMode":

        switch (toolInstance.data) {
          case "noCompare":
            Win?.postMessage('{"type":"' + toolInstance.type + '","data":"' + toolInstance.data + '"}', 'http://localhost:3001');
            // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":"' + toolInstance.data + '"}');
            break;
          case "compareDesign":
            Win?.postMessage('{"type":"' + toolInstance.type + '","data":"' + toolInstance.data + '"}', 'http://localhost:3001');
            // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":"' + toolInstance.data + '"}');
            break;
          case "compareReality":
            if(initData&& initData.currentViewType==='orthoPhoto')
            Win?.postMessage('{"type":"' + toolInstance.type + '","data":"compareMap"}', 'http://localhost:3001');
            //   conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":"compareMap"}');
            else  
            Win?.postMessage('{"type":"' + toolInstance.type + '","data":"' + toolInstance.data + '"}', 'http://localhost:3001');
            //   conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":"' + toolInstance.data + '"}');
            break;

        }
        break;
      case "setViewMode":
        switch (toolInstance.data) {
          case "Design":
            if(initData?.structure.designs&& initData?.structure.designs.length >= 1){
              if(initData?.structure.designs.find((des:any)=>{
                if(des.type==="Plan Drawings"){
                  return des
                }    
              }))
              {
                Win?.postMessage('{"type": "setViewType", "data": "Plan Drawings"}', 'http://localhost:3001');
                // conn.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type": "setViewType", "data": "Plan Drawings"}');
              }
              else if(initData?.structure.designs.find((des:any)=>{
                if(des.type==="BIM"){
                  return des
                }    
              })){
                Win?.postMessage('{"type": "setViewType", "data": "BIM"}', 'http://localhost:3001');
                // conn.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type": "setViewType", "data": "BIM"}');
              }
            }

            break;
          case "Reality":
            if(initData&& initData.currentViewType==='orthoPhoto')
            Win?.postMessage('{"type": "setViewType", "data": "compareMap"}', 'http://localhost:3001');
            //   conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"setViewType", "data":"compareMap"}');
            else
            Win?.postMessage('{"type": "setViewType", "data": "pointCloud"}', 'http://localhost:3001');
            //   conn.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type": "setViewType", "data": "pointCloud"}');
            break;

        }

        break;
      case "viewIssueList":

        setOpenIssueView(true);
        break;
      case "createIssue":
        Win?.postMessage('{"type":"createIssue","data":" "}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"createIssue","data":" "}');
        // conn.subscribeTopic(MqttConnector.getMultiverseRecTopicString(),appEventsCB)
        break;

      case "showIssue":
        Win?.postMessage('{"type":"showIssue","data":" "}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"'+toolInstance.toolAction+'","data":" "}');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"showIssue","data":" "}');
        break;
      case "hideIssue":
        Win?.postMessage('{"type":"hideIssue","data":" "}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"hideIssue","data":" "}')
        break;
      case "selectIssue": 
        Win?.postMessage('{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}', 'http://localhost:3001');        
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}');
        break;
      case "removedIssue":
        (async () => {
          const issueDetelteStatus = await deleteTheIssue(toolInstance.data);
          if (issueDetelteStatus) {
            let issueId = (toolInstance.data as { _id: any })._id;
            Win?.postMessage( '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(issueId) + '}', 'http://localhost:3001');
            // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(issueId) + '}')
          }
        })();
        break;
      case 'handleIssueFilter':
          handleOnIssueFilter(toolInstance.data)
          
        break;
      case 'setFilteredIssueList':
        Win?.postMessage( '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}');
        break;
      case 'closeFilterOverlay':
        closeFilterOverlay()
        break;
      case "sortIssue":
        handleOnIssueSort(toolInstance.data)
        break;
      case "deleteIssueAttachment":
        deleteTheAttachment(toolInstance.data,"issue")
        break;
      case "deleteTaskAttachment":
        deleteTheAttachment(toolInstance.data,"task")
        break;
      case 'closeTaskOverlay':
      closeTaskFilterOverlay()
      break;
      case "viewTaskList":
        //setOpenIssueView(true);
        break;
      case "createFailIssue":
        Win?.postMessage( '{"type":"createFailIssue","data":" "}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"createFailIssue","data":" "}');
        break;
      case "createSuccessIssue":
        Win?.postMessage( '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}');
        break;
      case "editIssue":
        Win?.postMessage( '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}');
        break;
      case "createTask":
        Win?.postMessage( '{"type":"' + toolInstance.type + '","data":" "}', 'http://localhost:3001');
        conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":" "}');
        break;
      case "createFailTask":
        Win?.postMessage( '{"type":"createFailTask","data":" "}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"createFailTask","data":" "}');
        break;
      case "createSuccessTask":
        Win?.postMessage( '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}');
        break;
      case "selectTask":
        Win?.postMessage( '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}');
        break;
      case "showTask":
        Win?.postMessage('{"type":"showTask","data":" "}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"showTask","data":" "}');
        break;
      case "hideTask":
        Win?.postMessage('{"type":"hideTask","data":" "}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"hideTask","data":" "}')
        break;
      case "editTask":
        Win?.postMessage( '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}');
        break;
      case "removedTask":
        (async () => {
          const TaskDetelteStatus = await deleteTheTask(toolInstance.data);
          if (TaskDetelteStatus) {
            let taskId = (toolInstance.data as { _id: any })._id;
            Win?.postMessage( '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(taskId) + '}', 'http://localhost:3001');
            // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(taskId) + '}')
          }
        })();
        // setClickedTool(toolInstance);
        break;
     
      case 'handleTaskFilter':
        handleOnTaskFilter(toolInstance.data);
        break;
      case 'setFilteredTaskList':
        Win?.postMessage(  '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}');
        break; 
      case 'sortTask':
        handleOnTasksSort(toolInstance.data)
        break;
      case "setViewLayers":
        Win?.postMessage(  '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}', 'http://localhost:3001');
        // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"' + toolInstance.type + '","data":' + JSON.stringify(toolInstance.data) + '}');
        break;
      case "addViewLayer":
        // newLayers.push(toolInstance.toolAction);
        // console.log(newLayers, "newLayesrs");
        // setViewLayers(newLayers);
        break;
      case "removeViewLayer":
        // newLayers.splice(newLayers.indexOf(toolInstance.toolAction), 1);
        // setViewLayers(newLayers);
        break;
      case "setFullScreenMode":
        break;
      case "closeIssueDrawer":
        delete router.query.iss
        router.push(router)
      case "closeTaskDrawer":
        delete router.query.tsk
        router.push(router)

      default:
        break;
    }
  };


  const getIssuesPriorityList = (projId: string) => {
    return getIssuesPriority(router.query.projectId as string)
      .then((response: any) => {
        return response.result;
      })
      .catch((error: any) => {
        if (error.success === false) {
          CustomToast(error?.message, "error");
        }
      });
  };
  // const getTasks = (structureId: string) => {
  //   if (structureId && router.query.projectId) {
  //     getTasksList(router.query.projectId as string, structureId)
  //       .then((response: any) => {
  //         setTasksList(response.result);
  //         setTaskFilterList(response.result);
  //       })
  //       .catch((error: any) => {
  //         if (error.success === false) {
  //           CustomToast(error?.message, "error");
  //         }
  //       });
  //   }
  // };

  const handleOnIssueSort = (sortMethod: any) => {
    switch (sortMethod) {
      case "Last Updated":
        if (initData) {
          const sortedCurrentIssueList = [...initData.currentIssueList].sort((a: any, b: any) => {
            if (a.dueDate > b.dueDate) {
              return 1;
            } else if (b.dueDate > a.dueDate) {
              return -1;
            }
            return 0;
          });
        
          const updatedInitData = { ...initData, currentIssueList: sortedCurrentIssueList };
          setInintData(updatedInitData);
        }
        
        break;
      case "First Updated":
        if (initData) {
          const sortedCurrentIssueList = [...initData.currentIssueList].sort((a: any, b: any) => {
            if (a.updatedAt > b.updatedAt) {
              return -1;
            } else if (b.updatedAt > a.updatedAt) {
              return 1;
            }
            return 0;
          });
          const updatedInitData = { ...initData, currentIssueList: sortedCurrentIssueList };
          setInintData(updatedInitData);
        }
        
      case "Asc DueDate":
        if (initData) {
          const sortedCurrentIssueList = [...initData.currentIssueList].sort((a: any, b: any) => {
            return new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf();
          });
        
          const updatedInitData = { ...initData, currentIssueList: sortedCurrentIssueList };
          setInintData(updatedInitData);
        }
        
        break;
      case "Dsc DueDate":
        if (initData) {
          const sortedCurrentIssueList = [...initData.currentIssueList].sort((a: any, b: any) => {
            return new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf();
          });
        
          const updatedInitData = { ...initData, currentIssueList: sortedCurrentIssueList };
          setInintData(updatedInitData);
        }        
        break;
      case "Asc Priority":
        if (initData) {
          const sortedCurrentIssueList = [...initData.currentIssueList].sort((a: any, b: any) => {
            return a.priority.trim().toLowerCase().localeCompare(b.priority.trim().toLowerCase());
          });
          const updatedInitData = { ...initData, currentIssueList: sortedCurrentIssueList };
          setInintData(updatedInitData);
        }
        
        break;
      case "Dsc Priority":
        if (initData) {
          const sortedCurrentIssueList = [...initData.currentIssueList].sort((a: any, b: any) => {
            return b.priority.trim().toLowerCase().localeCompare(a.priority.trim().toLowerCase());
          });
          const updatedInitData = { ...initData, currentIssueList: sortedCurrentIssueList };
          setInintData(updatedInitData);
        }
        
        break;
      case "status_asc":
        if (initData) {
          const sortedCurrentIssueList = [...initData.currentIssueList].sort((a: any, b: any) => {
            return a.status.trim().toLowerCase().localeCompare(b.status.trim().toLowerCase());
          });
          const updatedInitData = { ...initData, currentIssueList: sortedCurrentIssueList };
          setInintData(updatedInitData);
        }
        

        break;
      case "status_desc":
        if (initData) {
          const sortedData = [...initData.currentIssueList].sort((a: any, b: any) =>
            b.status.trim().toLowerCase().localeCompare(a.status.trim().toLowerCase())
          );
          const updatedInitData = { ...initData, currentIssueList: sortedData };
          setInintData(updatedInitData);
        }
        break;
      default:
        break;
    }
  };

  const handleOnTasksSort = (sortMethod: any) => {

    switch (sortMethod) {
      case "Last Updated":
        if (initData) {
          const sortedCurrentTaskList = [...initData.currentTaskList].sort((a: any, b: any) => {
            if (a.updatedAt > b.updatedAt) {
              return 1;
            } else if (b.updatedAt > a.updatedAt) {
              return -1;
            }
            return 0;
          });
        
          const updatedInitData = { ...initData, currentTaskList: sortedCurrentTaskList };
          setInintData(updatedInitData);
        }
        
        break;
      case "First Updated":
        if (initData) {
          const sortedCurrentTaskList = [...initData.currentTaskList].sort((a: any, b: any) => {
            if (a.updatedAt > b.updatedAt) {
              return -1;
            } else if (b.updatedAt > a.updatedAt) {
              return 1;
            }
            return 0;
          });
        
          const updatedInitData = { ...initData, currentTaskList: sortedCurrentTaskList };
          setInintData(updatedInitData);
        }
        
      case "Asc DueDate":
        if (initData) {
          const sortedCurrentTaskList = [...initData.currentTaskList].sort((a: any, b: any) => {
            return new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf();
          });
        
          const updatedInitData = { ...initData, currentTaskList: sortedCurrentTaskList };
          setInintData(updatedInitData);
        }        
        break;
      case "Dsc DueDate":
        if (initData) {
          const sortedCurrentTaskList = [...initData.currentTaskList].sort((a: any, b: any) => {
            return new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf();
          });
        
          const updatedInitData = { ...initData, currentTaskList: sortedCurrentTaskList };
          setInintData(updatedInitData);
        }
        
        break;
      case "Asc Priority":
        if (initData) {
          const sortedCurrentTaskList = [...initData.currentTaskList].sort((a: any, b: any) => {
            return a.priority.trim().toLowerCase().localeCompare(b.priority.trim().toLowerCase());
          });
        
          const updatedInitData = { ...initData, currentTaskList: sortedCurrentTaskList };
          setInintData(updatedInitData);
        }        
        break;
      case "Dsc Priority":
        if (initData) {
          const sortedCurrentTaskList = [...initData.currentTaskList].sort((a: any, b: any) => {
            return b.priority.trim().toLowerCase().localeCompare(a.priority.trim().toLowerCase());
          });
        
          const updatedInitData = { ...initData, currentTaskList: sortedCurrentTaskList };
          setInintData(updatedInitData);
        }        
        break;
      case "status_asc":
        if (initData) {
          const sortedCurrentTaskList = [...initData.currentTaskList].sort((a: any, b: any) => {
            return a.status.trim().toLowerCase().localeCompare(b.status.trim().toLowerCase());
          });
        
          const updatedInitData = { ...initData, currentTaskList: sortedCurrentTaskList };
          setInintData(updatedInitData);
        }        

        break;
      case "status_desc":
        if (initData) {
          const sortedCurrentTaskList = [...initData.currentTaskList].sort((a: any, b: any) => {
            return b.status.trim().toLowerCase().localeCompare(a.status.trim().toLowerCase());
          });
        
          const updatedInitData = { ...initData, currentTaskList: sortedCurrentTaskList };
          setInintData(updatedInitData);
        }
        

        break;
      default:
        break;
    }
  };

  const handleOnIssueFilter = (formData: any) => {
    const result = issueFilterList.filter(
      (item: Issue) => {
        const dueDate = setTheFormatedDate(item.dueDate);
        const startDate = setTheFormatedDate(item.startDate);
        const fromDate = setTheFormatedDate(formData.fromDate);
        const toDate = setTheFormatedDate(formData.toDate);
        return (
          (formData.issueTypeData.includes(item.type) ||
            formData.issueTypeData.length == 0) &&
          (formData?.issuePriorityData?.includes(item.priority) ||
            formData?.issuePriorityData?.length == 0) &&
          (formData?.issueStatusData?.includes(item.status) ||
            formData?.issueStatusData.length == 0) &&
          (item.tags.filter((tag: any) => formData?.issueTagData?.includes(tag))
            .length ||
            formData?.issueTagData?.length == 0 ||
            !formData?.issueTagData) &&
          (item.assignees.filter(
            (userInfo: any) => userInfo._id === formData.assigneesData?.user?._id
          ).length ||
            formData?.assigneesData?.length == 0 ||
            !formData?.assigneesData)
          &&
          ((!formData.fromDate && !formData.toDate) ||
            (Moment(dueDate).isSameOrAfter(fromDate) && Moment(startDate).isSameOrAfter(fromDate)) &&
            (Moment(dueDate).isSameOrBefore(toDate) && Moment(startDate).isSameOrBefore(toDate)))
        );
      });
    let count =
      formData?.issueTypeData?.length +
      formData?.issuePriorityData?.length +
      formData?.issueStatusData?.length +
      formData?.issueTagData?.length;
    if (formData?.assigneesData) {
      count = count + 1;
    }
    if (formData?.toDate) {
      count = count + 1;
    }
    if (formData?.fromDate) {
      count = count + 1;
    }   
    setIsList(result);
    setIssueFilterState({
      isFilterApplied: true,
      filterData: formData,
      numberOfFilters: count,
    });
    let data : any = result
    let issueFilterMessage : IToolbarAction = {data:data , type:"setFilteredIssueList"}
    toolClicked(issueFilterMessage)
   
  

  };
  const closeFilterOverlay = () => {
    setIsList(issueFilterList);
    setIssueFilterState({
      isFilterApplied: false,
      filterData: {},
      numberOfFilters: 0,
    });
    let data:any=issueFilterList
    let issueFilterMessage : IToolbarAction = {data:data , type:"setFilteredIssueList"}
    toolClicked(issueFilterMessage)
   
  };

  useEffect(()=>{
    ref.current?.issueFilterState(issueFilterState)
  },[issueFilterState])

  const handleOnTaskFilter = (formData: any) => {
    const result = taskFilterList.filter(
      (item) => {
        const dueDate = setTheFormatedDate(item.dueDate);
        const startDate = setTheFormatedDate(item.startDate);
        const fromDate = setTheFormatedDate(formData.fromDate);
        const toDate = setTheFormatedDate(formData.toDate);
        return (
          (formData.taskType.includes(item.type) ||
            formData.taskType.length == 0) &&
          (formData?.taskPriority?.includes(item.priority) ||
            formData?.taskPriority?.length == 0) &&
          (formData?.taskStatus?.includes(item.status) ||
            formData?.taskStatus.length == 0) &&
          (item.tags.filter((tag) => formData?.taskTag?.includes(tag)).length ||
            formData?.taskTag?.length == 0 ||
            !formData?.taskTag) &&
          (item.assignees.filter(
            (userInfo: any) => userInfo._id === formData.assigneesData?.user?._id
          ).length ||
            formData?.assigneesData?.length == 0 ||
            !formData?.assigneesData)
          &&
          ((!formData.fromDate && !formData.toDate) ||
            (Moment(dueDate).isSameOrAfter(fromDate) && Moment(startDate).isSameOrAfter(fromDate)) &&
            (Moment(dueDate).isSameOrBefore(toDate) && Moment(startDate).isSameOrBefore(toDate)))
        );
      });
    let count =
      formData?.taskType?.length +
      formData?.taskPriority?.length +
      formData?.taskStatus?.length +
      formData?.taskTag?.length;
    if (formData?.assigneesData) {
      count = count + 1;
    }
    if (formData?.toDate) {
      count = count + 1;
    }
    if (formData?.fromDate) {
      count = count + 1;
    }
    setTasList(result);
    setTaskFilterState({
      isFilterApplied: true,
      filterData: formData,
      numberOfFilters: count,
    });
    let data : any = result
    let issueFilterMessage : IToolbarAction = {data:data , type:"setFilteredTaskList"}
    toolClicked(issueFilterMessage)
  };

  useEffect(()=>{
    ref.current?.taskFilterState(taskFilterState)
  },[taskFilterState])

  const closeTaskFilterOverlay = () => {
    setTasksList(taskFilterList);
    setTaskFilterState({
      isFilterApplied: false,
      filterData: {},
      numberOfFilters: 0,
    });
    let data:any=taskFilterList
    let issueFilterMessage : IToolbarAction = {data:data , type:"setFilteredTaskList"}
    toolClicked(issueFilterMessage)
  };
  const deleteTheIssue = async (issueObj: any): Promise<boolean> => {
    try {
      const response: any = await deleteIssue(router.query.projectId as string, issueObj._id);

      if (response.success === true) {
        CustomToast(response.message, "success");
        return true;
      }

    } catch (error: any) {
      if (!error.success && error.message === "Forbidden Access") {
        CustomToast("You do not have access, Contact Admin", "error");
      } else {
        CustomToast("Issue could not be deleted", "error");
      }
      return false;
    }
    return false;
  };


  const deleteTheTask = async (taskObj: any): Promise<boolean> => {
    try {
      const response: any = await deleteTask(router.query.projectId as string, taskObj._id)
      if (response.success === true) {
        CustomToast(response.message, "success");
        return true;
      }
    }
    catch (error: any) {
      if (!error.success && error.message === "Forbidden Access") {
        CustomToast("You do not have access, Contact Admin", "error");
      } else {
        CustomToast("Issue could not be deleted", "error");
      }
      return false;
    }
    return false

  };

  const clickIssueEditSubmit = (editObj: any, issueObj: any) => {
    editIssue(
      router.query.projectId as string,
      editObj,
      issueObj?._id as string
    )
      .then((response: any) => {
        if (response.success === true) {
          CustomToast("issue information updated successfully", "success");
          const index = issueFilterList.findIndex(
            (obj: Issue) => obj._id === response.result._id
          );
          issueFilterList.splice(index, 1, response.result);
          setIssueList(issueFilterList);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
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
  const deleteTheAttachment = (attachmentId: any, entity?: string) => {
    deleteAttachment(attachmentId)
      .then((response: any) => {
        if (response.success === true) {
          CustomToast(response.message, "success");
          if (entity === "issue") {
            const updatedList:any = initData?.currentIssueList.map((issueObj) => {
              const index = issueObj.attachments.findIndex(
                (obj: any) => obj._id === attachmentId
              );
              issueObj.attachments.splice(index, 1);
              return issueObj;
            });
            if(initData){
            const updatedInitData = { ...initData, currentIssueList: updatedList };
            setInintData(updatedInitData);
          }
        
          } else {
            const updatedList:any = initData?.currentTaskList.map((taskObj) => {
              const index = taskObj.attachments.findIndex(
                (obj: any) => obj._id === attachmentId
              );
              taskObj.attachments.splice(index, 1);
              return taskObj;
            });
            if(initData){
              const updatedInitData = { ...initData, currentTaskList: updatedList };
              setInintData(updatedInitData);
            
            }
          }
        }
      })
      .catch((error: any) => {
        CustomToast(error.message, "error");
      });
  };

  const handleBreadCrumbClick = (node: any, index: number) => {
    window.localStorage.setItem("nodeData", JSON.stringify(node));
    const expandedNodes = breadCrumbsData.map((e: any) => e._id);
    window.localStorage.setItem(
      "expandedNodes",
      JSON.stringify(expandedNodes.slice(0, index + 1))
    );
    setSelected(node._id);
    setExpanded(expandedNodes.slice(0, index + 2));
    getStructureData(node);
    setHierarchy(true);
  };

  const [selector, setSelector] = useState("");
  let [state, setState] = useState<ChildrenEntity[] | any[]>([]);
  let [stateFilter, setStateFilter] = useState<ChildrenEntity[]>([]);
  useEffect(() => {
    if (router.isReady) {
      // if (router.query.structId !== undefined)
      // setSelector(router.query.structId.toString());
      getSectionsList(router.query.projectId as string)
        .then((response: AxiosResponse<any>) => {
          const result = response.data.result;
          const resultArray: any = Array.isArray(result) ? result : [result];
          setState([...resultArray]);
          //setStateFilter([...response.data.result]);
          // if (selector.length < 1) setSelector(response.data.result[0]._id);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [router.isReady, router.query.projectId]);


  const getBreadCrumbs = () => {
    //let structTemp :IStructure = structure;
    // let outputSting : string = structure?.name || '';
    if (structure === undefined) {
      return "";
    }
    return " | " + project?.name + " / " + structure?.name;
  };
  const [isFullScreenActive, setFullScreenActive] = useState<boolean>(false);

  const r: any = useRef();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", (event) => {
      if (document.fullscreenElement) {
        // We’re going fullscreen
      } else {
        // We’re exiting fullscreen
        setIsFullScreen(false);
      }
    });
  }, []);

  const createCancel = () => {
    if (highlightCreateIcon) {
      setHighlightCreateIcon(false)
      // toolClicked({
      //   toolName: "issue",
      //   toolAction: "issueCreateFail"
      // })
    }
    if (highlightCreateTaskIcon) {
      setHighlightCreateTaskIcon(false)
      // toolClicked({
      //   toolName: "task",
      //   toolAction: "taskCreateFail"
      // })
    }
  }

  useEffect(() => {
    if (router.query.iss !== null && initData) {
      let sel_iss: Issue | undefined = initData?.currentIssueList?.find((t) => t._id === router.query.iss)
      if (sel_iss) {
        handleMenuInstance.type = "selectIssue"
        handleMenuInstance.data = sel_iss._id
        if (ref && ref.current) {
          ref.current?.RouterIssueRef(handleMenuInstance) // useRef for passing Router Issue/Task
        }
      }
      else {
        delete router.query.iss
      }

    }

  }, [router.query.iss, router.query.snap,multiverseIsReady]);

  useEffect(() => {
    if (router.query.tsk != null) {
      let sel_tsk: ITasks | undefined = initData?.currentTaskList.find((t) => t._id === router.query.tsk)
      console.log("sel_tsk",sel_tsk);
      
      if (sel_tsk) {
        handleMenuInstance.type = "selectTask"
        handleMenuInstance.data = sel_tsk._id
        if (ref && ref.current) {
          ref.current?.RouterIssueRef(handleMenuInstance)
        }
      }

    }

  }, [router.query.tsk, router.query.snap,multiverseIsReady]);



  // const updateRouter = (type: String, snap: String) => {
  //   if (type !== router.query.type) router.query.type = String(type);
  //   if (snap !== router.query.snap) router.query.snap = snap as string;

  //   router.push(router);

  // }
  useEffect(()=>{
    if(projectUsers || issueStatusList || tasksStatusList){
    ref.current?.projectUsersAndStatus(projectUsers,issueStatusList,tasksStatusList)
    }
  },[projectUsers,issueStatusList,tasksStatusList])

  const updateITRouter = (type: String, id: string) => {
    console.log("updateITRouter",type,id,router)
    if (type === "selectIssue") {
      delete router.query.tsk
      router.query.iss = id;
    }
    if (type === "selectTask") {
      delete router.query.iss
      router.query.tsk = id
    }
    router.push(router)
  }
  const getInitViewType = (vData:IGenData):string =>{
    if(vData.structure.designs&& vData.structure.designs.length >= 1){
      if(vData.structure.designs.find((des:any)=>{
        if(des.type==="Plan Drawings"){
          return des
        }    
      }))
      {
        
        return "Plan Drawings"
      }
      else if(vData.structure.designs.find((des:any)=>{
        if(des.type==="BIM"){
          return des
        }    
      })){
        
        return "BIM"
      }

    }
    else if(vData.currentSnapshotBase.reality?.length && vData.currentSnapshotBase.reality.length >=1){
      return "pointCloud"
    }
    
     
    
    
  return ""
}
  
 const isViewTypeAvailable = (vData:IGenData,checkType:string):boolean=>{
  
    switch(checkType){
      case 'Plan Drawings':
        if(vData.structure.designs&& vData.structure.designs.length >= 1){
          if(vData.structure.designs.find((des:any)=>{
            if(des.type==="Plan Drawings"){
              return des
            }    
          }))
          {
            
            return true;
          }
        }
        break;
      case 'BIM':
        if(vData.structure.designs&& vData.structure.designs.length >= 1){
          if(vData.structure.designs.find((des:any)=>{
            if(des.type==="BIM"){
              return des
            }    
          }))
          {
            
            return true;
          }
        }
        break;
      case 'pointCloud':
        if(vData.currentSnapshotBase?.reality?.length && vData.currentSnapshotBase.reality.length >=1){
          return true;
        }
        break
      case 'orthoPhoto':
        if(vData.currentViewTypeList?.includes('orthoPhoto')){
          return true;
        }
        break;

    }
    return false
 }


  
  useEffect(() => {
    const Win = (document.getElementById("IframeId") as HTMLIFrameElement)?.contentWindow;
    if (router.isReady) {
      getGenViewerData(router.query.projectId as string, router.query.structureId as string)
        .then((response) => {
          if (response.success === true) {  
            setIssueFilterList(response.result.currentIssueList) 
            setTaskFilterList(response.result.currentTaskList)

            // if (router.query.type !== response.result.data?.currentViewType || router.query.snap !== response.result?.data?.currentSnapshotBase._id) {
            //   router.query.type = response.result.data?.currentViewType as string;
            //   router.query.snap = response.result.data?.currentSnapshotBase._id as string;
            //   router.push(router);
            // }
            let vData:IGenData = response.result; 
            if(router.query.type === undefined){
              vData.currentViewType = getInitViewType(vData)
            }
            else if(router.query.type&& router.query.type !== undefined)
            {              
              if(isViewTypeAvailable(vData,router.query.type.toString()))
              {
                vData.currentViewType = router.query.type.toString()
              }
              else{
                vData.currentViewType = getInitViewType(vData)
              }
             
            }
             
            if(router.query.snap&& router.query.snap!== vData.currentSnapshotBase?._id)
            {
              let urlSnap:ISnapshot|undefined=vData.snapshotList.find((snp:ISnapshot)=>{
                if(snp._id===router.query.snap?.toString())
                {
                  return snp;
                }
              });
              if(urlSnap)
                vData.currentSnapshotBase=urlSnap;
            }
            vData.taskShow=true;
            vData.issueShow=true;
            vData.isIssueFiltered=false;
            vData.isTaskFiltered=false;
            vData.projectUTM=appState.currentProjectData?.project?.utm || undefined ;
            vData.projectLocation = appState.currentProjectData?.project?.location || undefined ;
            setInintData(vData);
            // if(initData && router.query.iss || router.query.tsk){

            //   handleMenuInstance.data = router.query.iss as string || router.query.tsk as string;
            //   if(router.query.iss){
            //     handleMenuInstance.type = "selectIssue"
            //     handleMenuInstance.data = router.query.iss as string 
            //   } 
            //   if(router.query.tsk){
            //     handleMenuInstance.type = "selectTask"
            //     handleMenuInstance.data = router.query.tsk as string;
            //   } 
            //   if (ref && ref.current) {
            //     ref.current?.RouterIssueRef(handleMenuInstance) // useRef for passing Router Issue/Task
            //   }
            // }
            if (mViewerStatus === "Waiting") {
              Win?.postMessage('{"type":"setGenData","data":' + JSON.stringify(vData) + '}', 'http://localhost:3001'); 
              // conn.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"setGenData","data":' + JSON.stringify(vData) + '}')
              console.log("Handshake setGenData", response.result)
              setMViewerStatus("Connected")
            }
            else if (mViewerStatus === "Connected") {
              Win?.postMessage('{"type":"setStructure","data":' + JSON.stringify(vData) + '}', 'http://localhost:3001'); 
              // conn.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"setStructure","data":' + JSON.stringify(vData) + '}')

            }
          }
        })
        .catch((error) => {
          console.log("Error in loading data: 1 ", error);
        });
    }
  }, [router.isReady,router.query.structureId])



  useEffect(() => {
    const Win = (document.getElementById("IframeId") as HTMLIFrameElement)?.contentWindow;
    if (initData) {

      console.log("init data after",initData);
      
      if (initData.structure.designs?.length) {
        setDesignAvailable(true)
      }
      else {
        setDesignAvailable(false)
      }
      if (initData.currentSnapshotBase?.reality?.length) {
        setRealityAvailable(true)
      }
      else {
        setRealityAvailable(false)
      }
      if (mViewerStatus === "Waiting") {
        Win?.postMessage('{"type":"setGenData","data":' + JSON.stringify(initData) + '}', 'http://localhost:3001'); 
        // conn.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"setGenData","data":' + JSON.stringify(initData) + '}')
        console.log("Handshake setGenData", initData)
        setMViewerStatus("Connected")
        
      }
      updateURLQuery(initData as IGenData)
      if (initData.currentViewType === "Plan Drawings" || initData.currentViewType === "BIM") {
        currentViewMode !== "Design" ? setViewMode("Design") : null;
      }
      else {
        currentViewMode !== "Reality" ? setViewMode("Reality") : null;
      }
    }

  }, [initData])

  useEffect(() => {
    const Win = (document.getElementById("IframeId") as HTMLIFrameElement)?.contentWindow;
    if (mViewerStatus === "Waiting") {
      if (initData) {
        Win?.postMessage('{"type":"setGenData","data":' + JSON.stringify(initData) + '}', 'http://localhost:3001'); 
        // conn.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"setGenData","data":' + JSON.stringify(initData) + '}')
        console.log("Handshake setGenData", initData)
        setMViewerStatus("Connected")
        
      }

      else {
        if (router.isReady) {
          getGenViewerData(router.query.projectId as string, router.query.structureId as string)
            .then((response) => {
              if (response.success === true) {
                let vData:IGenData = response.result
              if(router.query.type === undefined){
                vData.currentViewType = getInitViewType(vData)
              }
              else if(router.query.type&& router.query.type !== undefined)
            {
              
              if(isViewTypeAvailable(vData,router.query.type.toString()))
              {
                vData.currentViewType = router.query.type.toString()
              }
              else{
                vData.currentViewType = getInitViewType(vData)
              }
             
            }
                vData.taskShow=true;
                vData.issueShow=true;
                vData.isIssueFiltered=false;
                vData.isTaskFiltered=false;
                vData.projectUTM=appState.currentProjectData?.project?.utm || undefined ;
                vData.projectLocation = appState.currentProjectData?.project?.location || undefined ;
                setInintData(vData);
                setIssueFilterList(response.result.currentIssueList)
                setIsList(response.result.currentIssueList)  
                setTaskFilterList(response.result.currentTaskList)
                setTasList(response.result.currentTaskList)
                Win?.postMessage('{"type":"setGenData","data":' + JSON.stringify(vData) + '}', 'http://localhost:3001'); 
                // conn.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"setGenData","data":' + JSON.stringify(vData) + '}')
                console.log("Handshake setGenData", response.result)
                setMViewerStatus("Connected")                       

              }
            })
            .catch((error) => {
              console.log("Error in loading data: 1 ", error);
            });

        }
      }
    }
    else if (mViewerStatus === "Connected") {
      setMultiverseIsReady(true)
    }
  }, [mViewerStatus])



  const multiverseHandShakeEventsCB: OnMessageCallbak = (msg: Buffer, packer: any): void => {
    const Win = (document.getElementById("IframeId") as HTMLIFrameElement)?.contentWindow;
    const message = JSON.parse(msg.toString())
    console.log("Handshake data Rec on APP", JSON.parse(msg.toString()))
    if (message.type === "getAuthToken") {
      console.log("yes Handshake Rec getAuthToken")
      const userObj: any = getCookie('user');
      let user = null;
      if (userObj) user = JSON.parse(userObj);
      if (user) {
        // console.log("Going to send Handshake setAuth",user);
        // Win?.postMessage('{"type":"setAuthToken","data":' + JSON.stringify(user) + '}', 'http://localhost:3001'); 
        conn.publishMessage(MqttConnector.getMultiverseHandShakeString(), '{"type":"setAuthToken","data":' + JSON.stringify(user) + '}');
      }

    }
    else if (message.type === "READY") {
      setMultiverseIsReady(true);
      setMViewerStatus("Waiting");
      console.log("READY, Handshake")
      if (initData) {
        Win?.postMessage('{"type":"setGenData","data":' + JSON.stringify(initData) + '}', 'http://localhost:3001'); 
        // conn.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"setGenData","data":' + JSON.stringify(initData) + '}')
        console.log("READY, Handshake setGenData", initData);
        setMViewerStatus("Connected");
      }


    }

  }

  const updateURLQuery = (newData: IGenData) => {

    if (router) {
      // (router.query.structId !== newData.structure._id) ? router.query.structId = newData.structure._id : null;
      // (router.query.structureId !== newData.structure._id) ? router.query.structureId = newData.structure._id : null;
      // (router.query.projectId !== newData.structure.project) ? router.query.projectId = newData.structure.project : null;
      // (router.query.type !== newData.currentViewType) ? router.query.type = newData.currentViewType : null;
      // (router.query.snap !== newData.currentSnapshotBase._id) ? router.query.snap = newData.currentSnapshotBase._id : null;
      router.push({pathname:router.pathname,query:
        {...router.query,projectId:newData.structure.project,structureId:newData.structure._id,type:newData.currentViewType,snap:newData.currentSnapshotBase?._id}},
        undefined,{});
    }

  }
//   useEffect(()=>{
//     if(issueFilterState.isFilterApplied === false) 
//    {
//    ref.current?.issueFilterState(issueFilterState)
   
//    }
//    if(taskFilterState.isFilterApplied === false){
//      ref.current?.taskFilterState(taskFilterState)
//    }
//  },[issueFilterState,taskFilterState])


  const appEventsCB: OnMessageCallbak = (msg: Buffer, packet: any): void => {
    const message = JSON.parse(msg.toString())
    console.log("callback data", JSON.parse(msg.toString()))
    

    // if(message.data.currentViewType !== router.query.type || message.data.currentSnapshotBase?._id !== router.query.snap){
    //   updateRouter(message.data.currentViewType,message.data.currentSnapshotBase?._id) //Router Current Type 
    // }
    // if(message.type === "selectIssue" || message.type === "selectTask"){
    //   updateITRouter(message.type,message.data.id) //Router current Task/Issue
    // }
    if (message.type === "syncGenViewer") {
      setInintData(message.data);
      
     
     
      
      // updateURLQuery(message.data as IGenData);
      //setViewMode(message.data.viewMode);
      
    }
    else if (message.type === "selectIssue" || message.type === "selectTask" || message.type === "createIssue" || message.type === "createTask") {
      // updateITRouter(message.type, message.data.id)
      handleMenuInstance.data = message;
      handleMenuInstance.type = message.type
      if (ref && ref.current) {
        ref.current?.selectToolRef(handleMenuInstance)
      }

      setCurrentContext(message as IToolbarAction)

    }

  }

  useEffect(()=>{
    if(currentContext){
    if(currentContext?.type === "selectIssue" ||  currentContext?.type === "selectTask"){
      let a=currentContext.data as IContext
      if(a.id !== undefined){

      updateITRouter(currentContext.type,a.id as string)
      }
    
    }
    setCurrentContext(undefined)
  }
  },[currentContext])
  useEffect(() => {
    conn.subscribeTopic(MqttConnector.getMultiverseRecTopicString(), appEventsCB)
    conn.subscribeTopic(MqttConnector.getMultiverseHandShakeString(), multiverseHandShakeEventsCB)
    return () => {
      conn.unSubscribeTopic(MqttConnector.getMultiverseRecTopicString());
      conn.unSubscribeTopic(MqttConnector.getMultiverseHandShakeString());
    }
  }, [])


  const receiveMessage = (event:any) => {
    if (event.origin === MULTIVERSE.ORIGIN_URL) {
      if(event.data.screenshot)
        setScreenShot(event.data) 
      if(event.data.clickEvent)
        console.log("Viewer ClickEvenr rec");       
    }
  }

useEffect(()=>{
  window.addEventListener('message', receiveMessage);
  return () => {
    window.removeEventListener('message', receiveMessage);
  };
},[])
  return (
    <div id="main_id">
    <ApiDataContextProvider  
    initialTypes={issueTypesList}
    initialPriority={issuePriorityList}
    initialStatus={issueStatusList}
    initialProjectUsersList={projectUsers}
    taskinitialTypes={taskTypesList}
    taskinitialPriority={taskPriorityList}
    taskinitialStatus={taskStatusList} 
    issueTagsList={issueTagStatus}
    taskTagsList={TaskTagStatus}
    screenshot={screenshot}
    >
    <div className=" w-full  h-full">
      <div className="w-full" onClick={createCancel}>
        {!isFullScreen && (

          <Header
            toolClicked={toolClicked}
            viewMode={currentViewMode}
            showBreadcrumbs
            breadCrumbData={breadCrumbsData}
            handleBreadCrumbClick={handleBreadCrumbClick}
            isDesignAvailable={isDesignAvailable}
            isRealityAvailable={isRealityAvailable}
          />
        )}

        {/* <Header breadCrumb={getBreadCrumbs()}></Header> */}
      </div>

      <div className="flex " >
        {!isFullScreen && (
          <SidePanelContainer ref={leftOverlayRef} onClick={createCancel} >
            {/* <CollapsableMenu onChangeData={onChangeData}></CollapsableMenu> */}
            <SidePanelMenu onChangeData={onChangeData} />
          </SidePanelContainer>
        )}

        {/* <FullScreen handle={handle}> */}
        <div id="test_full_screen">
          <div></div>
          <div id="viewer"></div>
          {hierarchy ? (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #BDBDBD",
                boxShadow: "5px 4px 8px rgb(200 200 200 / 10%)",
                // transform: "matrix(-1, 0, 0, 1, 0, 0)",
              }}
            >
              <CloseMenuButton isFullScreen={isFullScreen}>
                <Image
                  src={ChevronLeftIcon}
                  width={17}
                  height={17}
                  alt="Arrow"
                  onClick={() => {
                    setHierarchy(false);
                  }}
                />
              </CloseMenuButton>
              <div>
                {
                  <div
                    style={{
                      overflow: "hidden",
                      marginLeft: isFullScreen ? "0" : "58px",
                      zIndex: 0,
                    }}
                    ref={leftRefContainer}
                    className={`${hierarchy ? "visible" : "hidden"
                      }  absolute z-10 border  white-bg projHier `}
                  >
                    <div onClick={createCancel}>
                      <LeftOverLay
                        handleNodeSelection={handleNodeSelection}
                        selectedNodes={structure?._id}
                        handleNodeExpand={handleNodeExpand}
                        expandedNodes={expanded}
                        getStructureData={getStructureData}
                        setHierarchy={setHierarchy}
                        getStructure={(structureData) => {
                          // if (structure === undefined) {
                          //   setStructure(
                          //     getCurrentStructureFromStructureList(structureData)
                          //   );
                          //   getIssues(structureData._id);
                          //   getTasks(structureData._id);
                          // }
                        }}
                        treeData={state}
                      ></LeftOverLay>
                    </div>
                  </div>
                }
              </div>
            </div>
          ) : (
            <div onClick={createCancel}>
              <OpenMenuButton
                onClick={() => {
                  setHierarchy(!hierarchy);
                  customLogger.logInfo("Hierarchy Menu - Open");
                }}
                isFullScreen={isFullScreen}
              >
                <Image
                  src={ChevronRightIcon}
                  alt="Arrow"
                  width={17}
                  height={17}
                  style={{ transform: "rotate(90deg)" }}
                />
                <div>Hierarchy</div>
              </OpenMenuButton>
              <OpenFullScreenButton>
                <Image
                  src={isFullScreen ? exitfullscreenIcon : enterfullscreenIcon}
                  width={40}
                  height={40}
                  alt={""}
                  // onClick={handle.enter}
                  onClick={() => toggleFullScreen()}
                />
              </OpenFullScreenButton>
            </div>
          )}

          <div ref={rightrefContainer}>

            <div
              ref={rightOverlayRef}
              id="bg-color"
              className={`fixed drop-shadow toolbarWidth  ${"visible"} mt-[20px]`}
            >
              {isDesignAvailable || isRealityAvailable ?
                <ToolBarMenuWrapper
                  initData={initData}
                  toolClicked={toolClicked}
                  toolUpdate={toolUpdate}
                  download360Image={()=>{}}
                  downloadPdfReport={()=>{}}
                  ref={ref}
                ></ToolBarMenuWrapper>

                
                : <></>}
            </div></div></div>

        <div>
        {initData && 
        <Suspense fallback={<CustomLoader />}>
     <Iframe isFullScreen={isFullScreen} />
      </Suspense>
}
      {!multiverseIsReady && <CustomLoader />}
        </div>

      </div>
    </div>
    </ApiDataContextProvider>
    </div>
  );
};
export default Index;
