import { faTimes, faSearch, faFilter, faDownload, faShieldAlt, faUser, faCalendar, faFileWaveform } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnyARecord } from 'dns'
import React from 'react'
interface IProps {
    closeOverlay: () => void;

    visibility:boolean;
}
const IssueList: React.FC<IProps> = ({ visibility, closeOverlay }) => {

    const closeIssueView=()=>{
       
        closeOverlay();
    }
    return (
        <div
            
            className={`fixed ${visibility?'w-/14 h-screen':'w-0'}  top-10     bg-gray-200 right-0 z-10 overflow-x-hidden`}
        >

            <div className='h-93 overflow-y-auto '>
                <div className="flex justify-between border-b border-black border-solid">
                    <div>
                        <h1>Issue List</h1>
                    </div>
                    <div>
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={closeIssueView}
                            className=" mr-2  rounded-full border border-black"
                        ></FontAwesomeIcon>
                    </div>
                </div>
                <div className='flex justify-between' >
                    <div>
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                    </div>
                    <div className='flex justify-between text-gray-800'>
                        <div className='mr-2'>  <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon></div>
                        <div className='mr-2'>  <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon></div>
                        <div className='mr-2'>  <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>  </div>
                    </div>
                </div>
                <div className='h-full w-full'>
                    <div className=' h-1/12 w-11/12  m-auto '>
                        <div className=' m-auto '>
                            <div className=' bg-white border border-solid border-gray-400 rounded'>
                                <div className='flex mt-2'>
                                    <div>
                                        <FontAwesomeIcon className='text-3xl text-gray-400' icon={faShieldAlt}></FontAwesomeIcon>
                                    </div>
                                    <div className='flex-col ml-2 text-gray-600'>
                                        <div>
                                            <h5>Safety (#407)</h5>
                                        </div>
                                        <div className='flex'>
                                            <p className='mr-1'>In-progress</p>|
                                            <p className='ml-1'>Medium</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='flex mt-2 ml-3'>
                                    <div className='flex'>
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-2" />
                                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' h-1/12 w-11/12 mt-2 m-auto '>
                        <div className='  '>
                            <div className='  bg-white border border-solid border-gray-400 rounded'>
                                <div className='flex mt-2'>
                                    <div>
                                        <FontAwesomeIcon className='text-3xl text-gray-400' icon={faShieldAlt}></FontAwesomeIcon>
                                    </div>
                                    <div className='flex-col ml-2 text-gray-600'>
                                        <div>
                                            <h5>Building Code (#410)</h5>
                                        </div>
                                        <div className='flex'>
                                            <p className='mr-1'>In-Progress</p>|
                                            <p className='ml-1'>Medium</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='flex mt-2 ml-3'>
                                    <div className='flex'>
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-2" />
                                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' h-1/12 w-11/12 mt-2 m-auto '>
                        <div className=' m-auto '>
                            <div className=' bg-white border border-solid border-gray-400 rounded'>
                                <div className='flex mt-2'>
                                    <div>
                                        <FontAwesomeIcon className='text-3xl text-gray-400' icon={faFileWaveform}></FontAwesomeIcon>
                                    </div>
                                    <div className='flex-col ml-2 text-gray-600'>
                                        <div>
                                            <h5>Clash (#407)</h5>
                                        </div>
                                        <div className='flex'>
                                            <p className='mr-1'>To-do</p>|
                                            <p className='ml-1'>Medium</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='flex mt-2 ml-3'>
                                    <div className='flex'>
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-2" />
                                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' h-1/12 w-11/12 mt-2 m-auto '>
                        <div className=' m-auto '>
                            <div className='  bg-white border border-solid border-gray-400 rounded'>
                                <div className='flex mt-2'>
                                    <div>
                                        <FontAwesomeIcon className='text-3xl text-gray-400' icon={faShieldAlt}></FontAwesomeIcon>
                                    </div>
                                    <div className='flex-col ml-2 text-gray-600'>
                                        <div>
                                            <h5>Comissioning (#302)</h5>
                                        </div>
                                        <div className='flex'>
                                            <p className='mr-1'>Blocked</p>|
                                            <p className='ml-1'>Low</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='flex mt-2 ml-3'>
                                    <div className='flex'>
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-2" />
                                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' h-1/12 w-11/12 mt-2  m-auto '>
                        <div className='  '>
                            <div className='  bg-white border border-solid border-gray-400 rounded'>
                                <div className='flex mt-2'>
                                    <div>
                                        <FontAwesomeIcon className='text-3xl text-gray-400' icon={faShieldAlt}></FontAwesomeIcon>
                                    </div>
                                    <div className='flex-col ml-2 text-gray-600'>
                                        <div>
                                            <h5>Design (#234)</h5>
                                        </div>
                                        <div className='flex'>
                                            <p className='mr-1'>Completed</p>|
                                            <p className='ml-1'>High</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='flex mt-2 ml-3'>
                                    <div className='flex'>
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-2" />
                                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' h-1/12 w-11/12 mt-2  m-auto '>
                        <div className=' m-auto '>
                            <div className=' mt-2  bg-white border border-solid border-gray-400 rounded'>
                                <div className='flex mt-2'>
                                    <div>
                                        <FontAwesomeIcon className='text-3xl text-gray-400' icon={faShieldAlt}></FontAwesomeIcon>
                                    </div>
                                    <div className='flex-col ml-2 text-gray-600'>
                                        <div>
                                            <h5>Design (#233)</h5>
                                        </div>
                                        <div className='flex'>
                                            <p className='mr-1'>Completed</p>|
                                            <p className='ml-1'>High</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='flex mt-2 ml-3'>
                                    <div className='flex'>
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-2" />
                                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' h-1/12 w-11/12 mt-2  m-auto '>
                        <div className=' m-auto '>
                            <div className=' mt-2  bg-white border border-solid border-gray-400 rounded'>
                                <div className='flex mt-2'>
                                    <div>
                                        <FontAwesomeIcon className='text-3xl text-gray-400' icon={faShieldAlt}></FontAwesomeIcon>
                                    </div>
                                    <div className='flex-col ml-2 text-gray-600'>
                                        <div>
                                            <h5>Design (#232)</h5>
                                        </div>
                                        <div className='flex'>
                                            <p className='mr-1'>Completed</p>|
                                            <p className='ml-1'>High</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='flex mt-2 ml-3'>
                                    <div className='flex'>
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-2" />
                                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default IssueList