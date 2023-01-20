import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';

const HotSpots: React.FC = () => {
    return (
        <div className='ml-1.5  '>
            <FontAwesomeIcon
                className={`  bg-gray-300 p-1.5 `}
                icon={faEyeSlash}
            ></FontAwesomeIcon>
        </div>
    )
}

export default HotSpots