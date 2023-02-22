import instance from './axiosInstance';
import authHeader from './auth-header';
export const createAttachment = (entityID: string, attachmentObj: object) => {
  return instance
    .post(
      `${process.env.NEXT_PUBLIC_HOST}/attachments?entity=${entityID}`,
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
    .get(`${process.env.NEXT_PUBLIC_HOST}/attachments?entity=${entityID}`, {
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
    .get(`${process.env.NEXT_PUBLIC_HOST}/attachments/${attachmentId}`, {
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
    .delete(`${process.env.NEXT_PUBLIC_HOST}/attachments/${attachmentId}`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
