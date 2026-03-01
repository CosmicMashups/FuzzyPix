import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/config';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (__DEV__ && config.method && config.url) {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ error?: { code?: string; message?: string; details?: unknown } }>) => {
    if (err.response?.data?.error) {
      const e = err.response.data.error;
      throw new ApiError(
        err.response.status,
        e.code ?? 'UNKNOWN',
        e.message ?? err.message ?? 'Request failed',
        e.details
      );
    }
    if (err.request && !err.response) {
      throw new ApiError(0, 'NETWORK_ERROR', 'Network request failed');
    }
    throw new ApiError(
      err.response?.status ?? 500,
      'UNKNOWN',
      err.message ?? 'Request failed'
    );
  }
);
