import instance from './axiosInstance';
import authHeader from './auth-header';
import { API } from '../config/config';
export const getAllUserNotifications = async () => {
  return await instance
    .get(`${API.BASE_URL}/user-notifications`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
