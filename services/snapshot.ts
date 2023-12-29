import instance from "./axiosInstance";
import authHeader from "./auth-header";
import { API } from "../config/config";
export const getSnapshotsList = async (
  projectId: string,
  structureId: string,
  offset?: any,
  limit?: any
) => {
  return await instance.get(
    `${
      API.BASE_URL
    }/projects/${projectId}/structures/${structureId}/snapshots?limit=${
      limit || 10
    }&offset=${offset || 1}`,
    // `${API.BASE_URL}/projects/${projectId}/structures/${structureId}/snapshots`,
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
    `${API.BASE_URL}/projects/${projectId}/structures/${structureId}/snapshots/${snapshotId}`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
