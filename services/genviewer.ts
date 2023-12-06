import instance from "./axiosInstance";
import authHeader from "./auth-header";
import { API } from "../config/config";
export const getGenViewerData = async (projectId: string, structureId: string) => {
    return await instance
      .get(
        `${API.BASE_URL}/projects/${projectId}/structures/${structureId}/gen-data`,
        {
          headers: authHeader.authHeader(),
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("Error in loading data:3",error)
        throw error
      });
  };