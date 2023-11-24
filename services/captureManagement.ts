import { RawImage } from "../models/IRawImages";
import instance from "./axiosInstance";
import authHeader from './auth-header';
import { IBaseResponse } from "../models/IBaseResponse";
import { ICapture } from "../models/ICapture";
import { API } from "../config/config";
export const addCapture = (projectId:string,formValue:{ 
    type:string;
    structure:string;
    mode:string;
    captureDateTime:Date
}) => {
    return instance
      .post(`${API.BASE_URL}/projects/${projectId}/captures?populate=jobId`, formValue, {
        headers: authHeader.authHeader(),
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  };

  export const addRawImages = (projectId:string,captureID:string,formValue:Array<RawImage>) => {
    return instance
      .post(`${API.BASE_URL}/projects/${projectId}/captures/${captureID}/add-raw-image`, formValue, {
        headers: authHeader.authHeader(),
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  };

  export const getRawImages = (projectId:string,captureID:string) => {
    if(captureID===undefined)
    {
      return
    }
    else{
      return instance
      .get<IBaseResponse<RawImage[]>>(`${API.BASE_URL}/projects/${projectId}/captures/${captureID}/raw-images`, {
        headers: authHeader.authHeader(),
      })
    }
  
  }

  export const addGcp = (projectId:string,captureID:string,formValue:any) => {
    return instance
      .post(`${API.BASE_URL}/projects/${projectId}/captures/${captureID}/add-gcp`, formValue, {
        headers: authHeader.authHeader(),
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  };

  export const getCaptureDetails = async (projectId: string, captureId: string) => {
    return await instance
    .get<IBaseResponse<ICapture>>(`${API.BASE_URL}/projects/${projectId}/captures/${captureId}`, {
      headers: authHeader.authHeader(),
    })
  }