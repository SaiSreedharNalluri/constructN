

export abstract class IControls {

    protected _camera: THREE.PerspectiveCamera

    protected _viewerId: string

    protected _viewerState: any

    constructor(viewerId: string, camera: THREE.PerspectiveCamera) {

        this._viewerId = viewerId

        this._camera = camera

    }

    public abstract update(): THREE.Vector3

    protected abstract enableControls(): void

    protected abstract disableControls(): void

    public abstract setViewerState(viewerState: any): void

    public abstract destroy(): void

    public abstract reset(): void

}