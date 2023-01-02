import axios from 'axios';
import authHeader from './auth-header';
export const getSnapshots = async (structureId: string) => {
  return await axios.get(`${process.env.API_BASE_URL}/${structureId}`, {
    headers: authHeader.authHeader(),
  });
};
export const getSnapshotsDetails = async (snapshotId: string) => {
  return await axios.get(`${process.env.API_BASE_URL}/${snapshotId}`, {
    headers: authHeader.authHeader(),
  });
};
