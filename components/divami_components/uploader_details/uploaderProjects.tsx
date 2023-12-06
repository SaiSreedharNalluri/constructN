import React from "react"
import Header from "../user-profile/header/Header"
import { customHeaderState } from "../../../models/IUtils"

interface IProps{
    handleUploaderClose:()=>void
}
const UploaderProjects:React.FC<IProps> = ({handleUploaderClose})=>{
return(<React.Fragment>
<div className="px-4">
<Header closeEditProject={handleUploaderClose} id={customHeaderState.UploadsInProgress} />
</div>     
</React.Fragment>)
}

export default UploaderProjects