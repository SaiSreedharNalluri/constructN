// import * as THREE from "../public/potree/libs/three.js/build/three.module.js";
import * as THREE from "three"
import { PotreeInstance } from "./PotreeWrapper";
import { isMobile } from "./ViewerDataUtils";

export const PotreeViewerUtils = () => {

    let _viewerId;
    let _eventHandler;
    let _viewer;

    let _isViewerInitialized = false;
    let _isActive = false;

    let _structure;
    let _snapshot;
    let _tasksList = [];
    let _issuesList = [];
    let _progressList = [];

    let _realityPositionMap = {};
    let _pointCloudPath = {};
    let _pointCloudMap = {};
    let _floormapPath;
    let _floormapTmPath;

    let _realityLayers = {};
    let _floorMap = false;

    let _createTagTool = false;
    let _tempTag;
    let _tagType;
    let _isAddTagActive = false;

    let currentTag;
    let currentTagType;
    let _tagMap = {};
    let _issueSpriteMap = {};
    let _taskSpriteMap = {};
    let _tagState = {
        "Issue": true,
        "Task": true
    };

    let _fpContainerId;
    let _fpCanvasId;

    let _isPointCloudLoaded = false;
    let _isPendingDataToLoad = false;
    let _isPendingLayersToLoad = false;

    let _currentMode = "3d"
    let _currentReality;
    let _currentImageName;

    let _imageLoadedOnce = false;

    let _tmMatrix = new THREE.Matrix4().set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    let _globalOffset = [0,0,0];

    let _context;
    let _sendContext = false;

    const initializeViewer = (viewerId, eventHandler) => {
        console.log("potree inisde initializeViewer: ")
        _viewerId = viewerId;
        _eventHandler = eventHandler;
        _fpContainerId = `fpContainer_${_viewerId.split("_")[1]}`;
        _fpCanvasId = `floormap_${_viewerId.split("_")[1]}`;

        const loadGUICallback = () => {
            console.log("potree inisde initializeViewer callback : ")
            if (!_isViewerInitialized) {
                console.log("potree inisde initializeViewer adding eventListeners : ")
                _isViewerInitialized = true;
                // addEventListeners();
                // isActive = true;
            }
        }
        if (isCompareView()) {
            _viewer = PotreeInstance.getCompareInstance(_viewerId).viewer;
        } else {
            _viewer = PotreeInstance.getInstance(_viewerId).viewer;
        }
        _viewer.canvasId = _viewerId; //Used by potree
        _viewer.loadGUI(loadGUICallback);
        // if (isMobile()) {
        //     var button = document.getElementById("myButton");
        //     button?.addEventListener("click", function () {
        //       nextPanoImage(_viewer);
        //     });
        // }
        addEventListeners();
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
        if (_currentMode === "Drone Image" && mode == "Forge") {
            unloadAllImages();
        } else if(_currentMode === "Phone Image") {
            goToNearest360Image(_viewer.scene.view.position);
        }

        if(_currentMode !== "3d" && _floorMap) {
            updateFPSize(_viewer.floorMap);
        }
    }

    const finishForCompare = () => {
        if(_currentMode !== "3d" && _floorMap) {
            updateFPSize(_viewer.floorMap);
        }
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

        // if (_isViewerInitialized) {
        //     loadData();
        // }
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

        if (_isViewerInitialized) {
            loadData();
        }
        // if (loadLayersOnDataLoadCompletion()) {
        //     loadLayers();
        //     loadIssues();
        //     loadTasks();
        // }

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

    const loadFirstImageOnLayersLoadCompletion = () => {
        console.log("Inside Potree loadFirstImage On layers load complete: ", _realityLayers);
        for (const reality in _realityLayers) {
            if (_realityLayers[reality].loaded == false) {
                return false;
            }
        }
        return true;
    }

    const loadData = async () => {
        removeData();
        let pointClouds = [];
        let isLoadFloormap = false;
        for (const realityType in _realityPositionMap) {
            switch (realityType) {
                case "360 Video":
                    for(let pointCloudData of _realityPositionMap[realityType]) {
                        // loadPointCloud(pointCloudData);
                        if (pointCloudData.tm && pointCloudData.tm.length > 0) {
                            let tmMatrix =  new THREE.Matrix4().fromArray(pointCloudData.tm).transpose();
                            pointCloudData.tm = tmMatrix;
                        } else {
                            pointCloudData.tm = _tmMatrix;
                        }

                        if(pointCloudData.offset && pointCloudData.offset.length > 0) {
                            _globalOffset = pointCloudData.offset;
                        }

                        pointClouds.push(pointCloudData);
                    }
                    isLoadFloormap = true;
                    break;
                case "Drone Image":
                    for(let pointCloudData of _realityPositionMap[realityType]) {
                        // loadPointCloud(pointCloudData);
                        if (pointCloudData.tm && pointCloudData.tm.length > 0) {
                            let tmMatrix =  new THREE.Matrix4().fromArray(pointCloudData.tm).transpose();
                            pointCloudData.tm = tmMatrix;
                        } else {
                            pointCloudData.tm = _tmMatrix;
                        }

                        if(pointCloudData.offset && pointCloudData.offset.length > 0) {
                            _globalOffset = pointCloudData.offset;
                        }
                        pointClouds.push(pointCloudData);
                    }
                    break;
                case "360 Image":
                case "Phone Image":
                    isLoadFloormap = true;
                    break;
            }
        }
        // isLoadFloormap && await loadFloormap();
        loadPointCloud(pointClouds);
        
        
        
    }

    const loadPointCloud = async (pointCloudDataArray) => {
        let loadEvents = await Promise.all(pointCloudDataArray.map(pointCloudData => Potree.loadPointCloud(pointCloudData.pointCloud, _viewerId + '_' + pointCloudData.id)));
        let scene = _viewer.scene;

        let pointCloudLoaded = false;
        // let event = loadEvents[1];
        for(let event of loadEvents ) {
            console.log("PotreeWrapper loadPointcloud :", getRealityIdFromURL(event.pointcloud.pcoGeometry.url));
            let realityId = getRealityIdFromURL(event.pointcloud.pcoGeometry.url);
            let pointcloud = event.pointcloud;
            let material = pointcloud.material;
            material.size = 1;
            material.pointSizeType = Potree.PointSizeType.FIXED;
            material.shape = Potree.PointShape.SQUARE;
            let tmData = pointCloudDataArray.find(e => e.id === realityId);
            // if (tmData.tm && tmData.tm.length > 0) {
            //     let tmMatrix =  new THREE.Matrix4().fromArray(tmData.tm).transpose();
            //     pointcloud.applyMatrix4(tmMatrix);
            // } else {
                pointcloud.applyMatrix4(tmData.tm);
            // }
            
            const assetPosition = pointcloud.position.clone();
            // if(tmData.offset && tmData.offset.length > 0) {
            //     let globalOffset = tmData.offset;
            //     pointcloud.position.set(assetPosition.x - globalOffset[0], assetPosition.y - globalOffset[1], assetPosition.z - globalOffset[2]);
            // } else {
                pointcloud.position.set(assetPosition.x - _globalOffset[0], assetPosition.y - _globalOffset[1], assetPosition.z - _globalOffset[2]);
            // }
            scene.addPointCloud(pointcloud);
            _viewer.fitToScreen();
            pointCloudLoaded = true;
            // console.log('Point Cloud Loaded');
        }

        _currentMode = "3d";
        _isPointCloudLoaded = pointCloudLoaded;
        if (loadLayersOnDataLoadCompletion()) {
            loadLayers();
            loadIssues();
            loadTasks();
        }
    }

    const loadLayers = () => {
        console.log("Inside Potree load layers: ", _realityPositionMap);
        _realityLayers = {};

        for (const realityType in _realityPositionMap) {
            switch (realityType) {
                case "360 Video":
                case "360 Image":
                    // pointCloudView(true);
                    for(let pathObject of _realityPositionMap[realityType]) {
                        _realityLayers[pathObject.id] = {
                            id: pathObject.id,
                            type: realityType,
                            index: undefined,
                            sceneIndex: undefined,
                            loaded: false,
                            imagesPath: pathObject.positionPath,
                            position: pathObject.position
                        }
                        loadSphericalImages(new THREE.Matrix4(), _globalOffset, pathObject.id, pathObject.positionPath, pathObject.imagesPath);
                        
                    }
                    // this.currentMode = '360 Video'
                    break;
                case "Phone Image":
                    // pointCloudView(true);
                    for(let pathObject of _realityPositionMap[realityType]) {
                        _realityLayers[pathObject.id] ={
                            id: pathObject.id,
                            type: realityType,
                            index: undefined,
                            sceneIndex: undefined,
                            loaded: false,
                            imagesPath: pathObject.positionPath,
                            position: pathObject.position
                        };
                        loadDroneImages(new THREE.Matrix4(), _globalOffset, pathObject.id, pathObject.positionPath, pathObject.imagesPath);
                        // break;
                    }
                    // this.currentMode = 'Phone Image'
                    
                    break;
                case "Drone Image":
                    // pointCloudView(true);
                    for(let pathObject of _realityPositionMap[realityType]) {
                        _realityLayers[pathObject.id] ={
                            id: pathObject.id,
                            type: realityType,
                            index: undefined,
                            sceneIndex: undefined,
                            loaded: false,
                            imagesPath: pathObject.positionPath,
                            position: pathObject.position
                        };
                        loadDroneImages(pathObject.tm, _globalOffset, pathObject.id, pathObject.positionPath, pathObject.imagesPath);
                    }
                    // this.currentMode = 'Drone Image'
                    break;

            }
        }
        _isPendingLayersToLoad = false;
    }

    const loadDroneImages = (tm, offset, id, imagePositionsPath, imagesPath) => {
        let tmData = { tm: tm, offset: offset};
        Potree.OrientedImageLoader.load(imagePositionsPath, imagesPath, _viewer, tmData).then(images => {
            _viewer.scene.addOrientedImages(images);
            _realityLayers[id].sceneIndex = getSceneChildrenLength() - 1;
            _realityLayers[id].index = getOrientedImagesLength() - 1;
            _realityLayers[id].loaded = true;
            
            _sendContext = false;
            if(_floorMap){
                loadLayersOnFloorMap(id, _realityLayers[id].type, _realityLayers[id].imagesPath);
            }

            if (loadFirstImageOnLayersLoadCompletion() && _imageLoadedOnce == false) {
                if (_context && _context.type !== "2d") {
                    updateContext(_context, false);
                } else {
                    loadFirstImage();
                }
                
            }
        });
    }

    const loadSphericalImages = (tm, offset, id, imagePositionsPath, imagesPath, context) => {
        // viewerMode = 'panorama'
        let tmData = { tm: tm, offset: offset};
        Potree.Images360Loader.load(imagePositionsPath, imagesPath, _viewer, tmData).then(images => {
            _viewer.scene.add360Images(images);
            _realityLayers[id].sceneIndex = getSceneChildrenLength() - 1;
            _realityLayers[id].index = getSphericalImagesLength() - 1;
            _realityLayers[id].loaded = true;
            
            _sendContext = false;
            if(_floorMap){
                loadLayersOnFloorMap(id, _realityLayers[id].type, _realityLayers[id].imagesPath);
            }
             if (loadFirstImageOnLayersLoadCompletion() && _imageLoadedOnce == false) {
                if (_context && _context.type !== "2d") {
                    updateContext(_context, false);
                } else {
                    loadFirstImage();
                }
               
            }
        });
    }

    const getSceneChildrenLength = () => {
        return _viewer.scene.scene.children.length
    }

    const getOrientedImagesLength = () => {
        return _viewer.scene.orientedImages.length;
    }

    const getSphericalImagesLength = () => {
        return _viewer.scene.images360.length;
    }

    const onImageLoad = (event) => {
        if(event.detail.viewer !== _viewerId) {
            return;
        }
        console.log('potree orientedImagesLoad ', event);
        // pointCloudView(true);
        _currentImageName = event.detail.image.id;
        let reality = getRealityByImageName(_currentImageName);

        _currentMode = reality.type;
        _currentReality = reality;

        if(_sendContext) {
            _sendContext = false;
            _eventHandler(_viewerId, getContext(event.detail.image));
        }
    }   

    const onImageUnLoad = (event) => {
        if(event.detail.viewer !== _viewerId) {
            return;
        }
        console.log('potree orientedImagesUnLoad ', event);
        // pointCloudView(false);
        _currentImageName = null;
    
        if (_currentMode == "Drone Image") {
            _viewer.fitToScreen();
            pointCloudView(false);
        }
        _currentMode = "3d"
    }

    const onPanoLoad = (event) => {
        if(event.detail.viewer !== _viewerId) {
            return;
        }
        console.log('potree panoImagesLoad ', event, _currentReality);
        _viewer.renderArea.addEventListener('mousewheel', onZoomHandler);
        // pointCloudView(true);

        _currentImageName = event.detail.image.file.split('/').pop();;
        if(_sendContext) {
            _sendContext = false;
            _eventHandler(_viewerId, getContext(event.detail.image));
        }
    }

    const onPanoUnLoad = (event) => {
        if(event.detail.viewer !== _viewerId) {
            return;
        }
        console.log('potree panoImagesUnLoad ', event);
        _viewer.renderArea.removeEventListener('mousewheel', onZoomHandler);
        _currentImageName = null;
        // pointCloudView(false);

        // this.viewer.fitToScreen();
        // this.pointCloudView(false);


        // if (event.detail.viewer === this.viewerId) {
        //     this.toggleFloorMap(this.viewer, false);
        // }
    }

    const onRingClick = (event) => {
        if(event.detail.viewer !== _viewerId) {
            return;
        }

        console.log('potree onRingClick ', event);

        let imageName = event.detail.image.file.split('/').pop()
        let reality = getRealityByImageName(imageName);

        _sendContext = true;
        loadImage(reality, event.detail.image);
        
    }

    const imageEventListeners = (remove = false) => {
        if (!remove) {
            console.log('potree adding imageEventListeners ');
            document.addEventListener('imageLoad', onImageLoad);
            document.addEventListener('imageUnload', onImageUnLoad);
            document.addEventListener('panoLoad', onPanoLoad);
            document.addEventListener('panoUnload', onPanoUnLoad);
            document.addEventListener('onRingClick', onRingClick);
        } else {
            console.log('potree removing imageEventListeners ');
            document.removeEventListener('imageLoad', onImageLoad);
            document.removeEventListener('imageUnload', onImageUnLoad);
            document.removeEventListener('panoLoad', onPanoLoad);
            document.removeEventListener('panoUnload', onPanoUnLoad);
            document.removeEventListener('onRingClick', onRingClick);
        }
    }

    const loadFirstImage = () => {
        console.log("Potree load first image");
        for (const reality in _realityLayers) {
            if (_realityLayers[reality].loaded == false) {
                return false;
            }
        }
        let realities = Object.keys(_realityLayers);
        let reality = _realityLayers[realities[0]];
       
        loadImage(reality);
    }

    const loadImage = (reality, image, cameraWithOffset) => {
        unloadAllImages();
        removeTagFromScene();

        _currentMode = reality.type;
        _currentReality = reality;

        try {
            switch(reality.type) {
                case "360 Video":
                case "360 Image":
                    _imageLoadedOnce = true;
                    loadPanoImages(image ? image : _viewer.scene.images360[reality.index].images[0], reality.index, cameraWithOffset);
                    break;
                case "Phone Image":
                    _imageLoadedOnce = true;
                    loadOrientedImages(image ? image : _viewer.scene.orientedImages[reality.index].images[0], reality.index);
                    break;
                case "Drone Image":
                    _imageLoadedOnce = true;
                    loadOrientedImages(image ? image : _viewer.scene.orientedImages[reality.index].images[0], reality.index);
                    break;
    
            }
        } catch(e) {
            console.log(e)
        } finally {
            pointCloudView(true);
        }
    }   

    const unLoadImage = () => {

    }

    const unloadAllImages = () => {
        if(_viewer.scene.orientedImages.length > 0) {
            unloadOrientedImage();
        }

        for(let i = 0; i < _viewer.scene.images360.length; i++) {
            console.log("potree floormaplayers: inside unloadPano: ",i, _viewer.scene.images360[i], _viewer.scene.images360[i].focusedImage);
            _viewer.scene.images360[i].unfocus();
        } 
        
        _currentMode = "3d";
        _currentReality = null;
        
    }

    const loadOrientedImages = (image, index = 0) => {

        setTimeout(() => {
            _viewer.scene.orientedImages[index].moveToImage(image);
        }, 1000);
        let event = {
            detail: {
                viewer: _viewer.canvasId,
                image
            }
        }
        // this.onOrientedImageLoad(event);
    }

    const unloadOrientedImage = () => {
        if(_viewer.controls.elExit) {
            _viewer.controls.elExit.click();
        }
        // this.onOrientedImageUnload(this.viewer);
    }

    const loadPanoImages = (image, index = 0, cameraInfo = null) => {
        console.log("potree Load pano images: ", image, index, cameraInfo);
        // if (this.currentLoadedImage === image.file.split('/').pop()) {
        //     return;
        // }


        if (!cameraInfo || cameraInfo == null) {
            _viewer.scene.images360[index].focus(image);
        } else {
            _viewer.scene.images360[index].focus(image, true, cameraInfo);
        }

        // this.onPanoImageLoad(image, index, this.viewer);

    }

    const getCurrentImage = () => {

        switch (_currentReality.type) {
            case "Drone Image":
            case "Phone Image":
                return _viewer.scene.orientedImages[_currentReality.index].focused;
                break;
            case "360 Video":
            case "360 Image":
                return _viewer.scene.images360[_currentReality.index].focusedImage;
                break;
        }
    }

    const loadIssues = () => {
        // console.log("Inside load issue: ", this._issuesList);
        removeIssues();
        _issueSpriteMap = {};
        for(let issue of _issuesList) {
            // console.log("Inside issue create reality: ", issue);
            let context = getContextLocalFromGlobal(issue.context);
            context.id = issue._id;
            // let sprite = this.createSprite(context);
            let sprite = createAnnotation(context);
            _issueSpriteMap[context.id] = {
                context: context,
                tag: sprite
            }
            sprite._visible = false;
            // this.viewer.scene.scene.add(sprite);
            _viewer.scene.annotations.add(sprite);
        }
    }

    const loadTasks = () => {
        // console.log("Inside load issue: ", this._tasksList);
        removeTasks();
        _taskSpriteMap = {};
        for(let task of _tasksList) {
            // console.log("Inside issue create reality: ", task);
            let context = getContextLocalFromGlobal(task.context);
            if(context) {
                context.id = task._id;
                // let sprite = this.createSprite(context);
                let sprite = createAnnotation(context);
                _taskSpriteMap[context.id] = {
                    context: context,
                    tag: sprite
                }
                sprite._visible = false;
                // this.viewer.scene.scene.add(sprite);
                _viewer.scene.annotations.add(sprite);
            }
        }
    }

    const activateCreateTagTool = () => {
        _createTagTool = true;
        
        setTimeout((() => {
            if(isMobile())
            {
                _viewer.renderArea.addEventListener("touchstart", onClickHandler);
            }
            else{
                _viewer.renderArea.addEventListener("click", onClickHandler);
            }
        }), 1)
        return true;
    }

    const deactivateCreateTagTool = () => {
        _createTagTool = false;
        return false;
    }  

    const initiateAddTag = (type) => {
        _tagType = type;
        _isAddTagActive = activateCreateTagTool();
        removeTagFromScene();
    }

    const cancelAddTag = () => {
        _viewer.scene.annotations.remove(_tempTag);
    }

    const finishAddTag = (tag) => {
        // console.log("Potree Inside finishAddTag: ", tag);
        _viewer.scene.annotations.remove(_tempTag);
        addTagToScene(tag);
    }

    const selectTag = (tag) => {
        updateContext(tag, true); 
        addTagToScene(tag);
    }

    const addTagToScene = (tag) => {
        // console.log("Potree tag Inside add tag scene: ", tag);
        switch(tag.type) {
            case "Issue":
                if (_issueSpriteMap.hasOwnProperty(tag.id)) {
                    let annotation = _issueSpriteMap[tag.id].tag;
                    // console.log("Potree tag Inside add tag scene, if condition: ", tag, _issueSpriteMap.hasOwnProperty(tag.id), _issueSpriteMap[tag.id].tag);
                    // _viewer.scene.annotations.add(annotation);
        
                    annotation._visible = true;
                    // annotation._display = true;
                    currentTag = annotation;
                    currentTagType = tag.type;
                }
                break;
            case "Task":
                if (_taskSpriteMap.hasOwnProperty(tag.id)) {
                    let annotation = _taskSpriteMap[tag.id].tag;
                    // console.log("Potree tag Inside add tag scene, if condition: ", tag, _taskSpriteMap.hasOwnProperty(tag.id), _taskSpriteMap[tag.id].tag);
                    // _viewer.scene.annotations.add(annotation);
        
                    annotation._visible = true;
                    // annotation._display = true;
                    currentTag = annotation;
                    currentTagType = tag.type;
                }
                break;
        }
    }

    const removeTagFromScene = () => {
        // console.log("Potree tag removeTagFrom Scene: ", currentTag);
        if (currentTag) {
            currentTag._visible = false;
            // _viewer.scene.annotations.remove(currentTag);
            // currentTag.dispose();
            currentTag = undefined;
            currentTagType = undefined;
        }
    }

    const showTag = (tag, show) => {
        switch(tag) {
            case "Issue":
                showIssues(show);
                break;
            case "Task":
                showTasks(show);
                break;
        }
    }

    const showIssues = (show) => {
        if (currentTag) {
            currentTag._visible = show;
        }

        // for(let issueId of Object.keys(_issueSpriteMap)) {
        //     let annotation = _issueSpriteMap[issueId].tag;
        //     annotation._visible = show;
        // }
    }

    const showTasks = (show) => {
        if (currentTag) {
            currentTag._visible = show;
        }

        // for(let taskId of Object.keys(_taskSpriteMap)) {
        //     let annotation = _taskSpriteMap[taskId].tag;
        //     annotation._visible = show;
        // }
    }

    const getMousePointCloudIntersection = (mouse, camera, viewer, pointclouds, params = {}) => {

        let renderer = viewer.renderer;

        let nmouse = {
            x: (mouse.x / renderer.domElement.clientWidth) * 2 - 1,
            y: -(mouse.y / renderer.domElement.clientHeight) * 2 + 1
        };

        let pickParams = {};

        if(params.pickClipped){
            pickParams.pickClipped = params.pickClipped;
        }

        pickParams.x = mouse.x;
        pickParams.y = renderer.domElement.clientHeight - mouse.y;

        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(nmouse, camera);
        let ray = raycaster.ray;

        let selectedPointcloud = null;
        let closestDistance = Infinity;
        let closestIntersection = null;
        let closestPoint = null;
        if (!isMobile()) {
            for(let pointcloud of pointclouds){
                let point = pointcloud.pick(viewer, camera, ray, pickParams);
            if(!point){
                continue;
            }
             let distance = camera.position.distanceTo(point.position);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    selectedPointcloud = pointcloud;
                    closestIntersection = point.position;
                    closestPoint = point;
                }
            }
        }
        if (selectedPointcloud) {
            return {
                location: closestIntersection,
                distance: closestDistance,
                pointcloud: selectedPointcloud,
                point: closestPoint
            };
        } else {
            let objects;
            if (_currentMode == 'Drone Image' || _currentMode == 'Phone Image') {
                objects = [_viewer.scene.scene.children[_currentReality.sceneIndex]];
                return null
            } else if (_currentMode == '360 Image' || _currentMode == '360 Video') {
                objects = [_viewer.scene.scene.children[_currentReality.sceneIndex].children[0]];
                const intersectedObjects = raycaster.intersectObjects(objects, true);
                if(intersectedObjects.length) {
                    console.log("Testing Tag creation: ", intersectedObjects);
                    var fractionOfTotal = 3 / intersectedObjects[0].distance;
                    var xDist = intersectedObjects[0].point.x - camera.position.x;
                    var yDist = intersectedObjects[0].point.y - camera.position.y;
                    var zDist = intersectedObjects[0].point.z - camera.position.z;
                    var p = {
                        x: camera.position.x + xDist * fractionOfTotal,
                        y: camera.position.y + yDist * fractionOfTotal,
                        z: camera.position.z + zDist * fractionOfTotal,
                    }
                    console.log("Testing Tag creation: ", camera.position, xDist, yDist, zDist, fractionOfTotal, p);
                    return {
                        location: p
                    };
                }
                return null;
            }

        }
    }

    const onClickHandler = (event) => {
        const rect = _viewer.renderArea.getBoundingClientRect();
        let pos = {
            x:isMobile()? event.touches[0].clientX - rect.left : event.clientX - rect.left,
            y:isMobile()?event.touches[0].clientY - rect.top : event.clientY - rect.top,
        };
        
        const intersectedObjects = getMousePointCloudIntersection(pos, _viewer.scene.cameraP, _viewer, _viewer.scene.pointclouds);
        if (intersectedObjects) {
            let click_point = intersectedObjects.location;
            processTag(click_point);
            console.log("Event clicked : ", pos, event, click_point);
        }
        if(isMobile())
        {
            _viewer.renderArea.removeEventListener('touchstart',  onClickHandler);
        }
        else{
            _viewer.renderArea.removeEventListener('click',  onClickHandler);
        }
        
    }
    const processTag = (click_point) => {
        _isAddTagActive = deactivateCreateTagTool();
        let offset = _globalOffset;
        let tagPosition = {
            x: click_point.x + offset[0],
            y: click_point.y + offset[1],
            z: click_point.z + offset[2]
        }
        let tagObject = {
            tagPosition: tagPosition,
        }
        let tag_context_obj = {
            type: _tagType,
            id: `Temp_${_tagType}`,
            cameraObject: getContext().cameraObject,
            tag: tagObject
        }

        if (_currentMode != "3d") {
            let curImage = getCurrentImage();
            console.log("Inside create tag object reality: ", curImage);
            let position = (_currentMode === "Drone Image" || _currentMode === "Phone Image") ? {
                x: curImage.position.x + offset[0],
                y: curImage.position.y + offset[1],
                z: curImage.position.z + offset[2]
            } : {
                x: curImage.position[0] + offset[0],
                y: curImage.position[1] + offset[1],
                z: curImage.position[2] + offset[2]
            }
            let imageObject = {
                imagePosition: position,
                imageName: (_currentMode === "Drone Image" || _currentMode === "Phone Image") ? curImage.id : curImage.file.split('/').pop()
            };
            tag_context_obj.image = imageObject;
        }
        console.log('Saving Annotation: ', tag_context_obj);
        // let tag = this.createSprite(this.getContextLocalFromGlobal(tag_context_obj));
        let tag = createAnnotation(getContextLocalFromGlobal(tag_context_obj));
        _tempTag = tag;
        _viewer.scene.annotations.add(tag);
        _eventHandler(_viewerId, tag_context_obj)
    }

    const getSpriteIcon = (type) => {
        switch(type) {
            case "Issue":
                return "/icons/issuesInViewer.svg";
                break;
            case "Task":
                return "/icons/tasksInViewer.svg";
                break;
        }
    }

    const createAnnotation = (context) => {
        let position = context.tag.tagPosition;
        let cameraPosition = context.tag.tagPosition;
        let cameraTarget = context.tag.tagPosition;
        if (context.camera) {
            cameraPosition = context.camera.cameraPosition;
            cameraTarget = context.camera.cameraTarget;
        }

        let tagObject =  $(`
        <span>
            <img name=${context.id} src="${getSpriteIcon(context.type)}"/>
        </span>`);
        tagObject.find(`img[name=${context.id}]`).click((event) => {
            event.stopPropagation();
            console.log("Inside temp tag clock event: ", event.target.name);
            _sendContext = true;
            handleContext(context);
            _eventHandler(_viewerId, context);
        });
        let tag = new Potree.Annotation({
            position: [position.x, position.y, position.z],
            title: tagObject,
            cameraPosition: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
            cameraTarget: [cameraTarget.x, cameraTarget.y, cameraTarget.z],
        });
        // tag._display = false;
        // tag._visible = false;

        return tag;
        
    }

    const createSprite = (context) => {
        let position = context.tag.tagPosition;

        const map = new THREE.TextureLoader().load(this.getSpriteIcon(context.type));
        const material = new THREE.SpriteMaterial( { map: map } );

        const sprite = new THREE.Sprite( material );
        sprite.material.depthTest = true;
        sprite.visible = true;
        sprite.scale.set( .2, .2, 1);
        sprite.position.set(position.x, position.y, position.z);
        if(context.id.includes("Temp")) {
            _tempTag = sprite;
        }
        return sprite;
    }

    const pointCloudView = (cond) => {
        _viewer.setEDLEnabled(cond);
        if (cond) {
            _viewer.setEDLOpacity(0);
        } else {
            _viewer.setEDLOpacity(1);
        }
    }

    const getContextLocalFromGlobal = (globalContext) => {
        // console.log("Global offset: ", globalContext, _globalOffset);
        let context = structuredClone(globalContext);
        let offset = _globalOffset;
        if(context && context.image && context.image.imagePosition) {
            // console.log("Context has image: ", context.image);
            let pos = context.image.imagePosition;
            context.image.imagePosition = {
                x: pos.x - offset[0], 
                y: pos.y - offset[1], 
                z: pos.z - offset[2]
            }
        }

        if (context && context.cameraObject && context.cameraObject.cameraPosition) {
            // console.log("Context has camera: ", context.cameraObject);
            // We use threejs position and target because potree useses threejs clone method
            let pos = context.cameraObject.cameraPosition;
            let tar = context.cameraObject.cameraTarget ? context.cameraObject.cameraTarget : context.cameraObject.cameraPosition;
            context.cameraObject.cameraPosition = new THREE.Vector3().fromArray([
                pos.x - offset[0], 
                pos.y - offset[1], 
                pos.z - offset[2]
            ])

            context.cameraObject.cameraTarget = new THREE.Vector3().fromArray([
                tar.x - offset[0], 
                tar.y - offset[1], 
                tar.z - offset[2]
            ])
            // console.log("Inside context has camera : ", context);
        }

        if (context && context.tag && context.tag.tagPosition) {
            // console.log("Context has tag: ", context.tag);
            let pos = context.tag.tagPosition;
            context.tag.tagPosition = {
                x: pos.x - offset[0], 
                y: pos.y - offset[1], 
                z: pos.z - offset[2]
            }
        }

        return context;
    }
    
    const getContext = (justLoadedImage = null) => {
        let context = undefined;
        // console.log("Inside potree getcamera: ", _viewerId, _currentMode, _currentReality, justLoadedImage, _currentImageName);
        if (_isPointCloudLoaded) {
            let camObject = undefined;
            let imageObject = undefined;
            let pos = _viewer.scene.view.position;
            let tar = _viewer.scene.view.getPivot();
            let offset = _globalOffset
            camObject = {
                cameraPosition: {x: pos.x+offset[0], y: pos.y+offset[1], z: pos.z+offset[2]},
                cameraTarget: {x: tar.x+offset[0], y: tar.y+offset[1], z: tar.z+offset[2]},
                pitch: _viewer.scene.view.pitch,
                yaw: _viewer.scene.view.yaw,
                fov: _viewer.getFOV()
            }

            context = {
                id: _currentMode !== "3d" ? _currentReality.id : new Date().getTime(),
                type: _currentMode,
                cameraObject: camObject,
            }

            if ((_currentMode == "Drone Image" || _currentMode == "Phone Image") && _viewer.scene.orientedImages[_currentReality.index]) {
                let imagePosition;
                let name;
                if (justLoadedImage != null) {
                    imagePosition = justLoadedImage.position;
                    name = justLoadedImage.id
                } else if(_currentImageName != null) {
                    _viewer.scene.orientedImages[_currentReality.index].images.forEach( image => {
                        if(image.id === _currentImageName) {
                            imagePosition = image.position;
                            name = image.id;
                        }
                    })
                }
                if (imagePosition) {
                    imageObject = {
                        imageName: name,
                        imagePosition: {x: imagePosition.x+offset[0], y: imagePosition.y+offset[1], z: imagePosition.z+offset[2]}
                    }
                    context.image = imageObject;
                }
            } else if ((_currentMode == "360 Image" || _currentMode == "360 Video") && _viewer.scene.images360[_currentReality.index]) {
                let imagePosition;
                let name;
                if (justLoadedImage != null) {
                    imagePosition = justLoadedImage.position;
                    name = justLoadedImage.file.split('/').pop();
                } else if(_currentImageName != null) {
                    _viewer.scene.images360[_currentReality.index].images.forEach( image => {
                        if(image.file.split('/').pop() === _currentImageName) {
                            imagePosition = image.position;
                            name = image.file.split('/').pop();
                        }
                    })
                }
                if (imagePosition) {
                    imageObject = {
                        imageName: name,
                        imagePosition: {x: imagePosition[0]+offset[0], y: imagePosition[1]+offset[1], z: imagePosition[2]+offset[2]}
                    }
                    context.image = imageObject;
                }
            }

            // console.log("Inside potree getcamera: ", context);
        }
        return context;
    }

    const getRealityByImageName = (imageName) => {
        let selectedReality;
        for (const realityKey in _realityLayers ) {
            let reality = _realityLayers[realityKey];
            switch (reality.type) {
                case "Drone Image":
                case "Phone Image":
                    _viewer.scene.orientedImages[reality.index].images.forEach( image => {
                        if (image.id == imageName) {
                            selectedReality =  reality;
                        }
                    });
                    break;
                case "360 Video":
                case "360 Image":
                    _viewer.scene.images360[reality.index].images.forEach(image => {
                        if (image.file.split('/').pop() == imageName) {
                            selectedReality =  reality;
                        }
                    });
                    break;
            }
        }
        return selectedReality;
    }

    const goToNearest360Image = (position) => {
        // console.log("Inside new nearest image to position: ", type, position)
        let nearestImage = null;
        let nearestImageDist = 10000; 
        for (const realityKey in _realityLayers ) {
            let reality = _realityLayers[realityKey];
            switch (reality.type) {
                case "360 Video":
                    let inputPos = new THREE.Vector2().fromArray([position.x, position.y]);
                    _viewer.scene.images360[reality.index].images.forEach( pano => {
                        let curPos = new THREE.Vector2().fromArray([pano.position[0], pano.position[1]]);
                        let curDist = curPos.distanceTo(inputPos);
                        if (curDist < nearestImageDist) {
                            nearestImageDist = curDist;
                            nearestImage = pano;
                        }
                    });
                    if (nearestImage) {
                        loadImage(reality, nearestImage);
                    }
                    break;
            }
        }
    }

    const goToNearestImageInAllRealities = (position, cameraWithOffset) => {
        let nearestImage = null;
        let nearestImageDist = 10000; 
        let nearestReality;
        for (const realityKey in _realityLayers ) {
            let reality = _realityLayers[realityKey];
            switch (reality.type) {
                case "Drone Image":
                case "Phone Image":
                    _viewer.scene.orientedImages[reality.index].images.forEach( image => {
                        let curDist = image.position.distanceTo(position);
                        if (curDist < nearestImageDist) {
                            nearestImageDist = curDist;
                            nearestImage = image;
                            nearestReality = reality;
                        }
                    });
                    break;
                case "360 Video":
                case "360 Image":
                    let inputPos = new THREE.Vector2().fromArray([position.x, position.y]);
                    _viewer.scene.images360[reality.index].images.forEach( pano => {
                        let curPos = new THREE.Vector2().fromArray([pano.position[0], pano.position[1]]);
                        let curDist = curPos.distanceTo(inputPos);
                        if (curDist < nearestImageDist) {
                            nearestImageDist = curDist;
                            nearestImage = pano;
                            nearestReality = reality
                        }
                    });
                    break;
            }
        }

        if(nearestImage) {
            loadImage(nearestReality, nearestImage, cameraWithOffset);
        }
    }

    const goToImageInAllRealities = (imageName, cameraWithOffset) => {
        // console.log("Inside potree utils, going to image: ", imageName);
        for (const realityKey in _realityLayers ) {
            let reality = _realityLayers[realityKey];
            switch (reality.type) {
                case "Drone Image":
                case "Phone Image":
                    _viewer.scene.orientedImages[reality.index].images.forEach( image => {
                        if (image.id == imageName) {
                            loadImage(reality, image)
                        }
                    });
                    break;
                case "360 Video":
                case "360 Image":
                    _viewer.scene.images360[reality.index].images.forEach(image => {
                        if (image.file.split('/').pop() == imageName) {
                            loadImage(reality, image, cameraWithOffset);
                        }
                    });
                    break;
            }
        }
    }

    const goToImage = (reality, imageName, cameraWithOffset) => {
        // console.log("Inside potree utils, going to image: ", imageName);
        switch (reality.type) {
            case "Drone Image":
            case "Phone Image":
                _viewer.scene.orientedImages[reality.index].images.forEach( image => {
                    if (image.id == imageName) {
                        loadImage(reality, image)
                    }
                });
                break;
            case "360 Video":
            case "360 Image":
                _viewer.scene.images360[reality.index].images.forEach(image => {
                    if (image.file.split('/').pop() == imageName) {
                        loadImage(reality, image, cameraWithOffset);
                    }
                });
                break;
        }
    }

    const goToContext = (context) => {
        // console.log("Inside potree utils, going to context: ", context);
        if (context.image) {
            goToNearestImageInAllRealities(context.image.imagePosition);
        } else if ((context.type === "Task") || (context.type === "Issue")) {
            goToNearestImageInAllRealities(context.tag.tagPosition, context.cameraObject);
        } else if (context.type === "3d") {
            goToNearestImageInAllRealities(context.cameraObject.cameraPosition);
        } else {
            _viewer.scene.view.setView(context.cameraObject.cameraPosition, context.cameraObject.cameraTarget)
        }
    }

    const handleContext = (context) => {
        let reality = _realityLayers[context.id];

        switch (context.type) {
            case "3d":
                goToContext(context);
                break;
            case "360 Video":
            case "360 Image":
            case "Phone Image":
            case "Drone Image":
                if (reality) {
                    goToImage(reality, context.image.imageName, context.cameraObject);
                } else {
                    goToContext(context);
                }
                break;
            case "Issue":
                let issue = _issuesList.find(issue => issue._id === context.id)
                if(_snapshot._id === issue.snapshot && context.image) {
                    goToImageInAllRealities(context.image.imageName, context.cameraObject);
                } else {
                    goToContext(context);
                }
                break;
            case "Task":
                let task = _tasksList.find(task => task._id === context.id)
                if(_snapshot._id === task.snapshot && context.image) {
                    goToImageInAllRealities(context.image.imageName, context.cameraObject);
                } else {
                    goToContext(context);
                }
                break;
        }
    }

    const updateContext = (context, sendContext) => {
        _sendContext = sendContext;
        if (context) {
            _context = getContextLocalFromGlobal(context);
        } else {
            _context = null;
        }
        handleContext(_context);
    }

    const getViewerState = () => {
        let viewerState;
        let pos = _viewer.scene.view.position.toArray();
        viewerState =  {
            position: [pos[0], pos[1], pos[2]],
            target: _viewer.scene.view.getPivot(),
            fov: _viewer.fov,
        }
        if (_currentMode === "360 Video" || _currentMode === "360 Image") {
            viewerState.pitch =  _viewer.scene.view.pitch;
            viewerState.yaw = _viewer.scene.view.yaw;
            viewerState.fov = _viewer.fov;
        }
            
        // console.log("Inside Potree get ViewerState: ", viewerState)
        return viewerState;
    }

    const updateViewerState = (viewerState) => {
         // console.log("Inside update viewer state: ", this.viewerId, viewerState);
         if (_currentMode === "3d") {
            // console.log("Inside set viewer state for 3D: ", this.viewerId)
            
            _viewer.scene.view.position.set(viewerState.position[0],viewerState.position[1],viewerState.position[2]);
            _viewer.scene.view.lookAt(viewerState.target);
            if(viewerState.fov) {
                // this.viewer.setFOV(viewerState.fov);
            }
            
        } else if ((_currentMode === "360 Video" || _currentMode === "360 Image") && viewerState.pitch){
            // console.log("Inside set viewer state for panorama: ", this.viewerId)
            _viewer.scene.view.pitch = viewerState.pitch;
            _viewer.scene.view.yaw = viewerState.yaw
            if(viewerState.fov) {
                _viewer.setFOV(viewerState.fov);
            }
        }
    }

    const loadFloormap = async () => {
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
            addUserLocation('https://dtwin-viewers.s3.ap-south-1.amazonaws.com/icons/fp_user.png', _viewer);

            _viewer.floorMap.container.addEventListener("click",  onFloorMapClickListener);
        }
    }

    const addUserLocation = (path, viewer) => {
        let base_image = new Image();
        base_image.src = path;
        return new Promise((resolve, reject) => {
        base_image.onload = (() => {
            base_image.setAttribute('class', 'userIcon');
            // base_image.setAttribute('class', 'absolute z-1000 w-6 h-6');
            _viewer.floorMap.userIcon = base_image;
            _viewer.floorMap.container.appendChild(base_image);
            })
        });
    }

    const loadLayersOnFloorMap = async (id, type, imagesPath) => {
        console.log("potree inside loadLayers on floormap: ", type);
        // const indoor_images_raw = await Promise.all(imagePositionsPath.map(path => fetch(`${path}`)));
        const indoor_images_raw = await fetch(`${imagesPath}`);
        // this.viewer.floorMap.images = {};
        let floormapData = _viewer.floorMap;
        let imagesObject = {}
        // for(let images of indoor_images_raw) {
            if (indoor_images_raw.status == 200) {
                const indoor_images = JSON.parse(await indoor_images_raw.text());
                console.log('potree Indoor Images Loaded', indoor_images);
                loadIcons(id, type, indoor_images, _viewer.canvasId);
                // this.addUserLocation('https://dtwin-viewers.s3.ap-south-1.amazonaws.com/icons/fp_user.png', this.viewer); // Update Required
                // imagesObject = {...imagesObject, ...indoor_images}
                _viewer.floorMap.images = {..._viewer.floorMap.images, ...indoor_images};
            }
        // }
        console.log("Inside floor images: ", imagesObject)
        // this.viewer.floorMap.images = imagesObject;
    }

    const onFloorMapClickListener = (event) => {
        const clickData = JSON.parse(event.target.getAttribute('data'));
        console.log("floorInside fp click: ", event, clickData, _viewerId);
        
        let index = _realityLayers[clickData.id].index;
        let reality = _realityLayers[clickData.id];
        if (clickData != null && clickData.canvasId === _viewerId) {
            _sendContext = true;
            goToImage(reality, clickData.name);
        }
        // console.log(clickData.name);
    }

    const loadIcons = (id, type, inData, canvasId) => {
        let iconSize = 0.05;
        // fpStoreData.icons = [];
        let floorMapData = _viewer.floorMap;
        let indexArray = [];
        if (type === "Phone Image" || type === "Drone Image" ) {
            indexArray = inData.camname;
        } else if (type === "360 Video" || type === "360 Image") {
            indexArray = Object.keys(inData);
        }

        let i = 0
        indexArray.forEach((imageName, index) => {
            let cur_image_pos = [];
            if (type === "Phone Image" || type === "Drone Image") {
                cur_image_pos[0] = inData["camX"][index];
                cur_image_pos[1] = inData["camY"][index];
                cur_image_pos[2] = inData["camZ"][index];
            } else {
                cur_image_pos = inData[imageName].position;
            }
             
            const pixelCoords = worldToimage([cur_image_pos[0], cur_image_pos[1], cur_image_pos[2]], floorMapData.tm);
            const screenCoords = imageToScreen(pixelCoords, floorMapData.image, floorMapData.canvas);
            let icon = document.createElement('span');
            icon.setAttribute('class', 'panoIcon');
            let iconImg = document.createElement('img');
            iconImg.setAttribute('src', getFloorMapLayerIcon(type));
            icon.appendChild(iconImg);
            iconImg.setAttribute('data', JSON.stringify({id: id, type: type, name: imageName, position: cur_image_pos, canvasId: canvasId}));
            iconImg.style.width = (floorMapData.canvas.width * iconSize) + 'px';
            iconImg.style.height = (floorMapData.canvas.width * iconSize) + 'px';
            icon.style.width = (floorMapData.canvas.width * iconSize) + 'px';
            icon.style.height = (floorMapData.canvas.width * iconSize) + 'px';
            icon.style.top = (screenCoords[1] - 5) + 'px';
            icon.style.left = (screenCoords[0] - 5) + 'px';
            floorMapData.container.appendChild(icon);
            floorMapData.icons.push(icon);
        });
    }

    const getFloorMapLayerIcon = (type) => {
        switch (type) {
            case 'Drone Image':
                return "https://img.icons8.com/material-outlined/24/null/new-moon.png";
            case '360 Video':
                return "/icons/360VideoWalkInViewer.svg";
            case '360 Image':
                return "/icons/360ImageInViewer.svg";
            case 'Phone Image':
                return "/icons/phoneImageInViewer.svg";
            case 'Issue':
                return "/icons/issuesInViewer.svg";
            case 'Task':
                return "/icons/tasksInViewer.svg";
        }
    }

    const worldToimage = (coords, intm) => {
        const a = new THREE.Vector4(coords[0], coords[1], coords[2], 1);
        a.applyMatrix4(intm);
        return [Math.ceil(a.x), Math.ceil(a.y)]
    }

    const imageToScreen = (pix, image, canvas) => {
        const pxx = (pix[0] * canvas.width) / image.naturalWidth;
        const pyy = (pix[1] * canvas.height) / image.naturalHeight;
        return [pxx, pyy]
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
        resizeFP(fpData.image, fpData.canvas, fpData.div, fpData.coverage);
        let context = fpData.canvas.getContext('2d');
        context.drawImage(fpData.image, 0, 0, fpData.canvas.width, fpData.canvas.height);
        if (fpData.icons && fpData.icons.length > 0) {
            updateFpIcons(fpData);
        }
    }

    const updateFpIcons = (fpInfo) => {
        let iconSize = 0.05
        fpInfo.icons.forEach((icon, index) => {
            let data = JSON.parse(icon.firstChild.getAttribute('data'));
            let cur_image_pos = data.position;
            const pixelCoords = worldToimage(cur_image_pos, fpInfo.tm);
            const screenCoords = imageToScreen(pixelCoords, fpInfo.image, fpInfo.canvas);
            icon.style.width = (fpInfo.canvas.width * iconSize) + 'px';
            icon.style.height = (fpInfo.canvas.width * iconSize) + 'px';
            icon.style.top = (screenCoords[1] - 5) + 'px';
            icon.style.left = (screenCoords[0] - 5) + 'px';
        });
    }

    const updateUserLocation = () => {
        try {
            if(_viewer.floorMap.offset) {
                let curView = _viewer.scene.view;
                const position = curView.position.toArray();
                position[0] += _viewer.floorMap.offset[0];
                position[1] += _viewer.floorMap.offset[1];
                position[2] += _viewer.floorMap.offset[2];
                const pixelCoordsOffset = worldToimage(position, _viewer.floorMap.tm);
                const screenCoords = imageToScreen(pixelCoordsOffset, _viewer.floorMap.image, _viewer.floorMap.canvas);
                _viewer.floorMap.userIcon.style.left = ((screenCoords[0]) - (_viewer.floorMap.userIcon.width / 2) + 5) + 'px';
                _viewer.floorMap.userIcon.style.top = ((screenCoords[1]) - (_viewer.floorMap.userIcon.height / 2) + 5) + 'px';
                const camTarget = (new THREE.Vector3().addVectors(curView.position, curView.direction.multiplyScalar(1))).toArray();
                camTarget[0] += _viewer.floorMap.offset[0];
                camTarget[1] += _viewer.floorMap.offset[1];
                camTarget[2] += _viewer.floorMap.offset[2];
                const camTargetPixel = worldToimage(camTarget, _viewer.floorMap.tm);
                const angle = calAngle(pixelCoordsOffset[0], pixelCoordsOffset[1], camTargetPixel[0], camTargetPixel[1]);
                _viewer.floorMap.userIcon.style.transform = 'rotate(' + angle + 'deg)';
            }
        } catch (err) {
            console.log("Time sync issue: with request animation frame", err);
        }
    }

    const calAngle = (cx, cy, ex, ey) => {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        return (theta-90) + 180;
        // return 90 - theta;
    }

    const updateFloormapAnimation = () => {
        if (_floorMap) {
            updateUserLocation();
        }
    }

    const onKeyDown = (event) => {
        console.log("Potree Inside event listener: ", _currentMode, event, _viewer);
        // if (!this.isActive) {
        //     return;
        // }
        if(_viewer === undefined) {
            return;
        }
        if(_viewer && !_viewer.controls) {
            return;
        }
        // console.log("Inside Key down listener: ", event);
        switch (event.key) {
            case "Escape":
                if (_currentMode == "Drone Image" || _currentMode == "Phone Image") {
                    // _viewer.controls.elExit.click();
                    unloadOrientedImage();
                    _sendContext = true;
                } else {
                    // for(let i = 0; i < _viewer.scene.images360.length; i++) {
                    //     _viewer.scene.images360[i].unfocus();
                    //     pointCloudView(false);
                    // }
                    
                    
                }
                break;
            case "ArrowUp":
                if (_currentMode == "Drone Image" || _currentMode == "Phone Image") {
                    _viewer.controls.elUp.click();
                    // if (isCompareMode && compareType == 'potree') {
                    //     viewer_2.controls.elUp.click();
                    // }
                } else if(_currentMode == "360 Video" || _currentMode == "360 Image") {
                    if (event.ctrlKey) {
                        setPitch(_viewer, 0.5);
                        // if (isCompareMode && compareType == 'potree') {
                        //     setPitch(viewer_2, 0.5);
                        // }
                    } else {
                        if(!isCompareView()) {
                            _sendContext = true;
                            nextPanoImage(_viewer);
                        }
                        
                    }
                }
                break;
            case "ArrowDown":
                if (_currentMode == "Drone Image" || _currentMode == "Phone Image") {
                    _viewer.controls.elDown.click();
                    // if (isCompareMode && compareType == 'potree') {
                    //     viewer_2.controls.elDown.click();
                    // }
                } else if(_currentMode == "360 Video" || _currentMode == "360 Image") {
                    if (event.ctrlKey) {
                        setPitch(_viewer, -0.5);
                        // if (isCompareMode && compareType == 'potree') {
                        //     setPitch(viewer_2, -0.5);
                        // }
                    }
                }
                break;
            case "ArrowLeft":
                if (_currentMode == "Drone Image" || _currentMode == "Phone Image") {
                    _viewer.controls.elLeft.click();
                    // if (isCompareMode && compareType == 'potree') {
                    //     viewer_2.controls.elLeft.click();
                    // }
                } else if(_currentMode == "360 Video" || _currentMode == "360 Image") {
                    setYaw(_viewer, 0.5);
                    // if (isCompareMode && compareType == 'potree') {
                    //     setYaw(viewer_2, 0.5);
                    // }
                }
                break;
            case "ArrowRight":
                if (_currentMode == "Drone Image" || _currentMode == "Phone Image") {
                    _viewer.controls.elRight.click();
                    // if (isCompareMode && compareType == 'potree') {
                    //     viewer_2.controls.elRight.click();
                    // }
                } else if(_currentMode == "360 Video" || _currentMode == "360 Image") {
                    setYaw(_viewer, -0.5);
                    // if (isCompareMode && compareType == 'potree') {
                    //     setYaw(viewer_2, -0.5);
                    // }
                }
                break;
        }
    }

    const setPitch = (viewer, delta) => {
        const startPitch = { p: viewer.scene.view.pitch };
        const endPitch = { p: startPitch.p + delta };
        let tween = new TWEEN.Tween(startPitch).to(endPitch, 500);
        tween.easing(TWEEN.Easing.Quartic.Out);
        tween.onUpdate(() => {
            viewer.scene.view.pitch = startPitch.p;
            _eventHandler(_viewerId, {type: "sync"})
        });
        tween.onComplete(() => {
            viewer.scene.view.pitch = endPitch.p;
            _eventHandler(_viewerId, {type: "sync"})
        });
        tween.start();
    }

    const setYaw = (viewer, delta) => {
        const startYaw = { y: viewer.scene.view.yaw };
        const endYaw = { y: startYaw.y + delta };
        let tween = new TWEEN.Tween(startYaw).to(endYaw, 500);
        tween.easing(TWEEN.Easing.Quartic.Out);
        tween.onUpdate(() => {
            viewer.scene.view.yaw = startYaw.y;
            _eventHandler(_viewerId, {type: "sync"})
        });
        tween.onComplete(() => {
            viewer.scene.view.yaw = endYaw.y;
            _eventHandler(_viewerId, {type: "sync"})
        });
        tween.start();
    }

    const nextPanoImage = () => {
        // console.log("Inside potree utils, next pano image: ", this.viewer);
        if (!(_viewer.scene.images360.length > 0)) {
            return;
        }
        let cameraInstance = _viewer.scene.cameraP;
        const camDir = new THREE.Vector3();
        cameraInstance.getWorldDirection(camDir);
        camDir.normalize();
        const camPos = cameraInstance.position;
        const weightages = { angle: 0.5, distance: 0.5 };
        let totalSum = 10000;
        let curSum;
        let selectedPanoImageId;
        let selectedReality;
        let cameraViewProjectionMatrix;
        let imgPos;
        let dist;
        let angle;
        let frustum;
        const camToImgDir = new THREE.Vector3();
        const maxDist = 10;

        for (const realityKey in _realityLayers ) {
            let reality = _realityLayers[realityKey];
            if (reality.type === "Phone Image" || reality.type === "Drone Image") {
                continue;
            }
            const panoImgs = _viewer.scene.images360[reality.index].images;
            console.log("Potree next pano image:", _viewer.scene.images360[reality.index]);
            for (let i = 0; i < panoImgs.length; i++) {

                if(_viewer.scene.images360[reality.index].focusedImage && panoImgs[i].file == _viewer.scene.images360[reality.index].focusedImage.file) {
                    continue
                }
                imgPos = new THREE.Vector3().fromArray(panoImgs[i].position);
                frustum = new THREE.Frustum();
                cameraViewProjectionMatrix = new THREE.Matrix4();
                cameraInstance.updateMatrixWorld(); // make sure the camera matrix is updated
                // cameraInstance.matrixWorldInverse.getInverse(cameraInstance.matrixWorld);
                cameraInstance.matrixWorldInverse.copy(cameraInstance.matrixWorld).invert();
                cameraViewProjectionMatrix.multiplyMatrices(cameraInstance.projectionMatrix, cameraInstance.matrixWorldInverse);
                frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

                // // if (frustum.containsPoint(imgPos)) {
                    dist = imgPos.distanceTo(camPos);
                    if (dist < maxDist) {
                        camToImgDir.subVectors(imgPos, camPos).normalize();
                        angle = Math.abs(camToImgDir.angleTo(camDir));
                        // tslint:disable-next-line: no-string-literal
                        curSum = (weightages['angle'] * angle) + (weightages['distance'] * dist);
                        if (curSum < totalSum) {
                            selectedPanoImageId = i;
                            selectedReality = reality;
                            totalSum = curSum;
                        }
                    }
                // // }

                    // dist = imgPos.distanceTo(camPos);
                    // if (dist < maxDist) {
                    //     camToImgDir.subVectors(imgPos, camPos).normalize();
                    //     angle = Math.abs(camToImgDir.angleTo(camDir));
                    //     // tslint:disable-next-line: no-string-literal
                    //     // curSum = (weightages['angle'] * angle) + (weightages['distance'] * dist);
                    //     if (angle < totalSum) {
                    //         selectedPanoImageId = i;
                    //         totalSum = angle;
                    //     }
                    // }
            }
        }
        if (selectedPanoImageId != undefined) {
            console.log("Potree next pano image: ", selectedReality, selectedPanoImageId);
            loadImage(selectedReality, _viewer.scene.images360[selectedReality.index].images[selectedPanoImageId]);
            // loadPanoImages(_viewer.scene.images360[selectedRealityIndex].images[selectedPanoImageId], selectedRealityIndex);
        } else {
            console.warn('No Nearest 360 Images');
        }
    }

    const onCameraChange = (event) => {
        // console.log("On Camera change event sync: ", event, _viewerId);
        _eventHandler(_viewerId, {type: "sync"})
    }

    const onMouseEnter = () => {
        // console.log("Inside mouse eneter event potree: ", _viewerId);
        _eventHandler(_viewerId, {type: "mouse"});
    }

    const onZoomHandler = (e) => {
        // console.log("Inside zoom handler: ", e, this.viewerId);
        let fov_delta = e.wheelDelta < 0 ? -5 : 5
        let fov = _viewer.getFOV() + fov_delta;
        if (fov > 10 && fov < 100) {
            _viewer.setFOV(fov);
        }
        _eventHandler(_viewerId, {type: "zoom"})
        // isCompareMode && syncViewers()
    }

    const addEventListeners = () => {
        console.log("potree adding eventlisteners",)
        imageEventListeners();
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('camerachange', onCameraChange);
        document.getElementById(_viewerId).addEventListener('mouseenter', onMouseEnter);
    }

    const removeEventListeners = () => {
        imageEventListeners(true);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('camerachange', onCameraChange);
        let viewerElement =  document.getElementById(_viewerId);
        if (viewerElement) {
            document.getElementById(_viewerId).removeEventListener('mouseenter', onMouseEnter);
        }
    }  

    const removeTasks = () => {
        console.log("Inside remove tasks: ", _taskSpriteMap);
        for(let taskId of Object.keys(_taskSpriteMap)) {
            let annotation = _taskSpriteMap[taskId].tag;
            _viewer.scene.annotations.remove(annotation);
            annotation.dispose();
        }
    }

    const removeIssues = () => {
        console.log("Inside remove issues: ", _issueSpriteMap);
        for(let issueId of Object.keys(_issueSpriteMap)) {
            let annotation = _issueSpriteMap[issueId].tag;
            _viewer.scene.annotations.remove(annotation);
            annotation.dispose();
        }
    }

    const removeAssets = () => {
        // console.log("removeTest Potree inside remove assets2: ", _realityLayers, _viewer.scene.scene.children);

        let childIndex = -1;

        unloadAllImages();
        for(let pointCloud of _viewer.scene.pointclouds) {
            _viewer.scene.scenePointCloud.remove(pointCloud);
        }
        _viewer.scene.pointclouds = [];

        for (const realityKey in _realityLayers ) {
            let reality = _realityLayers[realityKey];
            switch (reality.type) {
                case "Drone Image":
                case "Phone Image":
                    console.log("removeTest inside remove assets2 swicth case : ", reality,  _viewer.scene.scene.children.indexOf(_viewer.scene.orientedImages[reality.index].node));
                    childIndex = _viewer.scene.scene.children.indexOf(_viewer.scene.orientedImages[reality.index].node);
                    if (_viewer.scene.orientedImages[reality.index]) {
                        _viewer.scene.orientedImages[reality.index].images.forEach(image => {
                            _viewer.scene.scene.children[childIndex].remove(image.mesh);
                            _viewer.scene.scene.children[childIndex].remove(image.line);
                         });

                         delete _viewer.scene.orientedImages[reality.index].images;
                        // _viewer.scene.scene.remove(_viewer.scene.scene.children[childIndex]);
                        // _viewer.scene.removeOrientedImages(_viewer.scene.orientedImages[reality.index]);
                     }
                    break;
                case "360 Video":
                case "360 Image":
                    console.log("removeTest inside remove assets2 swicth case : ", reality,  _viewer.scene.scene.children.indexOf(_viewer.scene.images360[reality.index].node));
                    childIndex = _viewer.scene.scene.children.indexOf(_viewer.scene.images360[reality.index].node);
                    if (_viewer.scene.images360[reality.index]) {
                        _viewer.scene.images360[reality.index].images.forEach(image => {
                            _viewer.scene.scene.children[childIndex].remove(image.mesh);
                         });
                        _viewer.scene.scene.children[childIndex].remove(_viewer.scene.images360[reality.index].sphere);

                        delete _viewer.scene.images360[reality.index].images;
                        // delete _viewer.scene.images360[reality.index].sphere;
                        // _viewer.scene.scene.remove(_viewer.scene.scene.children[childIndex]);
                        // _viewer.scene.remove360Images(_viewer.scene.images360[reality.index]);
                     }
                    break;
            }
        }

        let orientedImagesLength = _viewer.scene.orientedImages.length;
        for (let i = 0; i < orientedImagesLength; i++) {
            _viewer.scene.scene.remove(_viewer.scene.orientedImages[i].node);
            _viewer.scene.removeOrientedImages(_viewer.scene.orientedImages[i]);
            delete _viewer.scene.orientedImages[i];
        }
        _viewer.scene.orientedImages = [];

        let image360Length = _viewer.scene.images360.length;
        for (let i = 0; i < image360Length; i++) {
            _viewer.scene.scene.remove(_viewer.scene.images360[i].node);
            _viewer.scene.remove360Images(_viewer.scene.images360[i]);
            delete _viewer.scene.images360[i]
        }
        _viewer.scene.images360 = []

        for (let children of _viewer.scene.scene.children) {
            _viewer.scene.scene.remove(children);
            children = null;
        }
        _viewer.scene.scene.children = []

        if (_viewer.scene.annotations.children && _viewer.scene.annotations.children.length > 0) {
            for(let annotation of _viewer.scene.annotations.children) {
                _viewer.scene.annotations.remove(annotation);
                annotation.dispose();
            }
        }
        // _viewer.scene.annotations = [];

        _realityLayers = {};

        if (_floorMap) {
            removeFloorMap();
        }
        _isPointCloudLoaded = false;
        _imageLoadedOnce = false;
        // _currentLoadedImage = null;
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
        } catch (error) {
            console.log("Error while removing data from potree viewer: ", error);
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
        finishAddTag: finishAddTag,
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