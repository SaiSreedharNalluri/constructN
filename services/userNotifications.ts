import instance from "./axiosInstance";
import authHeader from "./auth-header";
import { API } from "../config/config";
export const getAllUserNotifications = async (
  pageNo: number,
  eventEmitter: string
) => {
  let url = `${API.BASE_URL}/user-notifications?offset=${pageNo}`
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
      `${API.BASE_URL}/user-notifications`,
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
      `${API.BASE_URL}/user-notifications/delete-records`,
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