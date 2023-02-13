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
  openIssueView: boolean;
}

const ToolBarMenuWrapper: React.FC<IProps> = ({
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
  openIssueView,
}) => {
  const [rightNav, setRighttNav] = useState(false);
  const [isCompareDesign, setIsCompareDesign] = useState(false);
  const [isCompareReality, setIsCompareReality] = useState(false);
  const [iViewMode, setIViewMode] = useState(viewMode);
  const rightOverlayRef: any = useRef();
  const rightOverlayRefs: any = useRef();
  const [active, setActive] = useState();
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

  const LayerChange = (changeOb: any) => {
    if (changeOb.target.checked == true) {
      toolInstance.toolName = "addViewLayer";
      toolInstance.toolAction = changeOb.target.value;
    } else {
      toolInstance.toolName = "removeViewLayer";
      toolInstance.toolAction = changeOb.target.value;
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
    }

    toolClicked(toolInstance);
  };

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
    <SectionToolBar>
      <ToolbarContainer>
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
          openIssueView={openIssueView}
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
        />

        <Hotspot />
      </ToolbarContainer>
    </SectionToolBar>
  );
};

export default ToolBarMenuWrapper;
