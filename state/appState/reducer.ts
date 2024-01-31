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
            let inProgressUploads = localStorage.getItem('InProgressPendingUploads');
           if (state.inProgressPendingUploads.length > 0) {
               let jobs = state.inProgressPendingUploads.concat([action.payload.job])
                if(inProgressUploads !=undefined && inProgressUploads != null)
                {    
                    if(JSON.parse(inProgressUploads).some((obj:IJobs)=>obj._id === action.payload.job._id)!=true)
                    {
                    localStorage.setItem('InProgressPendingUploads',stringifySafe(JSON.parse(inProgressUploads).concat([action.payload.job])))
                    }
                    return {
                        ...state,
                        inProgressPendingUploads: jobs
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
                if(inProgressUploads !=undefined && inProgressUploads != null)
                {
                    if(JSON.parse(inProgressUploads).some((obj:IJobs)=>obj._id === action.payload.job._id)!=true)
                    {
                       
                        localStorage.setItem('InProgressPendingUploads',stringifySafe(JSON.parse(inProgressUploads).concat(action.payload.job)))
                    }
                    return {
                        ...state,
                        inProgressPendingUploads: [action.payload.job]
                    }
                }
                else{
                    localStorage.setItem('InProgressPendingUploads', stringifySafe([action.payload.job]))
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
            let pendingUploads = localStorage.getItem('InProgressPendingUploads'); 
        let pendingJobs = state.inProgressPendingUploads.filter((job, index) => {
            return job._id !== action.payload.job._id
        })
        if(pendingUploads!=null && pendingUploads!= undefined)
        {
            localStorage.setItem('InProgressPendingUploads',stringifySafe(JSON.parse(pendingUploads).filter((job:IJobs) => {
                return job._id !== action.payload.job._id
            })))
        }
        //localStorage.setItem('InProgressPendingUploads',stringifySafe(pendingJobs))
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