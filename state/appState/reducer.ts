import { IJobs } from "../../models/IJobs";
import { getJobIdFromModelOrString, getProjectIdFromModelOrString, getStructureIdFromModelOrString } from "../../utils/utils";
import { AppActionType, AppActions } from "./action";
import { AppState, InProgressProjectUploadMap, InProgressProjectUploads, ProjectLocalStorageKey } from "./state";

export const appReducer = (state: AppState, action: AppActions): AppState => {
    switch (action.type) {
        case AppActionType.projectListViewLoaded:
            return {
                ...state,
                currentProjectData: undefined
            }
        case AppActionType.appendProjectData:
            let projectData = action.payload.projectData
            if(state.projectDataList.find((e)=>{ return e.project._id === projectData.project._id})) {
                return {
                    ...state,
                    currentProjectData: projectData
                }
            } else {
                let projectDataList = state.projectDataList.concat([projectData])
                return {
                    ...state,
                    projectDataList: projectDataList,
                    currentProjectData: projectData
                }
            }
        case AppActionType.setCurrentProjectData:
            return {
                ...state,
                currentProjectData: action.payload.projectData
            }
        case AppActionType.setInProgressProjectUpload:
            return {
                ...state,
                inProgressProjectUploadMap: action.payload.inProgressProjectUploadMap
            }
        case AppActionType.addCaptureUpload:
            let job  = action.payload.job
            let projectId = getProjectIdFromModelOrString(job.project)
            let projectName = state.currentProjectData?.project.name
            let inProgressProjects = Object.keys(state.inProgressProjectUploadMap)
            if (inProgressProjects.length > 0 && inProgressProjects.includes(projectId)) {
                let inProgressUploads = state.inProgressProjectUploadMap[projectId].inProgressUploads
                let inProgressProjectUpload: InProgressProjectUploads = {
                    ...state.inProgressProjectUploadMap[projectId],
                    inProgressUploads: [...inProgressUploads, job]
                }
                let newProjectUploadMap: InProgressProjectUploadMap = {
                    ...state.inProgressProjectUploadMap,
                    [projectId as string]: inProgressProjectUpload
                }
                localStorage.setItem(ProjectLocalStorageKey.InProgressUploadsKey, stringifySafe(newProjectUploadMap))
                return {
                    ...state,
                    inProgressProjectUploadMap: newProjectUploadMap
                }
            } else {
                let inProgressProjectUpload: InProgressProjectUploads = {
                    projectName: projectName !== undefined ? projectName : "Unnamed",
                    inProgressUploads: [job]
                }
                let newProjectUploadMap: InProgressProjectUploadMap = { 
                    ...state.inProgressProjectUploadMap,
                    [projectId as string]: inProgressProjectUpload
                }
                localStorage.setItem(ProjectLocalStorageKey.InProgressUploadsKey, stringifySafe(newProjectUploadMap))
                return {
                    ...state,
                    inProgressProjectUploadMap: newProjectUploadMap
                }
            }
        case AppActionType.removeCaptureUpload:
            let removeJob = action.payload.job
            let removeProjectId = getProjectIdFromModelOrString(removeJob.project)
            let inProgressProjectsBeforeRemoveJob = Object.keys(state.inProgressProjectUploadMap)
            if (inProgressProjectsBeforeRemoveJob.length > 0 && inProgressProjectsBeforeRemoveJob.includes(removeProjectId)) {
                if (state.inProgressProjectUploadMap[removeProjectId].inProgressUploads.length > 1) {
                    let inProgressUploads = state.inProgressProjectUploadMap[removeProjectId].inProgressUploads.filter((job, index) => {
                        return job._id !== removeJob._id
                    })
                    let inProgressProjectUpload: InProgressProjectUploads = {
                        ...state.inProgressProjectUploadMap[removeProjectId],
                        inProgressUploads: inProgressUploads
                    }
                    let newProjectUploadMap: InProgressProjectUploadMap = {
                        ...state.inProgressProjectUploadMap,
                        [removeProjectId as string]: inProgressProjectUpload
                    }
                    localStorage.setItem(ProjectLocalStorageKey.InProgressUploadsKey, stringifySafe(newProjectUploadMap))
                    return {
                        ...state,
                        inProgressProjectUploadMap: newProjectUploadMap
                    }
                } else {
                    let {[removeProjectId]: _, ...newInProgressProjectUploadMap} = state.inProgressProjectUploadMap
                    localStorage.setItem(ProjectLocalStorageKey.InProgressUploadsKey, stringifySafe(newInProgressProjectUploadMap))
                    return {
                        ...state,
                        inProgressProjectUploadMap: newInProgressProjectUploadMap
                    }
                }
            } else {
                return state
            }
        case AppActionType.setIsLoading:
            return {
                ...state,
                isLoading:action.payload.isLoading
            }
        default:
            return state
    }
}
export function stringifySafe(inProgressProjectUploadMap:InProgressProjectUploadMap) {
    const seen = new WeakSet();

    function replacer(key:any,value:any) {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return undefined;
            }
            seen.add(value);
        }
        return value;
    }
    return JSON.stringify(inProgressProjectUploadMap, replacer);
}