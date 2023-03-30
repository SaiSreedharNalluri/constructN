import React, { useEffect, useState, memo, useRef } from 'react';

function MapboxViewer(props) {
    const [viewerCount, setViewerCount] = useState(props.viewerCount);
    const viewerId = `mapboxViewer_${viewerCount}`;
    const setMapboxViewerUtils = props.setMapboxViewer;

    const initViewer = function () {
        setMapboxViewerUtils(viewerId);
    }

    useEffect(() => {
        initViewer();
    }, []);


    return (
        <React.Fragment>
            <div
                id={viewerId}
                className="relative w-full h-full z-5"
            ></div>
        </React.Fragment>
    );
};

export default MapboxViewer