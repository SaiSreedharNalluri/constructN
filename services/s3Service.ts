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
export const getPutSignedUrl = async (pathObject:any,authToken:any) => {
  return await axios
    .post(
      `${process.env.NEXT_PUBLIC_HOST}/s3/put-signed-url?bucket=${process.env.NEXT_PUBLIC_ATTACHMENTS_BUCKET}`,{paths:[pathObject]}, {
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
