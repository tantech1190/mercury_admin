/**
 * MERCURY MYSTERY ADMIN - API SERVICE
 * ====================================
 * Central API configuration and base client
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getApiUrl, API_CONFIG } from '../config/api.config';

// Get API Base URL
const API_BASE_URL = getApiUrl();

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
});

// Log API configuration in development
if (typeof process !== 'undefined' && (process.env?.NODE_ENV === 'development' || !process.env?.NODE_ENV)) {
  console.log('🚀 API Client initialized:', {
    baseURL: API_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    withCredentials: API_CONFIG.WITH_CREDENTIALS,
  });
}

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // In browser environment, reload to trigger login page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Helper function to get error details
export const getErrorDetails = (error: any) => {
  return {
    message: handleApiError(error),
    status: error.response?.status,
    data: error.response?.data,
  };
};
