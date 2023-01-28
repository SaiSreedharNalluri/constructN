import authHeader from "./auth-header";
import instance from "./axiosInstance";

export const getStructureDesigns = async (
    projectId: string,
    structureId: string
) => {
    try {
      const params = new URLSearchParams([['structure', structureId]]);
      return await instance.get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/designs`, {
        headers: authHeader.authHeader(),
        params
      });
    } catch (error: any) {
      console.log('error', error);
      throw error;
    }
  };

export const getDesignTM = async (
    path: string
) => {
  try {
      return await instance.get(
      `${path}/tm.json`
    ); 
  } catch (error) {
    console.log("Error TmJson:", error);
    return {}

  }
};