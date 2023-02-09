import * as THREE from "../public/potree/libs/three.js/build/three.module.js";
export class PotreeViewerUtils {
    constructor(viewerId, eventHandler) {
        this.viewerId = viewerId;
        this.viewer = undefined;
        this.realityPositionMap = {};
        this.isPointCloudLoaded = false;
        this.isViewerInitialized = false;
        this.isPendingDataToLoad = false;
        this.isPendingLayersToLoad = false;
        this.eventHandler = eventHandler;

        this.fpContainerId = `fpContainer_${this.viewerId.split("_")[1]}`;
        this.fpCanvasId = `floormap_${this.viewerId.split("_")[1]}`;

        this.floorMap = false;
        window.loop = this.loop;
        window.floorMap = this.floorMap;

        this.createTagTool = false;

        this.measureClickHandler = this.clickHandler.bind(this);
        this.sendContext = false;
        this.addEventListeners();
    }

    isCompareView() {
        if (this.viewerId.split("_")[1] === "1") {
          return false;
        } else {
          return true;
        }
    }

    readyForCompare(mode) {
        if (mode === "Design") {
            if (this.currentMode === "image") {
                this.unloadOrientedImage();
            }
        } else if (mode === "Reality") {

        }
    }

    initialize() {
        // console.log("Inside Potree Initializer: ")
        this.viewer = new Potree.Viewer(document.getElementById(this.viewerId));
        this.viewer.setFOV(60);
        this.viewer.setPointBudget(1 * 1000 * 1000);
        this.viewer.setPointBudget(1 * 1000 * 1000);
        this.viewer.setEDLEnabled(false);
        this.viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
        this.viewer.setDescription(``);
        this.viewer.loadSettingsFromURL();
        this.viewer.canvasId = this.viewerId; //Used by potree
        this.viewer.loadGUI(this.loadGUICallback.bind(this))
    }

    loadGUICallback() {
        // console.log("Inside Potree Initializer Callback: ")
        this.isViewerInitialized = true;
    }

    isViewerLoaded() {
        return this.isViewerInitialized;
    }

    updateData(pointCloudData, floormapData) {
        // console.log("PointCloud data update: ", pointCloudData, floormapData);
        if(pointCloudData.tm) {
            this.tmMatrix = new THREE.Matrix4().fromArray(pointCloudData.tm).transpose();
            this.globalOffset = pointCloudData.offset
        }
        
        this.pointCloudPath = pointCloudData.path

        if(floormapData["Plan Drawings"] && floormapData["Plan Drawings"][0].floormapPath) {
            // this.floorMapTmMatrix = new THREE.Matrix4().fromArray(floorMapData["Plan Drawings"][0].tm).transpose();
            // this.floormapOffset = floorMapData["Plan Drawings"][0].tm.offset
            this.floormapTmPath = floormapData["Plan Drawings"][0].tmPath;
            this.floormapPath = floormapData["Plan Drawings"][0].floormapPath;
        }

        if (this.isViewerInitialized) {
            this.loadData();
        }
    }

    updateLayersData(realityPositionMap, context){
        // console.log("Inside Potree update layers: ", realityPositionMap, context);
        if (context) {
            this.context = context;
        } else {
            this.context = null;
        }
        // console.log("Context: ", this.context)
        this.realityPositionMap = realityPositionMap;
        this.isPendingLayersToLoad = true;
        if (this.isPointCloudLoaded) {
            this.loadLayers();
        }

    }

    loadData() {
        this.removeData();
        this.loadPointCloud();
        // isFloorMap && loadFloormap(viewer.fpContainerId, viewer.fpCanvasId, viewer, pid, tid);
    }

    loadPointCloud() {
        Potree.loadPointCloud(this.pointCloudPath, this.viewerId + '_' + this.viewerId, e => {
            let scene = this.viewer.scene;
            let pointcloud = e.pointcloud;

            let material = pointcloud.material;
            material.size = 1;
            material.pointSizeType = Potree.PointSizeType.FIXED;
            material.shape = Potree.PointShape.SQUARE;
            pointcloud.applyMatrix4(this.tmMatrix);
            const assetPosition = pointcloud.position.clone();
            pointcloud.position.set(assetPosition.x - this.globalOffset[0], assetPosition.y - this.globalOffset[1], assetPosition.z - this.globalOffset[2]);
            scene.addPointCloud(pointcloud);
            this.viewer.fitToScreen();
            // console.log('Point Cloud Loaded');
            this.isPointCloudLoaded = true;
            if (this.isPendingLayersToLoad) {
                this.loadLayers();
            }


        });
    }

    loadLayers() {
        // console.log("Inside Potree load layers: ", this.realityPositionMap);
        // try to handle exterior context swithcing here.
        for (const realityType in this.realityPositionMap) {
            switch (realityType) {
                case "360 Video":
                    this.pointCloudView(true);
                    for(let pathObject of this.realityPositionMap[realityType]) {
                        this.loadSphericalImages(pathObject.position, pathObject.images)
                    }
                    this.currentMode = 'panorama'
                    break;
                case "Drone Image":
                    this.pointCloudView(true);
                    for(let pathObject of this.realityPositionMap[realityType]) {
                        this.loadDroneImages(pathObject.position, pathObject.images);
                    }
                    this.currentMode = 'image'
                    break;

            }
        }
        this.isPendingLayersToLoad = false;
    }

    loadDroneImages(imagePositionsPath, imagesPath) {
        let tmData = { tm: this.tmMatrix, offset: this.globalOffset};
        Potree.OrientedImageLoader.load(imagePositionsPath, imagesPath, this.viewer, tmData).then(images => {
            // console.log("Inside load Drone images: ", this.viewer);
            this.viewer.scene.addOrientedImages(images);
            this.sendContext = false;
            // if (this.context && this.isCompareView()) {
            //     this.maintainContext(this.context);
            // } else
            if (this.context && this.context.type !== "2d") {
                this.updateContext(this.context);
            } else {
                setTimeout(() => {
                    this.viewer.scene.orientedImages[0].moveToImage(this.viewer.scene.orientedImages[0].images[0]);
                }, 2000)
            }
            
            // if (secondary && viewerMode == 'image') {
            //     maintainContext('viewer_1', viewer_1.scene.orientedImages[0].focused);
            //     pointCloudView(true);
            // } else if (!secondary) {
            //     if(inputTag) {
            //         flyToTagContext(inputTag)
            //     } else if (inCamera) {
            //         if (Array.isArray(inCamera.position)) {
            //             inCamera.position = new THREE.Vector3().fromArray(inCamera.position);
            //             inCamera.target = new THREE.Vector3().fromArray(inCamera.target);
            //         }
            //         getNearestImage(viewer,inCamera, 'image')
            //     } else {
            //         viewer.scene.orientedImages[0].moveToImage(viewer.scene.orientedImages[0].images[0]);
            //     }
            // }
        });
    }

    loadSphericalImages(imagePositionsPath, imagesPath, context) {
        // viewerMode = 'panorama'
        let tmData = { tm: new THREE.Matrix4(), offset: this.globalOffset};
        Potree.Images360Loader.load(imagePositionsPath, imagesPath, this.viewer, tmData).then(images => {
            // console.log("Inside load Pano images: ", this.viewer);
            this.viewer.scene.add360Images(images);
            this.sendContext = false;
            // if (this.context && this.isCompareView()) {
            //     this.maintainContext(this.context);
            // } else 
            if (this.context  && this.context.type !== "2d") {
                this.updateContext(this.context);
            } else {
                this.loadPanoImages(this.viewer.scene.images360[0].images[0]);
            }
            this.loadFloormap(imagePositionsPath);
            // if (secondary && viewerMode == 'panorama') {
            //     maintainContext('viewer_1', viewer_1.scene.images360[0].focusedImage);
            //     // pointCloudView(true);viewer_2.navigation.setCameraUpVector(new THREE.Vector3().fromArray([0, 0, 1]));
            // } else if (!secondary){
            //     if(inputTag) {
            //         flyToTagContext(inputTag)
            //     }else if (inCamera) {
            //         getNearestImage(viewer,inCamera, 'panorama')
            //     } else {
            //         viewer.scene.images360[0].focus(viewer.scene.images360[0].images[0]);
            //     }
            // }
        });
    }

    handleContext(context) {
        switch (context.type) {
            case "3d":
            case "image":
            case "panorama":
                this.goToContext(context);
                break;
            case "360 Video":
                this.goToImageContext(context);
                break;
            case "tag":
                this.goToTagContext(context.tag);
                break;
        }
    }

    getCurrentImage() {
        if(this.currentMode == "image") {
            return this.viewer.scene.orientedImages[0].focused;
        } else if (this.currentMode == "panorama") {
            return this.viewer.scene.images360[0].focusedImage;
        }
    }

    // maintainContext(context) {
    //     console.log("Inside new maintain context: ", context);
    //     if (context) {
    //         this.context = this.getContextLocalFromGlobal(context);
    //     } else {
    //         this.context = null;
    //         return;
    //     }

    //     let position = this.context.image ? this.context.image.imagePosition : this.context.cameraObject.cameraPosition;

    //     let nearestImage = this.getNearestImageToPosition(context.type, position);
    //     console.log("Inside new maintain context: ", context, nearestImage);
    //     if(nearestImage && this.context.type === "image") {
    //         this.viewer.scene.orientedImages[0].moveToImage(nearestImage, false);
    //     } else if (nearestImage && this.context.type === "panorama") {
    //         this.viewer.scene.images360[0].focus(nearestImage, false);
    //     }
    // }

    loadOrientedImages(image) {
        if (this.currentLoadedImage === image.id) {
            return;
        }
        setTimeout(() => {
            this.viewer.scene.orientedImages[0].moveToImage(image);
        }, 2000);
    }

    unloadOrientedImage() {
        if(this.viewer.controls.elExit) {
            this.viewer.controls.elExit.click();
        }
        
    }

    loadPanoImages(image, cameraInfo = null) {
        if (this.currentLoadedImage === image.file.split('/').pop()) {
            return;
        }
        if (cameraInfo == null) {
            this.viewer.scene.images360[0].focus(image);
        } else {
            this.viewer.scene.images360[0].focus(image, true, cameraInfo);
        }
        
    }


    getNearestImageToPosition(type, position) {
        // console.log("Inside new nearest image to position: ", type, position)
        let nearestImage = null;
        let nearestImageDist = 10000; 
        if (type === 'image') {
            this.viewer.scene.orientedImages[0].images.forEach( image => {
                let curDist = image.position.distanceTo(position);
                if (curDist < nearestImageDist) {
                    nearestImageDist = curDist;
                    nearestImage = image;
                }
            });
            if (nearestImage) {
                return nearestImage;
            }
        } else if (type === 'panorama') {
            let inputPos = new THREE.Vector2().fromArray([position.x, position.y]);
            this.viewer.scene.images360[0].images.forEach( pano => {
                let curPos = new THREE.Vector2().fromArray([pano.position[0], pano.position[1]]);
                let curDist = curPos.distanceTo(inputPos);
                if (curDist < nearestImageDist) {
                    nearestImageDist = curDist;
                    nearestImage = pano;
                }
            });
            if (nearestImage) {
                return nearestImage;
            }
        }
    }

    getNearestImageToCamera(cameraInfo, mode) {
        // console.log("Inside potree utils, getNearestImage: ", cameraInfo);
        let nearestImage = null;
        let nearestImageDist = 10000;
        if (mode == 'image' || mode == '3d') {
            // if (Array.isArray(cameraInfo.position)) {
            //     cameraInfo.position = new THREE.Vector3().fromArray(cameraInfo.position);
            //     cameraInfo.target = new THREE.Vector3().fromArray(cameraInfo.target);
            // } 

            // const cameraPosition = {
            //     x: cameraInfo.position[0],
            //     y: cameraInfo.position[1],
            //     z: cameraInfo.position[2],
            // }

            this.viewer.scene.orientedImages[0].images.forEach( image => {
                let curDist = image.position.distanceTo(cameraInfo.cameraPosition);
                // console.log("Current distance Pano: ", curDist , cameraInfo.position, image.position)
                if (curDist < nearestImageDist) {
                    nearestImageDist = curDist;
                    nearestImage = image;
                }
            });
            if (nearestImage) {
                console.log(nearestImage.id)
                this.loadOrientedImages(nearestImage)
            }
        } else {
            // const cameraPosition = {
            //     x: cameraInfo.position[0],
            //     y: cameraInfo.position[1],
            //     z: cameraInfo.position[2],
            // }
            let inputPos = new THREE.Vector2().fromArray([cameraInfo.cameraPosition.x, cameraInfo.cameraPosition.y]);
            this.viewer.scene.images360[0].images.forEach( pano => {
                let curPos = new THREE.Vector2().fromArray([pano.position[0], pano.position[1]]);
                let curDist = curPos.distanceTo(inputPos);
                // console.log("Current distance Pano: ", curDist , inputPos, curPos)
                if (curDist < nearestImageDist) {
                    nearestImageDist = curDist;
                    nearestImage = pano;
                }
            });
            if (nearestImage) {
                console.log(nearestImage.file)
                this.loadPanoImages(nearestImage, cameraInfo)
            }
        }
    }

    getNearestImage(context) {
        // console.log("Inside getNearest Image: ", context, this.currentMode);
        if(context.type == "image") {
            let nearestImage = null;
            let nearestImageDist = 10000;
            // const imagePosition = {
            //     x: context.image.position[0],
            //     y: context.image.position[1],
            //     z: context.image.position[2],
            // }
            this.viewer.scene.orientedImages[0].images.forEach( image => {
                let curDist = image.position.distanceTo(context.image.imagePosition);
                if (curDist < nearestImageDist) {
                    nearestImageDist = curDist;
                    nearestImage = image;
                }
            });
            if (nearestImage) {
                console.log(nearestImage.id)
                this.loadOrientedImages(nearestImage)

            }
        } else {
            let nearestImage = null;
            let nearestImageDist = 10000;
            // const imagePosition = {
            //     x: context.image.position[0],
            //     y: context.image.position[1],
            //     z: context.image.position[2],
            // }
            this.viewer.scene.images360[0].images.forEach( pano => {
                let curPos = new THREE.Vector2().fromArray([pano.position[0], pano.position[1]]);
                let curDist = curPos.distanceTo(context.image.imagePosition);
                if (curDist < nearestImageDist) {
                    nearestImageDist = curDist;
                    nearestImage = pano;
                }
            });
            if (nearestImage) {
                console.log(nearestImage.file)
                this.loadPanoImages(nearestImage)
            }
        }
    }

    goToContext(context) {
        // console.log("Inside potree utils, going to context: ", context);

        if (context.image) {
            this.getNearestImage(context);
        } else if (context.type === "image" || context.type === "panorama") {
            this.getNearestImageToCamera(context.cameraObject, context.type)
        } else if (context.type === "3d") {
            this.viewer.scene.view.setView(context.cameraObject.cameraPosition, context.cameraObject.cameraTarget)
        }
    }

    goToImage(imageName, cameraWithOffset) {
        // console.log("Inside potree utils, going to image: ", imageName);
        if (this.currentMode == 'panorama') {
            this.viewer.scene.images360[0].images.forEach(image => {
                if (image.file.split('/').pop() == imageName) {
                    this.loadPanoImages(image, cameraWithOffset)
                }
            })
        } else {
            this.viewer.scene.orientedImages[0].images.forEach( image => {
                if (image.id == imageName) {
                    this.loadOrientedImages(image)
                }
            });
        }
    }

    goToImageContext(context) {
        // console.log("Inside potree utils, going to image task: ", context);

        this.goToImage(context.image.imageName, context.cameraObject);
    }

    // goToTask(info) {
    //     console.log("Inside potree utils, going to task: ", info);
    //     let offset = this.globalOffset
    //     let targetValue = info.target ? info.target : info.position;
    //     let inCamera_withOffset = {
    //         position: new THREE.Vector3().fromArray([info.position.x-offset[0], info.position.y-offset[1], info.position.z-offset[2]]),
    //         target: new THREE.Vector3().fromArray([targetValue.x-offset[0], targetValue.y-offset[1], targetValue.z-offset[2]]),
    //         // pitch: info.rotation ? info.rotation.pitch : null,
    //         // yaw: info.rotation ? info.rotation.yaw : null
    //     }
    //     if (info.image) {
    //         // isMouseOnV1 = true;
    //         this.tagToAddOnImageLoad = {
    //             'info': info,
    //             'viewer': this.viewer
    //         }

    //         this.goToImage(info.imageName, inCamera_withOffset);
    //     } else if (isExterior) {
    //         console.log('Load 3d tags')
    //         // viewer_1.controls.elExit.click();
    //         if (this.viewer.cur_loaded_image) {
    //             this.viewer.controls.elExit.click();
    //         }
    //         setTimeout((() => {
    //             if (this.viewer.tileset == info.tileset) {
    //                 // isMouseOnV1 = true; 
    //                 this.goToContext(info.camera)
    //                 this.addTag(info, viewer_1)
    //             }
    //         }).bind(this), 1000)
    //     }
    // }

    getContextLocalFromGlobal(globalContext) {
        // console.log("Global offset: ", globalContext, this.globalOffset);
        let context = structuredClone(globalContext);
        let offset = this.globalOffset;
        if(context.image && context.image.imagePosition) {
            // console.log("Context has image: ", context.image);
            let pos = context.image.imagePosition;
            context.image.imagePosition = {
                x: pos.x - offset[0], 
                y: pos.y - offset[1], 
                z: pos.z - offset[2]
            }
        }

        if (context.cameraObject && context.cameraObject.cameraPosition) {
            // console.log("Context has camera: ", context.cameraObject);
            let pos = context.cameraObject.cameraPosition;
            let tar = context.cameraObject.cameraTarget ? context.cameraObject.cameraTarget : context.cameraObject.cameraPosition;
            context.cameraObject.cameraPosition = {
                x: pos.x - offset[0], 
                y: pos.y - offset[1], 
                z: pos.z - offset[2]
            }
            context.cameraObject.cameraTarget = {
                x: tar.x - offset[0], 
                y: tar.y - offset[1], 
                z: tar.z - offset[2]
            }
            // console.log("Inside context has camera : ", context);
        }

        if (context.tag && context.tag.tagPosition) {
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

    getContext(justLoadedImage = null){
        let context = undefined;
        // console.log("Inside potree getcamera: ", this.viewerId, this.isPointCloudLoaded, justLoadedImage, this.currentLoadedImage);
        if (this.isPointCloudLoaded) {
            let camObject = undefined;
            let imageObject = undefined;
            let pos = this.viewer.scene.view.position;
            let tar = this.viewer.scene.view.getPivot();
            let offset = this.globalOffset
            camObject = {
                cameraPosition: {x: pos.x+offset[0], y: pos.y+offset[1], z: pos.z+offset[2]},
                cameraTarget: {x: tar.x+offset[0], y: tar.y+offset[1], z: tar.z+offset[2]},
                pitch: this.viewer.scene.view.pitch,
                yaw: this.viewer.scene.view.yaw,
                fov: this.viewer.getFOV()
            }

            context = {
                type: this.currentMode,
                cameraObject: camObject,
            }

            if (this.currentMode == "image" && this.viewer.scene.orientedImages[0]) {
                let imagePosition;
                let name;
                if (justLoadedImage != null) {
                    imagePosition = justLoadedImage.position;
                    name = justLoadedImage.id
                } else if(this.currentLoadedImage != null) {
                    this.viewer.scene.orientedImages[0].images.forEach( image => {
                        if(image.id === this.currentLoadedImage) {
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
            } else if (this.currentMode == "panorama" && this.viewer.scene.images360[0]) {
                let imagePosition;
                let name;
                if (justLoadedImage != null) {
                    imagePosition = justLoadedImage.position;
                    name = justLoadedImage.file.split('/').pop();
                } else if(this.currentLoadedImage != null) {
                    this.viewer.scene.images360[0].images.forEach( image => {
                        if(image.file.split('/').pop() === this.currentLoadedImage) {
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

    updateContext(context) {
        this.sendContext = false;
        console.log("Inside update context potree: ", this.sendContext);
        if (context) {
            this.context = this.getContextLocalFromGlobal(context);
        } else {
            this.context = null;
        }
        this.handleContext(this.context);
    }

    getViewerState() {
        let viewerState;
        let pos = this.viewer.scene.view.position.toArray();
        viewerState =  {
            position: [pos[0], pos[1], pos[2]],
            target: this.viewer.scene.view.getPivot(),
            fov: this.viewer.fov,
        }
        if (this.currentMode === "panorama") {
            viewerState.pitch =  this.viewer.scene.view.pitch;
            viewerState.yaw = this.viewer.scene.view.yaw;
            viewerState.fov = this.viewer.fov;
        }
        
            
        // console.log("Inside Potree get ViewerState: ", viewerState)
        return viewerState;
    }

    updateViewerState(viewerState) {
        // console.log("Inside update viewer state: ", this.viewerId, viewerState);
        if (this.currentMode === "3d") {
            // console.log("Inside set viewer state for 3D: ", this.viewerId)
            
            this.viewer.scene.view.position.set(viewerState.position[0],viewerState.position[1],viewerState.position[2]);
            this.viewer.scene.view.lookAt(viewerState.target);
            if(viewerState.fov) {
                // this.viewer.setFOV(viewerState.fov);
            }
            
        } else if (this.currentMode === "panorama" && viewerState.pitch){
            this.viewer.scene.view.pitch = viewerState.pitch;
            this.viewer.scene.view.yaw = viewerState.yaw
            if(viewerState.fov) {
                this.viewer.setFOV(viewerState.fov);
            }
        }
    }

    onCameraChange(event) {
        // console.log("On Camera change event: ", event);
        this.eventHandler(this.viewerId, {type: "sync"})
    }

    nextPanoImage() {
        // console.log("Inside potree utils, next pano image: ", this.viewer);
        if (!(this.viewer.scene.images360.length > 0)) {
            return;
        }
        let cameraInstance = this.viewer.scene.cameraP;
        const camDir = new THREE.Vector3();
        cameraInstance.getWorldDirection(camDir);
        camDir.normalize();
        const camPos = cameraInstance.position;
        const weightages = { angle: 0.5, distance: 0.5 };
        let totalSum = 10000;
        let curSum;
        let selectedPanoImageId;
        let cameraViewProjectionMatrix;
        let imgPos;
        let dist;
        let angle;
        let frustum;
        const camToImgDir = new THREE.Vector3();
        const maxDist = 10;
        const panoImgs = this.viewer.scene.images360[0].images;

        for (let i = 0; i < panoImgs.length; i++) {

            if(panoImgs[i].file == this.viewer.scene.images360[0].focusedImage.file) {
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
        if (selectedPanoImageId != undefined) {
            this.loadPanoImages(panoImgs[selectedPanoImageId]);
        } else {
            console.warn('No Nearest 360 Images');
        }
    }

    pointCloudView(cond) {
        this.viewer.setEDLEnabled(cond);
        if (cond) {
            this.viewer.setEDLOpacity(0);
        } else {
            this.viewer.setEDLOpacity(1);
        }
    }

    addTag(inData, viewer){
        if(inData.type == 'Point') {
            let measure = new Potree.Measure();
            measure.showDistances = false;
            measure.showCoordinates = true;
            measure.maxMarkers = 1;
            measure.addMarker(new THREE.Vector3().fromArray(inData.points[0]));
            viewer.scene.addMeasurement(measure);
        } else if (inData.type == 'Distance') {
            let measure = new Potree.Measure();
            measure.closed = false;
            inData.points.forEach(point => {
                measure.addMarker(new THREE.Vector3().fromArray(point))
            })
            viewer.scene.addMeasurement(measure);
        } else if (inData.type == 'Area') {
            let measure = new Potree.Measure();
            measure.name = "Area";
            measure.closed = true;
            measure.showArea = true;
            inData.points.forEach(point => {
                measure.addMarker(new THREE.Vector3().fromArray(point))
            })
            viewer.scene.addMeasurement(measure);
        } else if (inData.type == 'Height') {
            let measure = new Potree.Measure();
            measure.name = "Tree Height";
            measure.closed = false;
            measure.showDistances = false;
            measure.showHeight = true;
            inData.points.forEach(point => {
                measure.addMarker(new THREE.Vector3().fromArray(point))
            })					
            viewer.scene.addMeasurement(measure);
        }
    }

    onOrientedImageLoad(event) {
        if(event.detail.viewer !== this.viewerId) {
            return;
        }
        // console.log("Inside Oriented Image Load: ", this.viewerId, event, this.sendContext);

        this.viewer.scene.removeAllMeasurements();
        this.currentMode = 'image';
        this.currentLoadedImage = event.detail.image.id;
        this.pointCloudView(true);


        if(this.sendContext) {
            this.sendContext = false;
            this.eventHandler(event.detail.viewer, this.getContext(event.detail.image));
        }
        this.sendContext = true;
        // if (this.context == null && event.detail.viewer === this.viewerId) {
        //     console.log("Inside event handler trigger, ", this.viewerId, event.detail.viewer);
        //     this.eventHandler(event.detail.viewer, this.getContext(event.detail.image));
        //         // this.eventHandler(
        //         //     event.detail.viewer, 
        //         //     {
        //         //         type: "context", 
        //         //         context:this.getContext(event.detail.image)
        //         //     });
        // } else {
        //     console.log("Inside removeing any old context, ", this.viewerId, event.viewer, this.context);
        //     this.context = null;
        // }

        
        setTimeout((() => {
            if (this.tagToAddOnImageLoad != null) {
                console.log('Adding Tag')
                console.log(tagToAddOnImageLoad['info'])
                this.addTag(tagToAddOnImageLoad['info'], tagToAddOnImageLoad['viewer'])
                tagToAddOnImageLoad = null;
            }
        }).bind(this), 100)
    }

    onOrientedImageUnload(event) {
        if(event.detail.viewer !== this.viewerId) {
            return;
        }
        // console.log("Inside Oriented Image Unload: ", event);
        this.viewer.scene.removeAllClipVolumes(); // To remove hovered image
        this.viewer.scene.removeAllMeasurements();
        this.viewer.currentLoadedImage = null;

        this.viewer.fitToScreen();
        this.pointCloudView(false);
        this.currentMode = '3d';

        // if (this.context == null && event.detail.viewer === this.viewerId) {
        //     this.eventHandler(
        //         event.detail.viewer,
        //         {
        //             type: "context", 
        //             context:this.getContext(event.detail.image)
        //         });
        // } else {
        //     this.context = null;
        // }
    }

    onPanoImageLoad = (event) => {
        console.log("Inside Pano Image Load: ", event, this.viewer, this.context);
        if(event.detail.viewer !== this.viewerId) {
            return;
        }
        console.log("Inside Pano Image Load: ", event, this.viewer, this.context);

        this.currentMode = 'panorama';
        this.viewer.renderArea.addEventListener('mousewheel', this.zoomHandler.bind(this));
        this.viewer.scene.removeAllMeasurements();
        this.viewer.currentLoadedImage = event.detail.image.file.split('/').pop();

        this.pointCloudView(true);

        if (event.detail.viewer === this.viewerId) {
            this.toggleFloorMap(this.viewer, true);
        }

        if(this.sendContext) {
            this.sendContext = false;
            this.eventHandler(event.detail.viewer, this.getContext(event.detail.image));
        }
        

        // if (this.context == null && event.detail.viewer === this.viewerId) {
        //     console.log("Inside event handler trigger, ", this.viewerId, event.detail.viewer);
        //     // this.eventHandler(event.detail.viewer, this.getContext(event.detail.image));
        //     // setTimeout((() => {
        //         // this.eventHandler(
        //         //     event.detail.viewer,
        //         //     {
        //         //         type: "context", 
        //         //         context:this.getContext(event.detail.image)
        //         //     });
        //     // }).bind(this), 2000)
        // } else {
        //     console.log("Inside removeing any old context, ", this.viewerId, event.viewer, this.context);
        //     this.context = null;
        // }
        
        setTimeout((() => {
            if (this.tagToAddOnImageLoad != null) {
                console.log('Adding Tag');
                console.log(tagToAddOnImageLoad['info']);
                this.addTag(tagToAddOnImageLoad['info'], tagToAddOnImageLoad['viewer']);
                tagToAddOnImageLoad = null;
            }
        }).bind(this), 100)
    }

    onPanoImageUnload(event) {
        if(event.detail.viewer !== this.viewerId) {
            return;
        }
        // console.log("Inside Pano Image Unload: ", event);
        this.viewer.currentLoadedImage = null;
        this.viewer.scene.removeAllMeasurements();
        this.viewer.renderArea.removeEventListener('mousewheel', this.zoomHandler.bind(this));

        this.viewer.fitToScreen();
        this.pointCloudView(false);


        if (event.detail.viewer === this.viewerId) {
            this.toggleFloorMap(this.viewer, false);
        }
        this.currentMode = '3d';

        // if (this.context == null && event.detail.viewer === this.viewerId) {
        //     this.eventHandler(
        //         event.detail.viewer,
        //         {
        //             type: "context", 
        //             context:this.getContext(event.detail.image)
        //         });
        // } else {
        //     this.context = null;
        // }
    }

    zoomHandler = (e) => {
        // console.log("Inside zoom handler: ", e, this.viewerId);
        let fov_delta = e.wheelDelta < 0 ? -5 : 5
        let fov = this.viewer.getFOV() + fov_delta;
        if (fov > 10 && fov < 100) {
            this.viewer.setFOV(fov);
        }
        this.eventHandler(this.viewerId, {type: "zoom"})
        // isCompareMode && syncViewers()
    }

    onKeyDown(event) {
        if(!this.viewer.controls) {
            return;
        }
        // console.log("Inside Key down listener: ", event);
        switch (event.key) {
            case "Escape":
                if (this.currentMode == "image") {
                    this.viewer.controls.elExit.click();
                } else {
                    
                }
                break;
            case "ArrowUp":
                if (this.currentMode == "image") {
                    this.viewer.controls.elUp.click();
                    // if (isCompareMode && compareType == 'potree') {
                    //     viewer_2.controls.elUp.click();
                    // }
                } else if(this.currentMode == "panorama") {
                    if (event.ctrlKey) {
                        this.setPitch(this.viewer, 0.5);
                        // if (isCompareMode && compareType == 'potree') {
                        //     setPitch(viewer_2, 0.5);
                        // }
                    } else {
                        // if(!this.isCompareView()) {
                            this.sendContext = true;
                            this.nextPanoImage(this.viewer);
                        // }
                        
                    }
                }
                break;
            case "ArrowDown":
                if (this.currentMode == "image") {
                    this.viewer.controls.elDown.click();
                    // if (isCompareMode && compareType == 'potree') {
                    //     viewer_2.controls.elDown.click();
                    // }
                } else if(this.currentMode == "panorama") {
                    if (event.ctrlKey) {
                        this.setPitch(this.viewer, -0.5);
                        // if (isCompareMode && compareType == 'potree') {
                        //     setPitch(viewer_2, -0.5);
                        // }
                    }
                }
                break;
            case "ArrowLeft":
                if (this.currentMode == "image") {
                    this.viewer.controls.elLeft.click();
                    // if (isCompareMode && compareType == 'potree') {
                    //     viewer_2.controls.elLeft.click();
                    // }
                } else if(this.currentMode == "panorama") {
                    this.setYaw(this.viewer, 0.5);
                    // if (isCompareMode && compareType == 'potree') {
                    //     setYaw(viewer_2, 0.5);
                    // }
                }
                break;
            case "ArrowRight":
                if (this.currentMode == "image") {
                    this.viewer.controls.elRight.click();
                    // if (isCompareMode && compareType == 'potree') {
                    //     viewer_2.controls.elRight.click();
                    // }
                } else if(this.currentMode == "panorama") {
                    this.setYaw(this.viewer, -0.5);
                    // if (isCompareMode && compareType == 'potree') {
                    //     setYaw(viewer_2, -0.5);
                    // }
                }
                break;
        }
    }

    setPitch(viewer, delta) {
        const startPitch = { p: viewer.scene.view.pitch };
        const endPitch = { p: startPitch.p + delta };
        let tween = new TWEEN.Tween(startPitch).to(endPitch, 500);
        tween.easing(TWEEN.Easing.Quartic.Out);
        tween.onUpdate(() => {
            viewer.scene.view.pitch = startPitch.p;
            this.eventHandler(this.viewerId, {type: "sync"})
        });
        tween.onComplete(() => {
            viewer.scene.view.pitch = endPitch.p;
            this.eventHandler(this.viewerId, {type: "sync"})
        });
        tween.start();
    }

    setYaw(viewer, delta) {
        const startYaw = { y: viewer.scene.view.yaw };
        const endYaw = { y: startYaw.y + delta };
        let tween = new TWEEN.Tween(startYaw).to(endYaw, 500);
        tween.easing(TWEEN.Easing.Quartic.Out);
        tween.onUpdate(() => {
            viewer.scene.view.yaw = startYaw.y;
            this.eventHandler(this.viewerId, {type: "sync"})
        });
        tween.onComplete(() => {
            viewer.scene.view.yaw = endYaw.y;
            this.eventHandler(this.viewerId, {type: "sync"})
        });
        tween.start();
    }

    onMouseEnter() {
        // console.log("Inside mouse eneter event potree: ");
        this.eventHandler(this.viewerId, {type: "mouse"});
    }

    addEventListeners() {
        // this.viewer.addEventListener('mouseenter', () => {
        //     isMouseOnV1 = true;
        // });
        // document.getElementById('viewer_2').addEventListener('mouseenter', () => {
        //     isMouseOnV1 = false;
        // });
        document.addEventListener('imageLoad',this.onOrientedImageLoad.bind(this));
        document.addEventListener('imageUnload',this.onOrientedImageUnload.bind(this));
        document.addEventListener('panoLoad',this.onPanoImageLoad.bind(this));
        document.addEventListener('panoUnload',this.onPanoImageUnload.bind(this));
        document.getElementById(this.viewerId).addEventListener('keydown', this.onKeyDown.bind(this));
        document.getElementById(this.viewerId).addEventListener('camerachange', this.onCameraChange.bind(this));
        document.getElementById(this.viewerId).addEventListener('mouseenter', this.onMouseEnter.bind(this));
    }

    removeEventListeners() {
        document.removeEventListener('imageLoad',this.onOrientedImageLoad.bind(this));
        document.removeEventListener('imageUnload',this.onOrientedImageUnload.bind(this));
        document.removeEventListener('panoLoad',this.onPanoImageLoad.bind(this));
        document.removeEventListener('panoUnload',this.onPanoImageUnload.bind(this));

        let viewerElement = document.getElementById(this.viewerId);
        if (viewerElement) {
            viewerElement.removeEventListener('keydown', this.onKeyDown.bind(this));
            viewerElement.removeEventListener('camerachange', this.onCameraChange.bind(this));
            // viewerElement.removeEventListener('mouseenter', this.onMouseEnter.bind(this));
        }
        
       
    }   

    loadFloormap(imagePositionsPath) {
        if (!this.floormapPath) {
            console.log("No floormap available:");
            return;
        }

        let base_image = new Image();
        base_image.src = this.floormapPath;
        // return new Promise((resolve, reject) => {
        let fpCanvas = document.getElementById(this.fpCanvasId);
        let fpContainer = document.getElementById(this.fpContainerId);
        let viewerDiv = document.getElementById(this.viewer.canvasId);
        fpContainer.style.display = this.currentMode === 'panorama' ? 'block' : 'none';

        this.viewer.floorMap = {}
        this.viewer.floorMap.canvas = fpCanvas;
        this.viewer.floorMap.container = fpContainer;
        this.viewer.floorMap.div = viewerDiv;
        this.viewer.floorMap.coverage = 0.25;
        

        base_image.onload = async () => {
            this.viewer.floorMap.image = base_image;
            this.updateFPSize(this.viewer.floorMap);

            let fpMarix = new THREE.Matrix4().set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            let fpOffset = [0, 0, 0];
            const tm_json_raw = await fetch(this.floormapTmPath);
            if (tm_json_raw.status == 200) {
                const tm_json = JSON.parse(await tm_json_raw.text());
                if (tm_json.tm) {
                    fpMarix = new THREE.Matrix4().fromArray(tm_json.tm).transpose();
                    console.log('FP TM Loaded');
                }
                this.viewer.floorMap.tm = fpMarix;

                if (tm_json.offset) {
                    fpOffset = tm_json.offset;
                }
                this.viewer.floorMap.offset = fpOffset;
            }
            
            const indoor_images_raw = await fetch(`${imagePositionsPath}`);
            // const indoor_images_raw = await fetch(`http://localhost:1234/indoor_images_15_17_48_66.json`);
            if (indoor_images_raw.status == 200) {
                const indoor_images = JSON.parse(await indoor_images_raw.text());
                console.log('Indoor Images Loaded');
                this.loadIcons(indoor_images, fpMarix, base_image, fpCanvas, fpContainer, this.viewer.floorMap, this.viewer.canvasId);
                this.addUserLocation('https://dtwin-viewers.s3.ap-south-1.amazonaws.com/icons/fp_user.png', this.viewer); // Update Required
                this.viewer.floorMap.images = indoor_images;
            }
            this.floorMap = true;
            // requestAnimationFrame(this.loop.bind(this));
        }
        fpContainer.addEventListener("click",  (e) => {
            const clickData = JSON.parse(e.target.getAttribute('data'));
            // console.log("Inside fp click: ", e, clickData, this.viewerId);
            
            if (clickData.id === this.viewerId && this.viewer.scene.images360[0]) {
                this.viewer.scene.images360[0].images.forEach( pano => {
                    if (pano.file.split('/').pop() == clickData.name) {
                        this.sendContext = true;
                        this.loadPanoImages(pano);
                    }
                });
            }
            // console.log(clickData.name);
        });
        
    }

    toggleFloorMap(cond) {
        let fpContainer = document.getElementById(this.fpContainerId);
        fpContainer.style.display = cond ? 'block' : 'none';
    }

    loadIcons(inData, tm, fpImage, fpCanvas, fpContainer, fpStoreData, id) {
        let iconSize = 0.05;
        fpStoreData.icons = [];
        // console.log("Loading fp icons: ", fpCanvas);
        Object.keys(inData).forEach(imageName => {
            const cur_image_pos = inData[imageName].position
            const pixelCoords = this.worldToimage([cur_image_pos[0], cur_image_pos[1], cur_image_pos[2]], tm);
            const screenCoords = this.imageToScreen(pixelCoords, fpImage, fpCanvas);
            let icon = document.createElement('span');
            icon.setAttribute('class', 'panoIcon');
            // icon.setAttribute('class', 'absolute inline-block w-1 h-1 z-100 bg-lime-500 rounded-full opacity-70 hover:opacity-100 hover:cursor-pointer hover:bg-sky-600');
            icon.setAttribute('data', JSON.stringify({name: imageName, id: id}));
            // icon.style.display = "inline-block";
            icon.style.width = (fpCanvas.width * iconSize) + 'px';
            icon.style.height = (fpCanvas.width * iconSize) + 'px';
            icon.style.top = (screenCoords[1] - 5) + 'px';
            icon.style.left = (screenCoords[0] - 5) + 'px';
            fpContainer.appendChild(icon);
            fpStoreData.icons.push(icon);
        });
    }

    addUserLocation(path, viewer) {
        let base_image = new Image();
        base_image.src = path;
        return new Promise((resolve, reject) => {
        base_image.onload = (() => {
            base_image.setAttribute('class', 'userIcon');
            // base_image.setAttribute('class', 'absolute z-1000 w-6 h-6');
            this.viewer.floorMap.userIcon = base_image;
            this.viewer.floorMap.container.appendChild(base_image);
            }).bind(this)
        });
    }

    calAngle(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        return (theta-90) + 180;
        // return 90 - theta;
    }

    updateUserLocation() {
        try {
        if(this.viewer.floorMap.offset) {
            let curView = this.viewer.scene.view;
            const position = curView.position.toArray();
            position[0] += this.viewer.floorMap.offset[0];
            position[1] += this.viewer.floorMap.offset[1];
            position[2] += this.viewer.floorMap.offset[2];
            const pixelCoordsOffset = this.worldToimage(position, this.viewer.floorMap.tm);
            const screenCoords = this.imageToScreen(pixelCoordsOffset, this.viewer.floorMap.image, this.viewer.floorMap.canvas);
            this.viewer.floorMap.userIcon.style.left = ((screenCoords[0]) - (this.viewer.floorMap.userIcon.width / 2) + 5) + 'px';
            this.viewer.floorMap.userIcon.style.top = ((screenCoords[1]) - (this.viewer.floorMap.userIcon.height / 2) + 5) + 'px';
            const camTarget = (new THREE.Vector3().addVectors(curView.position, curView.direction.multiplyScalar(1))).toArray();
            camTarget[0] += this.viewer.floorMap.offset[0];
            camTarget[1] += this.viewer.floorMap.offset[1];
            camTarget[2] += this.viewer.floorMap.offset[2];
            const camTargetPixel = this.worldToimage(camTarget, this.viewer.floorMap.tm);
            const angle = this.calAngle(pixelCoordsOffset[0], pixelCoordsOffset[1], camTargetPixel[0], camTargetPixel[1]);
            this.viewer.floorMap.userIcon.style.transform = 'rotate(' + angle + 'deg)';
        }
    } catch {
        console.log("Time sync issue: with request animation frame");
    }
    }

    worldToimage(coords, intm) {
        const a = new THREE.Vector4(coords[0], coords[1], coords[2], 1);
        a.applyMatrix4(intm);
        return [Math.ceil(a.x), Math.ceil(a.y)]
    }

    imageToScreen(pix, image, canvas) {
        const pxx = (pix[0] * canvas.width) / image.naturalWidth;
        const pyy = (pix[1] * canvas.height) / image.naturalHeight;
        return [pxx, pyy]
    }

    resizeFP(image, fpCanvas, v, coverage) {
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

    updateFPSize(fpData) {
        // console.log(fpData);
        this.resizeFP(fpData.image, fpData.canvas, fpData.div, fpData.coverage);
        let context = fpData.canvas.getContext('2d');
        context.drawImage(fpData.image, 0, 0, fpData.canvas.width, fpData.canvas.height);
        if (fpData.icons) {
            this.updateFpIcons(fpData);
        }
    }

    updateFpIcons(fpInfo) {
        let iconSize = 0.02
        Object.keys(fpInfo.images).forEach((imageName, index) => {
            const cur_image_pos = fpInfo.images[imageName].position
            const pixelCoords = this.worldToimage(cur_image_pos, fpInfo.tm);
            const screenCoords = this.imageToScreen(pixelCoords, fpInfo.image, fpInfo.canvas);
            let icon = fpInfo.icons[index];
            icon.style.width = (fpInfo.canvas.width * iconSize) + 'px';
            icon.style.height = (fpInfo.canvas.width * iconSize) + 'px';
            icon.style.top = (screenCoords[1] - 5) + 'px';
            icon.style.left = (screenCoords[0] - 5) + 'px';
        });
    }

    updateFloormapAnimation() {
        if (this.floorMap) {
            this.updateUserLocation();
        }
    }

    // loop(timestamp){
    //     // syncViewers();
    //     requestAnimationFrame(this.loop.bind(this));
    //     if (this.floorMap) {
    //         this.updateUserLocation();
    //     }
    // }

    activateCreateTagTool() {
        this.createTagTool = true;
        
        setTimeout((() => {
            this.viewer.renderArea.addEventListener('click',  this.measureClickHandler)
        }).bind(this), 1)
        return true;
    }

    deactivateCreateTagTool() {
        this.createTagTool = false;
        return false;
    }  

    initiateAddTag(type) {
        this.tagType = type;
        this.isAddTagActive = this.activateCreateTagTool();
    }

    clickHandler = (event) => {
        const raycaster = new THREE.Raycaster();
        let pickedObject = undefined;

        const rect = this.viewer.renderArea.getBoundingClientRect();
        let pos = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        

        // const pos = this.getCanvasRelativePosition(event);
        let pickPosition = { x: 0, y: 0 };
        pickPosition.x = (pos.x / this.viewer.renderArea.clientWidth) * 2 - 1;
        pickPosition.y = (pos.y / this.viewer.renderArea.clientHeight) * -2 + 1;  // note we flip Y

        raycaster.setFromCamera(pickPosition, this.viewer.scene.cameraP);
        let objs = this.currentMode == 'image' ? this.viewer.scene.scene.children : [this.viewer.scene.scene.children[0].children[0]]
        const intersectedObjects = raycaster.intersectObjects(objs, true);
        if (intersectedObjects.length) {
            let click_point = this.currentMode == 'image' ? intersectedObjects[2].point : intersectedObjects[0].point 
            let measure = new Potree.Measure();
            measure.showDistances = false;
            measure.showCoordinates = true;
            measure.maxMarkers = 1;
            measure.type = 'Point';
            measure.name = 'Point';
            measure.addMarker(click_point);
            this.viewer.scene.addMeasurement(measure);
            this.processTag(click_point);
            console.log("Event clicked : ", pos, event, click_point, intersectedObjects);
        }
        this.viewer.renderArea.removeEventListener('click',  this.measureClickHandler);
    }

    processTag(click_point) {
        let date_time = new Date();
        // let screenShotPath = `${mainProjectID}/structures/${inProjectID}/snapshots/${viewer.tileset}/${date_time.getTime()}.png`
        // let latest_measure = viewer.scene.measurements.slice(-1)[0]
        this.isAddTagActive = this.deactivateCreateTagTool();
        let tagObject = {
            position: click_point,
            // screenShot: `https://${s3_bucket}.s3.ap-south-1.amazonaws.com/${screenShotPath}`
        }
        let save_obj = {
            type: this.tagType,
            camera: this.getContext().cameraObject,
            tag: tagObject
            
        }

        if (this.currentMode != "3d") {
            let imageObject = {
                position: this.getCurrentImage().position,
                name: this.currentMode === "image" ? this.getCurrentImage.id: this.getCurrentImage.file
            };
            save_obj.image = imageObject;
        }
        console.log('Saving Annotation: ', save_obj);
        this.eventHandler(this.viewerId, save_obj)
        // window.top.postMessage({type: 'save-tag', data: JSON.stringify(save_obj)}, "*");
        // takeScreenshot(screenShotPath, viewer);
    }

    createSprite() {

    }

    clearTempMeasurements() {
        this.viewer.scene.removeAllMeasurements();
    }

    removeData() {
        // console.log("Inside remove data potree");
        try {
            this.removeEventListeners();
            this.removeAssets();
        } catch {
            console.log("Error while removing data from potree viewer: ");
        }
       
    }

    removeAssets() {
        // console.log("Inside remove assets potree");
       this.viewer.scene.scenePointCloud.remove(this.viewer.scene.pointclouds[0]);
       this.viewer.scene.pointclouds = [];
        if (this.viewer.scene.orientedImages.length && this.viewer.scene.orientedImages[0]) {
           this.viewer.scene.orientedImages[0].release();
           this.viewer.scene.orientedImages[0].images.forEach(image => {
               this.viewer.scene.scene.children[0].remove(image.mesh);
               this.viewer.scene.scene.children[0].remove(image.line);
            });
           this.viewer.scene.scene.remove(this.viewer.scene.scene.children[0]);
           this.viewer.scene.removeOrientedImages(this.viewer.scene.orientedImages[0]);
        }

        if (this.viewer.scene.images360.length && this.viewer.scene.images360[0]) {
           this.viewer.scene.images360[0].unfocus(false);
           this.viewer.scene.images360[0].images.forEach(image => {
               this.viewer.scene.scene.children[0].remove(image.mesh);
            });
           this.viewer.scene.scene.children[0].remove(this.viewer.scene.images360[0].sphere);
           this.viewer.scene.scene.remove(this.viewer.scene.scene.children[0]);
           this.viewer.scene.remove360Images(this.viewer.scene.images360[0]);
        }
        if (this.floorMap) {
            this.removeFloorMap();
        }
        this.isPointCloudLoaded = false;
        this.currentLoadedImage = null;

    }

    removeFloorMap() {
        this.viewer.floorMap.icons.forEach(icon => {
            this.viewer.floorMap.container.removeChild(icon);
        });
        this.viewer.floorMap.icons = [];
        this.viewer.floorMap.container.removeChild(this.viewer.floorMap.userIcon);
        this.viewer.floorMap.userIcon = null;
        this.viewer.floorMap.images = null;
        let context = this.viewer.floorMap.canvas.getContext('2d');
        context.clearRect(0, 0, this.viewer.floorMap.canvas.width, this.viewer.floorMap.canvas.height);
        this.floorMap = false;
        this.viewer.floorMap = {};
    }
}