import instance from './axiosInstance';
import { setCookie } from 'cookies-next';
export const login = (email: string, password: string) => {
  return instance
    .post(`${process.env.NEXT_PUBLIC_HOST}/users/signin`, {
      email,
      password,
    })
    .then((response) => {
      if (response.data.result) {
        setCookie('user', JSON.stringify(response.data.result));
      }
      return response.data;
    })
    .catch((error) => {
      console.log('error', error);
      throw error;
    });
};
export const registerUser = (registerUserObj: any) => {
  return instance
    .post(`${process.env.NEXT_PUBLIC_HOST}/users/register`, registerUserObj)
    .then((response) => {
      if (response.data.result) {
        setCookie('user', JSON.stringify(response.data.result));
      }
      return response.data;
    })
    .catch((error) => {
      console.log('error', error);
      throw error;
    });
};
