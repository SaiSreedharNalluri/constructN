import {Grid} from '@mui/material'
import React, { ChangeEvent, useRef, useState } from 'react'
import Image from "next/image";
import axios from 'axios';
import uploaderIcon from "../../../../../public/divami_icons/Upload_graphics.svg";
import { updateProjectCover } from '../../../../../services/project';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
const ProjectImageUpload = ({selectedprojectImage,
  onprojectImageFileChange,  selectedCoverFile,
  onFileCoverPhotoChange}:any) => {
  const projectImageRef = useRef<HTMLInputElement>(null);
  const coverPhotoRef = useRef<HTMLInputElement>(null);
  
  const handleprojectImageClick = () => {
    if (projectImageRef?.current) {
      projectImageRef.current?.click();
    }
  };
  const handlecoverPhotoClick = () => {
    if (coverPhotoRef?.current) {
      coverPhotoRef.current?.click();
    }
  };
  const handleProjectImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      onprojectImageFileChange(files[0]); 
    }
  };
  const handleProjectCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      onFileCoverPhotoChange(files[0]);  
    }
  };
  
  return (
    <>
    {selectedprojectImage?
    <Grid xs={12} item className=' border border-dotted border-orange-500  mt-[16px] cursor-pointer rounded-[6px]' >
      <div style={{ position: 'relative' }}>
      <Image
       src={URL.createObjectURL(selectedprojectImage)}
       alt='uploader icon'
       width={50}
       height={50}
       className='w-full h-[120px]'
     />
     <div >
     <CloseIcon   onClick={()=>{onprojectImageFileChange("")}} className='absolute top-0 right-0 m-0 bg-[#FF853E]  rounded-full p-[6px] h-[28px] w-[28px] text-white'/>

     </div>
   
     <EditIcon   height={34} onClick={handleprojectImageClick} 
     className='absolute top-0 left-0 m-0 bg-[#FF853E] rounded-full p-[6px] h-[28px] text-white w-[28px] '
     >
     </EditIcon>
   

      <input
       type='file'
       className='hidden'
       ref={projectImageRef}
       onChange={handleProjectImageFileChange}
     /> 
      </div>

     </Grid>:
      <Grid xs={12} item className='flex flex-col justify-center items-center border border-dotted border-orange-500 p-[10px] mt-[16px] cursor-pointer rounded-[6px]' onClick={handleprojectImageClick}>
        <Image
       src={uploaderIcon}
       alt='uploader icon'
       width={50}
       height={50}
     />
       <div className='flex justify-center items-center'>
         <p className='text-gray-500 mt-[6px]'>
            Project Image
         </p>
       </div>
       <input
         type='file'
         className='hidden'
         ref={projectImageRef}
         onChange={handleProjectImageFileChange}
       />
       </Grid>
     }
     {selectedCoverFile?
    <Grid xs={12} item className=' border border-dotted ml-[10px] border-orange-500  mt-[16px] cursor-pointer rounded-[6px]' >
      <div style={{ position: 'relative' }}>
      <Image
       src={URL.createObjectURL(selectedCoverFile)}
       alt='uploader icon'
       width={50}
       height={50}
       className='w-full h-[120px]'
     />
     <CloseIcon   onClick={()=>{onFileCoverPhotoChange("")}} className='absolute top-0 right-0 m-0 bg-[#FF853E]  rounded-full p-[6px] h-[28px] w-[28px] text-white'/>
     <EditIcon  onClick={handlecoverPhotoClick} 
     className='absolute top-0 left-0 m-0 bg-[#FF853E] rounded-full p-[6px] h-[28px] text-white w-[28px] '
     >
     </EditIcon>


     <input
       type='file'
       className='hidden'
       ref={coverPhotoRef}
       onChange={handleProjectCoverFileChange}
     />
      </div>

     </Grid>:
      <Grid xs={12} item className='flex flex-col ml-[10px] justify-center items-center border border-dotted border-orange-500 p-[10px] mt-[16px] cursor-pointer rounded-[6px]' onClick={handlecoverPhotoClick}>
        <Image
       src={uploaderIcon}
       alt='uploader icon'
       width={50}
       height={50}
     />
       <div className='flex justify-center items-center'>
         <p className='text-gray-500 mt-[6px]'>
         Project/Company Logo
         </p>
       </div>
       <input
         type='file'
         className='hidden'
         ref={coverPhotoRef}
         onChange={handleProjectCoverFileChange}
       />
       </Grid>
     }
    </>
  )
}

export default ProjectImageUpload