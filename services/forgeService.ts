import axios from "axios";

export const autodeskAuth = () => {
    console.log(`Inside autodesk auth`)
  return axios.post(
    "https://developer.api.autodesk.com/authentication/v1/authenticate",
    {
      client_id: "aJRMrmok5UAbsdsXjckJmSBmoNnYKLzM",
      // client_id: 'iXWYm3FVGMhLYLssAQAwdMGMq5HsAwNb',
      client_secret: "mSqemcEE53l4THBJ",
      // client_Secret: 'hPvkyDrWToKUG8c3',
      grant_type: "client_credentials",
      scope: "data:read",
    }
  ).then((response) => {
    console.log(`Auth response: ${response.data}`)
    return response.data
  })
  .catch((error) => {
    console.log('error', error);
    throw error;
  });
};
