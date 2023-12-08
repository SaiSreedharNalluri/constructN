import { createContext, useContext, useMemo, useReducer} from "react";
import { OnBoardingProjectState, initialOnBoardingProjectState } from "./state";
import { OnBoardingProjectActions, onBoardingProjectContextActions } from "./action";
import { projectReducer } from "./reducer";

export const OnBoardingProjectContext =createContext<{
    state: OnBoardingProjectState,
    dispatch:React.Dispatch<OnBoardingProjectActions>

}>({
    state: initialOnBoardingProjectState,
    dispatch:()=> undefined
})

const OnBoardingContextProvider =({children}:{children:JSX.Element})=>{
    const [state,dispatch] = useReducer(projectReducer,initialOnBoardingProjectState);
    const value = useMemo(()=>({state,dispatch}),[state]);
    return (<OnBoardingProjectContext.Provider value={value}>{children}</OnBoardingProjectContext.Provider>)
}

function useProjectContext() {
    const context = useContext(OnBoardingProjectContext);
    const {state, dispatch} = context;
    const projectContextAction =onBoardingProjectContextActions(dispatch);

    return {state, projectContextAction}
}

export {OnBoardingContextProvider,useProjectContext}

