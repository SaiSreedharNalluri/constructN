import React, { useState } from 'react'
import Map from 'react-map-gl';
import { useRouter } from 'next/router'
function MapLoading() {
    const [latlng, setLatLng] = React.useState<any>();
    const router = useRouter();
    const bearer =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJVU1IwMDg5NzYiLCJmaXJzdE5hbWUiOiJWaW5lZXRoIiwibGFzdE5hbWUiOiJQYXJ1Y2h1cmkiLCJlbWFpbCI6InZpbmVldGhAY29uc3RydWN0bi5haSIsInZlcmlmaWVkIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDIyLTA1LTE2VDE3OjQzOjI4Ljk3NloiLCJ1cGRhdGVkQXQiOiIyMDIyLTExLTAyVDA5OjMwOjIzLjA3MFoiLCJfX3YiOjAsImF2YXRhciI6Imh0dHBzOi8vY29uc3RydWN0bi1hdHRhY2htZW50cy5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vYXZhdGFycy9VU1IwMDg5NzYucG5nIiwiZnVsbE5hbWUiOiJWaW5lZXRoIFBhcnVjaHVyaSIsImlhdCI6MTY3MzQzOTMyMCwiZXhwIjoxNjczNTIyMTIwfQ.iP1wWAd7mHFCL5hM8vHHt1_Qjl4nAFJR565af4oQ9Cw ";
    React.useEffect(() => {
        const fetchData = async () => {
            var requestOptions: any = {
                method: "GET",
                redirect: "follow",
                headers: {
                    Authorization: bearer,
                    "Content-Type": "application/json",
                },
            };
            fetch(
                `https://api.dev.constructn.ai/api/v1/projects/PRJ912666`,
                requestOptions
            )
                .then((response) => response.text())
                .then((result) => JSON.parse(result))
                .then((res) => {
                    setLatLng(res.result.location);
                });
        };
        fetchData();
    }, []);
    console.log(latlng);
    return (
        <div>
            <Map initialViewState={{
                longitude: 78,
                latitude: 16,
                zoom: 4
            }}
                style={{ width: "100vw", height: "94vh" }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken="pk.eyJ1Ijoic2hpdmEta3Jpc2huYSIsImEiOiJjbGFqa2dzbjAwZHZ4M3lvMDB0Zmx3c3JpIn0.srnnrsZ8NWbz0u-lwHHiMg"
            ></Map>
        </div>
    )
}

export default MapLoading