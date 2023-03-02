import { styled } from "@mui/system";
import { AxiosResponse } from "axios";
import { getCookie } from "cookies-next";
import _ from "lodash";
import Moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import GenericViewer from "../../../../components/container/GenericViewer";
import LeftOverLay from "../../../../components/container/leftOverLay";
import MapLoading from "../../../../components/container/mapLoading";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import ToolBarMenuWrapper from "../../../../components/divami_components/toolbar/ToolBarMenuWrapper";
import { IDesignMap } from "../../../../models/IDesign";
import { IProjects } from "../../../../models/IProjects";
import { IActiveRealityMap } from "../../../../models/IReality";
import { ISnapshot } from "../../../../models/ISnapshot";
import { Issue } from "../../../../models/Issue";
import { ChildrenEntity, IStructure } from "../../../../models/IStructure";
import { ITasks } from "../../../../models/Itask";
import { IToolResponse, ITools } from "../../../../models/ITools";
import ChevronLeftIcon from "../../../../public/divami_icons/chevronLeft.svg";
import ChevronRightIcon from "../../../../public/divami_icons/chevronRight.svg";
import { deleteAttachment } from "../../../../services/attachments";
import authHeader from "../../../../services/auth-header";
import {
  deleteIssue,
  editIssue,
  getIssuesList,
  getIssuesPriority,
  getIssuesStatus,
  getIssuesTypes,
} from "../../../../services/issue";
import { getProjectDetails } from "../../../../services/project";
import {
  getStructureHierarchy,
  getStructureList,
} from "../../../../services/structure";
import {
  deleteTask,
  getTasksList,
  getTasksPriority,
  getTaskStatus,
} from "../../../../services/task";

interface IProps {}
const OpenMenuButton = styled("div")({
  position: "fixed",
  border: "1px solid #C4C4C4",
  height: "32px",
  width: "107px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  alignItems: "center",
  transform: "rotate(270deg)",
  left: "22px",
  bottom: "38px",
  cursor: "pointer",
  background: "#ffffff",
  fontFamily: "Open Sans",
});
const CloseMenuButton = styled("div")({
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
});
const Index: React.FC<IProps> = () => {
  const router = useRouter();
  const [currentViewMode, setViewMode] = useState("Design"); //Design/ Reality
  const [currentProjectId, setActiveProjectId] = useState("");
  const [structuresList, setStructuresList] = useState<IStructure[]>([]);
  const [project, setProject] = useState<IProjects>();
  const [structure, setStructure] = useState<IStructure>();
  const [snapshot, setSnapshot] = useState<ISnapshot>();
  const [designMap, setDesignMap] = useState<IDesignMap>();
  const [activeRealityMap, setActiveRealityMap] = useState<IActiveRealityMap>();
  const [projectutm, setProjectUtm] = useState("");
  const leftOverlayRef: any = useRef();
  const [leftNav, setLeftNav] = useState(false);
  const rightOverlayRef: any = useRef();
  const leftRefContainer: any = useRef();
  const rightrefContainer: any = useRef();
  const [viewerTypeState, setViewerType] = useState("forge");
  const [rightNav, setRightNav] = useState(false);
  const [currentViewType, setViewType] = useState(""); //plan,elevational,xsectional,bim
  const [currentViewLayers, setViewLayers] = useState<string[]>([]); //360Image, 360Video, phoneImage, droneImage
  const [clickedTool, setClickedTool] = useState<ITools>();
  const [loggedInUserId, SetLoggedInUserId] = useState("");
  const [issuesList, setIssueList] = useState<Issue[]>([]);
  const [tasksList, setTasksList] = useState<ITasks[]>([]);
  const [issuePriorityList, setIssuePriorityList] = useState<[string]>([""]);
  const [tasksPriotityList, setTasksPriorityList] = useState<[string]>([""]);
  const [issueStatusList, setIssueStatusList] = useState<[string]>([""]);
  const [tasksStatusList, setTasksStatusList] = useState<[string]>([""]);
  const [issueTypesList, setIssueTypesList] = useState<[string]>([""]);

  const [issueFilterList, setIssueFilterList] = useState<Issue[]>([]);
  const [taskFilterList, setTaskFilterList] = useState<ITasks[]>([]);
  const [openCreateIssue, setOpenCreateIssue] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openIssueView, setOpenIssueView] = useState(false);
  const [currentContext, setCurrentContext] = useState<IToolResponse>({
    type: "Task",
  });
  const [hierarchy, setHierarchy] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [openIssueDetails, setOpenIssueDetails] = useState(false);
  const [openTaskDetails, setOpenTaskDetails] = useState(false);
  const [breadCrumbsData, setBreadCrumbsData] = useState<any>([]);

  useEffect(() => {
    setBreadCrumbsData((prev: any) => prev.splice(0, 1, project));
  }, [project]);

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
  };
  const issueSubmit = (formdata: Issue) => {
    issuesList.push(formdata);
    setIssueList(structuredClone(issuesList));
    // let myTool : ITools ={toolName:'issue',toolAction:'issueCreated'};
    // toolClicked(myTool);
    closeIssueCreate();
  };

  const closeTaskCreate = () => {
    setOpenCreateTask(false);
  };
  const closeIssueList = () => {
    setOpenIssueView(false);
  };

  const closeTaskDetails = () => {
    setOpenTaskDetails(false);
  };
  const closeIssueDetails = () => {
    setOpenIssueDetails(false);
  };

  const taskSubmit = (formdata: any) => {
    tasksList.push(formdata);
    let myTool: ITools = { toolName: "task", toolAction: "taskCreated" };
    setTasksList(structuredClone(tasksList));
    // toolClicked(myTool);
    closeTaskCreate();
  };

  useEffect(() => {
    if (router.isReady && router.query?.projectId) {
      getIssuesPriority(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setIssuePriorityList(response.result);
          }
        })
        .catch((error) => {
          toast.error("failed to load data");
        });

      getTasksPriority(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setTasksPriorityList(response.result);
          }
        })
        .catch((error) => {
          toast.error("failed to load data");
        });

      getIssuesStatus(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setIssueStatusList(response.result);
          }
        })
        .catch((error) => {
          toast.error("failed to load data");
        });
      getTaskStatus(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setTasksStatusList(response.result);
          }
        })
        .catch((error) => {
          toast.error("failed to load data");
        });
      getIssuesTypes(router.query.projectId as string)
        .then((response) => {
          if (response.success === true) {
            setIssueTypesList(response.result);
          }
        })
        .catch((error) => {
          toast.error("failed to load data");
        });
      getProjectDetails(router.query.projectId as string)
        .then((response) => {
          setProjectUtm(response?.data?.result?.utm);
          setActiveProjectId(router.query.projectId as string);
          setProject(response.data.result);
        })
        .catch((error) => {
          toast.error("failed to load data");
        });
      getStructureList(router.query.projectId as string)
        .then((response) => {
          setStructuresList(response.data.result);

          if (response.data.result.length > 0) {
            if (router.query.structId !== undefined) {
              let structs: IStructure[] = response.data.result;
              setStructure(
                structs.find((e) => {
                  console.log("finding structure: ", e._id);
                  if (e._id === router.query.structId) {
                    return e;
                  }
                })
              );
            } else {
              let index = response.data.result.findIndex(
                (structData: IStructure) => {
                  return (
                    structData.designs !== undefined &&
                    structData.designs.length > 0
                  );
                }
              );
              if (index > 0) setStructure(response.data.result[index]);
              else setStructure(response.data.result[0]);
              //console.log("first struct=",index);
            }
          }
        })
        .catch((error) => {
          toast.error("failed to load data");
        });
      const userObj: any = getCookie("user");
      let user = null;
      if (userObj) user = JSON.parse(userObj);
      if (user?._id) {
        SetLoggedInUserId(user._id);
      }
      if (window.localStorage.getItem("nodeData")) {
        let nodeData = JSON.parse(
          window.localStorage.getItem("nodeData") || ""
        );
        if (nodeData) {
          getStructureData(nodeData);
          setExpanded(
            JSON.parse(window.localStorage.getItem("expandedNodes") || "") || []
          );
          setSelected(nodeData?._id || "");
        }
      }

      const handler = document.addEventListener("click", closeStructurePage);
      return () => {
        document.removeEventListener("click", closeStructurePage);
      };
    }
  }, [router.isReady, router.query.projectId]);

  const getNodeDataById = (id: string) => {
    return structuresList.find((e) => {
      if (e._id === id) {
        return e;
      }
    });
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
    getIssues(structure._id);
    getTasks(structure._id);
    setBreadCrumbsData((prev: any) => [
      prev[0],
      ...getBreadCrumbsData(structure),
    ]);
  };

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
      case "potree":
        return <MapLoading></MapLoading>;

      case "forge":
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
      case "map":
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
    let newLayers = _.cloneDeep(currentViewLayers);
    switch (toolInstance.toolName) {
      case "viewType":
        setViewType(toolInstance.toolAction);
        //setClickedTool(toolInstance);
        break;
      case "viewMode":
        setViewMode(toolInstance.toolAction);
        break;
      case "issue":
        switch (toolInstance.toolAction) {
          case "issueView":
            //console.log('trying to open issue View');
            setOpenIssueView(true);
            break;
          case "issueCreate":
          //setOpenCreateIssue(true);
          case "issueCreateSuccess":
          case "issueCreateFail":
          case "issueSelect":
          case "issueShow":
          case "issueHide":
          case "issueRemoved":
            setClickedTool(toolInstance);
            break;
        }
        break;
      case "progress":
        switch (toolInstance.toolAction) {
          case "progressView":
            //todo
            break;
          case "progressCreate":
          case "progressShow":
          case "progressHide":
            setClickedTool(toolInstance);
            break;
        }
        break;
      case "task":
        switch (toolInstance.toolAction) {
          case "taskView":
            //todo
            break;
          case "taskCreate":
          case "taskCreateSuccess":
          case "taskCreateFail":
          case "taskShow":
          case "taskHide":
          case "taskSelect":
          case "taskRemoved":
            setClickedTool(toolInstance);
            break;
        }

        break;
      case "addViewLayer":
        newLayers.push(toolInstance.toolAction);
        setViewLayers(newLayers);
        break;
      case "removeViewLayer":
        newLayers.splice(newLayers.indexOf(toolInstance.toolAction), 1);
        setViewLayers(newLayers);
        break;
      case "compareReality":
      case "compareDesign":
        setClickedTool(toolInstance);
        break;
      default:
        break;
    }
  };

  const toolResponse = (data: ITools) => {
    switch (data.toolName) {
      case "viewMode":
        setViewMode(data.toolAction);
        break;
      case "viewType":
        setViewType(data.toolAction);
      case "Issue":
        if (data.toolAction === "createIssue") {
          //   html2canvas(document.getElementById('TheView')||document.body).then(function(canvas) {
          //     //window.open('','_blank')?.document.body.appendChild(canvas);
          //     //canvas.toDataURL('image/png');

          // });
          if (data.response != undefined) setCurrentContext(data.response);
          setOpenCreateIssue(true);
        } else if (data.toolAction === "selectIssue") {
          // issue detail view open logic comes here
          if (data.response != undefined) {
            setCurrentContext(data.response);
            setOpenIssueDetails(true);
          }
        }
        break;
      case "Task":
        if (data.toolAction === "createTask") {
          if (data.response != undefined) setCurrentContext(data.response);
          setOpenCreateTask(true);
        } else if (data.toolAction === "selectTask") {
          // task detail view open logic comes here
          if (data.response != undefined) {
            setCurrentContext(data.response);
            setOpenTaskDetails(true);
          }
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
      case "Last Updated":
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
      case "First Updated":
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
      case "Asc DueDate":
        setIssueFilterList(issuesList);
        setIssueFilterList(
          issueFilterList.sort((a: any, b: any) => {
            return (
              new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf()
            );
          })
        );
        setIssueList(issueFilterList);
        break;
      case "Dsc DueDate":
        setIssueFilterList(issuesList);
        setIssueFilterList(
          issueFilterList.sort((a: any, b: any) => {
            return (
              new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf()
            );
          })
        );
        setIssueList(issueFilterList);
        break;
      case "Asc Priority":
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
      case "Dsc Priority":
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
      case "status_asc":
        setIssueFilterList(issuesList);
        setIssueFilterList(
          issueFilterList.sort((a, b) => {
            if (
              issueStatusList?.indexOf(a.priority) >
              issueStatusList?.indexOf(b.priority)
            ) {
              return -1;
            } else if (
              issueStatusList?.indexOf(b.priority) >
              issueStatusList?.indexOf(a.priority)
            ) {
              return 1;
            }
            return 0;
          })
        );
        setIssueList(issueFilterList);
        break;
      case "status_desc":
        setIssueFilterList(issuesList);
        setIssueFilterList(
          issueFilterList.sort((b, a) => {
            if (
              issueStatusList?.indexOf(a.priority) >
              issueStatusList?.indexOf(b.priority)
            ) {
              return -1;
            } else if (
              issueStatusList?.indexOf(b.priority) >
              issueStatusList?.indexOf(a.priority)
            ) {
              return 1;
            }
            return 0;
          })
        );
        setIssueList(issueFilterList);
        break;
      default:
        console.log("Not Sorted");
        break;
    }
  };

  const handleOnTasksSort = (sortMethod: string) => {
    switch (sortMethod) {
      case "Last Updated":
        setTaskFilterList(tasksList);
        setTaskFilterList(
          taskFilterList.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) {
              return 1;
            } else if (b.updatedAt > a.updatedAt) {
              return -1;
            }
            return 0;
          })
        );
        setTasksList(taskFilterList);
        break;
      case "First Updated":
        setTaskFilterList(tasksList);
        setTaskFilterList(
          taskFilterList.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) {
              return -1;
            } else if (b.updatedAt > a.updatedAt) {
              return 1;
            }
            return 0;
          })
        );
        setTasksList(taskFilterList);
        break;
      case "Asc DueDate":
        setTaskFilterList(tasksList);
        setTaskFilterList(
          taskFilterList.sort((a: any, b: any) => {
            return (
              new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf()
            );
          })
        );
        setTasksList(taskFilterList);
        break;
      case "Dsc DueDate":
        setTaskFilterList(tasksList);
        setTaskFilterList(
          taskFilterList.sort((a: any, b: any) => {
            return (
              new Date(b.dueDate).valueOf() - new Date(a.dueDate).valueOf()
            );
          })
        );
        setTasksList(taskFilterList);
        break;
      case "Asc Priority":
        setTaskFilterList(tasksList);
        setTaskFilterList(
          taskFilterList.sort((a, b) => {
            if (
              tasksPriotityList?.indexOf(a.priority) >
              tasksPriotityList?.indexOf(b.priority)
            ) {
              return 1;
            } else if (
              tasksPriotityList?.indexOf(b.priority) >
              tasksPriotityList?.indexOf(a.priority)
            ) {
              return -1;
            }
            return 0;
          })
        );
        setTasksList(taskFilterList);
        break;
      case "Dsc Priority":
        setTaskFilterList(tasksList);
        setTaskFilterList(
          taskFilterList.sort((a, b) => {
            if (
              tasksPriotityList?.indexOf(a.priority) >
              tasksPriotityList?.indexOf(b.priority)
            ) {
              return -1;
            } else if (
              tasksPriotityList?.indexOf(b.priority) >
              tasksPriotityList?.indexOf(a.priority)
            ) {
              return 1;
            }
            return 0;
          })
        );
        setTasksList(taskFilterList);
        break;
      case "status_desc":
        setIssueFilterList(issuesList);
        setTaskFilterList(
          taskFilterList.sort((a, b) => {
            if (
              issueStatusList?.indexOf(a.status) >
              issueStatusList?.indexOf(b.status)
            ) {
              return -1;
            } else if (
              issueStatusList?.indexOf(b.status) >
              issueStatusList?.indexOf(a.status)
            ) {
              return 1;
            }
            return 0;
          })
        );
        // setTaskFilterList(statusDescList);
        setTasksList(taskFilterList);
        break;
      case "status_asc":
        // setIssueFilterList(issuesList);
        setTaskFilterList(
          taskFilterList.sort((a, b) => {
            if (
              issueStatusList?.indexOf(a.status) >
              issueStatusList?.indexOf(b.status)
            ) {
              return 1;
            } else if (
              issueStatusList?.indexOf(b.status) >
              issueStatusList?.indexOf(a.status)
            ) {
              return -1;
            }
            return 0;
          })
        );
        // setTaskFilterList(statusAscList);
        setTasksList(taskFilterList);
        break;
      default:
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
        (item.assignees.filter(
          (userInfo: any) => userInfo._id === formData.assigneesData?.user?._id
        ) ||
          formData?.assigneesData?.length == 0 ||
          !formData?.assigneesData) &&
        (Moment(item.dueDate).format("YYYY-MM-DD") >= formData.fromDate ||
          !formData.fromDate) &&
        (Moment(item.dueDate).format("YYYY-MM-DD") <= formData.toDate ||
          !formData.toDate)
    );
    let count =
      formData?.issueTypeData?.length +
      formData?.issuePriorityData?.length +
      formData?.issueStatusData?.length;
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
  // const handleOnTaskFilter = (formData: any) => {
  //   console.log(formData, "taskfilterdata");
  //   console.log(taskFilterList);
  //   const result = taskFilterList.filter(
  //     (item: ITasks) =>
  //       formData.taskType.includes(item.type) &&
  //       formData?.taskPriority?.includes(item.priority) &&
  //       formData?.taskStatus?.includes(item.status) &&
  //       // (Moment(item.dueDate).format("YYYY-MM-DD") >= formData.fromDate ||
  //       //   formData.fromDate == "") &&
  //       // (Moment(item.dueDate).format("YYYY-MM-DD") <= formData.toDate ||
  //       //   formData.toDate == "") &&
  //       item.assignees.filter(
  //         (userInfo: any) => userInfo._id === formData.assigneesData?.user?._id
  //       )
  //   );
  //   setTasksList(result);
  //   setTaskFilterState({
  //     isFilterApplied: true,
  //     filterData: formData,
  //   });
  // };

  const handleOnTaskFilter = (formData: any) => {
    const result = taskFilterList.filter(
      (item) =>
        (formData.taskType.includes(item.type) ||
          formData.taskType.length == 0) &&
        (formData?.taskPriority?.includes(item.priority) ||
          formData?.taskPriority?.length == 0) &&
        (formData?.taskStatus?.includes(item.status) ||
          formData?.taskStatus.length == 0) &&
        (item.assignees.filter(
          (userInfo: any) => userInfo._id === formData.assigneesData?.user?._id
        ) ||
          formData?.assigneesData?.length == 0 ||
          !formData?.assigneesData)
      // &&
      // (Moment(item.dueDate).format("YYYY-MM-DD") >= formData.fromDate ||
      //   !formData.fromDate) &&
      // (Moment(item.dueDate).format("YYYY-MM-DD") <= formData.toDate ||
      //   !formData.toDate)
    );
    let count =
      formData?.taskType?.length +
      formData?.taskPriority?.length +
      formData?.taskStatus?.length;
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
      .then((response) => {
        if (response.success === true) {
          toast.success(response.message);
          _.remove(issueFilterList, { _id: issueObj._id });
          setIssueList(issueFilterList);
          if (callback) {
            callback();
          }
          const issueMenuInstance: ITools = {
            toolName: "issue",
            toolAction: "issueRemoved",
          };

          toolClicked(issueMenuInstance);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const deleteTheTask = (taskObj: any, callback?: any) => {
    deleteTask(router.query.projectId as string, taskObj._id)
      .then((response) => {
        if (response.success === true) {
          toast.success(response.message);
          _.remove(taskFilterList, { _id: taskObj._id });
          setTasksList(taskFilterList);
          if (callback) {
            callback();
          }
          const taskMenuInstance: ITools = {
            toolName: "task",
            toolAction: "taskRemoved",
          };

          toolClicked(taskMenuInstance);
        }
      })
      .catch((error) => {
        console.log("error", error);
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
          toast.success("issue information updated successfully");
          const index = issueFilterList.findIndex(
            (obj: Issue) => obj._id === response.result._id
          );
          issueFilterList.splice(index, 1, response.result);
          setIssueList(issueFilterList);
        }
      })
      .catch((error) => {
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
      .then((response) => {
        if (response.success === true) {
          toast.success(response.message);
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
      .catch((error) => {
        toast.error(error.message);
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
      if (router.query.structId !== undefined)
        setSelector(router.query.structId.toString());
      getStructureHierarchy(router.query.projectId as string)
        .then((response: AxiosResponse<any>) => {
          setState([...response.data.result]);
          setStateFilter([...response.data.result]);
          if (selector.length < 1) setSelector(response.data.result[0]._id);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [router.isReady, router.query.projectId, router.query.structId]);

  return (
    <div className=" w-full  h-full">
      <div className="w-full">
        <Header
          toolClicked={toolClicked}
          viewMode={currentViewMode}
          showBreadcrumbs
          breadCrumbData={breadCrumbsData}
          handleBreadCrumbClick={handleBreadCrumbClick}
        />
        {/* <Header breadCrumb={getBreadCrumbs()}></Header> */}
      </div>
      <div className="flex ">
        <div ref={leftOverlayRef}>
          {/* <CollapsableMenu onChangeData={onChangeData}></CollapsableMenu> */}
          <SidePanelMenu onChangeData={onChangeData} />
        </div>
        <div>
          {
            <div
              style={{ overflow: "hidden" }}
              ref={leftRefContainer}
              className={` ${
                leftNav ? "visible" : "hidden"
              }  absolute z-10 border border-gray-300 `}
            >
              {/* <div>
                <>
                  {console.log(selected, "structureData")}
                  <LeftOverLay
                    getStructureData={getStructureData}
                    handleNodeSelection={handleNodeSelection}
                    handleNodeExpand={handleNodeExpand}
                    selectedNodes={selected}
                    expandedNodes={expanded}
                    setHierarchy={setHierarchy}
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
                </>
              </div> */}
            </div>
          }
        </div>
        <div id="viewer">{renderSwitch(viewerTypeState)}</div>
        {hierarchy ? (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #BDBDBD",
              boxShadow: "5px 4px 8px rgb(200 200 200 / 10%)",
              // transform: "matrix(-1, 0, 0, 1, 0, 0)",
            }}
          >
            <CloseMenuButton>
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
                  style={{ overflow: "hidden" }}
                  ref={leftRefContainer}
                  className={`${
                    hierarchy ? "visible" : "hidden"
                  }  absolute z-10 border  white-bg projHier `}
                >
                  <div>
                    <LeftOverLay
                      handleNodeSelection={handleNodeSelection}
                      selectedNodes={selected}
                      handleNodeExpand={handleNodeExpand}
                      expandedNodes={expanded}
                      getStructureData={getStructureData}
                      setHierarchy={setHierarchy}
                      getStructure={(structureData) => {
                        if (structure === undefined) {
                          setStructure(
                            getCurrentStructureFromStructureList(structureData)
                          );
                          getIssues(structureData._id);
                          getTasks(structureData._id);
                        }
                      }}
                      treeData={state}
                    ></LeftOverLay>
                  </div>
                </div>
              }
            </div>
          </div>
        ) : (
          <div>
            {
              <OpenMenuButton
                onClick={() => {
                  setHierarchy(!hierarchy);
                }}
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
            }
          </div>
        )}
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
        {/* {structure && snapshot && designMap && activeRealityMap && ( */}
        <div ref={rightrefContainer}>
          {/* <FontAwesomeIcon
            className={`fixed  ${rightNav && "rotate-180"
              } text-lg text-blue-300  ${rightNav ? "right-9" : "right-0"
              }  top-46  cursor-pointer border rounded  p-1 bg-gray-400 z-10 text-white`}
            onClick={rightNavCollapse}
            icon={faLessThan}
          ></FontAwesomeIcon> */}
          {/* <div className="toolbarcontainer"> */}
          <div
            ref={rightOverlayRef}
            id="bg-color"
            className={`fixed  toolbarWidth  ${"visible"} `}
          >
            <ToolBarMenuWrapper
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
              closeFilterOverlay={closeFilterOverlay}
              closeTaskFilterOverlay={closeTaskFilterOverlay}
              handleOnTaskFilter={handleOnTaskFilter}
              contextInfo={currentContext}
              openCreateIssue={openCreateIssue}
              openCreateTask={openCreateTask}
              selectedLayersList={currentViewLayers}
              deleteTheTask={deleteTheTask}
              issuePriorityList={issuePriorityList}
              issueStatusList={issueStatusList}
              issueTypesList={issueTypesList}
              taskFilterState={taskFilterState}
              issueFilterState={issueFilterState}
              closeIssueCreate={closeIssueCreate}
              closeTaskCreate={closeTaskCreate}
              deleteTheIssue={deleteTheIssue}
              openIssueDetails={openIssueDetails}
              openTaskDetails={openTaskDetails}
              closeTaskDetails={closeTaskDetails}
              closeIssueDetails={closeIssueDetails}
              setIssueList={setIssueList}
              getIssues={getIssues}
              getTasks={getTasks}
              handleOnIssueSort={handleOnIssueSort}
              handleOnTasksSort={handleOnTasksSort}
              issueSubmit={issueSubmit}
              taskSubmit={taskSubmit}
              selectedType={currentViewType}
              deleteTheAttachment={deleteTheAttachment}
            />

            {/* <CustomToaster /> */}
            {/* </div> */}
            {/* <RightFloatingMenu
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
              ></IssueList> */}
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};
export default Index;
