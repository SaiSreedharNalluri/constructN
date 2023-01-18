import React, { useState } from 'react';
import Map from 'react-map-gl';
import authHeader from '../../services/auth-header';
function MapLoading() {
  const [latlng, setLatLng] = React.useState<any>();
  return (
    <div>
      <Map
        initialViewState={{
          longitude: 78,
          latitude: 16,
          zoom: 4,
        }}
        style={{ width: '96.6vw', height: '94vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={`${process.env.NEXT_PUBLIC_Map_Token}`}
      ></Map>
    </div>
  );
}

export default MapLoading;
