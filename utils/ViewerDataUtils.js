
import { getPointCloudTM, getRealityImagesPath, getRealityPositions, getRealityPositionsPath } from "../services/reality";
import { getRealityPath, getDesignPath } from "./S3Utils";

export const getForgeModels = (designs) => {
    console.log("Generic Viewer Design List in get forge models: ", designs);
    let documentList = designs.map((design) => {
        let document = {};
        let storage = design.storage.find(storage => storage.provider === "autodesk-oss");
        if (storage) {
        document.urn = `urn:${storage.pathId}`;
        document.tm = design.tm;
        }
        return document
    })
    console.log("Generic Viewer Design models: ", documentList);
    return documentList;
    }

    export const getPointCloudReality = (snapshot) => {
    return snapshot.reality.find((reality) => {
        console.log("Generic Viewer Inside find reality function:");
        if (reality.mode === "360 Video" || reality.mode === "Drone Image") {
        console.log("Generic Viewer found reality: ", reality)
        return reality
        }
    });
}

export const getForgeModels2 = (designMap) => {
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

export const getPointCloud = async(structure, snapshot) =>{
    const tmResponse = await getPointCloudTM(getRealityPath(snapshot.project, structure._id, snapshot._id, getPointCloudReality(snapshot)._id));
    const pointCloudData = {
        path: `${getRealityPath(snapshot.project, structure._id, snapshot._id, getPointCloudReality(snapshot)._id)}/pointcloud/cloud.json`,
        tm: tmResponse ? tmResponse.data.tm : [],
        offset: tmResponse ? tmResponse.data.offset: []
    }
    return pointCloudData;
}

export const getRealityLayers = async (structure, snapshot, realityMap) => {
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
            let response = await getRealityPositions(getRealityPath(snapshot.project, structure._id, snapshot._id, reality._id));
            position360Video = {...position360Video, ...response.data};
            console.log("Main for: ", position360Video);
            }
            realityPositionMap[mode] = position360Video;
            break;
        case "360 Image":
            break;
        case "Phone Image":
            break;
        case "Drone Image":
            let positionDroneImage = {};
            for (let reality of realityMap[mode]) {
            console.log("Inside reality list: ", reality);
            let response = await getRealityPositions(getRealityPath(snapshot.project, structure._id, snapshot._id, reality._id));
            positionDroneImage = {...positionDroneImage, ...response.data};
            console.log("Main for: ", positionDroneImage);
            }
            realityPositionMap[mode] = positionDroneImage;
            break;
        }
    }
    return realityPositionMap;
}

export const getRealityLayersPath = (structure, snapshot, realityMap) => {
    let realityPositionMap = {}
    for (const mode in realityMap) {
        switch (mode) {
        case "360 Video":
            let position360VideoPath = [];
            for (let reality of realityMap[mode]) {
            let paths = {
                images: getRealityImagesPath(getRealityPath(snapshot.project, structure._id, snapshot._id, reality._id)),
                position: getRealityPositionsPath(getRealityPath(snapshot.project, structure._id, snapshot._id, reality._id))
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
                images: getRealityImagesPath(getRealityPath(snapshot.project, structure._id, snapshot._id, reality._id)),
                position: getRealityPositionsPath(getRealityPath(snapshot.project, structure._id, snapshot._id, reality._id))
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



