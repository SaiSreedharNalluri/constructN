import axios from 'axios';
import { removeCookies } from 'cookies-next';
// eslint-disable-next-line react-hooks/rules-of-hooks

const instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error

    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const {
      config,
      response: { status },
    } = error;

    if (status === 401) {
      if (typeof window !== 'undefined') {
        removeCookies('user');
        window.location.href = '/login';
      }
    }
    // Do something with response error
    return Promise.reject(error);
  }
);
export default instance;
