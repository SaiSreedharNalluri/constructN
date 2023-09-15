import instance from "./axiosInstance";
import authHeader from "./auth-header";
export const getAllUserNotifications = async (
  pageNo: number,
  eventEmitter: string
) => {
  let url = `${process.env.NEXT_PUBLIC_HOST}/user-notifications?offset=${pageNo}`
  if(eventEmitter){
    url = `${url}&category=${eventEmitter}`
  }
  return await instance
    .get(
      url,
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
export const clearUserNotificationsCount = async (
  
) => {
  return await instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/user-notifications/delete-records`,
      {},
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