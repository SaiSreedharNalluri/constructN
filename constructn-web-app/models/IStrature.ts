export interface IStrature {
  success: boolean;
  result?: IStratureEntity[] | null;
}
export interface IStratureEntity {
  _id: string;
  name: string;
  type: string;
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
