import axios from "axios";
import { deleteCookie, getCookie, removeCookies, setCookie } from "cookies-next";
import { refreshToken } from "./userAuth";
// eslint-disable-next-line react-hooks/rules-of-hooks
let urlExclude = ["signin","reset-password-link-validate"];
let isRefreshing = false;
let refreshSubscribers = [];
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
createAxiosResponseInterceptor();
function createAxiosResponseInterceptor(){
const interceptor=instance.interceptors.response.use(
  (response) => {
    return response;
  },
    (error) => {
    const originalConfig = error.config;
    console.log("Axios Caught Error",error);
    console.log("config error, retry ", originalConfig);
    if (error?.response?.status===401 && 
      hasCommonElement(urlExclude,error?.response?.config?.url?.split("/")) ===false){
      instance.interceptors.response.eject(interceptor);
      console.log("401 My Old Refresh token is",getLocalRefreshToken());
      return refreshToken(getLocalRefreshToken()).then((response)=>{
        console.log("401 My New Refresh token is",getLocalRefreshToken());
        error.response.config.headers["Authorization"]="Bearer "+ response.token;

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