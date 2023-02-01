export interface ITools{
    toolName:string;
    toolAction:string;
    response?:IToolResponse;
}

type IToolResponse = IContext
type IContextType = "Issue" | "Task" | "Progress";

export interface IContext {
    type: IContextType,
    position: IPosition,
    camera?: {
        position: IPosition,
        target: IPosition,
        rotation?: IRotation
    },
    image?: string,
    screenshot?: string
}

export interface IPosition {
    x: Number,
    y: Number,
    z: Number,
}

export interface IRotation {
    pitch: Number,
    yaw: Number,
    roll: Number
}