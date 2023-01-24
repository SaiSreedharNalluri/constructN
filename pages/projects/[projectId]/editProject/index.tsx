import React from 'react'
import Image from 'next/image';
import Header from '../../../../components/container/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faRemove, faTrash } from '@fortawesome/free-solid-svg-icons';
const editPage: React.FC = () => {
    return (

        <div className='w-full h-screen' >
            <div className=''>
                <Header></Header>
            </div>

            <div className=" w-full h-full place-items-center ">
                <div className=" flex  px-4">
                    <div className="w-1/3   text-xl mt-4">
                        <div>
                            <Image alt='' className=' w-11/12  border border-solid border-black  cursor-pointer' width={1080} height={1080} src="https://constructn-projects.s3.ap-south-1.amazonaws.com/PRJ257057/coverPhoto.png"></Image>
                        </div>
                        <div className=' w-full grid grid-cols-1  gap-y-4 px-4 py-4'>
                            <h1>Add Users</h1>

                            <div>
                                <input placeholder='email ' className='w-8/12 rounded border px-2 py-1.5 border-solid border-gray-500'></input>
                            </div>
                            <div>
                                <select className="border border-solid border-gray-500 w-8/12 px-2 py-1.5 rounded">
                                    <option></option>
                                    <option>admin</option>
                                    <option>collaborator</option>
                                    <option>viewer</option>

                                </select>
                            </div>
                            <div className="flex  justify-center w-8/12 ">
                                <button className="bg-gray-500 rounded hover:bg-gray-300 text-white  py-1 px-2  ">
                                    Add User
                                </button>
                            </div>
                            <div className='h-20 overflow-y-auto w-8/12 ' >
                                <div className='flex justify-between mr-2'>
                                    <div>
                                        <p> shiva krishna </p>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon className='ml-2 text-gray-600 cursor-pointer' icon={faTrash}></FontAwesomeIcon>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="w-2/3 grid grid-cols-1  gap-y-2 px-4">
                        <div>
                            <label className=" text-sm font-bold mb-2">Project Name</label>
                            <input className=" border border-solid border-gray-500 rounded w-full py-2 px-2" />
                        </div>
                        <div >
                            <div className=' font-bold'>
                                <h1>Project type</h1>
                            </div>
                            <div >
                                <select className="border border-solid border-gray-500 w-full p-2  rounded">
                                    <option></option>
                                    <option>Residential</option>
                                    <option>Pipeline</option>
                                    <option>Road</option>
                                    <option>Solar</option>
                                </select>
                            </div>
                        </div>

                        <div >
                            <label className="text-sm font-bold mb-2" >Project Description   </label>
                            <input className="border border-solid border-gray-500 rounded py-2 px-2 w-full text-gray-500" placeholder='Type here...' />
                        </div>
                        <div >
                            <label className="text-sm font-bold mb-2" >Location (lat,long)   </label>
                            <input className=" border border-solid border-gray-500 rounded py-2 px-2 w-full" />
                        </div>
                        <div >
                            <label className="text-sm font-bold mb-2" >Zone   </label>
                            <input className="border border-solid border-gray-500 rounded py-2 px-2 w-full text-gray-500" placeholder='Type here...' />
                        </div>


                        <div className="flex  justify-center ">
                            <button className="bg-gray-500 rounded hover:bg-gray-300 text-white font-bold py-1 px-2 w-3/12 ">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default editPage