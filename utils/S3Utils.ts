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