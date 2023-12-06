'use client'

import * as THREE from 'three'

import React, { FC, MutableRefObject, useEffect, useRef, useState } from 'react'

import dynamic from "next/dynamic"

import { useSearchParams } from 'next/navigation'

import { LightBoxInstance, publish, subscribe, unsubscribe } from '../../services/light-box-service'

import instance from '../../services/axiosInstance'

import { SphericalImageLoader } from './plugins/spherical-image-loader.plugin'

const PotreeViewer = dynamic(() => { return import('./potree') }, { ssr: false })


type _ViewerProps = {

    viewerState?: any

    isCompare?: boolean

    tasksList: any[]

    issuesList: any[]
}

const RealityPage: FC<any> = (props) => {

    const _scene = useRef<THREE.Scene>()

    const _camera = useRef<THREE.PerspectiveCamera>()

    const _renderer = useRef<THREE.WebGLRenderer>()

    const viewerId = props.id

    let [isCompare, setIsCompare] = useState(props.isCompare ? props.isCompare : false)

    const _offset = useRef<number[]>()

    const _tm = useRef<number[]>()

    const _layers = useRef<any>()

    const _sphericalImageLoader = useRef<SphericalImageLoader>()

    // const _potreeLoader = useRef<PotreePointcloudLoader>()

    const searchParams = useSearchParams()

    const [showCustomMaskDialog, setShowCustomMaskDialog] = useState<boolean>(false)

    useEffect(() => {

        subscribe('reality-click', onRealityItemClick)

        return () => {

            unsubscribe('reality-click', onRealityItemClick)

            _sphericalImageLoader.current?.destroy()

        }

    }, [])

    useEffect(() => {

        isCompare = props.isCompare!

        setIsCompare(isCompare)

    }, [props.isCompare])

    useEffect(() => {

        if(props.snapshot) {

            _generateTmData()
            
            _layers.current = props.snapshot.layers

        }

    }, [props.snapshot])

    const onRealityItemClick = (event: Event) => {

        const reality = (event as CustomEvent).detail

        const realityPosition = new THREE.Vector3(reality.position.x, reality.position.y, reality.position.z)

        let nearestImage: any

        let nearest: number = Number.MAX_VALUE

        if(_layers.current && _layers.current[reality.type]) {

            const mRealities = _layers.current[reality.type]

            for(let i = 0; i < mRealities.length; i++) {

                const image = reality.imageName.split('/images/')[1]

                if(mRealities[i].position[image]) {

                    reality['viewerId'] = viewerId

                    publish(`load-spherical-image-${viewerId}`, reality)

                    // _sphericalImageLoader.current?.loadSphericalImage(reality, () => { publish('publish-viewer-state', '') })

                    // _measurements3D.current?.clear()

                    // setSphericalImage(reality)

                    return

                }

                for(const [Key, Value] of Object.entries(mRealities[i].position)) {

                    const realityObj = Value as any

                    const imagePosition = new THREE.Vector3(realityObj.position[0], realityObj.position[1], realityObj.position[2])

                    const distance = Math.abs(imagePosition.distanceTo(realityPosition))

                    if(distance < nearest) {

                        nearest = distance

                        const path = mRealities[i].path.replace('.json', '/')

                        nearestImage = {

                            imageName: path + Key,

                            position: imagePosition,

                            rotation: realityObj.rotation

                        }

                    } 

                }
            }
        }

        nearestImage['viewerId'] = undefined

        publish(`load-spherical-image-${viewerId}`, nearestImage)

        // _sphericalImageLoader.current?.loadSphericalImage(nearest, () => {})

        // setSphericalImage(nearestImage)

    }

    const _initializePlugins = () => {

        _sphericalImageLoader.current = new SphericalImageLoader(viewerId, _scene.current!, _camera.current!, _offset.current!)

    }

    const onSelectionChange = (selected: string[]) => {

        publish('classifications-selected', selected)

    }

    const _generateTmData = async () => {

        if (LightBoxInstance.getViewTypes()) {

            const suffix = isCompare ? 'Compare' : ''

            const mData = LightBoxInstance.viewerData()['modelData']['3D' + suffix]

            if (mData) {

                for (let i = 0; i < mData.length; i++) {

                    if(mData[i].offset) {

                        setTimeout(() => {

                            
                            
                        }, 1000)

                        _tm.current = mData[i].tm

                        _offset.current = structuredClone(mData[i].offset)

                    } else {

                        const tmData = await instance.get(mData[i].tm)

                        if (tmData.status == 200 && tmData.data) {

                            mData[i].tm = tmData.data.tm

                            _tm.current = mData[i].tm

                            mData[i].offset = tmData.data.offset

                            _offset.current = mData[i].offset
                        }
                    }

                }

                publish('load-pointcloud-' + viewerId, mData)
            }
        }
    }

    const onInit = async (scene: MutableRefObject<THREE.Scene>, camera: MutableRefObject<THREE.PerspectiveCamera>, renderer: MutableRefObject<THREE.WebGLRenderer>) => {

        _scene.current = scene.current

        _camera.current = camera.current

        _renderer.current = renderer.current

        await _generateTmData()

        _initializePlugins()

        const suffix = isCompare ? 'Compare' : ''

        const mData = LightBoxInstance.viewerData()['modelData'][LightBoxInstance.getCurrentViewType() + suffix]

        publish('load-pointcloud-' + viewerId, mData)

    }

    return (

        <>
        
            <PotreeViewer id={viewerId} onInit={onInit} />

        </>)
}

export default RealityPage