import instance from "./axiosInstance";
import { setCookie } from "cookies-next";
export const login = (email: string, password: string) => {
  return instance
    .post(`${process.env.NEXT_PUBLIC_HOST}/users/signin`, {
      email,
      password,
    })
    .then((response) => {
      if (response.data.result) {
        setCookie("user", JSON.stringify(response.data.result));
      }
      return response.data;
    })
    .catch((error) => {
      console.log("error", error);
      throw error;
    });
};
export const registerUser = (registerUserObj: Object) => {
  return instance
    .post(`${process.env.NEXT_PUBLIC_HOST}/users/register`, registerUserObj)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
export const verifyEmail = (token: string) => {
  return instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/users/verify/${token}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const resetPasswordToken = (token: string, password: string) => {
  return instance
    .put(`${process.env.NEXT_PUBLIC_HOST}/users/reset-password/${token}`, {
      password,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const resetPasswordInit = (resetUserEmail: string) => {
  return instance
    .put(
      `${process.env.NEXT_PUBLIC_HOST}/users/reset-password-init`,
      resetUserEmail
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
