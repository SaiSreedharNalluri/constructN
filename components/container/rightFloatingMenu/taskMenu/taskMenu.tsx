import {
  faCirclePlus,
  faList,
  faEyeSlash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from '../../datePicker';
import TaskCreate from './taskCreate';
import TaskList from './taskList';
import { ITools } from '../../../../models/ITools';
import { ITasks } from '../../../../models/Itask';
import { ISnapshot } from '../../../../models/ISnapshot';
import { IStructure } from '../../../../models/IStructure';

interface IProps {
  taskMenuClicked: (a: ITools) => void;
  taskLayer?: boolean;
  tasksList: ITasks[];
  currentStructure:IStructure;
  currentSnapshot:ISnapshot;
  currentProject:string;
}

const IssueMenu: React.FC<IProps> = ({
  taskMenuClicked,
  taskLayer,
  tasksList,
  currentProject,
  currentSnapshot,
  currentStructure,
}) => {
  const [listOverlay, setListOverlay] = useState(false);
  const [createOverlay, setCreateOverlay] = useState(false);
  const [taskVisbility, setTaskVisibility] = useState(
    taskLayer === undefined ? false : taskLayer
  );
  const [myProject,setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  let taskMenuInstance: ITools = { toolName: 'task', toolAction: '' };

  useEffect(
    ()=>{

      setMyProject(currentProject);
      setMyStructure(currentStructure);
      setMySnapshot(currentSnapshot);
   
    },
    [currentProject,currentSnapshot,currentStructure]
  );
  const taskSubmit=(formdata: any)=>{
    tasksList.push(formdata);
    taskMenuInstance.toolAction = 'taskCreated';
    setCreateOverlay(false);
    taskMenuClicked(taskMenuInstance);
  }
  const openTaskCreate = () => {
    //setCreateOverlay(true);
    taskMenuInstance.toolAction = 'taskCreate';
    taskMenuClicked(taskMenuInstance);
  };
  const closeTaskCreate = () => {
    taskMenuInstance.toolAction = 'taskCreateClose';
    setCreateOverlay(false);
    taskMenuClicked(taskMenuInstance);
  };
  const openTaskList = () => {
    setListOverlay(true);
    taskMenuInstance.toolAction = 'taskView';
    taskMenuClicked(taskMenuInstance);
  };
  const closeTaskList = () => {
    setListOverlay(false);
    taskMenuInstance.toolAction = 'taskViewClose';
    taskMenuClicked(taskMenuInstance);
  };
  const toggleTaskVisibility = () => {
    setTaskVisibility(!taskVisbility);
    if (taskVisbility) taskMenuInstance.toolAction = 'taskHide';
    else taskMenuInstance.toolAction = 'taskShow';
    taskMenuClicked(taskMenuInstance);
  };
  return (
    <div className="">
      <div className={` border border-solid bg-slate-300 p-1.5 rounded`}>
        <div className="flex justify-between">
          <FontAwesomeIcon
            onClick={openTaskCreate}
            icon={faCirclePlus}
            className="cursor-pointer"
          ></FontAwesomeIcon>
          {/* <TaskCreate
            handleTaskSubmit={taskSubmit}
            visibility={createOverlay}
            closeOverlay={closeTaskCreate}
            currentProject={myProject}
            currentStructure={myStructure}
            currentSnapshot={mySnapshot}
          ></TaskCreate> */}
          <FontAwesomeIcon
            icon={faList}
            className="mx-2 cursor-pointer"
            onClick={openTaskList}
          ></FontAwesomeIcon>
          <TaskList
            tasksList={tasksList}
            visibility={listOverlay}
            closeOverlay={closeTaskList}
          ></TaskList>
          <FontAwesomeIcon
            icon={taskVisbility ? faEye : faEyeSlash}
            className="cursor-pointer"
            onClick={toggleTaskVisibility}
          ></FontAwesomeIcon>
        </div>
      </div>
    </div>
  );
};
export default IssueMenu;
