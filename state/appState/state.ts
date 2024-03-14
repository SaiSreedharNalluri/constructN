import { IJobs } from "../../models/IJobs";
import { IProjects } from "../../models/IProjects";
import { ChildrenEntity, IStructure } from "../../models/IStructure";


export enum ProjectLocalStorageKey {
    ProjectDataListKey = "projectDataList",
    InProgressUploadsKey = "InProgressPendingUploads"
}

export interface InProgressProjectUploads {
    projectName: string
    inProgressUploads: IJobs[]
}

export interface InProgressProjectUploadMap {
    [key:string]: InProgressProjectUploads
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
    inProgressProjectUploadMap: InProgressProjectUploadMap
    inProgressWorkerCount: number
    isLoading: boolean
}

export const initialAppState: AppState = {
    projectDataList: [],
    inProgressPendingUploads: [],
    inProgressProjectUploadMap: {},
    inProgressWorkerCount: 0,
    isLoading: false,
}