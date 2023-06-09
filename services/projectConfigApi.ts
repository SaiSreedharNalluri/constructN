import instance from "./axiosInstance";
import { setCookie, getCookie } from "cookies-next";
import authHeader from "./auth-header";







export const getIssuePriorityList = async (projectId:any) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/typeLists/issue/priority-list/get`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};


export const updateIssuePriorityList = async(projectId:any, issuePriorityList:Object) => {
  return await instance
    .put(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/typeLists/issue/priority-list/update`, issuePriorityList, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      console.log("resissue",response)
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const getTaskPriorityList = async (projectId:any) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/typeLists/task/priority-list/get`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};


export const updateTaskPriorityList = async(projectId:any, taskPriorityList:Object) => {
  return await instance
    .put(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/typeLists/task/priority-list/update`, taskPriorityList, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      console.log("resissue",response)
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};


export const getIssueStatusList = async (projectId:any) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/typeLists/issue/status-list/get`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};


export const updateIssueStatusList = async(projectId:any, issueStatusList:Object) => {
  return await instance
    .put(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/typeLists/issue/status-list/update`, issueStatusList, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      console.log("resissue",response)
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};


export const getTaskStatusList = async (projectId:any) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/typeLists/task/status-list/get`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};


export const updateTaskStatusList = async(projectId:any, taskStatusList:Object) => {
  return await instance
    .put(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/typeLists/task/status-list/update`, taskStatusList, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      console.log("resissue",response)
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};



export const getTagsList = async (projectId:any) => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tags`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};


export const updateTagList = async(projectId:any, tagList:Object) => {
  return await instance
    .put(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/tags/update`, tagList, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      console.log("resissue",response)
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};