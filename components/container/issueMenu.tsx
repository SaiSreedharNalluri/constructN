import { faCirclePlus, faList, faEyeSlash, faTimes, faCalendar, faDownload, faFileWaveform, faFilter, faSearch, faShieldAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import DatePicker from './datePicker';
import IssueCreate from './issueCreate';
import IssueList from './issueList';

const IssueMenu: React.FC = () => {

    const [listOverLay, setListOverLay] = useState(false);
    const listOverLayRef: any = useRef();
    const [overLayPanel, setOverLayPanel] = useState(false);
    const overLayPanelRef: any = useRef();
    const openSearch = () => {
        if (!overLayPanel) {
            overLayPanelRef.current.style.width = '25%';
            overLayPanelRef.current.style.height = '100%';
        } else {
            overLayPanelRef.current.style.width = '0%';
        }
        setOverLayPanel(!overLayPanel);
    };
    const closeSearch = () => {
        overLayPanelRef.current.style.width = '0';
    };
    const openList = () => {
        if (!listOverLay) {
            listOverLayRef.current.style.width = '25%';
            listOverLayRef.current.style.height = '100vh';
        } else {
            listOverLayRef.current.style.width = '0%';
        }
        setListOverLay(!listOverLay);
    };
    const closeList = () => {
        listOverLayRef.current.style.width = '0';
    };
    return (
        <div className=''>
            <div className={`border border-solid bg-slate-300 p-1.5 rounded -mt-8 `}>
                <div className="relative flex justify-between">
                    <FontAwesomeIcon
                        onClick={openSearch}
                        icon={faCirclePlus}
                        className="cursor-pointer mr-2"
                    ></FontAwesomeIcon>
                    <IssueCreate overLayPanelRef={overLayPanelRef} closeSearch={closeSearch}></IssueCreate>
                    <FontAwesomeIcon
                        icon={faList}
                        className="mr-2 cursor-pointer"
                        onClick={openList}
                    ></FontAwesomeIcon>
                    <IssueList listOverLayRef={listOverLayRef} closeList={closeList} ></IssueList>
                    <FontAwesomeIcon
                        icon={faEyeSlash}
                        className="cursor-pointer"
                    ></FontAwesomeIcon>
                </div>
            </div>
        </div>
    );
}
export default IssueMenu;