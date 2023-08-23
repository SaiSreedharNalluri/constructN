import axios from "axios";
import { removeCookies } from "cookies-next";
// eslint-disable-next-line react-hooks/rules-of-hooks
let urlExclude = ["signin","reset-password-link-validate"];
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
      hasCommonElement(urlExclude,error?.response?.config?.url?.split("/")) ===
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
export const hasCommonElement=(array1:any, array2:any)=>{
  for (let i = 0; i < array1.length; i++) {
    if (array2.includes(array1[i])) {
        return true;
    }
}
return false;
}