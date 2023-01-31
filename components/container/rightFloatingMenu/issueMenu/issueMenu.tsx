import {
  faCirclePlus,
  faList,
  faEyeSlash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React, { useState } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from '../../datePicker';
import IssueCreate from './issueCreate';
import IssueList from './issueList';
import { ITools } from '../../../../models/ITools';
import { Issue } from '../../../../models/Issue';
import { ISnapshot } from '../../../../models/ISnapshot';
import { IStructure } from '../../../../models/IStructure';

interface IProps {
  issueMenuClicked: (a: ITools) => void;
  issueLayer?: boolean;
  issuesList: Issue[];
  handleOnFilter: (formData: object) => void;
  currentStructure:IStructure;
  currentSnapshot:ISnapshot;
  currentProject:string;
}

const IssueMenu: React.FC<IProps> = ({
  issueMenuClicked,
  issueLayer,
  issuesList,
  handleOnFilter,
  currentProject,
  currentSnapshot,
  currentStructure
}) => {
  const [listOverlay, setListOverlay] = useState(false);
  const [createOverlay, setCreateOverlay] = useState(false);
  const [issueVisbility, setIssueVisibility] = useState(
    issueLayer === undefined ? false : issueLayer
  );
  const [myProject,setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  let issueMenuInstance: ITools = { toolName: 'issue', toolAction: '' };
  useEffect(
    ()=>{

      setMyProject(currentProject);
      setMyStructure(currentStructure);
      setMySnapshot(currentSnapshot);
    },
    [currentProject,currentSnapshot,currentStructure]
  );
  const issueSubmit=(formdata: any)=>{
    issuesList.push(formdata);
    issueMenuInstance.toolAction = 'issueCreated';
    setCreateOverlay(false);
    issueMenuClicked(issueMenuInstance);
  }
  const openIssueCreate = () => {
    setCreateOverlay(true);
    issueMenuInstance.toolAction = 'issueCreate';
    issueMenuClicked(issueMenuInstance);
  };
  const closeIssueCreate = () => {
    issueMenuInstance.toolAction = 'issueCreateClose';
    setCreateOverlay(false);
    issueMenuClicked(issueMenuInstance);
  };
  const openIssueList = () => {
    setListOverlay(true);
    issueMenuInstance.toolAction = 'issueView';
    issueMenuClicked(issueMenuInstance);
  };
  const closeIssueList = () => {
    setListOverlay(false);
    issueMenuInstance.toolAction = 'issueViewClose';
    issueMenuClicked(issueMenuInstance);
  };
  const toggleIssueVisibility = () => {
    setIssueVisibility(!issueVisbility);
    if (issueVisbility) issueMenuInstance.toolAction = 'issueHide';
    else issueMenuInstance.toolAction = 'issueShow';
    issueMenuClicked(issueMenuInstance);
  };
  
  return (
    <div className="">
      <div className={` border border-solid bg-slate-300 p-1.5 rounded`}>
        <div className="flex justify-between">
          <FontAwesomeIcon
            onClick={openIssueCreate}
            icon={faCirclePlus}
            className="cursor-pointer"
          ></FontAwesomeIcon>
          <IssueCreate
            handleIssueSubmit={issueSubmit}
            visibility={createOverlay}
            closeOverlay={closeIssueCreate}
            currentProject={myProject}
            currentStructure={myStructure}
            currentSnapshot={mySnapshot}
          ></IssueCreate>
          <FontAwesomeIcon
            icon={faList}
            className="mx-2 cursor-pointer"
            onClick={openIssueList}
          ></FontAwesomeIcon>
          <IssueList
            issuesList={issuesList}
            visibility={listOverlay}
            closeOverlay={closeIssueList}
            handleOnFilter={handleOnFilter}
          ></IssueList>
          <FontAwesomeIcon
            icon={issueVisbility ? faEye : faEyeSlash}
            className="cursor-pointer"
            onClick={toggleIssueVisibility}
          ></FontAwesomeIcon>
        </div>
      </div>
    </div>
  );
};
export default IssueMenu;
