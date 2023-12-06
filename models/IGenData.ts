import { ISnapshot } from "./ISnapshot"
import { IStructure } from "./IStructure"
import { IViewerContext } from "./IViewerContext"
import { IHotspot } from "./IHotspot"
import { Issue } from "./Issue"
import { ITasks } from "./Itask"
import { ILayer } from "./IReality"

export interface IGenData {

        project: string,
        structure: IStructure,
        snapshotList: ISnapshot[],
        currentViewMode: string,
        currentViewType: string,
        viewerContext: IViewerContext,
        currentSnapshotBase: ISnapshot,
        currentSnapshotCompare?: ISnapshot,
        currentCompareMode: string,
        currentLayersList?: ILayer[],
        currentTaskList: ITasks[],
        currentIssueList: Issue[],
        currentHotspotList: IHotspot[],
        selectedTask?: ITasks,
        selectedIssue?: Issue,
        selectedHotspot?: IHotspot,
        projectUTM?:string,
        currentTypesList:string[]
      }