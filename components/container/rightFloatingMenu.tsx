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
import { ITools } from '../../models/ITools';

interface IProps {
  toolClicked:(a:ITools)=>void;
  viewMode:string;
  viewTypes?:string[];
  viewLayers?:string[];
}

const RightFloatingMenu: React.FC <IProps>= ({toolClicked,viewLayers,viewMode,viewTypes}) => {
  const [rightNav, setRighttNav] = useState(false);
  const [iViewMode,setIViewMode]= useState(viewMode);
  const rightOverlayRef: any = useRef();
  const rightOverlayRefs: any = useRef();
  const [active, setActive] = useState();
  let toolInstance:ITools;
  const closeStructurePages = (e: any) => {
    if (!rightOverlayRefs.current.contains(e.target)) {
      setRighttNav(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', closeStructurePages);
    return () => {
      document.removeEventListener('click', closeStructurePages);
    };
  }, []);
  useEffect(()=>{
setIViewMode(viewMode);
  },[viewMode]);

  const rightMenuClickHandler = (e: any) => {
    
    setActive(e.currentTarget.id);
    setRighttNav(!rightNav);

   
      toolInstance.toolName='viewMode';
      toolInstance.toolAction=e.currentTarget.id;


    toolClicked(toolInstance);
    
  };
   
  const typeChange =(changeOb:any)=>{
    setRighttNav(false);
    toolInstance.toolName='viewType';
    toolInstance.toolAction=changeOb.target.value;
    toolClicked(toolInstance);
    

  }

  const LayerChange =(changeOb:any)=>{
    
    if(changeOb.target.checked==true){
      toolInstance.toolName='addViewLayer';
      toolInstance.toolAction=changeOb.target.value;
      }
    else{
      toolInstance.toolName='removeViewLayer';
      toolInstance.toolAction=changeOb.target.value;
    }

    toolClicked(toolInstance);

  }
  const issueChange =(changeOb:any)=>{

    toolInstance.toolName='issue';
    toolInstance.toolAction=changeOb.currentTarget.id;
    toolClicked(toolInstance);
    setRighttNav(!rightNav);
  }

  const taskChange =(changeOb:any)=>{


    toolInstance.toolName='task';
    toolInstance.toolAction=changeOb.currentTarget.id;
    toolClicked(toolInstance);
    setRighttNav(!rightNav);
  }

  const progressChange =(changeOb:any)=>{

    toolInstance.toolName='progress';
    toolInstance.toolAction=changeOb.currentTarget.id;
    toolClicked(toolInstance);
    setRighttNav(!rightNav);
  }
 
  return (
    <div ref={rightOverlayRefs}>
      <div ref={rightOverlayRef} className="flex-col ">
      <div className="justify-center cursor-pointer">
          <FontAwesomeIcon
            icon={iViewMode==='Design'?faD:faR}
            id={iViewMode}
            className={`flex w-full justify-center  py-2 cursor-pointer selectedClass`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
        </div>
        <div className="cursor-pointer">
        {active === "type" ? (
            <div
              className={`fixed  ${rightNav ? 'right-9' : 'hidden'
                }`}>
                  <div className='bg-gray-400'>
                    <select onChange={typeChange} id="typeList">
                    {viewMode==='Design'?(<option value="plan">Plan</option>):''}
                    {viewMode==='Design'?(<option value="elevation">Elevation</option>):''}
                     {viewMode==='Design'?( <option value="xSectional">CrossSectional</option>):''}
                     {viewMode==='Design'?( <option value="layout">Layout</option>):''}
                     {viewMode==='Design'?( <option value="bim">BIM</option>):''}
                      {viewMode==='Reality'?(<option value="pointCloud">PointCloud</option>):''}
                      {viewMode==='Reality'?(<option value="orthoPhoto">OrthoPhoto</option>):''}
                    </select>
                  </div>
                  
            </div>
          ) : (
            ''
          )}
          <FontAwesomeIcon
            id="type"
            className={` flex w-full py-2  cursor-pointer ${active === 'type' ? 'selectedClass' : 'unSelectedClass'
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
            className={` w-full py-2  cursor-pointer ${active === 'layer' ? 'selectedClass' : 'unSelectedClass'
              }`}
              onClick={
                rightMenuClickHandler
              }
          ></FontAwesomeIcon>
          {active === 'layer' ? (
            <div className={`fixed   ${rightNav ? 'right-9' : 'hidden'}`}>
              <div
                className={`border  -mt-8 border-solid bg-slate-300 p-1.5 rounded `}
              >
               <ul className=" h-full text-xs"  id="items">
    <li><input onClick={LayerChange} value={"360Image"} type="checkbox" />360 Image </li>
    <li><input onClick={LayerChange} value={"360Video"} type="checkbox" />360 Video Walk</li>
    <li><input onClick={LayerChange} value={"phoneImage"} type="checkbox" />Phone Image</li>
    <li><input onClick={LayerChange} value={"arielImage"} type="checkbox" />Aerial Image </li>
    <li><input onClick={LayerChange} value={"issue"} type="checkbox" />Issue </li>
    <li><input onClick={LayerChange} value={"rfi"} type="checkbox" />RFI </li>
    <li><input onClick={LayerChange} value={"progress"} type="checkbox" />Progress</li>
    {viewMode==='Reality'?(<li><input onClick={LayerChange} value={"baseLine"} type="checkbox" />Base Lines</li>):''}
    {viewMode==='Reality'?(<li><input onClick={LayerChange} value={"cutFillAnalysis"} type="checkbox" />Cut-fill analysis</li>):''}
    {viewMode==='Reality'?(<li><input onClick={LayerChange} value={"autocadOverlay"} type="checkbox" />Autocad overlay</li>):''}
    {viewMode==='Reality'?(<li><input onClick={LayerChange} value={"boundries"} type="checkbox" />Boundaries</li>):''}
    {viewMode==='Reality'?(<li><input onClick={LayerChange} value={"contours"} type="checkbox" />Contours</li>):''}
    {viewMode==='Reality'?(<li><input onClick={LayerChange} value={"spotLevels"} type="checkbox" />Spot levels</li>):''}
    {viewMode==='Reality'?(<li><input onClick={LayerChange} value={"vegetation"} type="checkbox" />Vegetation</li>):''}
    {viewMode==='Reality'?(<li><input onClick={LayerChange} value={"gcpPoints"} type="checkbox" />GCP Points</li>):''}

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
            className={` w-full py-2  cursor-pointer ${active === 'issue' ? 'selectedClass' : 'unSelectedClass'
              }`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === "issue" ? (
            <div
              className={`fixed -mt-9 ${rightNav ? 'right-9' : 'hidden'
                }`}>
                  <div className='bg-gray-400'>
                    
                  <div className=" h-full text-xs"  id="issueItems">
    <div onClick={issueChange} id={"issueCreate"}><p>Create</p> </div>
    <div onClick={issueChange} id={"issueView"}><p>View</p> </div>
    <div onClick={issueChange} id={"issueShow"} ><p>Show</p> </div>
    <div onClick={issueChange} id={"issueHide"} ><p>Hide</p> </div>
    </div>
                  </div>
                  
            </div>
          ) : (
            ''
          )}
          
        </div>

        <div className=" cursor-pointer">
          <FontAwesomeIcon
            icon={faBullseye}
            id="task"
            className={` w-full py-2  z-10 cursor-pointer ${active === 'task' ? 'selectedClass' : 'unSelectedClass'
              }`}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === "task" ? (
            <div
              className={`fixed -mt-9 ${rightNav ? 'right-9' : 'hidden'
                }`}>
                  <div className='bg-gray-400'>
                    
                  <div className=" h-full text-xs"  id="taskItems">
    <div onClick={taskChange} id={"taskCreate"}><p>Create</p> </div>
    <div onClick={taskChange} id={"taskView"}><p>View</p> </div>
    <div onClick={taskChange} id={"taskShow"} ><p>Show</p> </div>
    <div onClick={taskChange} id={"taskHide"} ><p>Hide</p> </div>
    </div>
                  </div>
                  
            </div>
          ) : (
            ''
          )}
        </div>
        <div className=" justify-center cursor-pointer">
          <FontAwesomeIcon
            icon={faTasks}
            id="progress"
            className={` w-full py-2  cursor-pointer ${active === 'progress' ? 'selectedClass' : 'unSelectedClass'
              } `}
            onClick={rightMenuClickHandler}
          ></FontAwesomeIcon>
          {active === "progress" ? (
          <div
              className={`fixed -mt-9 ${rightNav ? 'right-9' : 'hidden'
                }`}>
                  <div className='bg-gray-400'>
                    
                  <div className=" h-full text-xs"  id="progressItems">
    <div onClick={progressChange} id={"progressCreate"}><p>Create</p> </div>
    <div onClick={progressChange} id={"progressView"}><p>View</p> </div>
    <div onClick={progressChange} id={"progressShow"} ><p>Show</p> </div>
    <div onClick={progressChange} id={"progressHide"} ><p>Hide</p> </div>
    </div>
                  </div>
                  
            </div>
          ) : (
            ''
          )}
        </div>
            {iViewMode==="Reality" ?(
              <div>
              <div className="justify-center cursor-pointer">
              <FontAwesomeIcon
                icon={faCodeBranch}
                id="designCompare"
                className={` w-full  cursor-pointer ${active === 'designCompare' ? 'selectedClass' : 'unSelectedClass'
                  }`}
                onClick={rightMenuClickHandler}
              ></FontAwesomeIcon> 
            </div>
            
            <div className="justify-center cursor-pointer">
            <FontAwesomeIcon
              icon={faArrowsSplitUpAndLeft}
              id="realityCompare"
              className={` w-full  cursor-pointer ${active === 'realityCompare' ? 'selectedClass' : 'unSelectedClass'
                }`}
              onClick={rightMenuClickHandler}
            ></FontAwesomeIcon> 
          </div>
          </div>
            
            ):('')
            }




      </div>
    </div >
  );
};

export default RightFloatingMenu;
