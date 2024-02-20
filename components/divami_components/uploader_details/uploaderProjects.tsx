import React from "react"
import Header from "../user-profile/header/Header"
import { ProjectCounts, customHeaderState } from "../../../models/IUtils"
import { useRouter } from "next/router"
import { faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAppContext } from "../../../state/appState/context"
interface IProps{
    handleUploaderClose:()=>void
    projectUplObj:ProjectCounts
}
const UploaderProjects:React.FC<IProps> = ({handleUploaderClose,projectUplObj})=>{
const router = useRouter();
const { state: appState, appContextAction } = useAppContext();
const { appAction } = appContextAction;
const getProjectName = (projectId:string)=>{
  let projectsList = appState.projectDataList
  if(projectsList != null)
  {
    return projectsList.find((obj:any)=> obj.project._id === projectId)?.project?.name
  }
}
return(<React.Fragment>
<div className="px-4">
<Header closeEditProject={handleUploaderClose} id={customHeaderState.UploadsInProgress} />
</div>
{Object.keys(projectUplObj).length > 0 ? Object.keys(projectUplObj).map((projectId)=>{
return(
<div key={projectId} onClick={ ()=>{router.push(`/projects/${projectId}/uploader`),handleUploaderClose()}} className="flex justify-between  mx-auto mt-2 bg-[#F3F4F6] hover:bg-[#E7E7E7] text-base p-[10px]">
<div className="ml-[20px]">
{getProjectName(projectId)}
</div>
<div className="flex mr-[20px]">
<p>{projectUplObj[projectId]}</p>
<div className="ml-1">
 <FontAwesomeIcon icon={faArrowUp} bounce style={{color:'#F1742E'}} />
</div>
</div>
</div>)
}):<div className="font-semibold text-base calc-h500  flex justify-center items-center">
    <p>No Uploads In Progress</p>
    </div>} 
</React.Fragment>)
}

export default UploaderProjects