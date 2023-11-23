export interface Comments {
  _id: string;
  comment: string;
  by: By;
  entity: string;
  replies?: RepliesEntity[] | null;
  createdAt: string;
  updatedAt: string;
}
export interface By {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  avatar: string;
}
export interface RepliesEntity {
  _id: string;
  reply: string;
  by: By;
  replies?: RepliesEntity[] | null;
  createdAt: string;
  updatedAt: string;
}
