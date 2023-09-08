import authHeader from "./auth-header";
import instance from "./axiosInstance";
import { getCookie, setCookie } from "cookies-next";


export const cachedAutodeskAuth = () => {
  var expiryH1 = new Date();
  expiryH1.setTime(expiryH1.getTime() + 1 * 3598 * 1000);
  
  try {
    let cookie_res_ = getCookie("APSToken");
    let cookie_res = null
    if(cookie_res_)
    cookie_res= JSON.parse(cookie_res_ as string) 
    if(cookie_res){
      console.log(`Inside expiry autodesk auth`,cookie_res)
      return cookie_res
    }
       instance.get(
      `${process.env.NEXT_PUBLIC_HOST}/aps/getAPSToken`,
      {
        headers: authHeader.authHeader(),
      }
    ).then((response)=>{
      setCookie("APSToken",JSON.stringify(response),{expires:expiryH1});
      return response;
      
    }); 
  } catch (error) {
    throw error;
  }
};
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
