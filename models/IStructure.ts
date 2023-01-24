export interface IStructures {
  success: boolean;
  result?: IStructure[] | null;
}
export interface IStructure {
  _id: string;
  name: string;
  type: string;
  isExterior: boolean;
  parent?: null;
  children?: ChildrenEntity[] | null;
}
export interface ChildrenEntity {
  _id: string;
  name: string;
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
