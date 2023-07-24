import axios from "axios";
import { removeCookies } from "cookies-next";
// eslint-disable-next-line react-hooks/rules-of-hooks
let urlExclude = ["signin"];
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
    console.log(error?.response)
    if (
      error?.response?.status === 401 &&
      (error?.response?.data?.userVerificationToken || 
      (error?.response?.request.responseURL && error?.response?.request.responseURL.indexOf('change-password') > -1))
    ) {
    } else if (
      error?.response?.status === 401 &&
      urlExclude.includes(error?.response?.config?.url?.split("/")?.pop()) ===
        false
    ) {
      if (typeof window !== "undefined") {
        localStorage.setItem("previousPage", window.location.href);
        removeCookies("user");
        window.location.href = `/login?history=${window.location.href}`;
      }
    }
    // Do something with response error
    return Promise.reject(error);
  }
);
export default instance;
