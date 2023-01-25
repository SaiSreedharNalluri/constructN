import instance from './axiosInstance';
import authHeader from './auth-header';
export const updateTypeLists = async (
  typeListObj: Object,
  projectId: string,
  typelistId: string
) => {
  return await instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/typeLists/${typelistId}`,
      typeListObj,
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
