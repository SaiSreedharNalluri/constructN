import instance from './axiosInstance';
import authHeader from './auth-header';
import { API } from '../config/config';
export const updateTags = async (tagObj: Object, projectId: string) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/tags/update`,
      tagObj,
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
export const getTagsList = async (projectId: string) => {
  return await instance
    .get(`${API.BASE_URL}/projects/${projectId}/tags`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};


export const updateTagsListApi = async (projectId: string,tagList:any) => {
  return await instance
    .put(`${API.BASE_URL}/projects/${projectId}/tags/update`,
    {tagList}, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};


export const addTagsListApi = async (projectId: string,tagList:any) => {
  return await instance
    .put(`${API.BASE_URL}/projects/${projectId}/tags/push`,
    {tagList}, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};


export const deleteTagsListApi = async (projectId: string,tagList:any) => {
  return await instance
    .put(`${API.BASE_URL}/projects/${projectId}/tags/pop`,
    {tagList}, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
