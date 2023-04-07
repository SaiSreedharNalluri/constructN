import axios from 'axios';
export const getdashBoardUrls = async (projectId: string) => {
  return await axios
    .get(
      `${process.env.NEXT_PUBLIC_CONSTRUCTN_PROJECTS_S3}/${projectId}/dashboard-report.json`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
