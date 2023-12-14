import { type } from "os";
import { location, utmLocation } from "./IRawImages";

export interface IGCP {
    filepath?: string;
    description?: string;
    location?: location[];
    utmLocation?:utmLocation[];
    metaData?: Object;
    capture?: string;
    s3Path?: string;
    base64ImageName?: string;
    base64Code?: string;
}

export interface utmGCP {
    EASTING: number,
    NORTHING: number,
    ElEVATION: number,
    UTMZONE: number,
    Label: string
}

export interface longLatGCP {
    LATITUDE: number,
    LONGITUDE: number,
    ALTITUDE: number,
    Label: number,
}

export enum GCPType {
    UTM = "UTM",
    LONGLAT = "LngLat"
}

export type UTMType = GCPType.UTM
export type LONGLATType = GCPType.LONGLAT
export type GCPUploadFile = utmGCP & longLatGCP