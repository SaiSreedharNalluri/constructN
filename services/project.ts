import instance from './axiosInstance';
import authHeader from './auth-header';
export const getProjects = async (context: any) => {
  try {
    return await instance.get(`${process.env.API_BASE_URL}/projects`, {
      headers: authHeader.authCookieHeader(context),
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      context.res.writeHead(302, {
        Location: '/login',
      });
      context.res.end();
    }
    throw error;
  }
};
export const getProjectDetails = async (projectId: string) => {
  try {
    return await instance.get(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}`,
      {
        headers: authHeader.authHeader(),
      }
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};
