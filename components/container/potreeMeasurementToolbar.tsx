import React, { useEffect, useState } from "react";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import TimelineIcon from "@mui/icons-material/Timeline";
import CropIcon from "@mui/icons-material/Crop";
import HeightIcon from "@mui/icons-material/Height";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import Tooltip from "@mui/material/Tooltip";
const PotreeMeasurementToolbar = () => {
  return ( 
    <div className="absolute top-1/2 right-[10px] z-1 cursor-pointer">
     <div
        className="mt-[4px] bg-white  text-center rounded-[4px]"
        style={{ boxShadow: "-2px 0px 1px rgba(0, 0, 0, 0.25)" }}
        id="rahmanMeasurement"
      >
        <div id="rahmanMeasure_point" className='hover:text-[#FF843F]  group'>
          <Tooltip title="Point" placement="left">
            <GpsFixedIcon 
              className={`mt-1 mx-1  text-[#36415D]  text-hover-color `}
              style={{ width: 32, height: 32 }}
            />
    </Tooltip>
        </div>
   
          <div id="rahmanMeasure_distance" className="hover:text-[#FF843F] group">
          <Tooltip title="Distance" placement="left">
            <TimelineIcon 
              className={`my-1 mx-2  text-[#36415D] text-hover-color `}
              style={{ width: 32, height: 32 }}
            />
             </Tooltip>
          </div>
          <div id="rahmanMeasure_area" className="hover:text-[#FF843F] group">
        <Tooltip title="Area" placement="left">

            <CropIcon 
              className={`my-1 mx-2 text-[#36415D] text-hover-color`}
              style={{ width: 32, height: 32 }}
            />
        </Tooltip>
        </div>
        <div id="rahmanMeasure_height" className="hover:text-[#FF843F] group">
        <Tooltip title="Height" placement="left">    
            <HeightIcon 
              className={`my-1 mx-2 text-[#36415D] text-hover-color`}
              style={{ width: 32, height: 32 }}
            />       
        </Tooltip>
        </div>
        <div id="rahmanMeasure_clear" className="hover:text-[#FF843F] group">
        <Tooltip title="Clear" placement="left">
            <ClearIcon 
              className={`my-1 mx-2 text-[#36415D]  text-hover-color`}
              style={{ width: 32, height: 32 }}
            />
         
        </Tooltip>
        </div>
 
    
      </div>
    </div>
  );
};

export default PotreeMeasurementToolbar;
