export interface IReality {
    _id: string;
    job: string;
    capture: string;
    snapshot: string;
    completedDateTime: Date | string;
    realityType?:string[];
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

type RealityMode = "360 Video" | "360 Image" | "Phone Image" | "Drone Image" | "Stages";
export interface ILayer {
    name: string,
    isSelected: boolean,
    children: ILayer[],
    realities?: IReality[],
    filters?: any[]
}
export type IActiveRealityMap = {
    [key in RealityMode]: ILayer
};