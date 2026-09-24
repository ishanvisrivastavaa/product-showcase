jest.mock("axios", () => {
  const mockInstance = {
    get: jest.fn(),
    interceptors: { response: { use: jest.fn() } },
  };
  return {
    __esModule: true,
    default: { create: jest.fn(() => mockInstance) },
  };
});

import axios from "axios";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

// The same instance client.ts received from its module-level axios.create() call.
const mockInstance = (axios.create as jest.Mock).mock.results[0].value;
const mockGet = mockInstance.get as jest.Mock;
const mockUse = mockInstance.interceptors.response.use as jest.Mock;

describe("apiClient", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("registers a single response interceptor", () => {
    expect(mockUse).toHaveBeenCalledTimes(1);
  });

  it("maps a failed request into an ApiError with its status and message", async () => {
    const [, onRejected] = mockUse.mock.calls[0];
    const axiosError = Object.assign(new Error("Not Found"), {
      response: { status: 404 },
    });

    await expect(onRejected(axiosError)).rejects.toMatchObject({
      message: "Not Found",
      status: 404,
    });
    await expect(onRejected(axiosError)).rejects.toBeInstanceOf(ApiError);
  });

  it("falls back to a generic message and status 0 when the error is not a real Error", async () => {
    const [, onRejected] = mockUse.mock.calls[0];

    await expect(onRejected({})).rejects.toMatchObject({
      message: "An unexpected error occurred.",
      status: 0,
    });
  });

  it("passes a successful response straight through", () => {
    const [onFulfilled] = mockUse.mock.calls[0];
    const response = { data: { data: [] } };

    expect(onFulfilled(response)).toBe(response);
  });

  it("returns the raw response body when unwrapResponse is false", async () => {
    mockGet.mockResolvedValue({ data: { products: [], total: 0 } });

    const result = await apiClient.get("/products", { unwrapResponse: false });

    expect(result).toEqual({ products: [], total: 0 });
  });

  it("unwraps the `data` envelope by default", async () => {
    mockGet.mockResolvedValue({ data: { data: { id: 1 } } });

    const result = await apiClient.get("/products/1");

    expect(result).toEqual({ id: 1 });
  });

  it("forwards query params to the underlying request", async () => {
    mockGet.mockResolvedValue({ data: { data: [] } });

    await apiClient.get("/products", { params: { q: "phone" } });

    expect(mockGet).toHaveBeenCalledWith("/products", {
      params: { q: "phone" },
    });
  });
});
