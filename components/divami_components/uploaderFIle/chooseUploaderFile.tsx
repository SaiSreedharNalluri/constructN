import React from "react"
import ChooseFiles from "../chooseFile/chooseFiles"; 
import UploadingStatus from './uploadingStatus'
import { useUploaderContext } from "../../../state/uploaderState/context";

interface IProps{
  onDrop: (acceptedFiles: File[]) => void;
  }
let ChooseUploaderFile:React.FC<IProps>=({onDrop})=>{
  const { state } = useUploaderContext();
  
  const dragDropText = "Drag and Drop the files / folders you want to upload or browse"
  const supportFileText=`Supported file types: jpeg, jpg with GPS metadata`
return(
<React.Fragment> 
<ChooseFiles onDrop={onDrop} dragDropText={dragDropText} supportFileText={supportFileText} UploadingStatus={<UploadingStatus/>} isDisabled={state.isReading} acceptFiles={{['image/jpeg']:['.jpeg', '.jpg', '.png',]}}/>
</React.Fragment>)
}
export default ChooseUploaderFile