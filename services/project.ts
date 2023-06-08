import instance from "./axiosInstance";
import authHeader from "./auth-header";
export const getProjects = async () => {
  try {
    return await instance.get(`${process.env.NEXT_PUBLIC_HOST}/projects`, {
      headers: authHeader.authHeader(),
    });
  } catch (error) {
    throw error;
  }
};

export const getProjectsList = async () => {
  try {
    return await instance.get(
      `${process.env.NEXT_PUBLIC_HOST}/views/web/projectlist`,
      {
        headers: authHeader.authHeader(),
      }
    );
  } catch (error) {
    throw error;
  }
};

export const getProjectDetails = async (projectId: string) => {
  try {
    return await instance.get(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}`,
      {
        headers: authHeader.authHeader(),
      }
    );
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
export const getProjectUsers = async (projectId: string) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/users`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("error", error);
      throw error;
    });
};

export const getUserRoles = async () => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/get-project-roles`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("error", error);
      throw error;
    });
};

export const addUserRoles = async (projectInfo: Object, projectId: string) => {
  return await instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/multiple-user-assign`,
      projectInfo,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("error", error);
      throw error;
    });
};

export const updateProjectInfo = async (
  projectInfo: Object,
  projectId: string
) => {
  return await instance
    .put(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}`, projectInfo, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const assignProjectUser = async (
  newProjectUser: Object,
  projectId: string
) => {
  return await instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/assign-user`,
      newProjectUser,
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
export const removeProjectUser = async (email: string, projectId: string) => {
  return await instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/deassign-user`,
      { email },
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
export const updateProjectUserRole = async (
  ProjectUser: Object,
  projectId: string
) => {
  return await instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/change-user-role`,
      ProjectUser,
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
export const updateProjectCover = async (file: any, projectId: string) => {
  return await instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/cover-photo`,
      file,
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
export const getProjectTypes = async () => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/types`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("error", error);
      throw error;
    });
};
export const getScheduleViewData = async (projectId: string) => {
  return await instance
    .get(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/activities/project-plan`,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("error", error);
      throw error;
    });
};
export const getGanttViewData = async (projectId: string) => {
  return await instance
    .get(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/activities/gantt`,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("error", error);
      throw error;
    });
};
