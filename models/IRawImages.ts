export interface RawImage {
    filename: string;
    deviceId: string;
    externalId: string;
    dateTime: string;
    utmLocation?: utmLocation;
    status: status;
    capture?: string;
    metaData?: Object;
    createdAt?: string;
    location?: location;
    putSignedURL?: string;
    updatedAt?: string;
    __v?: number;
    _id?: string;
}

export interface utmLocation {
    northing: number;
    easting: number;
    zone: string
    elevation?: number,
}

type type = "point";
type status = "Initiated" | "Uploaded";



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
  
