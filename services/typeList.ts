import instance from './axiosInstance';
import authHeader from './auth-header';
import { API } from '../config/config';
export const updateTypeLists = async (
  typeListObj: Object,
  projectId: string,
  typelistId: string
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/${typelistId}`,
      typeListObj,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('error', error);
      throw error;
    });
};
