import React from 'react'
import { Map } from 'react-map-gl'
function MapboxViewer() {
    return (
        <div>
            <Map
                initialViewState={{
                    longitude: 78,
                    latitude: 16,
                    zoom: 16,
                }}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.NEXT_PUBLIC_Map_Token}>
            </Map>
        </div>
    )
}

export default MapboxViewer