import axios from 'axios';
import authHeader from './auth-header';
export const createIssue = (projectId: string) => {
  return axios
    .post(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/issues`,
      {},
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {})
    .catch((error) => {
      console.log('error', error);
      throw error;
    });
};
export const getIssuesList = async (projectId: string) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/issues`,
    {
      headers: authHeader.authHeader(),
    }
  );
};
