import axios from "axios";
import type { AxiosError } from "axios";

import { API_BASE_URL, API_TIMEOUT_MS } from "@/config/api.config";

import { ApiError } from "./errors";
import type { ApiRequestConfig, ApiResponse } from "./types";

export const getErrorMessageByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return "The request was invalid. Please check your input.";
    case 401:
      return "You are not authorized to view this resource.";
    case 403:
      return "Access to this resource is forbidden.";
    case 404:
      return "The requested resource could not be found.";
    case 429:
      return "Too many requests. Please slow down and try again.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "A server error occurred. Please try again later.";
    default:
      return "An unexpected error occurred.";
  }
};

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<unknown>) => {
    const status =
      typeof error?.response?.status === "number" ? error.response.status : 0;
    const message = getErrorMessageByStatus(status);
    return Promise.reject(new ApiError(message, status));
  },
);

export const apiClient = {
  get: async <T>(url: string, config: ApiRequestConfig = {}): Promise<T> => {
    const { params, unwrapResponse = false, ...axiosConfig } = config;

    const response = await httpClient.get<unknown>(url, {
      ...axiosConfig,
      params,
    });

    if (unwrapResponse) {
      return (response.data as ApiResponse<T>).data;
    }

    return response.data as T;
  },
};
