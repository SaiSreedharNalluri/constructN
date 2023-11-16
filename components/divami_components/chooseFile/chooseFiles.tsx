import React, { ReactNode } from 'react'
import { useDropzone } from "react-dropzone";

interface IProps {
    onDrop: (acceptedFiles: File[]) => void;
    dragDropText?:string,
    supportFileText?:string,
    UploadingStatus:ReactNode
    isDisabled:boolean
  }
const ChooseFiles:React.FC<IProps>=({onDrop,dragDropText,supportFileText,UploadingStatus,isDisabled})=>{
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop:onDrop,
        disabled:isDisabled
      });
    return (<React.Fragment>
       <div className={`border-[3px] text-center rounded-[8px] md:gap-[112px] w-[90%] md:w-[50vw] h-[30vh] border-dashed relative md:top-[28px] md:left-[305px] hover:border-[#F1742E] border-black py-[6vh] px-[2%] cursor-pointer ${isDragActive ? 'border-blue-500' : ''}`} {...getRootProps()}>
  <div className="flex flex-col items-center justify-center h-full gap-6">
    {UploadingStatus}
   <div className='font-sans'>
      <input {...getInputProps()} />
      <p className="m-0 text-gray-700 font-medium text-xl">{dragDropText}</p>
      <p className='font-thin'>{supportFileText}</p>
    </div>
  </div>
</div>
    </React.Fragment>)

}
export default ChooseFiles