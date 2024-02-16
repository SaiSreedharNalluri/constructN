export interface IAssetCategory {

    _id: string

    name: string

    project: string

    stages: IAssetStage[]

    shape: 'Polgon' | 'Line' | 'Circle' | 'Point'

    height: number
  
    width: number

    drawing?: string

    description?: string

    properties: any
    
}

export interface IAssetStage {

    _id: string

    name: string

    sequence: number
  
    color: string
  
    uom: string
  
    measurement: string
  
    metrics: any
  
    predecessors: number[]
  
    description?: string

    metrics?: { [key:string]: number}

}

export interface IAsset {

    _id: string

    name: string

    category: string | IAssetCategory

    progress: IAssetProgress

    progressSnapshot: IAssetProgress[]

    project: string

    structure: string

    measurement: number

    measurementFactor: number

    shape: 'Polygon' | 'Polyline' | 'Circle'

    points: IAssetPoint[]

    description?: string

    createdBy: any

    createdAt: Date

    updatedAt: Date

    properties: any

    metrics?: { [key: string]: string | number | { metric: string} | { metric: { metric: string }} }

    compare?: boolean

    status?: 'Active' | 'Inactive'
    
}

export interface IAssetProgress {

    stage: string | IAssetStage

    measurement: number

    uom: string

    date: Date,

    updatedBy: any

    updatedAt: Date

}

export interface IAssetPoint {

    x: number

    y: number

    r?: number

}

export const NOT_STARTED_STAGE: IAssetStage = { 
    
    name: 'NOT STARTED', 
    
    sequence: 0, 
    
    color: '#000080', 
    
    _id: 'NOT_STARTED', 

    measurement: 'Count',

    metrics: {},

    predecessors: [],
    
    uom: 'NA' 

}