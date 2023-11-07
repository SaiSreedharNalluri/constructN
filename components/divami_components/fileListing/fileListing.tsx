import React from "react"
import FileNameListing from "./fileNameListing"
import FileSizeListing from "./fileSizeListing"
import { IExifFile } from "../../../models/IExifFile"
interface Iprops{
    selectedFile:File[],
    isSizeRequired:boolean
}
const FileListing:React.FC<Iprops>=({selectedFile,isSizeRequired})=>{
    return(
    <React.Fragment>
    <div className="overflow-y-scroll" style={{ height: "160px" }}>
     <table className="table-auto border-[1px] rounded-[8px] md:gap-[112px] w-[90%] md:w-[50vw] h-auto border-dashed relative md:top-[28px] md:left-[305px]">
        <thead className="sticky top-0 bg-white border-[1px]">
        <tr className="border-[1px] border-b-[#F1742E] text-justify">
        <th className="pl-2">File Name</th>
        {
        isSizeRequired&&<th>Size</th>
        }
        </tr>
        </thead> 
        <tbody> 
    {selectedFile?.length>0&& selectedFile.map((fileInfo, index)=>{
       return(
        <tr key={index} >
            <td className="pl-2">
            <FileNameListing fileName={fileInfo.name}/>
            </td>
           {isSizeRequired&&
             <td>
            <FileSizeListing fileSize={fileInfo.size}/>
            </td>
            }
        </tr>
       ) 
    })} 
    </tbody>
   </table>
   </div>     
    </React.Fragment>)
}
export default FileListing