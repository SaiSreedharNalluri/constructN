import { faEyeSlash, faGreaterThan, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'

function OverLayPanel(props: { closeSearch: any, overLayPanelRef: any }) {

    return (
        <div
            ref={props.overLayPanelRef}
            className={`fixed w-0 top-8 bg-gray-100  right-0 z-10 overflow-x-hidden`}
        >
            <div className="h-6">
                <FontAwesomeIcon
                    icon={faTimes}
                    onClick={props.closeSearch}
                    className="hover:white cursor-pointer ml-2 "
                ></FontAwesomeIcon>

            </div>
        </div>
    )
}

export default OverLayPanel