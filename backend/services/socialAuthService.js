import axios from 'axios';

const getAccessToken = async (url, data) => await axios({
  url,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  data: {
    ...data,
    grant_type: 'authorization_code',
  },
});

const getUserInfo = async (url, accessToken) => await axios({
  url,
  method: 'GET',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

module.exports = {
  google: {
    getAccessToken: async (code, redirectUri) => await getAccessToken(process.env.GOOGLE_ACCESS_TOKEN_URI, {
      code,
      redirect_uri: redirectUri,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    getUserInfo: async (accessToken) => await getUserInfo(process.env.GOOGLE_USER_PROFILE_URI, accessToken),
  },
  linkedin: {
    getAccessToken: async (code, redirectUri) => await getAccessToken(process.env.LINKEDIN_ACCESS_TOKEN_URI, {
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    getUserInfo: async (accessToken) => {
      let email = await getUserInfo(process.env.LINKEDIN_USER_EMAIL_URI, accessToken);
      if (email.data.elements.length) {
        email = email.data.elements.pop()['handle~'];
      }
      const userInfo = await getUserInfo(process.env.LINKEDIN_USER_PROFILE_URI, accessToken);
      const picture = userInfo.data.profilePicture['displayImage~'].elements[0].identifiers[0].identifier;
      const { localizedFirstName, localizedLastName } = userInfo.data;
      return {
        data: {
          localizedFirstName,
          localizedLastName,
          picture,
          ...email,
        },
      };
    },
  },
};
