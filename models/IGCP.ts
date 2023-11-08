import { location, utmLocation } from "./IRawImages";

export interface IGCP {
    filepath?: string;
    description?: string;
    location?: location[];
    utmLocation?:utmLocation[];
    metaData?: Object;
    capture?: string;
    s3Path?: string;
    base64Code?: string;
}