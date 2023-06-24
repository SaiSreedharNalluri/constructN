import React, { useEffect, useState } from 'react'

interface IProps {
    designState:boolean;
    toggleDesignType:()=>void;
  }
const DesignRealitySwitch: React.FC<IProps> = ({designState,toggleDesignType}) => {
    
    if(designState===undefined)
    {
        designState= true;
    }
    // const [iDesignState,setiDesignState] = useState(designState);
    let iDesignState = designState;
     useEffect(()=>{
        
        iDesignState=designState;
    },[designState]);

    // const toggleViewType=()=>{
    //    toogleDesignType();
    // };
    return (
        <div onClick={() => toggleDesignType()} onTouchEnd={() => toggleDesignType()} className='p-1 rounded-lg  bg-gray-300 flex gap-1 cursor-pointer'>
         <div className={`p-1 rounded-lg text-[8px] ${iDesignState?'selectedClass':'unSelectedClass'}`}><p>Design</p></div>
         <div className={`p-1 rounded-lg text-[8px] ${iDesignState?'unSelectedClass':'selectedClass'}`}><p>Reality</p></div>
        </div >
    )
}

export default DesignRealitySwitch