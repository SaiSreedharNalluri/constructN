import instance from './axiosInstance';
import authHeader from './auth-header';
import { API } from '../config/config';
export const createComment = (projectId: string, commentObj: object) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/comments`,
      commentObj,
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
export const editComment = (
  projectId: string,
  commentId: string,
  commentObj: object
) => {
  return instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/comments/${commentId}`,
      commentObj,
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
export const getCommentsList = async (projectId: string, entityID: string) => {
  return await instance
    .get(
      `${API.BASE_URL}/projects/${projectId}/comments?entity=${entityID}`,
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
export const getCommentDetails = (projectId: string, commentId: string) => {
  return instance
    .get(
      `${API.BASE_URL}/projects/${projectId}/comments${commentId}`,
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
export const deleteComment = async (projectId: string, commentId: string) => {
  return await instance
    .delete(
      `${API.BASE_URL}/projects/${projectId}/comments/${commentId}`,
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
export const createCommentReply = (
  projectId: string,
  commentObj: object,
  commentId: string
) => {
  return instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/comments/${commentId}/replies/add`,
      commentObj,
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
export const editCommentReply = (
  projectId: string,
  commentObj: object,
  commentId: string,
  repliId: string
) => {
  return instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/comments/${commentId}/replies/${repliId}/update`,
      commentObj,
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
export const deleteCommentReply = async (
  projectId: string,
  commentId: string,
  repliId: string
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/comments/${commentId}/replies/${repliId}/delete`,
      {},
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
