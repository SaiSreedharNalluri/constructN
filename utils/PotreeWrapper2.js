import { PotreeInstance } from "./PotreeWrapper";

export const PotreeViewerUtils = () => {

    let _viewerId;
    let _eventHandler;
    let _viewer;

    let _isViewerInitialized = false;
    let _isActive = false;

    let _structure;
    let _snapshot;
    let _tasksList;
    let _issuesList;
    let _progressList;

    let _realityPositionMap = {};
    let _pointCloudPath = {};
    let _pointCloudMap = {};
    let _floormapPath;
    let _floormapTmPath;

    let _floorMapLayers = {};
    let _floorMap = false;

    let _fpContainerId;
    let _fpCanvasId;

    let _isPointCloudLoaded = false;
    let _isPendingDataToLoad = false;
    let _isPendingLayersToLoad = false;

    let _tmMatrix = new THREE.Matrix4().set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    let _globalOffset = [0,0,0];

    let _context;

    const initializeViewer = (viewerId, eventHandler) => {
        _viewerId = viewerId;
        _eventHandler = eventHandler;
        _fpContainerId = `fpContainer_${_viewerId.split("_")[1]}`;
        _fpCanvasId = `floormap_${_viewerId.split("_")[1]}`;

        const loadGUICallback = () => {
            _isViewerInitialized = true;
            addEventListeners();
            // isActive = true;
        }
        if (isCompareView()) {
            _viewer = PotreeInstance.getCompareInstance(_viewerId).viewer;
        } else {
            _viewer = PotreeInstance.getInstance(_viewerId).viewer;
        }
        _viewer.canvasId = _viewerId; //Used by potree
        _viewer.loadGUI(loadGUICallback);
    }

    const isViewerLoaded = () => {
        return _isViewerInitialized;
    }

    const isCompareView = () => {
        if (_viewerId.split("_")[1] === "1") {
          return false;
        } else {
          return true;
        }
    }

    const readyForCompare = (mode) => {
        // if (mode === "Forge") {
        //     if (this.currentMode === "image") {
        //         this.unloadOrientedImage();
        //     }
        // } else if (mode === "Potree") {
        // }

        // if(this.currentMode === "panorama" && this.floorMap) {
        //     this.updateFPSize(this.viewer.floorMap);
        // }
    }

    const finishForCompare = () => {

    }

    const setStructure = (structure) => {
        _structure = structure;
    }

    const setSnapshot = (snapshot) => {
        _snapshot = snapshot;
    }
    
    const getRealityIdFromURL = (s3URL) => {
        let splits = s3URL.split('/');
        return splits[splits.length - 3]
    }

    const updateIssuesData = (list) => {
        console.log("Inside update issues data: ", list);
        _issuesList = list;
        _isPendingLayersToLoad = true;
        if (loadLayersOnDataLoadCompletion()) {
          loadIssues();
        }
    }

    const updateTasksData = (list) => {
        console.log("Inside update tasks data: ", list);
        _tasksList = list;
        _isPendingLayersToLoad = true;
        if (loadLayersOnDataLoadCompletion()) {
          loadTasks();
        }
    }

    const updateProgressData = (list) => {

    }

    const updateData = (pointCloudData, floormapData) => {
        console.log("PointCloud data update: ", pointCloudData, floormapData);

        // if(pointCloudData.tm && pointCloudData.tm.length > 0) {
        //     _tmMatrix = new THREE.Matrix4().fromArray(pointCloudData.tm).transpose();
        // }

        // if(pointCloudData.offset) {
        //     _globalOffset = pointCloudData.offset;
        // }
        
        // _pointCloudPath = pointCloudData.path
        _pointCloudMap = pointCloudData

        if(floormapData["Plan Drawings"] && floormapData["Plan Drawings"][0].floormapPath) {
            // let floorMapTmMatrix = new THREE.Matrix4().fromArray(floorMapData["Plan Drawings"][0].tm).transpose();
            // let floormapOffset = floorMapData["Plan Drawings"][0].tm.offset
            _floormapTmPath = floormapData["Plan Drawings"][0].tmPath;
            _floormapPath = floormapData["Plan Drawings"][0].floormapPath;
        }

        if (_isViewerInitialized) {
            loadData();
        }
    }

    const updateLayersData = (realityPositionMap, context) => {
        console.log("Inside Potree update layers: ", realityPositionMap, context);
        if (context) {
            _context = context;
        } else {
            _context = null;
        }
        console.log("Context: ", _context)
        _realityPositionMap = realityPositionMap;
        _isPendingLayersToLoad = true;
        if (loadLayersOnDataLoadCompletion()) {
            loadLayers();
            loadIssues();
            loadTasks();
        }

    }

    const loadLayersOnDataLoadCompletion = () => {
        console.log("Inside loadlayers On data load complete: ", _isPendingLayersToLoad, _isPointCloudLoaded);
        if (_isPendingLayersToLoad) {
            if (_isViewerInitialized && _isPointCloudLoaded) {
            return true;
            }
            return false;
        }
        return false;
    }

    const loadData = () => {
        removeData();
        let pointClouds = [];
        let isLoadFloormap = false;
        for (const realityType in _pointCloudMap) {
            switch (realityType) {
                case "360 Video":
                    for(let pointCloudData of _pointCloudMap[realityType]) {
                        // loadPointCloud(pointCloudData);
                        pointClouds.push(pointCloudData);
                    }
                    isLoadFloormap = true;
                    break;
                case "Drone Image":
                    for(let pointCloudData of _pointCloudMap[realityType]) {
                        // loadPointCloud(pointCloudData);
                        pointClouds.push(pointCloudData);
                    }
                    break;
                case "360 Image":
                case "Phone Image":
                    isLoadFloormap = true;
                    break;
            }
        }
        loadPointCloud(pointClouds);
        isLoadFloormap && loadFloormap();
        
    }

    const loadPointCloud = async (pointCloudDataArray) => {
        let loadEvents = await Promise.all(pointCloudDataArray.map(pointCloudData => Potree.loadPointCloud(pointCloudData.path, _viewerId + '_' + pointCloudData.id)));
        let scene = _viewer.scene;

        let pointCloudLoaded = false;

        for(let event of loadEvents ) {
            console.log("PotreeWrapper loadPointcloud :", getRealityIdFromURL(event.pointcloud.pcoGeometry.url));
            let realityId = getRealityIdFromURL(event.pointcloud.pcoGeometry.url);
            let pointcloud = event.pointcloud;
            let material = pointcloud.material;
            material.size = 1;
            material.pointSizeType = Potree.PointSizeType.FIXED;
            material.shape = Potree.PointShape.SQUARE;
            let tmData = pointCloudDataArray.find(e => e.id === realityId);
            if (tmData.tm && tmData.tm.length > 0) {
                let tmMatrix =  new THREE.Matrix4().fromArray(tmData.tm).transpose();
                pointcloud.applyMatrix4(tmMatrix);
            } else {
                pointcloud.applyMatrix4(_tmMatrix);
            }
            
            const assetPosition = pointcloud.position.clone();
            if(tmData.offset && tmData.offset.length > 0) {
                let globalOffset = tmData.offset;
                pointcloud.position.set(assetPosition.x - globalOffset[0], assetPosition.y - globalOffset[1], assetPosition.z - globalOffset[2]);
            } else {
                pointcloud.position.set(assetPosition.x - _globalOffset[0], assetPosition.y - _globalOffset[1], assetPosition.z - _globalOffset[2]);
            }
            scene.addPointCloud(pointcloud);
            _viewer.fitToScreen();
            pointCloudLoaded = true;
            // console.log('Point Cloud Loaded');
        }

        _isPointCloudLoaded = pointCloudLoaded;
        if (loadLayersOnDataLoadCompletion()) {
            loadLayers();
            loadIssues();
            loadTasks();
        }
    }

    const loadLayers = () => {
                // console.log("Inside Potree load layers: ", this.realityPositionMap);
        // try to handle exterior context swithcing here.
        // this.floorMapLayers = {};

        // for (const realityType in this.realityPositionMap) {
        //     switch (realityType) {
        //         case "360 Video":
        //         // case "360 Image":
        //             this.pointCloudView(true);
        //             for(let pathObject of this.realityPositionMap[realityType]) {
        //                 this.floorMapLayers[pathObject.id] = {
        //                     type: realityType,
        //                     index: undefined,
        //                     imagesPath: pathObject.position
        //                 }
        //                 this.loadSphericalImages(new THREE.Matrix4(), this.globalOffset, pathObject.id, pathObject.position, pathObject.images);
                        
        //             }
        //             this.currentMode = 'panorama'
        //             if (!this.floorMap) {
        //                 this.loadFloormap(realityType);
        //             }
        //             break;
        //         case "Phone Image":
        //             this.pointCloudView(true);
        //             for(let pathObject of this.realityPositionMap[realityType]) {
        //                 this.floorMapLayers[pathObject.id] ={
        //                     type: realityType,
        //                     index: undefined,
        //                     imagesPath: pathObject.position
        //                 };
        //                 this.loadDroneImages(new THREE.Matrix4(), this.globalOffset, pathObject.id, pathObject.position, pathObject.images);
        //                 // break;
        //             }
        //             this.currentMode = 'image'
        //             if (!this.floorMap) {
        //                 this.loadFloormap(realityType);
        //             }
                    
        //             break;
        //         case "Drone Image":
        //             this.pointCloudView(true);
        //             for(let pathObject of this.realityPositionMap[realityType]) {
        //                 this.loadDroneImages(this.tmMatrix, this.globalOffset, pathObject.position, pathObject.images);
        //             }
        //             this.currentMode = 'image'
        //             break;

        //     }
        // }
        // this.isPendingLayersToLoad = false;
    }

    const loadIssues = () => {

    }

    const loadTasks = () => {

    }

    const initiateAddTag = () => {

    }

    const cancelAddTag = () => {

    }

    const selectTag = () => {

    }

    const showTag = () => {

    }
    
    const getContext = (justLoadedImage = null) => {
        let context = undefined;
        // console.log("Inside potree getcamera: ", this.viewerId, this.isPointCloudLoaded, justLoadedImage, this.currentLoadedImage);
        if (_isPointCloudLoaded) {
            // let camObject = undefined;
            // let imageObject = undefined;
            // let pos = _viewer.scene.view.position;
            // let tar = _viewer.scene.view.getPivot();
            // let offset = _globalOffset
            // camObject = {
            //     cameraPosition: {x: pos.x+offset[0], y: pos.y+offset[1], z: pos.z+offset[2]},
            //     cameraTarget: {x: tar.x+offset[0], y: tar.y+offset[1], z: tar.z+offset[2]},
            //     pitch: _viewer.scene.view.pitch,
            //     yaw: _viewer.scene.view.yaw,
            //     fov: _viewer.getFOV()
            // }

            // context = {
            //     type: _currentMode,
            //     cameraObject: camObject,
            // }

            // if (_currentMode == "image" && _viewer.scene.orientedImages[0]) {
            //     let imagePosition;
            //     let name;
            //     if (justLoadedImage != null) {
            //         imagePosition = justLoadedImage.position;
            //         name = justLoadedImage.id
            //     } else if(_currentLoadedImage != null) {
            //         _viewer.scene.orientedImages[0].images.forEach( image => {
            //             if(image.id === _currentLoadedImage) {
            //                 imagePosition = image.position;
            //                 name = image.id;
            //             }
            //         })
            //     }
            //     if (imagePosition) {
            //         imageObject = {
            //             imageName: name,
            //             imagePosition: {x: imagePosition.x+offset[0], y: imagePosition.y+offset[1], z: imagePosition.z+offset[2]}
            //         }
            //         context.image = imageObject;
            //     }
            // } else if (_currentMode == "panorama" && _viewer.scene.images360[0]) {
            //     let imagePosition;
            //     let name;
            //     if (justLoadedImage != null) {
            //         imagePosition = justLoadedImage.position;
            //         name = justLoadedImage.file.split('/').pop();
            //     } else if(_currentLoadedImage != null) {
            //         _viewer.scene.images360[0].images.forEach( image => {
            //             if(image.file.split('/').pop() === _currentLoadedImage) {
            //                 imagePosition = image.position;
            //                 name = image.file.split('/').pop();
            //             }
            //         })
            //     }
            //     if (imagePosition) {
            //         imageObject = {
            //             imageName: name,
            //             imagePosition: {x: imagePosition[0]+offset[0], y: imagePosition[1]+offset[1], z: imagePosition[2]+offset[2]}
            //         }
            //         context.image = imageObject;
            //     }
            // }

            // console.log("Inside potree getcamera: ", context);
        }
        return context;
    }

    const updateContext = (context, sendContext) => {

    }

    const getViewerState = () => {

    }

    const updateViewerState = () => {

    }

    const loadFloormap = () => {
        if (!_floormapPath) {
            console.log("No floormap available:");
            return;
        }

        let base_image = new Image();
        base_image.src = _floormapPath;
        // return new Promise((resolve, reject) => {
        let fpCanvas = document.getElementById(_fpCanvasId);
        let fpContainer = document.getElementById(_fpContainerId);
        let viewerDiv = document.getElementById(_viewer.canvasId);
        // fpContainer.style.display = this.currentMode === 'panorama' ? 'block' : 'none';
        fpContainer.style.display = 'block';

        _viewer.floorMap = {}
        _viewer.floorMap.canvas = fpCanvas;
        _viewer.floorMap.container = fpContainer;
        _viewer.floorMap.div = viewerDiv;
        _viewer.floorMap.coverage = 0.25;
        _viewer.floorMap.icons = [];
        _viewer.floorMap.images = {};
        

        console.log("Inside load floormap: ", _viewer.canvasId, _viewer.floorMap);
        base_image.onload = async () => {
            if (_floorMap) {
                return;
            }
            _floorMap = true;
            _viewer.floorMap.image = base_image;
            updateFPSize(_viewer.floorMap);

            let fpMarix = new THREE.Matrix4().set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            let fpOffset = [0, 0, 0];
            const tm_json_raw = await fetch(_floormapTmPath);
            if (tm_json_raw.status == 200) {
                const tm_json = JSON.parse(await tm_json_raw.text());
                if (tm_json.tm) {
                    fpMarix = new THREE.Matrix4().fromArray(tm_json.tm).transpose();
                    console.log('FP TM Loaded');
                }
                _viewer.floorMap.tm = fpMarix;

                if (tm_json.offset) {
                    fpOffset = tm_json.offset;
                }
                _viewer.floorMap.offset = fpOffset;
            }
            // addUserLocation('https://dtwin-viewers.s3.ap-south-1.amazonaws.com/icons/fp_user.png', _viewer);
        }
    }

    const resizeFP = (image, fpCanvas, v, coverage) => {
        // let coverage = 0.5;
        // if (isCompareMode) {
            // coverage = 0.25;
        // }
        // let coverage = 
        if (image.naturalWidth > image.naturalHeight) {
            fpCanvas.width = v.clientWidth * coverage;
            fpCanvas.height = fpCanvas.width * (image.naturalHeight / image.naturalWidth)
        } else {
            fpCanvas.height = coverage * v.clientWidth;
            fpCanvas.width = fpCanvas.height * (image.naturalWidth / image.naturalHeight);
        }
    }

    const updateFPSize = (fpData) => {
        // console.log(fpData);
        resizeFP(fpData.image, fpData.canvas, fpData.div, fpData.coverage);
        let context = fpData.canvas.getContext('2d');
        context.drawImage(fpData.image, 0, 0, fpData.canvas.width, fpData.canvas.height);
        if (fpData.icons && fpData.icons.length > 0) {
            updateFpIcons(fpData);
        }
    }

    const updateUserLocation = () => {

    }

    const updateFloormapAnimation = () => {
        if (_floorMap) {
            updateUserLocation();
        }
    }

    const addEventListeners = () => {

    }

    const removeTasks = () => {
        // console.log("Inside remove tasks: ", this.taskSpriteMap);
        // for(let taskId of Object.keys(this.taskSpriteMap)) {
        //     let annotation = this.taskSpriteMap[taskId].tag;
        //     this.viewer.scene.annotations.remove(annotation);
        //     annotation.dispose();
        // }
    }

    const removeIssues = () => {
        // console.log("Inside remove issues: ", this.issueSpriteMap);
        // for(let issueId of Object.keys(this.issueSpriteMap)) {
        //     let annotation = this.issueSpriteMap[issueId].tag;
        //     this.viewer.scene.annotations.remove(annotation);
        //     annotation.dispose();
        // }
    }

    const removeAssets = () => {
        // console.log("Inside remove assets potree");
       _viewer.scene.scenePointCloud.remove(_viewer.scene.pointclouds[0]);
       _viewer.scene.pointclouds = [];
        if (_viewer.scene.orientedImages.length && _viewer.scene.orientedImages[0]) {
           _viewer.scene.orientedImages[0].release();
           _viewer.scene.orientedImages[0].images.forEach(image => {
               _viewer.scene.scene.children[0].remove(image.mesh);
               _viewer.scene.scene.children[0].remove(image.line);
            });
           _viewer.scene.scene.remove(_viewer.scene.scene.children[0]);
           _viewer.scene.removeOrientedImages(_viewer.scene.orientedImages[0]);
        }

        if (_viewer.scene.annotations.children && _viewer.scene.annotations.children.length > 0) {
            for(let annotation of _viewer.scene.annotations.children) {
                _viewer.scene.annotations.remove(annotation);
                annotation.dispose();
            }
        }

        if (_viewer.scene.images360.length && _viewer.scene.images360[0]) {
           _viewer.scene.images360[0].unfocus(false);
           _viewer.scene.images360[0].images.forEach(image => {
               _viewer.scene.scene.children[0].remove(image.mesh);
            });
           _viewer.scene.scene.children[0].remove(_viewer.scene.images360[0].sphere);
           _viewer.scene.scene.remove(_viewer.scene.scene.children[0]);
           _viewer.scene.remove360Images(_viewer.scene.images360[0]);
        }
        if (_floorMap) {
            removeFloorMap();
        }
        _isPointCloudLoaded = false;
        _currentLoadedImage = null;

    }

    const removeFloorMap = () => {
        _viewer.floorMap.icons.forEach(icon => {
            _viewer.floorMap.container.removeChild(icon);
        });
        _viewer.floorMap.icons = [];
        _viewer.floorMap.container.removeChild(_viewer.floorMap.userIcon);
        _viewer.floorMap.userIcon = null;
        _viewer.floorMap.images = null;
        let context = _viewer.floorMap.canvas.getContext('2d');
        context.clearRect(0, 0, _viewer.floorMap.canvas.width, _viewer.floorMap.canvas.height);
        _floorMap = false;
        _viewer.floorMap = {};
    }

    const removeData = () => {
        try {
            removeTasks();
            removeIssues();
            removeAssets();
        } catch {
            console.log("Error while removing data from potree viewer: ");
        }
    }

    const shutdown = () => {
        if(_isViewerInitialized) {
            removeData();
            removeEventListeners();
          }
          _isViewerInitialized = false;
        //   _isActive = false;
    }

    return {
        initializeViewer: initializeViewer,
        isViewerLoaded: isViewerLoaded,
        isCompareView: isCompareView,
        readyForCompare: readyForCompare,
        finishForCompare: finishForCompare,
        setStructure: setStructure,
        setSnapshot: setSnapshot,
        updateIssuesData: updateIssuesData,
        updateTasksData: updateTasksData,
        updateProgressData: updateProgressData,
        updateData: updateData,
        updateLayersData: updateLayersData,
        initiateAddTag: initiateAddTag,
        cancelAddTag: cancelAddTag,
        selectTag: selectTag,
        showTag: showTag,
        getContext: getContext,
        updateContext: updateContext,
        getViewerState: getViewerState,
        updateViewerState: updateViewerState,
        updateFloormapAnimation: updateFloormapAnimation,
        removeData: removeData,
        shutdown: shutdown,
    };
};