import {
  faCirclePlus,
  faList,
  faEyeSlash,
  faTimes,
  faSearch,
  faDownload,
  faFilter,
  faShieldAlt,
  faUser,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';


import DatePicker from './datePicker';
const Issue: React.FC = () => {
  const [overLayPanel, setOverLayPanel] = useState(false);
  const [listOverLay, setLsitOverLay] = useState(false);
  const overLayPanelRef: any = useRef();
  const listOverLayRef: any = useRef();
  const openSearch = () => {
    if (!overLayPanel) {
      overLayPanelRef.current.style.width = '25%';
      overLayPanelRef.current.style.height = '100vh';
    } else {
      overLayPanelRef.current.style.width = '0%';
    }
    setOverLayPanel(!overLayPanel);
  };
  const closeSearch = () => {
    overLayPanelRef.current.style.width = '0';
  };
  const openList = () => {
    if (!listOverLay) {
      listOverLayRef.current.style.width = '30%';
      listOverLayRef.current.style.height = '100vh';
    } else {
      listOverLayRef.current.style.width = '0%';
    }
    setOverLayPanel(!listOverLay);
  };
  const closeList = () => {
    listOverLayRef.current.style.width = '0';
  };
  return (
    <div>
      <div className={`border border-solid bg-slate-300 p-1.5 rounded -mt-8 `}>
        <div className="flex justify-between">
          <FontAwesomeIcon
            onClick={openSearch}
            icon={faCirclePlus}
            className=" mr-2 cursor-pointer"
          ></FontAwesomeIcon>
          <div
            ref={overLayPanelRef}
            className={`fixed w-0 top-10     bg-gray-200 right-0 border border-solid border-black z-10 overflow-x-hidden`}
          >
            <div >
              <div className="flex  h-8 justify-between border-b border-black border-solid">
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
              <div className="mt-2 ml-6 ">
                <h1 className="text-gray-500">Select the Type of Issue</h1>
                <select className="border border-solid border-gray-600  rounded w-10/12 p-1 ">
                  <option></option>
                  <option className="border-b">Saftey</option>
                  <option>Building Code</option>
                  <option>Clash</option>
                  <option>Comissioning</option>
                  <option>Design</option>
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
                  <option selected>Low</option>
                  <option>High</option>
                  <option>Medium</option>
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
          <FontAwesomeIcon
            icon={faList}
            onClick={openList}
            className="mr-2"
          ></FontAwesomeIcon>
          <div
            ref={listOverLayRef}
            className={`fixed w-0 top-10     bg-gray-200 right-0 z-10 overflow-x-hidden`}
          >
            <div >
              <div className="flex justify-between border-b border-black border-solid">
                <div>
                  <h1>Issue List</h1>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={closeList}
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
              <div>
                <div className='w-11/12 m-auto '>
                  <div className=' mt-2  bg-white border border-solid border-gray-400 rounded'>
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
                    <div className='flex mt-2'>
                      <div className='flex'>
                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-1" />
                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                      </div>

                    </div>
                  </div>
                </div>
                <div className='w-11/12 m-auto '>
                  <div className=' mt-2  bg-white border border-solid border-gray-400 rounded'>
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
                    <div className='flex mt-2'>
                      <div className='flex'>
                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-1" />
                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                      </div>

                    </div>
                  </div>
                </div>
                <div className='w-11/12 m-auto '>
                  <div className=' mt-2  bg-white border border-solid border-gray-400 rounded'>
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
                    <div className='flex mt-2'>
                      <div className='flex'>
                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-1" />
                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                      </div>

                    </div>
                  </div>
                </div>
                <div className='w-11/12 m-auto '>
                  <div className=' mt-2  bg-white border border-solid border-gray-400 rounded'>
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
                    <div className='flex mt-2'>
                      <div className='flex'>
                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-1" />
                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                      </div>

                    </div>
                  </div>
                </div>
                <div className='w-11/12 m-auto '>
                  <div className=' mt-2  bg-white border border-solid border-gray-400 rounded'>
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
                    <div className='flex mt-2'>
                      <div className='flex'>
                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-1" />
                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                      </div>

                    </div>
                  </div>
                </div>
                <div className='w-11/12 m-auto '>
                  <div className=' mt-2  bg-white border border-solid border-gray-400 rounded'>
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
                    <div className='flex mt-2'>
                      <div className='flex'>
                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-1" />
                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                      </div>

                    </div>
                  </div>
                </div>
                <div className='w-11/12 m-auto '>
                  <div className=' mt-2  bg-white border border-solid border-gray-400 rounded'>
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
                    <div className='flex mt-2'>
                      <div className='flex'>
                        <FontAwesomeIcon icon={faUser} className="text-gray-500 "></FontAwesomeIcon>
                        <p className="text-gray-500 -mt-1 ml-1">shiva krishna</p>
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-1" />
                        <p className="text-gray-500 -mt-1 ml-1">{"Due by 03 Jan'23"}</p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
          <FontAwesomeIcon
            icon={faEyeSlash}
            className="hover:white text-center cursor-pointer"
          ></FontAwesomeIcon>
        </div>
      </div>
    </div>
  );
}

export default Issue;
