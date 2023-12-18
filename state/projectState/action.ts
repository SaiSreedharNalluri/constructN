import { IProjects } from "../../models/IProjects";
import { IUser } from "../../models/IUser";
import { uploadBIMFile } from "./state";

export enum ProjectActionType{
    GoBack,
    Next,
    setNewProjectDetails,
    setAdminDetails,
    setBimFile,
    setIsBimNotAvailable,
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

export interface setBimFile{
    type: ProjectActionType.setBimFile;
    payload:{bimFiles:uploadBIMFile[]|null};
}

export interface setIsBimNotAvailable{
    type: ProjectActionType.setIsBimNotAvailable;
    payload:{isBimNotAvailable:boolean}
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
                
            },
            setBimFile:(bimFiles:uploadBIMFile[]|null)=>{
                dispatch({type:ProjectActionType.setBimFile, payload:{bimFiles:bimFiles}})
            },
            setIsBimNotAvailable:(isBimNotAvailable:boolean)=>{
                dispatch({type:ProjectActionType.setIsBimNotAvailable,payload:{isBimNotAvailable:isBimNotAvailable}})
            }
        
        }

    }
}

export type OnBoardingProjectActions = 
| goBack
| next 
| setNewProjectDetails 
| setAdminDetails 
| setBimFile
| setIsBimNotAvailable
