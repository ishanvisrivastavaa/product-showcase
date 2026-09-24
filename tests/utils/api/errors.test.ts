import { ApiError } from "@/lib/api/errors";

describe("ApiError", () => {
  it("defaults status to 0 when not provided", () => {
    const error = new ApiError("Something broke");

    expect(error.message).toBe("Something broke");
    expect(error.status).toBe(0);
    expect(error.name).toBe("ApiError");
  });

  it("keeps a provided status code", () => {
    const error = new ApiError("Not found", 404);

    expect(error.status).toBe(404);
  });

  it("is an instance of Error", () => {
    expect(new ApiError("x")).toBeInstanceOf(Error);
  });
});
