import instance from './axiosInstance';
import authHeader from './auth-header';
export const createIssue = (projectId: string) => {
  return instance
    .post(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/issues`,
      {},
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {})
    .catch((error) => {
      throw error;
    });
};
export const getIssuesList = async (projectId: string) => {
  return await instance.get(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/issues`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
