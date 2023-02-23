import { getCookie } from 'cookies-next';

const authHeader = () => {
  try {
    const userObj: any = getCookie('user');
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    } else {
      return { Authorization: '' };
    }
  } catch (error) {
    throw error;
  }
};
const authCookieHeader = (context: any) => {
  try {
    if (
      context?.req?.cookies?.user != undefined &&
      context.req.cookies.user != ''
    ) {
      const userObj = JSON.parse(context.req.cookies.user);
      if (userObj.token) {
        return { Authorization: 'Bearer ' + userObj.token };
      } else {
        return { Authorization: '' };
      }
    }
  } catch (error) {
    throw error;
  }
};
const getAuthToken = () => {
  try {
    const userObj: any = getCookie('user');
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user && user.token) {
      return user.token;
    } else {
      return { Authorization: '' };
    }
  } catch (error) {
    throw error;
  }
};
export default { authHeader, authCookieHeader, getAuthToken };