import React, { useEffect, useState, memo, useRef } from 'react';
import { ForgeViewerUtils } from '../../utils/ForgeWrapper';

function ForgeViewer(props) {
    const [viewerCount, setViewerCount] = useState(props.viewerCount);
    const viewerId = `forgeViewer_${viewerCount}`;
    const setForgeViewerUtils = props.setForgeViewer;

    const initViewer = function() {
        // let forge = new ForgeViewerUtils(viewerId);
        // console.log("Inside load viewer: ", viewer);
        // console.log("isForgeViewer Loaded: ", forge.isViewerLoaded());
        setForgeViewerUtils(viewerId);
    }

    useEffect(() => {
       initViewer();
    },[viewerCount]);


    return (
        <React.Fragment>
            <div className="relative w-full h-full z-5">
                <div
                id={viewerId}
                className="relative w-full h-full z-6"
                ></div>
            </div>
        </React.Fragment>
    );
};

export default ForgeViewer;