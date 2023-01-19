import axios from 'axios';
import authHeader from './auth-header';
export const getProjects = async (context: any) => {
  try {
    return await axios.get(`${process.env.API_BASE_URL}/projects`, {
      headers: authHeader.authCookieHeader(context),
    });
  } catch (error) {
    throw error;
  }
};
export const getProjectDetails = async (context: any,projectId:string) => {
  // try {
  //   return await axios.get(`${process.env.API_BASE_URL}/projects/${projectId as string}`, {
  //     headers: authHeader.authCookieHeader(context),
  //   });
  // } catch (error) {
  //   throw error;
  // }
};
