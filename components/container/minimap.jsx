import React, { useEffect } from 'react';

function Minimap(props) {
    
    const viewerId = `minimap-${props.count}`;
    const setMinimapUtils = props.setMinimap;

    const initViewer = function() {
        setMinimapUtils(viewerId);
    }

    useEffect(() => {
       initViewer();
    },[]);


    return (
        <React.Fragment>
            <div
            id={viewerId}
            className="relative w-full h-full z-5"
          >
          </div>
        </React.Fragment>
    );
};

export default Minimap;