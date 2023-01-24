import React from 'react'
import Image from 'next/image';
const editPage: React.FC = () => {
    return (
        <div className="w-full bg-gray-900 h-screen">
            <div className="w-1/4 mx-auto bg-white ">
                <div className='flex w-full justify-center  text-xl font-semibold'>
                    <h1>Edit Project</h1>
                </div>
                <div className="ml-20  text-black text-xl mt-4">
                    <Image alt='' className=' w-5/12  border border-solid border-black p-4 cursor-pointer' width={1080} height={1080} src="https://constructn-projects.s3.ap-south-1.amazonaws.com/PRJ257057/coverPhoto.png"></Image>
                </div>
                <div className="flex mb-4 ">
                    <div className="w-7/12 mr-1 ml-20">
                        <label className=" text-sm font-bold mb-2">Project Name</label>
                        <input className=" border rounded w-full py-2 px-2" />
                    </div>
                </div>
                <div className="mb-4 ml-20 w-7/12">
                    <label className="text-sm font-bold mb-2" >Location (lat,long)   </label>
                    <input className="border rounded py-2 px-2 w-full" />
                </div>
                <div className="mb-4 ml-20 w-7/12">
                    <label className="text-sm font-bold mb-2" >Zone   </label>
                    <input className="border rounded py-2 px-2 w-full text-gray-500" placeholder='Type here...' />
                </div>
                <div className='mb-4 ml-20 w-7/12 '>
                    <div className=' font-semibold'>
                        <h1>Project type</h1>
                    </div>
                    <div >
                        <select className="border border-solid border-gray-300 w-full p-2  rounded">
                            <option></option>
                            <option>Residential</option>
                            <option>Pipeline</option>
                            <option>Road</option>
                            <option>Solar</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4 ml-20 w-7/12">
                    <label className="text-sm font-bold mb-2" >Project Description   </label>
                    <input className="border rounded py-2 px-2 w-full text-gray-500" placeholder='Type here...' />
                </div>

                <div className="flex w-full justify-center mt-4">
                    <button className="bg-gray-500 rounded hover:bg-gray-300 text-white font-bold py-2 px-4 w-3/12 " type="submit">
                        Save
                    </button>
                </div>

            </div>

        </div>



    )
}

export default editPage