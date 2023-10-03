import React from 'react'
const Chips = (props:any) => {
    const{title,bgColor,isChip}=props;    
  return (
    <div className={`text-center text-white  text-xs`}>
   
      <p style={{ cursor:"default", display:"flex", alignItems:"center", justifyContent:"center", width: `${isChip?"72px":"30px"}`,marginRight:`${isChip?"":"10px"}`, height:`${isChip?"":"20px"}`, wordWrap: 'break-word',backgroundColor:`${bgColor}`,padding:"4px",borderRadius:"4px" }}>
          {title}
          </p>
    </div>
  )
}

export default Chips