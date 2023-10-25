export interface IAssetCategory {

    name: string

    project: string

    stages: IAssetStage[]

    shape: 'Polgon' | 'Line' | 'Circle' | 'Point'

    description?: string

    properties: any
    
}

export interface IAssetStage {

    name: string

    sequence: number

    color: string

    uom: string

    description?: string

}