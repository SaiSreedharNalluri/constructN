import React, { useEffect, useRef, useState } from "react";
import Typebar from "./Typebar";
import Layers from "./Layers";
import Issues from "./Issues";
import Task from "./Task";
import Hotspot from "./Hotspot";
// import styles from '../toolbar/toolbar.module.css'
import Image from "next/image";
import downArrowIcon from "../../../public/divami_icons/downArrowIcon.svg";
import hexagonIcon from "../../../public/divami_icons/hexagonIcon.svg";
import cameraIcon from "../../../public/divami_icons/cameraIcon.svg";
import videoRecorderIcon from "../../../public/divami_icons/videoRecorderIcon.svg";
import plusCircleIcon from "../../../public/divami_icons/plusCircleIcon.svg";
import fileTextIcon from "../../../public/divami_icons/fileTextIcon.svg";
import clipboardSecondIcon from "../../../public/divami_icons/clipboardSecondIcon.svg";
import clipboardTaskIcon from "../../../public/divami_icons/clipboardTaskIcon.svg";
import hotspotCircleIcon from "../../../public/divami_icons/hotspotCircleIcon.svg";
import groupSpotIcon from "../../../public/divami_icons/groupSpotIcon.svg";
import { IDesignMap } from "../../../models/IDesign";
import { IActiveRealityMap } from "../../../models/IReality";
import { ISnapshot } from "../../../models/ISnapshot";
import { IStructure } from "../../../models/IStructure";
import { IToolResponse, ITools } from "../../../models/ITools";
import { SectionToolBar, ToolbarContainer } from "./ToolBarStyles";
import { Issue } from "../../../models/Issue";
import { ITasks } from "../../../models/Itask";
import CompareView from "./CompareView";

// import TOOLBARMENU from '../../config/appConstant'

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
  deleteTheIssue?: any;
}

const ToolBarMenuWrapper: React.FC<any> = ({
  toolClicked,
  viewLayers,
  viewMode,
  viewTypes,
  issuesList,
  tasksList,
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
}) => {
  const [rightNav, setRighttNav] = useState(false);
  const [isCompareDesign, setIsCompareDesign] = useState(false);
  const [isCompareReality, setIsCompareReality] = useState(false);
  const [iViewMode, setIViewMode] = useState(viewMode);
  const rightOverlayRef: any = useRef();
  const rightOverlayRefs: any = useRef();
  const [active, setActive] = useState("hideCompare");
  const [myProject, setMyProject] = useState(currentProject);
  const [selectedType, setSelectedType] = useState("");
  const [selectedLayer, setSelectedLayer] = useState("");
  const [openSelectTypes, setOpenSelectTypes] = useState(false);
  const [openSelectLayer, setOpenSelectLayer] = useState(false);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  const [myTypesList, setMyTypesList] = useState<IDesignMap>(currentTypesList);
  const [myLayersList, setMyLayersList] =
    useState<IActiveRealityMap>(currentLayersList);
  let toolInstance: ITools = { toolName: "", toolAction: "" };
  useEffect(() => {
    setIViewMode(viewMode);
  }, [viewMode]);
  useEffect(() => {
    if (myTypesList && Object.keys(myTypesList)?.length) {
      setSelectedType(Object.keys(myTypesList)[0]);
    }
  }, [myTypesList]);
  const typeChange = (changeOb: any) => {
    setRighttNav(false);
    toolInstance.toolName = "viewType";
    toolInstance.toolAction = changeOb.target.value;
    toolClicked(toolInstance);
    setSelectedType(changeOb.target.value);
  };

  const LayerChange = (changeOb: any, layerLabel: string) => {
    if (changeOb.target.checked == true) {
      toolInstance.toolName = "addViewLayer";
      toolInstance.toolAction = layerLabel;
    } else {
      toolInstance.toolName = "removeViewLayer";
      toolInstance.toolAction = layerLabel;
    }

    toolClicked(toolInstance);
  };

  useEffect(() => {
    setMyProject(currentProject);
    setMyStructure(currentStructure);
    setMySnapshot(currentSnapshot);
    setMyTypesList(currentTypesList);
    setMyLayersList(currentLayersList);
  }, [
    currentProject,
    currentSnapshot,
    currentStructure,
    currentLayersList,
    currentTypesList,
  ]);
  const rightMenuClickHandler = (e: any) => {
    console.log(
      e.currentTarget.id,
      "cureid",
      isCompareReality,
      isCompareDesign
    );

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
      toolInstance.toolAction = isCompareDesign
        ? "closeCompare"
        : "showCompare";
      setIsCompareDesign(isCompareDesign ? false : true);
      setIsCompareReality(false);
    } else if (e.currentTarget.id === "compareReality") {
      //console.log("CAptured....");
      toolInstance.toolName = "compareReality";
      toolInstance.toolAction = isCompareReality
        ? "closeCompare"
        : "showCompare";
      setIsCompareReality(isCompareReality ? false : true);
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
  }, [iViewMode]);
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
          selectedValue={selectedType}
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
          closeIssueCreate={closeIssueCreate}
          deleteTheIssue={deleteTheIssue}
          openIssueDetails={openIssueDetails}
          closeIssueDetails={closeIssueDetails}
          setIssueList={setIssueList}
          getIssues={getIssues}
          handleOnIssueSort={handleOnIssueSort}
        />

        <Task
          tasksList={tasksList}
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
        />

        {viewMode === "Reality" ? (
          <CompareView
            rightMenuClickHandler={rightMenuClickHandler}
            active={active}
          />
        ) : (
          <></>
        )}
        <Hotspot />
      </ToolbarContainer>
    </SectionToolBar>
  );
};

export default ToolBarMenuWrapper;
