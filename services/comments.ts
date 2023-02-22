import instance from './axiosInstance';
import authHeader from './auth-header';
export const createComment = (commentObj: object) => {
  return instance
    .post(`${process.env.NEXT_PUBLIC_HOST}/comments`, commentObj, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const editComment = (commentId: string, commentObj: object) => {
  return instance
    .put(`${process.env.NEXT_PUBLIC_HOST}/comments/${commentId}`, commentObj, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getCommentsList = async (entityID: string) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/comments?entity=${entityID}`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getCommentDetails = (commentId: string) => {
  return instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/comments${commentId}`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const deleteComment = async (commentId: string) => {
  return await instance
    .delete(`${process.env.NEXT_PUBLIC_HOST}/comments/${commentId}`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const createCommentReply = (commentObj: object, commentId: string) => {
  return instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/comments/${commentId}/replies/add`,
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
  commentObj: object,
  commentId: string,
  repliId: string
) => {
  return instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/comments/${commentId}/replies/${repliId}/update`,
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
  commentId: string,
  repliId: string
) => {
  return await instance
    .delete(
      `${process.env.NEXT_PUBLIC_HOST}/comments/${commentId}/replies/${repliId}/delete`,
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
