export interface ITools {
  toolName: string;
  toolAction: string;
  response?: IToolResponse;
}

export type IToolResponse = IContext;
export type IContextType = "Issue" | "Task" | "Progress";

export interface IContext {
  type: IContextType;
  id?: string;
  cameraObject?: {
    cameraPosition: IPosition;
    caremaTarget: IPosition;
    pitch?: Number;
    yaw?: Number;
    fov?: Number;
  };
  image?: {
    imageName: string;
    imagePosition: IPosition;
    imageRotation?: IRotation;
  };
  tag?: {
    tagPosition: IPosition;
    screenShot?: string;
  };
}

export interface IPosition {
  x: Number;
  y: Number;
  z: Number;
}

export interface IRotation {
  pitch: Number;
  yaw: Number;
  roll: Number;
}
