import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
function DatePicker() {
    return (
        <div className='ml-4 rounded-sm p-2 cursor-pointer'>
            <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>
        </div >
    )
}

export default DatePicker