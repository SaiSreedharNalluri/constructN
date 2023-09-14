import React from 'react'
import { setTheFormatedDate } from "../../../utils/ViewerDataUtils";
import moment from 'moment';

const Chips = (props:any) => {
    const{title,bgColor,date,captureTime}=props;
    console.log(date,"date");
    
  return (
    <div className={`text-center text-white  text-xs`}>
        <div style={{ cursor:"default", maxWidth: '100px', wordWrap: 'break-word',backgroundColor:`${bgColor}`,padding:"4px",borderRadius:"4px" }}>
          {title}
          <p className='mt-[2px]'>  {captureTime? moment(date).format("DD MMM YYYY")  :""}</p> 
          </div>
      
    </div>
  )
}

export default Chips