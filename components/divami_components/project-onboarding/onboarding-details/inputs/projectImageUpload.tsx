import {Grid} from '@mui/material'
import React, { ChangeEvent, useRef, useState } from 'react'
import Image from "next/image";
import axios from 'axios';
import uploaderIcon from "../../../../../public/divami_icons/Upload_graphics.svg";
import { updateProjectCover } from '../../../../../services/project';
import { useSignal } from '@preact/signals-react';
import { IProjects } from '../../../../../models/IProjects';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
const ProjectImageUpload = ({projectCoverPhoto,projectLogo}:any) => {
  const coverPhotoRef = useRef<HTMLInputElement>(null); 
  
  const  handleCoverPhotoClick = () => {
    if (coverPhotoRef?.current) {
      coverPhotoRef.current?.click();
    }
  };
  const handleCoverPhotoUpload = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
  projectCoverPhoto.value = event.target.files[0];
  };}
  const logoRef = useRef<HTMLInputElement>(null); 
  const  handleLogoClick = () => {
    if (logoRef?.current) {
      logoRef.current?.click();
    }
  };
  const handleLogoUpload= (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
  
      projectLogo.value = event.target.files[0];


  };}
  const handleRemoveCoverPhoto = () => {
    projectCoverPhoto.value = null;
  };
  const handleRemoveLogo = () => {
    projectLogo.value = null;
  };
  return (
    <>
  {projectCoverPhoto.value?
    <Grid xs={12} item className=' border border-dotted border-orange-500  mt-[16px] cursor-pointer rounded-[6px]' >
      <div style={{ position: 'relative' }}>
      <Image
       src={URL.createObjectURL(projectCoverPhoto.value)}
       alt='uploader icon'
       width={50}
       height={50}
       className='w-full h-[120px]'
     />
     <div >
     <CloseIcon  onClick={handleRemoveCoverPhoto} className='absolute top-0 right-0 m-0 bg-[#FF853E]  rounded-full p-[6px] h-[28px] w-[28px] text-white'/>

     </div>

     <EditIcon   height={34} onClick={handleCoverPhotoClick} 
     className='absolute top-0 left-0 m-0 bg-[#FF853E] rounded-full p-[6px] h-[28px] text-white w-[28px] '
     >
     </EditIcon>


      <input
       type='file'
       className='hidden'
       ref={coverPhotoRef}
       onChange={handleCoverPhotoUpload}
     /> 
      </div>

     </Grid>
  :<Grid xs={12} item className='flex flex-col justify-center items-center border border-dotted border-orange-500 p-[10px] mt-[16px] cursor-pointer' onClick={handleCoverPhotoClick}>
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
       ref={coverPhotoRef}
       onChange={handleCoverPhotoUpload}
     />

    </Grid>}
    
    {projectLogo.value?
    <Grid xs={12} item className=' border border-dotted border-orange-500  mt-[16px] cursor-pointer rounded-[6px] ml-[10px]' >
      <div style={{ position: 'relative' }}>
      <Image
       src={URL.createObjectURL(projectLogo.value)}
       alt='uploader icon'
       width={50}
       height={50}
       className='w-full h-[120px]'
     />
     <div >
     <CloseIcon  onClick={handleRemoveLogo} className='absolute top-0 right-0 m-0 bg-[#FF853E]  rounded-full p-[6px] h-[28px] w-[28px] text-white'/>

     </div>

     <EditIcon   height={34} onClick={handleLogoClick} 
     className='absolute top-0 left-0 m-0 bg-[#FF853E] rounded-full p-[6px] h-[28px] text-white w-[28px] '
     >
     </EditIcon>


      <input
       type='file'
       className='hidden'
       ref={logoRef}
       onChange={handleLogoUpload}
     /> 
      </div>

     </Grid>
  :<Grid xs={12} item className='flex flex-col justify-center ml-[10px] items-center border border-dotted border-orange-500 p-[10px] mt-[16px] cursor-pointer' onClick={handleLogoClick}>
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
       ref={logoRef}
       onChange={handleLogoUpload}
     />

    </Grid>}
    </>
  )
}
export default ProjectImageUpload