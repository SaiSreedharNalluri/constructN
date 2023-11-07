import { ChildrenEntity, IStructure } from "../../models/IStructure";
import { fileWithExif } from "./state";

export enum UploaderActionType {
  GoBack,
  Next,
  Upload,
  UpdateDate,
  setshowMessage,
  setStructureList,
  setSectionDetails,
  appendFiles, setExtractedFileValue,
    setIsNextEnabled,
}

export interface GoBack {
  type: UploaderActionType.GoBack;
}

export interface Next {
  type: UploaderActionType.Next;
}

export interface Upload {
  type: UploaderActionType.Upload;
}

export interface UpdateDate {
    type: UploaderActionType.UpdateDate,
    payload:{ date: Date |null}
}

export interface setshowMessage {
  type: UploaderActionType.setshowMessage;
  payload: { showMessage: boolean };
}

export interface setStructureList {
  type: UploaderActionType.setStructureList;
  payload: { structureList: IStructure[] | null };
}

export interface setSectionDetails {
  
  type: UploaderActionType.setSectionDetails
  payload:{sectionDetails:IStructure}
}

export interface setExtractedFileValue {
  type: UploaderActionType.setExtractedFileValue
  payload:{extractedFileValue:any}
}

export interface setIsNextEnabled{
  type:UploaderActionType.setIsNextEnabled
  payload:{IsNextEnabled:boolean};
}

export interface appendFiles {
  type: UploaderActionType.appendFiles;
  payload: { files: fileWithExif[] };
}

export const contextActions = (dispatch: React.Dispatch<UploaderActions>) => {
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
        updateDate: (date: Date|null) => {
          dispatch({ type: UploaderActionType.UpdateDate,  payload: {date: date}});
        },
        setshowMessage: (showMessage:boolean) => {
          dispatch({ type: UploaderActionType.setshowMessage, payload:{showMessage: showMessage}});
        },
        setStructureList: (structureList:IStructure[]|null) => {
          dispatch({ type: UploaderActionType.setStructureList, payload:{structureList:structureList}});
        },
        setSectionDetails: (sectionDetails:any) => {
          dispatch({ type: UploaderActionType.setSectionDetails, payload:{sectionDetails:sectionDetails}});
        },
        setExtractedFileValue: (extractedFileValue:any) => {
          dispatch({ type: UploaderActionType.setExtractedFileValue, payload:{extractedFileValue:extractedFileValue}});
        },
        setIsNextEnabled:(IsNextEnabled:boolean)=>{
          dispatch({type: UploaderActionType.setIsNextEnabled,payload:{IsNextEnabled:IsNextEnabled}})
        },
      appendFiles: (files: fileWithExif[]) => {
        dispatch({
            type: UploaderActionType.appendFiles,
            payload: {files: files}
        })
      },
    },
  };
}

export type UploaderActions =
  | GoBack
  | Next
  | Upload
  | UpdateDate
  | setshowMessage
  | setStructureList
  | setSectionDetails
  | appendFiles
  | setExtractedFileValue | setIsNextEnabled

