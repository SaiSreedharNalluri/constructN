import { RawImage } from "../models/IRawImages";
import instance from "./axiosInstance";
import authHeader from './auth-header';
import { IBaseResponse } from "../models/IBaseResponse";
export const addCapture = (projectId:string,formValue:{ 
    type:string;
    structure:string;
    mode:string;
    captureDateTime:Date
}) => {
    return instance
      .post(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/captures`, formValue, {
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
    return instance
      .get<IBaseResponse<RawImage[]>>(`${process.env.NEXT_PUBLIC_HOST}/projects/${projectId}/captures/${captureID}/raw-images`, {
        headers: authHeader.authHeader(),
      })
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