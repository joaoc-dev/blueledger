import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import ms from 'ms';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: ms('10s'),
});

export class ApiError<TBody = unknown> extends Error {
  status?: number;
  data?: TBody;
  headers?: Record<string, unknown>;
  retryAfter?: number;
  constructor(message: string, opts?: { status?: number; data?: TBody; headers?: Record<string, unknown>; retryAfter?: number }) {
    super(message);
    this.status = opts?.status;
    this.data = opts?.data;
    this.headers = opts?.headers;
    this.retryAfter = opts?.retryAfter;
  }
}

async function apiRequest<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const response = await request;
    return response.data;
  }
  catch (err) {
    const error = err as AxiosError<any>;
    const status = error.response?.status;
    const headers = error.response?.headers as Record<string, unknown> | undefined;
    const data = error.response?.data as { error?: string; retryAfter?: number } | undefined;

    let message = (data?.error ?? error.message ?? 'An unknown error occurred') as string;
    if (typeof message === 'object') {
      try {
        message = JSON.stringify(message);
      }
      catch {
        message = 'An unknown error occurred';
      }
    }

    const retryAfter = typeof data?.retryAfter === 'number' ? data.retryAfter : undefined;

    throw new ApiError(message, { status, data, headers, retryAfter });
  }
}

export function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiRequest(apiClient.get<T>(url, config));
}

export function apiPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiRequest(apiClient.post<T>(url, data, config));
}

export function apiPatch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiRequest(apiClient.patch<T>(url, data, config));
}

export function apiDelete<T = void>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiRequest(apiClient.delete<T>(url, config));
}
