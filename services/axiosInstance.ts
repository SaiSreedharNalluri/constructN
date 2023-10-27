import axios from "axios";
import { deleteCookie, getCookie, removeCookies, setCookie } from "cookies-next";
import { refreshToken } from "./userAuth";
import CustomLoggerClass from "../components/divami_components/custom_logger/CustomLoggerClass";
// eslint-disable-next-line react-hooks/rules-of-hooks
let urlExclude = ["signin","reset-password-link-validate"];
let isRefreshing = false;
let refreshSubscribers:any = [];
const instance = axios.create();

function onRefreshed(authorisationToken :string) {
  refreshSubscribers.map((cb:any) => cb(authorisationToken));
}

function subscribeTokenRefresh(cb:any) {
  refreshSubscribers.push(cb);
}

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
createAxiosResponseInterceptor();
function createAxiosResponseInterceptor(){
  const customLogger= new CustomLoggerClass();
const interceptor=instance.interceptors.response.use(
  (response) => {
    if(response.data.success===false){
      // Sentry.captureException(response.data.message)
  }
    return response;
  },
    (error) => {
    customLogger.logError(error)
    const originalConfig = error.config;
    console.log("Axios Caught Error",error);
    console.log("config error, retry ", originalConfig);
    
    if (error?.response?.status===401 && 
      hasCommonElement(urlExclude,error?.response?.config?.url?.split("/")) ===false){
      instance.interceptors.response.eject(interceptor);
      // console.log("401 My Old Refresh token is",getLocalRefreshToken());
      if(isRefreshing){
        return new Promise(resolve => {
          subscribeTokenRefresh((token:string) => {
            error.response.config.headers.Authorization = `Bearer ${token}`;
            // console.log("...",token)
            resolve(instance(error.response.config));
          });
        });
      }
      isRefreshing=true;
      return refreshToken(getLocalRefreshToken()).then((response)=>{
        // console.log("401 My New Refresh token is",getLocalRefreshToken());
        error.response.config.headers["Authorization"]="Bearer "+ response.token;
        isRefreshing = false;
        onRefreshed(response.token);
        refreshSubscribers=[];
      // const userObj: any = getCookie("user");
      // let user = null;
      // if (userObj) {
      //   user = JSON.parse(userObj);
      //   user.refreshToken = response.refreshToken;
      //   user.token = response.token;
        
      //   setCookie("user", JSON.stringify(user));

      // }
        return instance(error.response.config);

      })
      .catch((error2)=>{
        deleteCookie("user");
        deleteCookie('projectData')
        deleteCookie('isProjectTimeZone')
        if (typeof window !== "undefined") {
            console.log("Moving Out....",error2.config);
            window.location.href = `/login?history=${window.location.href}&reason=SessionExpiry`;
        }
        return Promise.reject(error2);
      })
      .finally(createAxiosResponseInterceptor);
      
    }
   
    // Do something with response error
    return Promise.reject(error);
  }
);
return ;
}
export default instance;
export const hasCommonElement=(array1:any, array2:any)=>{
  console.log(array1,array2," 401 error arrays 1 2")
  for (let i = 0; i < array1.length; i++) {
    if (array2.includes(array1[i])) {
        return true;
    }
}
return false;
}


function getLocalRefreshToken(){
  const userObj: any = getCookie("user");
  let user = null;
  if (userObj) {
    user = JSON.parse(userObj);
    return user.refreshToken
  }   

    return ""
  
}