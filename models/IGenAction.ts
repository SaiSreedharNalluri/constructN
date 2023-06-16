import { IGenData } from "./IGenData";
import { IHotspot } from "./IHotspot";
import { ISnapshot } from "./ISnapshot";
import { IContext } from "./ITools";
import { IViewerContext } from "./IViewerContext";
import { Issue } from "./Issue";
import { ITasks } from "./Itask";

export interface IGenNotifyViewerAction {
    type: "loadGenViewer" | "syncGenViewer" | "setViewMode" | "setViewType" | "setViewerContext" | "addViewLayer" | "removeViewLayer" | "setCompareMode" | 'closeGenViewer' | 'setStructure'| 'setBaseSnapshot' | 'setCompareSnapshot' |
    "viewIssue" | "createIssue" | "createSuccessIssue" | "createFailIssue" | "selectIssue" | "showIssue" | "hideIssue" | "removedIssue" | 'setFilteredIssueList' |
    "viewTask" | "createTask" | "createSuccessTask" | "createFailTask" | "selectTask" | "showTask" | "hideTask" | "removedTask" | 'setFilteredTaskList' |
    "viewHotspot" | "createHotspot" | "createSuccessHotspot" | "createFailHotspot" | "selectHotspot" | "showHotspot" | "hideHotspot" | "removedHotspot" |
    "setFullScreenMode"
    ,
    
    data? :string |[string] | [ITasks] | [Issue] | [IHotspot] | IViewerContext | IGenData | ISnapshot | IContext

}
export interface IGenNotifyAppAction {
    type: "setViewMode" | "setViewType" | "setViewerContext" | "setCompareMode" |
    "viewIssue" | "createIssue" | "selectIssue" | 
    "viewTask" | "createTask" | "selectTask" |
    "viewHotspot" | "createHotspot" | "selectHotspot"
    ,
    
    data? :string |[string] | [ITasks] | [Issue] | [IHotspot] | IViewerContext | IContext

}