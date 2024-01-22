import { IJobs } from "../../models/IJobs";
import { AppActionType, AppActions } from "./action";
import { AppState } from "./state";

export const appReducer = (state: AppState, action: AppActions): AppState => {
    switch (action.type) {
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
        case AppActionType.addCaptureUpload:
            let inProgressPendingUpload :any = localStorage.getItem('InProgressPendingUploads');
            if(inProgressPendingUpload != null && inProgressPendingUpload != undefined)
            {
                inProgressPendingUpload =   JSON.parse(inProgressPendingUpload);      
            }
            if (state.inProgressPendingUploads.length > 0) {
               let jobs = state.inProgressPendingUploads.concat([action.payload.job])
                if(inProgressPendingUpload !=undefined && inProgressPendingUpload != null&& inProgressPendingUpload?.length > 0)
                {    
                    inProgressPendingUpload = inProgressPendingUpload.concat(jobs)
                    localStorage.setItem('InProgressPendingUploads',stringifySafe(inProgressPendingUpload))
                    return {
                        ...state,
                        inProgressPendingUploads: inProgressPendingUpload
                    }   
                }
                else{
                    localStorage.setItem('InProgressPendingUploads',stringifySafe(jobs))
                    return {
                        ...state,
                        inProgressPendingUploads: jobs
                    }
                }
               
            } else {
             let inProgressPendingUploads = [action.payload.job];
                if(inProgressPendingUpload && inProgressPendingUpload?.length > 0)
                {
                    inProgressPendingUpload = inProgressPendingUpload.concat(inProgressPendingUploads)
                    localStorage.setItem('InProgressPendingUploads',stringifySafe(inProgressPendingUpload))
                    return {
                        ...state,
                        inProgressPendingUploads: inProgressPendingUpload
                    }
                }
                else{
                    localStorage.setItem('InProgressPendingUploads', stringifySafe(inProgressPendingUploads))
                    return {
                        ...state,
                        inProgressPendingUploads: [action.payload.job]
                    }
                }
               
            }

        case AppActionType.updateCaptureUploadStatus:
            let restOfTheJobs = state.inProgressPendingUploads.filter((job, index) => {
                return job._id !== action.payload.job._id
            })
            localStorage.setItem('InProgressPendingUploads',stringifySafe(restOfTheJobs))
            return {
                ...state,
                inProgressPendingUploads: restOfTheJobs.concat([action.payload.job])
            }
        case AppActionType.removeCaptureUpload: 
        let pendingJobs = state.inProgressPendingUploads.filter((job, index) => {
            return job._id !== action.payload.job._id
        })
        localStorage.setItem('InProgressPendingUploads',stringifySafe(pendingJobs))
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
export function stringifySafe(Ijobarray:IJobs[]) {
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
    return JSON.stringify(Ijobarray, replacer);
}