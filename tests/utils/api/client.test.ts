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

import { apiClient, getErrorMessageByStatus } from "@/lib/api/client";
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

  it("maps status codes to friendly user messages in interceptor", async () => {
    const [, onRejected] = mockUse.mock.calls[0];
    const axios404 = {
      response: { status: 404 },
    };

    await expect(onRejected(axios404)).rejects.toMatchObject({
      message: "The requested resource could not be found.",
      status: 404,
    });
    await expect(onRejected(axios404)).rejects.toBeInstanceOf(ApiError);

    const axios500 = {
      response: { status: 500 },
    };
    await expect(onRejected(axios500)).rejects.toMatchObject({
      message: "A server error occurred. Please try again later.",
      status: 500,
    });
  });

  it("falls back to a generic message and status 0 when status is missing", async () => {
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

  it("returns the raw response body by default", async () => {
    mockGet.mockResolvedValue({ data: { products: [], total: 0 } });

    const result = await apiClient.get("/products");

    expect(result).toEqual({ products: [], total: 0 });
  });

  it("unwraps the `data` envelope when unwrapResponse is true", async () => {
    mockGet.mockResolvedValue({ data: { data: { id: 1 } } });

    const result = await apiClient.get("/products/1", { unwrapResponse: true });

    expect(result).toEqual({ id: 1 });
  });

  it("forwards query params to the underlying request", async () => {
    mockGet.mockResolvedValue({ data: { data: [] } });

    await apiClient.get("/products", { params: { q: "phone" } });

    expect(mockGet).toHaveBeenCalledWith("/products", {
      params: { q: "phone" },
    });
  });

  it("maps known HTTP statuses to descriptive messages", () => {
    expect(getErrorMessageByStatus(400)).toContain("invalid");
    expect(getErrorMessageByStatus(401)).toContain("authorized");
    expect(getErrorMessageByStatus(403)).toContain("forbidden");
    expect(getErrorMessageByStatus(404)).toContain("could not be found");
    expect(getErrorMessageByStatus(429)).toContain("Too many requests");
    expect(getErrorMessageByStatus(500)).toContain("server error");
    expect(getErrorMessageByStatus(0)).toBe("An unexpected error occurred.");
  });
});
