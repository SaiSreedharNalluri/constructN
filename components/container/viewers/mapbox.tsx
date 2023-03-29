import React, { useEffect, useState } from 'react';
import mapboxgl, { LngLat, Map, Popup } from 'mapbox-gl';
import { Feature, center } from '@turf/turf';

interface IProps {

    id: string,

    project: any,

    structure: any,

    snapshot: any,

    onInit: Function,

    layers: any[],

    onLoadLayers: Function,

    style?: string,

    context: IContext,

    onContextChange: Function
}

interface IContext {

    center?: number[],

    zoom?: number,

    pitch?: number,

    bearing?: number
}

function MapboxViewer(props: IProps) {

    const [id, setId] = useState(props.id);

    const [context, setContext] = useState(props.context)

    const viewerId = `mapbox_${id}`;

    let _map: Map;

    let _popup: Popup;

    let _layersList: string[] = []

    const initViewer = function () {

        mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_Map_Token}`;

        let center: LngLat = new LngLat(
            context?.center ? context?.center[0] : 0,
            context?.center ? context?.center[1] : 0
        )

        _map = new mapboxgl.Map({
            container: viewerId,
            style: props.style ? props.style : 'mapbox://styles/mapbox/satellite-v9',
            center: center,
            zoom: 15
        });

        _map.on("load", () => {
            props.onInit(_map)
        })

        _map.on('zoomend', () => {
            
            context.zoom = _map.getZoom();

            props.onContextChange(context);
        });

        _map.on('pitchend', () => {
            
            context.pitch = _map.getPitch();

            props.onContextChange(context);
        });

        _map.on('moveend', () => {
            
            context.center = [_map.getCenter().lng, _map.getCenter().lat];

            props.onContextChange(context);
        });

        _map.on('zoom', () => {
            
        });
    }

    initViewer();

    useEffect(() => {

        setContext(props.context);

        let center: LngLat = new LngLat(context?.center ? context?.center[0] : 0, context?.center ? context?.center[1] : 0)

        _map.flyTo({
            center: center,
            pitch: context?.pitch,
            zoom: context?.zoom,
            essential: true
        });

    }, [context]);

    useEffect(() => {

        loadLayers(props.layers);

    }, [props.layers])


    const loadLayers = (data: any[]) => {

        let realities = props.snapshot.reality.map((r: any) => r._id);

        let layersString = JSON.stringify(data);

        layersString = layersString.split('{{PROJECT_ID}}').join(props.project._id);

        layersString = layersString.split('{{STRUCTURE_ID}}').join(props.structure._id);

        layersString = layersString.split('{{SNAPSHOT_ID}}').join(props.snapshot._id);

        layersString = layersString.split('{{REALITY_ID}}').join(realities[0]);

        let layers = JSON.parse(layersString);

        for (let i = 0; i < layers.length; i++) {

            if (layers[i].layer && _layersList.indexOf(layers[i].layer.id) == -1) {

                _map.addLayer(layers[i].layer, layers[i].layer.before);

                _layersList.push(layers[i].layer.id)

                if (layers[i].layer.id == "progress") {

                    _map.on('click', layers[i].layer.id, (e) => {

                        if (e.features) onLayerClick(e.features[0]);

                    });
                }
            }
        }
    };

    const onLayerClick = (e: any) => {

        let coordinates = e.geometry.type === 'Polygon' ? getCentreOfFeatureCollection(e) : e.geometry.coordinates;

        _map.flyTo({
            center: coordinates,
            essential: true
        });

        if (!_popup) {

            _popup = new mapboxgl.Popup({ closeOnClick: true })
                .setLngLat(coordinates)
                .setHTML(e.properties.htmlInfo ? e.properties.htmlInfo : getHtmlInfo(e))
                .addTo(_map);
        } else {

            _popup.setLngLat(coordinates)
                .setHTML(e.properties.htmlInfo ? e.properties.htmlInfo : getHtmlInfo(e))
                .addTo(_map);
        }
    }

    const getCentreOfFeatureCollection = (collection: any) => {

        let mCenter = center(collection);

        return mCenter.geometry.coordinates;
    }

    const getHtmlInfo = (e: Feature) => {
        let html = '<div style="display:flex;flex-direction: column;">';
        let total = e.properties!!.length;
        let row_clearing = e.properties!!.row_clearing;
        let excavation = e.properties!!.excavation;
        let stringing = e.properties!!.stringing;
        let pipe_laying = e.properties!!.pipe_laying;
        let back_filling = e.properties!!.back_filling;
        let ofc_cabling = e.properties!!.ofc_cabling;
        let mat_laying = e.properties!!.mat_laying;
        let progress = (row_clearing + stringing + excavation + pipe_laying + ofc_cabling + mat_laying + back_filling) * 100 / (7 * total);
        let current_stage = e.properties!!.stage;
        // current_stage = current_stage.charAt(0).toUpperCase() + current_stage.slice(1);
        html += '<div style="font-weight:600;border-bottom: 1px solid #aaa;margin-bottom: 0.5em;">' + e.properties!!.name + '</div>';
        html += '<div style="display:flex; padding:0 0.5em; background:rgba(0,255,200,0.5)"><div style="flex: 1";>' + 'Progress' + ': </div><strong style="margin-left: 1em;">' + progress.toFixed(0) + '%</strong></div>';
        html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Total length' + ': </div><strong style="margin-left: 1em;">' + e.properties!!.length.toFixed(2) + ' mts.</strong></div>';
        // html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Current Stage' + ': </div><strong style="margin-left: 1em; text-transform: capitalize;">' + current_stage + '</strong></div>';
        html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Row Clearing' + ': </div><strong style="margin-left: 1em;">' + e.properties!!.row_clearing.toFixed(2) + ' mts.</strong></div>';
        html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Stringing' + ': </div><strong style="margin-left: 1em;">' + stringing.toFixed(2) + ' mts.</strong></div>';
        html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Excavation' + ': </div><strong style="margin-left: 1em;">' + e.properties!!.excavation.toFixed(2) + ' mts.</strong></div>';
        html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Pipe Laying' + ': </div><strong style="margin-left: 1em;">' + e.properties!!.pipe_laying.toFixed(2) + ' mts.</strong></div>';
        html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'OFC Cabling' + ': </div><strong style="margin-left: 1em;">' + ofc_cabling.toFixed(2) + ' mts.</strong></div>';
        html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Mat Laying' + ': </div><strong style="margin-left: 1em;">' + mat_laying.toFixed(2) + ' mts.</strong></div>';
        html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Back Filling' + ': </div><strong style="margin-left: 1em;">' + e.properties!!.back_filling.toFixed(2) + ' mts.</strong></div>';
        // for (const [key, value] of Object.entries(e.properties)) {
        //   html += '<div style="display:flex;"><div style="flex: 1";>' + key + ': </div><strong style="margin-left: 1em;">' + value + '</strong></div>';
        // }
        html += '</div>';
        return html;
    }


    return (
        <React.Fragment>

            <div id={viewerId} className="relative w-full h-full z-5"></div>

        </React.Fragment>
    );
};

export default MapboxViewer