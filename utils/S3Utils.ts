import { AWS } from "../config/config";

export const getStructurePath = (
    projectId: string,
    structureId: string
) => {
    console.log(`${AWS.CDN_PROJECTS}`)
    return `${AWS.CDN_PROJECTS}/${projectId}/structures/${structureId}`;
}

export const getSnapshotPath = (
    projectId: string,
    structureId: string,
    snapshotId: string
) => {
    console.log(`${getStructurePath(projectId, structureId)}`)
    return `${getStructurePath(projectId, structureId)}/snapshots/${snapshotId}`;
}

export const getDesignPath = (
    projectId: string,
    structureId: string,
    designId: string
) => {
    return `${getStructurePath(projectId, structureId)}/designs/${designId}`;
}

export const getRealityPath = (
    projectId: string,
    structureId: string,
    snapshotId: string,
    realityId: string
) => {
    return `${getSnapshotPath(projectId, structureId, snapshotId)}/reality/${realityId}`;
}

export const getFloormapPath = (
    projectId: string,
    structureId: string,
    designId: string
) => {
    return `${getDesignPath(projectId, structureId, designId)}/floormap/floormap.png`;
}

export const getFloormapTmPath = (
    projectId: string,
    structureId: string,
    designId: string
) => {
    return `${getDesignPath(projectId, structureId, designId)}/floormap/tm.json`;
}