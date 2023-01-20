export interface IProjects {
  _id: string;
  type: string;
  name: string;
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
