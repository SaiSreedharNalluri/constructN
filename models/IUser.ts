export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contact?: Contact;
  dob: string;
  isSupportUser: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName: string;
  age: number;
  token: string;
  avatar:string;
  address?:Address;
}
export interface Contact {
  code: string;
  number: number;
}

export interface Address{
  line1?: string;
  line2?: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
}
