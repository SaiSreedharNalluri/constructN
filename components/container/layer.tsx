import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
const Layer: React.FC = () => {
    return (
        <div className='bg-gray-400'>
            <div className='ml-2  py-2 '>
                <h5 className='text-gray-900'>media</h5>
                <button className='pl-2 mt-2 w-1/4 group flex justify-between items-baseline bg-gray-300 focus:outline-none shadow text-black rounded focus:ring ring-gray-200'>
                    <p >All</p>
                    <span className='border-1 p-1 hover:bg-gray-100'>
                        <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
                    </span>
                </button>
                {/* <div className=' text-black'>
                <input type="text" placeholder='All' className='bg-white p-1 ml-2 rounded-sm text-black' />
            </div> */}
                <div className='mt-2  '>
                    <h1>Layers</h1>
                    <div className='flex mt-2'>
                        <input type="checkbox" />
                        <div className='ml-2 text-black'>
                            <p>ortho-photo</p>
                        </div>
                    </div>
                    <div className='flex'>
                        <input type="checkbox" />
                        <div className='ml-2 text-black' >
                            <p>Terrain</p>
                        </div>
                    </div>
                    <div className='flex'>
                        <input type="checkbox" />
                        <div className='ml-2 text-black ' >
                            <p>Elevation map</p>
                        </div>
                    </div>
                    <div className='flex'>
                        <input type="checkbox" />
                        <div className='ml-2 text-black'>
                            <p>Gradient map</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layer