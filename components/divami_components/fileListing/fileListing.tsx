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
        {selectedFile.length>0?  <div className=" mx-auto   "> 
     <div className=" h-full mt-[30px]">
    <table className="w-[50vw]">
     <thead
     className={`text-jusitfy sticky top-0  w-full`}
   >
     <tr className="w-full flex justify-between border-b border-b-[#F1742E] mx-auto">
       
       <th className=" text-left " style={{fontSize:"14px",fontWeight:"600",fontStyle:"normal",fontFamily:"Open sans", lineHeight:"20px",color:"#101f4c"}}>File Name</th>
       {isSizeRequired && <th className="text-left w-[18%]" style={{fontSize:"14px",fontWeight:"600",fontFamily:"Open sans", lineHeight:"20px",color:"#101f4c"}}>Size</th>}
      
     </tr>
     </thead>

   <tbody className={`flex flex-col items-center calc-h295   overflow-y-auto w-full`} >
   {selectedFile?.length>0&& selectedFile.map((fileInfo, index)=>{
       return(
       <tr key={index}
         className={`flex justify-between w-full mb-[2px] mt-[4px] mx-auto`}
      >
          <td className="w-[35%]" style={{fontSize:"14px",fontWeight:"600",fontFamily:"Open sans", lineHeight:"20px",color:"#101f4c"}}>
          <FileNameListing fileName={fileInfo.name}/>            
         </td>  
         {isSizeRequired&&
             <td className=" w-[18%]" style={{fontSize:"14px",fontWeight:"600",fontFamily:"Open sans", lineHeight:"20px",color:"#101f4c"}}>
            <FileSizeListing fileSize={fileInfo.size}/>
            </td>
            }     

       </tr>
     
     ) 
    })}    
   </tbody>
 </table>
</div>
   </div> :""}
      
    </React.Fragment>)
}
export default FileListing