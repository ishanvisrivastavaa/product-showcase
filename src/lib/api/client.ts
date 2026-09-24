import axios from "axios";
import type { AxiosError } from "axios";

import { API_BASE_URL, API_TIMEOUT_MS } from "@/config/api.config";

import { ApiError } from "./errors";
import type { ApiRequestConfig, ApiResponse } from "./types";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<unknown>) => {
    const fallbackMessage = "An unexpected error occurred.";

    const message = error instanceof Error ? error.message : fallbackMessage;

    const status =
      typeof error.response?.status === "number" ? error.response.status : 0;

    return Promise.reject(new ApiError(message, status));
  },
);

export const apiClient = {
  get: async <T>(url: string, config: ApiRequestConfig = {}): Promise<T> => {
    const { params, unwrapResponse = true, ...axiosConfig } = config;

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
