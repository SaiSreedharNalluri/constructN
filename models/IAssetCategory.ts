export interface IAssetCategory {

    _id: string

    name: string

    project: string

    stages: IAssetStage[]

    shape: 'Polgon' | 'Line' | 'Circle' | 'Point'

    description?: string

    properties: any
    
}

export interface IAssetStage {

    _id: string

    name: string

    sequence: number

    color: string

    uom: string

    description?: string

}

export interface IAsset {

    _id: string

    name: string

    category: string | IAssetCategory

    progress: IAssetProgress

    progressSnapshot: IAssetProgress[]

    structure: string

    measurement: number

    measurementFactor: number

    shape: 'Polygon' | 'Polyline' | 'Circle'

    points: IAssetPoint[]

    description?: string

    createdBy: any

    properties: any
    
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
    
    uom: 'NA' 

}