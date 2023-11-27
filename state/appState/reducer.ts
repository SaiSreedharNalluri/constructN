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
        case AppActionType.setIsLoading:
            return {
                ...state,
                isLoading:action.payload.isLoading
            }
        default:
            return state
    }
}