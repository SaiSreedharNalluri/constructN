import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import DatePicker from '../../datePicker'
interface IProps {
    closeOverlay: () => void;

    visibility:boolean;
}
const IssueCreate: React.FC<IProps> = ({closeOverlay ,visibility}) => {

    const closeIssueCreate=()=>{
       
        closeOverlay();
    }
    return (
        <div
            
            className={`fixed top-10 ${visibility?'w-/14 h-screen':'w-0'}  bg-gray-200 right-0 border border-solid border-black z-10 overflow-x-hidden`}
        >
            <div >
                <div className="flex  h-8 justify-between border-b border-black border-solid">
                    <div>
                        <h1>Create Issue</h1>
                    </div>
                    <div>
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={closeIssueCreate}
                            className="hover:white cursor-pointer mr-2 "
                        ></FontAwesomeIcon>
                    </div>
                </div>
                <div className="mt-2 ml-6 ">
                    <h1 className="text-gray-500">Select the Type of Issue</h1>
                    <select className="border border-solid border-gray-600  rounded w-10/12 p-1 ">
                        
                        <option value={'safety'}>Saftey</option>
                        <option value={'buildingCode'}>Building Code</option>
                        <option value={'clash'}>Clash</option>
                        <option value={'comissioning'}>Comissioning</option>
                        <option value={'design'}>Design</option>
                    </select>
                </div>
                <div className="ml-6 mt-1">
                    <div>
                        <h5 className="text-gray-500">
                            Tell us more about this Issue.
                        </h5>
                    </div>
                    <div>
                        <textarea rows={2} className="block w-10/12 text-sm border border-solid border-gray-600 rounded-lg  "></textarea>
                    </div>
                </div>
                <div className="mt-1 ml-6 ">
                    <h1 className="text-gray-500">Select the Type of Issue</h1>
                    <select className="border border-solid border-gray-600 rounded w-10/12 p-1 ">
                        <option value={"Low"}>Low</option>
                        <option value={"High"}>High</option>
                        <option value={'Medium'}>Medium</option>
                    </select>
                </div>
                <div className="ml-6 mt-1">
                    <div>
                        <h5 className="text-gray-500">Assigned To</h5>
                    </div>
                    <div>
                        <input className="rounded p-0.5 border border-solid border-gray-600 w-10/12"></input>
                    </div>
                </div>
                <div className=" mt-1 ml-6">
                    <div className="flex w-10/12">
                        <div className="w-1/2 text-gray-500 ">Start Date</div>
                        <div className="w-1/2 text-gray-500 ">End Date</div>
                    </div>
                    <div className="flex w-10/12 bg-white p-1 rounded   border border-solid border-gray-600">
                        <div className="w-1/2 text-gray-500 border-r border-solid border-gray-300">
                            <DatePicker></DatePicker>
                        </div>
                        <div className="w-1/2 text-gray-500 ml-2">
                            <DatePicker></DatePicker>
                        </div>
                    </div>
                </div>
                <div className="ml-6 mt-1">
                    <div>
                        <h5 className="text-gray-500">Enter Some Suggested Tags</h5>
                    </div>
                    <div>
                        <textarea rows={2} className="block w-10/12 border border-solid border-gray-600 text-sm  rounded-lg  "></textarea>
                    </div>
                </div>
                <div className='w-10/12 ml-6'>
                    <button
                        type="button"

                        className="p-2 w-11/12 mt-2 bg-gray-500  rounded-md "
                    >
                        Add Issue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default IssueCreate