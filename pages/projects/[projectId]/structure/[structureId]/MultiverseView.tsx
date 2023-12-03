import { styled } from "@mui/system";
import { AxiosResponse } from "axios";
import { getCookie } from "cookies-next";
import _ from "lodash";
import Moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { IToolResponse, IToolbarAction, ITools } from "../../../../../models/ITools";
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
import Iframe from "../../../../../components/container/Iframe"
import IssueList from "../../../../../components/container/rightFloatingMenu/issueMenu/issueList";
interface IProps { }
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

const Index: React.FC<IProps> = () => {
  const customLogger = new CustomLoggerClass();
  const router = useRouter();
  let [currentViewMode, setViewMode] = useState("Design"); //Design/ Reality
  const [currentProjectId, setActiveProjectId] = useState("");
  const [structuresList, setStructuresList] = useState<IStructure[]>([]);
  const [project, setProject] = useState<IProjects>();
  const [projectUsers, setProjectUsers] = useState<IProjects>();
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
  const [issuesList, setIssueList] = useState<Issue[]>([]);
  const [tasksList, setTasksList] = useState<ITasks[]>([]);
  const [issuePriorityList, setIssuePriorityList] = useState<[string]>([""]);
  const [tasksPriotityList, setTasksPriorityList] = useState<[string]>([""]);
  const [issueStatusList, setIssueStatusList] = useState<[string]>([""]);
  const [tasksStatusList, setTasksStatusList] = useState<[string]>([""]);
  const [issueTypesList, setIssueTypesList] = useState<[string]>([""]);
  const [layersUpdated, setLayersUpdated] = useState(false);

  const [issueFilterList, setIssueFilterList] = useState<Issue[]>([]);
  const [taskFilterList, setTaskFilterList] = useState<ITasks[]>([]);
  const [openCreateIssue, setOpenCreateIssue] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openIssueView, setOpenIssueView] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState("");
  const [selectedReality, setSelectedReality] = useState("");

  const [currentContext, setCurrentContext] = useState<IToolResponse>({
    type: "Task",
  });
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
  let isSupportUser = useRef(false);
  //const [searchParams,setSearchParams] = useSearchParams();
  // useEffect(() => {
  //   setBreadCrumbsData((prev: any) => prev.splice(0, 1, project));
  // }, [project]);

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

  const closeIssueCreate = () => {
    setOpenCreateIssue(false);
    setHighlightCreateIcon(false);
  };
  const issueSubmit = (formdata: Issue) => {
    issuesList.push(formdata);
    // if (structure) {
    //   getIssues(structure._id);
    // }

    setIssueList(structuredClone(issuesList));
    setIssueFilterList(structuredClone(issuesList));
    // let myTool : ITools ={toolName:'issue',toolAction:'issueCreated'};
    // toolClicked(myTool);
    closeIssueCreate();
  };

  const closeTaskCreate = () => {
    setOpenCreateTask(false);
    setHighlightCreateTaskIcon(false)
  };
  const closeIssueList = () => {
    setOpenIssueView(false);
  };

  const closeTaskDetails = () => {
    setOpenTaskDetails(false);
    delete router.query.tsk
    //router.replace(`/projects/${router?.query?.projectId}/structure?structId=${router?.query?.structId}`)   
    router.push(router);
  };
  const closeIssueDetails = () => {
    setOpenIssueDetails(false);
    delete router.query.iss
    //router.replace(`/projects/${router?.query?.projectId}/structure?structId=${router?.query?.structId}`)
    router.push(router);
  };

  const taskSubmit = (formdata: any) => {
    tasksList.push(formdata);
    let myTool: ITools = { toolName: "task", toolAction: "taskCreated" };
    setTasksList(structuredClone(tasksList));
    setTaskFilterList(structuredClone(tasksList));
    // if (structure) {
    //   getTasks(structure._id);
    // }
    // toolClicked(myTool);
    closeTaskCreate();
  };

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
            setTasksPriorityList(response.result);
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
            setTasksStatusList(response.result);
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

            if (router.query.structId !== undefined) {
              setStructure(
                structs.find((e) => {
                  if (e._id === router.query.structId) {
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
    console.log("changed structree",structure)
    if (router.isReady && structure) {
      router.query.structId = structure?._id;
      router.query.structureId = structure?._id;
             
      router.push(router);
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

  const updateRealityMap = (realityMap: IActiveRealityMap) => {
    setActiveRealityMap(realityMap);
    if (currentViewLayers.length > 0) {
      currentViewLayers.length = 0;
    }
    Object.keys(realityMap).map((key) => {
      currentViewLayers.push(key);
    });
    Object.values(realityMap).map((val: any) => {
      val.realities?.forEach((reality: any) => {
        reality.realityType?.forEach((rType: any) => {
          if (viewTypes.findIndex((typ) => typ === rType) == -1) {
            viewTypes.push(rType);
          }
        });
      });
    });
    setViewTypes(structuredClone(viewTypes));
    //console.log("MyViewTypeList-->r",viewTypes);
  };
  const updatedSnapshot = (snapshot: ISnapshot) => {
    setSnapshot(snapshot);
    if (router.isReady) {
      router.query.snap = snapshot._id;
      router.push(router);
    }
  };
  useEffect(() => {
    if (router.query.iss !== null) {

      let sel_iss: Issue | undefined = issuesList.find((t) => t._id === router.query.iss)
      if (sel_iss) {
      // setClickedTool({ toolAction: 'issueSelect', toolName: 'issue', response: sel_iss });
        setCurrentContext({ ...sel_iss?.context, id: router.query.iss as string });
        setOpenIssueDetails(true);
      }
    }
    else if (router.query.tsk !== null) {
      let sel_tsk: ITasks | undefined = tasksList.find((t) => t._id === router.query.tsk)
      if (sel_tsk) {
        // setClickedTool({ toolAction: 'taskSelect', toolName: 'task', response: sel_tsk });
        setCurrentContext({ ...sel_tsk?.context, id: router.query.tsk as string });
        setOpenTaskDetails(true);
      }
    }


  }, [snapshot]);
  useEffect(() => {

  })
  const updateDesignMap = (designMap: IDesignMap) => {


    setDesignMap(designMap);
    setViewTypes([]);

    Object.keys(designMap).forEach((key) => {
      if (viewTypes.findIndex((k) => k === key) === -1) {
        setViewTypes((prevViewTypes) => [...prevViewTypes, key]);
      }
    });
  };

  useEffect(() => {
    const list: any = [];
    const types: any = [];
    if (activeRealityMap) {
      for (const key in activeRealityMap) {
        activeRealityMap[key as keyof IActiveRealityMap].realities?.forEach(
          (item: any) => {
            item.realityType?.forEach((each: any) => {
              if (!list.includes(each)) {
                list.push(each);
              }
            });
          }
        );
      }
    }
    let realityKeys = list.reduce((a: any, v: any) => ({ ...a, [v]: v }), {});

    Object.keys({ ...designMap, ...realityKeys }).map((key) => {
      types.push(key);
    });
    setDesignAndRealityMaps(types);

    if (isObjectEmpty(activeRealityMap)) {
      setRealityAvailable(false);
    }
    else {
      setRealityAvailable(true);
    }

    if (isObjectEmpty(designMap)) {
      setDesignAvailable(false);
    }
    else {
      setDesignAvailable(true);
    }

  }, [activeRealityMap, designMap]);
  const activeClass = (e: any) => {
    setViewerType(e.currentTarget.id);
  };
  const renderSwitch = (param: string) => {
    switch (param) {
      case "potree":
        return <MapLoading></MapLoading>;

      case "plan Drawings":
        // setGenData()
        break;
        return (
          structure && (
            ''
          )
        );
      case "BIM":
        // setGenData();
        break;
        return (
          snapshot &&
          structure && (
            <div className="overflow-x-hidden overflow-y-hidden">

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

  const toolClicked = (toolInstance: IToolbarAction) => {
    console.log("toolInstrance",toolInstance)
    // let newLayers = _.cloneDeep(currentViewLayers);
    switch (toolInstance.type) {
      case "setViewType":
        switch(toolInstance.data){
          case "Plan Drawings":
            conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), `{"type": "setViewType", "data": "Plan Drawings"}`);
            break;
          case "BIM":
            conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), `{"type": "setViewType", "data": "BIM"}`);
            break;
          case "pointCloud":
            conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), `{"type": "setViewType", "data": "pointCloud"}`);
            break;
        }
        break;
      case "setViewMode":
        
        break;
      case "viewIssueList":
        
        setOpenIssueView(true);
        break;
      case "createIssue":
          
          conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"createIssue","data":" "}');

      case "createSuccessIssue":
        break;
      case "createFailIssue":
        break;
      case "selectIssue":
        break;
      case "showIssue":
            // conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"'+toolInstance.toolAction+'","data":" "}');
            conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"showIssue","data":" "}');
            break;
      case "hideIssue":
        conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"hideIssue","data":" "}')
        break;
      case "removedIssue":
            // setClickedTool(toolInstance);
            break;

      
      case "viewTaskList":
        
        //setOpenIssueView(true);
        break;
      case "createTask":
        conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"createTask","data":" "}');
    
      case "createSuccessTask":
        break;
      case "createFailTask":
        break;
      case "selectTask":
        break;
      case "showTask":
        conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"showTask","data":" "}');
        break;
      case "hideTask":
        conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), '{"type":"hideTask","data":" "}')
        break;
      case "removedTask":
        // setClickedTool(toolInstance);
        break;
      case "setViewLayers":
      case "addViewLayer":
        // newLayers.push(toolInstance.toolAction);
        // console.log(newLayers, "newLayesrs");
        // setViewLayers(newLayers);
        break;
      case "removeViewLayer":
        // newLayers.splice(newLayers.indexOf(toolInstance.toolAction), 1);
        // setViewLayers(newLayers);
        break;
      case "setCompareMode":
        // setClickedTool(toolInstance);
        break;
      case "setFullScreenMode":
        break;
      default:
        break;
    }
  };

  // const toolResponse = (data: ITools) => {
  //   console.log("toolDataaa",data)
  //   switch (data.toolName) {
  //     case "viewMode":
  //       setViewMode(data.toolAction);
  //       break;
  //     case "viewType":
  //       setViewType(data.toolAction);
  //     case "Issue":
  //       if (data.toolAction === "createIssue") {
          
  //         //   html2canvas(document.getElementById('TheView')||document.body).then(function(canvas) {
  //         //     //window.open('','_blank')?.document.body.appendChild(canvas);
  //         //     //canvas.toDataURL('image/png');

  //         // });
  //         // if (data.response != undefined) setCurrentContext(data.response);
  //         // setOpenCreateIssue(true);
  //       } else if (data.toolAction === "selectIssue") {
  //         // issue detail view open logic comes here
  //         if (data.response != undefined) {
  //           setCurrentContext(data.response);
  //           //setOpenIssueDetails(true);
  //           // console.log(router,"Router Obj")
  //           router.query.iss = data.response?.id;
  //           delete router.query.tsk;
  //           router.push(router);
  //         }
  //       }
  //       break;
  //     case "Task":
  //       if (data.toolAction === "createTask") {
  //         if (data.response != undefined) setCurrentContext(data.response);
  //         setOpenCreateTask(true);
  //       } else if (data.toolAction === "selectTask") {
  //         // task detail view open logic comes here
  //         if (data.response != undefined) {
  //           setCurrentContext(data.response);
  //           //setOpenTaskDetails(true);
  //           // console.log(router,"Router Obj")
  //           router.query.tsk = data.response?.id;
  //           delete router.query.iss;
  //           router.push(router)
  //         }
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // };
  // useEffect(() => {
  //   if (currentViewMode === "Design" && designAndRealityMaps.length) {
  //     if (currentViewType != "Plan Drawings" && currentViewType != "BIM") {
  //       if (designAndRealityMaps.includes(selectedDesign)) {
  //         setViewType(selectedDesign);
  //       } else {
  //         if (designAndRealityMaps.includes("Plan Drawings")) {
  //           setViewType("Plan Drawings");
  //           setSelectedDesign("Plan Drawings");
  //         } else if (designAndRealityMaps.includes("BIM")) {
  //           setViewType("BIM");
  //           setSelectedDesign("BIM");
  //         } else {
  //           const val =
  //             designMap && Object.keys(designMap)?.length
  //               ? Object.keys(designMap)[0]
  //               : "";
  //           if (val) {
  //             setViewType(val);
  //             setSelectedDesign(val);
  //           } else {
  //             setViewMode("Reality");
  //           }
  //         }
  //       }
  //     } else if (!designAndRealityMaps.includes(currentViewType)) {
  //       if (designAndRealityMaps.includes("Plan Drawings")) {
  //         setViewType("Plan Drawings");
  //         setSelectedDesign("Plan Drawings");
  //       } else if (designAndRealityMaps.includes("BIM")) {
  //         setViewType("BIM");
  //         setSelectedDesign("BIM");
  //       } else {
  //         const val =
  //           designMap && Object.keys(designMap)?.length
  //             ? Object.keys(designMap)[0]
  //             : "";
  //         if (val) {
  //           setViewType(val);
  //           setSelectedDesign(val);
  //         } else {
  //           setViewMode("Reality");
  //           CustomToast("No Design Found, Contact Support", "error");
  //         }
  //       }
  //     }
  //   } else if (currentViewMode === "Reality" && designAndRealityMaps.length) {
  //     if (currentViewType != "pointCloud" && currentViewType != "orthoPhoto") {
  //       if (designAndRealityMaps.includes(selectedReality)) {
  //         setViewType(selectedReality);
  //       } else {
  //         if (designAndRealityMaps.includes("pointCloud")) {
  //           setViewType("pointCloud");
  //           setSelectedReality("pointCloud");
  //         } else if (designAndRealityMaps.includes("orthoPhoto")) {
  //           setViewType("orthoPhoto");
  //           setSelectedReality("orthoPhoto");
  //         } else {
  //           // setViewType(designAndRealityMaps[0]);
  //           const arr =
  //             activeRealityMap &&
  //               activeRealityMap[
  //                 `${Object.keys(activeRealityMap)[0] as keyof IActiveRealityMap}`
  //               ]?.realities?.length &&
  //               activeRealityMap[
  //                 `${Object.keys(activeRealityMap)[0] as keyof IActiveRealityMap}`
  //               ].realities![0].realityType?.length
  //               ? activeRealityMap[
  //                 `${Object.keys(
  //                   activeRealityMap
  //                 )[0] as keyof IActiveRealityMap
  //                 }`
  //               ].realities![0].realityType
  //               : [];
  //           if (arr && arr.length) {
  //             setViewType(arr[0]);
  //             setSelectedReality(arr[0]);
  //           } else {
  //             setViewMode("Design");
  //             CustomToast("Reality Not Found, Contact Support", "error");
  //           }
  //         }
  //       }
  //     } else if (!designAndRealityMaps.includes(currentViewType)) {
  //       if (designAndRealityMaps.includes("pointCloud")) {
  //         setViewType("pointCloud");
  //         setSelectedReality("pointCloud");
  //       } else if (designAndRealityMaps.includes("orthoPhoto")) {
  //         setViewType("orthoPhoto");
  //         setSelectedReality("orthoPhoto");
  //       } else {
  //         // setViewType(designAndRealityMaps[0]);
  //         const arr =
  //           activeRealityMap &&
  //             activeRealityMap[
  //               `${Object.keys(activeRealityMap)[0] as keyof IActiveRealityMap}`
  //             ]?.realities?.length &&
  //             activeRealityMap[
  //               `${Object.keys(activeRealityMap)[0] as keyof IActiveRealityMap}`
  //             ].realities![0].realityType?.length
  //             ? activeRealityMap[
  //               `${Object.keys(activeRealityMap)[0] as keyof IActiveRealityMap
  //               }`
  //             ].realities![0].realityType
  //             : [];
  //         if (arr && arr.length) {
  //           setViewType(arr[0]);
  //           setSelectedReality(arr[0]);
  //         } else {
  //           setViewMode("Design");
  //         }
  //       }
  //     }
  //   }
  //   setShowIssueMarkups(true);
  //   setShowTaskMarkups(true);
  //   // toolClicked({ toolName: "issue", toolAction: "issueShow" });
  //   // toolClicked({ toolName: "task", toolAction: "taskShow" });
  // }, []);

  // useEffect(() => {

  //   if (
  //     designMap &&
  //     Object.keys(designMap)?.length &&
  //     Object.keys(designMap).includes(currentViewType)
  //   ) {
  //     if (selectedDesign !== currentViewType)
  //       setSelectedDesign(currentViewType);

  //     toolClicked({ toolName: "viewType", toolAction: currentViewType });
  //   } else if (currentViewType) {
  //     //console.log(currentViewType, "Here ...",selectedReality)
  //     if (selectedReality && selectedReality !== currentViewType)
  //       setSelectedReality(currentViewType);
  //     toolClicked({ toolName: "viewType", toolAction: currentViewType });
  //   }
  //   if (router.isReady) {
  //     router.query.type = currentViewType;
  //     router.push(router);
  //   }

  // }, [currentViewType]);

  // useEffect(() => {
  //   let obj: any = activeRealityMap;

  //   for (const key in obj) {
  //     if (obj[key].children?.length) {
  //       obj[key] = {
  //         ...obj[key],
  //         children: obj[key]?.children.map((each: any) => {
  //           return {
  //             ...each,
  //             isSelected: true,
  //           };
  //         }),
  //       };
  //     } else {
  //       obj[key] = {
  //         ...obj[key],
  //         isSelected: true,
  //         children: obj[key].children?.length
  //           ? obj[key]?.children.map((each: any) => {
  //             return {
  //               ...each,
  //               isSelected: true,
  //             };
  //           })
  //           : [],
  //       };
  //     }
  //   }

  //   setActiveRealityMap(obj);
  //   setLayersUpdated(!layersUpdated);
  // }, [currentViewMode, currentViewType]);

  // const getIssues = (structureId: string, isDownload?: boolean) => {
  //   // setIssueLoader(true)
  //   if (structureId && router.query.projectId) {
  //     getIssuesList(router.query.projectId as string, structureId)
  //       .then((response: any) => {
  //         if (isDownload) {
  //           // response.blob().then((blob: any) => {
  //           // Creating new object of PDF file
  //           const data = response.result;
  //           const fileURL = window.URL.createObjectURL(new Blob(data));
  //           // Setting various property values
  //           let alink = document.createElement("a");
  //           alink.href = fileURL;
  //           alink.download = "SamplePDF.pdf";
  //           alink.click();
  //           // });
  //         } else {
  //           setIssueList(response.result);
  //           setIssueFilterList(response.result);
  //         }
  //       })
  //       .catch((error: any) => {
  //         if (error.success === false) {
  //           CustomToast(error?.message, "error");
  //         }
  //       });
  //   }
  // };

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

  const handleOnIssueSort = (sortMethod: string) => {
  
    switch (sortMethod) {
      case "Last Updated":
        setIssueList(
          issuesList.sort((a, b) => {
            if (a.dueDate > b.dueDate) {
              return 1;
            } else if (b.dueDate > a.dueDate) {
              return -1;
            }
            return 0;
          })
        );
        break;
      case "First Updated":
        setIssueList(
          issuesList.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) {
              return -1;
            } else if (b.updatedAt > a.updatedAt) {
              return 1;
            }
            return 0;
          })
        );
      case "Asc DueDate":
        setIssueList([
          ...issuesList.sort((a: any, b: any) => {
            return (
              new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf()
            );
          }),
        ]);
        break;
      case "Dsc DueDate":
        setIssueList([
          ...issuesList.sort((a: any, b: any) => {
            return (
              new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf()
            );
          }),
        ]);
        break;
      case "Asc Priority":
        setIssueList([
          ...issuesList.sort((a: any, b: any) =>
            a.priority
              .trim()
              .toLowerCase()
              .localeCompare(b.priority.trim().toLowerCase())
          ),
        ]);
        break;
      case "Dsc Priority":
        setIssueList([
          ...issuesList.sort((a: any, b: any) =>
            b.priority
              .trim()
              .toLowerCase()
              .localeCompare(a.priority.trim().toLowerCase())
          ),
        ]);
        break;
      case "status_asc":
        setIssueList([
          ...issuesList.sort((a: any, b: any) =>
            a.status
              .trim()
              .toLowerCase()
              .localeCompare(b.status.trim().toLowerCase())
          ),
        ]);

        break;
      case "status_desc":
        setIssueList([
          ...issuesList.sort((a: any, b: any) =>
            b.status
              .trim()
              .toLowerCase()
              .localeCompare(a.status.trim().toLowerCase())
          ),
        ]);

        break;
      default:
        break;
    }
  };

  const handleOnTasksSort = (sortMethod: string) => {
    
    switch (sortMethod) {
      case "Last Updated":
        setIssueList(
          issuesList.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) {
              return 1;
            } else if (b.updatedAt > a.updatedAt) {
              return -1;
            }
            return 0;
          })
        );
        break;
      case "First Updated":
        setIssueList(
          issuesList.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) {
              return -1;
            } else if (b.updatedAt > a.updatedAt) {
              return 1;
            }
            return 0;
          })
        );
      case "Asc DueDate":
        setTasksList([
          ...tasksList.sort((a: any, b: any) => {
            return (
              new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf()
            );
          }),
        ]);
        break;
      case "Dsc DueDate":
        setTasksList([
          ...tasksList.sort((a: any, b: any) => {
            return (
              new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf()
            );
          }),
        ]);
        break;
      case "Asc Priority":
        setTasksList([
          ...tasksList.sort((a: any, b: any) =>
            a.priority
              .trim()
              .toLowerCase()
              .localeCompare(b.priority.trim().toLowerCase())
          ),
        ]);
        break;
      case "Dsc Priority":
        setTasksList([
          ...tasksList.sort((a: any, b: any) =>
            b.priority
              .trim()
              .toLowerCase()
              .localeCompare(a.priority.trim().toLowerCase())
          ),
        ]);
        break;
      case "status_asc":
        setTasksList([
          ...tasksList.sort((a: any, b: any) =>
            a.status
              .trim()
              .toLowerCase()
              .localeCompare(b.status.trim().toLowerCase())
          ),
        ]);

        break;
      case "status_desc":
        setTasksList([
          ...tasksList.sort((a: any, b: any) =>
            b.status
              .trim()
              .toLowerCase()
              .localeCompare(a.status.trim().toLowerCase())
          ),
        ]);

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
    setIssueList(result);
    setIssueFilterState({
      isFilterApplied: true,
      filterData: formData,
      numberOfFilters: count,
    });
  };
  const closeFilterOverlay = () => {
    setIssueList(issueFilterList);
    setIssueFilterState({
      isFilterApplied: false,
      filterData: {},
      numberOfFilters: 0,
    });
  };

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
          ) ||
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
    setTasksList(result);
    setTaskFilterState({
      isFilterApplied: true,
      filterData: formData,
      numberOfFilters: count,
    });
  };

  const closeTaskFilterOverlay = () => {
    setTasksList(taskFilterList);
    setTaskFilterState({
      isFilterApplied: false,
      filterData: {},
      numberOfFilters: 0,
    });
  };
  const deleteTheIssue = (issueObj: any, callback?: any) => {
    deleteIssue(router.query.projectId as string, issueObj._id)
      .then((response: any) => {
        if (response.success === true) {
          CustomToast(response.message, "success");
          _.remove(issueFilterList, { _id: issueObj._id });
          setIssueList(issueFilterList);
          if (callback && response.message !== "Failed to delete Issue") {
            callback();
          }
          const issueMenuInstance: ITools = {
            toolName: "issue",
            toolAction: "issueRemoved",
          };

          //toolClicked(issueMenuInstance);
        }
      })
      .catch((error: any) => {
        if (!error.success && error.message === "Forbidden Access") {
          CustomToast("You do not have access,Contact Admin", "error");
        } else {
          CustomToast("Task could not be deleted", "error");
        }
      });
  };

  const deleteTheTask = (taskObj: any, callback?: any) => {
    deleteTask(router.query.projectId as string, taskObj._id)
      .then((response: any) => {
        if (response.success === true) {
          CustomToast(response.message, "success");
          _.remove(taskFilterList, { _id: taskObj._id });
          setTasksList(taskFilterList);
          if (callback && response.message !== "Failed to delete Issue") {
            callback();
          }
          const taskMenuInstance: ITools = {
            toolName: "task",
            toolAction: "taskRemoved",
          };

          //toolClicked(taskMenuInstance);
        }
      })
      .catch((error: any) => {
        if (!error.success && error.message === "Forbidden Access") {
          CustomToast("You do not have access,Contact Admin", "error");
        } else {
          CustomToast("Task could not be deleted", "error");
        }
      });
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
  const deleteTheAttachment = (attachmentId: string, entity?: string) => {
    deleteAttachment(attachmentId)
      .then((response: any) => {
        if (response.success === true) {
          CustomToast(response.message, "success");
          if (entity === "issue") {
            issueFilterList.map((issueObj) => {
              const index = issueObj.attachments.findIndex(
                (obj: any) => obj._id === attachmentId
              );
              issueObj.attachments.splice(index, 1);
            });
            setIssueList(issueFilterList);
          } else {
            taskFilterList.map((taskObj) => {
              const index = taskObj.attachments.findIndex(
                (obj: any) => obj._id === attachmentId
              );
              taskObj.attachments.splice(index, 1);
            });
            setTasksList(taskFilterList);
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
          setStateFilter([...response.data.result]);
          // if (selector.length < 1) setSelector(response.data.result[0]._id);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [router.isReady, router.query.projectId, router.query.structId]);


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
    if (router.query.iss != null) {
      let sel_iss: Issue | undefined = issuesList.find((t) => t._id === router.query.iss)
      if (sel_iss) {
        // setClickedTool({ toolAction: 'issueSelect', toolName: 'issue', response: sel_iss });
        setCurrentContext({ ...sel_iss?.context, id: router.query.iss as string });
        setOpenIssueDetails(true);
      }

    }

  }, [issuesList, router.query.iss, router.query.snap]);

  useEffect(() => {
    if (router.query.tsk != null) {
      let sel_tsk: ITasks | undefined = tasksList.find((t) => t._id === router.query.tsk)
      if (sel_tsk) {
        // setClickedTool({ toolAction: 'taskSelect', toolName: 'task', response: sel_tsk });
        setCurrentContext({ ...sel_tsk?.context, id: router.query.tsk as string });
        setOpenTaskDetails(true);
      }

    }

  }, [tasksList, router.query.tsk, router.query.snap]);
  useEffect(() => {


    getGenViewerData(router.query.projectId as string, router.query.structureId as string)
      .then((response) => {
        if (response.success === true) {
          setInintData(response.result);

        }
      })
      .catch((error) => {
        console.log("Error in loading data: 1 ", error);
        // CustomToast("failed to load data","error");
      });

  }, [router.query.structId])
  
  const appEventsCB:OnMessageCallbak = (msg:Buffer,packet:any):void=>{
  
    console.log("callback data",JSON.parse(msg.toString()))
  }
  
  useEffect(()=>{
    conn.subscribeTopic(MqttConnector.getMultiverseRecTopicString(),appEventsCB)
    return()=>{
      conn.unSubscribeTopic(MqttConnector.getMultiverseRecTopicString());
    }
  },[])

  useEffect(()=>{
    if (initData) {
      let pdata: IGenData = initData
      if (pdata) {
    
          pdata.currentViewType = "Plan Drawings"
        
      }
     if(router.isReady){
      setTimeout(()=>{
        conn?.publishMessage(MqttConnector.getMultiverseSendTopicString(), `{"type":"setGenData","data":${JSON.stringify(pdata)}}`)
      },8000)
      
      
     }
    

    }
   
    // setGenData(currentViewType)
   
    
  },[conn,structure,initData])

  return (
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
              className={`fixed drop-shadow toolbarWidth  ${"visible"} `}
            >
              {isDesignAvailable || isRealityAvailable ?
                <ToolBarMenuWrapper 
                initData={initData}
                toolClicked={toolClicked}
                toolUpdate= {toolUpdate}
                ></ToolBarMenuWrapper>
                
              :<></>}
            </div></div></div>

        <div className="ml-10 mt-9">
          {structure&&<Iframe
            structureData={structure}
            ></Iframe>}
        </div>

      </div>
    </div>
  );
};
export default Index;
