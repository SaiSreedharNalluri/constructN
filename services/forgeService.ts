import { API } from "../config/config";
import authHeader from "./auth-header";
import instance from "./axiosInstance";
import { getCookie, setCookie } from "cookies-next";


export const cachedAutodeskAuth = async () => {
  console.log(`Inside AutodeskToken cached auth`)
  var expiryH1 = new Date();
  expiryH1.setTime(expiryH1.getTime() + 1 * 3598 * 1000);
  
  try {
    let apsCookie = getCookie("APSToken");
    // console.log(`Inside AutodeskToken cached auth: getCookie`, cookie_res_);
    let apsCookieJSON = null;
    if (apsCookie) {
      apsCookieJSON = JSON.parse(apsCookie as string);
    }
    if (apsCookieJSON) {
      console.log(`Inside expiry AutodeskToken auth: cookie json`, apsCookieJSON);
      return apsCookieJSON;
    }
    let response = await instance
      .get(`${API.BASE_URL}/aps/getAPSToken`, {
        headers: authHeader.authHeader(),
      });
      
      // .then((response) => {
        let result = response?.data?.result;
        console.log(`Inside AutodeskToken cached auth: api`, result);
        // setCookie("APSToken", JSON.stringify(response), { expires: expiryH1 });
        
        setCookie("APSToken", JSON.stringify(result), {
          maxAge: result?.expires_in,
        });
        return response;
      // });
  } catch (error) {
    throw error;
  }
};

export const autodeskAuth = () => {
  console.log(`Inside AutodeskToken auth`)
  try {
      return instance.get(
      `${API.BASE_URL}/aps/getAPSToken`,
      {
        headers: authHeader.authHeader(),
      }
    ); 
  } catch (error) {
    throw error;
  }
};
