
const subscribe = (eventName: string, listener: EventListenerOrEventListenerObject) => {

    document.addEventListener(eventName, listener)
}

const unsubscribe = (eventName: string, listener: EventListenerOrEventListenerObject) => {

    document.removeEventListener(eventName, listener)
}

const publish = (eventName: string, data: any) => {

    const event = new CustomEvent(eventName, { detail: data })

    document.dispatchEvent(event)
}

export { publish, subscribe, unsubscribe }


class LightBox {

    private _viewerData: any = {}

    private _structureHierarchy: any = {}

    private _viewerState: any

    private _syncState: boolean = true

    private static _lightBox: LightBox

    private constructor() { }

    public static get Instance() {

        if (!this._lightBox) {

            this._lightBox = new LightBox()
        }

        return this._lightBox
    }

    public setStructureHierarchy(hierarchy: any) {

        this._structureHierarchy = hierarchy

    }

    public getStructureHierarchy() {

        return this._structureHierarchy

    }

    public save(payload: any): void {

        this._viewerData = payload

        this.setViewerState(undefined)
    }

    public setSnapshotBase(snapshot: any): void {

        this._viewerData['snapshotBase'] = snapshot

        this.deriveEntries()
    }

    public setSnapshotCompare(snapshot: any): void {

        this._viewerData['snapshotCompare'] = snapshot

        this.deriveEntries()
    }

    public viewerData(): any {

        return this._viewerData
    }

    private deriveEntries() {

        const modelData: { [key: string]: any[] } = {}

            if(this._viewerData && this._viewerData.structure.designs) {

                for(const [Key, Value] of Object.entries(this._viewerData.structure.designs)) {

                    modelData[Key] = Value as any[]
                }

                if(this._viewerData['snapshotBase']?.realities){
                    for(const [Key, Value] of Object.entries(this._viewerData['snapshotBase'].realities)) {

                        modelData[Key] = Value as any[]
                    }
                }
            }



            if(this._viewerData['snapshotCompare']?.realities){

                for (const [Key, Value] of Object.entries(this._viewerData['snapshotCompare'].realities)) {

                    modelData[`${Key}Compare`] = Value as any[]
                }

            }

            this._viewerData['modelData'] = modelData

    }

    public getViewTypes(): string[] {

        let viewTypes: string[] = []

        if(this._viewerData && this._viewerData.structure && this._viewerData.structure.designs) {

            viewTypes = Object.keys(this._viewerData.structure.designs)
        }

        if(this._viewerData['snapshotBase'] && this._viewerData['snapshotBase'].realities) {

            viewTypes = [...viewTypes, ...Object.keys(this._viewerData['snapshotBase'].realities)]
        }

        return viewTypes
    }

    public setCurrentViewType(value: 'Plan Drawings' | 'BIM' | '3D' | '2D') {

        this._viewerData['currentViewType'] = value
    }

    public getCurrentViewType(): 'Plan Drawings' | 'BIM' | '3D' | '2D' {

        return this._viewerData['currentViewType']
    }

    public getSnapshotBase() {

        return this._viewerData['snapshotBase']

    }

    public getSnapshotCompare() {

        if(!this._viewerData['snapshotCompare']) {

            const snapshots = this._viewerData['snapshots']

            if(snapshots && snapshots.length > 1) {

                this._viewerData['snapshotCompare'] = snapshots[1]

                for (const [Key, Value] of Object.entries(this._viewerData['snapshotCompare'].realities)) {

                    this._viewerData['modelData'][`${Key}Compare`] = Value as any[]
                }

            }

        }

        return this._viewerData['snapshotCompare']

    }

    public setViewerState = (viewerState: any) => {

        this._viewerState = viewerState

    }

    public getViewerState = () => {

        return this._viewerState

    }

    public setSyncState = (syncState: boolean) => {

        this._syncState = syncState

        if(syncState) publish('viewerState', this._viewerState)

    }

    public getSyncState = () => {

        return this._syncState

    }

}

export const LightBoxInstance = LightBox.Instance