import {Grid} from '@mui/material'
import React, { ChangeEvent, useRef, useState } from 'react'
import Image from "next/image";
import axios from 'axios';
import uploaderIcon from "../../../../../public/divami_icons/Upload_graphics.svg";
import { updateProjectCover } from '../../../../../services/project';
const ProjectImageUpload = ({addressDetails}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  console.log(file?.name);

  const handleClick = () => {
    if (inputRef?.current) {
      inputRef.current?.click();
    }
  };
  const handleFileChange = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }

  };



  return (
    <>
    <Grid xs={12} item className='flex flex-col justify-center items-center border border-dotted border-orange-500 p-[10px] mt-[16px] cursor-pointer' onClick={handleClick}>
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
       ref={inputRef}
       onChange={handleFileChange}
     />

    </Grid>
     <Grid xs={12} item className='flex flex-col justify-center ml-[10px] items-center border border-dotted border-orange-500 p-[10px] mt-[16px] cursor-pointer'>
    <Image
       src={uploaderIcon}
       alt='uploader icon'
       width={50}
       height={50}
     />
     <div className='flex justify-center items-center'>
       <p className='text-gray-500  mt-[6px]'>
          Project/Company Logo
       </p>
     </div>
     <input
       type='file'
       className='hidden'
     />
    </Grid>
    </>
  )
}
export default ProjectImageUpload