import { RawImage } from "../models/IRawImages";
import instance from "./axiosInstance";
import authHeader from './auth-header';
import { IBaseResponse } from "../models/IBaseResponse";
import { ICapture } from "../models/ICapture";
export const addCapture = (projectId:string,formValue:{ 
    type:string;
    structure:string;
    mode:string;
    captureDateTime:Date
}) => {
    return instance
      .post<IBaseResponse<ICapture>>(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/captures?populate=jobId`, formValue, {
        headers: authHeader.authHeader(),
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  };

  /**
   * This Function helps you create new capture any number of times for the same structure, date and deviceId
   * @param projectId 
   * @param formValue 
   * @returns 
   */
  export const addNewCaptureOnly = async (projectId:string,formValue:{ 
    type:string;
    structure:string;
    mode:string;
    captureDateTime:Date
}) => {
    try {
      const response = await instance
        .post<IBaseResponse<ICapture>>(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/captures?populate=jobId&createNew=true`, formValue, {
          headers: authHeader.authHeader(),
        });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const addRawImages = (projectId:string,captureID:string,formValue:Array<RawImage>) => {
    return instance
      .post(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/captures/${captureID}/add-raw-image`, formValue, {
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
      .get<IBaseResponse<RawImage[]>>(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/captures/${captureID}/raw-images`, {
        headers: authHeader.authHeader(),
      })
    }
  
  }

  export const addGcp = (projectId:string,captureID:string,formValue:any) => {
    return instance
      .post(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/captures/${captureID}/add-gcp`, formValue, {
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
    .get<IBaseResponse<ICapture>>(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/captures/${captureId}`, {
      headers: authHeader.authHeader(),
    })
  }