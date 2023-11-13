
import * as THREE from 'three'

import { degrees2radians, radians2degrees } from "@turf/turf"

import { LightBoxInstance, publish, subscribe, unsubscribe } from "../../../services/light-box-service"

import { IControls } from "./IControls"

export class SphericalImageControls extends IControls {

    static CONTROLS = "SPHERICAL IMAGE CONTROLS"

    private isUserInteracting = false

    private onPointerDownMouseX = 0

    private onPointerDownMouseY = 0

    private lon = 0

    private onPointerDownLon = 0

    private lat = 0

    private onPointerDownLat = 0

    private phi = 0

    private theta = 0

    private _targetEl: HTMLElement

    constructor(viewerId: string, camera: THREE.PerspectiveCamera, targetEl: HTMLElement) {

        super(viewerId, camera)

        this._targetEl = targetEl

        this.enableControls()

        subscribe('3d-controls', this.onCotrolsState)

    }

    protected enableControls = () => {

        this._targetEl.addEventListener('pointerdown', this.onPointerDown)

        this._targetEl.addEventListener('wheel', this.onDocumentMouseWheel)

        this._targetEl.addEventListener('keydown', this.onKeyDown)

    }

    protected disableControls = () => {

        this._targetEl.removeEventListener('pointerdown', this.onPointerDown)

        this._targetEl.removeEventListener('wheel', this.onDocumentMouseWheel)

        this._targetEl.removeEventListener('keydown', this.onKeyDown)

    }

    update = () => {

        this.lat = Math.max(- 85, Math.min(85, this.lat))

        this.phi = degrees2radians(90 - this.lat)

        this.theta = -1 * degrees2radians(this.lon)

        const x = Math.sin(this.phi) * Math.cos(this.theta)

        const y = Math.sin(this.phi) * Math.sin(this.theta)

        const z = Math.cos(this.phi)

        const offset = [0, 0, 0]

        if (this._camera) {

            offset[0] = this._camera.position.x

            offset[1] = this._camera.position.y

            offset[2] = this._camera.position.z

        }

        const target = new THREE.Vector3(offset[0] + x, offset[1] + y, offset[2] + z)

        this._camera?.lookAt(target)

        this._viewerState = {

            position: this._camera.position as THREE.Vector3,

            rotation: this._camera.rotation as THREE.Euler,

            target: target,

            fov: this._camera.fov,

            viewerId: this._viewerId

        }

        return this._viewerState

    }

    setViewerState = (viewerState: any) => {

        const position = structuredClone(viewerState.position)

        const target = structuredClone(viewerState.target)

        if (viewerState.target) {

            let x = target.x - position.x

            let y = target.y - position.y

            let z = target.z - position.z

            let phi = Math.acos(z)

            let theta = Math.atan2(x, y)

            if (!Number.isNaN(radians2degrees(theta))) this.lon = -90 + radians2degrees(theta)

            if (!Number.isNaN(radians2degrees(phi))) this.lat = 90 - radians2degrees(phi)

        }

        if (viewerState.fov)

            this._camera.fov = viewerState.fov


        this._camera.updateProjectionMatrix()

        this.update()

    }

    destroy = () => {

        this.disableControls()

        unsubscribe('3d-controls', this.onCotrolsState)

    }

    reset = () => {

    }

    private onPointerDown = (event: any) => {

        if (event.isPrimary === false) return

        this.isUserInteracting = true

        this.onPointerDownMouseX = event.clientX

        this.onPointerDownMouseY = event.clientY

        this.onPointerDownLon = this.lon

        this.onPointerDownLat = this.lat

        document.addEventListener('pointermove', this.onPointerMove)

        document.addEventListener('pointerup', this.onPointerUp)
    }

    private onPointerMove = (event: any) => {

        if (event.isPrimary === false) return

        this.lon = (this.onPointerDownMouseX - event.clientX) * 0.15 + this.onPointerDownLon

        this.lat = (event.clientY - this.onPointerDownMouseY) * 0.15 + this.onPointerDownLat

        this.publishViewerState()

    }

    private onPointerUp = (event: any) => {

        if (event.isPrimary === false) return

        this.isUserInteracting = false

        document.removeEventListener('pointermove', this.onPointerMove)

        document.removeEventListener('pointerup', this.onPointerUp)
    }

    private onDocumentMouseWheel = (event: any) => {

        const fov = this._camera.fov + event.deltaY * 0.05

        if (fov < 10) this._camera.fov = 10

        else if (fov > 100) this._camera.fov = 100

        else this._camera.fov = fov

        this._camera.updateProjectionMatrix()

        this.publishViewerState()

    }

    private onKeyDown = (event: KeyboardEvent) => {

        switch (event.code) {

            case 'ArrowLeft':

                this.lon -= 3

                break

            case 'ArrowRight':

                this.lon += 3

                break

            case 'ArrowUp':

                this.lat += 3

                break

            case 'ArrowDown':

                this.lat -= 3

                break

        }

        event.stopPropagation()

        this.publishViewerState()
    }

    private publishViewerState =() => {

        publish('viewerState', this._viewerState)
    
        LightBoxInstance.setViewerState(this._viewerState)
    
      }

    private onCotrolsState = (event: Event) => {

        const state = (event as CustomEvent).detail

        if(state === 'enable') this.enableControls()

        else this.disableControls()

    }
}