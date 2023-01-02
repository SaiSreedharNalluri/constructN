export interface IJobs {
  _id: string;
  project: Project;
  structure: Structure;
  createdBy: CreatedBy;
  assignedTo: string;
  status: string;
  captures?: CapturesEntityOrSelectedCapturesEntity[];
  selectedCaptures?: CapturesEntityOrSelectedCapturesEntity[];
  date: string;
  createdAt: string;
  updatedAt: string;
}
export interface Project {
  _id: string;
  type: string;
  name: string;
  company: string;
  email: string;
}
export interface Structure {
  _id: string;
  name: string;
  type: string;
  isExterior: boolean;
  project: string;
  parent: string;
  children?: null[] | null;
  location?: null[] | null;
}
export interface CreatedBy {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}
export interface CapturesEntityOrSelectedCapturesEntity {
  _id: string;
  user: string;
  project: string;
  structure: string;
  captureDateTime: string;
  jobId: string;
  type: string;
  mode: string;
  isMediaUploaded: boolean;
  approvedStatus?: boolean;
  mediaPath: string;
}
