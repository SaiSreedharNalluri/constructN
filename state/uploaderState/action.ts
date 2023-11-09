import { IGCP, LONGLATType, UTMType } from "../../models/IGCP";
import { IProjectUserList, IProjects } from "../../models/IProjects";
import { ChildrenEntity, IStructure } from "../../models/IStructure";
import { fileWithExif } from "./state";

export enum UploaderActionType {
    GoBack,
    Next,
    Upload,
    UpdateDate,
    setshowMessage,
    setProject,
    setStructure,
    setStepperSideFilesList,
    appendFiles,
    skipGCP,
    setGCPType,
    setGCPList,
    setExtractedFileValue,
    setIsNextEnabled,
    changeUploadinitiate

}

export interface goBack {
  type: UploaderActionType.GoBack;
}

export interface next {
  type: UploaderActionType.Next;
}

export interface upload {
  type: UploaderActionType.Upload;
}

export interface skipGCP {
    type: UploaderActionType.skipGCP;
  }

export interface UpdateDate {
    type: UploaderActionType.UpdateDate,
    payload:{ date: Date |null}
}

export interface setshowMessage {
  type: UploaderActionType.setshowMessage;
  payload: { showMessage: boolean };
}

export interface setProject {
    type: UploaderActionType.setProject
    payload:{project:IProjects}
  }

export interface setStructure {
  
  type: UploaderActionType.setStructure
  payload:{structure:IStructure}
}

export interface setExtractedFileValue {
  type: UploaderActionType.setExtractedFileValue
  payload:{extractedFileValue:any}
}

export interface setIsNextEnabled{
  type:UploaderActionType.setIsNextEnabled
  payload:{IsNextEnabled:boolean};
}

export interface setStepperSideFilesList {
  type: UploaderActionType.setStepperSideFilesList
  payload:{ stepperSideFileList: boolean }
}

export interface appendFiles {
  type: UploaderActionType.appendFiles;
  payload: { files: fileWithExif[] };
}

export interface changeUploadinitiate {
  type: UploaderActionType.changeUploadinitiate
  payload:{ uploadinitiate: boolean }
}

export interface setGCPType{
    type:UploaderActionType.setGCPType;
    payload:{type: UTMType | LONGLATType};
}

export interface setGCPList{
  type:UploaderActionType.setGCPList;
  payload:{list: IGCP, type: UTMType | LONGLATType};
}

export const uploaderContextActions = (dispatch: React.Dispatch<UploaderActions>) => {
    return {
      uploaderAction: {
        goBack: () => {
          dispatch({ type: UploaderActionType.GoBack });
        },
        next: () => {
          dispatch({ type: UploaderActionType.Next });
        },
        upload: () => {
          dispatch({ type: UploaderActionType.Upload });
        },
        skipGCP: () => {
            dispatch({ type: UploaderActionType.skipGCP });
          },
        updateDate: (date: Date) => {
          dispatch({ type: UploaderActionType.UpdateDate,  payload: {date: date}});
        },
        setshowMessage: (showMessage:boolean) => {
          dispatch({ type: UploaderActionType.setshowMessage, payload:{showMessage: showMessage}});
        },
        setProject: (project: IProjects) => {
            dispatch({
              type: UploaderActionType.setProject,
              payload: { project: project },
            });
        },
        setStructure: (structure:IStructure) => {
          dispatch({ type: UploaderActionType.setStructure, payload:{structure: structure}});
        },
        setStepperSideFilesList:(stepperSideFileList:boolean)=>{
          dispatch({type:UploaderActionType.setStepperSideFilesList,payload:{stepperSideFileList:stepperSideFileList}});
        },
        appendFiles: (files: fileWithExif[]) => {
          dispatch({
              type: UploaderActionType.appendFiles,
              payload: {files: files}
          })
        },
        setExtractedFileValue: (extractedFileValue:any) => {
          dispatch({ type: UploaderActionType.setExtractedFileValue, payload:{extractedFileValue:extractedFileValue}});
        },
        setIsNextEnabled:(IsNextEnabled:boolean)=>{
          dispatch({type: UploaderActionType.setIsNextEnabled,payload:{IsNextEnabled:IsNextEnabled}})
        },
        changeUploadinitiate:(uploadinitiate:boolean)=>{
          dispatch({type:UploaderActionType.changeUploadinitiate,payload:{uploadinitiate:uploadinitiate}});
        },
        setGCPList:(list:IGCP, type: UTMType | LONGLATType)=>{
          dispatch({type:UploaderActionType.setGCPList, payload:{list:list, type: type}})
        },
        setGCPType:(type: UTMType | LONGLATType)=>{
            dispatch({type:UploaderActionType.setGCPType, payload:{ type: type}})
        }
      }
    }

  }
export type UploaderActions =
  | goBack
  | next
  | upload
  | UpdateDate
  | setshowMessage
  | setProject
  | setStructure
  | setStepperSideFilesList
  | appendFiles
  | setExtractedFileValue
  | setIsNextEnabled
  | skipGCP
  | changeUploadinitiate
  | setGCPList
  | setGCPType

