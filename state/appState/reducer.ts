import { AppActionType, AppActions } from "./action";
import { AppState } from "./state";

export const appReducer = (state: AppState, action: AppActions): AppState => {
    switch (action.type) {
        case AppActionType.setProjectList:
            return {
                ...state,
                projectList: action.payload.projectList
            }
        case AppActionType.setProject:
            return {
                ...state,
                currentProject: action.payload.project
            }
        case AppActionType.setHierarchy:
            return {
                ...state,
                hierarchy : action.payload.hierarchy
            }
        case AppActionType.setStructureList:
            return {
                ...state,
                structureList : action.payload.structureList
            }
        default:
            return state
    }
}