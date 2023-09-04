export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: Contact;
  dob: string;
  isSupportUser: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName: string;
  age: number;
  token: string;
  avatar:string
}
export interface Contact {
  code: string;
  number: number;
}
