import { IPosition } from "./ITools"

export interface IViewerContext {
    cameraObject?: {
        cameraPosition: IPosition;
        caremaTarget: IPosition;
        pitch?: Number;
        yaw?: Number;
        fov?: Number;
      },
    location?: [Number]
  }