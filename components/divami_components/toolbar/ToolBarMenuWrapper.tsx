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
import { ITools } from "../../../models/ITools";
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
}) => {
  const [rightNav, setRighttNav] = useState(false);
  const [isCompareDesign, setIsCompareDesign] = useState(false);
  const [isCompareReality, setIsCompareReality] = useState(false);
  const [iViewMode, setIViewMode] = useState(viewMode);
  const rightOverlayRef: any = useRef();
  const rightOverlayRefs: any = useRef();
  const [active, setActive] = useState();
  const [myProject, setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  const [myTypesList, setMyTypesList] = useState<IDesignMap>(currentTypesList);
  const [myLayersList, setMyLayersList] =
    useState<IActiveRealityMap>(currentLayersList);
  let toolInstance: ITools = { toolName: "", toolAction: "" };
  // const closeStructurePages = (e: any) => {
  //   if (!rightOverlayRefs.current.contains(e.target)) {
  //     setRighttNav(false);
  //     setActive(e.target.id);
  //     console.log('This is triggered!!!!!!!!!!!!!!!!!!!!!!!!',e);
  //   }
  // };
  useEffect(() => {
    setIViewMode(viewMode);
    //   document.addEventListener('click', closeStructurePages);
    //   return () => {
    //     document.removeEventListener('click', closeStructurePages);
    //   };
  }, [viewMode]);

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

  return (
    <SectionToolBar>
      <ToolbarContainer>
        <Typebar rightMenuClickHandler={rightMenuClickHandler} />

        <Layers rightMenuClickHandler={rightMenuClickHandler} />

        <Issues rightMenuClickHandler={rightMenuClickHandler} />

        <Task rightMenuClickHandler={rightMenuClickHandler} />

        <Hotspot />
      </ToolbarContainer>
      {/* <div className={styles.toolBarContainer}></div> */}
    </SectionToolBar>
  );

  // <div className={styles.sectionToolBar}>

  // </div>
};

export default ToolBarMenuWrapper;
