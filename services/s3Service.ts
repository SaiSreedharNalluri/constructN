import axios from 'axios';
import { AWS } from '../config/config';
export const getdashBoardUrls = async (projectId: string) => {
  return await axios
    .get(
      `${AWS.CDN_PROJECTS}/${projectId}/dashboard-report.json`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
