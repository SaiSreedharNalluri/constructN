'use client'

import * as THREE from 'three'

import React, { useEffect, useRef } from 'react'

import { LightBoxInstance, publish, subscribe, unsubscribe } from '../../services/light-box-service'

import { IControls } from './controls/IControls'

import { SphericalImageControls } from './controls/spherical-image-controls'

interface IProps {

  id: string

  onInit?: Function

  viewerState?: any

  annotations?: any,

  sphericalImage?: any,

  plugins?: string[]

}


function PotreeViewer(props: IProps) {

  const _viewerState = useRef<any>()

  const viewerId = props.id

  const _scene = useRef<THREE.Scene>(new THREE.Scene())

  const _renderer = useRef<THREE.WebGLRenderer>()

  const _camera = useRef<THREE.PerspectiveCamera>()

  const _controls = useRef<IControls>()

  let _targetEl: HTMLElement | null

  let _reqAnimationFrameHandle: number | undefined


  const initViewer = function () {

    if (!_renderer.current) {

      _targetEl = document.getElementById(viewerId)

      if (_targetEl) {

        if (viewerId == 'left') _renderer.current = PotreeInstance.Instance.getBaseViewer()!

        else _renderer.current = PotreeInstance.Instance.getCompareViewer()!

        _targetEl.appendChild(_renderer.current.domElement)

        _camera.current = new THREE.PerspectiveCamera(75, _renderer.current.domElement.clientWidth / _renderer.current.domElement.clientHeight, 0.1, 1100)

        _camera.current?.up.set(0, 0, 1)

        _scene.current!.background = new THREE.Color(0x12191C)

        _resize()

        _targetEl.style.touchAction = 'none'

        _controls.current = new SphericalImageControls(viewerId, _camera.current, _targetEl)

        window.addEventListener('resize', _resize)

        requestAnimationFrame(_loop)

        if (props.onInit) props.onInit(_scene, _camera, _renderer)

      }

    } else {

      console.log('CNI.AI', 'Potree viewer already Initialised')

    }
  }

  const _resize = () => {

    const canvas = _renderer.current!.domElement
    
    const width = canvas.clientWidth

    const height = canvas.clientHeight

    _camera.current!.aspect = width / height

    _camera.current?.updateProjectionMatrix();

    _renderer.current?.setSize(width, height);
  }

  const _render = () => {

    const viewerState = _controls.current!.update()

    _viewerState.current = viewerState

    LightBoxInstance.setViewerState(viewerState)

    _renderer.current?.render(_scene.current, _camera.current!)

  }

  const _loop = (): void => {

    _render()

    _reqAnimationFrameHandle = requestAnimationFrame(_loop)

  }
  

  const _destroy = () => {

    _targetEl!.removeChild(_renderer.current!.domElement)

    _targetEl = null

    window.removeEventListener('resize', _resize);

    // TODO: clean point clouds or other objects added to the scene.

    if (_reqAnimationFrameHandle !== undefined) {

      cancelAnimationFrame(_reqAnimationFrameHandle)
    }
  }

  const _publishViewerState = () => {

    publish('viewerState', _viewerState.current)

    LightBoxInstance.setViewerState(_viewerState.current)

  }

  useEffect(() => {

    subscribe('viewerState', onViewerStateChange)

    subscribe('publish-viewer-state', _publishViewerState)

    subscribe('reset-viewer-state', _onResetViewerState)

    initViewer()

    return () => {

      unsubscribe('viewerState', onViewerStateChange)

      unsubscribe('publish-viewer-state', _publishViewerState)

      unsubscribe('reset-viewer-state', _onResetViewerState)


    }

  }, [])

  useEffect(() => { updateViewerState(props.viewerState) }, [props.viewerState])

  const onViewerStateChange = (event: Event) => {

    const viewerState = (event as CustomEvent).detail

    if (LightBoxInstance.getSyncState()) updateViewerState(viewerState)

  }

  const _onResetViewerState = (event: Event) => {

    const viewerState = LightBoxInstance.getViewerState()

    updateViewerState(viewerState)

  }

  const updateViewerState = (viewerState: any) => {

    if (viewerState && viewerId != viewerState.viewerId) {

      _controls.current?.setViewerState(viewerState)

    }

  }

  return (
    <>

      <div id={viewerId} className='w-full h-full [&>canvas]:!w-full [&>canvas]:!h-full [&>canvas]:rounded-lg'></div>

    </>
  )
}

export default PotreeViewer


class PotreeInstance {

  private static _instance: PotreeInstance

  private _baseViewer: THREE.WebGLRenderer | undefined

  private _compareViewer: THREE.WebGLRenderer | undefined

  private constructor() { }

  public static get Instance() {

    if (!this._instance) {

      this._instance = new PotreeInstance()
    }

    return this._instance
  }

  public getBaseViewer() {

    if (!this._baseViewer) {

      this._baseViewer = new THREE.WebGLRenderer({ antialias: true })

    }

    return this._baseViewer
  }

  public getCompareViewer() {

    if (!this._compareViewer) {

      this._compareViewer = new THREE.WebGLRenderer({ antialias: true })

    }

    return this._compareViewer
  }

}