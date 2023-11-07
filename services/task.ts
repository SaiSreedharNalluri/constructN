import instance from "./axiosInstance";
import authHeader from "./auth-header";
import { API } from "../config/config";
export const createTask = (projectId: string, taskObj: object) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/tasks`,
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
      `${API.BASE_URL}/projects/${projectId}/tasks/${taskId}`,
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
    .post(`${API.BASE_URL}/attachments?entity=${id}`, file, {
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
  console.log("getTasksList", projectId, structureId);
  return await instance
    .get(
      `${API.BASE_URL}/projects/${projectId}/tasks?structure=${structureId}`,
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
    .get(`${API.BASE_URL}/projects/${projectId}/tasks/types`, {
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
      `${API.BASE_URL}/projects/${projectId}/tasks/priority`,
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
    .get(`${API.BASE_URL}/projects/${projectId}/tasks/status`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const getTaskTags = async (projectId: string) => {
 
  return await instance
  .get(`${API.BASE_URL}/projects/${projectId}/tags`, {
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
      `${API.BASE_URL}/projects/${projectId}/tasks/${taskId}`,
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
export const getTaskPriorityList = async (projectId: string) => {
  return await instance
    .get(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/priority-list/get`,
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

export const getTaskTypeList = async (projectId: string) => {
  return await instance
    .get(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/type-list/get`,
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

export const getTaskStatusList = async (projectId: string) => {
  return await instance
    .get(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/status-list/get`,
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

export const updateTaskTypeListApi = async (
  projectId: string,
  taskTypeList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/type-list/update`,
      { taskTypeList },
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

export const updateTaskPriorityListApi = async (
  projectId: string,
  taskPriorityList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/priority-list/update`,
      { taskPriorityList },
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

export const updateTaskStatusListApi = async (
  projectId: string,
  taskStatusList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/status-list/update`,
      { taskStatusList },
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

export const addTaskTypesApi = async (
  projectId: string,
  taskPriorityList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/priority-list/push`,
      { taskPriorityList },
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

export const removeTaskTypePriorityApi = async (
  projectId: string,
  taskPriorityList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/priority-list/pop`,
      { taskPriorityList },
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

export const addTaskTypeListsApi = async (
  projectId: string,
  taskTypeList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/type-list/push`,
      { taskTypeList },
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

export const removeTaskTypeListsApi = async (
  projectId: string,
  taskTypeList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/type-list/pop`,
      { taskTypeList },
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

export const addTaskStatusApi = async (
  projectId: string,
  taskStatusList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/status-list/push`,
      { taskStatusList },
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

export const removeTaskStatusListApi = async (
  projectId: string,
  taskStatusList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/task/status-list/pop`,
      { taskStatusList },
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

export const createTaskWithAttachments = (
  projectId: string,
  issueObj: object
) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/tasks/addTaskWithScreenshotAndAttachment`,
      issueObj,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response;
    });
};
