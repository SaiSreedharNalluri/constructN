import { IProjects } from "../../models/IProjects";
import { IUser } from "../../models/IUser";

export enum ProjectActionType{
    GoBack,
    Next,
    setNewProjectDetails,
    setAdminDetails,
}

export interface goBack{
    type: ProjectActionType.GoBack;
}

export interface next{
    type: ProjectActionType.Next;
}

export interface setNewProjectDetails{
    type: ProjectActionType.setNewProjectDetails;
    payload:{newProjectDetails:IProjects}
}
export interface setAdminDetails{
    type:ProjectActionType.setAdminDetails;
    payload:{adminDetails:IUser}
}

export const onBoardingProjectContextActions =(dispatch:React.Dispatch<OnBoardingProjectActions>)=>{
    return{
        ProjectAction:{
            goBack:()=>{
                dispatch({type: ProjectActionType.GoBack});
            },
            next:()=>{
                dispatch({type: ProjectActionType.Next});
            },
            setNewProjectDetails:(newProjectDetails:IProjects)=>{
                dispatch({type: ProjectActionType.setNewProjectDetails, payload:{newProjectDetails:newProjectDetails}})
            },
            setAdminDetails:(adminDetails:IUser)=>{
                
                dispatch({type:ProjectActionType.setAdminDetails, payload:{adminDetails:adminDetails}})
                //console.log("action page",adminDetails)
            }
        
        }

    }
}

export type OnBoardingProjectActions = | goBack | next | setNewProjectDetails | setAdminDetails
