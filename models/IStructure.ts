import { IDesign } from "./IDesign";

export interface IStructures {
  success: boolean;
  result?: IStructure[] | null;
}
export interface IStructure {
  _id: string;
  name: string;
  // progress: ProgressSnapshot;
  type: string;
  isExterior: boolean;
  // fm: number;
  project: string;
  parent?: string;
  location?: [number];
  utm?: string;
  designs?: [IDesign];
  children?: ChildrenEntity[] | null;
}
export interface ChildrenEntity {
  _id: string;
  name: string;
  project:string;
  type: string;
  parent: string;
  children?: ChildrenEntity1[] | null;
}
export interface ChildrenEntity1 {
  _id: string;
  name: string;
  type: string;
  parent: string;
  children?: null[] | null;
}
