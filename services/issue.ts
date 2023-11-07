import instance from "./axiosInstance";
import authHeader from "./auth-header";
import { API } from "../config/config";
export const createIssue = (projectId: string, issueObj: object) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/issues`,
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
      `${API.BASE_URL}/projects/${projectId}/issues?structure=${structureId}`,
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
    .get(`${API.BASE_URL}/projects/${projectId}/issues/types`, {
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
      `${API.BASE_URL}/projects/${projectId}/issues/priority`,
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
      `${API.BASE_URL}/projects/${projectId}/issues/status`,
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

export const getIssueTags = async (projectId: string) => {
 
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

export const deleteIssue = async (projectId: string, IssueId: string) => {
  return await instance
    .delete(
      `${API.BASE_URL}/projects/${projectId}/issues/${IssueId}`,
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
export const editIssue = (
  projectId: string,
  issueObj: object,
  issueId: string
) => {
  return instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/issues/${issueId}`,
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
export const createIssueWithAttachments = (
  projectId: string,
  issueObj: object
) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/issues/addissueWithScreenshotAndAttachment`,
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

export const getIssuesPriorityList = async (projectId: string) => {
  return await instance
    .get(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/priority-list/get`,
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

export const getIssueTypeList = async (projectId: string) => {
  return await instance
    .get(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/type-list/get`,
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

export const getIssueStatusList = async (projectId: string) => {
  return await instance
    .get(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/status-list/get`,
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

export const updateIssueTypeListApi = async (
  projectId: string,
  issueTypeList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/type-list/update`,
      { issueTypeList },
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

export const updateIssuePriorityListApi = async (
  projectId: string,
  issuePriorityList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/priority-list/update`,
      { issuePriorityList },
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

export const updateIssueStatusListApi = async (
  projectId: string,
  issueStatusList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/status-list/update`,
      { issueStatusList },
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

export const addIssuePriorityApi = async (
  projectId: string,
  issuePriorityList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/priority-list/push`,
      { issuePriorityList },
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
export const removePriorityTypeApi = async (
  projectId: string,
  issuePriorityList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/priority-list/pop`,
      { issuePriorityList },
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

export const addIssueTypeApi = async (
  projectId: string,
  issueTypeList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/type-list/push`,
      { issueTypeList },
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
export const removeIssueTypeApi = async (
  projectId: string,
  issueTypeList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/type-list/pop`,
      { issueTypeList },
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

export const addIssueStatusApi = async (
  projectId: string,
  issueStatusList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/status-list/push`,
      { issueStatusList },
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

export const removeIssueStatusItemApi = async (
  projectId: string,
  issueStatusList: any
) => {
  return await instance
    .put(
      `${API.BASE_URL}/projects/${projectId}/typeLists/issue/status-list/pop`,
      { issueStatusList },
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
