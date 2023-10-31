import React, { useCallback } from "react"
import ExifReader from 'exifreader';
import ChooseFiles from "../chooseFile/chooseFiles"; 
import UploadingStatus from './uploadingStatus'

interface IProps{
  onDrop: (acceptedFiles: File[]) => void;
  }
let ChooseUploaderFile:React.FC<IProps>=({onDrop})=>{
  const dragDropText = "Drag and Drop the files / folders you want to upload or browse"
  const supportFileText=`Supported file types: jpeg, jpg with GPS metadata`
return(
<React.Fragment> 
<ChooseFiles onDrop={onDrop} dragDropText={dragDropText} supportFileText={supportFileText} UploadingStatus={<UploadingStatus/>}/>
</React.Fragment>)
}
export default ChooseUploaderFile