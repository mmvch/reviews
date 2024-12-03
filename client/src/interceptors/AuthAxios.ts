import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import { LoginService } from '../services/LoginService';

const authAxios: AxiosInstance = axios.create();

authAxios.interceptors.request.use(
  (request) => {
    const token = Cookies.get("auth");

    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      LoginService.logout();
    }
    return Promise.reject(error);
  }
);

export default authAxios;
