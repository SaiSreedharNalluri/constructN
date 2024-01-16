import React, { useEffect, memo, useRef, useState } from 'react';
import { PotreeViewerUtils } from "../../utils/PotreeWrapper";
import PotreeMeasurementToolbar from './potreeMeasurementToolbar';
import { getCookie } from "cookies-next";
import { IUser } from "../../models/IUser";
import CameraButtons from './cameraButtons';
import Measurements3DView from './measurements/measurements-3d';
import { Button } from '@mui/material';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

const subscribe = (eventName, listener) => {
  document.addEventListener(eventName, listener)
}

const unsubscribe = (eventName, listener) => {
  document.removeEventListener(eventName, listener)
}

function PotreeViewer(props) {
    const [viewerCount, setViewerCount] = useState(props.viewerCount);
    const [showPointCloud, setShowPointCloud] = useState(false);
    const isSupportUser = useRef(props.isSupportUser ? props.isSupportUser : false);
    const viewerId = `potreeViewer_${viewerCount}`;
    const containerId = `fpContainer_${viewerCount}`;
    const canvasId = `floormap_${viewerCount}`
    const setPotreeViewerUtils = props.setPotreeViewer;
    const potreeUtils = props.potreeUtils;

    const { loadAllImages, unloadAllImages } = potreeUtils ||{};

    const setPointCloud = (e) =>{
      console.log(e,'knbskskb')
      setShowPointCloud(e.detail);
    }

    const initViewer = function() {
        // let potree = new PotreeViewerUtils(viewerId);
        // if(!potree.isViewerLoaded()) {
        //   potree.initialize();
        // }
        setPotreeViewerUtils(viewerId);
    }

    useEffect(() => {
        initViewer();
     },[viewerCount]);

     useEffect(()=>{
      subscribe("show-pointcloud", setPointCloud);
      return(()=>{
        unsubscribe("show-pointcloud", setPointCloud);
      })
    },[])

    return (
      <React.Fragment>
        <div className="relative w-full h-full z-5">
          <div id={viewerId} className="relative w-full h-full z-6"></div>

          <div
            id={containerId}
            className="absolute top-10 right-5 z-100 hidden top-margin"
          >
            <div className="relative w-full h-full">
              {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute w-6 h-6 right-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg> */}
            </div>
            {/* <i title='fullscreen' id="fp_fullscreen_1" data='{"id": "viewer_1", "type": "fp_fullscreen"}' className="material-icons absolute top-1 right-1">fullscreen</i>
			        <i title='minimise' id="fp_minimise_1" data='{"id": "viewer_1", "type": "fp_fullscreen"}' className="material-icons absolute top-1 right-1 hidden" >fullscreen_exit</i> */}
            <canvas id={canvasId}></canvas>
          </div>
          <div className={`flex-column absolute right-[12px] bottom-[50px] rounded-t-md select-none h-auto rounded w-auto bg-white font-['Open_Sans']`} >
            {showPointCloud ?
              <Button onClick={()=>{
                  loadAllImages();
                  setShowPointCloud(false);
              }} className='text-[12px]' > <ViewInArIcon className='mr-1.5'/> Hide Point Cloud</Button>:
              <Button className='text-[12px]' onClick={()=>{
                unloadAllImages();
                setShowPointCloud(true);
                }}><ThreeDRotationIcon className='mr-1.5' /> Show Point Cloud</Button>}
          </div>
          {isSupportUser.current ? (
            <div>
              {/* <CameraButtons></CameraButtons> */}
              <Measurements3DView potreeUtils={potreeUtils} realityMap={props.realityMap} />
            </div>
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
};

export default PotreeViewer;