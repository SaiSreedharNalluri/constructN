import React from 'react'
const Chips = (props:any) => {
    const{title,bgColor,isChip}=props;    
  return (
    <div className={`text-center text-white  text-xs`}>
   
      <p style={{ cursor:"default", width: `${isChip?"72px":"30px"}`, height:`${isChip?"":"20px"}`, wordWrap: 'break-word',backgroundColor:`${bgColor}`,padding:"4px",borderRadius:"4px" }}>
          {title}
          </p>
    </div>
  )
}

export default Chips