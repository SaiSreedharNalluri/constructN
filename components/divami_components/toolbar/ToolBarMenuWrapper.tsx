import React, { useEffect, useRef, useState } from "react";
import Typebar from "./Typebar";
import Layers from "./Layers";
import Issues from "./Issues";
import Task from "./Task";
import { IDesignMap } from "../../../models/IDesign";
import { IActiveRealityMap } from "../../../models/IReality";
import { ISnapshot } from "../../../models/ISnapshot";
import { IStructure } from "../../../models/IStructure";
import { IToolResponse, ITools } from "../../../models/ITools";
import { SectionToolBar, ToolbarContainer } from "./ToolBarStyles";
import { Issue } from "../../../models/Issue";
import { ITasks } from "../../../models/Itask";
import CompareView from "./CompareView";

interface IProps {
  toolClicked: (a: ITools) => void;
  viewMode: string;
  viewTypes?: string[];
  viewLayers?: string[];
  issuesList: Issue[];
  tasksList: ITasks[];
  handleOnFilter: (formData: object) => void;
  currentStructure: IStructure;
  currentSnapshot: ISnapshot;
  currentProject: string;
  currentLayersList: IActiveRealityMap;
  currentTypesList: IDesignMap;
  closeFilterOverlay: () => void;
  handleOnTaskFilter: (formData: object) => void;
  closeTaskFilterOverlay: () => void;
  contextInfo: IToolResponse;
  openCreateIssue: boolean;
  selectedLayersList: string[];
  openCreateTask?: any;
  issuePriorityList?: any;
  issueStatusList?: any;
  issueTypesList?: any;
  taskFilterState?: any;
  issueFilterState?: any;
  setIssueFilterState?: any;
  deleteTheIssue?: any;
  deleteTheAttachment?: any;
}

const ToolBarMenuWrapper: React.FC<any> = ({
  toolClicked,
  viewLayers,
  viewMode,
  viewTypes,
  issuesList,
  tasksList,
  setTasksList,
  handleOnFilter,
  currentProject,
  currentSnapshot,
  currentStructure,
  currentLayersList,
  currentTypesList,
  closeFilterOverlay,
  closeTaskFilterOverlay,
  handleOnTaskFilter,
  contextInfo,
  openCreateIssue,
  openCreateTask,
  selectedLayersList,
  deleteTheTask,
  issuePriorityList,
  issueStatusList,
  issueTypesList,
  taskFilterState,
  issueFilterState,
  closeIssueCreate,
  closeTaskCreate,
  deleteTheIssue,
  openIssueDetails,
  openTaskDetails,
  closeTaskDetails,
  closeIssueDetails,
  setIssueList,
  getIssues,
  getTasks,
  handleOnIssueSort,
  handleOnTasksSort,
  issueSubmit,
  taskSubmit,
  selectedType,
  deleteTheAttachment,
  designMap,
  setActiveRealityMap,
  setLayersUpdated,
  layersUpdated,
  setViewType,
  projectUsers,
  taskPriorityList,
  taskStatusList,
  setIssueFilterState,
  issueLoader,
  setIssueLoader,
  setShowIssueMarkups,
  showIssueMarkups,
  setShowTaskMarkups,
  showTaskMarkups,
}) => {
  const [rightNav, setRighttNav] = useState(false);
  const [isCompareDesign, setIsCompareDesign] = useState(false);
  const [isCompareReality, setIsCompareReality] = useState(false);
  const [iViewMode, setIViewMode] = useState(viewMode);
  const rightOverlayRef: any = useRef();
  const rightOverlayRefs: any = useRef();
  const [active, setActive] = useState("hideCompare");
  const [myProject, setMyProject] = useState(currentProject);
  const [selectedTypeVal, setSelectedTypeVal] = useState(selectedType);
  const [selectedLayer, setSelectedLayer] = useState("");
  const [openSelectTypes, setOpenSelectTypes] = useState(false);
  const [openSelectLayer, setOpenSelectLayer] = useState(false);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  // var typesL:string[] = currentTypesList as string[];

  const [myTypesList, setMyTypesList] = useState<string[]>(currentTypesList);
  const [myLayersList, setMyLayersList] =
    useState<IActiveRealityMap>(currentLayersList);
  let toolInstance: ITools = { toolName: "", toolAction: "" };
  useEffect(() => {
    setIViewMode(viewMode);
  }, [viewMode]);
  useEffect(() => {
    switch (currentTypesList.constructor.name) {
      case "Array":
        setMyTypesList(
          currentTypesList.map((typeData: string) => {
            switch (typeData) {
              case "pointCloud":
                return "Reality";
              case "orthoPhoto":
                return "Map";
              default:
                return typeData;
            }
          })
        );
        break;
    }
  }, [currentTypesList]);
  useEffect(() => {
    switch (selectedType) {
      case "pointCloud":
        setSelectedTypeVal("Reality");
        break;
      case "orthoPhoto":
        setSelectedTypeVal("Map");
        break;
      default:
        setSelectedTypeVal(selectedType);
    }
  }, [selectedType]);
  const typeChange = (changeOb: any) => {
    setRighttNav(false);
    // toolInstance.toolName = "viewType";
    // toolInstance.toolAction = changeOb.target.value;
    // toolClicked(toolInstance);
    if (setViewType) {
      switch (changeOb.target.value as string) {
        case "Reality":
          setViewType("pointCloud");
          break;
        case "Map":
          setViewType("orthoPhoto");
          break;
        default:
          setViewType(changeOb.target.value);
      }
    }
  };
  const LayerChange = (changeOb: any, layerLabel: string, node: any) => {
    let obj: any = myLayersList;

    for (const key in obj) {
      if (obj[key]?.name == node.name) {
        obj[key] = {
          ...obj[key],
          isSelected: !obj[key].isSelected,
          children: obj[key].children?.length
            ? obj[key]?.children.map((each: any) => {
                return {
                  ...each,
                  isSelected: !obj[key].isSelected,
                };
              })
            : [],
        };
      } else if (obj[key].children?.length) {
        obj[key] = {
          ...obj[key],
          children: obj[key]?.children.map((each: any) => {
            if (each.name === node.name) {
              return {
                ...each,
                isSelected: !each.isSelected,
              };
            } else {
              return each;
            }
          }),
        };
      }
    }

    setActiveRealityMap(obj);
    setLayersUpdated(!layersUpdated);
  };
  useEffect(() => {
    setMyProject(currentProject);
    setMyStructure(currentStructure);
    setMySnapshot(currentSnapshot);
    //setMyTypesList(currentTypesList);
    setMyLayersList(currentLayersList);
  }, [
    currentProject,
    currentSnapshot,
    currentStructure,
    currentLayersList,
    currentTypesList,
  ]);

  const rightMenuClickHandler = (e: any) => {
    setActive(e.currentTarget.id);
    setRighttNav(!rightNav);
    if (e.currentTarget.id === "Reality") {
      toolInstance.toolName = "viewMode";
      toolInstance.toolAction = "Design";
    } else if (e.currentTarget.id === "Design") {
      toolInstance.toolName = "viewMode";
      toolInstance.toolAction = "Reality";
    } else if (e.currentTarget.id === "compareDesign") {
      //console.log("CAptured....");
      toolInstance.toolName = "compareDesign";
      toolInstance.toolAction = "showCompare";
      setIsCompareDesign(true);
      setIsCompareReality(false);
    } else if (e.currentTarget.id === "compareReality") {
      //console.log("CAptured....");
      toolInstance.toolName = "compareReality";
      toolInstance.toolAction = "showCompare";
      setIsCompareReality(true);
      setIsCompareDesign(false);
    } else if (e.currentTarget.id === "hideCompare") {
      //console.log("CAptured....");
      toolInstance.toolName = isCompareReality
        ? "compareReality"
        : "compareDesign";
      // toolInstance.toolAction = isCompareReality
      //   ? "closeCompare"
      //   : "showCompare";
      toolInstance.toolAction = "closeCompare";
      setIsCompareDesign(false);
      setIsCompareReality(false);
    }
    toolClicked(toolInstance);
  };

  const realitySwitch = () => {
    setActive("hideCompare");

    // toolInstance.toolAction = isCompareReality
    //   ? "closeCompare"
    //   : "showCompare";
    toolInstance.toolAction = "closeCompare";
    setIsCompareDesign(false);
    setIsCompareReality(false);
  };

  useEffect(() => {
    if (iViewMode === "Reality") {
      realitySwitch();
    }
  }, [iViewMode, currentStructure]);

  const issueMenuClicked = (localTool: ITools) => {
    toolClicked(localTool);
    if (
      localTool.toolAction === "issueCreateClose" ||
      localTool.toolAction === "issueViewClose" ||
      localTool.toolAction === "issueView"
    )
      setRighttNav(!rightNav);
  };
  const taskMenuClicked = (localTool: ITools) => {
    toolClicked(localTool);
    if (
      localTool.toolAction === "taskCreateClose" ||
      localTool.toolAction === "taskViewClose"
    )
      setRighttNav(!rightNav);
  };
  const hotspotMenuClicked = (localTool: ITools) => {
    toolClicked(localTool);
    if (
      localTool.toolAction === "hotspotCreateClose" ||
      localTool.toolAction === "hotspotViewClose" ||
      localTool.toolAction === "hotspotView"
    )
      setRighttNav(!rightNav);
  };
  return (
    <SectionToolBar viewMode={viewMode}>
      <ToolbarContainer>
        {/* {viewMode !== "Reality" ? (
          <Typebar
            rightMenuClickHandler={rightMenuClickHandler}
            myTypesList={myTypesList}
            typeChange={typeChange}
            selectedValue={selectedType}
            openList={openSelectTypes}
            setOpenList={setOpenSelectTypes}
            onListClick={() => {
              setOpenSelectLayer(false);
              setOpenSelectTypes(!openSelectTypes);
            }}
          />
        ) : (
          <></>
        )}
        {viewMode !== "Reality" ? (
          <Layers
            rightMenuClickHandler={rightMenuClickHandler}
            myLayersList={myLayersList}
            LayerChange={LayerChange}
            selectedValue={selectedLayer}
            openList={openSelectLayer}
            setOpenList={setOpenSelectLayer}
            onListClick={() => {
              setOpenSelectTypes(false);
              setOpenSelectLayer(!openSelectLayer);
            }}
            selectedLayersList={selectedLayersList}
          />
        ) : (
          <></>
        )} */}
        <Typebar
          rightMenuClickHandler={rightMenuClickHandler}
          myTypesList={myTypesList}
          typeChange={typeChange}
          selectedValue={selectedTypeVal}
          openList={openSelectTypes}
          setOpenList={setOpenSelectTypes}
          onListClick={() => {
            setOpenSelectLayer(false);
            setOpenSelectTypes(!openSelectTypes);
          }}
        />
        <Layers
          rightMenuClickHandler={rightMenuClickHandler}
          myLayersList={myLayersList}
          LayerChange={LayerChange}
          selectedValue={selectedLayer}
          openList={openSelectLayer}
          setOpenList={setOpenSelectLayer}
          onListClick={() => {
            setOpenSelectTypes(false);
            setOpenSelectLayer(!openSelectLayer);
          }}
          selectedLayersList={selectedLayersList}
          setActiveRealityMap={setActiveRealityMap}
          layersUpdated={layersUpdated}
        />
        <Issues
          issuesList={issuesList}
          issueMenuClicked={issueMenuClicked}
          handleOnFilter={handleOnFilter}
          currentProject={myProject}
          currentStructure={myStructure}
          currentSnapshot={mySnapshot}
          contextInfo={contextInfo}
          closeFilterOverlay={closeFilterOverlay}
          rightMenuClickHandler={rightMenuClickHandler}
          issueOpenDrawer={openCreateIssue}
          issuePriorityList={issuePriorityList}
          issueStatusList={issueStatusList}
          issueTypesList={issueTypesList}
          issueFilterState={issueFilterState}
          setIssueFilterState={setIssueFilterState}
          closeIssueCreate={closeIssueCreate}
          deleteTheIssue={deleteTheIssue}
          openIssueDetails={openIssueDetails}
          closeIssueDetails={closeIssueDetails}
          setIssueList={setIssueList}
          getIssues={getIssues}
          handleOnIssueSort={handleOnIssueSort}
          issueSubmit={issueSubmit}
          deleteTheAttachment={deleteTheAttachment}
          projectUsers={projectUsers}
          issueLoader={issueLoader}
          setIssueLoader={setIssueLoader}
          setShowIssueMarkups={setShowIssueMarkups}
          showIssueMarkups={showIssueMarkups}
        />

        <Task
          tasksList={tasksList}
          setTasksList={setTasksList}
          taskMenuClicked={taskMenuClicked}
          currentProject={currentProject}
          currentSnapshot={currentSnapshot}
          currentStructure={currentStructure}
          contextInfo={contextInfo}
          closeTaskFilterOverlay={closeTaskFilterOverlay}
          handleOnTaskFilter={handleOnTaskFilter}
          rightMenuClickHandler={rightMenuClickHandler}
          taskOpenDrawer={openCreateTask}
          deleteTheTask={deleteTheTask}
          taskFilterState={taskFilterState}
          closeTaskCreate={closeTaskCreate}
          openTaskDetails={openTaskDetails}
          closeTaskDetails={closeTaskDetails}
          getTasks={getTasks}
          handleOnTasksSort={handleOnTasksSort}
          taskSubmit={taskSubmit}
          deleteTheAttachment={deleteTheAttachment}
          projectUsers={projectUsers}
          taskPriorityList={taskPriorityList}
          taskStatusList={taskStatusList}
          setShowTaskMarkups={setShowTaskMarkups}
          showTaskMarkups={showTaskMarkups}
        />

        {viewMode === "Reality" ? (
          <CompareView
            rightMenuClickHandler={rightMenuClickHandler}
            active={active}
            designMap={designMap}
            selectedType={selectedType}
            setActive={setActive}
          />
        ) : (
          <></>
        )}

        {/* <Hotspot /> */}
      </ToolbarContainer>
    </SectionToolBar>
  );
};

export default ToolBarMenuWrapper;
