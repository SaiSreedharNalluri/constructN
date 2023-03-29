import React, { useEffect, useRef, useState } from 'react'

import mapboxgl, { LngLat, Map, Popup } from 'mapbox-gl'

mapboxgl.accessToken = `pk.eyJ1Ijoic2hpdmEta3Jpc2huYSIsImEiOiJjbGFqa2dzbjAwZHZ4M3lvMDB0Zmx3c3JpIn0.srnnrsZ8NWbz0u-lwHHiMg`

interface IProps {

    onInit?: Function

    viewerState?: any

    annotations?: any

    onModelClick?: Function

    models: any[]
}

function MiniMap(props: IProps) {

    const viewerId = 'minimap'

    const _map = useRef<Map>()

    const [_modelsList] = useState<string[]>([])

    let [annotations, setAnnotations] = useState<any>(props.annotations)

    const mCenter: LngLat = new LngLat(
        props.viewerState && props.viewerState.center ? props.viewerState.center[0] : 0,
        props.viewerState && props.viewerState.center ? props.viewerState.center[1] : 0
    )

    const initViewer = function () {

        if (!_map.current) {

            _map.current = new mapboxgl.Map({
                container: viewerId,
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: mCenter,
                zoom: props.viewerState && props.viewerState.zoom ? props.viewerState && props.viewerState.zoom : 16,
                pitch: props.viewerState && props.viewerState.mapPitch ? props.viewerState && props.viewerState.mapPitch : 0,
                bearing: props.viewerState && props.viewerState.bearing ? props.viewerState && props.viewerState.bearing : 0
            });

            _map.current?.on('load', async () => {

                if (props.onInit) props.onInit(_map)

                _map.current?.addSource('radar', {
                    'type': 'image',
                    'url': 'https://constructn-projects-us.s3.us-west-2.amazonaws.com/PRJ201897/structures/STR147148/designs/DSG992167/floormap.jpg',
                    'coordinates': [
                        [-80.425, 46.437],
                        [-71.516, 46.437],
                        [-71.516, 37.936],
                        [-80.425, 37.936]
                    ]
                });
                _map.current?.addLayer({
                    id: 'radar-layer',
                    'type': 'raster',
                    'source': 'radar',
                    'paint': {
                        'raster-fade-duration': 0
                    }
                });

                // disable map rotation using right click + drag
                _map.current?.dragRotate.disable();

                // disable map rotation using touch rotation gesture
                _map.current?.touchZoomRotate.disableRotation();
            })
        }
    }

    useEffect(() => {

        initViewer()

        return () => {

            _map.current?.remove()

            _map.current = undefined
        }

    }, [])

    useEffect(() => { fly(props.viewerState) }, [props.viewerState])

    useEffect(() => { loadModels() }, [props.models])

    const fly = (viewerState: any) => {

        let center: LngLat = new LngLat(
            viewerState && viewerState.center ? viewerState.center[0] : 0,
            viewerState && viewerState.center ? viewerState.center[1] : 0
        );

        if (!Number.isNaN(center.lat) && !Number.isNaN(center.lng)) {

            _map.current?.flyTo({
                center: center,
                zoom: viewerState && viewerState.zoom ? viewerState && viewerState.zoom : 16,
                pitch: viewerState && viewerState.mapPitch ? viewerState && Math.abs(viewerState.mapPitch) : 0,
                bearing: viewerState && viewerState.bearing ? viewerState && viewerState.bearing : 0,
                essential: true
            });
        }
    }

    const loadModels = () => {

        if (_map.current) {

            for (let i = 0; i < props.models.length; i++) {

                if (props.models[i].layer) {

                    if (_modelsList.indexOf(props.models[i].layer.id) == -1) {

                        _map.current.addLayer(props.models[i].layer, props.models[i].layer.before ? props.models[i].layer.before : 'Task')

                        _modelsList.push(props.models[i].layer.id)

                        if (props.models[i].layer.id == "progress") {

                            _map.current.on('click', props.models[i].layer.id, (e) => {

                                // if (e.features) onModelClick(e.features[0])
                            })

                            _map.current.on('mouseenter', props.models[i].layer.id, () => {

                                _map.current!!.getCanvas().style.cursor = 'pointer'
                            })

                            _map.current.on('mouseleave', props.models[i].layer.id, () => {

                                _map.current!!.getCanvas().style.cursor = ''
                            })
                        }

                        console.log(_map.current?.getLayer('radar'))
                    }
                }
            }
        }
    };

    return (
        <>
            <div id={viewerId} className='map' style={{height: '100%'}}></div>
        </>
    );
};

export default MiniMap