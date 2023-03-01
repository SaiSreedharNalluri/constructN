import instance from './axiosInstance';
import authHeader from './auth-header';
export const updateTags = async (tagObj: Object, projectId: string) => {
  return await instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tags/update`,
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
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tags`, {
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
    .put(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tags/update`,
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
    .put(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tags/push`,
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
    .put(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tags/pop`,
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
