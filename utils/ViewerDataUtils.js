
import { getRealityPointCloudPath, getPointCloudTM, getRealityImagesPath, getRealityPositions, getRealityPositionsPath, getOrthoPhotoLayers, getMapboxHotspotLayers } from "../services/reality";
import { type } from "os";

import { getRealityPath, getDesignPath, getFloormapPath, getFloormapTmPath,  getMapboxLayersPath, getStructurePath } from "./S3Utils";
import moment from "moment-timezone";

export const getPointCloudReality = (snapshot) => {
    return snapshot.reality.find((reality) => {
        console.log("Generic Viewer Inside find reality function:");
        if (reality.mode === "360 Video" || reality.mode === "Drone Image") {
        console.log("Generic Viewer found reality: ", reality)
        return reality
        }
    });
}

export const getMapboxReality = (realityList) => {
    return realityList.find((reality) => {
        return reality
    });
}

export const getForgeModels = (designMap) => {
    console.log("Found U",designMap);
    let forgeDocumentMap = {}
    let document = {};
    for (const type in designMap) {
        switch (type) {
            case "BIM":
                let bimArray = [];
                console.log('Found Wierd',designMap[type],type);
                for (var design of designMap[type]) {
                    document = {};
                    let  g = design.tm;
                    document.tm =  design.tm;
                    console.log("Found design",design,document,design.tm,g);
                    let storage = design.storage.find(storage => storage.provider === "autodesk-oss");
                    //console.log("Found storage",storage);
                    if (storage) {
                    document.urn = `urn:${storage.pathId}`;
                    //document.tm = design.tm;
                    console.log("Found document",document,design.tm);
                    bimArray.push(document);
                    }
                }
                
                forgeDocumentMap[type] = bimArray;
                break;
            case "Plan Drawings":
                let planDrawingsArray = [];
                console.log('Found Wierd',designMap[type]);
                for (var design of designMap[type]) {
                    document = {};
                    
                    document.tm = design.tm;
                    console.log("Found design",design,document,design.tm);
                    let storage = design.storage.find(storage => storage.provider === "autodesk-oss");
                    console.log("Found storage",storage);
                    if (storage) {
                    document.urn = `urn:${storage.pathId}`;
                    //document.tm = design.tm;
                    console.log("Found document",document,design.tm);
                    planDrawingsArray.push(document);
                    }
                }
                forgeDocumentMap[type] = planDrawingsArray;
                break;

        }
    }
    console.log('Found ForgeDocumentMap:',forgeDocumentMap);
    return forgeDocumentMap;
}

export const getFloorPlanData = (designMap) => {
    let floormapDataMap = {}
    for (const type in designMap) {
        switch (type) {
            case "Plan Drawings":
                let planDrawingsArray = [];
                for (let design of designMap[type]) {
                    let floormap = {};
                    let storage = design.storage.find(storage => storage.provider === "constructn-oss");
                    if (storage) {
                    floormap.floormapPath = getFloormapPath(design.project, design.structure, design._id);
                    floormap.tmPath = getFloormapTmPath(design.project, design.structure, design._id);
                    planDrawingsArray.push(floormap);
                    }
                }
                floormapDataMap[type] = planDrawingsArray;
                break;

        }
    }
    return floormapDataMap;
}

export const getPointCloud = async(structure, snapshot) =>{
    const tmResponse = await getPointCloudTM(getRealityPath(snapshot.project, structure._id, snapshot._id, getPointCloudReality(snapshot)._id));
    const pointCloudData = {
        path: `${getRealityPath(snapshot.project, structure._id, snapshot._id, getPointCloudReality(snapshot)._id)}/pointcloud/cloud.json`,
        tm: tmResponse ? tmResponse.data.tm : [],
        offset: tmResponse ? tmResponse.data.offset: []
    }
    return pointCloudData;
}

export const getPointClouds = async(structure, realityMap) => {
    let pointCloudMap = {};
    for (const mode in realityMap) {
        switch (mode) {
            case "360 Video":
                let videoWalkPointClouds = [];
                for (let reality of realityMap[mode].realities) {
                    const tmResponse = await getPointCloudTM(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                    const pointCloudData = {
                        id: reality._id,
                        path: `${getRealityPath(structure.project, structure._id, reality.snapshot, reality._id)}/pointcloud/cloud.json`,
                        tm: tmResponse ? tmResponse.data.tm : [],
                        offset: tmResponse ? tmResponse.data.offset: []
                    }
                    videoWalkPointClouds.push(pointCloudData)
                }
                pointCloudMap[mode] = videoWalkPointClouds;
                break;
            case "Drone Image":
                let dronePointClouds = [];
                for (let reality of realityMap[mode].realities) {
                    const tmResponse = await getPointCloudTM(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                    const pointCloudData = {
                        id: reality._id,
                        path: `${getRealityPath(structure.project, structure._id, reality.snapshot, reality._id)}/pointcloud/cloud.json`,
                        tm: tmResponse ? tmResponse.data.tm : [],
                        offset: tmResponse ? tmResponse.data.offset: []
                    }
                    dronePointClouds.push(pointCloudData)
                }
                pointCloudMap[mode] = dronePointClouds;
                break;
        }
    }
    return pointCloudMap
}

export const getMapboxLayers = async(structure, snapshot) =>{
    const layersList = await getOrthoPhotoLayers(getStructurePath(snapshot.project, structure._id));
    return layersList ? layersList.data : undefined;
}

export const getMapboxHotspots = async(projectId, structureId, snapshotId, realityId) =>{
    console.log(snapshotId, projectId, structureId, realityId)
    const hotspotsList = await getMapboxHotspotLayers(getRealityPath(projectId, structureId, snapshotId, realityId));
    return hotspotsList;
}

export const getRealityLayers = async (structure, realityMap) => {
    console.log("Generic Viewer Inside get Reality layers: ", realityMap)
    let realityPositionMap = {}
    for (const mode in realityMap) {
        console.log("Inside reality Map for: ", mode);
        switch (mode) {
        case "360 Video":
            console.log("Inside get Reality layers: In 360 mode: ")
            let position360Video = {};
            for (let reality of realityMap[mode].realities) {
            console.log("Inside reality list: ", reality);
            let response = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
            position360Video = {...position360Video, ...response.data};
            console.log("Main for: ", position360Video);
            }
            realityPositionMap[mode] = position360Video;
            break;
        case "360 Image":
            let position360Image = {};
            for (let reality of realityMap[mode].realities) {
                let response = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                position360Image = {...position360Image, ...response.data};
            }
            realityPositionMap[mode] = position360Image;
            break;
        case "Phone Image":
            let positionPhoneImage = {};
            for (let reality of realityMap[mode].realities) {
                let response = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                positionPhoneImage = {...positionPhoneImage, ...response.data};
            }
            realityPositionMap[mode] = positionPhoneImage;
            break;
        case "Drone Image":
            let positionDroneImage = {};
            for (let reality of realityMap[mode].realities) {
            console.log("Inside reality list: ", reality);
            let response = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
            positionDroneImage = {...positionDroneImage, ...response.data};
            console.log("Main for: ", positionDroneImage);
            }
            realityPositionMap[mode] = positionDroneImage;
            break;
        }
    }
    return realityPositionMap;
}

export const getRealityLayersPath = async (structure, realityMap) => {
    let realityPositionMap = {}
    for (const mode in realityMap) {
        switch (mode) {
        case "360 Video":
            let position360VideoPath = [];
            for (let reality of realityMap[mode].realities) {
                const tmResponse = await getPointCloudTM(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                let realityResponse = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                let paths = {
                    id: reality._id,
                    pointCloud: getRealityPointCloudPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id)),
                    tm: tmResponse ? tmResponse.data.tm : [],
                    offset: tmResponse ? tmResponse.data.offset: [],
                    position: realityResponse.data,
                    imagesPath: getRealityImagesPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id)),
                    positionPath: getRealityPositionsPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id))
                }
                position360VideoPath.push(paths)
            }
            realityPositionMap[mode] = position360VideoPath;
            break;
        case "360 Image":
            let position360ImagePath = [];
            for (let reality of realityMap[mode].realities) {
                let realityResponse = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                let paths = {
                    id: reality._id,
                    position: realityResponse.data,
                    imagesPath: getRealityImagesPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id)),
                    positionPath: getRealityPositionsPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id))

                }
                position360ImagePath.push(paths)
            }
            realityPositionMap[mode] = position360ImagePath;
            break;
        case "Phone Image":
            let positionPhoneImagePath = [];
            for (let reality of realityMap[mode].realities) {
                let realityResponse = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                let paths = {
                    id: reality._id,
                    position: realityResponse.data,
                    imagesPath: getRealityImagesPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id)),
                    positionPath: getRealityPositionsPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id))
                }
                positionPhoneImagePath.push(paths)
            }
            realityPositionMap[mode] = positionPhoneImagePath;
            break;
        case "Drone Image":
            let positionDroneImagePath = [];
            for (let reality of realityMap[mode].realities) {
                const tmResponse = await getPointCloudTM(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                let realityResponse = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                let paths = {
                    id: reality._id,
                    pointCloud: getRealityPointCloudPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id)),
                    tm: tmResponse ? tmResponse.data.tm : [],
                    offset: tmResponse ? tmResponse.data.offset: [],
                    position: realityResponse.data,
                    imagesPath: getRealityImagesPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id)),
                    positionPath: getRealityPositionsPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id))
                }
                positionDroneImagePath.push(paths)
            }
            realityPositionMap[mode] = positionDroneImagePath;
            break;
        }
    }
    return realityPositionMap
}

export const getRealityMap = (snapshot) => {
    let map ={};
    snapshot?.reality?.forEach((reality, i, array) => {
        if (map[reality.mode]) {
            map[reality.mode].realities.push(reality);
        } else {
            const layer = {
                name: reality.mode,
                children: [],
                isSelected: true,
                realities: [reality]
            }
            map[reality.mode] = layer
        }
    })
    console.log("Generic Viewer Reality map: ", map);
    return map;
}

export const getDesignMap = (designs) => {
    let map = {

    };
    designs.forEach((design, i, array) => {
        if (map[design.type]) {
        map[design.type].push(design);
        } else {
        map[design.type] = [design]
        }
    });

    console.log("Generic Viewer Design map: ", map);
    return map;
}

export const applyOffset = (position, offset) => {
    return {
        x: position.x - offset[0],
        y: position.y - offset[1],
        z: position.z - offset[2],
    }
}

export const removeOffset = (position, offset) => {
    return {
        x: position.x + offset[0],
        y: position.y + offset[1],
        z: position.z + offset[2],
    }
}

export const applyTMInverse = (position, tm) => {
    const a = new THREE.Vector4(position.x, position.y, position.z, 1);
    const matrixInv = new THREE.Matrix4();
    matrixInv.copy(tm).invert();
    a.applyMatrix4(matrixInv);
    return a;
}

export const applyTM = (position, tm) => {
    const a = new THREE.Vector4(position.x, position.y, position.z, 1);
    a.applyMatrix4(tm);
    return a;
}

export const isMobile=()=>{
    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
        (window.innerWidth <= 768))
        {
            return true
        }
        else{
            return false
        }
        
}
    export const setTheFormatedDate=(utcTime)=>{
        let formatedTime
        if(JSON.parse(localStorage.getItem('isProjectTimeZone'))&&JSON.parse(localStorage.getItem('currentProjectTimeZone'))!=null)
        {
            formatedTime = moment(utcTime).tz(JSON.parse(localStorage.getItem('currentProjectTimeZone')).timeZone)
        }
        else
        {
            formatedTime =  moment(utcTime).local()
        }
        return formatedTime.format("DD MMM YYYY")
    }