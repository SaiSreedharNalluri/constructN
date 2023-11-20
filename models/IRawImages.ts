import { type } from "os";

export interface RawImage {
    filename: string;
    deviceId: string;
    externalId: string;
    dateTime: string;
    utmLocation?: utmLocation;
    status: RawImageStatus;
    capture?: string;
    metaData?: metaData;
    createdAt?: string;
    location?: location;
    updatedAt?: string;
    __v?: number;
    _id?: string;
}

export type RawImageCreateResp = { putSignedURL:string } & RawImage

export interface utmLocation {
    northing: number;
    easting: number;
    zone: string
    elevation?: number,
}

type type = "point";
export enum RawImageStatus {
  initiated = "Initiated",
  uploaded = "Uploaded"
}



export interface location {
  type: type,
  coordinates: [number, number] //long lat
  elevation?: number,
}
  
export interface utmLocation {
  northing: number;
  easting: number;
  zone: string
  elevation?: number,
}
  
export interface metaData{
  fileSize:number,
  uploadExpireTime?:string
}