import type { AxiosRequestConfig } from "axios";

export interface ApiRequestConfig extends AxiosRequestConfig {
  unwrapResponse?: boolean;
}

export type ApiResponse<T> = {
  data: T;
};
