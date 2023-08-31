import React from "react";
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
        <Tooltip title="Point" placement="left">
          <div >
            <GpsFixedIcon id="rahmanMeasure_point"
              className={`pt-2 mx-1  text-[#36415D] hover:text-[#FF843F] `}
              style={{ width: 32, height: 32 }}
            />
          </div>
        </Tooltip>
        <Tooltip title="Distance" placement="left">
          <div >
            <TimelineIcon id="rahmanMeasure_distance"
              className={`my-1 mx-2  text-[#36415D] hover:text-[#FF843F]`}
              style={{ width: 32, height: 32 }}
            />
          </div>
        </Tooltip>
        <Tooltip title="Area" placement="left">
          <div >
            <CropIcon id="rahmanMeasure_area"
              className={`my-1 mx-2 text-[#36415D] hover:text-[#FF843F]`}
              style={{ width: 32, height: 32 }}
            />
          </div>
        </Tooltip>
        <Tooltip title="Height" placement="left">
          <div >
            <HeightIcon id="rahmanMeasure_height"
              className={`my-1 mx-2 text-[#36415D] hover:text-[#FF843F]`}
              style={{ width: 32, height: 32 }}
            />
          </div>
        </Tooltip>
        <Tooltip title="Clear" placement="left">
          <div >
            <ClearIcon id="rahmanMeasure_clear"
              className={`my-1 mx-2 text-[#36415D] hover:text-[#FF843F]`}
              style={{ width: 32, height: 32 }}
            />
          </div>
        </Tooltip>
        <Tooltip title="Save" placement="left">
          <div >
            <SaveIcon id="rahmanMeasure_save"
              className={`my-1 mx-2 text-[#36415D] hover:text-[#FF843F]`}
              style={{ width: 32, height: 32 }}
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default PotreeMeasurementToolbar;
