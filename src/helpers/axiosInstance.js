import {Alert} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import * as Notifications from 'expo-notifications';

import settings from '../config/settings';
import {navigate} from '../navigation/RootNavigator';

let headers = {};

const axiosInstance = axios.create({
  baseURL: settings.API_URL,
  headers,
});

// axiosInstance.interceptors.request.use(
//     async (config) => {
//         const token = await AsyncStorage.getItem('token');
//         if (token) {
//             ;
//             config.headers.Authorization = token
//             Notifications.setNotificationHandler({
//                 handleNotification: async () => ({
//                     shouldShowAlert: true,
//                     shouldPlaySound: true,
//                     shouldSetBadge: false,
//                 }),
//             });
//             // config.headers = {
//             //     'Authorization': token,
//             //     // 'Content-Type': 'application/json'
//             // }
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     },
// );

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await refreshAccessToken();
      AsyncStorage.setItem('token', access_token);
      axiosInstance.defaults.headers.common['Authorization'] = access_token;
      return axiosInstance.request(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  let body = JSON.stringify({
    token: refreshToken,
  });
  let headers = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`/token`, body, headers)
      .then(async response => {
        resolve(response.data.accessToken);
      })
      .catch(error => {
        Alert.alert(
          'Session expired',
          'You have been logged out',
          [
            {
              text: 'Ok',
              onPress: () => {
                AsyncStorage.clear();
                navigate('Login', {tokenExpired: true});
              },
            },
          ],
          {cancelable: false},
        );

        reject(error);
      });
  });
};
