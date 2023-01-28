export const getStructurePath = (
    projectId: string,
    structureId: string
) => {
    return `${process.env.NEXT_PUBLIC_CONSTRUCTN_PROJECTS_S3}/${projectId}/structures/${structureId}`;
}

export const getSnapshotPath = (
    projectId: string,
    structureId: string,
    snapshotId: string
) => {
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