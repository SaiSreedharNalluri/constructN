import React from 'react'

const Chips = (props:any) => {
    const{title,bgColor}=props;
    
  return (
    <div className={`text-center text-white  text-xs`}>
        <p style={{ maxWidth: '100px', wordWrap: 'break-word',backgroundColor:`${bgColor}`,padding:"4px",borderRadius:"4px" }}>{title}</p>
    </div>
  )
}

export default Chips