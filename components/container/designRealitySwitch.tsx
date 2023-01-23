import React from 'react'


const DesignRealitySwitch: React.FC = () => {

    return (
        <div className='px-1 rounded-lg  bg-gray-300 flex gap-1 cursor-pointer'>
         <div className='selectedClass'><p>Design</p></div>
         <div><p>Reality</p></div>
        </div >
    )
}

export default DesignRealitySwitch