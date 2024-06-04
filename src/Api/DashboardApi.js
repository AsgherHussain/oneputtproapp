import axios from '../helpers/axiosInstance';
import {getLoginData} from '../helpers/asyncStorage';

const limit = 10;

const GetAllSessionListData = async () => {
  const res = await getLoginData();
  return axios({
    method: 'GET',
    url: `/PuttManagement/GetAllSessionByUserId/${res.user_id}`,
  });
};

const GetPuttListData = async sessionId => {

  const res = await getLoginData();
  return axios({
    method: 'GET',
    url: `/PuttManagement/getPuttHistoryByUserIdandSessionId/${res.user_id}/${sessionId}`,
  });
};

const GetBestPuttListData = async () => {
  const res = await getLoginData();
  return axios({
    method: 'GET',
    url: `/PuttManagement/getBestPuttByUserid/${res.user_id}/${limit}`,
  });
};

const GetSinglePuttData = async (puttId) => {
  return axios({
    method: 'GET',
    url: `/PuttManagement/getPuttDetailsById/${puttId}`,
  });
};

const GetSessionPerformaceData = async(sessionId)=>{
  const res = await getLoginData();
  return axios({
    method: 'GET',
    url: `/PuttManagement/getLineChartDataByUserIdandSessionId/${res.user_id}/${sessionId}`,
  });
}

const DeleteSessionById = async(sessionId)=>{
  const res = await getLoginData();
  return axios({
    method: 'GET',
    url: `/PuttManagement/deleteSessionAndPuttbyUserIdandSessionId/${res.user_id}/${sessionId}`,
  });
}

const LogoutApi = async data => {
  return axios({
    method: 'PUT',
    url: '/UserManagement/logout',
    data,
  });
};





export {
  GetAllSessionListData,
  GetPuttListData,
  GetBestPuttListData,
  GetSinglePuttData,
  GetSessionPerformaceData,
  DeleteSessionById,
  LogoutApi
};
