import instance from "./axiosInstance";
import authHeader from "./auth-header";
export const getSectionsList = async (projectId: string) => {
  return await instance.get(
    `${process.env.NEXT_PUBLIC_HOST}/views/web/${projectId}/sectionList	`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
export const getNewChipData = async (projectId: string,t:string) => {
  return await instance.get(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/chips?type=${t}`,
    {
      headers: authHeader.authHeader(),
    }
  )
};
export const removeChip = async (projectId: string,chipId:string,structure:any) => {
  console.log(projectId,chipId);
  
  return await instance.put(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/chips/${chipId}`, {structure},
    {
      headers: authHeader.authHeader(),
    }
  )
};
// export const getStructureHierarchy = async (projectId: string) => {
//   return await instance.get(
//     `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures/hierarchy`,
//     {
//       headers: authHeader.authHeader(),
//     }
//   );
// };
