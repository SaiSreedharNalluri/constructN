import instance from './axiosInstance';
import authHeader from './auth-header';
export const createTask = (projectId: string, taskObj: object) => {
  return instance
    .post(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tasks`,
      taskObj,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      throw error?.response?.data;
    });
};
export const updateTask = (projectId: string, taskObj: object, taskId: any) => {
  return instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tasks/${taskId}`,
      taskObj,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      throw error?.response?.data;
    });
};
export const updateAttachments = (file: any, id: any) => {
  return instance
    .post(`${process.env.NEXT_PUBLIC_HOST}/attachments?entity=${id}`, file, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      throw error?.response?.data;
    });
};
export const getTasksList = async (projectId: string, structureId: string) => {
  console.log('getTasksList', projectId, structureId);
  return await instance
    .get(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tasks?structure=${structureId}`,
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
export const getTasksTypes = async (projectId: string) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tasks/types`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getTasksPriority = async (projectId: string) => {
  return await instance
    .get(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tasks/priority`,
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
export const getTaskStatus = async (projectId: string) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tasks/status`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const deleteTask = async (projectId: string, taskId: string) => {
  return await instance
    .delete(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tasks/${taskId}`,
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
