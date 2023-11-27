export interface IProjects {
  _id: string;
  type: string;
  name: string;
  description?: string;
  company?: any;
  email: string;
  contact: Contact;
  address: Address;
  location?: number[] | null;
  createdAt: string;
  updatedAt: string;
  jobsOpened?: number;
  LastUpdatedOn?: string;
  coverPhoto: string;
  utm: string;
  timeZone?:string;
  metaDetails?: MetaDetails
}

export interface MetaDetails {
  dashboardURL?: string
  reportURL?: string
}

export interface Contact {
  code: string;
  number: number;
}
export interface Address {
  zipcode: string;
  city: string;
  state: string;
  country: string;
}

export interface IProjectUsers {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: Contact;
  dob: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  age: number;
}

export interface IProjectUserList {
  user:{
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: Contact;
  dob: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  age: number;
  avatar:string;
  
  };
  role:string;
}
export interface Contact {
  code: string;
  number: number;
}
