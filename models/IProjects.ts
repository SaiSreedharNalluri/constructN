import {location, utmLocation } from "./IRawImages";

export interface IProjects {
  _id: string;
  type: string;
  name: string;
  description?: string;
  company?: any;
  email: string;
  contact?: Contact;
  address?: Address;
  // location?: number[] | null;
  location?: location[];
  utmLocation?:utmLocation[];
  createdAt: string;
  updatedAt: string;
  jobsOpened?: number;
  LastUpdatedOn?: string;
  coverPhoto: string;
  // utm: string;
  timeZone?:string;
  metaDetails?: MetaDetails;
  measurement?:string;
  [key: string]: any;
  // latitude:number,
  // longitude:number,
  nickName:string,
  // projectId:number,
}

export interface MetaDetails {
  dashboardURL?: string
  reportURL?: string
  projectIntend?:string
  projectId?:string
  procore?:Procore
}
export interface Procore{
  projectId?:number | undefined
  companyId?:number |undefined
}
export interface Contact {
  code: string;
  number: number;
}
export interface Address {
  line1?:string;
  zipcode?: string;
  city?: string;
  state?: string;
  country?: string;
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
