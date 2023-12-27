import {Grid} from '@mui/material'
import React, { ChangeEvent, useRef, useState } from 'react'
import Image from "next/image";
import uploaderIcon from "../../../../../public/divami_icons/Upload_graphics.svg";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useSignals } from '@preact/signals-react/runtime';
const ProjectImageUpload = ({addressDetails,projectCoverPhoto,projectLogo}:any) => {

  useSignals()

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
    addressDetails.value={ ...addressDetails.value, 'coverPhoto': null}
  };
  const handleRemoveLogo = () => {
    projectLogo.value = null;
    // addressDetails.value={ ...addressDetails.value, 'logo': null}
  };
  return (
    <>
  {projectCoverPhoto.value || addressDetails.value.coverPhoto ?
    <Grid xs={12} item className=' border border-dotted border-orange-500  mt-[16px] cursor-pointer rounded-[6px]' >
      <div style={{ position: 'relative' }}>
      <Image
      src={projectCoverPhoto.value? URL.createObjectURL(projectCoverPhoto.value): addressDetails.value.coverPhoto}
       alt='uploader icon'
       width={50}
       height={50}
       className='w-full object-contain h-[120px]'
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
  :<Grid xs={12} item className='flex  justify-center items-center border border-dotted border-orange-500 p-[10px] mt-[16px] cursor-pointer' onClick={handleCoverPhotoClick}>
    <Image
       src={uploaderIcon}
       alt='uploader icon'
       width={64}
       height={64}
     />
     <div className='flex ml-4 flex-col'>
       <p className='text-gray-700 text-[1rem]'>
          Project Image
       </p>
       <p className='text-gray-400 text-[0.75rem] mt-[4px]'>
          Upload .JPG, .JPEG or .PNG files
       </p>
     </div>
     <input
       type='file'
       className='hidden'
       ref={coverPhotoRef}
       accept='image/*'
       onChange={handleCoverPhotoUpload}
     />

    </Grid>}
    
    {/* {projectLogo.value || addressDetails.value.logo?
    <Grid xs={12} item className=' border border-dotted border-orange-500  mt-[16px] cursor-pointer rounded-[6px] ml-[10px]' >
      <div style={{ position: 'relative' }}>
      <Image
       src={projectLogo.value? URL.createObjectURL(projectLogo.value):addressDetails.value.logo}
       alt='uploader icon'
       width={50}
       height={50}
       className='w-full object-contain h-[120px]'
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

    </Grid>} */}
    </>
  )
}
export default ProjectImageUpload