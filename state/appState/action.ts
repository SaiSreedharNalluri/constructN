import { IProjects } from "../../models/IProjects";
import { ChildrenEntity, IStructure } from "../../models/IStructure";
import { ProjectData } from "./state";

export enum AppActionType {
    appendProjectData,
    setCurrentProjectData,
    setIsLoading
}

export interface appendProjectData {
  type: AppActionType.appendProjectData;
  payload: { projectData: ProjectData}
}

export interface setCurrentProjectData {
  type: AppActionType.setCurrentProjectData;
  payload: { projectData: ProjectData}
}

export interface setIsLoading {
  type: AppActionType.setIsLoading;
  payload: { isLoading: boolean };
}

export const appContextActions = (dispatch: React.Dispatch<AppActions>) => {
  return {
    appAction: {
      appendProjectData: (projectData: ProjectData) => {
        dispatch({
          type: AppActionType.appendProjectData,
          payload: { projectData: projectData },
        });
      },
      setCurrentProjectData: (projectData: ProjectData) => {
        dispatch({
          type: AppActionType.setCurrentProjectData,
          payload: { projectData: projectData },
        });
      },
      setIsLoading: (isLoading:boolean) => {
        dispatch({ type: AppActionType.setIsLoading, payload:{isLoading: isLoading}});
    },
    },
  };
}

export type AppActions = appendProjectData
 | setCurrentProjectData
 | setIsLoading