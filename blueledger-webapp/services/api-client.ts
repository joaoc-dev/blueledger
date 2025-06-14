import axios, { AxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message =
      error.response?.data?.error ||
      error.message ||
      'An unknown error occurred';

    if (typeof message === 'object') {
      message = JSON.stringify(message);
    }

    return Promise.reject(new Error(message));
  }
);

export function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiClient.get(url, config) as Promise<T>;
}

export function apiPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiClient.post(url, data, config) as Promise<T>;
}

export function apiPatch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiClient.patch(url, data, config) as Promise<T>;
}

export function apiDelete<T = void>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiClient.delete(url, config) as Promise<T>;
}
