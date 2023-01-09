import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faSearchMinus } from "@fortawesome/free-solid-svg-icons";
import { faSearchPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faGreaterThan, faAngleDown } from "@fortawesome/free-solid-svg-icons";
const RightOverLay: React.FC = () => {
    return (
        <div className='w-1/2 flex-col m-auto '>
            <div className='mt-3 cursor-pointer'>
                <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
            </div>
            <div className='mt-3 cursor-pointer'>
                <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
            </div>
            <div className='mt-3 cursor-pointer'>
                <FontAwesomeIcon icon={faCircleUser}></FontAwesomeIcon>
            </div>
            <div className='mt-3 cursor-pointer'>
                <FontAwesomeIcon icon={faGreaterThan}></FontAwesomeIcon>
            </div>
            <div className='mt-3 cursor-pointer'>
                <FontAwesomeIcon icon={faSearchMinus}></FontAwesomeIcon>
            </div>
            <div className='mt-3 cursor-pointer'>
                <FontAwesomeIcon icon={faSearchPlus}></FontAwesomeIcon>
            </div>
            <div className='mt-3 cursor-pointer'>
                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </div>
            <div className='mt-3 cursor-pointer'>
                <FontAwesomeIcon icon={faGreaterThan}></FontAwesomeIcon>
            </div>
            <div className='mt-3 cursor-pointer'>
                <FontAwesomeIcon icon={faCircleUser}></FontAwesomeIcon>
            </div>
        </div>
    )
}

export default RightOverLay