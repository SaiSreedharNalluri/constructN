import { IActiveReality, IReality } from "./IReality";

export interface ISnapshot {
  _id: string;
  date: string;
  progress: number;
  project: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  structure: string;
  status: string;
  visualization: [];
  reality?: [IReality];
}

// export interface ISnapShotDeatils {
//   _id: string;
//   progress: number;
//   status: string;
//   visualizations?: null[] | null;
//   structure: StructureOrProject;
//   date: string;
//   project: StructureOrProject;
//   createdAt: string;
//   updatedAt: string;
// }
export interface StructureOrProject {
  _id: string;
  name: string;
}
