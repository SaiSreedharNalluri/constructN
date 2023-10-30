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

    name: string

    category: string

    stage?: IAssetStage

    structure: string

    measurement: number

    measurementFactor: number

    shape: 'Polygon' | 'Polyline' | 'Circle'

    points: IAssetPoint[]

    description?: string

    properties: any
    
}

export interface IAssetPoint {

    x: number

    y: number

    r?: number

}