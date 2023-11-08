import { IProjects } from "../../models/IProjects";
import { ChildrenEntity, IStructure } from "../../models/IStructure";

export interface AppState {
    projectList?: IProjects[]
    currentProject?: IProjects
    structureList?: IStructure[]
    hierarchy?: ChildrenEntity[]
}

export const initialAppState: AppState = {

}