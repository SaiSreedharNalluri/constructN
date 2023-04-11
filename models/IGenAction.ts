import { IHotspot } from "./IHotspot";
import { IViewerContext } from "./IViewerContext";
import { Issue } from "./Issue";
import { ITasks } from "./Itask";

export interface IGenNotifyViewerAction {
    type: "loadGenViewer" | "syncGenViewer" | "setViewMode" | "setViewType" | "setViewerContext" | "addViewLayer" | "removeViewLayer" | "setCompareMode" | 'closeGenViewer' |
    "issueView" | "issueCreate" | "issueCreateSuccess" | "issueCreateFail" | "issueSelect" | "issueShow" | "issueHide" | "issueRemoved" |
    "taskView" | "taskCreate" | "taskCreateSuccess" | "taskCreateFail" | "taskSelect" | "taskShow" | "taskHide" | "taskRemoved" |
    "hotspotView" | "hotspotCreate" | "hotspotCreateSuccess" | "hotspotCreateFail" | "hotspotSelect" | "hotspotShow" | "hotspotHide" | "hotspotRemoved"
    ,
    
    data? :string |[string] | [ITasks] | [Issue] | [IHotspot] | IViewerContext

}
export interface IGenNotifyAppAction {
    type: "setViewMode" | "setViewType" | "setViewerContext" | "setCompareMode" |
    "issueView" | "issueCreate" | "issueSelect" | 
    "taskView" | "taskCreate" | "taskSelect" |
    "hotspotView" | "hotspotCreate" | "hotspotSelect"
    ,
    
    data? :string |[string] | [ITasks] | [Issue] | [IHotspot] | IViewerContext

}