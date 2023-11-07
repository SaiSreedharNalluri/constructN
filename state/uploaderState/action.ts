import { ChildrenEntity, IStructure } from "../../models/IStructure"

export enum UploaderActionType {
    GoBack,
    Next,
    Upload,
    UpdateDate,
    setshowMessage,
    setStructureList,
    setSectionDetails,
    setStepperSideFilesList
}

export interface GoBack {
    type: UploaderActionType.GoBack
}

export interface Next {
    type: UploaderActionType.Next
}

export interface Upload {
    type: UploaderActionType.Upload
}

export interface UpdateDate {
    type: UploaderActionType.UpdateDate,
    payload:{ date: Date }
}

export interface setshowMessage {
  type: UploaderActionType.setshowMessage
  payload:{ showMessage: boolean }
}

export interface setStructureList {
  type: UploaderActionType.setStructureList
  payload:{structureList:IStructure[]|null}
}

export interface setSectionDetails {
  type: UploaderActionType.setSectionDetails
  payload:{sectionDetails:ChildrenEntity[]}
}

export interface setStepperSideFilesList {
  type: UploaderActionType.setStepperSideFilesList
  payload:{ stepperSideFileList: boolean }
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
        updateDate: (date: Date) => {
          dispatch({ type: UploaderActionType.UpdateDate,  payload: {date: date}});
        },
        setshowMessage: (showMessage:boolean) => {
          dispatch({ type: UploaderActionType.setshowMessage, payload:{showMessage: showMessage}});
        },
        setStructureList: (structureList:IStructure[]|null) => {
          dispatch({ type: UploaderActionType.setStructureList, payload:{structureList:structureList}});
        },
        setSectionDetails: (sectionDetails:ChildrenEntity[]) => {
          dispatch({ type: UploaderActionType.setSectionDetails, payload:{sectionDetails:sectionDetails}});
        },
        setStepperSideFilesList:(stepperSideFileList:boolean)=>{
          dispatch({type:UploaderActionType.setStepperSideFilesList,payload:{stepperSideFileList:stepperSideFileList}});
        }

      },
    };
  };

export type UploaderActions = GoBack | Next | Upload | UpdateDate | setshowMessage | setStructureList | setSectionDetails |setStepperSideFilesList