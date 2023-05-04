import instance from "./axiosInstance";
import authHeader from "./auth-header";
export const getGenViewerData = async (projectId: string, structureId: string) => {
    return await instance
      .get(
        `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures/${structureId}/gen-data`,
        {
          headers: authHeader.authHeader(),
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  };