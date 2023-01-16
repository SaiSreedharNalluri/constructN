import React, { useState } from 'react';
import Map from 'react-map-gl';
import authHeader from '../../services/auth-header';
function MapLoading() {
    const [latlng, setLatLng] = React.useState<any>();
    React.useEffect(() => {
        const fetchData = async () => {
            var requestOptions: any = {
                method: 'GET',
                redirect: 'follow',
                headers: authHeader.authHeader(),
            };
            fetch(
                `https://api.dev.constructn.ai/api/v1/projects/PRJ912666/`,
                requestOptions
            )
                .then((response) => response.text())
                .then((result) => JSON.parse(result))
                .then((res) => {
                    setLatLng(res.result?.location);
                });
        };
        fetchData();
    }, []);
    return (
        <div>
            <Map
                initialViewState={{
                    longitude: 78,
                    latitude: 16,
                    zoom: 4,
                }}
                style={{ width: '100vw', height: '94vh' }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={`${process.env.NEXT_PUBLIC_Map_Token}`}
            ></Map>
        </div>
    );
}

export default MapLoading;