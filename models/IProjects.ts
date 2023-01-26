export interface IProjects {
  _id: string;
  type: string;
  name: string;
  description?: string;
  company?: null;
  email: string;
  contact: Contact;
  address: Address;
  location?: number[] | null;
  createdAt: string;
  updatedAt: string;
  jobsOpened?: number;
  LastUpdatedOn?: string;
  coverPhoto: string;
  zone: string;
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
export interface Contact {
  code: string;
  number: number;
}
