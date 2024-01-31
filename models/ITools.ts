import { IGenData } from "./IGenData";
import { IHotspot } from "./IHotspot";
import { ILayer } from "./IReality";
import { ISnapshot } from "./ISnapshot";
import { IViewerContext } from "./IViewerContext";
import { Issue } from "./Issue";
import { ITasks } from "./Itask";

export interface ITools {
  toolName: string;
  toolAction: string;
  response?: IToolResponse;
}

export type IToolResponse = IContext;
export type IContextType = "Issue" | "Task" | "Progress";

export interface IContext {
  type?: string;
  id?: string;
  cameraObject?: {
    cameraPosition: IPosition;
    cameraTarget?: IPosition;
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
  screenShot?:Blob;
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

export interface IToolbarAction {
  type:  "setViewMode" | "setViewType" | "setViewLayers" | "addViewLayer" | "removeViewLayer" | "setCompareMode" | 'setStructure'| 'setBaseSnapshot' | 'setCompareSnapshot' |
  "viewIssueList" | "createIssue" | "createSuccessIssue" | "createFailIssue" | "selectIssue" | "showIssue" | "hideIssue" | "removedIssue" | 'setFilteredIssueList' | 'handleIssueFilter' | 'closeFilterOverlay' |
  "handleTaskFilter" | "closeTaskOverlay" | "viewTaskList" | "createTask" | "createSuccessTask" | "createFailTask" | "selectTask" | "showTask" | "hideTask" | "removedTask" | 'setFilteredTaskList' |
  "viewHotspotList" | "createHotspot" | "createSuccessHotspot" | "createFailHotspot" | "selectHotspot" | "showHotspot" | "hideHotspot" | "removedHotspot" |
  "setFullScreenMode" | "closeIssueDrawer" | "closeTaskDrawer" | "editIssue" | "editTask" | "sortIssue" | "sortTask" | "deleteIssueAttachment" | "deleteTaskAttachment"
  ,
  
  data? :string |[string] | [ITasks] | [Issue] | [IHotspot] | IViewerContext | IGenData | ISnapshot | IContext | ILayer[]

}
