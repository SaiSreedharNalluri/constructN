import React, { useEffect, useState, memo, useRef } from 'react';
import { PotreeViewerUtils } from "../../utils/PotreeWrapper";

function PotreeViewer(props) {
    const [viewerCount, setViewerCount] = useState(props.viewerCount);
    const viewerId = `potreeViewer_${viewerCount}`;
    const setPotreeViewerUtils = props.setPotreeViewer;

    const initViewer = function() {
        let potree = new PotreeViewerUtils(viewerId);
        if(!potree.isViewerLoaded()) {
          potree.initialize();
        }
        setPotreeViewerUtils(potree);
    }

    useEffect(() => {
        initViewer();
     },[]);

    return (
        <React.Fragment>
            <div
            id={viewerId}
            className="w-screen h-screen z-5"
          ></div>
        </React.Fragment>
    );
};

export default PotreeViewer;