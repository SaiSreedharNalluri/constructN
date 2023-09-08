import axios from "axios";
import authHeader from "./auth-header";
import instance from "./axiosInstance";

export const autodeskAuth = () => {
  console.log(`Inside autodesk auth`)
  try {
      return instance.get(
      `${process.env.NEXT_PUBLIC_HOST}/aps/getAPSToken`,
      {
        headers: authHeader.authHeader(),
      }
    ); 
  } catch (error) {
    throw error;
  }
};
