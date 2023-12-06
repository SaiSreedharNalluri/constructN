import { ICapture } from "./ICapture";
import { IProjects } from "./IProjects";
import { IStructure } from "./IStructure";
import { IUser } from "./IUser";


export enum JobStatus {
  captured = "captured",
  pendingUpload = "pendingUpload",
  uploadFailed = "uploadFailed",
  uploaded = "uploaded",
  readyForProcessing = "readyForProcessing",
  geoSpatialMapping = "geoSpatialMapping",
  realityUploaded = "realityUploaded",
  readyForVisualization = "readyForVisualization",
  active = "active",
  progress = "progress"
}

export interface IJobs {
  _id: string;
  project: IProjects | string;
  structure: IStructure | string;
  createdBy: IUser | string;
  assignedTo: string;
  status: JobStatus;
  captures: ICapture[] | string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}
// export interface Project {
//   _id: string;
//   type: string;
//   name: string;
//   company: string;
//   email: string;
// }
// export interface Structure {
//   _id: string;
//   name: string;
//   type: string;
//   isExterior: boolean;
//   project: string;
//   parent: string;
//   children?: null[] | null;
//   location?: null[] | null;
// }
// export interface CreatedBy {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   fullName: string;
// }
// export interface CapturesEntityOrSelectedCapturesEntity {
//   _id: string;
//   user: string;
//   project: string;
//   structure: string;
//   captureDateTime: string;
//   jobId: string;
//   type: string;
//   mode: string;
//   isMediaUploaded: boolean;
//   approvedStatus?: boolean;
//   mediaPath: string;
// }

