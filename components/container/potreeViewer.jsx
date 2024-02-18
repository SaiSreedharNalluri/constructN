import React, { useEffect, memo, useRef, useState } from 'react';
import { PotreeViewerUtils } from "../../utils/PotreeWrapper";
import PotreeMeasurementToolbar from './potreeMeasurementToolbar';
import { getCookie } from "cookies-next";
import { IUser } from "../../models/IUser";
import CameraButtons from './cameraButtons';
import Measurements3DView from './measurements/measurements-3d';
import { Button, Checkbox, Tooltip } from '@mui/material';
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
    const [showMessage, setShowMessage] = useState(false);
    const [showHidden, setShowHidden] = useState(false);
    const useObj = getCookie("user");
    const user = JSON.parse(useObj|| "{}");
    const isSupportUser = user?.isSupportUser;
    const viewerId = `potreeViewer_${viewerCount}`;
    const containerId = `fpContainer_${viewerCount}`;
    const canvasId = `floormap_${viewerCount}`
    const setPotreeViewerUtils = props.setPotreeViewer;
    const potreeUtils = props.potreeUtils;

    const loadAllImages = props.loadAllImages;
    const onEscape = props.onEscape;
    const loadMeasurements =  props.loadMeasurements;

    const loadPrevDroneImage =  props.loadPrevDroneImage

    const isCompareViewer = props.isCompareViewer;

    const setPointCloud = (e) =>{
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
      const ele = document.getElementById('potree_quick_buttons')
      if(!isSupportUser){
        ele.style.width ="0px";
        ele.style.height ="0px";
      }
     },[isSupportUser])

     useEffect(()=>{
      let clearTimer;
      let clearHidden;
      if(showPointCloud.view){
        setShowMessage(true);
        setShowHidden(false);
        clearTimer = setTimeout(()=>{
          setShowMessage(false);
        },2500);
        clearHidden = setTimeout(()=>{
          setShowHidden(true);
        },3500);
      }
      return(()=>{
        clearTimeout(clearTimer);
        clearTimeout(clearHidden);
        clearTimer = undefined;
        clearHidden= undefined;
      })
     },[showPointCloud.view])

     useEffect(()=>{
      subscribe("show-pointcloud", setPointCloud);
      return(()=>{
        unsubscribe("show-pointcloud", setPointCloud);
      })
    },[])

    const getButton = () => {
      if(props.isCompare && showPointCloud?.view && showPointCloud.disable){
        return (<Tooltip title='Please Select Image'>
        <div>
          <Button className={`w-[140px] font-['Open_Sans'] text-[12px]`} disabled>Reality</Button>
        </div>
        </Tooltip>)
      }

      if(showPointCloud?.view && showPointCloud.disable && !showPointCloud.prevImage ){
        return(<Tooltip title='Please Select Image'>
        <div>
          <Button className={`w-[140px] font-['Open_Sans'] text-[12px]`} disabled>Reality</Button>
        </div>
        </Tooltip>)
      }

      if(showPointCloud?.view && showPointCloud.disable){
        return(<Button className={`w-[140px] font-['Open_Sans'] text-[12px]`} onClick={loadPrevDroneImage} >Reality</Button>)
      }

      if(showPointCloud?.view && !showPointCloud.disable){
        return(<Button onClick={()=>{
          if(loadAllImages){
            loadAllImages();
          }
        }} className={`w-[140px] pointer font-['Open_Sans'] text-[#101F4C] text-[12px] opacity-[0.7]`}>Reality</Button>)
      }

      return(<Button className={`w-[140px] pointer text-[#101F4C] font-['Open_Sans'] text-[10px] opacity-[0.7]`} onClick={()=>{ if(onEscape){onEscape();} }}><ThreeDRotationIcon className='mr-1.5 text-[#101F4C] opacity-[0.8]' />Point Cloud</Button>)
      

    }

    return (
      <React.Fragment>
        <div className="relative w-full h-full z-5">
        <div id="potree_render_area">
          <div id={viewerId} className="relative w-full h-full z-6"></div>
        </div>
        <div id="potree_sidebar_container"></div>

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
          <div className={`flex-column absolute right-[12px] top-[70px] h-auto rounded w-auto bg-white font-['Open_Sans'] z-10`} style={{ boxShadow:'0px 2px 1px rgba(0, 0, 0, 0.25)' }}>
          {getButton()}
          </div>
        {showPointCloud.view && !showHidden ? <div className='flex justify-center mt-2'>
              <div className={`absolute z-10 opacity-0 transition-opacity duration-1000 ease-in-out bg-gray-500 text-white top-16 p-4 text-[14px] ${showMessage ? 'opacity-100': 'opacity-0'}`}>Navigate across the point cloud using mouse / trackpad. Double click to go to a particular location </div>
          </div>: null}
          {!isCompareViewer ? (
            <div className='absolute z-10 right-0 bottom-0'>
              {/* <CameraButtons></CameraButtons> */}
              <Measurements3DView potreeUtils={potreeUtils} realityMap={props.realityMap} loadMeasurements={loadMeasurements} viewerId={viewerId} />
            </div>
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
};

export default PotreeViewer;