import axios from 'axios';
import { setCookie } from 'cookies-next';
export const login = (email: string, password: string) => {
  return axios
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
