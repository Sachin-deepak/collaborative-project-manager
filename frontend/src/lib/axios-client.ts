import { useStore } from '@/store/store';
import { CustomError } from '@/types/custom-error.type';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const API = axios.create(options);

API.interceptors.request.use(
  (config) => {
    const accessToken = useStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('Response error:', error);

    if (!error.response) {
      // Network error
      const customError: CustomError = {
        ...error,
        errorCode: 'NETWORK_ERROR',
        message: 'Network error. Please check your internet connection.',
      };
      return Promise.reject(customError);
    }

    const { data, status } = error.response;

    if (status === 401) {
      useStore.getState().clearAccessToken();
      window.location.href = '/';
      return Promise.reject(error);
    }

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || 'UNKNOWN_ERROR',
      message: data?.message || error.message || 'Something went wrong',
    };

    return Promise.reject(customError);
  }
);

export default API;

