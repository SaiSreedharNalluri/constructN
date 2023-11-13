

export abstract class RealityBasePlugin {

    protected _scene: THREE.Scene

    protected _camera: THREE.PerspectiveCamera

    protected _renderer?: THREE.WebGLRenderer

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer?: THREE.WebGLRenderer) {

        this._scene = scene

        this._camera = camera

        this._renderer = renderer

    }
    
}