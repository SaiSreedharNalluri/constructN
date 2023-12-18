import { ProjectActionType,OnBoardingProjectActions } from "./action";
import { OnBoardingProjectState, OnBoardingStep } from "./state";

export const projectReducer=(state: OnBoardingProjectState, action: OnBoardingProjectActions): OnBoardingProjectState =>{
    switch(action.type){
        case ProjectActionType.GoBack:
            let previousStep = state.step - 1
            return{
                ...state,
                step: previousStep,
                isNextEnabled: isNext(state, previousStep)
            }
        case ProjectActionType.Next:
            let nextStep = state.step + 1
            return{
                ...state,
                step: nextStep,
                
            }
        case ProjectActionType.setNewProjectDetails:
            return{
                ...state,
                newProjectDetails:action.payload.newProjectDetails
            }
        case ProjectActionType.setAdminDetails:
            return{
                ...state,
                adminDetails:action.payload.adminDetails
            }
        case ProjectActionType.setBimFile:
            return{
                ...state,
                bimFiles:action.payload.bimFiles,
            
            }
        case ProjectActionType.setIsBimNotAvailable:
            return{
                ...state,
                isBimNotAvailable:action.payload.isBimNotAvailable
            }
    }
}

const isNext = (state:OnBoardingProjectState, step: OnBoardingStep): boolean =>{
    switch (step) {
        case OnBoardingStep.ProjectDetails:
            return false;
        case OnBoardingStep.ProjectHierachy:
            return true;
        case OnBoardingStep.BIM:
            return false;
        case OnBoardingStep.Sheets:
            return true;
        case OnBoardingStep.AddUsers:
            return true;
        case OnBoardingStep.ConfigureProject:
            return true;
        case OnBoardingStep.Review:
            return true;
        default:
            return false;
    }
}