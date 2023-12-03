import authHeader from './auth-header';
import { API } from '../config/config';
import instance from './axiosInstance';
import { IBaseResponse } from '../models/IBaseResponse';
import { IJobs, JobStatus } from '../models/IJobs';
import { CaptureMode } from '../models/ICapture';

export const getjobsInfo = async (projectId: string) => {
  try {
    return await instance.get(
      `${API.BASE_URL}/projects/${projectId}/jobs`,
      {
        headers: authHeader.authHeader(),
      }
    );
  } catch (error) {
    throw error;
  }
};

export const updateTheJobStatus = async (
  projectId: string,
  jobId: string,
  status: string
) => {
  try {
    return await instance.put(
      `${API.BASE_URL}/projects/${projectId}/jobs/${jobId}/updateStatus`,
      { status: status },
      {
        headers: authHeader.authHeader(),
      }
    );
  } catch (error) {
    throw error;
  }
};
export const updateSelectedCapturesInJob = async (
  projectId: string,
  jobId: string,
  captureIds: string[]
) => {
  try {
    return await instance.put(
      `${API.BASE_URL}/projects/${projectId}/jobs/${jobId}/update-selected-captures`,
      { captureIds: captureIds },
      {
        headers: authHeader.authHeader(),
      }
    );
  } catch (error) {
    throw error;
  }
};
export const getjobs = async (projectId: string) => {
  return await instance.get<IBaseResponse<IJobs[]>>(
    `${API.BASE_URL}/projects/${projectId}/jobs?status=pendingUpload,uploaded&mode=Drone Image`,
    {
      headers: authHeader.authHeader(),
    }
  )
};
interface Job {
  status: string;
  jobId: string;
}
export const updateMultipleJobStatus = async (
  projectId: string,
  jobs:Job[]
) => {
  try {
    return await instance.put(
      `${API.BASE_URL}/projects/${projectId}/jobs/updateMultipleStatus`,
      jobs,
      {
        headers: authHeader.authHeader(),
      }
    );
  } catch (error) {
    throw error;
  }
};
export const updateJobStatus = async (
  projectId: string,
  jobId: string,
  status: string,
  ignoreImagesCheck?:boolean
) => {
  try {
    let url = `${API.BASE_URL}/projects/${projectId}/jobs/${jobId}/updateStatus`
    if(ignoreImagesCheck)
    {
     url = `${url}?ignoreImagesCheck=true`
    }
    return await instance.put(
     url,
      {status},
      {
        headers: authHeader.authHeader(),
      }
    );
  } catch (error) {
    return error;
  }
};

export const getJobsByStatus = async (projectId: string, status: JobStatus[]) => {
  return await instance.get<IBaseResponse<IJobs[]>>(
    `${API.BASE_URL}/projects/${projectId}/jobs?status=${status.join(",")}`,
    {
      headers: authHeader.authHeader(),
    }
  )
};

export const getJobsByStatusMode = async (projectId: string, status: JobStatus[], mode: CaptureMode) => {
  return await instance.get<IBaseResponse<IJobs[]>>(
    `${API.BASE_URL}/projects/${projectId}/jobs?status=${status.join(",")}&mode=${mode}&populate=captures`,
    {
      headers: authHeader.authHeader(),
    }
  )
};