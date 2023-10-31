import { UploaderActionType, UploaderActions } from "./action";
import { UploaderStep, UploaderState } from "./state";

export const uploaderReducer = (state: UploaderState, action: UploaderActions): UploaderState => {
    switch (action.type) {
        case UploaderActionType.GoBack: 
            return {
                ...state,
                step: state.step--
            }
        case UploaderActionType.Next: 
            return {
                ...state,
                step: state.step++
            }
        case UploaderActionType.UpdateDate:
            return {
                ...state,
                date: action.payload.date
            }
        case UploaderActionType.setshowMessage:
            return{
                ...state,
                showMessage:action.payload.showMessage
            }
        case UploaderActionType.setStructureList:
            return{
                ...state,
                structureList:action.payload.structureList
            }
        case UploaderActionType.setSectionDetails:
            return{
                ...state,
                sectionDetails:action.payload.sectionDetails
            }
        default:
            return state
    }
}

