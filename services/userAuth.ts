import instance from "./axiosInstance";
import { setCookie, getCookie } from "cookies-next";
import authHeader from "./auth-header";
export const login = (email: string, password: string) => {
  return instance
    .post(`${process.env.NEXT_PUBLIC_HOST}/users/signin`, {
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
    .post(`${process.env.NEXT_PUBLIC_HOST}/users/register`, registerUserObj)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
export const verifyEmail = (token: string) => {
  return instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/users/verify/${token}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const verifyResendEmail = (email:string) => {
 return instance
    .put(`${process.env.NEXT_PUBLIC_HOST}/users/resend-verification-link`, {
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
    .put(`${process.env.NEXT_PUBLIC_HOST}/users/reset-password/${token}`, {
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
    .put(`${process.env.NEXT_PUBLIC_HOST}/users/reset-password-init`,requestData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getUserProfile = async () => {
  return await instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/users/profile`, {
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
    .put(`${process.env.NEXT_PUBLIC_HOST}/users/profile`, updateInfo, {
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
    .put(`${process.env.NEXT_PUBLIC_HOST}/users/profile/avatar`, file, {
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
    .put(`${process.env.NEXT_PUBLIC_HOST}/users/change-password`, updateInfo, {
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
    .get(`${process.env.NEXT_PUBLIC_HOST}/users/resend-verification-link`, {
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
    .get(`${process.env.NEXT_PUBLIC_HOST}/users/resend-verification/${token}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const validatePasswordToken = (token: string) => {
  return instance
    .get(`${process.env.NEXT_PUBLIC_HOST}/users/reset-password-link-validate/${token}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('error',error)
      throw error.response.data;
    });
};


