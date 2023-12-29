import axios from 'axios';
import { API, AWS } from '../config/config';
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
export const getPutSignedUrl = async (pathObject:any,authToken:any) => {
  return await axios
    .post(
      `${API.BASE_URL}/s3/put-signed-url?bucket=${AWS.ATTACHMENTS_BUCKET}`,{paths:[pathObject]}, {
        headers: {
          Authorization:`Bearer ${authToken}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
