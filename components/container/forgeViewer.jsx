import React, { useEffect, useState, memo, useRef } from 'react';

const subscribe = (eventName, listener) => {
    document.addEventListener(eventName, listener)
}

const unsubscribe = (eventName, listener) => {
    document.removeEventListener(eventName, listener)
}

function ForgeViewer(props) {
    const [viewerCount, setViewerCount] = useState(props.viewerCount);
    const clearTimerRef = useRef();
    const clearMessageRef = useRef();
    const lockedRef = useRef();
    const [showMessage, setShowMessage] = useState(false);
    const [hide, setHide] = useState(false);
    const viewerId = `forgeViewer_${viewerCount}`;
    const setForgeViewerUtils = props.setForgeViewer;

    const initViewer = function() {
        // let forge = new ForgeViewerUtils(viewerId);
        // console.log("Inside load viewer: ", viewer);
        // console.log("isForgeViewer Loaded: ", forge.isViewerLoaded());
        setForgeViewerUtils(viewerId);
    }

    const viewerClicked = (e) => {
        if(e.detail){
            setShowMessage(false);
            clearTimeout(clearTimerRef.current);
            setHide(true);
            clearTimerRef.current = setTimeout(()=>{
                setHide(false);
            },1600);
        }else{
            setHide(false);
        }
    }

    const setLocked =()=>{ lockedRef.current = true }

    useEffect(()=>{
        subscribe("viewer-clicked", viewerClicked);
        subscribe("movement-locked", setLocked);
        return(()=>{
            unsubscribe("viewer-clicked", viewerClicked)
            unsubscribe("movement-locked", setLocked);
        });
    },[])

    useEffect(() => {
       initViewer();
    },[viewerCount]);


    return (
        <React.Fragment>
            <div className="relative w-full h-full z-5" onClick={()=>{
                if(lockedRef.current){
                    clearTimeout(clearMessageRef.current);
                    setShowMessage(true);
                    clearMessageRef.current = setTimeout(()=>{
                    setShowMessage(false);
                },1500);
                }
            }}>
                <div
                id={viewerId}
                className="relative w-full h-full z-6"
                ></div>
                {viewerCount === 2 && !hide ? <div className={`absolute left-32 z-10 opacity-0 transition-opacity duration-1000 ease-in-out bg-gray-500 text-white top-10 p-4 text-[14px] ${showMessage ? 'opacity-100': 'opacity-0'}`}> Navigation not allowed. Please navigate in the Reality section.</div>: null}
            </div>
        </React.Fragment>
    );
};

export default ForgeViewer;