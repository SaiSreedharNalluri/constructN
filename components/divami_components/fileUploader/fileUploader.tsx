import React, { useCallback } from "react"

import { styled } from "@mui/material/styles";
import Image from "next/image";
import uploaderIcon from '../../../public/divami_icons/Upload_graphics.svg'
import { useDropzone } from "react-dropzone";
export const UploaderIcon = styled(Image)({
    cursor: "pointer",
  });
interface IProps{
    isAppend:boolean,
    setSelectedFile:React.Dispatch<React.SetStateAction<File[]>>,
    selectedFile:File[]
}
let FileUploader:React.FC<IProps>=({isAppend,setSelectedFile,selectedFile})=>{
    
    const onDrop = useCallback((acceptedFiles:any) => {
        // Do something with the accepted files, like uploading them
        if(acceptedFiles)
        {
          if(isAppend)
          {
            const files: File[] = Array.from(acceptedFiles);
            setSelectedFile([...selectedFile, ...files]);
           
          }
          else{
            const files: File[] = Array.from(acceptedFiles);
            setSelectedFile(files)
            
          }
        }
      }, []);
      
      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
      });
      
return( 
<div className={`border-[1px] text-center rounded-[8px] gap-[112px] w-[869px] h-[324px] border-dashed relative top-[28px] left-[248px] border-black py-[24px] px-[8px] cursor-pointer ${isDragActive ? 'border-blue-500' : ''}`} {...getRootProps()}>
<div className="flex flex-col items-center justify-center h-full gap-6 ">
    <div className='w-[109.78px] h-[104px]'>
            <UploaderIcon src={uploaderIcon} alt={"uploader icon"} className='h-[96.94px] w-[96.94px]' />
        </div>
    
    <div className='font-sans'>
        <input {...getInputProps()} />
        <p className="m-0 text-gray-700 font-medium text-2xl">Drag and Drop the files / folders you want to upload or browse</p>
        <p className='font-thin'>
        Supported file types: jpeg, jpg with GPS metadata
        </p>
    </div>
</div>
</div>)
}
export default FileUploader