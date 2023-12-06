import instance from "./axiosInstance";
import authHeader from "./auth-header";
import { API } from "../config/config";
export const getSectionsList = async (projectId: string) => {
  return await instance.get(
    `${API.BASE_URL}/views/web/${projectId}/sectionList	`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
export const getNewChipData = async (projectId: string,t:string) => {
  return await instance.get(
    `${API.BASE_URL}/projects/${projectId}/chips?type=${t}`,
    {
      headers: authHeader.authHeader(),
    }
  )
};
export const removeChip = async (projectId: string,chipId:string,structure:any) => {
  console.log(projectId,chipId);
  
  return await instance.put(
    `${API.BASE_URL}/projects/${projectId}/chips/${chipId}`, {structure},
    {
      headers: authHeader.authHeader(),
    }
  )
};
// export const getStructureHierarchy = async (projectId: string) => {
//   return await instance.get(
//     `${API.BASE_URL}/projects/${projectId}/structures/hierarchy`,
//     {
//       headers: authHeader.authHeader(),
//     }
//   );
// };
