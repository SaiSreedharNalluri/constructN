import {
  faCirclePlus,
  faList,
  faEyeSlash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import TaskCreate from './taskCreate';
import TaskList from './taskList';
import { ITools } from '../../../../models/ITools';
import { ITasks } from '../../../../models/Itask';

interface IProps {
  taskMenuClicked: (a: ITools) => void;
  taskLayer?: boolean;
  handleTaskSubmit: (formObj: object) => void;
  tasksList: ITasks[];
}

const IssueMenu: React.FC<IProps> = ({
  taskMenuClicked,
  taskLayer,
  handleTaskSubmit,
  tasksList,
}) => {
  const [listOverlay, setListOverlay] = useState(false);
  const [createOverlay, setCreateOverlay] = useState(false);
  const [taskVisbility, setTaskVisibility] = useState(
    taskLayer === undefined ? false : taskLayer
  );
  let taskMenuInstance: ITools = { toolName: 'task', toolAction: '' };
  const openTaskCreate = () => {
    setCreateOverlay(true);
    taskMenuInstance.toolAction = 'taskCreate';
    taskMenuClicked(taskMenuInstance);
  };
  const closeTaskCreate = () => {
    console.log('calling', createOverlay);
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
          <TaskCreate
            handleTaskSubmit={handleTaskSubmit}
            visibility={createOverlay}
            closeOverlay={closeTaskCreate}
          ></TaskCreate>
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
