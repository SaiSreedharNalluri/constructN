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
        <div className={`border-[1px] text-center rounded-[8px] mt-[16px] w-[50vw] h-[30vh] border-dashed   border-black py-[6vh] px-[2%] cursor-pointer ${isDragActive ? 'border-blue-500' : ''}`} {...getRootProps()}>
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