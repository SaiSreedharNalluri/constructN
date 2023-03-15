import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsSplitUpAndLeft,
  faCodeBranch,
  faD,
  faDatabase,
  faR,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import MapIcon from '@mui/icons-material/Map';
import { ITools } from '../../../models/ITools';
import IssueMenu from './issueMenu/issueMenu';
import TaskMenu from './taskMenu/taskMenu';
import ProgressMenu from './progressMenu/progressMenu';
import { ITasks } from '../../../models/Itask';
import { Issue } from '../../../models/Issue';
import { ISnapshot } from '../../../models/ISnapshot';
import { IStructure } from '../../../models/IStructure';
import Image from 'next/image';
import issues from '../../../public/icons/issues.svg';
import tasks from '../../../public/icons/taskVisibleInToolbar.svg';
import hotspot from '../../../public/icons/Hotspot.svg';
import { IActiveRealityMap } from '../../../models/IReality';
import { IDesignMap } from '../../../models/IDesign';
import Select from 'react-select/dist/declarations/src/Select';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
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
  currentViewType: string;
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
  currentViewType,
  closeFilterOverlay,
  closeTaskFilterOverlay,
  handleOnTaskFilter,
}) => {
  const [rightNav, setRighttNav] = useState(false);
  const [isCompareDesign, setIsCompareDesign] = useState(false);
  const [isCompareReality, setIsCompareReality] = useState(false);
  let [iViewMode, setIViewMode] = useState(viewMode);
  const rightOverlayRef: any = useRef();
  const rightOverlayRefs: any = useRef();
  const [active, setActive] = useState();
  const [myProject, setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  const [myTypesList, setMyTypesList] = useState<IDesignMap>(currentTypesList);
  const [myLayersList, setMyLayersList] =
    useState<IActiveRealityMap>(currentLayersList);
  const [mySelectedType, setMySelectedType] = useState(currentViewType);
  let toolInstance: ITools = { toolName: '', toolAction: '' };
  useEffect(() => {
    setIViewMode(viewMode);
  }, [viewMode]);

  useEffect(() => {
    setMyProject(currentProject);
    setMyStructure(currentStructure);
    setMySnapshot(currentSnapshot);
    setMyTypesList(currentTypesList);
    setMyLayersList(currentLayersList);
    setMySelectedType(currentViewType);
    //console.log('Layers',myLayersList)
  }, [
    currentProject,
    currentSnapshot,
    currentStructure,
    currentLayersList,
    currentTypesList,
    currentViewType,
  ]);

  const rightMenuClickHandler = (e: any) => {
    setActive(e.currentTarget.id);
    setRighttNav(!rightNav);
    if (e.currentTarget.id === 'Reality') {
      toolInstance.toolName = 'viewMode';
      toolInstance.toolAction = 'Design';
    } else if (e.currentTarget.id === 'Design') {
      toolInstance.toolName = 'viewMode';
      toolInstance.toolAction = 'Reality';
    } else if (e.currentTarget.id === 'compareDesign') {
      toolInstance.toolName = 'compareDesign';
      toolInstance.toolAction = isCompareDesign
        ? 'closeCompare'
        : 'showCompare';
      setIsCompareDesign(isCompareDesign ? false : true);
      setIsCompareReality(false);
    } else if (e.currentTarget.id === 'compareReality') {
      toolInstance.toolName = 'compareReality';
      toolInstance.toolAction = isCompareReality
        ? 'closeCompare'
        : 'showCompare';
      setIsCompareReality(isCompareReality ? false : true);
      setIsCompareDesign(false);
    }

    toolClicked(toolInstance);
  };

  const typeChange = (changeOb: any) => {
    setRighttNav(false);
    toolInstance.toolName = 'viewType';
    toolInstance.toolAction = changeOb.target.value;
    toolClicked(toolInstance);
  };

  const LayerChange = (changeOb: any) => {
    if (changeOb.target.checked == true) {
      toolInstance.toolName = 'addViewLayer';
      toolInstance.toolAction = changeOb.target.value;
    } else {
      toolInstance.toolName = 'removeViewLayer';
      toolInstance.toolAction = changeOb.target.value;
    }

    toolClicked(toolInstance);
  };
  const issueMenuClicked = (localTool: ITools) => {
    toolClicked(localTool);
    if (
      localTool.toolAction === 'issueCreateClose' ||
      localTool.toolAction === 'issueViewClose' ||
      localTool.toolAction === 'issueView'
    )
      setRighttNav(!rightNav);
  };
  const taskMenuClicked = (localTool: ITools) => {
    toolClicked(localTool);
    if (
      localTool.toolAction === 'taskCreateClose' ||
      localTool.toolAction === 'taskViewClose'
    )
      setRighttNav(!rightNav);
  };

  const progressMenuClicked = (localTool: ITools) => {
    toolClicked(localTool);
  };
  return (
    <div ref={rightOverlayRefs}>
      <div ref={rightOverlayRef} className="grid  grid-flow-col items-center">
        <div className="justify-center cursor-pointer selectedClass">
          <ToggleButtonGroup
            color="primary"
            value={iViewMode}
            size="small"
            exclusive
            className={`flex w-full h-full justify-center  p-1.5 cursor-pointer bg-transperant`}
            onChange={(e: any, newValue: string) => {
              toolInstance.toolName = 'viewMode';
              toolInstance.toolAction = newValue === 'Design' ? 'Design' : 'Reality';
              toolClicked(toolInstance)
              if(newValue !== 'Design') {
                toolInstance.toolName = 'viewType';
                toolInstance.toolAction = newValue === 'OrthoPhoto' ? 'OrthoPhoto' : '3D';
                toolClicked(toolInstance)
              }
            }}
            aria-label="Platform"
          >
            <ToggleButton value="Design">
              <ArchitectureIcon />
            </ToggleButton>
            <ToggleButton value="Reality">
              <ThreeDRotationIcon />
            </ToggleButton>
            <ToggleButton value="OrthoPhoto">
              <MapIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          {/* <FontAwesomeIcon
            icon={iViewMode === 'Design' ? faD : faR}
            id={iViewMode}
            className={`flex w-full h-full justify-center  p-1.5 cursor-pointer `}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon> */}
        </div>
        <div className={`cursor-pointer justify-center ${active === 'type' ? 'selectedClass' : 'unSelectedClass'
          }`}>

          {active === 'type' ? (
            <div className={`fixed mt-9 ${rightNav ? '' : 'hidden'}`}>
              <div className="bg-gray-400">
                <select onChange={typeChange} id="typeList">
                  {myTypesList &&
                    Object.keys(myTypesList).map((key) => (
                      <option key={key} value={key} selected={key === mySelectedType ? true : false}>
                        {key}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ) : (
            ''
          )}
          <FontAwesomeIcon
            id="type"
            className={`w-full h-full  p-2  cursor-pointer `}
            onClick={rightMenuClickHandler}
            icon={faSitemap}
          ></FontAwesomeIcon>
          <div className=" border-solid border-gray-500"></div>
        </div>
        <div className={`cursor-pointer  ${active === 'layer' ? 'selectedClass' : 'unSelectedClass'
          }`}>
          <FontAwesomeIcon
            icon={faDatabase}
            id="layer"
            className={`m-auto w-full h-full p-2  cursor-pointer`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === 'layer' ? (
            <div className={`fixed ${rightNav ? '' : 'hidden'}`}>
              <div
                className={`border   border-solid bg-slate-300 p-1.5 rounded `}
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
            <div></div>
          )}
        </div>
        <div
          className={`${active === 'issue' ? 'selectedClass' : 'unSelectedClass'
            }`}
        >
          <Image
            alt=""
            src={issues}
            id="issue"
            className={` m-auto  p-1.5  w-9 h-9 cursor-pointer `}
            onClick={rightMenuClickHandler}
          ></Image>
          {active === 'issue' ? (
            <div className={`fixed ${rightNav ? '' : 'hidden'}`}>
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
            ''
          )}
        </div>
        <div
          className={` ${active === 'task' ? 'selectedClass' : 'unSelectedClass'
            }`}
        >
          <Image
            alt=""
            src={tasks}
            id="task"
            className={` m-auto  w-9 h-9  p-1   cursor-pointer `}
            onClick={rightMenuClickHandler}
          ></Image>
          {active === 'task' ? (
            <div className={`fixed ${rightNav ? '' : 'hidden'}`}>
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
            ''
          )}
        </div>
        <div
          className={` justify-center cursor-pointer ${active === 'progress' ? 'selectedClass' : 'unSelectedClass'
            }`}
        >
          <Image
            alt=""
            src={hotspot}
            id="progress"
            className={` m-auto w-9 h-9  cursor-pointer p-1 `}
            onClick={rightMenuClickHandler}
          ></Image>
          {active === 'progress' ? (
            <div className={`fixed  ${rightNav ? '' : 'hidden'}`}>
              <ProgressMenu
                progressMenuClicked={progressMenuClicked}
              ></ProgressMenu>
            </div>
          ) : (
            ''
          )}
        </div>
        {iViewMode === 'Reality' ? (
          <div className='grid grid-flow-col'>
            <div className="justify-center cursor-pointer">
              <FontAwesomeIcon
                icon={faCodeBranch}
                id="compareDesign"
                className={`m-auto w-9 h-9  cursor-pointer ${active === 'compareDesign'
                    ? 'selectedClass'
                    : 'unSelectedClass'
                  }`}
                onClick={rightMenuClickHandler}
              ></FontAwesomeIcon>
            </div>

            <div className="justify-center cursor-pointer">
              <FontAwesomeIcon
                icon={faArrowsSplitUpAndLeft}
                id="compareReality"
                className={`m-auto w-9 h-9  cursor-pointer ${active === 'compareReality'
                    ? 'selectedClass'
                    : 'unSelectedClass'
                  }`}
                onClick={rightMenuClickHandler}
              ></FontAwesomeIcon>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default RightFloatingMenu;
