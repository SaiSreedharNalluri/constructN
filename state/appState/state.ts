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
    isLoading: boolean
}

export const initialAppState: AppState = {
    projectDataList: [],
    isLoading: false,
}