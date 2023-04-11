import instance from './axiosInstance';
import authHeader from './auth-header';
export const getAllUserNotifications = async () => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/user-notifications`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
