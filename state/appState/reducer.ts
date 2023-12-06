import { AppActionType, AppActions } from "./action";
import { AppState } from "./state";

export const appReducer = (state: AppState, action: AppActions): AppState => {
    switch (action.type) {
        case AppActionType.appendProjectData:
            let projectData = action.payload.projectData
            let projectDataList = state.projectDataList.concat([projectData])
            return {
                ...state,
                projectDataList: projectDataList,
                currentProjectData: projectData
            }
        case AppActionType.setCurrentProjectData:
            return {
                ...state,
                currentProjectData: action.payload.projectData
            }
        case AppActionType.addCaptureUpload:
            let jobs = state.inProgressPendingUploads.concat([action.payload.job])
            return {
                ...state,
                inProgressPendingUploads: jobs
            }
        case AppActionType.updateCaptureUploadStatus:
            let restOfTheJobs = state.inProgressPendingUploads.filter((job, index) => {
                return job._id !== action.payload.job._id
            })
            return {
                ...state,
                inProgressPendingUploads: restOfTheJobs.concat([action.payload.job])
            }
        case AppActionType.removeCaptureUpload: 
        let pendingJobs = state.inProgressPendingUploads.filter((job, index) => {
            return job._id !== action.payload.job._id
        })
        return {
            ...state,
            inProgressPendingUploads: pendingJobs
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