import {
  faTimes,
  faSearch,
  faFilter,
  faDownload,
  faShieldAlt,
  faUser,
  faCalendar,
  faFileWaveform,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ITasks } from '../../../../models/Itask';
import Moment from 'moment';
interface IProps {
  closeOverlay: () => void;
  visibility: boolean;
  tasksList: ITasks[];
}
const TaskList: React.FC<IProps> = ({
  visibility,
  closeOverlay,
  tasksList,
}) => {
  const closeTaskView = () => {
    closeOverlay();
  };
  return (
    <div
      className={`fixed ${
        visibility ? 'w-1/4 calc-h' : 'w-0'
      } top-10     bg-gray-200 right-0 z-10 overflow-x-hidden`}
    >
      <div className="h-93 overflow-y-auto ">
        <div className="flex justify-between border-b border-black border-solid">
          <div>
            <h1>Task List</h1>
          </div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={closeTaskView}
              className=" mr-2  rounded-full border border-black"
            ></FontAwesomeIcon>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
          </div>
          <div className="flex justify-between text-gray-800">
            <div className="mr-2">
              {' '}
              <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
            </div>
            <div className="mr-2">
              {' '}
              <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
            </div>
            <div className="mr-2">
              {' '}
              <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>{' '}
            </div>
          </div>
        </div>
        {tasksList &&
          tasksList.map((taskInfo: ITasks) => {
            return (
              <div className="h-full mt-2 w-full" key={taskInfo._id}>
                <div className=" h-1/12 w-11/12  m-auto ">
                  <div className=" m-auto ">
                    <div className=" bg-white border border-solid border-gray-400 rounded">
                      <div className="flex mt-2">
                        <div>
                          <FontAwesomeIcon
                            className="text-3xl text-gray-400"
                            icon={faShieldAlt}
                          ></FontAwesomeIcon>
                        </div>
                        <div className="flex-col ml-2 text-gray-600">
                          <div>
                            <h5>{taskInfo.title}</h5>
                          </div>
                          <div className="flex">
                            <p className="mr-1">{taskInfo.status}</p>|
                            <p className="ml-1">{taskInfo.priority}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex mt-2 ml-3">
                        <div className="flex">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="text-gray-500 "
                          ></FontAwesomeIcon>
                          <p className="text-gray-500 -mt-1 ml-1">
                            {taskInfo.assignees[0].firstName}
                          </p>
                          <FontAwesomeIcon
                            icon={faCalendar}
                            className="text-gray-500 ml-2"
                          />
                          <p className="text-gray-500 -mt-1 ml-1">
                            {Moment(taskInfo.createdAt).format('MMM Do YYYY')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TaskList;
