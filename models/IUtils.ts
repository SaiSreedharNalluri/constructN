export enum customHeaderState {
    ChangePassword = "ChangePassword",
    MyProfile = "My Profile",
    UploadsInProgress ='Uploads In Progress'
}
export interface ProjectCounts {
    [projectId: string]: number;
  }