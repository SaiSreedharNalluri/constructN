import React, { useMemo, useReducer, createContext, useContext } from 'react';
import { UploaderState, initialUploaderState } from './state';
import { UploaderActions, uploaderContextActions } from './action';
import { uploaderReducer } from './reducer';

export const UploaderContext = createContext<{
    state: UploaderState,
    dispatch: React.Dispatch<UploaderActions>
}>( {
    state: initialUploaderState,
    dispatch: () => undefined 
})

const UploaderContextProvider = ({ children }:{ children: JSX.Element }) => {
  const [state, dispatch] = useReducer(uploaderReducer, initialUploaderState);
  const value = useMemo(() => ({state, dispatch}), [state]);

  return (<UploaderContext.Provider value={value}>{children}</UploaderContext.Provider>);
}

function useUploaderContext() {
  const context = useContext(UploaderContext);
  if (context === undefined) {
    throw new Error('useUploaderContext must be used within a UploaderContextProvider');
  }
  const {state, dispatch} = context;
  const uploaderContextAction = uploaderContextActions(dispatch);
  // const appContextSelector = contextSelectors(state);
  return { state, uploaderContextAction};
}

export { UploaderContextProvider, useUploaderContext };