import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
const DropDown: React.FC = () => {
    return (
        <div className='mt-8 ml-4 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110     duration-300'>
            <button className='relative w-10/12 group flex justify-around items-baseline bg-gray-300 focus:outline-none shadow text-gray-600 rounded focus:ring ring-gray-200'>
                <p className=''>Block 1</p>
                <span className='border-1 p-1 hover:bg-gray-100'>
                    <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
                </span>
                <div className='absolute hidden group-focus:block top-full min-w-full w-max bg-white shadow-md mt-1 rounded '>
                    <ul className=' text-left border-rounded'>
                        <li className='px-4 py-1 hover:bg-gray-300 border-b'>list 1</li>
                        <li className='px-4 py-1 hover:bg-gray-300 border-b'>list 2</li>
                        <li className='px-4 py-1 hover:bg-gray-300 border-b'>list 3</li>
                        <li className='px-4 py-1 hover:bg-gray-300 border-b'>list 4</li>
                        <li className='px-4 py-1 hover:bg-gray-300 border-b'>list 5</li>
                    </ul>

                </div>
            </button>
        </div>
    )
}

export default DropDown;