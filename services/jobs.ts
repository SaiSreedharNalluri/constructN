import axios from 'axios';
import authHeader from './auth-header';
import instance from './axiosInstance';
import { IJobs } from '../models/IJobs';
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
    `${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/jobs?withCaptureStatus=true`,
    {
      headers: authHeader.authHeader(),
    }
  )
};