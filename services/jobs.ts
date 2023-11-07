import axios from 'axios';
import authHeader from './auth-header';
import { API } from '../config/config';

export const getjobsInfo = async (projectId: string) => {
  try {
    return await axios.get(
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
    return await axios.put(
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
    return await axios.put(
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
