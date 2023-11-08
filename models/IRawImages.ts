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

export interface location {
    type: type,
    coordinates: [number, number] //long lat
    elevation?: number,
}

