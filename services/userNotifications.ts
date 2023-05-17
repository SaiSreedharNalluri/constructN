import instance from "./axiosInstance";
import authHeader from "./auth-header";
export const getAllUserNotifications = async (
  condition: number,
  pageNo: number,
  eventEmitter: string
) => {
  return await instance
    .get(
      `${process.env.NEXT_PUBLIC_HOST}/user-notifications?condition=${condition}&offset=${pageNo}&eventEmitter=${eventEmitter}`,
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
export const updateUserNotifications = async (
  userNotifications: Array<string>
) => {
  return await instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/user-notifications`,
      { userNotifications },
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
