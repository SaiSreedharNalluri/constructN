import { faCirclePlus, faList, faEyeSlash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'

import DatePicker from './datePicker';
function Issue() {
    const [overLayPanel, setOverLayPanel] = useState(false);
    const overLayPanelRef: any = useRef();
    const openSearch = () => {
        if (!overLayPanel) {
            overLayPanelRef.current.style.width = '25%';
            overLayPanelRef.current.style.height = '85%';
        }
        else {
            overLayPanelRef.current.style.width = '0%';
            // overLayPanelRef.current.style.height = '100%';
        }
        setOverLayPanel(!overLayPanel)
    };

    const onChangeData = () => {
        if (overLayPanel) {
            setOverLayPanel(false);
        } else {
            setOverLayPanel(true);
        }
    };
    console.log(overLayPanel);

    const closeSearch = () => {
        overLayPanelRef.current.style.width = '0';
    };
    return (
        <div>
            <div className={`border border-solid bg-slate-500 p-1.5 rounded -mt-8 `}>
                <div className='ml-1 flex justify-between'>
                    <FontAwesomeIcon
                        onClick={openSearch}
                        icon={faCirclePlus}
                        className="hover:white text-center cursor-pointer"
                    ></FontAwesomeIcon>
                    <div
                        ref={overLayPanelRef}
                        className={`fixed w-0 top-21     bg-gray-200 right-0 border border-solid border-black z-10 overflow-x-hidden`}
                    >
                        <div >
                            <div className='flex mt-1  h-8 justify-between border-b border-black border-solid'>
                                <div>
                                    <h1>Create Issue</h1>
                                </div>
                                <div>
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        onClick={closeSearch}
                                        className="hover:white cursor-pointer mr-2 "
                                    ></FontAwesomeIcon>
                                </div>
                            </div>
                            <div className='mt-2 ml-6 '>
                                <h1 className='text-gray-500'>Select the Type of Issue</h1>
                                <select className="border border-solid border-gray-600  rounded w-10/12 p-1 ">
                                    <option ></option>
                                    <option className='border-b'>Saftey</option>
                                    <option >Building Code</option>
                                    <option >Clash</option>
                                    <option >Comissioning</option>
                                    <option >Design</option>
                                </select>
                            </div>
                            <div className='ml-6 mt-2'>
                                <div>
                                    <h5 className='text-gray-500'>Tell us more about this Issue.</h5>
                                </div>
                                <div>
                                    <input className='rounded p-6 border border-solid border-gray-600 w-10/12'></input>
                                </div>
                            </div>
                            <div className='mt-2 ml-6 '>
                                <h1 className='text-gray-500'>Select the Type of Issue</h1>
                                <select className="border border-solid border-gray-600 rounded w-10/12 p-1 ">
                                    <option selected>Low</option>
                                    <option >High</option>
                                    <option >Medium</option>
                                </select>
                            </div>

                            <div className='ml-6 mt-2'>
                                <div>
                                    <h5 className='text-gray-500'>Assigned To</h5>
                                </div>
                                <div>
                                    <input className='rounded p-0.5 border border-solid border-gray-600 w-10/12'></input>

                                </div>
                            </div>
                            <div className=' mt-2 ml-6'>
                                <div className='flex w-10/12'>
                                    <div className='w-1/2 text-gray-500 '>
                                        Start Date
                                    </div>
                                    <div className='w-1/2 text-gray-500 '>
                                        End Date
                                    </div>
                                </div>
                                <div className='flex w-10/12 bg-white p-1 rounded   border border-solid border-gray-600'>
                                    <div className='w-1/2 text-gray-500 border-r border-solid border-gray-300'>
                                        <DatePicker></DatePicker>
                                    </div>
                                    <div className='w-1/2 text-gray-500 ml-2'>
                                        <DatePicker></DatePicker>
                                    </div>
                                </div>

                            </div>
                            <div className='ml-6 mt-2'>
                                <div>
                                    <h5 className='text-gray-500'>Enter Some Suggested Tags</h5>
                                </div>
                                <div>
                                    <input className='p-3 rounded  border border-solid border-gray-600 w-10/12'></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <FontAwesomeIcon
                        icon={faList}
                        className="hover:white text-center cursor-pointer"
                    ></FontAwesomeIcon>
                    <FontAwesomeIcon
                        icon={faEyeSlash}
                        className="hover:white text-center cursor-pointer"
                    ></FontAwesomeIcon>

                </div>
            </div>
        </div>
    )
}

export default Issue