import React from "react"
import { convertFileSize } from "../../../utils/utils"
interface Iprops{
    fileSize:number
}
const FileSizeListing:React.FC<Iprops>=({fileSize})=>{
    return(
    <React.Fragment>
        {convertFileSize(fileSize)}
    </React.Fragment>)
}
export default FileSizeListing