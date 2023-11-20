import { string } from "yup";
import { IUser } from "./IUser";
import { IStructure } from "./IStructure";
import { IProjects } from "./IProjects";
import { IJobs } from "./IJobs";


export enum CaptureType {
    interior = "interior",
    exterior = "exterior"
}

export enum CaptureMode {
    video = "360 Video",
    image = "360 Image",
    phoneImage = "Phone Image",
    lidarScan = "LiDAR Scan",
    droneImage = "Drone Image"
}

export interface ICapture{
    _id: string;
    user: IUser | string;
    type: CaptureType;  //interior , exterior
    updatedAt: string;
    structure: IStructure | string;
    project: IProjects | string;
    mode: CaptureMode; //phone Image, 360 video, 360 image, drone image
    mediaPath: string;
    jobId: IJobs | string;
    isMediaUploaded: boolean;
    createdAt: string;
    captureDateTime: string
}