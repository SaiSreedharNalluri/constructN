import React, { useState, useRef } from 'react'
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
const Pagination: React.FC = () => {
    const [snDetails, setSnDetails] = useState(false);
    const snBoxRef: any = useRef();
    const openSearch = () => {
        if (!snDetails) {
            snBoxRef.current.style.width = '25%';
            snBoxRef.current.style.height = '100%';
        }
    };
    const closeSearch = () => {
        snBoxRef.current.style.width = '0';
    };

    return (
        <>
            < div className="flex justify-between">
                <div className='flex' onClick={openSearch} >
                    <div className='  py-2 px-1  ' >
                        <span>&laquo;</span>
                    </div>
                    <div className=' flex items-center mr-1'>
                        <p>{"10 - 1 - 2023"}</p>
                    </div>
                    <div className="flex items-center rounded  ">
                        <input type="radio" name="bordered-radio" className="w-3 h-4 cursor-pointer text-blue-600" />
                    </div>
                    <div className="flex items-center rounded pl-1 ">
                        <input type="radio" name="bordered-radio" className="w-3 h-4 cursor-pointer" />
                    </div>
                    <div className="flex items-center  rounded pl-1 ">
                        <input type="radio" name="bordered-radio" className="w-3 h-4 cursor-pointer" />
                    </div>
                    <div className="flex items-center rounded pl-1 cursor-pointer">
                        <input type="radio" name="bordered-radio" className="w-3 h-4 cursor-pointer" />
                    </div>
                    <div className="flex items-center rounded pl-1 cursor-pointer">
                        <input type="radio" name="bordered-radio" className="w-3 h-4 cursor-pointer" />
                    </div>
                    <div className="flex items-center rounded pl-1 cursor-pointer">
                        <input type="radio" name="bordered-radio" className="w-3 h-4 cursor-pointer" />
                    </div>
                    <div className="flex items-center rounded pl-1 cursor-pointer">
                        <input type="radio" name="bordered-radio" className="w-3 h-4 cursor-pointer" />
                    </div>
                    <div className="flex items-center rounded pl-1 cursor-pointer">
                        <input type="radio" name="bordered-radio" className="w-3 h-4 cursor-pointer" />
                    </div>

                    <div className="flex items-center rounded pl-1 cursor-pointer">
                        <input type="radio" name="bordered-radio" className="w-3 h-4 cursor-pointer" />
                    </div>
                    <div className="flex items-center rounded pl-1 cursor-pointer">
                        <input type="radio" name="bordered-radio" className="w-3 h-4 cursor-pointer" />
                    </div>

                    <div className='flex items-center ml-1 '>
                        <p>{"11 - 1 - 2023"}  </p>
                    </div>
                    <div className=' flex items-center ml-1 ' >
                        <span>&raquo;</span>
                    </div>
                </div>
            </div>
            <div ref={snBoxRef} className={`fixed w-0  bg-white  top-8  right-0 z-10 overflow-x-hidden`}>
                <div className='h-6 border-y border-solid border-gray-400'>
                    <FontAwesomeIcon icon={faTimes} onClick={closeSearch} className="hover:white cursor-pointer ml-2 " ></FontAwesomeIcon>
                </div>

            </div>
        </>
    )
}

export default Pagination;