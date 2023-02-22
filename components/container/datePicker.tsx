import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
function DatePicker() {
    return (
        <div className=' rounded-sm  cursor-pointer'>
            <FontAwesomeIcon icon={faCalendar} ></FontAwesomeIcon>
        </div >
    )
}

export default DatePicker