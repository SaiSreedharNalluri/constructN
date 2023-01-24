import axios from "axios";
import authHeader from "./auth-header";

export const getPointCloudTM = async (
    projectId: string,
    structureId: string,
    snapshotId: string
) => {
  try {
      return await axios.get(
      `${process.env.NEXT_PUBLIC_CONSTRUCTN_PROJECTS_S3}/${projectId}/structures/${structureId}/snapshots/${snapshotId}/pointcloud/tm.json`
    ); 
  } catch (error) {
    throw error;
  }
};
