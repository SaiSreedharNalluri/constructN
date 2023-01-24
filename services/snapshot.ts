import instance from './axiosInstance';
import authHeader from './auth-header';
export const getSnapshotsList = async (
  projectId: string,
  structureId: string
) => {
  return await instance.get(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures/${structureId}/snapshots`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
export const getSnapshotDetails = async (
  projectId: string,
  structureId: string,
  snapshotId: string
) => {
  return await instance.get(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures/${structureId}/snapshots/${snapshotId}`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
