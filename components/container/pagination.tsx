import React, { useState, useRef } from 'react'
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faTimes } from "@fortawesome/free-solid-svg-icons";
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
                    <div className='relative  py-2 px-1  border-0 bg-transparent outline-none transition-all duration-300' >
                        <span>&laquo;</span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 '>
                        <p>{"10 - 1 - 2023"}  </p>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 ' >
                        <span className='h-2 w-2 rounded-full inline-block hover:bg-black  bg-white'></span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 ' >
                        <span className='h-2 w-2 rounded-full inline-block hover:bg-black  bg-white'></span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 ' >
                        <span className='h-2 w-2 rounded-full inline-block hover:bg-black  bg-white'></span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 ' >
                        <span className='h-2 w-2 rounded-full inline-block hover:bg-black  bg-white'></span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 ' >
                        <span className='h-2 w-2 rounded-full inline-block hover:bg-black  bg-white'></span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 ' >
                        <span className='h-2 w-2 rounded-full inline-block hover:bg-black  bg-white'></span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 ' >
                        <span className='h-2 w-2 rounded-full inline-block hover:bg-black  bg-white'></span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 ' >
                        <span className='h-2 w-2 rounded-full inline-block hover:bg-black  bg-white'></span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 ' >
                        <span className='h-2 w-2 rounded-full inline-block hover:bg-black  bg-white'></span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 ' >
                        <span className='h-2 w-2 rounded-full inline-block hover:bg-black  bg-white'></span>
                    </div>
                    <div className=' relative  py-2  px-1  border-0 bg-transparent outline-none transition-all duration-300 '>
                        <p>{"11 - 1 - 2023"}  </p>
                    </div>
                    <div className=' className=" relative block py-2  px-1  border-0 bg-transparent ' >
                        <span>&raquo;</span>
                    </div>
                </div>
                {/* <div>
                <ul className="flex">
                    <li >
                        <a
                            className=" relative block py-2   border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>&laquo;</span>
                        </a></li>
                    <p className=" relative block py-2  px-2">{"06Jan'22"}</p>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>1</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>2</span>
                        </a></li>

                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>3</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>4</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>5</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>6</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>7</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>8</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>9</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>10</span>
                        </a></li>
                    <p className=" relative block py-2  px-2">{"06Jan'22"}</p>
                    <li >
                        <a
                            className=" relative block py-2    border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>&raquo;</span>
                        </a></li>
                </ul>
            </div> */}
                <Form.Group controlId="dob" className='mt-2'>
                    <Form.Control
                        type="date"
                        name="dob"
                    />
                </Form.Group>

            </div>
            <div ref={snBoxRef} className={`fixed w-0  bg-white bg-opacity-60 top-8  right-0 z-10 overflow-x-hidden`}>
                <FontAwesomeIcon icon={faTimes} onClick={closeSearch} className="hover:white cursor-pointer ml-2 " ></FontAwesomeIcon>
                <>

                </>

            </div>
        </>
    )
}

export default Pagination;