import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsSplitUpAndLeft,
  faCodeBranch,
  faD,
  faDatabase,
  faR,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { ITools } from "../../../models/ITools";
import IssueMenu from "./issueMenu/issueMenu";
import TaskMenu from "./taskMenu/taskMenu";
import ProgressMenu from "./progressMenu/progressMenu";
import { ITasks } from "../../../models/Itask";
import { Issue } from "../../../models/Issue";
import { ISnapshot } from "../../../models/ISnapshot";
import { IStructure } from "../../../models/IStructure";
import Image from "next/image";
import issues from "../../../public/icons/issues.svg";
import tasks from "../../../public/icons/taskVisibleInToolbar.svg";
import hotspot from "../../../public/icons/Hotspot.svg";
import { IActiveRealityMap } from "../../../models/IReality";
import { IDesignMap } from "../../../models/IDesign";
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
const RightFloatingMenu: React.FC<IProps> = ({
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

  const typeChange = (changeOb: any) => {
    setRighttNav(false);
    toolInstance.toolName = "viewType";
    toolInstance.toolAction = changeOb.target.value;
    toolClicked(toolInstance);
  };

  const LayerChange = (changeOb: any) => {
    console.log("LayerChange", changeOb.target.value);
    if (changeOb.target.checked == true) {
      toolInstance.toolName = "addViewLayer";
      toolInstance.toolAction = changeOb.target.value;
    } else {
      toolInstance.toolName = "removeViewLayer";
      toolInstance.toolAction = changeOb.target.value;
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

  const progressMenuClicked = (localTool: ITools) => {
    toolClicked(localTool);
  };
  return (
    <div ref={rightOverlayRefs}>
      <div ref={rightOverlayRef} className="flex-col ">
        <div className="justify-center cursor-pointer">
          <FontAwesomeIcon
            icon={iViewMode === "Design" ? faD : faR}
            id={iViewMode}
            className={`flex w-full justify-center  py-2 cursor-pointer selectedClass`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
        </div>
        <div className="cursor-pointer">
          {active === "type" ? (
            <div className={`fixed  ${rightNav ? "right-9" : "hidden"}`}>
              <div className="bg-gray-400">
                <select onChange={typeChange} id="typeList">
                  {myTypesList &&
                    Object.keys(myTypesList).map((key) => (
                      <option key={key} value={key} defaultChecked={true}>
                        {key}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ) : (
            ""
          )}
          <FontAwesomeIcon
            id="type"
            className={` flex w-full py-2  cursor-pointer ${active === "type" ? "selectedClass" : "unSelectedClass"
              }`}
            onClick={rightMenuClickHandler}
            icon={faSitemap}
          ></FontAwesomeIcon>

          <div className="my-2 border-2 border-solid border-gray-500"></div>
        </div>
        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faDatabase}
            id="layer"
            className={` w-full py-2  cursor-pointer ${active === "layer" ? "selectedClass" : "unSelectedClass"
              }`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === "layer" ? (
            <div className={`fixed   ${rightNav ? "right-9" : "hidden"}`}>
              <div
                className={`border  -mt-8 border-solid bg-slate-300 p-1.5 rounded `}
              >
                <ul className=" h-full text-xs" id="items">
                  {myLayersList &&
                    Object.keys(myLayersList).map((key) => (
                      <li key={key}>
                        <input
                          onClick={LayerChange}
                          value={key}
                          type="checkbox"
                          defaultChecked={true}
                        />
                        {key}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div
          className={`${active === "issue" ? "selectedClass" : "unSelectedClass"
            }`}
        >
          <Image
            alt=""
            src={issues}
            id="issue"
            className={` m-auto  p-1.5  w-full cursor-pointer `}
            onClick={rightMenuClickHandler}
          ></Image>
          {active === "issue" ? (
            <div className={`fixed -mt-8 ${rightNav ? "right-9" : "hidden"}`}>
              <IssueMenu
                issuesList={issuesList}
                issueMenuClicked={issueMenuClicked}
                handleOnFilter={handleOnFilter}
                currentProject={myProject}
                currentStructure={myStructure}
                currentSnapshot={mySnapshot}
                closeFilterOverlay={closeFilterOverlay}
              ></IssueMenu>
            </div>
          ) : (
            ""
          )}
        </div>
        <div
          className={` ${active === "task" ? "selectedClass" : "unSelectedClass"
            }`}
        >
          <Image
            alt=""
            src={tasks}
            id="task"
            className={` m-auto  w-full  p-1  text-4xl cursor-pointer `}
            onClick={rightMenuClickHandler}
          ></Image>
          {active === "task" ? (
            <div className={`fixed -mt-8 ${rightNav ? "right-9" : "hidden"}`}>
              <TaskMenu
                tasksList={tasksList}
                taskMenuClicked={taskMenuClicked}
                currentProject={myProject}
                currentStructure={myStructure}
                currentSnapshot={mySnapshot}
                closeTaskFilterOverlay={closeTaskFilterOverlay}
                handleOnTaskFilter={handleOnTaskFilter}
              ></TaskMenu>
            </div>
          ) : (
            ""
          )}
        </div>
        <div
          className={` justify-center cursor-pointer ${active === "progress" ? "selectedClass" : "unSelectedClass"
            }`}
        >
          <Image
            alt=""
            src={hotspot}
            id="progress"
            className={` w-full  cursor-pointer p-1 `}
            onClick={rightMenuClickHandler}
          ></Image>
          {active === "progress" ? (
            <div className={`fixed -mt-8 ${rightNav ? "right-9" : "hidden"}`}>
              <ProgressMenu
                progressMenuClicked={progressMenuClicked}
              ></ProgressMenu>
            </div>
          ) : (
            ""
          )}
        </div>
        {iViewMode === "Reality" ? (
          <div>
            <div className="justify-center cursor-pointer">
              <FontAwesomeIcon
                icon={faCodeBranch}
                id="compareDesign"
                className={` w-full  cursor-pointer ${active === "compareDesign"
                    ? "selectedClass"
                    : "unSelectedClass"
                  }`}
                onClick={rightMenuClickHandler}
              ></FontAwesomeIcon>
            </div>

            <div className="justify-center cursor-pointer">
              <FontAwesomeIcon
                icon={faArrowsSplitUpAndLeft}
                id="compareReality"
                className={` w-full  cursor-pointer ${active === "compareReality"
                    ? "selectedClass"
                    : "unSelectedClass"
                  }`}
                onClick={rightMenuClickHandler}
              ></FontAwesomeIcon>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default RightFloatingMenu;
