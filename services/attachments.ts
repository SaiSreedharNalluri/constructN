import instance from './axiosInstance';
import authHeader from './auth-header';
import { API } from '../config/config';
export const createAttachment = (entityID: string, attachmentObj: object) => {
  return instance
    .post(
      `${API.BASE_URL}/attachments?entity=${entityID}`,
      attachmentObj,
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
export const getAttachmentsList = async (entityID: string) => {
  return await instance
    .get(`${API.BASE_URL}/attachments?entity=${entityID}`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getAttachment = async (attachmentId: string) => {
  return await instance
    .get(`${API.BASE_URL}/attachments/${attachmentId}`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const deleteAttachment = async (attachmentId: string) => {
  return await instance
    .delete(`${API.BASE_URL}/attachments/${attachmentId}`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
