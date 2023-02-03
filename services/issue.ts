import instance from './axiosInstance';
import authHeader from './auth-header';
export const createIssue = (projectId: string, issueObj: object) => {
  return instance
    .post(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/issues`,
      issueObj,
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
export const getIssuesList = async (projectId: string, structureId: string) => {
  return await instance
    .get(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/issues?structure=${structureId}`,
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
export const getIssuesTypes = async (projectId: string) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/issues/types`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getIssuesPriority = async (projectId: string) => {
  return await instance
    .get(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/issues/priority`,
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
export const getIssuesStatus = async (projectId: string) => {
  return await instance
    .get(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/issues/status`,
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
export const deleteIssue = async (projectId: string, IssueId: string) => {
  return await instance
    .delete(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/issues/${IssueId}`,
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
