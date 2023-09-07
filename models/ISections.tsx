export interface ISections{
    _id:string,
    name:string,
    type:string,
    project:string
    parent:string;
    issueCount:number,
    taskCount:number,
    status:string,
    lastUpdated:string,
    children:ChildrenEntity[] | null
    capture:Capture
    designs:any
    snapshots:Snapshot
}
export interface ChildrenEntity{
    _id:string,
    isExterior:boolean,
    issueCount:number,
    lastUpdated:string,
    location:any,
    name:string,
    parent:string,
    project:string,
    status:string,
    taskCount:number,
    type:string,
    designs:any,
    capture:Capture
    snapshots:Snapshot
}

export interface Capture{
    "360 Video":number,
    "LiDar Scan":number,
    "Phone Image":number,
    "360 Image":number,
    totalCount:number
}
export interface Snapshot{
    lastSnapshot:LastSnapshot
    snapshotActiveCount:number
    snapshotInActiveCount:number
    snapshotReviewCount:number
}
export interface LastSnapshot{
    captureDateTime:string
    state:string
} 