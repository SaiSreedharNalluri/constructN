import Image from "next/image"
import React from "react"
import uploaderIcon from '../../../public/divami_icons/Upload_graphics.svg'
const UploadingStatus:React.FC=()=>{
    return(<React.Fragment>
         <div className='w-[10%] h-[5%] md:w-[109.78px] md:h-[104px]'>
      <Image src={uploaderIcon} alt={"uploader icon"} className='h-[70%] w-[70%] md:h-[66.94px] md:w-[66.94px]' />
    </div>
    </React.Fragment>)

}
export default UploadingStatus