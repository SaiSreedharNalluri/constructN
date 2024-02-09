import { IJobs } from "../../models/IJobs";
import { IProjects } from "../../models/IProjects";
import { ChildrenEntity, IStructure } from "../../models/IStructure";
import { ProjectData } from "./state";

export enum AppActionType {
    projectListViewLoaded,
    appendProjectData,
    setCurrentProjectData,
    addCaptureUpload,
    updateCaptureUploadStatus,
    removeCaptureUpload,
    setIsLoading
}

export interface projectListViewLoaded {
  type: AppActionType.projectListViewLoaded;
}

export interface appendProjectData {
  type: AppActionType.appendProjectData;
  payload: { projectData: ProjectData}
}

export interface setCurrentProjectData {
  type: AppActionType.setCurrentProjectData;
  payload: { projectData: ProjectData}
}

export interface addCaptureUpload {
  type: AppActionType.addCaptureUpload;
  payload: { job: IJobs}
}

export interface updateCaptureUploadStatus {
  type: AppActionType.updateCaptureUploadStatus;
  payload: { job: IJobs}
}

export interface removeCaptureUpload {
  type: AppActionType.removeCaptureUpload;
  payload: { job: IJobs}
}

export interface setIsLoading {
  type: AppActionType.setIsLoading;
  payload: { isLoading: boolean };
}

export const appContextActions = (dispatch: React.Dispatch<AppActions>) => {
  return {
    appAction: {
      projectListViewLoaded: () => {
        dispatch({
          type: AppActionType.projectListViewLoaded
        });
      },
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
      addCaptureUpload: (job :IJobs) => {
        dispatch({
          type: AppActionType.addCaptureUpload,
          payload: { job: job }
        })
      },
      updateCaptureUploadStatus: (job :IJobs) => {
        dispatch({
          type: AppActionType.updateCaptureUploadStatus,
          payload: { job: job }
        })
      },
      removeCaptureUpload: (job :IJobs) => {
        dispatch({
          type: AppActionType.removeCaptureUpload,
          payload: { job: job }
        })
      },
      setIsLoading: (isLoading:boolean) => {
        dispatch({ type: AppActionType.setIsLoading, payload:{isLoading: isLoading}});
    },
    },
  };
}

export type AppActions = projectListViewLoaded
 | appendProjectData
 | setCurrentProjectData
 | addCaptureUpload
 | updateCaptureUploadStatus
 | removeCaptureUpload
 | setIsLoading