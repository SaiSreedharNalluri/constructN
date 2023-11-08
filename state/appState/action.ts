import { IProjects } from "../../models/IProjects";
import { ChildrenEntity, IStructure } from "../../models/IStructure";

export enum AppActionType {
    setProjectList,
    setProject,
    setHierarchy,
    setStructureList
}

export interface setProjectList {
    type: AppActionType.setProjectList;
    payload: { projectList: IProjects[] };
}

export interface setProject {
    type: AppActionType.setProject;
    payload: { project: IProjects };
}

export interface setHierarchy {
    type: AppActionType.setHierarchy;
    payload: { hierarchy: ChildrenEntity[] };
}

export interface setStructureList {
    type: AppActionType.setStructureList;
    payload: { structureList: IStructure[] };
}

export const appContextActions = (dispatch: React.Dispatch<AppActions>) => {
  return {
    appAction: {
      setProjectList: (project: IProjects[]) => {
        dispatch({
            type: AppActionType.setProjectList,
            payload: { projectList: project },
        });
        },
      setProject: (project: IProjects) => {
        dispatch({
          type: AppActionType.setProject,
          payload: { project: project },
        });
      },
      setHierarchy: (sectionList: ChildrenEntity[]) => {
        dispatch({
          type: AppActionType.setHierarchy,
          payload: { hierarchy: sectionList },
        });
      },
      setStructureList: (structureList: IStructure[]) => {
        dispatch({
          type: AppActionType.setStructureList,
          payload: { structureList: structureList },
        });
      },
    },
  };
}

export type AppActions = setProjectList | setProject | setHierarchy | setStructureList