import axios from 'axios';
import authHeader from './auth-header';
export const getStructure = async (projectId: string, context: any) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures`,
    {
      headers: authHeader.authCookieHeader(context),
    }
  );
};
export const getStructureHierarchy = async (projectId: string) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/structures/hierarchy`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
