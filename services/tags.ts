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
