import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faArrowsSplitUpAndLeft,
  faBullseye,
  faCodeBranch,
  faCodeCompare,
  faD,
  faDatabase,
  faDisplay,
  faExclamationCircle,
  faR,
  faSitemap,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';
import { ITools } from '../../../models/ITools';
import IssueMenu from './issueMenu/issueMenu';
import TaskMenu from './taskMenu/taskMenu';
import ProgressMenu from './progressMenu/progressMenu';
import { ITasks } from '../../../models/Itask';
import { Issue } from '../../../models/Issue';

interface IProps {
  toolClicked: (a: ITools) => void;
  viewMode: string;
  viewTypes?: string[];
  viewLayers?: string[];
  handleIssueSubmit: (formData: object) => void;
  handleTaskSubmit: (formObj: object) => void;
  issuesList: Issue[];
  tasksList: ITasks[];
}
const RightFloatingMenu: React.FC<IProps> = ({
  toolClicked,
  viewLayers,
  viewMode,
  viewTypes,
  handleIssueSubmit,
  handleTaskSubmit,
  issuesList,
  tasksList,
}) => {
  const [rightNav, setRighttNav] = useState(false);
  const [iViewMode, setIViewMode] = useState(viewMode);
  const rightOverlayRef: any = useRef();
  const rightOverlayRefs: any = useRef();
  const [active, setActive] = useState();
  let toolInstance: ITools = { toolName: '', toolAction: '' };
  const closeStructurePages = (e: any) => {
    if (!rightOverlayRefs.current.contains(e.target)) {
      setRighttNav(false);
    }
  };
  useEffect(() => {
    setIViewMode(viewMode);
    document.addEventListener('click', closeStructurePages);
    return () => {
      document.removeEventListener('click', closeStructurePages);
    };
  }, [viewMode]);

  const rightMenuClickHandler = (e: any) => {
    setActive(e.currentTarget.id);
    setRighttNav(!rightNav);
    if (e.currentTarget.id === 'Reality') {
      toolInstance.toolName = 'viewMode';
      toolInstance.toolAction = 'Design';
    } else if (e.currentTarget.id === 'Design') {
      toolInstance.toolName = 'viewMode';
      toolInstance.toolAction = 'Reality';
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
  // const issueChange =(changeOb:any)=>{

  //   toolInstance.toolName='issue';
  //   toolInstance.toolAction=changeOb.currentTarget.id;
  //   toolClicked(toolInstance);
  //   setRighttNav(!rightNav);
  // }
  const issueMenuClicked = (localTool: ITools) => {
    console.log('localTool', localTool);
    toolClicked(localTool);
    if (
      localTool.toolAction === 'issueCreateClose' ||
      localTool.toolAction === 'issueViewClose'
    )
      console.log('dsbjkds', rightNav);
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
      <div ref={rightOverlayRef} className="flex-col ">
        <div className="justify-center cursor-pointer">
          <FontAwesomeIcon
            icon={iViewMode === 'Design' ? faD : faR}
            id={iViewMode}
            className={`flex w-full justify-center  py-2 cursor-pointer selectedClass`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
        </div>
        <div className="cursor-pointer">
          {active === 'type' ? (
            <div className={`fixed  ${rightNav ? 'right-9' : 'hidden'}`}>
              <div className="bg-gray-400">
                <select onChange={typeChange} id="typeList">
                  {viewMode === 'Design' ? (
                    <option value="plan">Plan</option>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Design' ? (
                    <option value="elevation">Elevation</option>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Design' ? (
                    <option value="xSectional">CrossSectional</option>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Design' ? (
                    <option value="layout">Layout</option>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Design' ? (
                    <option value="bim">BIM</option>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Reality' ? (
                    <option value="pointCloud">PointCloud</option>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Reality' ? (
                    <option value="orthoPhoto">OrthoPhoto</option>
                  ) : (
                    ''
                  )}
                </select>
              </div>
            </div>
          ) : (
            ''
          )}
          <FontAwesomeIcon
            id="type"
            className={` flex w-full py-2  cursor-pointer ${
              active === 'type' ? 'selectedClass' : 'unSelectedClass'
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
            className={` w-full py-2  cursor-pointer ${
              active === 'layer' ? 'selectedClass' : 'unSelectedClass'
            }`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === 'layer' ? (
            <div className={`fixed   ${rightNav ? 'right-9' : 'hidden'}`}>
              <div
                className={`border  -mt-8 border-solid bg-slate-300 p-1.5 rounded `}
              >
                <ul className=" h-full text-xs" id="items">
                  <li>
                    <input
                      onClick={LayerChange}
                      value={'360Image'}
                      type="checkbox"
                    />
                    360 Image{' '}
                  </li>
                  <li>
                    <input
                      onClick={LayerChange}
                      value={'360Video'}
                      type="checkbox"
                    />
                    360 Video Walk
                  </li>
                  <li>
                    <input
                      onClick={LayerChange}
                      value={'phoneImage'}
                      type="checkbox"
                    />
                    Phone Image
                  </li>
                  <li>
                    <input
                      onClick={LayerChange}
                      value={'arielImage'}
                      type="checkbox"
                    />
                    Aerial Image{' '}
                  </li>
                  <li>
                    <input
                      onClick={LayerChange}
                      value={'issue'}
                      type="checkbox"
                    />
                    Issue{' '}
                  </li>
                  <li>
                    <input
                      onClick={LayerChange}
                      value={'rfi'}
                      type="checkbox"
                    />
                    RFI{' '}
                  </li>
                  <li>
                    <input
                      onClick={LayerChange}
                      value={'progress'}
                      type="checkbox"
                    />
                    Progress
                  </li>
                  {viewMode === 'Reality' ? (
                    <li>
                      <input
                        onClick={LayerChange}
                        value={'baseLine'}
                        type="checkbox"
                      />
                      Base Lines
                    </li>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Reality' ? (
                    <li>
                      <input
                        onClick={LayerChange}
                        value={'cutFillAnalysis'}
                        type="checkbox"
                      />
                      Cut-fill analysis
                    </li>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Reality' ? (
                    <li>
                      <input
                        onClick={LayerChange}
                        value={'autocadOverlay'}
                        type="checkbox"
                      />
                      Autocad overlay
                    </li>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Reality' ? (
                    <li>
                      <input
                        onClick={LayerChange}
                        value={'boundries'}
                        type="checkbox"
                      />
                      Boundaries
                    </li>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Reality' ? (
                    <li>
                      <input
                        onClick={LayerChange}
                        value={'contours'}
                        type="checkbox"
                      />
                      Contours
                    </li>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Reality' ? (
                    <li>
                      <input
                        onClick={LayerChange}
                        value={'spotLevels'}
                        type="checkbox"
                      />
                      Spot levels
                    </li>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Reality' ? (
                    <li>
                      <input
                        onClick={LayerChange}
                        value={'vegetation'}
                        type="checkbox"
                      />
                      Vegetation
                    </li>
                  ) : (
                    ''
                  )}
                  {viewMode === 'Reality' ? (
                    <li>
                      <input
                        onClick={LayerChange}
                        value={'gcpPoints'}
                        type="checkbox"
                      />
                      GCP Points
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            id="issue"
            className={` w-full py-2  cursor-pointer ${
              active === 'issue' ? 'selectedClass' : 'unSelectedClass'
            }`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === 'issue' ? (
            <div className={`fixed -mt-8 ${rightNav ? 'right-9' : 'hidden'}`}>
              <IssueMenu
                issuesList={issuesList}
                handleIssueSubmit={handleIssueSubmit}
                issueMenuClicked={issueMenuClicked}
              ></IssueMenu>
              {/* <div className='bg-gray-400'>
                  <div className=" h-full text-xs"  id="issueItems">
                  <div onClick={issueChange} id={"issueCreate"}><p>Create</p> </div>
                  <div onClick={issueChange} id={"issueView"}><p>View</p> </div>
                  <div onClick={issueChange} id={"issueShow"} ><p>Show</p> </div>
                  <div onClick={issueChange} id={"issueHide"} ><p>Hide</p> </div>
                  </div>
                 </div> */}
            </div>
          ) : (
            ''
          )}
        </div>

        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faBullseye}
            id="task"
            className={` w-full py-2  z-10 cursor-pointer ${
              active === 'task' ? 'selectedClass' : 'unSelectedClass'
            }`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === 'task' ? (
            <div className={`fixed -mt-8 ${rightNav ? 'right-9' : 'hidden'}`}>
              <TaskMenu
                tasksList={tasksList}
                handleTaskSubmit={handleTaskSubmit}
                taskMenuClicked={taskMenuClicked}
              ></TaskMenu>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className=" justify-center cursor-pointer">
          <FontAwesomeIcon
            icon={faTasks}
            id="progress"
            className={` w-full py-2  cursor-pointer ${
              active === 'progress' ? 'selectedClass' : 'unSelectedClass'
            } `}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === 'progress' ? (
            <div className={`fixed -mt-8 ${rightNav ? 'right-9' : 'hidden'}`}>
              <ProgressMenu
                progressMenuClicked={progressMenuClicked}
              ></ProgressMenu>
            </div>
          ) : (
            ''
          )}
        </div>
        {iViewMode === 'Reality' ? (
          <div>
            <div className="justify-center cursor-pointer">
              <FontAwesomeIcon
                icon={faCodeBranch}
                id="designCompare"
                className={` w-full  cursor-pointer ${
                  active === 'designCompare'
                    ? 'selectedClass'
                    : 'unSelectedClass'
                }`}
                onClick={rightMenuClickHandler}
              ></FontAwesomeIcon>
            </div>

            <div className="justify-center cursor-pointer">
              <FontAwesomeIcon
                icon={faArrowsSplitUpAndLeft}
                id="realityCompare"
                className={` w-full  cursor-pointer ${
                  active === 'realityCompare'
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
