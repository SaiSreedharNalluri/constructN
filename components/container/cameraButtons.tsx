import React, { useState } from 'react'
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { Tooltip } from '@mui/material';
const CameraButtons = () => {
const[isEnabled,setEnabled]=useState<boolean>(false)
const toggleCamera=()=>{
    setEnabled(!isEnabled)
  }
  return (
    <div
    className=" bg-white  text-center rounded-[4px] absolute top-1/2 right-[10px] -mt-[32px] z-1 cursor-pointer"
    style={{ boxShadow: "-2px 0px 1px rgba(0, 0, 0, 0.25)" }}
  >
    <div  className='hover:text-[#FF843F]  group'>
        {isEnabled?
         <Tooltip title="3D" placement="left">
        <NoPhotographyIcon 
          className={` mx-2  text-[#36415D]  text-hover-color `}
          style={{ width: 32, height: 32 }}
          onClick={toggleCamera}
        />
        </Tooltip>
        :
        <Tooltip title="Photo" placement="left">
        <CameraAltIcon 
        className={` mx-2  text-[#36415D]  text-hover-color `}
        style={{ width: 32, height: 32 }} onClick={toggleCamera}/>
         </Tooltip>
        }
     

    </div>
    </div>
  )
}

export default CameraButtons