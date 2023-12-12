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
                isNextEnabled: isNext(state,nextStep),
            }
        case ProjectActionType.setNewProjectDetails:
            return{
                ...state,
                newProjectDetails:action.payload.newProjectDetails
            }
        case ProjectActionType.setAdminDetails:
           // console.log("reducer page",action.payload.adminDetails)
            return{
                ...state,
                adminDetails:action.payload.adminDetails
            }
    }
}

const isNext = (state:OnBoardingProjectState, step: OnBoardingStep): boolean =>{
    switch (step) {
        case OnBoardingStep.ProjectDetails:
            return true;
        case OnBoardingStep.ProjectHierachy:
            return true;
        case OnBoardingStep.BIM:
            return true;
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