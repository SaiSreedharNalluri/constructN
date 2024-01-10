import {
  faCirclePlus,
  faList,
  faEyeSlash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import IssueCreate from './issueCreate';
import IssueList from './issueList';
import { ITools } from '../../../../models/ITools';
import { Issue } from '../../../../models/Issue';
import { ISnapshot } from '../../../../models/ISnapshot';
import { IStructure } from '../../../../models/IStructure';
import createIssue from "../../../../public/icons/plus-circle.svg";
import list from "../../../../public/icons/listIconInToolbar.svg";
import issuesVisible from "../../../../public/icons/issuesInToolbar.svg";
import issuesHidden from "../../../../public/icons/issuesHiddenInToolbar.svg";
import Image from 'next/image';
interface IProps {
  issueMenuClicked: (a: ITools) => void;
  issueLayer?: boolean;
  issuesList: Issue[];
  handleOnFilter: (formData: object) => void;
  currentStructure: IStructure;
  currentSnapshot: ISnapshot;
  currentProject: string;
  closeFilterOverlay: () => void;
}

const IssueMenu: React.FC<IProps> = ({
  issueMenuClicked,
  issueLayer,
  issuesList,
  handleOnFilter,
  currentProject,
  currentSnapshot,
  currentStructure,
  closeFilterOverlay,
}) => {
  const [listOverlay, setListOverlay] = useState(false);
  const [createOverlay, setCreateOverlay] = useState(false);
  const [issueVisbility, setIssueVisibility] = useState(
    issueLayer === undefined ? false : issueLayer
  );
  const [myProject, setMyProject] = useState(currentProject);
  const [myStructure, setMyStructure] = useState<IStructure>(currentStructure);
  const [mySnapshot, setMySnapshot] = useState<ISnapshot>(currentSnapshot);
  let issueMenuInstance: ITools = { toolName: 'issue', toolAction: '' };
  useEffect(() => {
    setMyProject(currentProject);
    setMyStructure(currentStructure);
    setMySnapshot(currentSnapshot);
  }, [currentProject, currentSnapshot, currentStructure]);

  const issueSubmit = (formdata: any) => {
    issuesList.push(formdata);
    issueMenuInstance.toolAction = 'issueCreated';
    setCreateOverlay(false);
    issueMenuClicked(issueMenuInstance);
  };
  const openIssueCreate = () => {
    //setCreateOverlay(true);
    issueMenuInstance.toolAction = 'issueCreate';
    issueMenuClicked(issueMenuInstance);
  };
  const closeIssueCreate = () => {
    issueMenuInstance.toolAction = 'issueCreateClose';
    setCreateOverlay(false);
    issueMenuClicked(issueMenuInstance);
  };
  const openIssueList = () => {
    //setListOverlay(true);
   
    issueMenuInstance.toolAction = 'issueView';
    issueMenuClicked(issueMenuInstance);
  };
  const closeIssueList = () => {
    //setListOverlay(false);
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
          <Image alt='' onClick={openIssueCreate} className="cursor-pointer " src={createIssue}></Image>
          {/* <IssueCreate
            handleIssueSubmit={issueSubmit}
            visibility={createOverlay}
            closeOverlay={closeIssueCreate}
            currentProject={myProject}
            currentStructure={myStructure}
            currentSnapshot={mySnapshot}
          ></IssueCreate> */}
          <Image alt='' onClick={openIssueList} className="cursor-pointer mx-2 " src={list}></Image>
          {/* <IssueList
            closeFilterOverlay={closeFilterOverlay}
            issuesList={issuesList}
            visibility={listOverlay}
            closeOverlay={closeIssueList}
            handleOnFilter={handleOnFilter}
          ></IssueList> */}
          {issueVisbility ? <Image alt='' className="cursor-pointer " src={issuesVisible} onClick={toggleIssueVisibility} ></Image> : <Image alt='' src={issuesHidden} onClick={toggleIssueVisibility} ></Image>}
        </div>
      </div>
    </div>
  );
};
export default IssueMenu;
