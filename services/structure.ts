import instance from './axiosInstance';
import authHeader from './auth-header';
export const getStructure = async (projectId: string) => {
  return await instance.get(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
export const getStructureHierarchy = async (projectId: string) => {
  return await instance.get(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures/hierarchy`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
