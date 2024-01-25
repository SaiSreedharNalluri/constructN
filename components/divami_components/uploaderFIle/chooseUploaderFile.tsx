import React from "react"
import ChooseFiles from "../chooseFile/chooseFiles"; 
import UploadingStatus from './uploadingStatus'
import { useUploaderContext } from "../../../state/uploaderState/context";
import { UploadRange } from "../../../state/uploaderState/state";

interface IProps{
  onDrop: (acceptedFiles: File[]) => void;
  }
let ChooseUploaderFile:React.FC<IProps>=({onDrop})=>{
  const { state } = useUploaderContext();
  
  const dragDropText = "Drag and Drop the files / folders you want to upload or browse"
  const supportFileText=`1) Supported file types: jpeg, jpg with GPS metadata. 
  2) Min. of ${UploadRange.Minimum} and Max. of ${UploadRange.Maximum} files allowed. Reach out to support@constructn.ai for larger uploads.`
  const getDisableStatus=()=>{
    if(state.choosenFiles.validFiles.length === 1500)
    {
      return true
    }
    else
    {
      return state.isReading
    }
  }                         
return(
<React.Fragment> 
<ChooseFiles onDrop={onDrop} dragDropText={dragDropText} supportFileText={supportFileText} UploadingStatus={<UploadingStatus/>} isDisabled={getDisableStatus()} acceptFiles={{['image/jpeg']:['.jpeg', '.jpg', '.png',]}}/>
</React.Fragment>)
}
export default ChooseUploaderFile