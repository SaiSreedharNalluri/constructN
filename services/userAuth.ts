import instance from "./axiosInstance";
import { setCookie, getCookie,deleteCookie } from "cookies-next";
import authHeader from "./auth-header";
import { API } from "../config/config";
export const login = (email: string, password: string) => {
  return instance
    .post(`${API.BASE_URL}/users/signin`, {
      email,
      password,
    })
    .then((response) => {
      // if (
      //   response.data.success === true &&
      //   response.data.result.verified === true
      // ) {
      //   setCookie("user", JSON.stringify(response.data.result));
      // }
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
export const registerUser = (registerUserObj: Object) => {
  return instance
    .post(`${API.BASE_URL}/users/register`, registerUserObj)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
export const verifyEmail = (token: string) => {
  return instance
    .get(`${API.BASE_URL}/users/verify/${token}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const verifyResendEmail = (email:string) => {
 return instance
    .put(`${API.BASE_URL}/users/resend-verification-link`, {
      email,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const resetPasswordToken = (token: string, password: string) => {
  return instance
    .put(`${API.BASE_URL}/users/reset-password/${token}`, {
      password,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const resetPasswordInit = (email: string | null,token:string | null) => {
  let requestData={};
  if(email!=null){
    requestData={email:email}
  }else{
    requestData={token:token};
  }
  return instance
    .put(`${API.BASE_URL}/users/reset-password-init`,requestData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getUserProfile = async () => {
  return await instance
    .get(`${API.BASE_URL}/users/profile`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const updateUserProfile = async (updateInfo: object) => {
  return await instance
    .put(`${API.BASE_URL}/users/profile`, updateInfo, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      const userObj: any = getCookie("user");
      let user = null;
      if (userObj) {
        user = JSON.parse(userObj);
        //user.avatar = response.data.avatar;
        user.firstName = response.data.result.firstName;
        user.lastName = response.data.result.lastName;
        user.fullName = response.data.result.fullName;
        user.dob = response.data.result.dob;
        setCookie("user", JSON.stringify(user));
      }

      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const updateProfileAvatar = async (file: any) => {
  return await instance
    .put(`${API.BASE_URL}/users/profile/avatar`, file, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      const userObj: any = getCookie("user");
      let user = null;
      if (userObj) {
        user = JSON.parse(userObj);
        user.avatar = response.data.result.avatar;
        setCookie("user", JSON.stringify(user));
      }

      return response.data;
    })
    .catch((error) => {
      throw error.response?.data;
    });
};
export const changePassword = async (updateInfo: object) => {
  return await instance
    .put(`${API.BASE_URL}/users/change-password`, updateInfo, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const ResendEmailVerificationLink = async (token: string) => {
  return await instance
    .get(`${API.BASE_URL}/users/resend-verification-link`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const ResendEmailVerification = (token: string) => {
  return instance
    .get(`${API.BASE_URL}/users/resend-verification/${token}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const validatePasswordToken = (token: string) => {
  return instance
    .get(`${API.BASE_URL}/users/reset-password-link-validate/${token}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('error',error)
      throw error.response.data;
    });
};
export const refreshToken = (token: string) => {
  return instance
    .put(`${API.BASE_URL}/users/get-access-token`,{refreshToken:token},{
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      const userObj: any = getCookie("user");
      let user = null;
      if (userObj) {
        user = JSON.parse(userObj);
        user.refreshToken = response.data.refreshToken;
        user.token = response.data.token;
        
        setCookie("user", JSON.stringify(user));
      }
      return response.data;
    })
    .catch((error) => {
      console.log('refreshTokenerror',error)
      deleteCookie("user");
          if (typeof window !== "undefined") {
            //localStorage.setItem("previousPage", window.location.href);
            console.log("Moving Out....",error.config);
            window.location.href = `/login?history=${encodeURIComponent(window.location.pathname+window.location.search)}&reason=rTokenExpired`;
            return Promise.reject(error);
          }
      throw error.response.data;
    });
};


