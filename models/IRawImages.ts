export interface RawImage {
    filename: string;
    deviceId: string;
    externalId: string;
    dateTime: string;
    longLatCoordinates?:  [number, number,number];
    utmLocation?: utmLocation;
    status: status;
    capture?: string;
    metaData?: Object;
}

export interface utmLocation {
    northing: number;
    easting: number;
    zone: string
    elevation?: number,
}

type type = "point";
type status = "Initiated" | "Uploaded";



interface Location {
    type: string; //point
    elevation: number;
    coordinates: number[];
  }
  
  interface UtmLocation {
    northing: number;
    easting: number;
    zone: string;
    elevation: number;
  }
  
  export interface RawImageAPIResponse {
    capture: string;
    createdAt: string;
    dateTime: string;
    deviceId: string;
    externalId: string;
    filename: string;
    location: Location;
    putSignedURL: string;
    status: string;
    updatedAt: string;
    utmLocation: UtmLocation;
    __v: number;
    _id: string;
  }
