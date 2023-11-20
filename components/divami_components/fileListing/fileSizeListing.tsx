import React from "react"
interface Iprops{
    fileSize:number
}
const  convertFileSize = (fileSizeInBytes:number) => {
    if (fileSizeInBytes < 1024) {
      return fileSizeInBytes + ' B';
    } else if (fileSizeInBytes < 1024 * 1024) {
      return (fileSizeInBytes / 1024).toFixed(2) + ' KB';
    } else if (fileSizeInBytes < 1024 * 1024 * 1024) {
      return (fileSizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (fileSizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
  }
const FileSizeListing:React.FC<Iprops>=({fileSize})=>{
    return(
    <React.Fragment>
        {convertFileSize(fileSize)}
    </React.Fragment>)
}
export default FileSizeListing