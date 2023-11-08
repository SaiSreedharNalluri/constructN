import { RawImage } from "../models/IRawImages";
import instance from "./axiosInstance";
import authHeader from './auth-header';
export const addCapture = (projectId:string,formValue:{ user:string;
    type:string;
    structure:string;
    project:string;
    mode:string;
    mediaPath:string;
    isMediaUploaded:boolean;
    captureDateTime:string
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