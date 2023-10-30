export enum UploaderActionType {
    GoBack,
    Next,
    Upload,
    UpdateDate,
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
      },
    };
  };

export type UploaderActions = GoBack | Next | Upload | UpdateDate