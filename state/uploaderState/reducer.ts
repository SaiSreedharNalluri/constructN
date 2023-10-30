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
        default:
            return state
    }
}

