import authHeader from './auth-header';
import instance from './axiosInstance';
import { IJobs, JobStatus } from '../models/IJobs';
import { IBaseResponse } from '../models/IBaseResponse';

export const getjobsInfo = async (projectId: string) => {
  try {
    return await instance.get(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/jobs`,
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
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/jobs/${jobId}/updateStatus`,
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
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/jobs/${jobId}/update-selected-captures`,
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
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/jobs?status=pendingUpload,uploaded&mode=Drone Image`,
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
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/jobs/updateMultipleStatus`,
      {jobs},
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
  jobId:string,
  status: string
) => {
  try {
    return await instance.put(
      `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/jobs/${jobId}/updateStatus`,
      {status},
      {
        headers: authHeader.authHeader(),
      }
    );
  } catch (error) {
    throw error;
  }
};

export const getJobsByStatus = async (projectId: string, status: JobStatus[]) => {
  return await instance.get<IBaseResponse<IJobs[]>>(
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/jobs?status=${status.join(",")}`,
    {
      headers: authHeader.authHeader(),
    }
  )
};