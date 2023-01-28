export interface IReality {
    _id: string;
    job: string;
    capture: string;
    snapshot: string;
    completedDateTime: Date;
    status: string;
    type: string;
    mode: string;
    context?: string;
}

export interface IActiveReality {
    reality: string,
    type: string,
    mode: string,
}

type RealityMode = "360 Video" | "360 Image" | "Phone Image" | "Drone Image";
export type IActiveRealityMap = {
    [key in RealityMode]: [IActiveReality];
};