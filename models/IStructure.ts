export interface IStructure {
  success: boolean;
  result?: IStructureEntity[] | null;
}
export interface IStructureEntity {
  _id: string;
  project:string;
  name: string;
  type: string;
  parent?: null;
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
