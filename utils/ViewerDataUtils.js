
import { getPointCloudTM, getRealityImagesPath, getRealityPositions, getRealityPositionsPath } from "../services/reality";
import { getRealityPath, getDesignPath, getFloormapPath, getFloormapTmPath } from "./S3Utils";



export const getPointCloudReality = (snapshot) => {
    return snapshot.reality.find((reality) => {
        console.log("Generic Viewer Inside find reality function:");
        if (reality.mode === "360 Video" || reality.mode === "Drone Image") {
        console.log("Generic Viewer found reality: ", reality)
        return reality
        }
    });
}

export const getForgeModels = (designMap) => {
    let forgeDocumentMap = {}
    for (const type in designMap) {
        switch (type) {
            case "BIM":
                let bimArray = [];
                for (let design of designMap[type]) {
                    let document = {};
                    let storage = design.storage.find(storage => storage.provider === "autodesk-oss");
                    if (storage) {
                    document.urn = `urn:${storage.pathId}`;
                    document.tm = design.tm;
                    bimArray.push(document);
                    }
                }
                forgeDocumentMap[type] = bimArray;
                break;
            case "Plan Drawings":
                let planDrawingsArray = [];
                for (let design of designMap[type]) {
                    let document = {};
                    let storage = design.storage.find(storage => storage.provider === "autodesk-oss");
                    if (storage) {
                    document.urn = `urn:${storage.pathId}`;
                    document.tm = design.tm;
                    planDrawingsArray.push(document);
                    }
                }
                forgeDocumentMap[type] = planDrawingsArray;
                break;

        }
    }
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

export const getRealityLayers = async (structure, realityMap) => {
    console.log("Generic Viewer Inside get Reality layers: ", realityMap)
    let realityPositionMap = {}
    for (const mode in realityMap) {
        console.log("Inside reality Map for: ", mode);
        switch (mode) {
        case "360 Video":
            console.log("Inside get Reality layers: In 360 mode: ")
            let position360Video = {};
            for (let reality of realityMap[mode]) {
            console.log("Inside reality list: ", reality);
            let response = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
            position360Video = {...position360Video, ...response.data};
            console.log("Main for: ", position360Video);
            }
            realityPositionMap[mode] = position360Video;
            break;
        case "360 Image":
            let position360Image = {};
            for (let reality of realityMap[mode]) {
                let response = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                position360Image = {...position360Image, ...response.data};
            }
            realityPositionMap[mode] = position360Image;
            break;
        case "Phone Image":
            let positionPhoneImage = {};
            for (let reality of realityMap[mode]) {
                let response = await getRealityPositions(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id));
                positionPhoneImage = {...positionPhoneImage, ...response.data};
            }
            realityPositionMap[mode] = positionPhoneImage;
            break;
        case "Drone Image":
            let positionDroneImage = {};
            for (let reality of realityMap[mode]) {
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

export const getRealityLayersPath = (structure, realityMap) => {
    let realityPositionMap = {}
    for (const mode in realityMap) {
        switch (mode) {
        case "360 Video":
            let position360VideoPath = [];
            for (let reality of realityMap[mode]) {
            let paths = {
                images: getRealityImagesPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id)),
                position: getRealityPositionsPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id))
            }
            position360VideoPath.push(paths)
            }
            realityPositionMap[mode] = position360VideoPath;
            break;
        case "360 Image":
            break;
        case "Phone Image":
            break;
        case "Drone Image":
            let positionDroneImagePath = [];
            for (let reality of realityMap[mode]) {
            let paths = {
                images: getRealityImagesPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id)),
                position: getRealityPositionsPath(getRealityPath(structure.project, structure._id, reality.snapshot, reality._id))
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
    let map = {

    };
    snapshot?.reality?.forEach((reality, i, array) => {
        if (map[reality.mode]) {
        map[reality.mode].push(reality);
        } else {
        map[reality.mode] = [reality];
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


