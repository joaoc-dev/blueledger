import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

async function apiRequest<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ error: string }>;

    let message =
      error.response?.data?.error ||
      error.message ||
      'An unknown error occurred';

    if (typeof message === 'object') {
      try {
        message = JSON.stringify(message);
      } catch {
        message = 'An unknown error occurred';
      }
    }

    throw new Error(message);
  }
}

export function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiRequest(apiClient.get<T>(url, config));
}

export function apiPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiRequest(apiClient.post<T>(url, data, config));
}

export function apiPatch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiRequest(apiClient.patch<T>(url, data, config));
}

export function apiDelete<T = void>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiRequest(apiClient.delete<T>(url, config));
}
