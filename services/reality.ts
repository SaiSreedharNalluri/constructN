import axios from "axios";
import { IReality } from "../models/IReality";
import instance from './axiosInstance';
import authHeader from "./auth-header";

export const getPointCloudTM = async (
    path: string
) => {
  try {
      return await instance.get(
      `${path}/pointcloud/tm.json`
    ); 
  } catch (error) {
    console.log("Error TmJson:", error);

  }
};

export const getPointCloud = async (
  path: string
) => {
try {
    return await instance.get(
    `${path}/pointcloud/cloud.json`
  ); 
} catch (error) {
  console.log("Error Cloud.json:", error);

}
};

export const getRealityPositions = async (
  path: string
  ) => {
  try {
    return await instance.get(
      `${path}/images.json`
    );
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getRealityPositionsPath = (
  path: string
  ) => {
    return `${path}/images.json`
}

export const getRealityImagesPath = (
  path: string
  ) => {
    return `${path}/images`
}

export const getOrthoPhotoLayers = async (
  path: string
  ) => {
    try {
      return await instance.get(
      `${path}/_layers`
    ); 
  } catch (error) {
    console.log("Error _layers.json:", error);
  
  }
}


