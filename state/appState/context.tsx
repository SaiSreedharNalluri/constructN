import { createContext, useContext, useMemo, useReducer } from "react";
import { AppActions, appContextActions } from "./action";
import { AppState, initialAppState } from "./state";
import { appReducer } from "./reducer";

export const AppContext = createContext<{
    state: AppState,
    dispatch: React.Dispatch<AppActions>
}>( {
    state: initialAppState,
    dispatch: () => undefined 
})

const AppContextProvider = ({ children }:{ children: JSX.Element }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const value = useMemo(() => ({state, dispatch}), [state]);

  return (<AppContext.Provider value={value}>{children}</AppContext.Provider>);
}

function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useUploaderContext must be used within a UploaderContextProvider');
  }
  const {state, dispatch} = context;
  const appContextAction = appContextActions(dispatch);
  // const appContextSelector = contextSelectors(state);
  return { state, appContextAction};
}

export { AppContextProvider, useAppContext };