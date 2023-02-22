import React from 'react';
import Map from 'react-map-gl';
const MapLoading: React.FC = () => {
  return (
    <div>
      <Map
        initialViewState={{
          longitude: 78,
          latitude: 16,
          zoom: 4,
        }}
        style={{ width: '95.9vw', height: '93vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={`${process.env.NEXT_PUBLIC_Map_Token}`}
      ></Map>
    </div>
  );
}

export default MapLoading;
