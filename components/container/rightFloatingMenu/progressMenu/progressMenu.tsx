import { faCirclePlus, faList, faEyeSlash, faTimes, faCalendar, faDownload, faFileWaveform, faFilter, faSearch, faShieldAlt, faUser, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import DatePicker from '../../datePicker';
import { ITools } from '../../../../models/ITools';

interface IProps {
    progressMenuClicked:(a:ITools)=>void;
    progressLayer?:boolean;
  }

const ProgressMenu: React.FC <IProps>= ({progressMenuClicked,progressLayer}) => {

    const [listOverlay, setListOverlay] = useState(false);
    const [createOverlay, setCreateOverlay] = useState(false);
    const [progressVisbility,setProgressVisibility]=useState(progressLayer===undefined?false:progressLayer);
    let progressMenuInstance:ITools = {toolName:'progress',toolAction:''};

    const toggleProgressVisibility = () => {
        setProgressVisibility(!progressVisbility);
        if(progressVisbility)
        progressMenuInstance.toolAction='progressHide';
        else
        progressMenuInstance.toolAction='progressShow'
        progressMenuClicked(progressMenuInstance);
    };
    return (
        <div className=''>
            <div className={` border border-solid bg-slate-300 p-1.5 rounded`}>
                <div className="flex justify-between">
                    <FontAwesomeIcon
                        icon={progressVisbility?faEye:faEyeSlash}
                        className="cursor-pointer"
                        onClick={toggleProgressVisibility}
                    ></FontAwesomeIcon>
                </div>
            </div>
        </div>
    );
}
export default ProgressMenu;