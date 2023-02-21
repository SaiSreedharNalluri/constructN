import instance from './axiosInstance';
import authHeader from './auth-header';
export const createComment = (projectId: string, commentObj: object) => {
  return instance
    .post(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/comments`, commentObj, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const editComment = (projectId: string, commentId: string, commentObj: object) => {
  return instance
    .put(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/comments/${commentId}`, commentObj, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getCommentsList = async (projectId: string, entityID: string) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/comments?entity=${entityID}`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getCommentDetails = (projectId: string, commentId: string) => {
  return instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/comments${commentId}`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const deleteComment = async (projectId: string, commentId: string) => {
  return await instance
    .delete(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/comments/${commentId}`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const createCommentReply = (projectId: string, commentObj: object, commentId: string) => {
  return instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/comments/${commentId}/replies/add`,
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
export const editCommentReply = (projectId: string, 
  commentObj: object,
  commentId: string,
  repliId: string
) => {
  return instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/comments/${commentId}/replies/${repliId}/update`,
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
export const deleteCommentReply = async (projectId: string, 
  commentId: string,
  repliId: string
) => {
  return await instance
    .delete(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/comments/${commentId}/replies/${repliId}/delete`,
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
