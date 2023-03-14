import instance from './axiosInstance';
import authHeader from './auth-header';
export const getAllUserNotifications = async (
  condition: number,
  pageNo: number
) => {
  return await instance
    .get(
      `${process.env.NEXT_PUBLIC_HOST}/user-notifications?condition=${condition}&offset={pageNo}`,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const updateUserNotifications = async (UpdateInfo: Array<string>) => {
  return await instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/user-notifications`,
      { UpdateInfo },
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
