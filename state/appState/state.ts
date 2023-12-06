import { IJobs } from "../../models/IJobs";
import { IProjects } from "../../models/IProjects";
import { ChildrenEntity, IStructure } from "../../models/IStructure";


export enum ProjectLocalStorageKey {
    ProjectDataListKey = "projectDataList"
}


export interface ProjectData {
    project: IProjects,
    structureList: IStructure[],
    hierarchy: ChildrenEntity[],
}

export interface AppState {
    currentProjectData?: ProjectData
    projectDataList: ProjectData[]
    inProgressPendingUploads: IJobs[]
    isLoading: boolean
}

export const initialAppState: AppState = {
    projectDataList: [],
    inProgressPendingUploads: [],
    isLoading: false,
}