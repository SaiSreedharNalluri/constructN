import axios from "axios";
import {
  deleteCookie,
  getCookie,
  removeCookies,
  setCookie,
} from "cookies-next";
import { refreshToken } from "./userAuth";
import CustomLoggerClass from "../components/divami_components/custom_logger/CustomLoggerClass";
import { procorerefreshToken } from "./procore";

let urlExclude = ["signin", "reset-password-link-validate"];
let isRefreshing = false;
let refreshSubscribers: any = [];
const procoreinstance = axios.create();

function onRefreshed(authorisationToken: string) {
  refreshSubscribers.map((cb: any) => cb(authorisationToken));
}

function subscribeTokenRefresh(cb: any) {
  refreshSubscribers.push(cb);
}

procoreinstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error

    return Promise.reject(error);
  }
);
createAxiosResponseInterceptor();
function createAxiosResponseInterceptor() {
  const customLogger = new CustomLoggerClass();
  const interceptor = procoreinstance.interceptors.response.use(
    (response) => {
      if (response.data.success === false) {
        return response
        // Sentry.captureException(response.data.message)
      }
      return response;
    },
    (error) => {
      customLogger.logError(error);
      const originalConfig = error.config;
      console.log("Axios Caught Error", error);
      console.log("config error, retry ", originalConfig);

      if (error.response.status===401) {
        procoreinstance.interceptors.response.eject(interceptor);
        console.log("401 My Old Refresh token is", getLocalRefreshToken());
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              error.config.headers.Authorization = `Bearer ${token}`;
              console.log("...", token);
              resolve(procoreinstance(error.config));
            });
          });
        }
        isRefreshing = true;
        return procorerefreshToken()
          .then((response) => {
            const procoreToken = response.metadata.procore;
            error.config.headers["Authorization"] =
              "Bearer " + procoreToken.accessToken;

            isRefreshing = false;
            onRefreshed(procoreToken.accessToken);
            refreshSubscribers = [];
            // const userObj: any = getCookie("user");
            // let user = null;
            // if (userObj) {
            //   user = JSON.parse(userObj);
            //   user.refreshToken = response.refreshToken;
            //   user.token = response.token;

            //   setCookie("user", JSON.stringify(user));

            // }
            return procoreinstance(error.config);
          })
          .catch((error2) => {})
          .finally(createAxiosResponseInterceptor);
      }

      // Do something with response error
      return Promise.reject(error);
    }
  );
  return;
}
export default procoreinstance;
export const hasCommonElement = (array1: any, array2: any) => {
  console.log(array1, array2, " 401 error arrays 1 2");
  for (let i = 0; i < array1.length; i++) {
    if (array2.includes(array1[i])) {
      return true;
    }
  }
  return false;
};

function getLocalRefreshToken() {

  const userObj: any = localStorage.getItem("userCredentials");
  let user = null;

  if (userObj) user = JSON.parse(userObj);
  const procoreToken = user.metadata.procore;
  if (procoreToken) {
    return procoreToken.accessToken;
  }

  return "";
}
