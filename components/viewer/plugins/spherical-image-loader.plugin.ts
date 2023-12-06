
import * as THREE from 'three'

import { degrees2radians } from '@turf/turf'

import { subscribe, publish, unsubscribe } from '../../../services/light-box-service'

import { RealityBasePlugin } from './reality-base.plugin'

export class SphericalImageLoader extends RealityBasePlugin {

    static PLUGIN = "SPHERICAL IMAGE LOADER"

    private _viewerId: string

    private _offset?: number[]

    private _textureLoader = new THREE.TextureLoader()

    private _sphericalMesh?: THREE.Mesh

    private _imageDimensions: { width: number, height: number }

    constructor(viewerId: string, scene: THREE.Scene, camera: THREE.PerspectiveCamera, offset: number[]) {

        super(scene, camera)

        this._viewerId = viewerId

        if(offset) this._offset = offset

        this._imageDimensions = { width: 0, height: 0 }

        subscribe(`load-spherical-image-${this._viewerId}`, this._onSphericalImage)

        subscribe(`show-point-cloud`, this._onShowPointCloud)
    }

    private _onSphericalImage = (event: Event) => {

        const sphericalImage = (event as CustomEvent).detail

        this.loadSphericalImage(sphericalImage, () => {

            if(sphericalImage.viewerId === this._viewerId) publish('publish-viewer-state-' + this._viewerId, '')

        })

    }

    private _initSphericalImage = (sphericalImage: any) => {

        this._textureLoader.load(sphericalImage.imageName, texture => {

            this._imageDimensions = { width: texture.image.naturalWidth, height: texture.image.naturalHeight }

            var sphereGeometry = new THREE.SphereGeometry(0.5, 128, 128)

            var sphereMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, opacity: 1, transparent: true })

            sphereGeometry.scale(-1, 1, 1)

            this._sphericalMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)

            this._sphericalMesh.rotation.y = Math.PI / 2

            this._scene.add(this._sphericalMesh)
            
            this._transformSphere(sphericalImage)

        })
    }

    public loadSphericalImage = (sphericalImage: any, onImageLoaded: Function) => {

        if (sphericalImage) {

            if (!this._sphericalMesh) {

                this._initSphericalImage(sphericalImage)

            }

            this._textureLoader.load(sphericalImage.imageName, texture => {

                this._imageDimensions = { width: texture.image.naturalWidth, height: texture.image.naturalHeight }

                var sphereMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })

                if (this._sphericalMesh) {

                    this._transformSphere(sphericalImage)

                    onImageLoaded()

                    this._sphericalMesh.material.dispose()

                    this._sphericalMesh.material = sphereMaterial

                    this._sphericalMesh.material.needsUpdate = true

                }
            })
        }
    }

    private _applyOffset = (position: THREE.Vector4, offset: number[]) => {

        return new THREE.Vector3(position.x - offset[0], position.y - offset[1], position.z - offset[2])
    }

    private _transformSphere(sphericalImage: any) {

        if (this._offset) {

            let position = sphericalImage.position

            let rotation = sphericalImage.rotation

            this._sphericalMesh!.rotation.x = degrees2radians(rotation[0])

            this._sphericalMesh!.rotation.y = degrees2radians(rotation[1])

            this._sphericalMesh!.rotation.z = degrees2radians(rotation[2])

            position = this._applyOffset(position, this._offset!)

            this._sphericalMesh!.position.set(position.x, position.y, position.z)

            this._camera.position.set(position.x, position.y, position.z)

        }
    }

    public setOffset(offset: number[]) {

        if(offset) this._offset = offset

    }

    private _onShowPointCloud = (event: Event) => {

        const show = (event as CustomEvent).detail

        this._sphericalMesh!.material.opacity = show ? 0 : 1

    }

    public getImageDimensions = () => { return this._imageDimensions }

    public destroy = () => {

        unsubscribe(`load-spherical-image-${this._viewerId}`, this._onSphericalImage)

        unsubscribe(`show-point-cloud`, this._onShowPointCloud)

    }

}