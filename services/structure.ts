import instance from "./axiosInstance";
import authHeader from "./auth-header";
import { API } from "../config/config";
export const getStructureList = async (projectId: string) => {
  return await instance.get(
    `${API.BASE_URL}/projects/${projectId}/structures`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
export const getStructureHierarchy = async (projectId: string) => {
  return await instance.get(
    `${API.BASE_URL}/projects/${projectId}/structures/hierarchy`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
