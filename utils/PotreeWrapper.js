import * as THREE from "../public/potree/libs/three.js/build/three.module.js";
export class PotreeViewerUtils {
    constructor(viewerId) {
        this.viewerId = viewerId;
        this.viewer = undefined;
        this.isViewerInitialized = false;
    }

    initialize() {
        console.log("Inside Potree Initializer: ")
        this.viewer = new Potree.Viewer(document.getElementById(this.viewerId));
        window.viewer = this.viewer
        viewer.setFOV(60);
        viewer.setPointBudget(1 * 1000 * 1000);
        viewer.setEDLEnabled(false);
        viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
        viewer.setDescription(``);
        viewer.loadSettingsFromURL();

        viewer.loadGUI(this.loadGUICallback.bind(this))
    }

    loadGUICallback() {
        console.log("Inside Potree Initializer Callback: ")
        this.isViewerInitialized = true;
    }

    isViewerLoaded() {
        return this.isViewerInitialized;
    }

    updateData(pointCloudData) {
        console.log("PointCloud data update: ", pointCloudData);
        if(pointCloudData.tm) {
            this.tmMatrix = new THREE.Matrix4().fromArray(pointCloudData.tm).transpose();
            this.globalOffset = pointCloudData.offset
        }
        
        this.pointCloudPath = pointCloudData.path

        if (this.isViewerInitialized) {
            this.loadData();
        }
    }

    updateLayersData(){

    }

    loadData(viewers, pid, tid, secondary=false, inCamera = null) {
        this.removeAssets(this.viewer);
        this.loadPointCloud(this.viewer, pid, tid, secondary, inCamera);
        // isFloorMap && loadFloormap(viewer.fpContainerId, viewer.fpCanvasId, viewer, pid, tid);
    }

    loadPointCloud(viewer) {
        Potree.loadPointCloud(this.pointCloudPath, this.viewerId + '_' + this.viewerId, e => {
            let scene = viewer.scene;
            let pointcloud = e.pointcloud;

            let material = pointcloud.material;
            material.size = 1;
            material.pointSizeType = Potree.PointSizeType.FIXED;
            material.shape = Potree.PointShape.SQUARE;
            pointcloud.applyMatrix4(this.tmMatrix);
            const assetPosition = pointcloud.position.clone();
            pointcloud.position.set(assetPosition.x - this.globalOffset[0], assetPosition.y - this.globalOffset[1], assetPosition.z - this.globalOffset[2]);
            scene.addPointCloud(pointcloud);
            viewer.fitToScreen();
            console.log('Point Cloud Loaded');

            // let startWithImage = true

            // if (inputTag && !inputTag.image) {
            //     let startWithImage = false
            //     viewerMode = '3d'
            //     flyToContext(inputTag.camera)
            // }

            // if (isExterior) {
            //     console.log('Exterior Project');
            //     loadDroneImages(viewer, projectID, tilesetID, {tm: pcMatrix, offset: pcOffset}, secondary, inCamera, startWithImage);
            //     if (viewer.canvasId == 'viewer_1') {
            //         document.getElementById('cameras_off_1').style.display = 'inline-block';
            //     } else {
            //         document.getElementById('cameras_off_2').style.display = 'inline-block';
            //     }
            // } else {
            //     console.log('Interior Project');
            //     // loadPanoImages(viewer, projectID, tilesetID, {tm: pcMatrix, offset1: [232067.2387, 1936749.6433, 563], offset: pcOffset}, secondary);
            //     loadPanoImages(viewer, projectID, tilesetID, {tm: new THREE.Matrix4(), offset: pcOffset}, secondary, inCamera, startWithImage);
            // }
        });
    }

    removeAssets(viewer) {
        viewer.scene.scenePointCloud.remove(viewer.scene.pointclouds[0]);
        viewer.scene.pointclouds = [];
        if (viewer.scene.orientedImages.length) {
            viewer.scene.orientedImages[0].release();
            viewer.scene.orientedImages[0].images.forEach(image => {
                viewer.scene.scene.children[0].remove(image.mesh);
                viewer.scene.scene.children[0].remove(image.line);
            });
            viewer.scene.scene.remove(viewer.scene.scene.children[0]);
            viewer.scene.removeOrientedImages(viewer.scene.orientedImages[0]);
        }

        if (viewer.scene.images360.length) {
            viewer.scene.images360[0].unfocus(false);
            viewer.scene.images360[0].images.forEach(image => {
                viewer.scene.scene.children[0].remove(image.mesh);
            });
            viewer.scene.scene.children[0].remove(viewer.scene.images360[0].sphere);
            viewer.scene.scene.remove(viewer.scene.scene.children[0]);
            viewer.scene.remove360Images(viewer.scene.images360[0]);
        }
        if (viewer.isFloorMap) {
            // removeFloorMap(viewer);
        }
    }

    removeFloorMap(viewer) {
        viewer.floorMap.icons.forEach(icon => {
            viewer.floorMap.container.removeChild(icon);
        });
        viewer.floorMap.icons = [];
        viewer.floorMap.container.removeChild(viewer.floorMap.userIcon);
        viewer.floorMap.userIcon = null;
        viewer.floorMap.images = null;
        let context = viewer.floorMap.canvas.getContext('2d');
        context.clearRect(0, 0, viewer.floorMap.canvas.width, viewer.floorMap.canvas.height);
        viewer.floorMap = {};
        viewer.isFloorMap = false;
    }
}