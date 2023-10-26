import React from "react"
interface Iprops{
    fileName:string
}
const FileNameListing:React.FC<Iprops>=({fileName})=>{
    return(
    <React.Fragment>
     {fileName} 
    </React.Fragment>)
}
export default FileNameListing